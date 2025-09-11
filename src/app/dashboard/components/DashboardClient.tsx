"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import StatCard from "./StatCard";

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

interface DashboardClientProps {
  data: AdminStatsResponse;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const { can, is } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {(can.manageBlogs() || is.admin() || is.superAdmin()) && (
          <>
            <StatCard
              title="Total Posts"
              value={data.data.counts.totalPosts.toString()}
            />
            <StatCard
              title="Draft Posts"
              value={data.data.counts.draftCount.toString()}
            />
            <StatCard
              title="Published"
              value={data.data.counts.publishedCount.toString()}
            />
            <StatCard
              title="Comments"
              value={data.data.counts.comments.total.toString()}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Latest Posts */}
        {(can.manageBlogs() || is.admin() || is.superAdmin()) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Latest Posts</h3>
              <Link
                href="/dashboard/blog"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {data.data.latest.posts?.slice(0, 5).map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div>
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {post.status} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {(can.editBlog() || is.admin() || is.superAdmin()) && (
                    <Link
                      href={`/dashboard/blog/${post.slug || post._id}`}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Comments */}
        {(can.manageBlogs() || is.admin() || is.superAdmin()) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Comments</h3>
              <Link
                href="/dashboard/comments"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Moderate
              </Link>
            </div>
            <div className="space-y-4">
              {data.data.latest.comments?.slice(0, 5).map((item) => (
                <div
                  key={item.comment._id}
                  className="py-2 border-b last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.comment.author?.name ||
                          item.comment.authorName ||
                          "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        on {item.postTitle}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.comment.content.slice(0, 100)}...
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.comment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : item.comment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.comment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {(can.createBlog() || is.admin() || is.superAdmin()) && (
            <Link
              href="/dashboard/blog/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              New Blog Post
            </Link>
          )}
          {(can.createCourse() ||
            is.instructor() ||
            is.admin() ||
            is.superAdmin()) && (
            <Link
              href="/dashboard/course/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              New Course
            </Link>
          )}
          {(can.viewAnalytics() || is.admin() || is.superAdmin()) && (
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Analytics
            </Link>
          )}
          {(can.manageUsers() || is.admin() || is.superAdmin()) && (
            <Link
              href="/dashboard/users"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Users
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
