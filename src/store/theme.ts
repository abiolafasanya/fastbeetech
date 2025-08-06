import { create } from "zustand";

type ThemeState = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  initializeTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return { theme: newTheme };
    }),
  initializeTheme: () => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const active = stored ?? "light";
    document.documentElement.classList.toggle("dark", active === "dark");
    set({ theme: active });
  },
}));
