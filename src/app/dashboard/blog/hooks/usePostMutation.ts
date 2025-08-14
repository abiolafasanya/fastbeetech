// hooks/blog/usePostMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BlogApi, { BlogPost } from "@/api/BlogApi";

export function usePostMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationKey: ["postCreate"],
    mutationFn: (payload: Partial<BlogPost>) => BlogApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const update = useMutation({
    mutationKey: ["postUpdate"],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BlogPost> }) =>
      BlogApi.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", vars.id] });
    },
  });

  const remove = useMutation({
    mutationKey: ["postDelete"],
    mutationFn: (id: string) => BlogApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const publish = useMutation({
    mutationKey: ["postPublish"],
    mutationFn: (id: string) => BlogApi.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const schedule = useMutation({
    mutationKey: ["postSchedule"],
    mutationFn: ({ id, when }: { id: string; when: string }) =>
      BlogApi.schedule(id, when),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  const feature = useMutation({
    mutationKey: ["postFeature"],
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      BlogApi.toggleFeature(id, isFeatured),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  return { create, update, remove, publish, schedule, feature };
}
