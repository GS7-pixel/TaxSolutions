"""
Column mapping utilities.

Provides a small abstraction for mapping source-specific column names to the
project's canonical column names.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

import pandas as pd


STANDARD_COLUMNS: tuple[str, ...] = (
    "gstin",
    "invoice_no",
    "supplier_name",
    "invoice_date",
    "taxable_value",
    "cgst",
    "sgst",
    "igst",
)


def _normalize_header(value: object) -> str:
    text = str(value).strip().lower().replace("\n", " ")
    return " ".join(text.split())


@dataclass(frozen=True)
class ColumnMapper:
    """
    Maps input DataFrame columns to canonical names.

    The mapper supports flexible source headers by matching case-insensitive
    aliases to one of the standard output columns:
    gstin, invoice_no, supplier_name, cgst, sgst, igst
    """

    mapping: Mapping[str, str]

    @staticmethod
    def default() -> "ColumnMapper":
        """
        Return a mapper configured with common GST header variations.
        """
        return ColumnMapper(
            mapping={
                # GSTIN
                "gstin": "gstin",
                "gstin/uin": "gstin",
                "gstin of supplier": "gstin",
                "supplier gstin": "gstin",
                "gstin/uinsupplier": "gstin",
                "gstin/uin of supplier": "gstin",
                "gstin of supplier/recipient": "gstin",
                "gstin/uin of supplier (supplier gstin)": "gstin",
                # Invoice number
                "invoice number": "invoice_no",
                "invoice no": "invoice_no",
                "invoice no.": "invoice_no",
                "inv no": "invoice_no",
                "inv no.": "invoice_no",
                "supplier invoice number": "invoice_no",
                "supplier invoice no": "invoice_no",
                "invoice": "invoice_no",
                "invoice_no": "invoice_no",  # Already normalized
                # Supplier name
                "supplier name": "supplier_name",
                "name of supplier": "supplier_name",
                "trade/ legal name": "supplier_name",
                "trade/legal name": "supplier_name",
                "trade name": "supplier_name",
                "legal name": "supplier_name",
                "supplier": "supplier_name",
                "party name": "supplier_name",
                "party": "supplier_name",
                "customer name": "supplier_name",
                "vendor name": "supplier_name",
                "supplier_name": "supplier_name",  # Already normalized
                # Tax columns
                "cgst": "cgst",
                "central tax": "cgst",
                "sgst": "sgst",
                "state tax": "sgst",
                "state/ut tax": "sgst",
                "utgst": "sgst",
                "utgst/sgst": "sgst",
                "sgst/utgst": "sgst",
                "igst": "igst",
                "integrated tax": "igst",
                # Taxable value
                "taxable value": "taxable_value",
                "taxable": "taxable_value",
                "value": "taxable_value",
                "taxable_value": "taxable_value",  # Already normalized
                # Invoice date
                "invoice date": "invoice_date",
                "date": "invoice_date",
                "invoice_date": "invoice_date",  # Already normalized
            }
        )

    def apply(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Return a copy of `df` with columns renamed to canonical names.

        Matching is done using normalized headers (case-insensitive and
        whitespace-tolerant). Unmatched columns are left as-is.
        """
        normalized_map = {_normalize_header(k): v for k, v in self.mapping.items()}
        rename_map: dict[str, str] = {}

        for col in df.columns:
            normalized_col = _normalize_header(col)
            target = normalized_map.get(normalized_col)
            if target:
                rename_map[str(col)] = target

        return df.rename(columns=rename_map).copy()


