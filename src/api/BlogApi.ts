// api/BlogApi.ts
import QueryBuilder from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/global";

export type BlogStatus = "draft" | "scheduled" | "published" | "archived";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover?: string;
  tags?: string[];
  status: BlogStatus;
  publishedAt?: string;
  scheduledFor?: string;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonical?: string;
  allowComments: boolean;
  likes: number;
  views: number;
  readingTime?: number;
  wordCount?: number;
  author: { _id: string; name: string; avatar?: string } | string;
  createdAt: string;
  updatedAt: string;
}

// api/BlogApi.ts

export interface BlogComment {
  _id: string;
  author: { _id: string; name: string; avatar?: string } | null;
  authorName?: string;
  authorEmail?: string;
  content: string;
  status: "approved" | "pending" | "spam" | "deleted";
  likes: number;
  createdAt: string;
  updatedAt: string;
}


export interface BlogListResponse extends ApiResponse<BlogPost[]> {
  meta: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ModerationItem {
  postId: string;
  postSlug: string;
  postTitle: string;
  comment: BlogComment; // from your earlier type (has _id, content, status, author*, timestamps)
}

export interface ModerationListResponse extends ApiResponse<ModerationItem[]> {
  meta: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

class BlogApi {
  private readonly url = "/api/v1";

  async list(params?: {
    page?: number;
    limit?: number;
    status?: BlogStatus;
    tag?: string;
    author?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
    from?: string;
    to?: string;
  }): Promise<BlogListResponse> {
    const qb = new QueryBuilder(`${this.url}/posts`).addParams(params ?? {});
    const res: AxiosResponse<BlogListResponse> = await axios.get(qb.build());
    return res.data;
  }

  async listAllComments(params?: {
    status?: "approved" | "pending" | "spam" | "deleted";
    page?: number;
    limit?: number;
    search?: string;
    slug?: string;
  }): Promise<ModerationListResponse> {
    const qb = new QueryBuilder(`${this.url}/admin/comments`).addParams(
      params ?? {}
    );
    const res: AxiosResponse<ModerationListResponse> = await axios.get(
      qb.build(),
      { withCredentials: true }
    );
    return res.data;
  }

  async moderateCommentByIds(
    postId: string,
    commentId: string,
    status: "approved" | "pending" | "spam" | "deleted"
  ) {
    const res: AxiosResponse<ApiResponse<unknown>> = await axios.patch(
      `${this.url}/posts/${postId}/comments/${commentId}`,
      { status },
      { withCredentials: true }
    );
    return res.data;
  }

  async getBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.get(
      `${this.url}/posts/${slug}`
    );
    return res.data;
  }

  async create(payload: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.post(
      `${this.url}/posts`,
      payload
    );
    return res.data;
  }

  async update(
    id: string,
    payload: Partial<BlogPost>
  ): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.put(
      `${this.url}/posts/${id}`,
      payload
    );
    return res.data;
  }

  async remove(id: string): Promise<ApiResponse<unknown>> {
    const res: AxiosResponse<ApiResponse<unknown>> = await axios.delete(
      `${this.url}/posts/${id}`
    );
    return res.data;
  }

  async publish(id: string): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.patch(
      `${this.url}/posts/${id}/publish`
    );
    return res.data;
  }

  async schedule(
    id: string,
    scheduledFor: string
  ): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.patch(
      `${this.url}/posts/${id}/schedule`,
      { scheduledFor }
    );
    return res.data;
  }

  async toggleFeature(
    id: string,
    isFeatured: boolean
  ): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.patch(
      `${this.url}/posts/${id}/feature`,
      { isFeatured }
    );
    return res.data;
  }

  // Comments
  async listComments(slug: string): Promise<ApiResponse<BlogComment[]>> {
    const res: AxiosResponse<ApiResponse<BlogComment[]>> = await axios.get(
      `${this.url}/posts/${slug}/comments`
    );
    return res.data;
  }

  async addComment(
    id: string,
    payload: {
      author?: string | null;
      authorName?: string;
      authorEmail?: string;
      content: string;
    }
  ) {
    const res: AxiosResponse<ApiResponse<unknown>> = await axios.post(
      `${this.url}/posts/${id}/comments`,
      payload
    );
    return res.data;
  }

  async moderateComment(
    id: string,
    commentId: string,
    status: "approved" | "pending" | "spam" | "deleted"
  ) {
    const res: AxiosResponse<ApiResponse<unknown>> = await axios.patch(
      `${this.url}/posts/${id}/comments/${commentId}`,
      { status }
    );
    return res.data;
  }

  async getById(id: string): Promise<ApiResponse<BlogPost>> {
    const res: AxiosResponse<ApiResponse<BlogPost>> = await axios.get(`${this.url}/admin/posts/${id}`);
    return res.data;
  }
}

const BlogApiInstance = new BlogApi();
export default BlogApiInstance;
