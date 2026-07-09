import { useState } from "react";

export type ImportedRecord = {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
};

export type SkippedRow = {
  rowNumber: number;
  reason: string;
  raw: string[];
};

export function ResultsTable({
  imported,
  skipped,
  headers,
  onReset,
}: {
  imported: ImportedRecord[];
  skipped: SkippedRow[];
  headers: string[];
  onReset: () => void;
}) {
  const [showSkipped, setShowSkipped] = useState(skipped.length > 0);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Imported"
          value={imported.length}
          tone="success"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          }
        />
        <StatCard
          label="Total Skipped"
          value={skipped.length}
          tone="warn"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>
          }
        />
      </div>

      {/* Imported records */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Imported CRM Records</h3>
            <p className="text-sm text-muted-foreground">Successfully synced to your GrowEasy CRM</p>
          </div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover sm:self-auto"
          >
            Import another file
          </button>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                {["Name", "Email", "Phone", "Company", "Status"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {imported.map((r, i) => (
                <tr key={i} className="group">
                  <td className="whitespace-nowrap border-b border-border px-4 py-2.5 font-medium text-foreground group-hover:bg-muted/40">{r.name}</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-2.5 text-foreground group-hover:bg-muted/40">{r.email}</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-2.5 text-foreground group-hover:bg-muted/40">{r.phone}</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-2.5 text-foreground group-hover:bg-muted/40">{r.company}</td>
                  <td className="whitespace-nowrap border-b border-border px-4 py-2.5 group-hover:bg-muted/40">
                    <span className="inline-flex rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                      {r.status || "Uncategorized"}
                    </span>
                  </td>
                </tr>
              ))}
              {imported.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No records were imported.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skipped rows collapsible */}
      {skipped.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <button
            onClick={() => setShowSkipped((s) => !s)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
          >
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-foreground">
                Skipped Rows ({skipped.length})
              </h3>
              <p className="text-sm text-muted-foreground">Rows that failed validation and were not imported</p>
            </div>
            <span
              className={`shrink-0 rounded-full border border-border p-2 text-foreground transition-transform ${
                showSkipped ? "rotate-180" : ""
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>

          {showSkipped && (
            <div className="max-h-[360px] overflow-auto border-t border-border">
              <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="whitespace-nowrap border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Row</th>
                    <th className="whitespace-nowrap border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reason</th>
                    {headers.map((h, i) => (
                      <th key={i} className="whitespace-nowrap border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {h || `Column ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skipped.map((s, i) => (
                    <tr key={i} className="group">
                      <td className="whitespace-nowrap border-b border-border px-4 py-2.5 text-xs text-muted-foreground group-hover:bg-muted/40">{s.rowNumber}</td>
                      <td className="whitespace-nowrap border-b border-border px-4 py-2.5 group-hover:bg-muted/40">
                        <span className="inline-flex rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive">
                          {s.reason}
                        </span>
                      </td>
                      {headers.map((_, c) => (
                        <td key={c} className="whitespace-nowrap border-b border-border px-4 py-2.5 text-foreground group-hover:bg-muted/40">
                          {s.raw[c] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: "success" | "warn";
  icon: React.ReactNode;
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/15 text-success"
      : "bg-primary/15 text-primary";
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">{value}</p>
      </div>
    </div>
  );
}
