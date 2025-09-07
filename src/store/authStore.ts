// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi, { AuthResponse } from "@/api/AuthApi";

interface AuthState {
  user: AuthResponse["user"] | null;
  isLoggedOut: boolean;
  login: (data: AuthResponse["user"]) => void;
  logout: (redirect?: () => void) => void;
  setIsLoggedOut: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedOut: true,

      login: (user) => {
        set({ user, isLoggedOut: false });
      },
      logout: async (redirect: () => void = () => {}) => {
        // Backend clears HTTP-only cookie
        await authApi.logout();
        set({ user: null, isLoggedOut: true });
        redirect();
      },
      setIsLoggedOut: (val) => set({ isLoggedOut: val }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isLoggedOut: state.isLoggedOut,
      }),
    }
  )
);
