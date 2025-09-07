"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "sonner";
import BlogApiInstance from "@/api/BlogApi";
import UploadApiInstance from "@/api/UploadApi";
import { onChangeValidate } from "@/lib/utils";
import {
  BlogPostEditInput,
  blogPostEditSchema,
  toClientDefaults,
  toServerPayload,
} from "../validations/edit";
import { handleServerError } from "@/lib/errorHelper";

const isObjectId = (s: string) => /^[a-f0-9]{24}$/i.test(s);

export function useEditPost(idOrSlug: string) {
  const qc = useQueryClient();

  // ---------- FETCH ----------
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["blog", "post", idOrSlug],
    queryFn: async () => {
      if (isObjectId(idOrSlug)) {
        // Needs GET by ID endpoint
        return BlogApiInstance.getById(idOrSlug);
      }
      return BlogApiInstance.getBySlug(idOrSlug);
    },
  });

  const post = data?.data;

  // ---------- FORM ----------
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<BlogPostEditInput>({
    resolver: zodResolver(blogPostEditSchema),
    defaultValues: toClientDefaults(post), // safe for first render
  });

  useEffect(() => {
    if (post) reset(toClientDefaults(post));
  }, [post, reset]);

  // ---------- UPLOAD ----------
  const [files, setFiles] = useState<File[]>([]);
  const [isUpload, setIsUpload] = useState<boolean>(
    !post?.cover ? true : false
  );

  const uploadMutation = useMutation({
    mutationKey: ["blog", "cover", "upload"],
    mutationFn: (formData: FormData) => UploadApiInstance.uploads(formData),
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      }
    },
    onSuccess(data) {
      toast.success("Cover uploaded");
      setValue("cover", data.urls[0]);
      setFiles([]);
    },
  });

  const handleUpload = async (files: File[]) => {
    const formData = new FormData();
    setFiles(files);
    formData.append("images", files[0]);
    const res = await uploadMutation.mutateAsync(formData);
    setValue("cover", res.urls[0]);
  };

  // ---------- SAVE (UPDATE) ----------
  const updateMutation = useMutation({
    mutationKey: ["blog", "update", post?._id],
    mutationFn: async (payload: BlogPostEditInput) => {
      if (!post?._id) throw new Error("Post not loaded");
      return BlogApiInstance.update(post._id, toServerPayload(payload));
    },
    onSuccess() {
      toast.success("Post updated");
      qc.invalidateQueries({ queryKey: ["blog"] });
      qc.invalidateQueries({ queryKey: ["blog", "post", idOrSlug] });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        handleServerError(error);
      }
    },
  });

  const onSubmit = async (value: BlogPostEditInput) => {
    await updateMutation.mutateAsync(value);
  };

  // ---------- PUBLISH ----------
  const publishMutation = useMutation({
    mutationKey: ["blog", "publish", post?._id],
    mutationFn: async () => {
      if (!post?._id) throw new Error("Post not loaded");
      return BlogApiInstance.publish(post._id);
    },
    onSuccess() {
      toast.success("Published");
      qc.invalidateQueries({ queryKey: ["blog"] });
      qc.invalidateQueries({ queryKey: ["blog", "post", idOrSlug] });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        handleServerError(error);
      }
    },
  });

  const publishNow = () => publishMutation.mutate();

  // ---------- SCHEDULE ----------
  const scheduleMutation = useMutation({
    mutationKey: ["blog", "schedule", post?._id],
    mutationFn: async (iso: string) => {
      if (!post?._id) throw new Error("Post not loaded");
      return BlogApiInstance.schedule(post._id, iso);
    },
    onSuccess() {
      toast.success("Scheduled");
      qc.invalidateQueries({ queryKey: ["blog"] });
      qc.invalidateQueries({ queryKey: ["blog", "post", idOrSlug] });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        handleServerError(error);
      }
    },
  });

  const scheduleAt = (iso: string) => scheduleMutation.mutate(iso);

  return {
    // form
    register,
    errors,
    handleSubmit,
    onSubmit,
    setValue,
    clearErrors,
    getValues,
    watch,
    fieldValues: getValues(),
    // state
    isLoading,
    isSaving: updateMutation.isPending,
    // upload
    files,
    handleUpload,
    isUpload,
    setIsUpload,
    // controls
    onChangeValidate,
    refetchPost: refetch,
    publishNow,
    scheduleAt,
    isPublishing: publishMutation.isPending,
    isScheduling: scheduleMutation.isPending,
  };
}
