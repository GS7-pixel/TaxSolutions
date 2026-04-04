"""
Reconciliation services.

Implements the reconciliation logic between different sources (e.g., Purchase
Register vs GSTR-2B) and produces match/mismatch outputs.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
try:
    from rapidfuzz import fuzz, process
except ImportError:  # optional dependency for fuzzy supplier matching
    fuzz = None
    process = None


@dataclass(frozen=True)
class ReconciliationResult:
    """
    Output of the reconciliation step.

    Includes GSTIN-level summary and invoice-level reconciliation output.
    """

    summary_df: pd.DataFrame
    detailed_reco_df: pd.DataFrame
    summary_stats: dict[str, int]


@dataclass(frozen=True)
class ReconciliationConfig:
    """
    Config flags for optional reconciliation behaviors.
    """

    tolerance_amount: float = 0.0
    enable_fuzzy_supplier_match: bool = False
    fuzzy_supplier_threshold: float = 85.0


def reconcile(
    purchase_df: pd.DataFrame,
    gstr_df: pd.DataFrame,
    config: ReconciliationConfig | None = None,
) -> ReconciliationResult:
    """
    Reconcile purchase register data with GSTR-2B data.

    Args:
        purchase_df: Purchase/books DataFrame with normalized columns.
        gstr_df: GSTR-2B DataFrame with normalized columns.

    Returns:
        ReconciliationResult containing:
        - summary_df: GSTIN-level totals and differences
        - detailed_reco_df: Invoice-level status for mismatch GSTINs
    """
    reco_config = config or ReconciliationConfig()

    # Optimization: one-time vectorized standardization + invoice aggregation.
    # This reduces row volume early and keeps downstream merges fast.
    purchase = _prepare_for_reco(purchase_df)
    gstr = _prepare_for_reco(gstr_df)

    # 1) GSTIN summary totals.
    purchase_totals = _group_tax_totals_by_gstin(purchase).rename(
        columns={
            "taxable_value": "purchase_taxable_value",
            "cgst": "purchase_cgst",
            "sgst": "purchase_sgst",
            "igst": "purchase_igst",
        }
    )
    gstr_totals = _group_tax_totals_by_gstin(gstr).rename(
        columns={
            "taxable_value": "gstr_taxable_value",
            "cgst": "gstr_cgst",
            "sgst": "gstr_sgst",
            "igst": "gstr_igst",
        }
    )

    # Optimization: single outer merge at GSTIN grain avoids expensive per-GSTIN loops.
    summary_df = purchase_totals.merge(gstr_totals, how="outer", on="gstin", sort=False).fillna(0.0)
    summary_df["diff_taxable_value"] = summary_df["purchase_taxable_value"] - summary_df["gstr_taxable_value"]
    summary_df["diff_cgst"] = summary_df["purchase_cgst"] - summary_df["gstr_cgst"]
    summary_df["diff_sgst"] = summary_df["purchase_sgst"] - summary_df["gstr_sgst"]
    summary_df["diff_igst"] = summary_df["purchase_igst"] - summary_df["gstr_igst"]
    summary_df["diff_total"] = (
        summary_df["diff_cgst"] + summary_df["diff_sgst"] + summary_df["diff_igst"]
    )

    # 2) Invoice-level reconciliation only for GSTINs with any difference.
    mismatch_mask = (
        (summary_df["diff_taxable_value"] != 0)
        | (summary_df["diff_cgst"] != 0)
        | (summary_df["diff_sgst"] != 0)
        | (summary_df["diff_igst"] != 0)
    )
    mismatch_gstins = summary_df.loc[
        mismatch_mask,
        "gstin",
    ]

    # Optimization: restrict invoice-level merge to mismatch GSTINs only.
    # For large datasets this significantly reduces join size and memory.
    purchase_mismatch = purchase[purchase["gstin"].isin(mismatch_gstins)]
    gstr_mismatch = gstr[gstr["gstin"].isin(mismatch_gstins)]

    detailed_reco_df = _invoice_level_reco(
        purchase_mismatch,
        gstr_mismatch,
        tolerance_amount=reco_config.tolerance_amount,
        enable_fuzzy_supplier_match=reco_config.enable_fuzzy_supplier_match,
        fuzzy_supplier_threshold=reco_config.fuzzy_supplier_threshold,
    )
    summary_stats = _build_summary_stats(detailed_reco_df)
    return ReconciliationResult(
        summary_df=summary_df,
        detailed_reco_df=detailed_reco_df,
        summary_stats=summary_stats,
    )


def _prepare_for_reco(df: pd.DataFrame) -> pd.DataFrame:
    """
    Standardize critical reconciliation columns and aggregate duplicate invoices.
    """
    required_cols = ["gstin", "invoice_no", "supplier_name", "invoice_date", "taxable_value", "cgst", "sgst", "igst"]
    # Copy only required columns after we ensure presence; this limits memory churn.
    out = df.copy()

    for col in required_cols:
        if col not in out.columns:
            out[col] = pd.NA

    out = out.loc[:, required_cols]

    out["gstin"] = out["gstin"].astype("string").str.strip().str.upper()
    out["invoice_no"] = out["invoice_no"].astype("string").str.strip()
    out["supplier_name"] = out["supplier_name"].astype("string").str.strip()
    out = out.dropna(subset=["gstin", "invoice_no"], how="any")
    out = out[(out["gstin"] != "") & (out["invoice_no"] != "")]

    # Vectorized numeric coercion for all tax and value columns together.
    numeric_cols = ["taxable_value", "cgst", "sgst", "igst"]
    out[numeric_cols] = out[numeric_cols].apply(pd.to_numeric, errors="coerce").fillna(0.0)
    out[numeric_cols] = out[numeric_cols].astype("float64")

    # Optimization: aggregate duplicate invoice keys up front.
    # This keeps the final outer merge close to unique-key cardinality.
    return (
        out.groupby(["gstin", "invoice_no"], as_index=False, sort=False).agg(
            supplier_name=("supplier_name", "first"),
            invoice_date=("invoice_date", "first"),
            taxable_value=("taxable_value", "sum"),
            cgst=("cgst", "sum"),
            sgst=("sgst", "sum"),
            igst=("igst", "sum"),
        )
        .reset_index(drop=True)
    )


def _group_tax_totals_by_gstin(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute total taxable value and CGST/SGST/IGST per GSTIN.
    """
    return (
        df.groupby("gstin", as_index=False, sort=False)[["taxable_value", "cgst", "sgst", "igst"]]
        .sum()
        .reset_index(drop=True)
    )


