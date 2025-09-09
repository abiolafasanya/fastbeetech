"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
} from "lucide-react";

// Mock data for courses - replace with actual API call
const mockCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description:
      "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
    instructor: "John Doe",
    thumbnail: "/ai-innovations.jpg",
    price: 99.99,
    originalPrice: 199.99,
    level: "beginner",
    duration: "40 hours",
    totalLessons: 120,
    enrolledStudents: 1250,
    rating: 4.8,
    totalReviews: 450,
    category: "Web Development",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "2",
    title: "Advanced React & TypeScript",
    description:
      "Master React with TypeScript, hooks, context, and advanced patterns.",
    instructor: "Jane Smith",
    thumbnail: "/tech-trends.png",
    price: 79.99,
    originalPrice: 149.99,
    level: "advanced",
    duration: "25 hours",
    totalLessons: 80,
    enrolledStudents: 800,
    rating: 4.9,
    totalReviews: 320,
    category: "Frontend Development",
    tags: ["React", "TypeScript", "Hooks"],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "3",
    title: "Python for Data Science",
    description:
      "Learn Python programming for data analysis, visualization, and machine learning.",
    instructor: "Mike Johnson",
    thumbnail: "/generative-ai.png",
    price: 89.99,
    originalPrice: null,
    level: "intermediate",
    duration: "35 hours",
    totalLessons: 95,
    enrolledStudents: 950,
    rating: 4.7,
    totalReviews: 280,
    category: "Data Science",
    tags: ["Python", "Pandas", "NumPy", "ML"],
    isFeatured: true,
    isNew: false,
  },
];

const categories = [
  "All",
  "Web Development",
  "Frontend Development",
  "Data Science",
  "Mobile Development",
  "DevOps",
];
const levels = ["All", "beginner", "intermediate", "advanced"];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // Filter courses based on search and filters
  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Learn. Grow. Excel.
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Discover our comprehensive courses designed to accelerate your
            career
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white text-black"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground self-end">
            {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {course.isFeatured && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Featured
                    </Badge>
                  )}
                  {course.isNew && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      New
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({course.totalReviews})
                    </span>
                  </div>
                </div>

                <CardTitle className="text-lg leading-tight mb-2">
                  {course.title}
                </CardTitle>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.totalLessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.enrolledStudents.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">${course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button>Enroll Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
