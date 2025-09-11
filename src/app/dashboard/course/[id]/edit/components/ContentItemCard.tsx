import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseContent } from "@/api/CourseApi";

interface ContentItemProps {
  content: CourseContent;
  moduleIndex: number;
  contentIndex: number;
  updateContent: (
    moduleIndex: number,
    contentIndex: number,
    updates: Partial<CourseContent>
  ) => void;
  removeContent: (moduleIndex: number, contentIndex: number) => void;
}

export function ContentItem({
  content,
  moduleIndex,
  contentIndex,
  updateContent,
  removeContent,
}: ContentItemProps) {
  return (
    <div className="border p-4 rounded space-y-2">
      <div className="flex items-center justify-between">
        <Input
          value={content.title}
          onChange={(e) =>
            updateContent(moduleIndex, contentIndex, {
              title: e.target.value,
            })
          }
          placeholder="Content title"
        />
        <select
          value={content.type}
          onChange={(e) =>
            updateContent(moduleIndex, contentIndex, {
              type: e.target.value as CourseContent["type"],
            })
          }
          className="border rounded px-2 py-1"
        >
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="quiz">Quiz</option>
          <option value="assignment">Assignment</option>
          <option value="resource">Resource</option>
        </select>
      </div>

      <Textarea
        value={content.description || ""}
        onChange={(e) =>
          updateContent(moduleIndex, contentIndex, {
            description: e.target.value,
          })
        }
        placeholder="Content description"
      />

      {content.type === "video" && (
        <Input
          placeholder="Video URL"
          value={(content.videoUrl as string) || ""}
          onChange={(e) =>
            updateContent(moduleIndex, contentIndex, {
              videoUrl: e.target.value,
            })
          }
        />
      )}

      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="destructive"
          onClick={() => removeContent(moduleIndex, contentIndex)}
        >
          Remove Content
        </Button>
      </div>
    </div>
  );
}
