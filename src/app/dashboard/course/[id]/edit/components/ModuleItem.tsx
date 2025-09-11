"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Trash2, Plus, FileText } from "lucide-react";
import { CourseModule } from "@/api/CourseApi";
import { ContentItem } from "./ContentItem";

interface ModuleItemProps {
  module: CourseModule;
  moduleIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (
    index: number,
    field: keyof CourseModule,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  onAddContent: (moduleIndex: number) => void;
  onUpdateContent: (
    moduleIndex: number,
    contentIndex: number,
    field: string,
    value: string | number | boolean | object
  ) => void;
  onRemoveContent: (moduleIndex: number, contentIndex: number) => void;
}

export function ModuleItem({
  module,
  moduleIndex,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
  onAddContent,
  onUpdateContent,
  onRemoveContent,
}: ModuleItemProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="border-l-4 border-l-blue-500">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {module.title || `Module ${moduleIndex + 1}`}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {module.contents.length} item(s)
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(moduleIndex);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <Input
              placeholder="Module title"
              value={module.title}
              onChange={(e) => onUpdate(moduleIndex, "title", e.target.value)}
            />
            <Textarea
              placeholder="Module description"
              value={module.description || ""}
              onChange={(e) =>
                onUpdate(moduleIndex, "description", e.target.value)
              }
              rows={3}
            />

            <Separator />

            {/* Module Contents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Module Content</h4>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onAddContent(moduleIndex)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </div>

              {module.contents.map((content, contentIndex) => (
                <ContentItem
                  key={contentIndex}
                  content={content}
                  moduleIndex={moduleIndex}
                  contentIndex={contentIndex}
                  onUpdate={onUpdateContent}
                  onRemove={onRemoveContent}
                />
              ))}

              {module.contents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-2" />
                  <p>No content added yet</p>
                  <p className="text-sm">
                    Click &quot;Add Content&quot; to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
