import  CourseApi  from "@/api/CourseApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { CourseApi } from "../../../../api/CourseApi";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCourseMutations = () => {
  const queryClient = useQueryClient();
  // const router = useRouter();
  const create = useMutation({
    mutationFn: CourseApi.createCourse,
    onSuccess: (data) => {
      console.log("Course created successfully:", data);
      toast.success("Course created successfully!");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      // router.push("/dashboard/course");
    },
    onError: (error) => {
      toast.error("Failed to create course. Please try again.");
      console.error("Error creating course:", error);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      CourseApi.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });

  const remove = useMutation({
    mutationFn: CourseApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const publish = useMutation({
    mutationFn: CourseApi.publishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const feature = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      CourseApi.updateCourse(id, { isFeatured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const enroll = useMutation({
    mutationFn: CourseApi.enrollInCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
  });

  const unenroll = useMutation({
    mutationFn: CourseApi.unenrollFromCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
  });

  const updateProgress = useMutation({
    mutationFn: ({
      courseId,
      contentId,
      completed,
    }: {
      courseId: string;
      contentId: string;
      completed: boolean;
    }) => CourseApi.updateProgress(courseId, { contentId, completed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", variables.courseId],
      });
    },
  });

  const submitQuiz = useMutation({
    mutationFn: ({
      courseId,
      quizId,
      answers,
    }: {
      courseId: string;
      quizId: string;
      answers: Record<string, unknown>;
    }) => CourseApi.submitQuiz(courseId, quizId, { answers }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", variables.courseId],
      });
    },
  });

  const addReview = useMutation({
    mutationFn: ({
      courseId,
      rating,
      review,
    }: {
      courseId: string;
      rating: number;
      review: string;
    }) => CourseApi.addReview(courseId, { rating, review }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-reviews", variables.courseId],
      });
    },
  });

  const markHelpful = useMutation({
    mutationFn: ({
      reviewId,
      helpful,
    }: {
      reviewId: string;
      helpful: boolean;
    }) => CourseApi.markReviewHelpful(reviewId, { helpful }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews"] });
    },
  });

  const bulkUpdate = useMutation({
    mutationFn: CourseApi.bulkUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
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
    markHelpful,
    bulkUpdate,
  };
};
