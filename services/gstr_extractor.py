import pandas as pd
from pathlib import Path


def parse_gstr2b(file_input) -> pd.DataFrame:
    import pandas as pd
    
    # Handle both file paths and file-like objects
    if hasattr(file_input, 'read'):
        excel_file = pd.ExcelFile(file_input)
    else:
        excel_file = pd.ExcelFile(file_input)
    
    # Find B2B sheet
    b2b_sheet = None
    for sheet in excel_file.sheet_names:
        if "b2b" in sheet.lower():
            b2b_sheet = sheet
            break
    
    if b2b_sheet is None:
        raise Exception("B2B sheet not found")
    
    # Read raw data
    df_raw = pd.read_excel(excel_file, sheet_name=b2b_sheet, header=None)
    
    # Detect header row
    header_row = None
    for i in range(min(15, len(df_raw))):
        row_str = " ".join([str(x).lower() for x in df_raw.iloc[i] if pd.notna(x)])
        has_gstin = any(keyword in row_str for keyword in ["gstin"])
        has_invoice = any(keyword in row_str for keyword in ["invoice"])
        has_taxable = any(keyword in row_str for keyword in ["taxable", "value"])
        
        if has_gstin and has_invoice and has_taxable:
            header_row = i
            break
    
    if header_row is None:
        raise Exception("Header row not found")
    
    # Combine two header rows
    header1 = df_raw.iloc[header_row - 1].astype(str)
    header2 = df_raw.iloc[header_row].astype(str)
    
    combined_columns = []
    
    for h1, h2 in zip(header1, header2):
        h1 = h1.strip().lower()
        h2 = h2.strip().lower()
        
        if h2 and h2 != "nan":
            combined_columns.append(f"{h1} {h2}".strip())
        else:
            combined_columns.append(h1)
    
    df_raw.columns = combined_columns
    
    # Remove header rows
    df = df_raw[header_row + 1:]
    df.reset_index(drop=True, inplace=True)
    
    # Clean column names
    df.columns = (
        pd.Series(df.columns)
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
        .str.lower()
    )
    
    # Production-grade column detection with scoring
    COLUMN_RULES = {
        "gstin": {
            "keywords": ["gstin"],
            "min_score": 1,
            "validator": lambda x: len(str(x).strip()) == 15
        },
        "invoice_no": {
            "keywords": ["invoice number", "invoice no", "invoice"],
            "min_score": 1,
            "validator": lambda x: bool(str(x).strip())
        },
        "invoice_date": {
            "keywords": ["invoice date", "date"],
            "min_score": 1,
            "validator": lambda x: True
        },
        "taxable_value": {
            "keywords": ["taxable value", "taxable", "value"],
            "min_score": 1,
            "validator": lambda x: pd.api.types.is_numeric_dtype(x) or str(x).replace('.', '').isdigit()
        }
    }
    
    TAX_KEYWORDS = {
        "igst": ["igst", "integrated"],
        "cgst": ["cgst", "central"],
        "sgst": ["sgst", "state", "ut"]
    }
    
    # Score columns for required fields
    detected_columns = {}
    for field, rules in COLUMN_RULES.items():
        best_col = None
        best_score = -1
        
        for col in df.columns:
            score = 0
            for keyword in rules["keywords"]:
                if keyword in col:
                    score += 1
            
            if score >= rules["min_score"] and score > best_score:
                best_score = score
                best_col = col
        
        if best_col is None:
            raise Exception(f"Could not detect column for {field}")
        
        detected_columns[field] = best_col
    
    # Validate detected columns
    for field, col in detected_columns.items():
        validator = COLUMN_RULES[field]["validator"]
        sample_data = df[col].dropna().head(10)
        
        if not any(validator(x) for x in sample_data):
            raise Exception(f"Column '{col}' for {field} failed validation")
    
    # Detect tax columns (optional)
    tax_columns = {}
    for tax_type, keywords in TAX_KEYWORDS.items():
        best_col = None
        best_score = -1
        
        for col in df.columns:
            score = 0
            for keyword in keywords:
                if keyword in col:
                    score += 1
            
            if score > best_score:
                best_score = score
                best_col = col
        
        tax_columns[tax_type] = best_col
    
    # Create standardized dataframe
    df_final = pd.DataFrame({
        "gstin": df[detected_columns["gstin"]],
        "invoice_no": df[detected_columns["invoice_no"]],
        "invoice_date": df[detected_columns["invoice_date"]],
        "taxable_value": df[detected_columns["taxable_value"]],
    })
    
    # Handle tax columns (optional)
    for tax_type in ["igst", "cgst", "sgst"]:
        if tax_columns[tax_type] is not None:
            df_final[tax_type] = df[tax_columns[tax_type]]
        else:
            df_final[tax_type] = 0
    
    # Clean numeric values
    for tax_type in ["igst", "cgst", "sgst"]:
        df_final[tax_type] = pd.to_numeric(df_final[tax_type], errors="coerce").fillna(0)
    
    # Drop empty rows
    df_final = df_final.dropna(subset=["gstin", "invoice_no"], how="all")
    
    return df_final


