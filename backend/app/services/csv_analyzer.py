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

        is_numeric = pd.api.types.is_numeric_dtype(series)

        statistics = (
            analyze_numeric_column(series)
            if is_numeric
            else analyzee_categorical_column(series)
        )

        columns.append({
            "name": str(column),
            "data_type": str(series.dtype),
            "non_null": int(series.count()),
            "missing": int(series.isnull().sum()),
            "missing_percentage": round(
                float(series.isnull().mean() * 100), 2
            ),
            "unique_values": int(series.nunique()),
            "column_type": "numeric" if is_numeric else "categorical",
            "statistics": statistics
        })

    preview = df.head(10).fillna("").astype(str).to_dict(orient = "records")

    return {
        "filename": None,
        "overview": {
            "total_rows": total_rows,
            "total_columns": total_columns,
            "duplicate_rows": duplicate_rows,
            "total_missing_values": int(missing_values.sum()),
        },
        "columns": columns,
        "preview": preview
    }


def analyze_numeric_column(series: pd.Series):
    values = series.dropna()

    if values.empty:
        return {
            "count": 0,
            "mean": None,
            "median": None,
            "std": None,
            "min": None,
            "max": None,
            "q1": None,
            "q3": None,
        }

    return {
        "count": int(values.count()),
        "mean": round(float(values.mean()), 2),
        "median": round(float(values.median()), 2),
        "std": round(float(values.std()), 2) if len(values) > 1 else 0,
        "min": float(values.min()),
        "max": float(values.max()),
        "q1": round(float(values.quantile(0.25)), 2),
        "q3": round(float(values.quantile(0.75)), 2),
    }

def analyzee_categorical_column(series: pd.Series):
    values = series.dropna()
    frequencies = values.value_counts().head(5)

    return {
        "count": int(values.count()),
        "most_common": str(frequencies.index[0]) if not frequencies.empty else None,
        "top_values": [
            {
                "value": str(value),
                "count": int(count),
                "percentage": round(float(count / len(values) * 100), 2),
            }
            for value, count in frequencies.items()
        ],
    }

