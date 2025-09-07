"use client";
import React, { Suspense } from "react";
import { BlogComments } from "./BlogComments";
import { BlogReactions } from "./BlogReactions";

export default function BlogEngagement({
  postId,
  slug,
}: {
  postId: string;
  slug: string;
}) {
  return (
    <section className="mt-12">
      <Suspense fallback={<div>Loading reactions...</div>}>
        <BlogReactions postId={postId} slug={slug} />
      </Suspense>
      <hr className="my-8" />
      <Suspense fallback={<div>Loading comments...</div>}>
        <BlogComments postId={postId} slug={slug} />
      </Suspense>
    </section>
  );
}
