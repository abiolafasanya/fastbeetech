import React from "react";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  title: string;
  loading: boolean;
  onBack: () => void;
  onSave: () => void;
}

export function CourseHeader({
  title,
  loading,
  onBack,
  onSave,
}: CourseHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Edit Modules - {title}</h1>
      <div className="flex items-center gap-2">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onSave}>
          {loading ? "Saving..." : "Save Modules"}
        </Button>
      </div>
    </div>
  );
}
