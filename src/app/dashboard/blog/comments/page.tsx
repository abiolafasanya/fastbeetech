"use client";

import { useState } from "react";
import { useModerationList, useModerateComment } from "./hooks/useModeration";
import { Check, Ban, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

type STATUS = "pending" | "approved" | "spam" | "deleted";
export default function CommentsModerationPage() {
  const [status, setStatus] = useState<
    STATUS
  >("pending");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useModerationList({
    status,
    page,
    limit: 20,
    search: search || undefined,
  });
  const moderate = useModerateComment();

  const act = async (
    postId: string,
    commentId: string,
    newStatus: "approved" | "pending" | "spam" | "deleted"
  ) => {
    await moderate.mutateAsync({ postId, commentId, status: newStatus });
    toast.success(`Comment ${newStatus}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Comments Moderation</h2>
        <div className="ml-auto flex items-center gap-2">
          <input
            placeholder="Search comments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm bg-background"
          />
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 border rounded text-sm inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Search
          </button>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as STATUS);
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm bg-transparent"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="spam">Spam</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-6 flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Comment</th>
                <th className="text-left p-3">Author</th>
                <th className="text-left p-3">Post</th>
                <th className="text-left p-3">Date</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((row) => (
                <tr key={row.comment._id} className="border-t align-top">
                  <td className="p-3">
                    <div className="whitespace-pre-wrap">
                      {row.comment.content}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Status: {row.comment.status}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      {row.comment.authorName ??
                        (typeof row.comment.author === "object"
                          ? row.comment!.author!.name
                          : "Guest")}
                    </div>
                    {row.comment.authorEmail && (
                      <div className="text-xs text-muted-foreground">
                        {row.comment.authorEmail}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-sm font-medium">{row.postTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      /{row.postSlug}
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(row.comment.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        className="p-1 rounded hover:bg-muted"
                        title="Approve"
                        onClick={() =>
                          act(row.postId, row.comment._id, "approved")
                        }
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-muted"
                        title="Mark as spam"
                        onClick={() => act(row.postId, row.comment._id, "spam")}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-muted text-red-500"
                        title="Delete"
                        onClick={() =>
                          act(row.postId, row.comment._id, "deleted")
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                    No comments
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
  );
}
