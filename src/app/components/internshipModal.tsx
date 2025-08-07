// components/InternshipModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import InternshipApiInstance from "@/api/InternshipApi";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { handleServerError } from "@/lib/errorHelper";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(7),
  discipline: z.string(),
  experience: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export type InternshipFormData = z.infer<typeof formSchema>;

interface InternshipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InternshipModal({
  open,
  onOpenChange,
}: InternshipModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InternshipFormData>({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationKey: ["submitInternshipApplication"],
    mutationFn: (body: InternshipFormData) =>
      InternshipApiInstance.create(body),
    onError(error) {
      if (error instanceof AxiosError) {
        handleServerError(error);
      }
    },
    onSuccess(data) {
      if(!data.status){
        toast.error(data.message)
        return;
      }
      toast.success(data.message);
    }
  });

  const onSubmit = async (data: InternshipFormData) => {
    setLoading(true);
    try {
      // Submit to API or email service
      await mutation.mutateAsync(data);
      // console.log("Submitted: ", data);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Internship Registration</DialogTitle>
            <DialogDescription>
              Fill in your details and we’ll get in touch.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. 08012345678"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discipline">Discipline</Label>
              <Input
                id="discipline"
                placeholder="Software Engineering or Graphics Design"
                {...register("discipline")}
              />
              {errors.discipline && (
                <p className="text-sm text-red-500">
                  {errors.discipline.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience">Experience Level</Label>
              <select
                id="experience"
                className="border rounded-md px-3 py-2"
                {...register("experience")}
              >
                <option value="">Select</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
