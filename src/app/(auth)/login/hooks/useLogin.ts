import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../../schema/auth";
import authApi from "@/api/AuthApi";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const useLogin = () => {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { isLoggedOut, login, setIsLoggedOut } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useMutation({
    mutationKey: ["loginMutation"],
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      }
    },
    onSuccess() {
      setIsLoggedOut(false);
      toast.success("User LoggedIn");
      form.reset();
    },
  });

  useEffect(() => {
    if (!isLoggedOut) {
      console.log("Logout", isLoggedOut);
      router.push("/");
    }
  }, [isLoggedOut, router]);

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("=== FRONTEND LOGIN DEBUG ===");
    console.log("Making login request to:", process.env.NEXT_PUBLIC_BASE_URL);
    console.log("Login data:", { email: data.email, password: "***" });

    const response = await mutation.mutateAsync(data);

    console.log("Login response received:", {
      status: response ? "success" : "failed",
      user: response?.user?.email,
      hasToken: !!response?.token,
    });

    // Since backend sets HTTP-only cookie, we don't need to manually set it
    // But temporarily also set manually if token is in response
    if (response?.token) {
      console.log("Setting token manually from response");
      document.cookie = `token=${response.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; secure; samesite=lax`;
    }

    // Just update the auth store with user data
    login(response.user);

    // Check for redirect from middleware
    const redirectFromMiddleware = searchParams.get("redirect");
    const redirectFromSession = sessionStorage.getItem("redirectAfterLogin");
    sessionStorage.removeItem("redirectAfterLogin");

    if (redirectFromMiddleware) {
      router.replace(redirectFromMiddleware);
    } else if (redirectFromSession) {
      router.replace(redirectFromSession);
    } else {
      router.push("/");
    }
  });

  return { form, isSubmitting: mutation.isPending, handleSubmit };
};
