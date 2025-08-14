// store/adminUI.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AdminUIState = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebar: (collapsed: boolean) => void;
};

export const useAdminUI = create<AdminUIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebar: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "admin.ui", // localStorage key
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // (optional) migrate: (state, ver) => state,
    }
  )
);

// Selectors to avoid unnecessary re-renders
export const useSidebarCollapsed = () => useAdminUI((s) => s.sidebarCollapsed);
export const useToggleSidebar = () => useAdminUI((s) => s.toggleSidebar);
