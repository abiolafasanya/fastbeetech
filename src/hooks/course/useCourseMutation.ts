import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CourseApi, { type CreateCourseData } from "@/api/CourseApi";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseData) => CourseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to create course");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCourseData>;
    }) => CourseApi.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update course");
    },
  });
};

export const useRemoveCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CourseApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course removed successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to remove course");
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => CourseApi.publishCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course published successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to publish course");
    },
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => CourseApi.enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Successfully enrolled in course");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to enroll in course"
      );
    },
  });
};

export const useUnenrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => CourseApi.unenrollFromCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Successfully unenrolled from course");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to unenroll from course"
      );
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: { contentId: string; completed: boolean; duration?: number };
    }) => CourseApi.updateProgress(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update progress");
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      quizId,
      data,
    }: {
      courseId: string;
      quizId: string;
      data: { answers: Record<string, unknown> };
    }) => CourseApi.submitQuiz(courseId, quizId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", variables.courseId],
      });
      toast.success("Quiz submitted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    },
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: { rating: number; review: string };
    }) => CourseApi.addReview(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-reviews", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Review added successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to add review");
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: { helpful: boolean };
    }) => CourseApi.markReviewHelpful(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-reviews"],
      });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to mark review as helpful"
      );
    },
  });
};

export const useBulkUpdateCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      courseIds: string[];
      operation:
        | "publish"
        | "unpublish"
        | "archive"
        | "delete"
        | "feature"
        | "unfeature";
      value?: unknown;
    }) => CourseApi.bulkUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Courses updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update courses");
    },
  });
};

// Backward compatibility export - combining all mutations into one hook
export const useCourseMutations = () => {
  const queryClient = useQueryClient();

  const create = useCreateCourse();
  const update = useUpdateCourse();
  const remove = useRemoveCourse();
  const publish = usePublishCourse();
  const enroll = useEnrollCourse();
  const unenroll = useUnenrollCourse();
  const updateProgress = useUpdateProgress();
  const submitQuiz = useSubmitQuiz();
  const addReview = useAddReview();
  const markReviewHelpful = useMarkReviewHelpful();
  const bulkUpdate = useBulkUpdateCourses();

  // Feature hook for backward compatibility
  const feature = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      CourseApi.updateCourse(id, { isFeatured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update course");
    },
  });

  return {
    create,
    update,
    remove,
    publish,
    feature,
    enroll,
    unenroll,
    updateProgress,
    submitQuiz,
    addReview,
    markReviewHelpful,
    bulkUpdate,
  };
};
