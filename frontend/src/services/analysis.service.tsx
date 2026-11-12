import axios from "axios";
import type { AnalysisResult } from "../types/analysis.types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

export const analyzeCSV = async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<AnalysisResult>(`${API_URL}/analysis/upload`, formData);

    return response.data;
}