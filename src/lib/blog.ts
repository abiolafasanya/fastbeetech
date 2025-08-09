// lib/blog.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content", "blog");

export type BlogFrontmatter = {
  title: string;
  date: string; // ISO
  excerpt?: string;
  tags?: string[];
  cover?: string;
  author?: string;
  draft?: boolean;
};

export type BlogPost = {
  slug: string;
  content: string;
  frontmatter: BlogFrontmatter;
};

function blogDirExists(): boolean {
  try {
    return fs.existsSync(BLOG_DIR) && fs.statSync(BLOG_DIR).isDirectory();
  } catch {
    return false;
  }
}

export function getAllSlugs(): string[] {
  if (!blogDirExists()) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): BlogPost {
  const full = path.join(BLOG_DIR, `${slug}.mdx`);
  const file = fs.readFileSync(full, "utf8");
  const { content, data } = matter(file);
  return { slug, content, frontmatter: data as BlogFrontmatter };
}

export function getAllPosts(opts?: { includeDrafts?: boolean }): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs.map(getPostBySlug);
  const filtered = posts.filter((p) =>
    opts?.includeDrafts ? true : !p.frontmatter.draft
  );
  return filtered.sort(
    (a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
  );
}

export function filterPosts(posts: BlogPost[], q?: string, tag?: string) {
  let out = posts;
  if (q) {
    const needle = q.toLowerCase();
    out = out.filter((p) =>
      [
        p.frontmatter.title,
        p.frontmatter.excerpt,
        ...(p.frontmatter.tags ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }
  if (tag) {
    out = out.filter((p) => (p.frontmatter.tags ?? []).includes(tag));
  }
  return out;
}

export function paginate<T>(arr: T[], page = 1, per = 9) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / per));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * per;
  return {
    total,
    pages,
    current,
    per,
    items: arr.slice(start, start + per),
  };
}
