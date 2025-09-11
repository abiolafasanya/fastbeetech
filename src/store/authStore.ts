// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi, { AuthResponse } from "@/api/AuthApi";
import permissionApi, { UserPermissions } from "@/api/PermissionApi";

interface AuthState {
  user: AuthResponse["user"] | null;
  permissions: UserPermissions | null;
  isLoggedOut: boolean;
  isLoadingPermissions: boolean;
  login: (data: AuthResponse["user"]) => void;
  logout: (redirect?: () => void) => void;
  setIsLoggedOut: (val: boolean) => void;
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      permissions: null,
      isLoggedOut: true,
      isLoadingPermissions: false,

      login: async (user) => {
        set({ user, isLoggedOut: false });
        // Load permissions after login
        get().loadPermissions();
      },

      logout: async (redirect: () => void = () => {}) => {
        // Backend clears HTTP-only cookie
        await authApi.logout();
        set({ user: null, permissions: null, isLoggedOut: true });
        redirect();
      },

      setIsLoggedOut: (val) => set({ isLoggedOut: val }),

      loadPermissions: async () => {
        const { user, isLoggedOut } = get();
        if (!user || isLoggedOut) return;

        try {
          set({ isLoadingPermissions: true });
          const response = await permissionApi.getUserPermissions();
          set({ permissions: response.permissions });
        } catch (error) {
          console.error("Failed to load user permissions:", error);
          // Don't logout on permission fetch failure, just log the error
        } finally {
          set({ isLoadingPermissions: false });
        }
      },

      hasPermission: (permission: string) => {
        const { permissions } = get();
        return permissions?.effective?.includes(permission) || false;
      },

      hasAnyPermission: (permissionList: string[]) => {
        const { permissions } = get();
        if (!permissions?.effective) return false;
        return permissionList.some((permission) =>
          permissions.effective.includes(permission)
        );
      },

      hasAllPermissions: (permissionList: string[]) => {
        const { permissions } = get();
        if (!permissions?.effective) return false;
        return permissionList.every((permission) =>
          permissions.effective.includes(permission)
        );
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isLoggedOut: state.isLoggedOut,
        permissions: state.permissions, // Persist permissions
      }),
    }
  )
);
