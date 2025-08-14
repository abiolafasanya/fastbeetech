"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { MDEditorProps } from "@uiw/react-md-editor";
import type { PluggableList } from "unified";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  value: string;
  onChange: (v: string) => void;
  height?: number;
};

export default function MDXEditor({ value, onChange, height = 240 }: Props) {
  const previewOptions = useMemo<NonNullable<MDEditorProps["previewOptions"]>>(
    () => ({
      remarkPlugins: [remarkGfm] as PluggableList,
      rehypePlugins: [
        [rehypeSlug],
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ] as PluggableList,
    }),
    []
  );

  return (
    <div className="rounded-xl border overflow-hidden" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={height}
        previewOptions={previewOptions}  
        preview="preview"                 // "edit" | "preview" | "live"
        visibleDragbar={false}
      />
    </div>
  );
}
