// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-[80vh] grid place-items-center bg-background px-6">
      <section className="max-w-lg w-full text-center border rounded-2xl p-8 bg-card shadow-sm">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground mt-2">
          We couldn’t find what you’re looking for. It may have been moved,
          renamed, or removed.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button variant="outline" onClick={() => router.refresh()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>

          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          If the problem persists, contact support or try again later.
        </p>
      </section>
    </main>
  );
}
