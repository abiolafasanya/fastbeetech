import { useState } from "react";

interface UseCourseArraysProps {
  initialWhatYouWillLearn?: string[];
  initialPrerequisites?: string[];
  initialTargetAudience?: string[];
}

export function useCourseArrays({
  initialWhatYouWillLearn = [""],
  initialPrerequisites = [""],
  initialTargetAudience = [""],
}: UseCourseArraysProps = {}) {
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>(
    initialWhatYouWillLearn
  );
  const [prerequisites, setPrerequisites] =
    useState<string[]>(initialPrerequisites);
  const [targetAudience, setTargetAudience] = useState<string[]>(
    initialTargetAudience
  );

  // What You Will Learn functions
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

  // Prerequisites functions
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

  // Target Audience functions
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

  // Initialize arrays with course data
  const initializeArrays = (
    newWhatYouWillLearn?: string[],
    newPrerequisites?: string[],
    newTargetAudience?: string[]
  ) => {
    if (newWhatYouWillLearn !== undefined) {
      setWhatYouWillLearn(
        newWhatYouWillLearn.length > 0 ? newWhatYouWillLearn : [""]
      );
    }
    if (newPrerequisites !== undefined) {
      setPrerequisites(newPrerequisites.length > 0 ? newPrerequisites : [""]);
    }
    if (newTargetAudience !== undefined) {
      setTargetAudience(
        newTargetAudience.length > 0 ? newTargetAudience : [""]
      );
    }
  };

  return {
    // State
    whatYouWillLearn,
    prerequisites,
    targetAudience,

    // What You Will Learn operations
    updateWhatYouWillLearn,
    addWhatYouWillLearn,
    removeWhatYouWillLearn,

    // Prerequisites operations
    updatePrerequisites,
    addPrerequisites,
    removePrerequisites,

    // Target Audience operations
    updateTargetAudience,
    addTargetAudience,
    removeTargetAudience,

    // Initialize function
    initializeArrays,

    // Set functions for external updates
    setWhatYouWillLearn,
    setPrerequisites,
    setTargetAudience,
  };
}
