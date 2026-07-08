import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function UploadDropzone({ onFile }: { onFile: (file: File) => void }) {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) onFile(files[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/vnd.ms-excel": [".csv"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative flex min-h-[380px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : isDragReject
            ? "border-destructive bg-destructive/5"
            : "border-border bg-card hover:border-primary/60 hover:bg-muted/40"
      }`}
    >
      <input {...getInputProps()} />

      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-foreground">
        {isDragActive ? "Drop your CSV here" : "Upload your CSV file"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Drag & drop your leads CSV, or click to browse. We'll preview the rows before importing into your CRM.
      </p>

      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:bg-primary-hover"
      >
        Select CSV file
      </button>

      <p className="mt-4 text-xs text-muted-foreground">.csv up to 20 MB</p>
    </div>
  );
}
