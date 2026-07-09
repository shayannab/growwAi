export function PreviewTable({
  headers,
  rows,
  fileName,
  onConfirm,
  onCancel,
}: {
  headers: string[];
  rows: string[][];
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">Preview: {fileName}</h3>
          <p className="text-sm text-muted-foreground">
            {rows.length} rows · {headers.length} columns detected
          </p>
        </div>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted sm:self-auto"
        >
          Choose different file
        </button>
      </div>

      <div className="relative max-h-[480px] overflow-auto">
        <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 z-20 border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                #
              </th>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h || `Column ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="group">
                <td className="sticky left-0 z-10 border-b border-border bg-card px-4 py-2.5 text-xs text-muted-foreground group-hover:bg-muted/60">
                  {r + 1}
                </td>
                {headers.map((_, c) => (
                  <td
                    key={c}
                    className="whitespace-nowrap border-b border-border px-4 py-2.5 text-foreground group-hover:bg-muted/40"
                  >
                    {row[c] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Review rows above. Invalid entries (missing name or email) will be skipped.
        </p>
        <button
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:bg-primary-hover"
        >
          Confirm Import
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}
