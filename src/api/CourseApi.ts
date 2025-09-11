import QueryBuilder from "@/lib/utils";
import axios from "axios";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  coInstructors?: Array<{
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  thumbnail: string;
  previewVideo?: string;
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  status: "draft" | "published" | "archived" | "coming-soon";
  category: string;
  subcategory?: string;
  tags: string[];
  language: string;
  price: number;
  originalPrice?: number;
  currency: string;
  isFree: boolean;
  modules: CourseModule[];
  totalDuration: number;
  totalLessons: number;
  totalQuizzes: number;
  whatYouWillLearn: string[];
  prerequisites: string[];
  targetAudience: string[];
  totalEnrollments: number;
  activeEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  allowComments: boolean;
  allowDownloads: boolean;
  certificate: boolean;
  certificateTemplate?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  publishedAt?: string;
  lastUpdated: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  contents: CourseContent[];
  quiz?: CourseQuiz;
  estimatedDuration?: number;
}

export interface CourseContent {
  _id?: string;
  title: string;
  description?: string;
  type: "video" | "text" | "quiz" | "assignment" | "resource";
  order: number;
  duration?: number;
  videoUrl?: string;
  videoId?: string;
  transcript?: string;
  textContent?: string;
  quiz?: CourseQuiz;
  resources?: Array<{
    title: string;
    url: string;
    type: "pdf" | "zip" | "link" | "other";
  }>;
  isPreview: boolean;
}

export interface CourseQuiz {
  _id?: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  showAnswers: boolean;
  order: number;
  isRequired: boolean;
}

export interface QuizQuestion {
  _id?: string;
  question: string;
  type: "multiple-choice" | "true-false" | "fill-blank" | "code-review";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface CourseEnrollment {
  _id: string;
  user: string;
  course: string | Course;
  status: "enrolled" | "in-progress" | "completed" | "dropped";
  progress: {
    completedContents: string[];
    completedQuizzes: string[];
    totalContents: number;
    totalQuizzes: number;
    progressPercentage: number;
    lastAccessedContent?: string;
  };
  enrollmentDate: string;
  completionDate?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  quizAttempts: Array<{
    quiz: string;
    attempts: Array<{
      score: number;
      completedAt: string;
      answers: Record<string, unknown>;
    }>;
  }>;
  rating?: {
    stars: number;
    review?: string;
    createdAt: string;
  };
}

export interface CourseReview {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  course: string;
  rating: number;
  review: string;
  helpful: number;
  helpfulByUsers: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  slug?: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo?: string;
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  status?: "draft" | "published" | "archived" | "coming-soon";
  category: string;
  subcategory?: string;
  tags: string[];
  language?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  isFree: boolean;
  modules: CourseModule[];
  whatYouWillLearn: string[];
  prerequisites?: string[];
  targetAudience: string[];
  allowComments?: boolean;
  allowDownloads?: boolean;
  certificate?: boolean;
  certificateTemplate?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    courses?: T[];
    enrollments?: T[];
    reviews?: T[];
    [key: string]: T[] | unknown;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Create axios instance with auth
// const createAuthenticatedApi = () => {
//   const api = axios.create({
//     baseURL: API_BASE_URL,
//   });

//   api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   return api;
// };

class CourseApi {
  private readonly url = "/api/v1";
  // Public course endpoints
  async getAllCourses(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      subcategory?: string;
      level?: string;
      price?: string;
      rating?: number;
      sortBy?: string;
      instructor?: string;
      tags?: string[];
      duration?: string;
      language?: string;
      featured?: boolean;
      bestseller?: boolean;
      status?: string;
    } = {}
  ): Promise<PaginatedResponse<Course>> {
    const queryBuilder = new QueryBuilder(`${this.url}/courses`);
    if (params.page) queryBuilder.set("page", params.page);
    if (params.limit) queryBuilder.set("limit", params.limit);
    if (params.search) queryBuilder.set("search", params.search);
    if (params.category) queryBuilder.set("category", params.category);
    if (params.subcategory) queryBuilder.set("subcategory", params.subcategory);
    if (params.level) queryBuilder.set("level", params.level);
    if (params.price) queryBuilder.set("price", params.price);
    if (params.rating) queryBuilder.set("rating", params.rating);
    if (params.sortBy) queryBuilder.set("sortBy", params.sortBy);
    if (params.instructor) queryBuilder.set("instructor", params.instructor);
    // const response = await axios.get(`${this.url}/courses`, { params });
    if (params.tags) queryBuilder.set("tags", params.tags.join(","));
    if (params.duration) queryBuilder.set("duration", params.duration);
    if (params.language) queryBuilder.set("language", params.language);
    if (params.featured !== undefined)
      queryBuilder.set("featured", params.featured);
    if (params.bestseller !== undefined)
      queryBuilder.set("bestseller", params.bestseller);
    if (params.status) queryBuilder.set("status", params.status);
    const query = queryBuilder.build();
    const response = await axios.get(query);
    return response.data;
  }

  async getCourse(idOrSlug: string): Promise<ApiResponse<{ course: Course }>> {
    const response = await axios.get(`${this.url}/courses/${idOrSlug}`);
    return response.data;
  }

