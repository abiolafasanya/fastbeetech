// app/blog/[slug]/page.tsx
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogApi } from "@/lib/blog";
import PostContent from "@/components/PostContent";

export const dynamic = "force-static";
export const revalidate = 300;

type PageParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { data: post } = await BlogApi.bySlug(params.slug);
    const cover = post.ogImage || post.cover || "/opengraph-image.png";
    const url = `https://fastbeetech.com/blog/${post.slug}`;
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      alternates: { canonical: post.canonical || url },
      openGraph: {
        type: "article",
        url,
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        publishedTime: post.publishedAt,
        images: [{ url: cover, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: [cover],
      },
    };
  } catch {
    return {
      title: "Post not found | Fastbeetech",
      robots: { index: false, follow: false },
    };
  }
}

export default async function BlogPostPage({ params }: { params: PageParams }) {
  let post;
  try {
    const resp = await BlogApi.bySlug(params.slug);
    post = resp.data;
  } catch {
    notFound();
  }

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto py-12 px-4 max-w-3xl">
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.title}
          width={1200}
          height={630}
          className="w-full rounded-xl mb-6 object-cover"
          priority
        />
      ) : null}

      <h1 className="mb-2">{post.title}</h1>

      <p className="text-sm text-muted-foreground mb-8">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString()
          : "Unpublished"}
        {post.readingTime ? ` · ${post.readingTime} min read` : null}
      </p>

      {/* Set format="markdown" if your API stores Markdown; "html" if it stores rendered HTML */}
      <PostContent content={post.content} format="markdown" />

      {Array.isArray(post.tags) && post.tags.length ? (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full border">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
