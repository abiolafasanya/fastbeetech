// components/PostContent.tsx
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import DOMPurify from "isomorphic-dompurify";

export default function PostContent({
  content,
  format,
}: {
  content: string;
  format: "markdown" | "html";
}) {
  if (format === "html") {
    const clean = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
    return <div dangerouslySetInnerHTML={{ __html: clean }} />;
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ]}
    >
      {content}
    </ReactMarkdown>
  );
}
