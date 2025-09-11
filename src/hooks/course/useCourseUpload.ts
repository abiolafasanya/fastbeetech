import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import UploadApiInstance from "@/api/UploadApi";
import { CourseFormData } from "./useCourseEdit";

interface UseCourseUploadProps {
  form: UseFormReturn<CourseFormData>;
}

export function useCourseUpload({ form }: UseCourseUploadProps) {
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [isUploadMode, setIsUploadMode] = useState(false);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => UploadApiInstance.uploads(formData),
    onSuccess: (response) => {
      form.setValue("thumbnail", response.urls[0]);
      toast.success("Thumbnail uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload thumbnail");
      console.error("Upload error:", error);
    },
  });

  // File upload handler
  const handleThumbnailUpload = async (files: File[]) => {
    if (files.length > 0) {
      const formData = new FormData();
      setThumbnailFiles(files);
      formData.append("images", files[0]);
      await uploadMutation.mutateAsync(formData);
    }
  };

  // Initialize upload mode based on existing thumbnail
  const initializeUploadMode = (thumbnailUrl?: string) => {
    if (thumbnailUrl && thumbnailUrl.trim() !== "") {
      setIsUploadMode(false); // Use URL mode if thumbnail exists
    } else {
      setIsUploadMode(true); // Use upload mode if no thumbnail
    }
  };

  return {
    // State
    thumbnailFiles,
    setThumbnailFiles,
    isUploadMode,
    setIsUploadMode,

    // Mutations
    uploadMutation,

    // Handlers
    handleThumbnailUpload,
    initializeUploadMode,
  };
}
