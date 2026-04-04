"""
File reading services.

Provides thin wrappers around pandas/openpyxl to read Excel/CSV inputs in a
consistent way (sheet selection, dtype handling, header detection, etc.).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Optional
import zipfile

import pandas as pd


@dataclass(frozen=True)
class ReadOptions:
    """
    Options controlling how input files are read.

    This will later hold flags like header row index, sheet name, engine, etc.
    """

    sheet_name: Optional[str] = None


def read_excel_sheets(
    path: str | Path,
    *,
    sheet_names: str | list[str] | None = None,
) -> dict[str, pd.DataFrame]:
    """
    Read an Excel file and return one or more sheets as DataFrames.

    Args:
        path: Path to the Excel file.
        sheet_names: Which sheet(s) to read.
            - None: read all sheets
            - str: read a single sheet by name
            - list[str]: read multiple sheets by name

    Returns:
        Dict mapping sheet name -> DataFrame.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file is not a valid/unsupported Excel file.
    """
    file_path = Path(path)
    if not file_path.exists():
        raise FileNotFoundError(f"Excel file not found: {file_path}")

    try:
        result = pd.read_excel(file_path, sheet_name=sheet_names, engine="openpyxl")
    except FileNotFoundError:
        # Re-raise with a consistent message (handles rare race conditions too).
        raise FileNotFoundError(f"Excel file not found: {file_path}") from None
    except (zipfile.BadZipFile, ValueError) as exc:
        raise ValueError(
            "Invalid or unsupported Excel file format. "
            "Expected a valid .xlsx workbook readable by openpyxl."
        ) from exc
    except Exception as exc:
        # Keep callers insulated from pandas/openpyxl internal exception types.
        raise ValueError("Failed to read Excel file.") from exc

    if isinstance(result, pd.DataFrame):
        # pandas returns a DataFrame when a single sheet is selected
        name = sheet_names if isinstance(sheet_names, str) else "Sheet1"
        return {str(name): result}

    return {str(k): v for k, v in result.items()}


def read_excel(path: str | Path, *, options: ReadOptions | None = None) -> pd.DataFrame:
    """
    Read an Excel file into a single DataFrame.

    This is a convenience wrapper when you only need one sheet.

    Args:
        path: Path to the Excel file.
        options: Optional reading options (e.g., sheet name).

    Returns:
        A pandas DataFrame with the raw contents.
    """
    _options = options or ReadOptions()
    sheets = read_excel_sheets(path, sheet_names=_options.sheet_name)
    return next(iter(sheets.values()))


def read_csv(path: str | Path) -> pd.DataFrame:
    """
    Read a CSV file into a DataFrame.

    Args:
        path: Path to the CSV file.

    Returns:
        A pandas DataFrame with the raw contents.
    """
    return pd.read_csv(Path(path))




