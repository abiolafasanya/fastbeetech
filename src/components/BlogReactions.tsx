"use client";

import React, { useState, forwardRef, useEffect, useRef } from "react";
import BlogApi from "@/api/BlogApi";
import { ThumbsUp, Heart, Smile, PartyPopper, Share2 } from "lucide-react";
import { Button } from "./ui/button";

export interface BlogReactionsProps {
  postId: string;
  slug: string;
}

const REACTIONS = [
  {
    type: "like",
    label: <ThumbsUp size={24} color="#22c55e" />,
    color: "#22c55e",
  },
  {
    type: "love",
    label: <Heart size={24} color="#ef4444" />,
    color: "#ef4444",
  },
  {
    type: "clap",
    label: <PartyPopper size={24} color="#f59e42" />,
    color: "#f59e42",
  },
  { type: "wow", label: <Smile size={24} color="#3b82f6" />, color: "#3b82f6" },
];

export const BlogReactions = forwardRef<HTMLDivElement, BlogReactionsProps>(
  function BlogReactions({ postId, slug }, ref) {
    const [reactions, setReactions] = useState<Record<string, number>>({
      like: 0,
      love: 0,
      clap: 0,
      wow: 0,
    });
    const [userReaction, setUserReaction] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showBar, setShowBar] = useState(false);
    const barTimeout = useRef<NodeJS.Timeout | null>(null);

    // Fetch initial reaction counts and user reaction
    useEffect(() => {
      async function fetchReactions() {
        try {
          const res = await BlogApi.getById(postId);
          if (res.status && res.data && res.data.reactions) {
            setReactions(res.data.reactions);
            if (
              res.data.reactionsByUser &&
              Array.isArray(res.data.reactionsByUser)
            ) {
              // Assume backend returns userId in session or as prop
              const userId = res.data.currentUserId || null;
              const userReact = res.data.reactionsByUser.find(
                (r: { user: string; type: string }) => r.user === userId
              );
              if (userReact) setUserReaction(userReact.type);
            }
          }
        } catch {}
      }
      fetchReactions();
    }, [postId]);

    const handleReact = async (type: string) => {
      if (userReaction === type) return;
      setLoading(true);
      try {
        const res = await BlogApi.react(postId, type);
        if (res.status && res.reactions) {
          setReactions(res.reactions);
          setUserReaction(type);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    // Facebook-style hover bar
    const handleMouseEnter = () => {
      if (barTimeout.current) clearTimeout(barTimeout.current);
      setShowBar(true);
    };
    const handleMouseLeave = () => {
      barTimeout.current = setTimeout(() => setShowBar(false), 300);
    };

    return (
      <div
        className="flex gap-4 items-center mb-4"
        ref={ref}
        data-postid={postId}
        data-slug={slug}
      >
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            size={"icon"}
            variant={userReaction ? "default" : "ghost"}
            className={`flex items-center gap-1 transition-colors ${
              userReaction
                ? "bg-gray-200 dark:bg-gray-700 border-primary"
                : "border-gray-300 dark:border-gray-600"
            }`}
            style={{ fontSize: "1.25rem" }}
            aria-label="Like"
          >
            {userReaction ? (
              REACTIONS.find((r) => r.type === userReaction)?.label
            ) : (
              <ThumbsUp size={20} color="#22c55e" />
            )}
            {/* <span className="ml-1">Like</span> */}
          </Button>
          {showBar && (
            <div className="absolute bottom-full left-0 flex gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl px-3 py-2 z-10 border border-gray-200 dark:border-gray-700 animate-fade-in">
              {REACTIONS.map((r) => (
                <Button
                  size={"icon"}
                  key={r.type}
                  className="hover:scale-125 transition-transform"
                  style={{ color: r.color, fontSize: "1.5rem" }}
                  onClick={() => handleReact(r.type)}
                  disabled={loading}
                  aria-label={r.type}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {Object.values(reactions).reduce((a, b) => a + b, 0)}
        </span>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() =>
            navigator.share
              ? navigator.share({ url: window.location.href })
              : navigator.clipboard.writeText(window.location.href)
          }
        >
          <Share2 />
        </Button>
      </div>
    );
  }
);
