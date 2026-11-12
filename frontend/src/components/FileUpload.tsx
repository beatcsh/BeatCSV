import { useRef } from "react";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
    onUpload: (file: File) => void;
    loading: boolean;
}

const FileUpload = ({ onUpload, loading }: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file?: File) => {
        if (file && file.name.toLocaleLowerCase().endsWith(".csv")) {
            onUpload(file);
        }
    };

    return (
        <div
            data-aos="zoom-in-up"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className="h-30 flex place-items-center justify-center space-x-4 cursor-pointer rounded-xl border border-slate-700 bg-slate-900/60 p-10 text-center transition hover:border-green-500 hover:bg-slate-800/60"
        >
            <input
                ref={inputRef}
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                {loading ? (
                    <FileSpreadsheet size={28} className="animate-pulse" />
                ) : (
                    <UploadCloud size={28} />
                )}
            </div>

            <h3 className="font-semibold text-white">
                {loading ? "Analyzing dataset..." : "Upload your CSV file"}
            </h3>

            {/* <p className="text-sm text-slate-400">Drag and drop your file here or click to browse</p>

            <p className="text-xs text-slate-500">Supported format: CSV</p> */}
        </div>
    )
};

export default FileUpload;