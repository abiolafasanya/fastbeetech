import { z } from "zod";

const tagsSchema = z.union([z.string(), z.array(z.string())]).transform((val) =>
  Array.isArray(val)
    ? val
    : val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
);

export const blogPostFormSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(10),
  tags: z.string().optional(), // output: string[] | undefined
  cover: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  allowComments: z.boolean(),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(300).optional().or(z.literal("")),
  canonical: z.string().url().optional().or(z.literal("")),
});

// Use the OUTPUT type (after transform)
export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;
