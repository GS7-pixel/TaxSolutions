"""
Project constants.

Central place for shared constant values like canonical column names,
default sheet names, and reconciliation key fields.
"""

from __future__ import annotations


# Canonical column names (placeholders; update once schema is finalized)
COL_GSTIN: str = "gstin"
COL_INVOICE_NO: str = "invoice_no"
COL_INVOICE_DATE: str = "invoice_date"
COL_TAXABLE_VALUE: str = "taxable_value"
COL_IGST: str = "igst"
COL_CGST: str = "cgst"
COL_SGST: str = "sgst"


# Default output sheet names (placeholders)
SHEET_MATCHED: str = "Matched"
SHEET_UNMATCHED_LEFT: str = "Unmatched_Left"
SHEET_UNMATCHED_RIGHT: str = "Unmatched_Right"

