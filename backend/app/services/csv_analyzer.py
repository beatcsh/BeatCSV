import pandas as pd
from io import BytesIO

def analyze_csv(file_content: bytes):

    df = pd.read_csv(BytesIO(file_content))

    total_rows, total_columns = df.shape

    missing_values = df.isnull().sum()
    duplicate_rows = int(df.duplicated().sum())

    columns = []

    for column in df.columns:
        series = df[column]

        columns.append({
            "name": str(column),
            "data_type": str(series.dtype),
            "non_null": int(series.count()),
            "missing": int(series.isnull().sum()),
            "missing_percentage": round(
                float(series.isnull().mean() * 100), 2
            ),
            "unique_values": int(series.nunique()),
        })

    return {
        "filename": None,
        "overview": {
            "total_rows": total_rows,
            "total_columns": total_columns,
            "duplicate_rows": duplicate_rows,
            "total_missing_values": int(missing_values.sum()),
        },
        "columns": columns,
    }