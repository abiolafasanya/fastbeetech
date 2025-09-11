"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import { CourseModule, CourseContent } from "@/api/CourseApi";
import { ModuleItem } from "./ModuleItem";

interface CourseContentTabProps {
  modules: CourseModule[];
  setModules: (modules: CourseModule[]) => void;
}

export function CourseContentTab({
  modules,
  setModules,
}: CourseContentTabProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([0])
  );

  // Module management functions
  const addModule = () => {
    const newModule: CourseModule = {
      title: "",
      description: "",
      order: modules.length + 1,
      contents: [],
    };
    setModules([...modules, newModule]);
    setExpandedModules((prev) => new Set([...prev, modules.length]));
  };

  const updateModule = (
    index: number,
    field: keyof CourseModule,
    value: string | number
  ) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      const updatedModules = modules.filter(
        (_: CourseModule, i: number) => i !== index
      );
      setModules(updatedModules);
      setExpandedModules((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Content management functions
  const addContent = (moduleIndex: number) => {
    const newContent: CourseContent = {
      title: "",
      description: "",
      type: "video",
      order: modules[moduleIndex].contents.length + 1,
      isPreview: false,
      // Initialize default structures for different content types
      quiz: {
        title: "",
        description: "",
        questions: [],
        timeLimit: 30,
        passingScore: 70,
        maxAttempts: 3,
        showAnswers: true,
        order: 0,
        isRequired: false,
      },
      assignmentInstructions: "",
      submissionFormat: ["pdf"],
      maxFileSize: 10,
      dueDate: "",
      gradingRubric: [],
      resources: [],
      allowDownloads: true,
    };
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents.push(newContent);
    setModules(updatedModules);
  };

  const updateContent = (
    moduleIndex: number,
    contentIndex: number,
    field: string,
    value: string | number | boolean | object
  ) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents[contentIndex] = {
      ...updatedModules[moduleIndex].contents[contentIndex],
      [field]: value,
    };
    setModules(updatedModules);
  };

  const removeContent = (moduleIndex: number, contentIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents = updatedModules[
      moduleIndex
    ].contents.filter((_: CourseContent, i: number) => i !== contentIndex);
    setModules(updatedModules);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Modules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Organize your course content into modules and lessons
          </p>
        </div>
        <Button type="button" onClick={addModule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module: CourseModule, moduleIndex: number) => (
          <ModuleItem
            key={moduleIndex}
            module={module}
            moduleIndex={moduleIndex}
            isExpanded={expandedModules.has(moduleIndex)}
            onToggle={() => toggleModule(moduleIndex)}
            onUpdate={updateModule}
            onRemove={removeModule}
            onAddContent={addContent}
            onUpdateContent={updateContent}
            onRemoveContent={removeContent}
          />
        ))}

        {modules.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="mx-auto h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
            <p className="mb-4">
              Start building your course by adding your first module
            </p>
            <Button onClick={addModule}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Module
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
