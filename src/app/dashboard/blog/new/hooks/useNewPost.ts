import { useRouter } from "next/navigation";
import { usePostMutations } from "../../hooks/usePostMutation";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BlogPostFormInput, blogPostFormSchema } from "../validations/post";
import { useMutation } from "@tanstack/react-query";
import UploadApiInstance from "@/api/UploadApi";
import { AxiosError } from "axios";
import { onChangeValidate } from "@/lib/utils";


export default function useNewPost() {
  const router = useRouter();
  const { create } = usePostMutations();

  const defaultValues: BlogPostFormInput = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "", // array is fine now
    cover: "",
    status: "draft",
    allowComments: true,
    metaTitle: "",
    metaDescription: "",
    canonical: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues,
  });

  const uploadMutation = useMutation({
    mutationKey: ["cover"],
    mutationFn: (formData: FormData) => UploadApiInstance.uploads(formData),
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      }
    },
    onSuccess(data) {
      toast.success("Cover Image uploaded successfully");
      setValue("cover", data.urls[0]);
      setFiles([]);
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const handleUpload = async (files: File[]) => {
    const formData = new FormData();
    setFiles(files);
    formData.append("images", files[0]);
    const res = await uploadMutation.mutateAsync(formData);
    setValue("cover", res.urls[0]);
  };

  const [isUpload, setIsUpload] = useState(true);

  const onSubmit = async (value: BlogPostFormInput) => {
   const payload = {
     ...value,
     tags: (value.tags ?? "")
       .split(",")
       .map((t) => t.trim())
       .filter(Boolean),
   };

    await create.mutateAsync(payload);
    toast.success("Post created");
    router.push("/dashboard/blog");
  };

  return {
    onSubmit,
    handleSubmit,
    handleUpload,
    register,
    errors,
    files,
    isUpload,
    fieldValues: getValues(),
    setIsUpload,
    reset,
    setValue,
    clearErrors,
    onChangeValidate,
    watch
  };
}
