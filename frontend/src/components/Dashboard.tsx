import { useState } from "react";
import { Database, Rows3, Columns3, Copy, Activity } from "lucide-react";
import { analyzeCSV } from "../services/analysis.service";
import type { AnalysisResult } from "../types/analysis.types";
import FileUpload from "./FileUpload";
import '../index.css';

const Dashboard = () => {
    const [data, setData] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (file: File) => {
        setLoading(true);
        setError("");

        try {
            const result = await analyzeCSV(file);

            console.log("API Response: ", result)

            setData(result);
        } catch {
            setError("Unable to analyze this file. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    const metrics = [
        {
            label: "Total Rows",
            value: data?.overview.total_rows ?? 0,
            icon: Rows3,
        },
        {
            label: "Total Columns",
            value: data?.overview.total_columns ?? 0,
            icon: Columns3,
        },
        {
            label: "Missing Values",
            value: data?.overview.total_missing_values ?? 0,
            icon: Database,
        },
        {
            label: "Duplicate Rows",
            value: data?.overview.duplicate_rows ?? 0,
            icon: Copy,
        },
    ];

    return (
        <main className="min-h-screen bg-[#090d16] p-6 text-slate-200 md:p-10">
            <div className="mx-auto max-w-7xl space-y-8">

                <header className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-3 text-green-400">
                        <Activity size={25} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">BeatCSV</h1>
                        <p className="text-sm text-slate-400">
                            CSV Data Profiling & Quality Analysis
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-2 gap-8">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-auto max-h-125 custom-scrollbar">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="sticky top-0 z-10 bg-slate-800/95 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                    <tr>
                                        {Object.keys(data?.preview[0] ?? {}).map((column) => (
                                            <th key={column} className="p-4 whitespace-nowrap">
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800/60">
                                    {data?.preview.length ? (
                                        data.preview.map((row, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-slate-800/30 transition-colors"
                                            >
                                                {Object.values(row).map((value, cellIndex) => (
                                                    <td
                                                        key={cellIndex}
                                                        className="p-4 whitespace-nowrap"
                                                    >
                                                        {value === "" ? (
                                                            <span className="text-slate-500 italic">
                                                                Missing
                                                            </span>
                                                        ) : (
                                                            value
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={Object.keys(data?.preview[0] ?? {}).length || 1}
                                                className="p-8 text-center text-slate-400"
                                            >
                                                No file uploaded
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section className="w-full">

                        <FileUpload onUpload={handleUpload} loading={loading} />

                        {error && (
                            <p className="mt-3 text-sm text-red-400">{error}</p>
                        )}
                    </section>

                </div>

                {data && (
                    <>
                        <section className="space-y-4">
                            <div>
                                <h2 className="font-semibold text-white">Dataset Overview</h2>
                                <p className="text-sm text-slate-400">{data.filename}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                                    >
                                        <metric.icon className="mb-4 text-green-400" size={22} />
                                        <p className="text-sm text-slate-400">{metric.label}</p>
                                        <p className="mt-1 text-2xl font-bold text-white">
                                            {metric.value.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                            <h2 className="font-semibold text-white">Data Quality Score</h2>

                            <div className="mt-5 flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold text-green-400">
                                        {data.data_quality.score}
                                        <span className="text-lg text-slate-500"> / 100</span>
                                    </p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        {data.data_quality.rating}
                                    </p>
                                </div>
                                <Activity size={36} className="text-green-400" />
                            </div>

                            <div className="mt-6 space-y-4">
                                {[
                                    { label: "Completeness", value: data.data_quality.completeness },
                                    { label: "Uniqueness", value: data.data_quality.uniqueness },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="text-slate-400">{item.label}</span>
                                            <span>{item.value}%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-green-500"
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-6">
                            <h2 className="mb-5 font-semibold text-white">Column Analysis</h2>

                            <table className="w-full text-left text-sm">
                                <thead className="text-slate-400">
                                    <tr>
                                        <th className="p-3">Column</th>
                                        <th className="p-3">Type</th>
                                        <th className="p-3">Non-null</th>
                                        <th className="p-3">Missing</th>
                                        <th className="p-3">Unique</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.columns.map((column) => (
                                        <tr key={column.name} className="border-t border-slate-800">
                                            <td className="p-3 font-medium text-white">{column.name}</td>
                                            <td className="p-3">{column.column_type}</td>
                                            <td className="p-3">{column.non_null}</td>
                                            <td className="p-3">{column.missing}</td>
                                            <td className="p-3">{column.unique_values}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
};

export default Dashboard;