  async getReviews(
    courseId: string,
    params: { page?: number; limit?: number; sortBy?: string } = {}
  ): Promise<PaginatedResponse<CourseReview>> {
    const response = await axios.get(
      `${this.url}/courses/${courseId}/reviews`,
      {
        params,
      }
    );
    return response.data;
  }

  async getCategories(): Promise<
    ApiResponse<{
      categories: Array<{
        _id: string;
        count: number;
        subcategories: string[];
      }>;
    }>
  > {
    const response = await axios.get(`${this.url}/categories`);
    return response.data;
  }

  async getInstructors(): Promise<
    ApiResponse<{
      instructors: Array<{
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        courseCount: number;
        avgRating: number;
        totalEnrollments: number;
      }>;
    }>
  > {
    const response = await axios.get(`${this.url}/instructors`);
    return response.data;
  }

  // Authenticated course endpoints
  async createCourse(
    data: CreateCourseData
  ): Promise<ApiResponse<{ course: Course }>> {
    const response = await axios.post(`${this.url}/courses`, data);
    return response.data;
  }

  async updateCourse(
    id: string,
    data: Partial<CreateCourseData>
  ): Promise<ApiResponse<{ course: Course }>> {
    const response = await axios.put(`${this.url}/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    const response = await axios.delete(`${this.url}/courses/${id}`);
    return response.data;
  }

  async publishCourse(id: string): Promise<ApiResponse<{ course: Course }>> {
    const response = await axios.patch(`${this.url}/courses/${id}/publish`);
    return response.data;
  }

  // Enrollment endpoints
  async enrollInCourse(
    courseId: string
  ): Promise<ApiResponse<{ enrollment: CourseEnrollment }>> {
    const response = await axios.post(`${this.url}/courses/${courseId}/enroll`);
    return response.data;
  }

  async unenrollFromCourse(
    courseId: string
  ): Promise<ApiResponse<{ enrollment: CourseEnrollment }>> {
    const response = await axios.post(
      `${this.url}/courses/${courseId}/unenroll`
    );
    return response.data;
  }

  async getMyCourses(
    params: {
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedResponse<CourseEnrollment>> {
    const response = await axios.get(`${this.url}/my-courses`, { params });
    return response.data;
  }

  // Instructor dashboard endpoints
  async getInstructorCourses(
    params: {
      status?: string;
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<PaginatedResponse<Course>> {
    const response = await axios.get(`${this.url}/dashboard/courses`, {
      params,
    });
    return response.data as PaginatedResponse<Course>;
  }

  // Get single course for instructor (includes draft/unpublished courses)
  async getInstructorCourse(
    idOrSlug: string
  ): Promise<ApiResponse<{ course: Course }>> {
    const response = await axios.get(
      `${this.url}/dashboard/courses/${idOrSlug}`
    );
    return response.data;
  }

  // Progress endpoints
  async updateProgress(
    courseId: string,
    data: { contentId: string; completed: boolean; duration?: number }
  ): Promise<ApiResponse<{ enrollment: CourseEnrollment }>> {
    const response = await axios.put(
      `${this.url}/courses/${courseId}/progress`,
      data
    );
    return response.data;
  }

  async getProgress(
    courseId: string
  ): Promise<ApiResponse<{ enrollment: CourseEnrollment }>> {
    const response = await axios.get(
      `${this.url}/courses/${courseId}/progress`
    );
    return response.data;
  }

  // Quiz endpoints
  async submitQuiz(
    courseId: string,
    quizId: string,
    data: { answers: Record<string, unknown> }
  ): Promise<
    ApiResponse<{
      score: number;
      passed: boolean;
      enrollment: CourseEnrollment;
    }>
  > {
    const response = await axios.post(
      `${this.url}/courses/${courseId}/quiz/${quizId}/attempt`,
      data
    );
    return response.data;
  }

  // Review endpoints
  async addReview(
    courseId: string,
    data: { rating: number; review: string }
  ): Promise<ApiResponse<{ review: CourseReview }>> {
    const response = await axios.post(
      `${this.url}/courses/${courseId}/review`,
      data
    );
    return response.data;
  }

  async markReviewHelpful(
    reviewId: string,
    data: { helpful: boolean }
  ): Promise<ApiResponse<{ helpful: number; userMarkedHelpful: boolean }>> {
    const response = await axios.put(
      `${this.url}/reviews/${reviewId}/helpful`,
      data
    );
    return response.data;
  }

  // Analytics endpoints
  async getAnalytics(
    courseId: string,
    params: { dateFrom?: string; dateTo?: string; granularity?: string } = {}
  ): Promise<ApiResponse<{ analytics: unknown }>> {
    const response = await axios.get(
      `${this.url}/courses/${courseId}/analytics`,
      {
        params,
      }
    );
    return response.data;
  }

  // Admin endpoints
  async bulkUpdate(data: {
    courseIds: string[];
    operation:
      | "publish"
      | "unpublish"
      | "archive"
      | "delete"
      | "feature"
      | "unfeature";
    value?: unknown;
  }): Promise<ApiResponse<void>> {
    const response = await axios.post(`${this.url}/admin/courses/bulk`, data);
    return response.data;
  }
}

const courseApi = new CourseApi();

export default courseApi;
