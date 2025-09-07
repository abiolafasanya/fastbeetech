import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlogApi, { BlogComment } from "@/api/BlogApi";

// Fetch comments for a blog post by slug
export function useBlogComments(slug: string) {
  return useQuery<BlogComment[], Error>({
    queryKey: ["blog-comments", slug],
    queryFn: async () => {
      const res = await BlogApi.listComments(slug);
      return res.data || [];
    },
    enabled: !!slug,
  });
}

// Add a comment to a blog post (by id)
export function useAddBlogComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      author?: string | null;
      authorName?: string;
      authorEmail?: string;
      content: string;
    }) => {
      // BlogApi.addComment expects postId
      return BlogApi.addComment(postId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-comments"] });
    },
  });
}