def _invoice_level_reco(
    purchase_df: pd.DataFrame,
    gstr_df: pd.DataFrame,
    *,
    tolerance_amount: float = 0.0,
    enable_fuzzy_supplier_match: bool = False,
    fuzzy_supplier_threshold: float = 85.0,
) -> pd.DataFrame:
    """
    Perform invoice-level reconciliation using GSTIN + invoice_no.
    """
    # Core optimization: a single outer merge + indicator gives all 3 cases:
    # left_only, right_only, both. No nested loops required.
    merged = purchase_df.merge(
        gstr_df,
        on=["gstin", "invoice_no"],
        how="outer",
        suffixes=("_purchase", "_gstr"),
        indicator=True,
        sort=False,
    )

    # Vectorized numeric normalization.
    purchase_cols = ["taxable_value_purchase", "cgst_purchase", "sgst_purchase", "igst_purchase"]
    gstr_cols = ["taxable_value_gstr", "cgst_gstr", "sgst_gstr", "igst_gstr"]
    merged[purchase_cols] = (
        merged[purchase_cols].apply(pd.to_numeric, errors="coerce").fillna(0.0).astype("float64")
    )
    merged[gstr_cols] = (
        merged[gstr_cols].apply(pd.to_numeric, errors="coerce").fillna(0.0).astype("float64")
    )

    # Vectorized diff computation using NumPy arrays (fast for 20k+ rows).
    purchase_arr = merged[purchase_cols].to_numpy()
    gstr_arr = merged[gstr_cols].to_numpy()
    diff_arr = purchase_arr - gstr_arr
    merged[["diff_taxable_value", "diff_cgst", "diff_sgst", "diff_igst"]] = diff_arr

    # isclose handles floating representation noise while remaining vectorized.
    tol = max(float(tolerance_amount), 0.0)
    same_tax_mask = np.isclose(diff_arr, 0.0, atol=tol).all(axis=1)

    merged["status"] = "AMOUNT MISMATCH"
    merged.loc[merged["_merge"] == "left_only", "status"] = "NOT IN 2B"
    merged.loc[merged["_merge"] == "right_only", "status"] = "NOT IN BOOKS"
    merged.loc[(merged["_merge"] == "both") & same_tax_mask, "status"] = "MATCHED"
    merged["match_method"] = "EXACT_INVOICE"

    if enable_fuzzy_supplier_match:
        merged = _apply_fuzzy_supplier_matching(
            merged,
            tolerance_amount=tolerance_amount,
            fuzzy_supplier_threshold=fuzzy_supplier_threshold,
        )

    # Keep reconciliation output concise and analysis-friendly.
    return merged[
        [
            "gstin",
            "invoice_no",
            "invoice_date_purchase",
            "invoice_date_gstr",
            "supplier_name_purchase",
            "supplier_name_gstr",
            "taxable_value_purchase",
            "taxable_value_gstr",
            "cgst_purchase",
            "sgst_purchase",
            "igst_purchase",
            "cgst_gstr",
            "sgst_gstr",
            "igst_gstr",
            "diff_taxable_value",
            "diff_cgst",
            "diff_sgst",
            "diff_igst",
            "match_method",
            "status",
        ]
    ].sort_values(["gstin", "invoice_no"], kind="stable").reset_index(drop=True)


