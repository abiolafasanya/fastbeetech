"use client";
import React, { useState, forwardRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { Textarea } from "./ui/textarea";
import { useBlogComments, useAddBlogComment } from "@/hooks/useBlogComments";
import { Button } from "./ui/button";

export interface BlogCommentsProps {
  postId: string;
  slug: string;
}

export const BlogComments = forwardRef<HTMLDivElement, BlogCommentsProps>(
  function BlogComments({ postId, slug }, ref) {
    // API-driven comments state
    const { data: comments = [], isLoading, isError } = useBlogComments(slug);
    const addComment = useAddBlogComment(postId);
    const [newComment, setNewComment] = useState("");
    const [showAll, setShowAll] = useState(false);
    const COMMENTS_TO_SHOW = 3;
    const user = useAuthStore((state) => state.user);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      addComment.mutate(
        {
          content: newComment,
          author: user?.id ?? undefined,
          authorName: user?.name ?? undefined,
          authorEmail: user?.email ?? undefined,
        },
        {
          onSuccess: () => {
            setNewComment("");
          },
        }
      );
    };

    return (
      <div className="mt-8" ref={ref} data-postid={postId} data-slug={slug}>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            className="mb-2"
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={addComment.isPending}
          />
          <Button
            type="submit"
            // className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={addComment.isPending || !newComment.trim()}
          >
            {addComment.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </form>
        {isLoading ? (
          <div>Loading comments...</div>
        ) : isError ? (
          <div className="text-red-500">Failed to load comments.</div>
        ) : (
          <>
            <ul className="space-y-4">
              {(showAll ? comments : comments.slice(0, COMMENTS_TO_SHOW)).map(
                (comment) => (
                  <li key={comment._id} className="border-b pb-2">
                    <div className="text-sm font-medium">
                      {comment.author?.name ||
                        comment.authorName ||
                        "Anonymous"}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    <div>{comment.content}</div>
                  </li>
                )
              )}
              {comments.length === 0 && (
                <li className="text-muted-foreground">No comments yet.</li>
              )}
            </ul>
            {comments.length > COMMENTS_TO_SHOW && (
              <button
                className="mt-2 text-primary underline text-sm"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll
                  ? "Show less"
                  : `Show more (${comments.length - COMMENTS_TO_SHOW})`}
              </button>
            )}
          </>
        )}
      </div>
    );
  }
);
