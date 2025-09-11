"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/PermissionGuard";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  permission?: string;
  permissions?: string[];
  icon?: React.ReactNode;
  requireAll?: boolean;
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    label: "My Courses",
    href: "/dashboard/courses",
    icon: "📚",
  },
  {
    label: "Create Course",
    href: "/dashboard/courses/create",
    permission: "course:create",
    icon: "➕",
  },
  {
    label: "Manage Courses",
    href: "/dashboard/courses/manage",
    permissions: ["course:edit", "course:delete"],
    icon: "⚙️",
  },
  {
    label: "Blog Posts",
    href: "/dashboard/blog",
    permissions: ["blog:create", "blog:edit"],
    icon: "📝",
  },
  {
    label: "Create Post",
    href: "/dashboard/blog/create",
    permission: "blog:create",
    icon: "✍️",
  },
  {
    label: "User Management",
    href: "/dashboard/users",
    permission: "user:manage",
    icon: "👥",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    permission: "analytics:view",
    icon: "📈",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    permission: "settings:manage",
    icon: "⚙️",
  },
];

export function DashboardNavigation() {
  const { can, is, isLoadingPermissions } = usePermissions();

  if (isLoadingPermissions) {
    return (
      <nav className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <PermissionGuard
          key={item.href}
          permission={item.permission}
          permissions={item.permissions}
          requireAll={item.requireAll}
        >
          <Link
            href={item.href}
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        </PermissionGuard>
      ))}

      {/* Role-based sections for backward compatibility */}
      {is.admin() && (
        <div className="pt-4 border-t">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Admin
          </p>
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span>🔐</span>
            <span>Admin Panel</span>
          </Link>
        </div>
      )}
    </nav>
  );
}

/**
 * Example usage in a page component
 */
export function ExampleUsage() {
  const { can, hasPermission, isLoadingPermissions } = usePermissions();

  return (
    <div className="p-6">
      <h1>Dashboard Example</h1>

      {/* Conditional rendering based on permissions */}
      {can.createCourse() && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New Course
        </button>
      )}

      {/* Multiple permission checks */}
      {can.manageBlogs() && (
        <div>
          <h2>Blog Management</h2>
          <p>You can create or edit blog posts</p>
        </div>
      )}

      {/* Using PermissionGuard component */}
      <PermissionGuard permission="user:manage">
        <div className="bg-red-50 p-4 rounded">
          <h3>Admin Section</h3>
          <p>Only users with user management permissions can see this</p>
        </div>
      </PermissionGuard>

      {/* Loading state */}
      {isLoadingPermissions && <div>Loading permissions...</div>}

      {/* Direct permission check */}
      {hasPermission("analytics:view") && (
        <div>
          <h3>Analytics Dashboard</h3>
          <p>View analytics data here</p>
        </div>
      )}
    </div>
  );
}
