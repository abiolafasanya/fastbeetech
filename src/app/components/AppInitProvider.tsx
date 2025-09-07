"use client";

import axiosConfig from "@/lib/axiosConfig";
import { useAuthStore } from "@/store/authStore";
import authApi from "@/api/AuthApi";
import { useEffect } from "react";

export default function AppInitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, setIsLoggedOut } = useAuthStore();

  useEffect(() => {
    // Initialize axios config
    axiosConfig();

    // Check if user is authenticated by calling /me endpoint
    const checkAuth = async () => {
      try {
        const user = await authApi.getMe();
        login(user);
        setIsLoggedOut(false);
      } catch {
        setIsLoggedOut(true);
      }
    };

    checkAuth();
  }, [login, setIsLoggedOut]);

  return <>{children}</>;
}
