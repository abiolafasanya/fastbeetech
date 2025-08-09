import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(({ slug, frontmatter }) => {
      const url = `${SITE}/blog/${slug}`;
      return `
      <item>
        <title><![CDATA[${frontmatter.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>
        ${
          frontmatter.excerpt
            ? `<description><![CDATA[${frontmatter.excerpt}]]></description>`
            : ""
        }
      </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Fastbeetech Blog</title>
      <link>${SITE}</link>
      <description>Insights, tutorials, updates and engineering stories.</description>
      <language>en-us</language>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
