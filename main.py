"""
GST Reconciliation Tool - Entry Point.

This module is the CLI/application entry point. It orchestrates high-level flow:
read input files, extract relevant GST return data, normalize columns, reconcile,
and write an output Excel workbook.
"""

from __future__ import annotations

import argparse
import tempfile
from pathlib import Path
from io import BytesIO

import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse

from services.excel_writer import ExcelWriteOptions, write_reconciliation_output
from services.file_reader import read_excel_sheets
from services.gstr_extractor import parse_gstr2b
from services.normalizer import NormalizationConfig, normalize
from services.reconciler import ReconciliationConfig, reconcile


app = FastAPI(title="GST Reconciliation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _parse_args() -> argparse.Namespace:
    """
    Parse command-line arguments for the reconciliation run.
    """
    parser = argparse.ArgumentParser(description="GST reconciliation tool")
    parser.add_argument("--purchase", required=True, help="Path to purchase register file (.xlsx)")
    parser.add_argument("--gstr2b", required=True, help="Path to GSTR-2B file (.xlsx)")
    parser.add_argument(
        "--output",
        default="output/gst_reconciliation_output.xlsx",
        help="Output Excel path",
    )
    parser.add_argument(
        "--tolerance",
        type=float,
        default=0.0,
        help="Optional tax amount tolerance for matching (default: 0.0)",
    )
    parser.add_argument(
        "--enable-fuzzy-supplier-match",
        action="store_true",
        help="Enable fuzzy supplier-name matching on unmatched rows",
    )
    parser.add_argument(
        "--fuzzy-threshold",
        type=float,
        default=85.0,
        help="Fuzzy supplier similarity threshold (0-100, default: 85)",
    )
    return parser.parse_args()


def _load_purchase_dataframe(path: str | Path) -> pd.DataFrame:
    """
    Load purchase data from the first non-empty sheet of an Excel workbook.
    """
    sheets = read_excel_sheets(path, sheet_names=None)
    if not sheets:
        raise ValueError("Purchase workbook has no sheets.")

    for sheet_name, df in sheets.items():
        if not df.empty:
            print(f"[INFO] Using purchase sheet: {sheet_name}")
            return df.copy()

    raise ValueError("Purchase workbook has no non-empty sheets.")


def run_reconciliation(
    purchase_path: Path,
    gstr2b_path: Path,
    output_path: Path,
    *,
    tolerance: float = 0.0,
    enable_fuzzy_supplier_match: bool = False,
    fuzzy_threshold: float = 85.0,
) -> dict:
    """
    Execute reconciliation and return summary data for API/CLI callers.
    """
    print("[INFO] Step 1/6: Reading input files")
    purchase_raw_df = _load_purchase_dataframe(purchase_path)

    print("[INFO] Step 2/6: Extracting GSTR-2B B2B data")
    gstr_b2b_raw_df = parse_gstr2b(gstr2b_path)

    print("[INFO] Step 3/6: Normalizing datasets")
    norm_config = NormalizationConfig.default()
    purchase_cleaned_df = normalize(purchase_raw_df, norm_config)
    gstr_b2b_cleaned_df = normalize(gstr_b2b_raw_df, norm_config)

    print("[INFO] Step 4/6: Running reconciliation")
    reco_config = ReconciliationConfig(
        tolerance_amount=max(tolerance, 0.0),
        enable_fuzzy_supplier_match=enable_fuzzy_supplier_match,
        fuzzy_supplier_threshold=fuzzy_threshold,
    )
    result = reconcile(purchase_cleaned_df, gstr_b2b_cleaned_df, config=reco_config)
    print(
        "[INFO] Summary Stats: "
        f"matched={result.summary_stats['total_matched']}, "
        f"mismatched={result.summary_stats['total_mismatched']}, "
        f"missing={result.summary_stats['total_missing']}"
    )

    print("[INFO] Step 5/6: Generating Excel output")
    write_reconciliation_output(
        purchase_cleaned_df=purchase_cleaned_df,
        gstr_b2b_cleaned_df=gstr_b2b_cleaned_df,
        summary_df=result.summary_df,
        detailed_reco_df=result.detailed_reco_df,
        options=ExcelWriteOptions(output_path=output_path),
    )

    print(f"[INFO] Step 6/6: Completed successfully. Output: {output_path}")
    return {
        "total_gstin": int(len(result.summary_df)),
        "total_matched": int(result.summary_stats["total_matched"]),
        "total_mismatched": int(result.summary_stats["total_mismatched"]),
        "missing_in_2b": int(result.summary_stats["total_missing"]),
        "missing_in_books": 0,
        "output_path": str(output_path),
    }


def run_reconciliation_from_memory(
    purchase_file_obj: BytesIO,
    gstr2b_file_obj: BytesIO,
    output_path: Path,
    *,
    tolerance: float = 0.0,
    enable_fuzzy_supplier_match: bool = False,
    fuzzy_threshold: float = 85.0,
) -> dict:
    """
    Execute reconciliation using in-memory file objects.
    """
    print("[INFO] Step 1/6: Reading input files from memory")
    purchase_raw_df = pd.read_excel(purchase_file_obj)
    print(f"[DEBUG] Purchase raw columns: {list(purchase_raw_df.columns)}")
    print(f"[DEBUG] Purchase raw shape: {purchase_raw_df.shape}")
    print(f"[DEBUG] Purchase first 5 rows:\n{purchase_raw_df.head()}")

    print("[INFO] Step 2/6: Extracting GSTR-2B B2B data")
    gstr_b2b_raw_df = parse_gstr2b(gstr2b_file_obj)
    print(f"[DEBUG] GSTR-2B raw columns: {list(gstr_b2b_raw_df.columns)}")
    print(f"[DEBUG] GSTR-2B raw shape: {gstr_b2b_raw_df.shape}")
    print(f"[DEBUG] GSTR-2B first 5 rows:\n{gstr_b2b_raw_df.head()}")

    print("[INFO] Step 3/6: Normalizing datasets")
    norm_config = NormalizationConfig.default()
    purchase_cleaned_df = normalize(purchase_raw_df, norm_config)
    print(f"[DEBUG] Purchase normalized columns: {list(purchase_cleaned_df.columns)}")
    print(f"[DEBUG] Purchase normalized shape: {purchase_cleaned_df.shape}")
    print(f"[DEBUG] Purchase normalized first 5 rows:\n{purchase_cleaned_df.head()}")
    
    gstr_b2b_cleaned_df = normalize(gstr_b2b_raw_df, norm_config)
    print(f"[DEBUG] GSTR-2B normalized columns: {list(gstr_b2b_cleaned_df.columns)}")
    print(f"[DEBUG] GSTR-2B normalized shape: {gstr_b2b_cleaned_df.shape}")
    print(f"[DEBUG] GSTR-2B normalized first 5 rows:\n{gstr_b2b_cleaned_df.head()}")

    print("[INFO] Step 4/6: Running reconciliation")
    reco_config = ReconciliationConfig(
        tolerance_amount=max(tolerance, 0.0),
        enable_fuzzy_supplier_match=enable_fuzzy_supplier_match,
        fuzzy_supplier_threshold=fuzzy_threshold,
    )
    result = reconcile(purchase_cleaned_df, gstr_b2b_cleaned_df, config=reco_config)
    print(
        "[INFO] Summary Stats: "
        f"matched={result.summary_stats['total_matched']}, "
        f"mismatched={result.summary_stats['total_mismatched']}, "
        f"missing={result.summary_stats['total_missing']}"
    )

    print("[INFO] Step 5/6: Generating Excel output")
    write_reconciliation_output(
        purchase_cleaned_df=purchase_cleaned_df,
        gstr_b2b_cleaned_df=gstr_b2b_cleaned_df,
        summary_df=result.summary_df,
        detailed_reco_df=result.detailed_reco_df,
        options=ExcelWriteOptions(output_path=output_path),
    )

    print(f"[INFO] Step 6/6: Completed successfully. Output: {output_path}")
    return {
        "total_gstin": int(len(result.summary_df)),
        "total_matched": int(result.summary_stats["total_matched"]),
        "total_mismatched": int(result.summary_stats["total_mismatched"]),
        "missing_in_2b": int(result.summary_stats["total_missing"]),
        "missing_in_books": 0,
        "output_path": str(output_path),
    }


async def read_excel_safe(upload_file: UploadFile):
    contents = await upload_file.read()
    file_like = BytesIO(contents)
    return file_like


@app.post("/generate-reco")
async def generate_reco(
    purchase_file: UploadFile = File(...),
    gstr2b_file: UploadFile = File(...),
):
    """
    FastAPI endpoint to receive uploaded files and run reconciliation.
    """
    print(
        f"[API] Received purchase_file={purchase_file.filename}, "
        f"gstr2b_file={gstr2b_file.filename}"
    )
    try:
        purchase_file_obj = await read_excel_safe(purchase_file)
        gstr2b_file_obj = await read_excel_safe(gstr2b_file)
        
        print(
            f"[API] File sizes -> purchase={purchase_file_obj.getbuffer().nbytes} bytes, "
            f"gstr2b={gstr2b_file_obj.getbuffer().nbytes} bytes"
        )

        if purchase_file_obj.getbuffer().nbytes == 0 or gstr2b_file_obj.getbuffer().nbytes == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "Uploaded files are empty."},
            )

        # Create persistent output directory
        output_dir = Path("outputs")
        output_dir.mkdir(exist_ok=True)
        output_path = output_dir / f"reconciliation_{purchase_file.filename}_{gstr2b_file.filename}.xlsx"

        summary = run_reconciliation_from_memory(
            purchase_file_obj=purchase_file_obj,
            gstr2b_file_obj=gstr2b_file_obj,
            output_path=output_path,
        )

        return {"success": True, "summary": summary, "download_path": str(output_path)}
    except Exception as exc:
        print(f"[API][ERROR] {exc}")
        return JSONResponse(status_code=500, content={"error": str(exc)})


@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download generated reconciliation file.
    """
    try:
        file_path = Path("outputs") / filename
        if not file_path.exists():
            return JSONResponse(status_code=404, content={"error": "File not found"})
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as exc:
        print(f"[API][ERROR] Download failed: {exc}")
        return JSONResponse(status_code=500, content={"error": str(exc)})


def main() -> int:
    """
    Run the GST reconciliation flow end-to-end.
    """
    args = _parse_args()
    purchase_path = Path(args.purchase)
    gstr2b_path = Path(args.gstr2b)
    output_path = Path(args.output)

    try:
        run_reconciliation(
            purchase_path=purchase_path,
            gstr2b_path=gstr2b_path,
            output_path=output_path,
            tolerance=args.tolerance,
            enable_fuzzy_supplier_match=args.enable_fuzzy_supplier_match,
            fuzzy_threshold=args.fuzzy_threshold,
        )
        return 0
    except FileNotFoundError as exc:
        print(f"[ERROR] File not found: {exc}")
        return 1
    except ValueError as exc:
        print(f"[ERROR] Data/format issue: {exc}")
        return 1
    except Exception as exc:  # broad catch for user-friendly CLI behavior
        print(f"[ERROR] Unexpected failure: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

