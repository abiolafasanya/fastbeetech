"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseMutations } from "../hooks/useCourseMutation";
import { CreateCourseData, CourseModule, CourseContent } from "@/api/CourseApi";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortDescription: z
    .string()
    .min(20, "Short description must be at least 20 characters")
    .max(200),
  description: z.string().min(50, "Description must be at least 50 characters"),
  thumbnail: z.string().url("Please enter a valid thumbnail URL"),
  previewVideo: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "all-levels"]),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  isFree: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { create } = useCourseMutations();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      thumbnail: "",
      previewVideo: "",
      level: "beginner",
      category: "",
      subcategory: "",
      price: 0,
      isFree: false,
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const newOutcomes = [...whatYouWillLearn];
    newOutcomes[index] = value;
    setWhatYouWillLearn(newOutcomes);
  };

  const addLearningOutcome = () => {
    setWhatYouWillLearn([...whatYouWillLearn, ""]);
  };

  const removeLearningOutcome = (index: number) => {
    if (whatYouWillLearn.length > 1) {
      setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index));
    }
  };

  const updateTargetAudience = (index: number, value: string) => {
    const newAudience = [...targetAudience];
    newAudience[index] = value;
    setTargetAudience(newAudience);
  };

  const addTargetAudience = () => {
    setTargetAudience([...targetAudience, ""]);
  };

  const removeTargetAudience = (index: number) => {
    if (targetAudience.length > 1) {
      setTargetAudience(targetAudience.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      // generate slug from title (server expects slug)
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

      // sanitize modules and nested contents: remove empty strings for optional URL fields
      const sanitizeModules = (mods: CourseModule[]) => {
        return mods.map((m) => ({
          ...m,
          description: m.description?.trim() || undefined,
          contents: m.contents.map((c: CourseContent) => {
            const content: CourseContent = { ...c } as CourseContent;
            // treat empty videoUrl as undefined so zod optional won't validate empty string as invalid URL
            if (
              typeof content.videoUrl === "string" &&
              content.videoUrl.trim() === ""
            ) {
              const record = content as unknown as Record<string, unknown>;
              delete record.videoUrl;
            }
            if (
              typeof content.transcript === "string" &&
              content.transcript.trim() === ""
            ) {
              const record = content as unknown as Record<string, unknown>;
              delete record.transcript;
            }
            if (
              typeof content.textContent === "string" &&
              content.textContent.trim() === ""
            ) {
              const record = content as unknown as Record<string, unknown>;
              delete record.textContent;
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
          }),
        }));
      };

      const defaultModules: CreateCourseData["modules"] = [
        {
          title: "Introduction",
          description: "Course introduction and overview",
          order: 1,
          contents: [
            {
              title: "Welcome to the Course",
              type: "video",
              order: 1,
              isPreview: true,
              description: "Course overview and welcome message",
              // don't send empty string for videoUrl
            },
          ],
        },
      ];

      const rawModules = defaultModules; // currently using default modules; extend UI later to edit modules

      const courseData: CreateCourseData = {
        ...data,
        slug: slugify(data.title),
        tags,
        whatYouWillLearn: whatYouWillLearn.filter((item) => item.trim() !== ""),
        targetAudience: targetAudience.filter((item) => item.trim() !== ""),
        prerequisites: prerequisites.filter((item) => item.trim() !== ""),
        // sanitize previewVideo: if empty string, remove it
        previewVideo: data.previewVideo?.trim()
          ? data.previewVideo.trim()
          : undefined,
        modules: sanitizeModules(rawModules),
      };

      console.log("Submitting course data:", courseData);
      await create.mutateAsync(courseData);
      // toast.success("Course created successfully!");
      // router.push("/dashboard/course");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Design your course curriculum and content
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your course (max 200 characters)..."
                        className="resize-none"
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of your course..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previewVideo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preview Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="all-levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium">
                        This is a free course
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {!form.watch("isFree") && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags */}
              <div>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <FormLabel>What Students Will Learn</FormLabel>
                {whatYouWillLearn.map((outcome, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder={`Learning outcome ${index + 1}`}
                      value={outcome}
                      onChange={(e) =>
                        updateLearningOutcome(index, e.target.value)
                      }
                    />
                    {whatYouWillLearn.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLearningOutcome(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addLearningOutcome}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Learning Outcome
                </Button>
              </div>

              {/* Target Audience */}
              <div>
                <FormLabel>Target Audience</FormLabel>
                {targetAudience.map((audience, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder={`Target audience ${index + 1}`}
                      value={audience}
                      onChange={(e) =>
                        updateTargetAudience(index, e.target.value)
                      }
                    />
                    {targetAudience.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTargetAudience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addTargetAudience}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Target Audience
                </Button>
              </div>

              {/* Prerequisites */}
              <div>
                <FormLabel>Prerequisites (Optional)</FormLabel>
                {prerequisites.map((prereq, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder={`Prerequisite ${index + 1}`}
                      value={prereq}
                      onChange={(e) => {
                        const newPrereq = [...prerequisites];
                        newPrereq[index] = e.target.value;
                        setPrerequisites(newPrereq);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPrerequisites(
                          prerequisites.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setPrerequisites([...prerequisites, ""])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prerequisite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? (
                <>
                  <span className="animate-spin mr-2">⚪</span>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
