// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-[60vh] grid place-items-center bg-background px-6">
      <section
        role="status"
        aria-live="polite"
        className="max-w-lg w-full text-center border rounded-2xl p-8 bg-card shadow-sm"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold mt-3">Loading…</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fetching fresh data. This won’t take long.
        </p>

        {/* Optional skeletons */}
        <div className="mt-6 space-y-3">
          <div className="h-4 rounded-md bg-muted animate-pulse" />
          <div className="h-4 rounded-md bg-muted animate-pulse w-5/6" />
          <div className="h-4 rounded-md bg-muted animate-pulse w-3/4" />
        </div>
      </section>
    </main>
  );
}
