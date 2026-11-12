export interface NumericStatistics {
    count: number;
    mean: number | null;
    median: number | null;
    std: number | null;
    min: number | null;
    max: number | null;
    q1: number | null;
    q3: number | null;
}

export interface CategoricalStatistics {
    count: number;
    most_common: string | null;
    top_values: {
        value: string;
        count: number;
        percentage: number;
    }[];
}

export interface ColumnAnalysis {
    name: string;
    data_type: string;
    non_null: number;
    missing: number;
    missing_percentage: number;
    unique_values: number;
    column_type: "numeric" | "categorical";
    statistics: NumericStatistics | CategoricalStatistics;
}

export interface AnalysisResult {
    filename: string;
    overview: {
        total_rows: number;
        total_columns: number;
        duplicate_rows: number;
        total_missing_values: number;
    };
    data_quality: {
        score: number;
        rating: string;
        completeness: number;
        uniqueness: number;
        missing_percentage: number;
        duplicate_percentage: number;
    };
    columns: ColumnAnalysis[];
    preview: Record<string, string>[];
}