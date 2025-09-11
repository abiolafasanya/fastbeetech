"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlogApi, { ModerationItem } from "@/api/BlogApi";

export type StatusFilter = "approved" | "pending" | "spam" | "deleted" | "all";

export function useCommentModeration(statusFilter: StatusFilter) {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<ModerationItem[], Error>({
    queryKey: ["moderation-comments", statusFilter],
    queryFn: async () => {
      const filter: { status?: Exclude<StatusFilter, "all"> } =
        statusFilter === "all"
          ? {}
          : { status: statusFilter as Exclude<StatusFilter, "all"> };
          
          const res = await BlogApi.listAllComments(filter);
          console.log("Moderation data:", res);
      return res.data || [];
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async (vars: {
      postId: string;
      commentId: string;
      status: Exclude<StatusFilter, "all">;
    }) => {
      return BlogApi.moderateCommentByIds(
        vars.postId,
        vars.commentId,
        vars.status
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderation-comments"] });
    },
  });

  return {
    data,
    isLoading,
    isError,
    moderateMutation,
  };
}
