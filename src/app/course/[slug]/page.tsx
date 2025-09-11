"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Globe,
  Award,
  Download,
  Heart,
  Share,
  ChevronRight,
  ChevronDown,
  Lock,
  PlayCircle,
  FileText,
  HelpCircle,
  Target,
  Shield,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Course, CourseModule } from "@/api/CourseApi";
import courseApi from "@/api/CourseApi";

interface CourseReview {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  isHelpful: number;
}

// Mock reviews data - replace with actual API call
const mockReviews: CourseReview[] = [
  {
    id: "1",
    user: { name: "Sarah Johnson", avatar: "/placeholder-avatar.jpg" },
    rating: 5,
    comment:
      "Excellent course! The instructor explains complex concepts in a very clear and understandable way.",
    date: "2024-01-15",
    isHelpful: 12,
  },
  {
    id: "2",
    user: { name: "Mike Chen" },
    rating: 4,
    comment:
      "Great content and well-structured. Would recommend to anyone starting their journey.",
    date: "2024-01-10",
    isHelpful: 8,
  },
];

// Mock course data for testing - replace with actual API call
const getMockCourse = (slug: string): Course => ({
  _id: "1",
  title:
    slug === "complete-web-development-bootcamp"
      ? "Complete Web Development Bootcamp"
      : "Advanced React & TypeScript",
  slug: slug,
  description: `This comprehensive course will take you from beginner to advanced level. You'll learn modern web development techniques, best practices, and build real-world projects.

In this course, you'll master:
- HTML5 and CSS3 fundamentals
- JavaScript ES6+ features
- React and component-based architecture
- TypeScript for type safety
- Node.js and Express for backend development
- Database integration with MongoDB
- Deployment and DevOps practices

By the end of this course, you'll have the skills to build full-stack web applications from scratch and land your dream job as a web developer.`,
  shortDescription:
    "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
  instructor: {
    _id: "instructor1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/fastbeetech-logo.jpeg",
  },
  coInstructors: [],
  thumbnail: "/ai-innovations.jpg",
  previewVideo: "https://example.com/preview.mp4",
  level: "beginner" as const,
  status: "draft" as const,
  category: "Web Development",
  subcategory: "Full Stack",
  tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
  language: "English",
  price: 99.99,
  originalPrice: 199.99,
  currency: "USD",
  isFree: false,
  modules: [
    {
      _id: "module1",
      title: "Getting Started with Web Development",
      description: "Introduction to web development fundamentals",
      order: 1,
      contents: [
        {
          _id: "content1",
          title: "Welcome to the Course",
          description: "Course overview and what you'll learn",
          type: "video" as const,
          order: 1,
          duration: 600,
          videoUrl: "https://example.com/intro.mp4",
          isPreview: true,
        },
        {
          _id: "content2",
          title: "Setting up Development Environment",
          description: "Installing VS Code, Node.js, and other tools",
          type: "video" as const,
          order: 2,
          duration: 900,
          videoUrl: "https://example.com/setup.mp4",
          isPreview: false,
        },
      ],
      estimatedDuration: 1500,
    },
    {
      _id: "module2",
      title: "HTML5 Fundamentals",
      description: "Learn the structure of web pages with HTML5",
      order: 2,
      contents: [
        {
          _id: "content3",
          title: "HTML Basics",
          description: "Elements, tags, and document structure",
          type: "video" as const,
          order: 1,
          duration: 720,
          isPreview: false,
        },
        {
          _id: "content4",
          title: "Semantic HTML",
          description: "Using semantic elements for better structure",
          type: "video" as const,
          order: 2,
          duration: 840,
          isPreview: false,
        },
        {
          _id: "content5",
          title: "HTML Quiz",
          description: "Test your HTML knowledge",
          type: "quiz" as const,
          order: 3,
          isPreview: false,
        },
      ],
      estimatedDuration: 1560,
    },
  ],
  totalDuration: 144000, // 40 hours in seconds
  totalLessons: 120,
  totalQuizzes: 12,
  whatYouWillLearn: [
    "Build responsive websites from scratch",
    "Master HTML5, CSS3, and modern JavaScript",
    "Create dynamic web applications with React",
    "Build RESTful APIs with Node.js and Express",
    "Work with databases (MongoDB)",
    "Deploy applications to production",
    "Understand version control with Git",
    "Learn testing and debugging techniques",
  ],
  prerequisites: [
    "Basic computer skills",
    "No programming experience required",
    "A computer with internet connection",
    "Willingness to learn and practice",
  ],
  targetAudience: [
    "Complete beginners to web development",
    "Anyone wanting to become a web developer",
    "Students looking to build a portfolio",
    "Career changers interested in tech",
  ],
  totalEnrollments: 1250,
  activeEnrollments: 980,
  completionRate: 78,
  averageRating: 4.8,
  totalReviews: 450,
  ratingDistribution: {
    5: 280,
    4: 120,
    3: 35,
    2: 10,
    1: 5,
  },
  allowComments: true,
  allowDownloads: true,
  certificate: true,
  certificateTemplate: "default",
  metaTitle: "Complete Web Development Bootcamp - Learn HTML, CSS, JS, React",
  metaDescription:
    "Master web development with our comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, and more.",
  ogImage: "/ai-innovations.jpg",
  publishedAt: undefined, // Not published yet
  lastUpdated: "2024-01-20T10:00:00Z",
  isFeatured: true,
  isBestseller: false,
  isNew: true,
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-01-20T10:00:00Z",
});

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [selectedTab, setSelectedTab] = useState("overview");

  const slug = params.slug as string;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        // First try to get course from instructor dashboard (includes unpublished courses)
        try {
          const response = await courseApi.getInstructorCourse(slug);
          setCourse(response.data.course);
          return;
        } catch {
          console.log(
            "Not accessible via instructor endpoint, trying public endpoint..."
          );
        }

        // Fallback to public endpoint (published courses only)
        try {
          const response = await courseApi.getCourse(slug);
          setCourse(response.data.course);
          return;
        } catch {
          console.log(
            "Course not found in API, using mock data for preview..."
          );
        }

        // Final fallback to mock data for testing/preview purposes
        const mockCourse = getMockCourse(slug);
        setCourse(mockCourse);
        toast.info("Showing preview with sample data");
      } catch (error) {
        console.error("Error in fetchCourse:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <p className="text-muted-foreground mb-6">
          The course you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/courses">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-4">
            <Link
              href="/courses"
              className="inline-flex items-center text-gray-300 hover:text-white mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge
                  variant="outline"
                  className="bg-amber-600"
                >
                  {course.level}
                </Badge>
                {course.isBestseller && (
                  <Badge className="bg-orange-600 hover:bg-orange-700">
                    Bestseller
                  </Badge>
                )}
                {course.isNew && (
                  <Badge className="bg-green-600 hover:bg-green-700">New</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>

              <p className="text-xl text-gray-300 mb-6">
                {course.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(course.averageRating)}
                  </div>
                  <span className="font-medium">{course.averageRating}</span>
                  <span className="text-gray-400">
                    ({course.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {course.totalEnrollments.toLocaleString()} students
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>
                    {course.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{course.instructor.name}</p>
                  <p className="text-sm text-gray-400">Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {course.previewVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="rounded-full h-16 w-16 p-0"
                        >
                          <Play className="h-6 w-6 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    {course.isFree ? (
                      <div className="text-2xl font-bold text-green-600">
                        Free
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">
                          {formatPrice(course.price, course.currency)}
                        </span>
                        {course.originalPrice && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(
                                course.originalPrice,
                                course.currency
                              )}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              {discountPercentage}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button className="w-full mb-3" size="lg">
                    {course.isFree ? "Enroll for Free" : "Enroll Now"}
                  </Button>

                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDuration(course.totalDuration)} on-demand video
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    {course.allowDownloads && (
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Downloadable resources</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Full lifetime access</span>
                    </div>
                    {course.certificate && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* What You'll Learn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      What you&apos;ll learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {course.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                {course.prerequisites.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prerequisites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.prerequisites.map((prerequisite, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{prerequisite}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Target Audience */}
                {course.targetAudience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Who this course is for</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.targetAudience.map((audience, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{audience}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {course.modules.length} modules • {course.totalLessons}{" "}
                      lessons • {formatDuration(course.totalDuration)} total
                      length
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.modules.map((module: CourseModule, index) => (
                      <Collapsible
                        key={module._id || index}
                        open={expandedModules.has(
                          module._id || index.toString()
                        )}
                        onOpenChange={() =>
                          toggleModule(module._id || index.toString())
                        }
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {expandedModules.has(
                                module._id || index.toString()
                              ) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span className="font-medium">
                                Module {index + 1}: {module.title}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {module.contents.length} lessons
                            {module.estimatedDuration &&
                              ` • ${formatDuration(module.estimatedDuration)}`}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-3">
                          {module.description && (
                            <p className="text-sm text-muted-foreground px-4 mb-3">
                              {module.description}
                            </p>
                          )}
                          {module.contents.map((content, contentIndex) => (
                            <div
                              key={content._id || contentIndex}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {getContentIcon(content.type)}
                                <span className="text-sm">{content.title}</span>
                                {content.isPreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {content.duration &&
                                  formatDuration(content.duration)}
                                {!content.isPreview && (
                                  <Lock className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback className="text-lg">
                          {course.instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {course.instructor.name}
                        </h3>
                        {/* Add instructor bio, ratings, etc. here when available */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            <span>4.8 Instructor Rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>12,345 Students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>8 Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Rating Summary */}
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-1">
                            {course.averageRating}
                          </div>
                          <div className="flex justify-center mb-1">
                            {renderStars(course.averageRating)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Course Rating
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm w-8">{rating}★</span>
                              <Progress
                                value={
                                  (course.ratingDistribution[
                                    rating as keyof typeof course.ratingDistribution
                                  ] /
                                    course.totalReviews) *
                                  100
                                }
                                className="flex-1"
                              />
                              <span className="text-sm text-muted-foreground w-12">
                                {course.ratingDistribution[
                                  rating as keyof typeof course.ratingDistribution
                                ] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Individual Reviews */}
                      <div className="space-y-6">
                        {mockReviews.map((review) => (
                          <div key={review.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={review.user.avatar} />
                                <AvatarFallback>
                                  {review.user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">
                                    {review.user.name}
                                  </span>
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mb-2">{review.comment}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Helpful? Yes ({review.isHelpful})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Course Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">
                      {course.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Updated</span>
                    <span className="font-medium">
                      {new Date(course.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Language</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
