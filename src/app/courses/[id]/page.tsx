"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import courseApi from "@/api/CourseApi";

export default function CourseByIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const redirectToSlug = async () => {
      try {
        // Fetch course to get its slug
        const response = await courseApi.getCourse(id);
        const course = response.data.course;

        // Redirect to the slug-based route
        if (course.slug) {
          router.replace(`/course/${course.slug}`);
        } else {
          // If no slug, redirect to courses page
          router.replace("/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        // Redirect to courses page on error
        router.replace("/courses");
      }
    };

    if (id) {
      redirectToSlug();
    }
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
