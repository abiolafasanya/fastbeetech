"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MDXEditor from "@/components/MDXEditor";
import UploadDropzone from "@/components/fileUpload";
import ErrorMessage from "@/components/errorMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { slugify } from "@/lib/utils";
import { useEditPost } from "./hooks/useEditPost";
import { Loader2 } from "lucide-react";

export default function EditPostPage({
  params,
}: {
  params: { idOrSlug: string };
}) {
  const { idOrSlug } = params;
  const {
    isLoading,
    isSaving,
    register,
    errors,
    handleSubmit,
    onSubmit,
    fieldValues,
    setValue,
    clearErrors,
    onChangeValidate,
    watch,
    isUpload,
    setIsUpload,
    files,
    handleUpload,
    refetchPost,
    publishNow,
    scheduleAt,
    isPublishing,
    isScheduling,
  } = useEditPost(idOrSlug);

  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleISO, setScheduleISO] = useState<string>("");

  // keep slug in sync with title edits only if user hasn’t manually changed slug
  const title = watch("title");
  const slug = watch("slug");
  const userTouchedSlug = useMemo(
    () => slug && slug !== slugify(title || ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug] // derive once slug differs; avoids slug fighting while typing
  );

  useEffect(() => {
    if (title && !userTouchedSlug) {
      const s = slugify(title);
      onChangeValidate("slug", s, setValue, clearErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm p-6">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading post...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-medium">Edit Post</h2>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => refetchPost()}
        >
          Refresh
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label className="mb-2 text-sm font-medium">Title</Label>
          <Input
            {...register("title")}
            onChange={({ target }) =>
              onChangeValidate("title", target.value, setValue, clearErrors)
            }
          />
          <ErrorMessage error={errors.title?.message || ""} />
        </div>

        <div className="space-y-2">
          <Label className="mb-2 text-sm font-medium">Slug</Label>
          <Input
            {...register("slug")}
            onChange={({ target }) =>
              onChangeValidate("slug", target.value, setValue, clearErrors)
            }
          />
          <ErrorMessage error={errors.slug?.message || ""} />
        </div>

        <div className="space-y-2">
          <Label className="mb-2 text-sm font-medium">Excerpt</Label>
          <Input
            {...register("excerpt")}
            onChange={({ target }) =>
              onChangeValidate("excerpt", target.value, setValue, clearErrors)
            }
          />
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
                }}
              />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="mb-2 text-sm font-medium">Cover URL</Label>
                <Input
                  {...register("cover")}
                  onChange={({ target }) =>
                    onChangeValidate(
                      "cover",
                      target.value,
                      setValue,
                      clearErrors
                    )
                  }
                />
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
          <Input
            {...register("tags")}
            onChange={({ target }) =>
              onChangeValidate("tags", target.value, setValue, clearErrors)
            }
          />
          <ErrorMessage error={errors.tags?.message || ""} />
        </div>

        <div className="space-y-2">
          <Label className="mb-2 text-sm font-medium">Content</Label>
          <MDXEditor
            value={fieldValues.content}
            height={220}
            onChange={(v) =>
              onChangeValidate("content", v, setValue, clearErrors)
            }
          />
          <ErrorMessage error={errors.content?.message || ""} />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Meta Title</Label>
            <Input
              {...register("metaTitle")}
              onChange={({ target }) =>
                onChangeValidate(
                  "metaTitle",
                  target.value,
                  setValue,
                  clearErrors
                )
              }
            />
            <ErrorMessage error={errors.metaTitle?.message || ""} />
          </div>
          <div className="space-y-2">
            <Label className="mb-2 text-sm font-medium">Meta Description</Label>
            <Input
              {...register("metaDescription")}
              onChange={({ target }) =>
                onChangeValidate(
                  "metaDescription",
                  target.value,
                  setValue,
                  clearErrors
                )
              }
            />
            <ErrorMessage error={errors.metaDescription?.message || ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="mb-2 text-sm font-medium">Canonical URL</Label>
          <Input
            {...register("canonical")}
            onChange={({ target }) =>
              onChangeValidate("canonical", target.value, setValue, clearErrors)
            }
          />
          <ErrorMessage error={errors.canonical?.message || ""} />
        </div>

        <div className="">
          <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
            <Checkbox
              id="allowComments"
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
              <p className="text-sm leading-none font-medium">Allow comments</p>
              <p className="text-muted-foreground text-sm">
                You can enable or disable comments at any time.
              </p>
            </div>
          </Label>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Save changes
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isPublishing}
            onClick={publishNow}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Publish now
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSchedule((s) => !s)}
          >
            Schedule…
          </Button>

          {showSchedule && (
            <div className="flex items-center gap-2">
              <Input
                type="datetime-local"
                onChange={(e) =>
                  setScheduleISO(new Date(e.target.value).toISOString())
                }
              />
              <Button
                type="button"
                variant="secondary"
                disabled={!scheduleISO || isScheduling}
                onClick={() => scheduleAt(scheduleISO)}
              >
                {isScheduling ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Set schedule
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
