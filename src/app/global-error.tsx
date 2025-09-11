// app/global-error.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen grid place-items-center bg-background px-6">
          <section className="max-w-lg w-full text-center border rounded-2xl p-8 bg-card shadow-sm">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full grid place-items-center bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold">Something went wrong!</h1>
            <p className="text-muted-foreground mt-2">
              A critical error occurred. You can try again or return to the home
              page.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => reset()}>
                Try again
              </Button>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go home
                </Link>
              </Button>
            </div>

            {error?.digest && (
              <p className="mt-6 text-xs text-muted-foreground">
                Error ID:{" "}
                <code className="bg-muted px-2 py-1 rounded">
                  {error.digest}
                </code>
              </p>
            )}
          </section>
        </main>
      </body>
    </html>
  );
}
