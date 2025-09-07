// app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BlogApi } from "@/lib/blog";

export const dynamic = "force-static"; // cache + ISR
export const revalidate = 60;

type BlogSearch = { q?: string; tag?: string; page?: string };

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<BlogSearch>;
}) {
  const sp = await searchParams; // ← await the promise
  const q = sp?.q?.trim();
  const tag = sp?.tag?.trim();
  const page = Number(sp?.page ?? 1);

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", "9");
  if (q) qs.set("search", q);
  if (tag) qs.set("tag", tag);
  qs.set("status", "published");

  const resp = await BlogApi.list(qs);
  const items = resp.data;
  const meta = resp.meta;

  const allTags = Array.from(
    new Set(items.flatMap((p) => p.tags ?? []))
  ).sort();

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center">Hexonest Blog</h1>
      <p className="text-center text-lg text-muted-foreground mb-8">
        Insights, tutorials, updates and engineering stories.
      </p>

      {/* Search */}
      <form className="max-w-xl mx-auto mb-6 flex gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search posts..."
          className="flex-1"
        />
        <button className="hidden" type="submit" aria-hidden />
      </form>

      {/* Tags (from current items; replace with global tags if you add API) */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Link
            href={q ? `/blog?q=${encodeURIComponent(q)}` : "/blog"}
            className={`text-sm px-3 py-1 rounded-full border ${
              !tag ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog?${[
                q && `q=${encodeURIComponent(q)}`,
                `tag=${encodeURIComponent(t)}`,
              ]
                .filter(Boolean)
                .join("&")}`}
              className={`text-sm px-3 py-1 rounded-full border ${
                tag === t ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {/* Cards */}
      {items.length === 0 ? (
        <div className="mx-auto max-w-xl text-center rounded-xl border p-8">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((p) => (
            <Card key={p._id} className="overflow-hidden">
              {p.cover ? (
                <Image
                  src={p.cover}
                  alt={p.title}
                  width={1200}
                  height={630}
                  className="h-40 w-full object-cover"
                />
              ) : null}
              <CardHeader>
                <CardTitle className="line-clamp-2">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {p.excerpt}
                </p>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-blue-600 text-sm mt-3 inline-block"
                >
                  Read More →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blog?${[
                q && `q=${encodeURIComponent(q)}`,
                tag && `tag=${encodeURIComponent(tag)}`,
                `page=${p}`,
              ]
                .filter(Boolean)
                .join("&")}`}
              className={`px-3 py-1 rounded border text-sm ${
                p === meta.currentPage ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
