import { useQuery } from "@tanstack/react-query";
import CourseApi from "@/api/CourseApi";

interface UseCoursesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  category?: string;
  instructor?: string;
}

export const useCourses = (params: UseCoursesParams = {}) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => CourseApi.getAllCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => CourseApi.getCourse(id),
    enabled: !!id,
  });
};

export const useMyCourses = (
  params: { status?: string; page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["my-courses", params],
    queryFn: () => CourseApi.getMyCourses(params),
  });
};

export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: () => CourseApi.getProgress(courseId),
    enabled: !!courseId,
  });
};

export const useCourseReviews = (
  courseId: string,
  params: { page?: number; limit?: number; sortBy?: string } = {}
) => {
  return useQuery({
    queryKey: ["course-reviews", courseId, params],
    queryFn: () => CourseApi.getReviews(courseId, params),
    enabled: !!courseId,
  });
};

export const useCourseAnalytics = (
  courseId: string,
  params: { dateFrom?: string; dateTo?: string } = {}
) => {
  return useQuery({
    queryKey: ["course-analytics", courseId, params],
    queryFn: () => CourseApi.getAnalytics(courseId, params),
    enabled: !!courseId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CourseApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInstructors = () => {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: () => CourseApi.getInstructors(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInstructorCourses = (
  params: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}
) => {
  return useQuery({
    queryKey: ["instructor-courses", params],
    queryFn: () => CourseApi.getInstructorCourses(params),
  });
};
