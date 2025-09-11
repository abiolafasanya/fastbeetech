"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourse, useUpdateCourse } from "@/hooks/course";
import { Course } from "@/api/CourseApi";

// Import our modular tab components
import { BasicInformationTab } from "./components/BasicInformationTab";
import { CourseContentTab } from "./components/CourseContentTab";
import { LearningObjectivesTab } from "./components/LearningObjectivesTab";
import { PricingTab } from "./components/PricingTab";

// Enhanced course schema for comprehensive validation
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortDescription: z
    .string()
    .min(20, "Short description must be at least 20 characters")
    .max(200, "Short description must not exceed 200 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  thumbnail: z.string().min(1, "Please provide a thumbnail"),
  previewVideo: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "all-levels"]),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  isFree: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CourseEditor() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const courseId = params?.id;

  // Hooks for data management
  const { data: courseData, isLoading } = useCourse(courseId);
  const updateMutation = useUpdateCourse();

  // UI state
  const [activeTab, setActiveTab] = useState("basic");
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [isUploadMode, setIsUploadMode] = useState(false);

  // Course content state
  const [modules, setModules] = useState<Course["modules"]>([]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState<string[]>([""]);

  // Form setup
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

  // Load course data when available
  useEffect(() => {
    if (courseData?.data?.course) {
      const course = courseData.data.course as Course;

      // Set form values
      form.reset({
        title: course.title || "",
        shortDescription: course.shortDescription || "",
        description: course.description || "",
        thumbnail: course.thumbnail || "",
        previewVideo: course.previewVideo || "",
        level: course.level || "beginner",
        category: course.category || "",
        subcategory: course.subcategory || "",
        price: course.price || 0,
        isFree: course.isFree || false,
      });

      // Set course content
      setModules(course.modules || []);
      setWhatYouWillLearn(course.whatYouWillLearn || [""]);
      setPrerequisites(course.prerequisites || [""]);
      setTargetAudience(course.targetAudience || [""]);
    }
  }, [courseData, form]);

  // Form submission
  const onSubmit = async (data: CourseFormData) => {
    try {
      const courseData = {
        ...data,
        modules: modules.filter((m) => m.title && m.contents.length > 0),
        whatYouWillLearn: whatYouWillLearn.filter((item) => item.trim() !== ""),
        prerequisites: prerequisites.filter((item) => item.trim() !== ""),
        targetAudience: targetAudience.filter((item) => item.trim() !== ""),
      };

      await updateMutation.mutateAsync({
        id: courseId,
        data: courseData,
      });

      toast.success("Course updated successfully!");
      router.push("/dashboard/course");
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Course update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Loading Course...</h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">
              Update your course content and settings
            </p>
          </div>
        </div>
        <Button
          type="submit"
          form="course-form"
          disabled={updateMutation.isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Form {...form}>
        <form
          id="course-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="objectives">Learning Goals</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <BasicInformationTab
                form={form}
                isUploadMode={isUploadMode}
                setIsUploadMode={setIsUploadMode}
                thumbnailFiles={thumbnailFiles}
                setThumbnailFiles={setThumbnailFiles}
              />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <CourseContentTab modules={modules} setModules={setModules} />
            </TabsContent>

            <TabsContent value="objectives" className="space-y-6">
              <LearningObjectivesTab
                whatYouWillLearn={whatYouWillLearn}
                setWhatYouWillLearn={setWhatYouWillLearn}
                prerequisites={prerequisites}
                setPrerequisites={setPrerequisites}
                targetAudience={targetAudience}
                setTargetAudience={setTargetAudience}
              />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <PricingTab form={form} />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
