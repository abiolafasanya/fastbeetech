"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlayCircle,
  FileText,
  HelpCircle,
  Archive,
  Clock,
  Users,
  Trophy,
  Download,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CourseContent } from "@/api/CourseApi";

interface ContentPreviewProps {
  content: CourseContent;
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getContentIcon = () => {
    switch (content.type) {
      case "video":
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case "text":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "quiz":
        return <HelpCircle className="h-5 w-5 text-orange-500" />;
      case "assignment":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "resource":
        return <Archive className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (content.type) {
      case "video":
        return "Video";
      case "text":
        return "Text";
      case "quiz":
        return "Quiz";
      case "assignment":
        return "Assignment";
      case "resource":
        return "Resource";
      default:
        return "Content";
    }
  };

  const getContentStats = () => {
    switch (content.type) {
      case "quiz":
        return {
          primary: `${content.quiz?.questions?.length || 0} questions`,
          secondary: `${content.quiz?.timeLimit || 0} minutes`,
          badge: content.quiz?.isRequired ? "Required" : "Optional",
        };
      case "assignment":
        return {
          primary: `${content.gradingRubric?.length || 0} criteria`,
          secondary: `${content.maxFileSize || 10}MB max`,
          badge: content.dueDate ? "Due Date Set" : "No Deadline",
        };
      case "resource":
        return {
          primary: `${content.resources?.length || 0} resources`,
          secondary: content.allowDownloads ? "Downloadable" : "View Only",
          badge: content.resources?.length ? "Has Resources" : "Empty",
        };
      case "video":
        return {
          primary: `${content.duration || 0} minutes`,
          secondary: content.transcript ? "With Transcript" : "No Transcript",
          badge: content.videoUrl ? "Video Set" : "No Video",
        };
      default:
        return {
          primary: "Text Content",
          secondary: content.textContent ? "Content Added" : "Empty",
          badge: "Text",
        };
    }
  };

  const stats = getContentStats();

  return (
    <Card className="border-dashed hover:border-solid transition-all duration-200 hover:shadow-md">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getContentIcon()}
            <span className="text-sm font-medium">{getContentTypeLabel()}</span>
            <Badge variant="secondary" className="text-xs">
              {stats.badge}
            </Badge>
          </div>
          {content.isPreview && (
            <Badge variant="outline" className="text-xs">
              Preview
            </Badge>
          )}
        </div>

        <h4 className="font-medium mb-2">
          {content.title || "Untitled Content"}
        </h4>

        {content.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {content.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{stats.primary}</span>
          <span>{stats.secondary}</span>
        </div>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Preview Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getContentIcon()}
                {content.title || "Untitled Content"} - {getContentTypeLabel()}{" "}
                Preview
              </DialogTitle>
              <DialogDescription>
                Preview how this content will appear to students
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Quiz Preview */}
              {content.type === "quiz" && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">
                        Quiz Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{content.quiz?.timeLimit || 0} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-blue-600" />
                        <span>{content.quiz?.passingScore || 70}% to pass</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{content.quiz?.maxAttempts || 3} attempts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {content.quiz?.isRequired ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span>
                          {content.quiz?.isRequired ? "Required" : "Optional"}
                        </span>
                      </div>
                    </div>

                    {content.quiz?.description && (
                      <p className="mt-3 text-sm text-blue-700">
                        {content.quiz.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">
                      Questions ({content.quiz?.questions?.length || 0})
                    </h4>
                    {content.quiz?.questions?.map((question, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Question {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {question.points || 1}{" "}
                            {question.points === 1 ? "point" : "points"}
                          </Badge>
                        </div>
                        <p className="mb-3">
                          {question.question || "Question not set"}
                        </p>

                        {question.type === "multiple-choice" &&
                          question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-2 rounded border ${
                                    question.correctAnswer === option
                                      ? "bg-green-50 border-green-200"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                                    <span className="text-sm">
                                      {option || `Option ${optionIndex + 1}`}
                                    </span>
                                    {question.correctAnswer === option && (
                                      <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {question.type === "true-false" && (
                          <div className="space-y-2">
                            <div
                              className={`p-2 rounded border ${
                                question.correctAnswer === "true"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                                <span className="text-sm">True</span>
                                {question.correctAnswer === "true" && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                )}
                              </div>
                            </div>
                            <div
                              className={`p-2 rounded border ${
                                question.correctAnswer === "false"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                                <span className="text-sm">False</span>
                                {question.correctAnswer === "false" && (
                                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {(question.type === "fill-blank" ||
                          question.type === "code-review") && (
                          <div className="p-2 bg-gray-50 rounded border">
                            <span className="text-sm text-muted-foreground">
                              Answer: {question.correctAnswer || "Not set"}
                            </span>
                          </div>
                        )}

                        {question.explanation && (
                          <div className="mt-3 p-2 bg-blue-50 rounded">
                            <span className="text-xs font-medium text-blue-800">
                              Explanation:
                            </span>
                            <p className="text-sm text-blue-700 mt-1">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </Card>
                    ))}

                    {(!content.quiz?.questions ||
                      content.quiz.questions.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <HelpCircle className="mx-auto h-12 w-12 mb-2" />
                        <p>No questions configured yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assignment Preview */}
              {content.type === "assignment" && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">
                        Assignment Details
                      </h3>
                    </div>

                    {content.assignmentInstructions && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Instructions:</h4>
                        <p className="text-sm text-green-700 whitespace-pre-wrap">
                          {content.assignmentInstructions}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p>{content.dueDate || "No deadline set"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Max File Size:</span>
                        <p>{content.maxFileSize || 10} MB</p>
                      </div>
                      <div>
                        <span className="font-medium">Allowed Formats:</span>
                        <p>
                          {content.submissionFormat?.join(", ").toUpperCase() ||
                            "PDF"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {content.gradingRubric &&
                    content.gradingRubric.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Grading Rubric</h4>
                        {content.gradingRubric.map((criteria, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">
                                {criteria.criteria}
                              </h5>
                              <Badge variant="outline">
                                {criteria.maxPoints} points
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {criteria.description}
                            </p>
                          </Card>
                        ))}
                      </div>
                    )}

                  {(!content.gradingRubric ||
                    content.gradingRubric.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-2" />
                      <p>No grading rubric configured</p>
                    </div>
                  )}
                </div>
              )}

              {/* Resource Preview */}
              {content.type === "resource" && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Archive className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">
                        Resource Collection
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-purple-600" />
                        <span>
                          {content.allowDownloads
                            ? "Downloads enabled"
                            : "View only"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Archive className="h-4 w-4 text-purple-600" />
                        <span>{content.resources?.length || 0} resources</span>
                      </div>
                    </div>
                  </div>

                  {content.resources && content.resources.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Available Resources</h4>
                      {content.resources.map((resource, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                                <Archive className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <h5 className="font-medium">
                                  {resource.title || `Resource ${index + 1}`}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {resource.url || "No URL set"}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {resource.type?.toUpperCase() || "PDF"}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {(!content.resources || content.resources.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Archive className="mx-auto h-12 w-12 mb-2" />
                      <p>No resources added yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Video Preview */}
              {content.type === "video" && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <PlayCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">
                        Video Content
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p>{content.duration || 0} minutes</p>
                      </div>
                      <div>
                        <span className="font-medium">Video URL:</span>
                        <p className="truncate">
                          {content.videoUrl || "No URL set"}
                        </p>
                      </div>
                    </div>

                    {content.transcript && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Transcript:</h4>
                        <div className="max-h-32 overflow-y-auto p-2 bg-white rounded border">
                          <p className="text-sm text-gray-700">
                            {content.transcript}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Preview */}
              {content.type === "text" && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">
                        Text Content
                      </h3>
                    </div>

                    {content.textContent ? (
                      <div className="max-h-96 overflow-y-auto p-4 bg-white rounded border">
                        <p className="whitespace-pre-wrap">
                          {content.textContent}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 mb-2" />
                        <p>No text content added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
