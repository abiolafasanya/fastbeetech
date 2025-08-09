import Image from "next/image";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { readingTime } from "@/lib/reading-time";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

const prettyCodeOptions = {
  theme: "github-dark", // or 'min-dark', 'github-light', etc.
  keepBackground: false,
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const { frontmatter } = post;
  const stats = readingTime(post.content);
  const includeDrafts = process.env.NODE_ENV !== "production";
  if (post.frontmatter.draft && !includeDrafts) {
    notFound();
  }

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto py-12 px-4 max-w-3xl">
      {frontmatter.cover ? (
        <Image
          src={frontmatter.cover}
          alt={frontmatter.title}
          width={1200}
          height={630}
          className="w-full rounded-xl mb-6 object-cover"
        />
      ) : null}
      <h1 className="mb-2">{frontmatter.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {new Date(frontmatter.date).toLocaleDateString()} · {stats.minutes} min
        read
      </p>

      {frontmatter.tags?.length ? (
        <div className="flex flex-wrap gap-2 mb-6">
          {frontmatter.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full border">
              {t}
            </span>
          ))}
        </div>
      ) : null}
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              [rehypePrettyCode, prettyCodeOptions],
            ],
          },
        }}
      />
    </article>
  );
}
