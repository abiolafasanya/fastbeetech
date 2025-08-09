import { getAllPosts } from "@/lib/blog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap() {
  const now = new Date().toISOString();
  const staticRoutes = ["", "/blog", "/internship"].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const posts = getAllPosts().map(({ slug, frontmatter }) => ({
    url: `${SITE}/blog/${slug}`,
    lastModified: new Date(frontmatter.date).toISOString(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts];
}
