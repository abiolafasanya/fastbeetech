"use client";

import {
  RequirePermission,
  UnauthorizedPage,
} from "@/components/RequirePermission";
import { PermissionGuard } from "@/components/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * Example: Course Creation Page
 * This page requires the "course:create" permission
 */
function CreateCoursePageContent() {
  const { can } = usePermissions();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Course</h1>

        {/* Only show publish option if user can publish */}
        <PermissionGuard permission="course:publish">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Save & Publish
          </button>
        </PermissionGuard>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Course Title</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter course title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 h-32"
            placeholder="Course description"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Save Draft
          </button>

          {can.publishCourse() && (
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              Create Course
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <RequirePermission permission="course:create" fallback={UnauthorizedPage}>
      <CreateCoursePageContent />
    </RequirePermission>
  );
}

/**
 * Example: User Management Page
 * Requires user:manage permission
 */
export function UserManagementPage() {
  const { can, hasPermission } = usePermissions();

  return (
    <RequirePermission permission="user:manage">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* View Users Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">View Users</h3>
            <p className="text-gray-600 mb-4">Browse all system users</p>
            {hasPermission("user:view") ? (
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                View Users
              </button>
            ) : (
              <p className="text-red-500 text-sm">
                No permission to view users
              </p>
            )}
          </div>

          {/* Create Users Card */}
          <PermissionGuard permission="user:create">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Create User</h3>
              <p className="text-gray-600 mb-4">Add new system users</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Create User
              </button>
            </div>
          </PermissionGuard>

          {/* System Settings Card */}
          <PermissionGuard permission="settings:manage">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">System Settings</h3>
              <p className="text-gray-600 mb-4">Configure system settings</p>
              <button className="bg-purple-500 text-white px-4 py-2 rounded">
                Open Settings
              </button>
            </div>
          </PermissionGuard>
        </div>

        {/* Advanced Actions - Multiple Permissions */}
        <PermissionGuard
          permissions={["user:delete", "system:admin"]}
          requireAll={false}
        >
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Advanced Actions
            </h3>
            <p className="text-red-600 mb-4">
              These actions require administrative privileges
            </p>
            <div className="space-x-4">
              {can.manageUsers() && (
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Bulk Delete Users
                </button>
              )}
              {hasPermission("system:admin") && (
                <button className="bg-red-600 text-white px-4 py-2 rounded">
                  System Reset
                </button>
              )}
            </div>
          </div>
        </PermissionGuard>
      </div>
    </RequirePermission>
  );
}
