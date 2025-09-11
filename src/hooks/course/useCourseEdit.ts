import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import CourseApi, { Course, CourseModule } from "@/api/CourseApi";
import { useCourseModules } from "./useCourseModules";
import { useCourseArrays } from "./useCourseArrays";
import { useCourseUpload } from "./useCourseUpload";

// Schema definition
export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortDescription: z
    .string()
    .min(20, "Short description must be at least 20 characters")
    .max(200),
  description: z.string().min(50, "Description must be at least 50 characters"),
  thumbnail: z.string().min(1, "Please provide a thumbnail"),
  previewVideo: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "all-levels"]),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  isFree: z.boolean(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

interface UseCourseEditProps {
  courseId: string;
}

export function useCourseEdit({ courseId }: UseCourseEditProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Form setup with initial empty values - will be populated via form.reset()
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

  // Initialize custom hooks
  const moduleHooks = useCourseModules();
  const arrayHooks = useCourseArrays();
  const uploadHooks = useCourseUpload({ form });

  // Fetch course data
  const {
    data: courseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => CourseApi.getCourse(courseId),
    enabled: !!courseId,
    retry: 2, // Retry failed requests twice
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Course>) =>
      CourseApi.updateCourse(courseId, data),
    onSuccess: () => {
      toast.success("Course updated successfully!");
      router.push("/dashboard/course");
    },
    onError: (error) => {
      toast.error("Failed to update course");
      console.error("Course update error:", error);
    },
  });

  // Load course data into form when available
  useEffect(() => {
    if (courseData?.data?.course) {
      const course = courseData.data.course as Course;

      // Set form values with better defaults
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

      // Set modules with proper default
      moduleHooks.setModules(course.modules || []);

      // Set learning objectives with better handling of empty arrays
      arrayHooks.setWhatYouWillLearn(
        course.whatYouWillLearn && course.whatYouWillLearn.length > 0
          ? course.whatYouWillLearn
          : [""]
      );

      arrayHooks.setPrerequisites(
        course.prerequisites && course.prerequisites.length > 0
          ? course.prerequisites
          : [""]
      );

      arrayHooks.setTargetAudience(
        course.targetAudience && course.targetAudience.length > 0
          ? course.targetAudience
          : [""]
      );

      // Set upload mode based on existing thumbnail
      uploadHooks.initializeUploadMode(course.thumbnail);

      // Log for debugging
      console.log("Course data loaded:", {
        title: course.title,
        modules: course.modules?.length,
        whatYouWillLearn: course.whatYouWillLearn?.length,
        prerequisites: course.prerequisites?.length,
        targetAudience: course.targetAudience?.length,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData]); // Only depend on courseData to avoid infinite loops

  // Submit handler
  const onSubmit = async (data: CourseFormData) => {
    try {
      // Helper function to clean up empty fields
      const sanitizeModules = (modules: CourseModule[]) =>
        modules.map((module) => ({
          ...module,
          contents: module.contents.map((content) => {
            // Remove empty videoUrl and transcript fields
            if (
              typeof content.videoUrl === "string" &&
              content.videoUrl.trim() === ""
            ) {
              delete (content as unknown as Record<string, unknown>).videoUrl;
            }
            if (
              typeof content.transcript === "string" &&
              content.transcript.trim() === ""
            ) {
              delete (content as unknown as Record<string, unknown>).transcript;
            }
            return content;
          }),
        }));

      const courseUpdateData = {
        ...data,
        modules: sanitizeModules(moduleHooks.modules),
        whatYouWillLearn: arrayHooks.whatYouWillLearn.filter(
          (item: string) => item.trim() !== ""
        ),
        prerequisites: arrayHooks.prerequisites.filter(
          (item: string) => item.trim() !== ""
        ),
        targetAudience: arrayHooks.targetAudience.filter(
          (item: string) => item.trim() !== ""
        ),
      };

      await updateMutation.mutateAsync(courseUpdateData);
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Course update error:", error);
    }
  };

  return {
    // Form
    form,
    onSubmit,
    activeTab,
    setActiveTab,

    // Course data
    courseData,
    isLoading,
    error,

    // Mutations
    updateMutation,

    // Module hooks
    ...moduleHooks,

    // Array hooks
    ...arrayHooks,

    // Upload hooks
    ...uploadHooks,
  };
}
