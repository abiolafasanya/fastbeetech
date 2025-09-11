// hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import authApi from "@/api/AuthApi";

export default function useAuthRedirect() {
  const { user, setIsLoggedOut } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // If no user in store, verify with server
      if (!user) {
        try {
          await authApi.getMe();
          // If successful, user is authenticated (AppInitProvider will set user)
          return;
        } catch {
          // User is not authenticated
          setIsLoggedOut(true);
          sessionStorage.setItem("redirectAfterLogin", pathname);
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [user, pathname, router, setIsLoggedOut]);
}
