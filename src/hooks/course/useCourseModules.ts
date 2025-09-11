import { useState } from "react";
import { CourseModule, CourseContent } from "@/api/CourseApi";

interface UseCourseModulesProps {
  initialModules?: CourseModule[];
}

export function useCourseModules({
  initialModules = [],
}: UseCourseModulesProps = {}) {
  const [modules, setModules] = useState<CourseModule[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
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
      const updatedModules = modules.filter((_, i) => i !== index);
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
    };
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents.push(newContent);
    setModules(updatedModules);
  };

  const updateContent = (
    moduleIndex: number,
    contentIndex: number,
    field: keyof CourseContent,
    value: string | number | boolean | object
  ) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents[contentIndex] = {
      ...updatedModules[moduleIndex].contents[contentIndex],
      [field]: value,
    };
    setModules(updatedModules);
  };

  // Enhanced function to handle complex nested object updates
  const updateContentNested = (
    moduleIndex: number,
    contentIndex: number,
    updates: Partial<CourseContent>
  ) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents[contentIndex] = {
      ...updatedModules[moduleIndex].contents[contentIndex],
      ...updates,
    };
    setModules(updatedModules);
  };

  const removeContent = (moduleIndex: number, contentIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].contents = updatedModules[
      moduleIndex
    ].contents.filter((_, i) => i !== contentIndex);
    setModules(updatedModules);
  };

  // Expand first module by default when modules are set
  const initializeModules = (newModules: CourseModule[]) => {
    setModules(newModules);
    if (newModules && newModules.length > 0) {
      setExpandedModules(new Set([0]));
    }
  };

  return {
    // State
    modules,
    setModules: initializeModules,
    expandedModules,

    // Module operations
    addModule,
    updateModule,
    removeModule,
    toggleModule,

    // Content operations
    addContent,
    updateContent,
    updateContentNested,
    removeContent,
  };
}
