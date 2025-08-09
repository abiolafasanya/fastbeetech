import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllPosts, filterPosts, paginate } from "@/lib/blog";

export const dynamic = "force-static"; // build-time when possible

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}) {
  const sp = await searchParams; // <-- await it
  const q = sp?.q?.trim() || undefined;
  const tag = sp?.tag?.trim() || undefined;
  const page = Number(sp?.page ?? 1);
  const includeDrafts = process.env.NODE_ENV !== "production";
  const all = getAllPosts({ includeDrafts });
  const filtered = filterPosts(all, q, tag);
  const { items, pages, current } = paginate(filtered, page, 9);
  const allTags = Array.from(
    new Set(all.flatMap((p) => p.frontmatter.tags ?? []))
  ).sort();

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center">Fastbeetech Blog</h1>
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

      {/* Tags */}
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

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="mx-auto max-w-xl text-center rounded-xl border p-8">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ slug, frontmatter }) => (
            <Card key={slug} className="overflow-hidden">
              {frontmatter.cover ? (
                <Image
                  src={frontmatter.cover}
                  alt={frontmatter.title}
                  width={1200}
                  height={630}
                  className="h-40 w-full object-cover"
                />
              ) : null}
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {frontmatter.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {frontmatter.excerpt}
                </p>
                <Link
                  href={`/blog/${slug}`}
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
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
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
                p === current ? "bg-muted" : "hover:bg-muted"
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
