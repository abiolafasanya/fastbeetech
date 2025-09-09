"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CourseApi, {
  CourseModule,
  CourseContent,
  Course,
} from "@/api/CourseApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CourseEditor() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const courseId = params?.id;

  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    CourseApi.getCourse(courseId)
      .then((res) => {
        const course = res.data.course as Course;
        setTitle(course.title || "");
        setModules(course.modules || []);
      })
      .catch(() => {
        toast.error("Failed to load course");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "New Module",
        description: "",
        order: modules.length + 1,
        contents: [
          {
            title: "New Content",
            description: "",
            type: "text",
            order: 1,
            isPreview: false,
          } as CourseContent,
        ],
      } as CourseModule,
    ]);
  };

  const updateModule = (index: number, patch: Partial<CourseModule>) => {
    setModules((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...patch } : m))
    );
  };

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const addContent = (moduleIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              contents: [
                ...m.contents,
                {
                  title: "New Content",
                  description: "",
                  type: "text",
                  order: m.contents.length + 1,
                  isPreview: false,
                } as CourseContent,
              ],
            }
          : m
      )
    );
  };

  const updateContent = (
    moduleIndex: number,
    contentIndex: number,
    patch: Partial<CourseContent>
  ) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              contents: m.contents.map((c, ci) =>
                ci === contentIndex ? { ...c, ...patch } : c
              ),
            }
          : m
      )
    );
  };

  const removeContent = (moduleIndex: number, contentIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              contents: m.contents.filter((_, ci) => ci !== contentIndex),
            }
          : m
      )
    );
  };

  const sanitizeModules = (mods: CourseModule[]) => {
    return mods.map((m) => ({
      ...m,
      description: m.description?.trim() || undefined,
      contents: m.contents
        .map((c) => {
          const content: CourseContent = { ...c } as CourseContent;
          if (
            typeof content.videoUrl === "string" &&
            content.videoUrl.trim() === ""
          ) {
            const rec = content as unknown as Record<string, unknown>;
            delete rec.videoUrl;
          }
          if (Array.isArray(content.resources)) {
            content.resources = content.resources
              .map((r) => ({
                ...r,
                title: r.title?.trim(),
                url: r.url?.trim(),
              }))
              .filter((r) => r.title && r.url) as CourseContent["resources"];
          }
          return content;
        })
        .filter((c) => c.title && c.type),
    }));
  };

  const onSave = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const payload = {
        modules: sanitizeModules(modules),
      };
      await CourseApi.updateCourse(courseId, payload);
      toast.success("Modules updated");
      router.push("/dashboard/course");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update modules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Modules - {title}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/dashboard/course")}
            variant="outline"
          >
            Back
          </Button>
          <Button onClick={onSave}>
            {loading ? "Saving..." : "Save Modules"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((m, mi) => (
          <Card key={mi}>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>
                <Input
                  value={m.title}
                  onChange={(e) => updateModule(mi, { title: e.target.value })}
                />
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => addContent(mi)}>
                  Add Content
                </Button>
                <Button variant="destructive" onClick={() => removeModule(mi)}>
                  Remove Module
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {m.contents.map((c, ci) => (
                  <div key={ci} className="p-2 border rounded">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={c.title}
                        onChange={(e) =>
                          updateContent(mi, ci, { title: e.target.value })
                        }
                      />
                      <select
                        value={c.type}
                        onChange={(e) =>
                          updateContent(mi, ci, {
                            type: e.target.value as CourseContent["type"],
                          })
                        }
                      >
                        <option value="video">Video</option>
                        <option value="text">Text</option>
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                        <option value="resource">Resource</option>
                      </select>
                    </div>
                    <Textarea
                      value={c.description || ""}
                      onChange={(e) =>
                        updateContent(mi, ci, { description: e.target.value })
                      }
                    />
                    {c.type === "video" && (
                      <Input
                        placeholder="Video URL"
                        value={(c.videoUrl as string) || ""}
                        onChange={(e) =>
                          updateContent(mi, ci, { videoUrl: e.target.value })
                        }
                      />
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="destructive"
                        onClick={() => removeContent(mi, ci)}
                      >
                        Remove Content
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Button onClick={addModule}>Add Module</Button>
      </div>
    </div>
  );
}
