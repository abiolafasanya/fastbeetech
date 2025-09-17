"use client";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export default function PostViewTracker({ postId }: { postId: string }) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!postId) return;
    // ensure we only send once per mount
    if (sentRef.current) return;
    sentRef.current = true;

    // fire-and-forget
    trackEvent(postId, "view").catch(() => {
      // swallow errors intentionally for analytics
    });
  }, [postId]);

  return null;
}
