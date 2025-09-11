"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayCircle,
  FileText,
  HelpCircle,
  Trash2,
  Archive,
  Plus,
} from "lucide-react";
import { CourseContent } from "@/api/CourseApi";

interface ContentItemProps {
  content: CourseContent;
  moduleIndex: number;
  contentIndex: number;
  onUpdate: (
    moduleIndex: number,
    contentIndex: number,
    field: string,
    value: string | number | boolean | object
  ) => void;
  onRemove: (moduleIndex: number, contentIndex: number) => void;
}

export function ContentItem({
  content,
  moduleIndex,
  contentIndex,
  onUpdate,
  onRemove,
}: ContentItemProps) {
  const getContentIcon = () => {
    switch (content.type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "text":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-orange-500" />;
      case "assignment":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "resource":
        return <Archive className="h-4 w-4 text-indigo-500" />;
      default:
        return <FileText className="h-4 w-4" />;
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

  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getContentIcon()}
            <span className="text-sm font-medium">{getContentTypeLabel()}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(moduleIndex, contentIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Content title"
            value={content.title}
            onChange={(e) =>
              onUpdate(moduleIndex, contentIndex, "title", e.target.value)
            }
          />
          <Select
            value={content.type}
            onValueChange={(value) =>
              onUpdate(moduleIndex, contentIndex, "type", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Content description"
          value={content.description || ""}
          onChange={(e) =>
            onUpdate(moduleIndex, contentIndex, "description", e.target.value)
          }
          rows={2}
        />

        {/* Video Content */}
        {content.type === "video" && (
          <div className="space-y-2">
            <Input
              placeholder="Video URL"
              value={content.videoUrl || ""}
              onChange={(e) =>
                onUpdate(moduleIndex, contentIndex, "videoUrl", e.target.value)
              }
            />
            <Input
              placeholder="Duration (minutes)"
              type="number"
              value={content.duration || ""}
              onChange={(e) =>
                onUpdate(
                  moduleIndex,
                  contentIndex,
                  "duration",
                  parseInt(e.target.value) || 0
                )
              }
            />
            <Textarea
              placeholder="Video transcript (optional)"
              value={content.transcript || ""}
              onChange={(e) =>
                onUpdate(
                  moduleIndex,
                  contentIndex,
                  "transcript",
                  e.target.value
                )
              }
              rows={3}
            />
          </div>
        )}

        {/* Text Content */}
        {content.type === "text" && (
          <Textarea
            placeholder="Text content"
            value={content.textContent || ""}
            onChange={(e) =>
              onUpdate(moduleIndex, contentIndex, "textContent", e.target.value)
            }
            rows={6}
          />
        )}

        {/* Quiz Content */}
        {content.type === "quiz" && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Quiz Settings</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Time limit (minutes)"
                type="number"
                value={content.quiz?.timeLimit || ""}
                onChange={(e) =>
                  onUpdate(moduleIndex, contentIndex, "quiz", {
                    ...content.quiz,
                    timeLimit: parseInt(e.target.value) || 0,
                  })
                }
              />
              <Input
                placeholder="Passing score (%)"
                type="number"
                min="0"
                max="100"
                value={content.quiz?.passingScore || ""}
                onChange={(e) =>
                  onUpdate(moduleIndex, contentIndex, "quiz", {
                    ...content.quiz,
                    passingScore: parseInt(e.target.value) || 70,
                  })
                }
              />
              <Input
                placeholder="Max attempts"
                type="number"
                min="1"
                value={content.quiz?.maxAttempts || ""}
                onChange={(e) =>
                  onUpdate(moduleIndex, contentIndex, "quiz", {
                    ...content.quiz,
                    maxAttempts: parseInt(e.target.value) || 3,
                  })
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`show-answers-${moduleIndex}-${contentIndex}`}
                  checked={content.quiz?.showAnswers || false}
                  onCheckedChange={(checked) =>
                    onUpdate(moduleIndex, contentIndex, "quiz", {
                      ...content.quiz,
                      showAnswers: checked,
                    })
                  }
                />
                <label
                  htmlFor={`show-answers-${moduleIndex}-${contentIndex}`}
                  className="text-sm font-medium"
                >
                  Show answers after completion
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-quiz-${moduleIndex}-${contentIndex}`}
                checked={content.quiz?.isRequired || false}
                onCheckedChange={(checked) =>
                  onUpdate(moduleIndex, contentIndex, "quiz", {
                    ...content.quiz,
                    isRequired: checked,
                  })
                }
              />
              <label
                htmlFor={`required-quiz-${moduleIndex}-${contentIndex}`}
                className="text-sm font-medium"
              >
                Required to complete module
              </label>
            </div>

            <Textarea
              placeholder="Quiz description"
              value={content.quiz?.description || ""}
              onChange={(e) =>
                onUpdate(moduleIndex, contentIndex, "quiz", {
                  ...content.quiz,
                  description: e.target.value,
                })
              }
              rows={2}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Questions</h5>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newQuestion = {
                      question: "",
                      type: "multiple-choice" as const,
                      options: ["", "", "", ""],
                      correctAnswer: "",
                      explanation: "",
                      points: 1,
                    };
                    onUpdate(moduleIndex, contentIndex, "quiz", {
                      ...content.quiz,
                      questions: [...(content.quiz?.questions || []), newQuestion],
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {content.quiz?.questions?.map((question, questionIndex) => (
                <div key={questionIndex} className="p-3 border rounded-lg bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Question {questionIndex + 1}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updatedQuestions = content.quiz?.questions?.filter(
                          (_, idx) => idx !== questionIndex
                        ) || [];
                        onUpdate(moduleIndex, contentIndex, "quiz", {
                          ...content.quiz,
                          questions: updatedQuestions,
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Enter your question"
                    value={question.question || ""}
                    onChange={(e) => {
                      const updatedQuestions = [...(content.quiz?.questions || [])];
                      updatedQuestions[questionIndex] = {
                        ...question,
                        question: e.target.value,
                      };
                      onUpdate(moduleIndex, contentIndex, "quiz", {
                        ...content.quiz,
                        questions: updatedQuestions,
                      });
                    }}
                    rows={2}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={question.type || "multiple-choice"}
                      onValueChange={(value) => {
                        const updatedQuestions = [...(content.quiz?.questions || [])];
                        updatedQuestions[questionIndex] = {
                          ...question,
                          type: value as "multiple-choice" | "true-false" | "fill-blank" | "code-review",
                          options: value === "multiple-choice" ? ["", "", "", ""] : undefined,
                        };
                        onUpdate(moduleIndex, contentIndex, "quiz", {
                          ...content.quiz,
                          questions: updatedQuestions,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                        <SelectItem value="code-review">Code Review</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Points"
                      type="number"
                      min="1"
                      value={question.points || 1}
                      onChange={(e) => {
                        const updatedQuestions = [...(content.quiz?.questions || [])];
                        updatedQuestions[questionIndex] = {
                          ...question,
                          points: parseInt(e.target.value) || 1,
                        };
                        onUpdate(moduleIndex, contentIndex, "quiz", {
                          ...content.quiz,
                          questions: updatedQuestions,
                        });
                      }}
                    />
                  </div>

                  {question.type === "multiple-choice" && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Options:</span>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option || ""}
                            onChange={(e) => {
                              const updatedQuestions = [...(content.quiz?.questions || [])];
                              const updatedOptions = [...(question.options || [])];
                              updatedOptions[optionIndex] = e.target.value;
                              updatedQuestions[questionIndex] = {
                                ...question,
                                options: updatedOptions,
                              };
                              onUpdate(moduleIndex, contentIndex, "quiz", {
                                ...content.quiz,
                                questions: updatedQuestions,
                              });
                            }}
                          />
                          <Checkbox
                            checked={question.correctAnswer === option}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                const updatedQuestions = [...(content.quiz?.questions || [])];
                                updatedQuestions[questionIndex] = {
                                  ...question,
                                  correctAnswer: option,
                                };
                                onUpdate(moduleIndex, contentIndex, "quiz", {
                                  ...content.quiz,
                                  questions: updatedQuestions,
                                });
                              }
                            }}
                          />
                          <span className="text-xs text-muted-foreground">Correct</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Correct Answer:</span>
                      <Select
                        value={question.correctAnswer as string || ""}
                        onValueChange={(value) => {
                          const updatedQuestions = [...(content.quiz?.questions || [])];
                          updatedQuestions[questionIndex] = {
                            ...question,
                            correctAnswer: value,
                          };
                          onUpdate(moduleIndex, contentIndex, "quiz", {
                            ...content.quiz,
                            questions: updatedQuestions,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(question.type === "fill-blank" || question.type === "code-review") && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Correct Answer:</span>
                      <Input
                        placeholder="Enter the correct answer"
                        value={question.correctAnswer as string || ""}
                        onChange={(e) => {
                          const updatedQuestions = [...(content.quiz?.questions || [])];
                          updatedQuestions[questionIndex] = {
                            ...question,
                            correctAnswer: e.target.value,
                          };
                          onUpdate(moduleIndex, contentIndex, "quiz", {
                            ...content.quiz,
                            questions: updatedQuestions,
                          });
                        }}
                      />
                    </div>
                  )}

                  <Textarea
                    placeholder="Explanation (optional)"
                    value={question.explanation || ""}
                    onChange={(e) => {
                      const updatedQuestions = [...(content.quiz?.questions || [])];
                      updatedQuestions[questionIndex] = {
                        ...question,
                        explanation: e.target.value,
                      };
                      onUpdate(moduleIndex, contentIndex, "quiz", {
                        ...content.quiz,
                        questions: updatedQuestions,
                      });
                    }}
                    rows={2}
                  />
                </div>
              ))}

              {(!content.quiz?.questions || content.quiz.questions.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <HelpCircle className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No questions added yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assignment Content */}
        {content.type === "assignment" && (
          <div className="space-y-4 p-4 border rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Assignment Settings</h4>
            </div>

            <Textarea
              placeholder="Assignment instructions"
              value={content.assignmentInstructions || ""}
              onChange={(e) =>
                onUpdate(moduleIndex, contentIndex, "assignmentInstructions", e.target.value)
              }
              rows={4}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date (Optional)</label>
                <Input
                  type="datetime-local"
                  value={content.dueDate || ""}
                  onChange={(e) =>
                    onUpdate(moduleIndex, contentIndex, "dueDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max File Size (MB)</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={content.maxFileSize || 10}
                  onChange={(e) =>
                    onUpdate(moduleIndex, contentIndex, "maxFileSize", parseInt(e.target.value) || 10)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Allowed Submission Formats</label>
              <div className="flex flex-wrap gap-2">
                {["pdf", "doc", "docx", "txt", "zip", "ppt", "pptx"].map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={`format-${format}-${moduleIndex}-${contentIndex}`}
                      checked={content.submissionFormat?.includes(format) || false}
                      onCheckedChange={(checked) => {
                        const currentFormats = content.submissionFormat || [];
                        const updatedFormats = checked
                          ? [...currentFormats, format]
                          : currentFormats.filter((f: string) => f !== format);
                        onUpdate(moduleIndex, contentIndex, "submissionFormat", updatedFormats);
                      }}
                    />
                    <label
                      htmlFor={`format-${format}-${moduleIndex}-${contentIndex}`}
                      className="text-sm uppercase"
                    >
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Grading Rubric</label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newRubric = {
                      criteria: "",
                      maxPoints: 10,
                      description: "",
                    };
                    onUpdate(moduleIndex, contentIndex, "gradingRubric", [
                      ...(content.gradingRubric || []),
                      newRubric,
                    ]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criteria
                </Button>
              </div>

              {content.gradingRubric?.map((rubric: { criteria: string; maxPoints: number; description: string }, rubricIndex: number) => (
                <div key={rubricIndex} className="p-3 border rounded-lg bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Criteria {rubricIndex + 1}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updatedRubric = content.gradingRubric?.filter(
                          (_: { criteria: string; maxPoints: number; description: string }, idx: number) => idx !== rubricIndex
                        ) || [];
                        onUpdate(moduleIndex, contentIndex, "gradingRubric", updatedRubric);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Criteria name"
                      value={rubric.criteria || ""}
                      onChange={(e) => {
                        const updatedRubric = [...(content.gradingRubric || [])];
                        updatedRubric[rubricIndex] = {
                          ...rubric,
                          criteria: e.target.value,
                        };
                        onUpdate(moduleIndex, contentIndex, "gradingRubric", updatedRubric);
                      }}
                    />
                    <Input
                      placeholder="Max points"
                      type="number"
                      min="1"
                      value={rubric.maxPoints || 10}
                      onChange={(e) => {
                        const updatedRubric = [...(content.gradingRubric || [])];
                        updatedRubric[rubricIndex] = {
                          ...rubric,
                          maxPoints: parseInt(e.target.value) || 10,
                        };
                        onUpdate(moduleIndex, contentIndex, "gradingRubric", updatedRubric);
                      }}
                    />
                  </div>

                  <Textarea
                    placeholder="Criteria description"
                    value={rubric.description || ""}
                    onChange={(e) => {
                      const updatedRubric = [...(content.gradingRubric || [])];
                      updatedRubric[rubricIndex] = {
                        ...rubric,
                        description: e.target.value,
                      };
                      onUpdate(moduleIndex, contentIndex, "gradingRubric", updatedRubric);
                    }}
                    rows={2}
                  />
                </div>
              ))}

              {(!content.gradingRubric || content.gradingRubric.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No grading criteria added yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resource Content */}
        {content.type === "resource" && (
          <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-purple-800">Resource Settings</h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Resources & Downloads</label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newResource = {
                      title: "",
                      url: "",
                      type: "pdf" as const,
                    };
                    onUpdate(moduleIndex, contentIndex, "resources", [
                      ...(content.resources || []),
                      newResource,
                    ]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>

              {content.resources?.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="p-3 border rounded-lg bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resource {resourceIndex + 1}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updatedResources = content.resources?.filter(
                          (_, idx) => idx !== resourceIndex
                        ) || [];
                        onUpdate(moduleIndex, contentIndex, "resources", updatedResources);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    placeholder="Resource title"
                    value={resource.title || ""}
                    onChange={(e) => {
                      const updatedResources = [...(content.resources || [])];
                      updatedResources[resourceIndex] = {
                        ...resource,
                        title: e.target.value,
                      };
                      onUpdate(moduleIndex, contentIndex, "resources", updatedResources);
                    }}
                  />

                  <Input
                    placeholder="Resource URL or file path"
                    value={resource.url || ""}
                    onChange={(e) => {
                      const updatedResources = [...(content.resources || [])];
                      updatedResources[resourceIndex] = {
                        ...resource,
                        url: e.target.value,
                      };
                      onUpdate(moduleIndex, contentIndex, "resources", updatedResources);
                    }}
                  />

                  <Select
                    value={resource.type || "pdf"}
                    onValueChange={(value) => {
                      const updatedResources = [...(content.resources || [])];
                      updatedResources[resourceIndex] = {
                        ...resource,
                        type: value as "pdf" | "zip" | "link" | "other",
                      };
                      onUpdate(moduleIndex, contentIndex, "resources", updatedResources);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="zip">ZIP Archive</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {(!content.resources || content.resources.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <Archive className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No resources added yet</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Settings</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`downloadable-${moduleIndex}-${contentIndex}`}
                  checked={content.allowDownloads || false}
                  onCheckedChange={(checked) =>
                    onUpdate(moduleIndex, contentIndex, "allowDownloads", checked)
                  }
                />
                <label
                  htmlFor={`downloadable-${moduleIndex}-${contentIndex}`}
                  className="text-sm"
                >
                  Allow downloads for enrolled students
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`preview-${moduleIndex}-${contentIndex}`}
            checked={content.isPreview}
            onCheckedChange={(checked) =>
              onUpdate(moduleIndex, contentIndex, "isPreview", checked)
            }
          />
          <label
            htmlFor={`preview-${moduleIndex}-${contentIndex}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Allow preview (free access)
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
