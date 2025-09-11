"use client";

import MDXEditor from "@/components/MDXEditor";
import { Button } from "@/components/ui/button";
import UploadDropzone from "@/components/fileUpload";
import useNewPost from "./hooks/useNewPost";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import ErrorMessage from "@/components/errorMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { slugify } from "@/lib/utils";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function NewPostPage() {
  const {
    errors,
    files,
    handleSubmit,
    handleUpload,
    isUpload,
    onSubmit,
    register,
    fieldValues,
    clearErrors,
    onChangeValidate,
    setValue,
    setIsUpload,
    watch,
  } = useNewPost();

  return (
    <RoleGuard permissions={["blog:create"]} showFallback={true}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-medium mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Title</Label>
            <Input
              {...register("title")}
              onChange={({ target }) => {
                onChangeValidate("title", target.value, setValue, clearErrors);
                const slug = slugify(target.value);
                onChangeValidate("slug", slug, setValue, clearErrors);
              }}
            />
            <ErrorMessage error={errors.title?.message || ""} />
          </div>
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Slug</Label>
            <Input {...register("slug")} />
            <ErrorMessage error={errors.slug?.message || ""} />
          </div>
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Except</Label>
            <Input {...register("excerpt")} />
            <ErrorMessage error={errors.excerpt?.message || ""} />
          </div>
          <div>
            {isUpload ? (
              <>
                <Label className="mb-2 text-sm font-medium">Cover Upload</Label>
                <UploadDropzone
                  maxFiles={1}
                  files={files}
                  onChange={async (files) => {
                    await handleUpload(files);
                    // setEditingAvatar(false);
                  }}
                />
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="mb-2 text-sm font-medium">Cover URL</Label>
                  <Input {...register("cover")} />
                  <ErrorMessage error={errors.cover?.message || ""} />
                </div>
              </>
            )}
            <div className="text-sm text-gray-600">
              {isUpload ? (
                <Button
                  variant={"link"}
                  type="button"
                  className="p-0 text-xs"
                  onClick={() => setIsUpload(false)}
                >
                  Paste Link
                </Button>
              ) : (
                <Button
                  variant={"link"}
                  className="p-0 text-xs"
                  type="button"
                  onClick={() => setIsUpload(true)}
                >
                  File Upload
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">
              Tags (comma separated)
            </Label>
            <Input {...register("tags")} />
            <ErrorMessage error={errors.tags?.message || ""} />
          </div>
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Content</Label>
            <MDXEditor
              value={fieldValues.content}
              height={200}
              onChange={(v) =>
                onChangeValidate("content", v, setValue, clearErrors)
              }
            />
            <ErrorMessage error={errors.content?.message || ""} />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="mb-2 text-sm font-medium">Meta Title</Label>
              <Input {...register("metaTitle")} />
              <ErrorMessage error={errors.metaTitle?.message || ""} />
            </div>
            <div className="space-y-2">
              <Label className="mb-2 text-sm font-medium">
                Meta Description
              </Label>
              <Input {...register("metaDescription")} />
              <ErrorMessage error={errors.metaDescription?.message || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Canonical URL</Label>
            <Input {...register("canonical")} />
            <ErrorMessage error={errors.canonical?.message || ""} />
          </div>

          <div className="">
            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
              <Checkbox
                id="allowComments"
                // defaultChecked
                checked={watch("allowComments")}
                onCheckedChange={(checked) =>
                  onChangeValidate(
                    "allowComments",
                    checked as boolean,
                    setValue,
                    clearErrors
                  )
                }
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  Allow comments
                </p>
                <p className="text-muted-foreground text-sm">
                  You can enable or disable comment at any time.
                </p>
              </div>
            </Label>
          </div>
          <Button>Create Post</Button>
        </form>
      </div>
    </RoleGuard>
  );
}
