"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useResetPassword from "./hooks/useResetPassword";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/errorMessage";

export default function ResetPasswordContent() {
  const { isSubmitting, onSubmit, errors,handleSubmit,register } = useResetPassword();

  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-background p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="New password"
          />
          <ErrorMessage error={errors.password?.message || ""} />
        </div>
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </section>
  );
}
