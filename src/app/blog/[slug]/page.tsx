// app/blog/[slug]/page.tsx
import Image from "next/image";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogApi } from "@/lib/blog";
import PostContent from "@/components/PostContent";
import BlogEngagement from "@/components/BlogEngagement";
import PostViewTracker from "@/components/PostViewTracker";
import { demoBlogs, DemoBlog } from "@/data/blog";
// BlogPost type not required in this file after demo redirect behavior

export const dynamic = "force-static";
export const revalidate = 300;

type PageParams = { slug: string };

// ✅ In Next 15, params is a Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  try {
    const { slug } = await params; // <-- await it
    const { data: post } = await BlogApi.bySlug(slug);
    const cover = post.ogImage || post.cover || "/opengraph-image.png";
    const url = `${process.env.NEXT_PUBLIC_SITE_URL!}/blog/${post.slug}`;
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
      title: "Post not found | Hexonest",
      robots: { index: false, follow: false },
    };
  }
}

// ✅ Same for the page component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params; // <-- await it

  let post;
  try {
    const resp = await BlogApi.bySlug(slug);
    post = resp.data;
  } catch {
    // If the API fails or returns 404, redirect demo post slugs to the blog listing per UX preference
    const demo = demoBlogs.find((d) => d.slug === slug) as DemoBlog | undefined;
    if (demo) {
      // Redirect demo/demo-only content to the main blog listing
      redirect("/blog");
    } else {
      notFound();
    }
  }

  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto py-12 px-4 max-w-3xl">
      {/* client-side tracker to record a view event for real posts (has an _id) */}
      {post._id ? <PostViewTracker postId={post._id} /> : null}
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

      <PostContent content={post.content} format="markdown" />

      {Array.isArray(post.tags) && post.tags.length ? (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((t: string) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full border">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Blog comments and reactions (only for real posts) */}
      {post._id ? <BlogEngagement postId={post._id} slug={post.slug} /> : null}
    </article>
  );
}
