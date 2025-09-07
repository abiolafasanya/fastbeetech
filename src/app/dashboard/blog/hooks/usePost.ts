import { useQuery } from "@tanstack/react-query";
import BlogApi, { BlogStatus } from "@/api/BlogApi";

export function usePosts(params?: {
  page?: number;
  limit?: number;
  status?: BlogStatus;
  tag?: string;
  search?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => BlogApi.listPostAdmin(params),
  });
}
