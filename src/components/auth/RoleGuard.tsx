// components/auth/RoleGuard.tsx
"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  permissions?: string | string[];
  roles?: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showFallback?: boolean;
}

/**
 * RoleGuard component to protect components/pages based on user permissions or roles
 */
export function RoleGuard({
  children,
  permissions,
  roles,
  requireAll = false,
  fallback,
  redirectTo,
  showFallback = true,
}: RoleGuardProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoadingPermissions,
    is,
  } = usePermissions();

  // Show loading state while permissions are being fetched
  if (isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check permissions
  let hasRequiredPermissions = false;
  if (permissions) {
    if (typeof permissions === "string") {
      hasRequiredPermissions = hasPermission(permissions);
    } else {
      hasRequiredPermissions = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }
  }

  // Check roles
  let hasRequiredRoles = false;
  if (roles) {
    const roleList = typeof roles === "string" ? [roles] : roles;
    hasRequiredRoles = roleList.some((role) => {
      switch (role) {
        case "super-admin":
          return is.superAdmin();
        case "admin":
          return is.admin();
        case "instructor":
          return is.instructor();
        case "author":
          return is.author();
        case "student":
          return is.student();
        default:
          return false;
      }
    });
  }

  // If both permissions and roles are specified, user must have at least one
  const hasAccess =
    (!permissions && !roles) || // No restrictions
    (permissions && !roles && hasRequiredPermissions) || // Only permissions
    (!permissions && roles && hasRequiredRoles) || // Only roles
    (permissions && roles && (hasRequiredPermissions || hasRequiredRoles)); // Both specified

  // Handle redirect
  if (!hasAccess && redirectTo && typeof window !== "undefined") {
    window.location.href = redirectTo;
    return null;
  }

  // If access is denied
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showFallback) {
      return null;
    }

    return (
      <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          You don&apos;t have permission to access this content. Please contact
          your administrator if you believe this is an error.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

/**
 * Hook for conditional rendering based on permissions
 */
export function useRoleCheck(
  permissions?: string | string[],
  roles?: string | string[],
  requireAll = false
) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoadingPermissions,
    is,
  } = usePermissions();

  if (isLoadingPermissions) {
    return { hasAccess: false, isLoading: true };
  }

  // Check permissions
  let hasRequiredPermissions = false;
  if (permissions) {
    if (typeof permissions === "string") {
      hasRequiredPermissions = hasPermission(permissions);
    } else {
      hasRequiredPermissions = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }
  }

  // Check roles
  let hasRequiredRoles = false;
  if (roles) {
    const roleList = typeof roles === "string" ? [roles] : roles;
    hasRequiredRoles = roleList.some((role) => {
      switch (role) {
        case "super-admin":
          return is.superAdmin();
        case "admin":
          return is.admin();
        case "instructor":
          return is.instructor();
        case "author":
          return is.author();
        case "student":
          return is.student();
        default:
          return false;
      }
    });
  }

  const hasAccess =
    (!permissions && !roles) ||
    (permissions && !roles && hasRequiredPermissions) ||
    (!permissions && roles && hasRequiredRoles) ||
    (permissions && roles && (hasRequiredPermissions || hasRequiredRoles));

  return { hasAccess, isLoading: false };
}
