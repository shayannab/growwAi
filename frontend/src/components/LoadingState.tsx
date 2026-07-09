export function LoadingState() {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-foreground">Importing your leads…</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Validating rows, deduplicating records, and syncing to your CRM. This usually takes a few seconds.
      </p>
    </div>
  );
}
