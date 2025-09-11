"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Users,
  Settings,
  Play,
  Code,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { CourseContentTab } from "../../dashboard/course/[id]/edit/components/CourseContentTab";
import { CourseModule } from "@/api/CourseApi";

export default function CourseEditorDemo() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("instructor");

  const features = [
    {
      title: "Quiz Configuration",
      description:
        "Multiple choice, true/false, fill-in-blank, and code review questions",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Assignment Management",
      description:
        "File uploads, grading rubrics, due dates, and submission formats",
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Resource Library",
      description:
        "PDFs, links, downloads, and external resources with access control",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "RBAC Integration",
      description:
        "Role-based access control with instructor/student permissions",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Preview Mode",
      description:
        "See exactly how content appears to students before publishing",
      icon: <Play className="h-5 w-5" />,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "TypeScript Safety",
      description:
        "Full type safety with comprehensive interfaces and validation",
      icon: <Code className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-700",
    },
  ];

  const demoStats = [
    {
      label: "Content Types",
      value: "6",
      description: "Video, Quiz, Assignment, Resource, Text, File",
    },
    {
      label: "Question Types",
      value: "4",
      description: "Multiple choice, True/false, Fill-blank, Code review",
    },
    {
      label: "File Formats",
      value: "10+",
      description: "PDF, ZIP, DOC, PPT, Video formats supported",
    },
    {
      label: "Preview Modes",
      value: "2",
      description: "Edit mode and Student preview mode",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="px-3 py-1">
              Live Demo
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            FastBeeTech Course Editor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete course content management system with quizzes, assignments,
            resources, and role-based access control. Built with React,
            TypeScript, and modern UI components.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {demoStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="font-medium mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Interactive Demo</CardTitle>
                <p className="text-blue-100 mt-1">
                  Experience the full course editor with sample content
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Editor
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  RBAC Demo
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="p-6 min-h-[600px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Course Content Management
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click &ldquo;Load Demo Content&rdquo; to see quizzes,
                        assignments, and resources in action
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentRole(
                          currentRole === "instructor"
                            ? "student"
                            : "instructor"
                        )
                      }
                    >
                      Current Role: {currentRole}
                    </Button>
                  </div>
                  <Separator />
                  <CourseContentTab modules={modules} setModules={setModules} />
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="p-6 min-h-[600px]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Role-Based Access Control
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The course editor implements comprehensive RBAC with
                      different permissions for instructors and students.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          Instructor Permissions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Create and edit course content
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Configure quizzes and assignments
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Manage grading rubrics
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Upload and manage resources
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Preview student view</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Set access permissions
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          Student Permissions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            View published course content
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Take quizzes and view results
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Submit assignments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            Download allowed resources
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50">
                          <span className="h-4 w-4 text-gray-400">✗</span>
                          <span className="text-sm text-gray-500">
                            Edit course content
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50">
                          <span className="h-4 w-4 text-gray-400">✗</span>
                          <span className="text-sm text-gray-500">
                            Access instructor tools
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="p-6 min-h-[600px]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Technical Implementation
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Built with modern web technologies and best practices for
                      scalability and maintainability.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Frontend Architecture</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">React 18</Badge>
                          <Badge variant="outline">TypeScript</Badge>
                          <Badge variant="outline">Next.js 14</Badge>
                          <Badge variant="outline">Tailwind CSS</Badge>
                          <Badge variant="outline">Shadcn/ui</Badge>
                          <Badge variant="outline">Lucide Icons</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Content Management Features</CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Quiz System</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Multiple question types</li>
                            <li>• Time limits and attempts</li>
                            <li>• Instant feedback</li>
                            <li>• Scoring and passing grades</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">
                            Assignment Management
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• File upload support</li>
                            <li>• Rubric-based grading</li>
                            <li>• Due date management</li>
                            <li>• Multiple file formats</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Resource Library</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Download controls</li>
                            <li>• External link support</li>
                            <li>• File type validation</li>
                            <li>• Access permissions</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Preview System</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Real-time preview</li>
                            <li>• Student view simulation</li>
                            <li>• Edit/preview toggle</li>
                            <li>• Responsive design</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Build Your Course?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                This course editor is production-ready and can be integrated
                into any learning management system. Start creating engaging
                educational content today.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="secondary" size="lg" className="text-blue-600">
                  View Source Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
