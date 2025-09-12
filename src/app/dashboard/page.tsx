import { headers, cookies } from "next/headers";
import DashboardClient from "./components/DashboardClient";

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
const API_PATH = "/admin/stats";

export default async function AdminHome() {
  // const hdrs = headers();
  // const host = (await hdrs).get("host")!;
  // const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${process.env.BACKEND_URL}${API_PATH}`;

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
        <p className="text-sm text-muted-foreground">
          Failed to load dashboard data (HTTP {res.status}).
        </p>
      </div>
    );
  }

  const json = (await res.json()) as AdminStatsResponse;

  return <DashboardClient data={json} />;
}
