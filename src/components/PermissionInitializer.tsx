"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

/**
 * Component that automatically loads user permissions when the app initializes
 * Should be placed high in the component tree, ideally in layout or app provider
 */
export function PermissionInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedOut, permissions, loadPermissions } = useAuthStore();

  useEffect(() => {
    // Load permissions if user is logged in but permissions aren't loaded
    if (user && !isLoggedOut && !permissions) {
      loadPermissions();
    }
  }, [user, isLoggedOut, permissions, loadPermissions]);

  return <>{children}</>;
}
