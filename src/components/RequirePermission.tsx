"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RequirePermissionProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  redirectTo?: string;
  fallback?: React.ComponentType;
  children: React.ReactNode;
}

/**
 * Higher-order component that protects routes based on permissions
 *
 * Usage:
 * <RequirePermission permission="course:create" redirectTo="/dashboard">
 *   <CreateCoursePage />
 * </RequirePermission>
 *
 * <RequirePermission permissions={["blog:create", "blog:edit"]} requireAll={false}>
 *   <BlogManagementPage />
 * </RequirePermission>
 */
export function RequirePermission({
  permission,
  permissions,
  requireAll = false,
  redirectTo = "/dashboard",
  fallback: FallbackComponent,
  children,
}: RequirePermissionProps) {
  const router = useRouter();
  const {
    user,
    isLoggedOut,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoadingPermissions,
    loadPermissions,
  } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoggedOut) {
      router.push("/login");
      return;
    }

    if (user && !isLoadingPermissions) {
      // Load permissions if not already loaded
      if (!useAuthStore.getState().permissions) {
        loadPermissions().then(() => setIsChecking(false));
      } else {
        setIsChecking(false);
      }
    }
  }, [user, isLoggedOut, isLoadingPermissions, loadPermissions, router]);

  // Show loading while checking authentication and permissions
  if (isLoggedOut || isChecking || isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check permissions
  let hasAccess = true;

  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (permissions) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Redirect if no access
  if (!hasAccess) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    router.push(redirectTo);
    return null;
  }

  return <>{children}</>;
}

/**
 * Unauthorized fallback component
 */
export function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
