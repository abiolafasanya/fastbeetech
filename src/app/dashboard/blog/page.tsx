"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Globe, Edit, CirclePower } from "lucide-react";
import { usePosts } from "./hooks/usePost";
import { usePostMutations } from "./hooks/usePostMutation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { usePermissions } from "@/hooks/usePermissions";

// Disable static generation for this page
export const dynamic = "force-dynamic";

type STATUS_TYPE = "all" | "draft" | "scheduled" | "published" | "archived";
export default function BlogListPage() {
  const [status, setStatus] = useState<STATUS_TYPE>("all");
  const [page, setPage] = useState(1);
  const { can, is } = usePermissions();

  const { data, isLoading } = usePosts({
    page,
    limit: 10,
    status: status === "all" ? undefined : status,
  });

  const { remove, publish, feature } = usePostMutations();

  const handlePublish = async (id: string) => {
    await publish.mutateAsync(id);
    toast.success("Published");
  };

  const handleFeature = async (id: string, isFeatured: boolean) => {
    await feature.mutateAsync({ id, isFeatured });
    toast.success(isFeatured ? "Added to featured" : "Removed from featured");
  };

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id);
    toast.success("Deleted");
  };

  return (
    <RoleGuard
      permissions={["blog:view", "blog:create", "blog:edit"]}
      showFallback={true}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Blog</h2>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as STATUS_TYPE)}
              className="border rounded px-2 py-1 text-sm bg-transparent"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            {(can.createBlog() || is.admin() || is.superAdmin()) && (
              <Link
                href="/dashboard/blog/new"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>
            )}
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 flex items-center gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Tags</th>
                  <th className="text-left p-3">Published</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.slug}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 border rounded-full">
                        {p.status}
                      </span>
                      {p.isFeatured && (
                        <span className="ml-2 text-xs px-2 py-1 border rounded-full">
                          featured
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.tags?.map((t) => (
                          <span
                            className="text-xs px-2 py-0.5 border rounded-full"
                            key={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 justify-end">
                        {(can.publishBlog() ||
                          is.admin() ||
                          is.superAdmin()) && (
                          <button
                            onClick={() => handlePublish(p._id)}
                            className="p-1 rounded hover:bg-muted"
                            title="Publish"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                        )}
                        {(can.editBlog() || is.admin() || is.superAdmin()) && (
                          <button
                            onClick={() => handleFeature(p._id, !p.isFeatured)}
                            className="p-1 rounded hover:bg-muted"
                            title="Toggle featured"
                          >
                            <CirclePower className="w-4 h-4" />
                          </button>
                        )}
                        {(can.editBlog() || is.admin() || is.superAdmin()) && (
                          <Link
                            href={`/dashboard/blog/${p.slug || p._id}`}
                            className="p-1 rounded hover:bg-muted"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        {(can.deleteBlog() ||
                          is.admin() ||
                          is.superAdmin()) && (
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1 rounded hover:bg-muted text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!data?.data?.length && (
                  <tr>
                    <td
                      className="p-6 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      No posts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            disabled={!data?.meta?.hasPreviousPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!data?.meta?.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
