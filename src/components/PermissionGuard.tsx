import { useAuthStore } from "@/store/authStore";
import { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission.
  fallback?: ReactNode;
  role?: string; // Legacy role-based access
}

/**
 * PermissionGuard Component
 *
 * Conditionally renders children based on user permissions
 *
 * Examples:
 * <PermissionGuard permission="course:create">
 *   <CreateCourseButton />
 * </PermissionGuard>
 *
 * <PermissionGuard permissions={["blog:create", "blog:edit"]} requireAll={false}>
 *   <BlogManagementMenu />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  role,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, user } =
    useAuthStore();

  // Legacy role-based check (fallback)
  if (role && user?.role !== role) {
    return <>{fallback}</>;
  }

  // Single permission check
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Multiple permissions check
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Hook for permission checks in components
 */
export function usePermissions() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    isLoadingPermissions,
    loadPermissions,
  } = useAuthStore();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    isLoadingPermissions,
    refreshPermissions: loadPermissions,
    // Helper methods for common checks
    canCreateCourse: () => hasPermission("course:create"),
    canEditCourse: () => hasPermission("course:edit"),
    canManageCourses: () =>
      hasAnyPermission(["course:create", "course:edit", "course:delete"]),
    canCreateBlog: () => hasPermission("blog:create"),
    canPublishBlog: () => hasPermission("blog:publish"),
    canManageUsers: () => hasPermission("user:manage"),
    isAdmin: () => hasAnyPermission(["user:manage", "system:admin"]),
    isInstructor: () => hasAnyPermission(["course:create", "course:edit"]),
  };
}
