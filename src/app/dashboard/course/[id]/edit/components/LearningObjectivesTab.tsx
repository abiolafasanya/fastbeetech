"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface LearningObjectivesTabProps {
  whatYouWillLearn: string[];
  setWhatYouWillLearn: (value: string[]) => void;
  prerequisites: string[];
  setPrerequisites: (value: string[]) => void;
  targetAudience: string[];
  setTargetAudience: (value: string[]) => void;
}

export function LearningObjectivesTab({
  whatYouWillLearn,
  setWhatYouWillLearn,
  prerequisites,
  setPrerequisites,
  targetAudience,
  setTargetAudience,
}: LearningObjectivesTabProps) {
  // Helper functions for learning objectives
  const updateWhatYouWillLearn = (index: number, value: string) => {
    const newLearning = [...whatYouWillLearn];
    newLearning[index] = value;
    setWhatYouWillLearn(newLearning);
  };

  const addWhatYouWillLearn = () => {
    setWhatYouWillLearn([...whatYouWillLearn, ""]);
  };

  const removeWhatYouWillLearn = (index: number) => {
    if (whatYouWillLearn.length > 1) {
      setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index));
    }
  };

  // Helper functions for prerequisites
  const updatePrerequisites = (index: number, value: string) => {
    const newPrereqs = [...prerequisites];
    newPrereqs[index] = value;
    setPrerequisites(newPrereqs);
  };

  const addPrerequisites = () => {
    setPrerequisites([...prerequisites, ""]);
  };

  const removePrerequisites = (index: number) => {
    if (prerequisites.length > 1) {
      setPrerequisites(prerequisites.filter((_, i) => i !== index));
    }
  };

  // Helper functions for target audience
  const updateTargetAudience = (index: number, value: string) => {
    const newAudience = [...targetAudience];
    newAudience[index] = value;
    setTargetAudience(newAudience);
  };

  const addTargetAudience = () => {
    setTargetAudience([...targetAudience, ""]);
  };

  const removeTargetAudience = (index: number) => {
    if (targetAudience.length > 1) {
      setTargetAudience(targetAudience.filter((_, i) => i !== index));
    }
  };
  return (
    <div className="space-y-6">
      {/* What You Will Learn */}
      <Card>
        <CardHeader>
          <CardTitle>What Students Will Learn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {whatYouWillLearn.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={`Learning objective ${index + 1}`}
                value={item}
                onChange={(e) => updateWhatYouWillLearn(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeWhatYouWillLearn(index)}
                disabled={whatYouWillLearn.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addWhatYouWillLearn}>
            <Plus className="mr-2 h-4 w-4" />
            Add Learning Objective
          </Button>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prerequisites.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={`Prerequisite ${index + 1}`}
                value={item}
                onChange={(e) => updatePrerequisites(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePrerequisites(index)}
                disabled={prerequisites.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPrerequisites}>
            <Plus className="mr-2 h-4 w-4" />
            Add Prerequisite
          </Button>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {targetAudience.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={`Target audience ${index + 1}`}
                value={item}
                onChange={(e) => updateTargetAudience(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTargetAudience(index)}
                disabled={targetAudience.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addTargetAudience}>
            <Plus className="mr-2 h-4 w-4" />
            Add Target Audience
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
