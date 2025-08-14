// hooks/comments/useModeration.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BlogApi from "@/api/BlogApi";

export function useModerationList(params?: {
  status?: "approved" | "pending" | "spam" | "deleted";
  page?: number;
  limit?: number;
  search?: string;
  slug?: string;
}) {
  return useQuery({
    queryKey: ["admin-comments", params],
    queryFn: () => BlogApi.listAllComments(params),
  });
}

export function useModerateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["moderate-comment"],
    mutationFn: ({
      postId,
      commentId,
      status,
    }: {
      postId: string;
      commentId: string;
      status: "approved" | "pending" | "spam" | "deleted";
    }) => BlogApi.moderateCommentByIds(postId, commentId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });
}
