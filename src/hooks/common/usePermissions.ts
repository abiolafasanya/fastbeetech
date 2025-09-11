import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

/**
 * Custom hook that automatically loads permissions on mount
 * and provides permission checking utilities
 */
export function usePermissions() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    isLoadingPermissions,
    loadPermissions,
    user,
    isLoggedOut,
  } = useAuthStore();

  // Auto-load permissions when user logs in
  useEffect(() => {
    if (user && !isLoggedOut && !permissions && !isLoadingPermissions) {
      loadPermissions();
    }
  }, [user, isLoggedOut, permissions, isLoadingPermissions, loadPermissions]);

  return {
    // Core permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Permission data
    permissions,
    isLoadingPermissions,
    refreshPermissions: loadPermissions,

    // Convenience methods for common permission checks
    can: {
      // Course permissions
      createCourse: () => hasPermission("course:create"),
      editCourse: () => hasPermission("course:edit"),
      deleteCourse: () => hasPermission("course:delete"),
      publishCourse: () => hasPermission("course:publish"),
      manageCourses: () =>
        hasAnyPermission(["course:create", "course:edit", "course:delete"]),

      // Blog permissions
      createBlog: () => hasPermission("blog:create"),
      editBlog: () => hasPermission("blog:edit"),
      deleteBlog: () => hasPermission("blog:delete"),
      publishBlog: () => hasPermission("blog:publish"),
      manageBlogs: () =>
        hasAnyPermission(["blog:create", "blog:edit", "blog:delete"]),

      // User management permissions
      manageUsers: () => hasPermission("user:manage"),
      viewUsers: () => hasPermission("user:view"),
      createUsers: () => hasPermission("user:create"),

      // System permissions
      accessAdmin: () => hasPermission("system:admin"),
      viewAnalytics: () => hasPermission("analytics:view"),
      manageSettings: () => hasPermission("settings:manage"),
    },

    // Role-based checks (for backward compatibility)
    is: {
      superAdmin: () => user?.role === "super-admin",
      admin: () => user?.role === "admin" || hasPermission("system:admin"),
      author: () =>
        user?.role === "author" ||
        hasAnyPermission(["blog:create", "course:create"]),
      student: () => user?.role === "student",
      instructor: () => hasAnyPermission(["course:create", "course:edit"]),
    },
  };
}

/**
 * Hook for checking specific permissions with loading states
 */
export function usePermissionCheck(
  permission: string | string[],
  requireAll = false
) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoadingPermissions,
  } = useAuthStore();

  const checkPermission = () => {
    if (typeof permission === "string") {
      return hasPermission(permission);
    }

    return requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  };

  return {
    hasPermission: checkPermission(),
    isLoading: isLoadingPermissions,
  };
}
