"""
Normalization services.

Converts extracted DataFrames into a consistent schema: standardized column
names, normalized datatypes (dates, GSTIN, invoice numbers), and cleaned values.
"""

from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from utils.column_mapper import ColumnMapper, STANDARD_COLUMNS


@dataclass(frozen=True)
class NormalizationConfig:
    """
    Configuration for normalization behavior.

    This will later hold date formats, rounding rules, and required columns.
    """

    mapper: ColumnMapper

    @staticmethod
    def default() -> "NormalizationConfig":
        """
        Return default normalization config with common GST column mappings.
        """
        return NormalizationConfig(mapper=ColumnMapper.default())


def normalize(df: pd.DataFrame, config: NormalizationConfig) -> pd.DataFrame:
    """
    Normalize a DataFrame to the project's standard schema.

    Args:
        df: Input DataFrame (typically extracted from a source file).
        config: NormalizationConfig controlling mapping/cleaning rules.

    Returns:
        Normalized DataFrame suitable for reconciliation.
    """
    mapped = config.mapper.apply(df)

    # Ensure all standardized columns exist, even if missing from source.
    for col in STANDARD_COLUMNS:
        if col not in mapped.columns:
            mapped[col] = pd.NA

    out = mapped.loc[:, list(STANDARD_COLUMNS)].copy()

    # Trim whitespace for all text/object columns.
    for col in out.columns:
        if out[col].dtype == "object":
            out[col] = out[col].map(_safe_strip)

    # Explicit text normalization for key identifiers.
    out["gstin"] = out["gstin"].map(_safe_upper)
    out["invoice_no"] = out["invoice_no"].map(_safe_strip)
    out["supplier_name"] = out["supplier_name"].map(_safe_strip)

    # Convert tax columns to float safely.
    for col in ("cgst", "sgst", "igst"):
        out[col] = pd.to_numeric(out[col], errors="coerce").astype("float64")

    return out


def _safe_strip(value: object) -> object:
    """
    Strip surrounding whitespace while preserving missing values.
    """
    if value is None or pd.isna(value):
        return pd.NA
    return str(value).strip()


def _safe_upper(value: object) -> object:
    """
    Uppercase text while preserving missing values.
    """
    if value is None or pd.isna(value):
        return pd.NA
    return str(value).strip().upper()