def _apply_fuzzy_supplier_matching(
    merged: pd.DataFrame,
    *,
    tolerance_amount: float,
    fuzzy_supplier_threshold: float,
) -> pd.DataFrame:
    """
    Optionally reclassify left_only/right_only rows by fuzzy supplier similarity.

    This is intentionally scoped to unmatched rows only, so the heavy path runs
    on a much smaller subset than the full dataframe.
    """
    out = merged.copy()
    if process is None or fuzz is None:
        raise ValueError(
            "rapidfuzz is required for fuzzy supplier matching. Install it via `pip install rapidfuzz`."
        )
    left = out[out["_merge"] == "left_only"].copy()
    right = out[out["_merge"] == "right_only"].copy()
    if left.empty or right.empty:
        return out

    left["supplier_name_purchase"] = left["supplier_name_purchase"].fillna("").astype(str)
    right["supplier_name_gstr"] = right["supplier_name_gstr"].fillna("").astype(str)

    right_by_gstin: dict[str, pd.DataFrame] = {
        gstin: grp.copy() for gstin, grp in right.groupby("gstin", sort=False)
    }

    used_right_indices: set[int] = set()
    for left_idx, left_row in left.iterrows():
        gstin = left_row["gstin"]
        right_grp = right_by_gstin.get(gstin)
        if right_grp is None or right_grp.empty:
            continue

        available = right_grp[~right_grp.index.isin(used_right_indices)]
        if available.empty:
            continue

        query_name = str(left_row["supplier_name_purchase"]).strip()
        if not query_name:
            continue

        match = process.extractOne(
            query_name,
            available["supplier_name_gstr"],
            scorer=fuzz.token_sort_ratio,
            score_cutoff=fuzzy_supplier_threshold,
        )
        if match is None:
            continue

        _, _, matched_pos = match
        right_idx = int(available.index[matched_pos])

        # Optional tolerance: compare total tax impact across the fuzzy pair.
        purchase_total = (
            float(left_row["taxable_value_purchase"])
            + float(left_row["cgst_purchase"])
            + float(left_row["sgst_purchase"])
            + float(left_row["igst_purchase"])
        )
        gstr_total = (
            float(out.at[right_idx, "taxable_value_gstr"])
            + float(out.at[right_idx, "cgst_gstr"])
            + float(out.at[right_idx, "sgst_gstr"])
            + float(out.at[right_idx, "igst_gstr"])
        )
        within_tolerance = abs(purchase_total - gstr_total) <= float(tolerance_amount)

        if within_tolerance:
            out.at[left_idx, "status"] = "MATCHED"
            out.at[right_idx, "status"] = "MATCHED"
        else:
            out.at[left_idx, "status"] = "AMOUNT MISMATCH"
            out.at[right_idx, "status"] = "AMOUNT MISMATCH"

        out.at[left_idx, "match_method"] = "FUZZY_SUPPLIER"
        out.at[right_idx, "match_method"] = "FUZZY_SUPPLIER"
        used_right_indices.add(right_idx)

    return out


def _build_summary_stats(detailed_reco_df: pd.DataFrame) -> dict[str, int]:
    """
    Build compact reconciliation totals for reporting widgets/headers.
    """
    status = detailed_reco_df.get("status", pd.Series(dtype="string"))
    total_matched = int((status == "MATCHED").sum())
    total_mismatched = int((status == "AMOUNT MISMATCH").sum())
    total_missing = int(((status == "NOT IN 2B") | (status == "NOT IN BOOKS")).sum())
    return {
        "total_matched": total_matched,
        "total_mismatched": total_mismatched,
        "total_missing": total_missing,
    }


def reconcile_gst() -> None:
    """
    High-level reconciliation orchestration.

    Intended to be called by `main.py`. This will later:
    - Read input files
    - Extract return tables
    - Normalize datasets
    - Reconcile
    - Write output workbook
    """
    # Placeholder: orchestrate the pipeline once I/O details are defined.
    return None

