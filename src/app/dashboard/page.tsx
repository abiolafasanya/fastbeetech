import { headers, cookies } from "next/headers";
import Link from "next/link";
import StatCard from "./components/StatCard";

type AdminStatsResponse = {
  status: boolean;
  data: {
    counts: {
      totalPosts: number;
      draftCount: number;
      scheduledCount: number;
      publishedCount: number;
      archivedCount: number;
      featuredCount: number;
      comments: {
        total: number;
        approved: number;
        pending: number;
        spam: number;
        deleted: number;
      };
    };
    latest: {
      posts: Array<{
        _id: string;
        title: string;
        slug: string;
        status: "draft" | "scheduled" | "published" | "archived";
        publishedAt?: string;
        createdAt: string;
        author?: { name: string; avatar?: string };
      }>;
      comments: Array<{
        postId: string;
        postSlug: string;
        postTitle: string;
        comment: {
          _id: string;
          author?: { _id: string; name: string; avatar?: string } | null;
          authorName?: string;
          authorEmail?: string;
          content: string;
          status: "approved" | "pending" | "spam" | "deleted";
          likes?: number;
          createdAt: string;
        };
      }>;
    };
  };
};

// If your Express API is reverse-proxied under the same domain (recommended),
// use a relative URL and cookies forward automatically in RSC:
const API_PATH = "/api/admin/stats";

export default async function AdminHome() {
  const hdrs = headers();
  const host = (await hdrs).get("host")!;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}${API_PATH}`;

  const res = await fetch(url, {
    // Keep it dynamic
    cache: "no-store",
    // Forward cookies for auth-protected API routes
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (!res.ok) {
    // Fallback UI if API fails
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Posts" value="—" caption="Total posts" />
          <StatCard title="Drafts" value="—" caption="Unpublished" />
          <StatCard title="Comments" value="—" caption="All time" />
          <StatCard title="Featured" value="—" caption="Homepage" />
        </div>
        <p className="text-sm text-muted-foreground">
          Failed to load stats (HTTP {res.status}).
        </p>
      </div>
    );
  }

  const json = (await res.json()) as AdminStatsResponse;
  const d = json.data;

  const stats = [
    {
      title: "Posts",
      value: String(d.counts.totalPosts),
      caption: "Total posts",
    },
    {
      title: "Drafts",
      value: String(d.counts.draftCount),
      caption: "Unpublished",
    },
    {
      title: "Comments",
      value: String(d.counts.comments.total),
      caption: "All time",
    },
    {
      title: "Featured",
      value: String(d.counts.featuredCount),
      caption: "Homepage",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Posts */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Recent Posts</h2>
          {d.latest.posts.length ? (
            <ul className="space-y-3">
              {d.latest.posts.map((p) => (
                <li
                  key={p._id}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium leading-snug">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.slug} • {p.status}
                      {p.publishedAt
                        ? ` • ${new Date(p.publishedAt).toLocaleString()}`
                        : ""}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs">
                    <Link
                      href={`/dashboard/blog/${p.slug}`}
                      className="underline hover:no-underline"
                    >
                      Edit
                    </Link>
                    <span className="mx-1">·</span>
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="underline hover:no-underline"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          )}
        </div>

        {/* Latest Comments */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Latest Comments</h2>
          {d.latest.comments.length ? (
            <ul className="space-y-3">
              {d.latest.comments.map((it) => {
                const author = it.comment.author
                  ? (it.comment.author as { name: string })?.name || "User"
                  : it.comment.authorName || "Guest";
                return (
                  <li key={it.comment._id} className="space-y-1">
                    <div className="text-sm leading-relaxed line-clamp-3">
                      {it.comment.content}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{author}</span>
                      <span>•</span>
                      <span>
                        {new Date(it.comment.createdAt).toLocaleString()}
                      </span>
                      <span>•</span>
                      <Link
                        href={`/dashboard/blog/${it.postSlug}`}
                        className="underline hover:no-underline"
                      >
                        {it.postTitle}
                      </Link>
                      <span>•</span>
                      <Link
                        href={`/blog/${it.postSlug}`}
                        target="_blank"
                        className="underline hover:no-underline"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
