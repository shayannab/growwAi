import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Papa from "papaparse";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PreviewTable } from "@/components/PreviewTable";
import { LoadingState } from "@/components/LoadingState";
import { ResultsTable, type ImportedRecord, type SkippedRow } from "@/components/ResultsTable";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CSV Importer · GrowEasy CRM" },
      { name: "description", content: "Drag & drop your leads CSV to import contacts into GrowEasy CRM in seconds." },
      { property: "og:title", content: "CSV Importer · GrowEasy CRM" },
      { property: "og:description", content: "Import leads into GrowEasy CRM with drag-and-drop CSV upload." },
    ],
  }),
  component: Index,
});

type Step = "upload" | "preview" | "loading" | "results";

type ApiImportedRecord = {
  name?: string;
  email?: string;
  mobile_without_country_code?: string;
  company?: string;
  crm_status?: string;
};

type ApiSkippedRow = {
  original?: Record<string, unknown>;
  reason?: string;
};

type ExtractApiResponse = {
  imported?: ApiImportedRecord[];
  skipped?: ApiSkippedRow[];
  error?: string;
  details?: string;
};

function Index() {
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [imported, setImported] = useState<ImportedRecord[]>([]);
  const [skipped, setSkipped] = useState<SkippedRow[]>([]);

  const handleFile = (file: File) => {
    setFileName(file.name);
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,
      complete: (res: { data: string[][] }) => {
        const data = res.data as string[][];
        if (!data.length) return;
        setHeaders(data[0]);
        setRows(data.slice(1));
        setStep("preview");
      },
    });
  };

  const handleConfirm = async () => {
    setStep("loading");
    try {
      const structuredRows = rows.map((row: string[]) =>
        headers.reduce<Record<string, string>>((acc: Record<string, string>, header: string, idx: number) => {
          acc[header] = row[idx] ?? "";
          return acc;
        }, {}),
      );

      const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
      const backendBaseUrl =
        viteEnv?.VITE_BACKEND_URL?.trim() || "http://localhost:3001";

      const response = await fetch(`${backendBaseUrl}/api/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: structuredRows }),
      });

      const data = (await response.json()) as ExtractApiResponse;
      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to process CSV");
      }

      const ok: ImportedRecord[] = (data.imported ?? []).map((record) => ({
        name: record.name?.trim() || "—",
        email: record.email?.trim() || "—",
        phone: record.mobile_without_country_code?.trim() || "—",
        company: record.company?.trim() || "—",
        status: record.crm_status?.trim() || "",
      }));

      const bad: SkippedRow[] = (data.skipped ?? []).map((item, idx) => ({
        rowNumber: idx + 2,
        reason: item.reason || "Skipped by backend validation",
        raw: headers.map((header: string) => String(item.original?.[header] ?? "")),
      }));

      setImported(ok);
      setSkipped(bad);
      setStep("results");
    } catch (error) {
      console.error("CSV processing failed:", error);
      setImported([]);
      setSkipped([
        {
          rowNumber: 0,
          reason:
            error instanceof Error
              ? error.message
              : "Could not connect to backend. Please start server on port 3001.",
          raw: [],
        },
      ]);
      setStep("results");
    }
  };

  const reset = () => {
    setStep("upload");
    setFileName("");
    setHeaders([]);
    setRows([]);
    setImported([]);
    setSkipped([]);
  };

  const steps: { id: Step; label: string }[] = [
    { id: "upload", label: "Upload" },
    { id: "preview", label: "Preview" },
    { id: "loading", label: "Import" },
    { id: "results", label: "Results" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[480px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">GrowEasy</span>
          <span className="ml-2 hidden rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
            CSV Importer
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        {/* Hero */}
        <section className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Bulk import leads into your CRM
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Import your CSV in{" "}
            <span className="bg-gradient-to-r from-primary to-[oklch(0.78_0.15_60)] bg-clip-text text-transparent">
              seconds
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Drop a CSV of leads and we'll validate, deduplicate, and sync every row into GrowEasy CRM.
          </p>
        </section>

        {/* Stepper */}
        <ol className="mx-auto mb-8 flex max-w-2xl items-center justify-between gap-2">
          {steps.map((s, i) => {
            const active = i === currentIdx;
            const done = i < currentIdx;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />
                )}
              </li>
            );
          })}
        </ol>

        {/* Step content */}
        {step === "upload" && <UploadDropzone onFile={handleFile} />}
        {step === "preview" && (
          <PreviewTable
            headers={headers}
            rows={rows}
            fileName={fileName}
            onConfirm={handleConfirm}
            onCancel={reset}
          />
        )}
        {step === "loading" && <LoadingState />}
        {step === "results" && (
          <ResultsTable
            imported={imported}
            skipped={skipped}
            headers={headers}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}
