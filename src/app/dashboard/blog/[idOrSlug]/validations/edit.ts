import { z } from "zod";
import { BlogPost } from "@/api/BlogApi";

export const blogPostEditSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(10),
  tags: z.string().optional(), // UI field is string; we’ll convert on payload
  cover: z.string().url().optional().or(z.literal("")),
  // allow full set on edit
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional(),
  allowComments: z.boolean(),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(300).optional().or(z.literal("")),
  canonical: z.string().url().optional().or(z.literal("")),
});

export type BlogPostEditInput = z.infer<typeof blogPostEditSchema>;

// ---------- helpers to map server <-> client ----------

// Load API post into form defaults
export const toClientDefaults = (
  post?: BlogPost | undefined
): BlogPostEditInput => {
  if (!post) {
    return {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
      cover: "",
      status: "draft",
      allowComments: true,
      metaTitle: "",
      metaDescription: "",
      canonical: "",
    };
  }

  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    // turn array -> comma string for input
    tags: (post.tags ?? []).join(", "),
    cover: post.cover ?? "",
    status: post.status ?? "draft",
    allowComments: !!post.allowComments,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    canonical: post.canonical ?? "",
  };
};

// Convert form -> API payload
export const toServerPayload = (v: BlogPostEditInput): Partial<BlogPost> => {
  const tags =
    (v.tags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [];

  return {
    title: v.title,
    slug: v.slug,
    excerpt: v.excerpt || undefined,
    content: v.content,
    tags,
    cover: v.cover || undefined,
    status: v.status,
    allowComments: v.allowComments,
    metaTitle: v.metaTitle || undefined,
    metaDescription: v.metaDescription || undefined,
    canonical: v.canonical || undefined,
  };
};
