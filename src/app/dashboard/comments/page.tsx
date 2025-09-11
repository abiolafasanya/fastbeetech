"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCommentModeration, StatusFilter } from "@/hooks/useComment";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CommentModerationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const { data, isLoading, isError, moderateMutation } =
    useCommentModeration(statusFilter);
  return (
    <RoleGuard
      permissions={["comment:moderate", "blog:moderate_comments"]}
      showFallback={true}
    >
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Comment Moderation</h1>
        <div className="mb-4 flex gap-2 flex-wrap">
          {["all", "approved", "pending", "spam", "deleted"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s as StatusFilter)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <div>Loading comments...</div>
        ) : isError ? (
          <div className="text-red-500">Failed to load comments.</div>
        ) : (
          <div className="space-y-6">
            {data.length === 0 && (
              <div className="text-muted-foreground">No comments found.</div>
            )}
            {data.map((item) => (
              <div
                key={item.comment._id}
                className="border rounded p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {item.comment.author?.name ||
                      item.comment.authorName ||
                      "Anonymous"}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {item.comment.authorEmail}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {new Date(item.comment.createdAt).toLocaleString()} |{" "}
                    <span className="capitalize">{item.comment.status}</span>
                  </div>
                  <div className="mb-2">{item.comment.content}</div>
                  <div className="flex gap-2 flex-wrap">
                    {item.comment.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          moderateMutation.mutate({
                            postId: item.postId,
                            commentId: item.comment._id,
                            status: "approved",
                          })
                        }
                        disabled={moderateMutation.isPending}
                      >
                        Approve
                      </Button>
                    )}
                    {item.comment.status !== "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          moderateMutation.mutate({
                            postId: item.postId,
                            commentId: item.comment._id,
                            status: "pending",
                          })
                        }
                        disabled={moderateMutation.isPending}
                      >
                        Mark as Pending
                      </Button>
                    )}
                    {item.comment.status !== "spam" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          moderateMutation.mutate({
                            postId: item.postId,
                            commentId: item.comment._id,
                            status: "spam",
                          })
                        }
                        disabled={moderateMutation.isPending}
                      >
                        Mark as Spam
                      </Button>
                    )}
                    {item.comment.status !== "deleted" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          moderateMutation.mutate({
                            postId: item.postId,
                            commentId: item.comment._id,
                            status: "deleted",
                          })
                        }
                        disabled={moderateMutation.isPending}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                <div className="min-w-[120px] text-xs text-muted-foreground">
                  <div>
                    Post:{" "}
                    <span className="font-semibold">{item.postTitle}</span>
                  </div>
                  <div>Post ID: {item.postId}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
