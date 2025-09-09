"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Globe,
  Edit,
  Users,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useCourses } from "./hooks/useCourse";
import { useCourseMutations } from "./hooks/useCourseMutation";
import { Course } from "../../../api/CourseApi";
import { SimplePagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

type STATUS_TYPE = "all" | "draft" | "published" | "archived" | "coming-soon";

export default function CourseDashboard() {
  const [status, setStatus] = useState<STATUS_TYPE>("all");
  const pagination = usePagination({ itemsPerPage: 10 });

  const { data, isLoading } = useCourses({
    ...pagination.getParams(),
    status: status === "all" ? undefined : status,
  });

  const { remove, publish, feature } = useCourseMutations();

  const handlePublish = async (id: string) => {
    try {
      await publish.mutateAsync(id);
      toast.success("Course published successfully");
    } catch (error) {
      toast.error("Failed to publish course");
      throw error;
    }
  };

  const handleFeature = async (id: string, isFeatured: boolean) => {
    try {
      await feature.mutateAsync({ id, isFeatured });
      toast.success(isFeatured ? "Added to featured" : "Removed from featured");
    } catch (error) {
      toast.error("Failed to update course");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await remove.mutateAsync(id);
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
      throw error;
    }
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
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      case "coming-soon":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Course Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage your online courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/course/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data?.pagination?.totalItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as STATUS_TYPE)}
          className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
          <option value="coming-soon">Coming Soon</option>
        </select>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>
            Manage your course content, pricing, and student progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.courses?.map((course: Course) => (
                <TableRow key={course._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-md object-cover"
                          src={course.thumbnail}
                          alt={course.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.shortDescription.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                    {course.isFeatured && (
                      <Badge variant="secondary" className="ml-1">
                        Featured
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      {course.totalEnrollments}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {course.averageRating.toFixed(1)}
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({course.totalReviews})
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {course.isFree ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      <span className="font-medium">
                        {formatPrice(course.price, course.currency)}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      {formatDuration(course.totalDuration)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(course.lastUpdated).toLocaleDateString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <Link href={`/dashboard/course/${course._id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                        </Link>

                        <Link href={`/course/${course.slug}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                        </Link>

                        <Link
                          href={`/dashboard/course/${course._id}/analytics`}
                        >
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator />

                        {course.status === "draft" && (
                          <DropdownMenuItem
                            onClick={() => handlePublish(course._id)}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() =>
                            handleFeature(course._id, !course.isFeatured)
                          }
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {course.isFeatured
                            ? "Remove from Featured"
                            : "Add to Featured"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(course._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data?.data?.courses?.length === 0 && (
            <div className="text-center py-10">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No courses
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first course.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/course/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.data?.pagination && (
        <SimplePagination
          currentPage={pagination.currentPage}
          totalPages={data.data.pagination.totalPages}
          totalItems={data.data.pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.goToPage}
          itemName="courses"
        />
      )}
    </div>
  );
}
