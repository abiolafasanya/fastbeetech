"use client";

import { useState } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/PermissionGuard";
import { useAuthStore } from "@/store/authStore";

export default function RBACDemoPage() {
  const { user, permissions } = useAuthStore();
  const { can, hasPermission } = usePermissions();
  const [testPermission, setTestPermission] = useState("course:create");

  // Mock user data for demonstration
  const mockUsers = [
    {
      id: "1",
      name: "Super Admin",
      email: "admin@fastbeetech.com",
      role: "super-admin",
      permissions: [
        "course:create",
        "course:edit",
        "course:delete",
        "course:publish",
        "blog:create",
        "blog:edit",
        "blog:delete",
        "blog:publish",
        "user:view",
        "user:create",
        "user:edit",
        "user:delete",
        "user:manage",
        "system:admin",
        "analytics:view",
        "settings:manage",
      ],
    },
    {
      id: "2",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      permissions: [
        "course:create",
        "course:edit",
        "course:delete",
        "blog:create",
        "blog:edit",
        "blog:delete",
        "user:view",
        "user:create",
        "user:edit",
        "analytics:view",
      ],
    },
    {
      id: "3",
      name: "Author User",
      email: "author@example.com",
      role: "author",
      permissions: [
        "course:create",
        "course:edit",
        "blog:create",
        "blog:edit",
        "blog:delete",
      ],
    },
    {
      id: "4",
      name: "Student User",
      email: "student@example.com",
      role: "student",
      permissions: ["course:view", "blog:view"],
    },
  ];

  const simulateLogin = (mockUser: (typeof mockUsers)[0]) => {
    // Simulate login with mock user data
    useAuthStore.setState({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: "",
        phone: "",
      },
      permissions: {
        effective: mockUser.permissions,
        role: mockUser.permissions,
        extra: [],
      },
      isLoggedOut: false,
    });
  };

  const logout = () => {
    useAuthStore.setState({
      user: null,
      permissions: null,
      isLoggedOut: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔐 RBAC System Demo
          </h1>
          <p className="text-gray-600">
            Test your Role-Based Access Control system with different user roles
          </p>
        </div>

        {/* User Simulation Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            👤 Simulate Different Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {mockUsers.map((mockUser) => (
              <button
                key={mockUser.id}
                onClick={() => simulateLogin(mockUser)}
                className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
              >
                <div className="font-semibold">{mockUser.name}</div>
                <div className="text-sm text-gray-600">{mockUser.role}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {mockUser.permissions.length} permissions
                </div>
              </button>
            ))}
          </div>

          {user && (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <span className="font-semibold">Logged in as:</span> {user.name}{" "}
                ({user.role})
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Current User Status */}
        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Info & Permissions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                📋 Current User & Permissions
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {user.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {user.role}
                  </span>
                </div>

                {permissions && (
                  <div>
                    <span className="font-medium">
                      Permissions ({permissions.effective?.length || 0}):
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {permissions.effective?.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Permission Testing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                🧪 Test Permission Checks
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Test Permission:
                  </label>
                  <select
                    value={testPermission}
                    onChange={(e) => setTestPermission(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="course:create">course:create</option>
                    <option value="course:edit">course:edit</option>
                    <option value="course:delete">course:delete</option>
                    <option value="blog:create">blog:create</option>
                    <option value="blog:publish">blog:publish</option>
                    <option value="user:manage">user:manage</option>
                    <option value="system:admin">system:admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>hasPermission(&quot;{testPermission}&quot;)</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        hasPermission(testPermission)
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {hasPermission(testPermission) ? "✅ True" : "❌ False"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>can.createCourse()</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        can.createCourse()
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {can.createCourse() ? "✅ True" : "❌ False"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>can.manageUsers()</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        can.manageUsers()
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {can.manageUsers() ? "✅ True" : "❌ False"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No User Logged In</h3>
            <p className="text-gray-600 mb-4">
              Please simulate a login by clicking one of the user buttons above
            </p>
          </div>
        )}

        {/* Component Demos */}
        {user && (
          <div className="mt-6 space-y-6">
            {/* PermissionGuard Demo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                🛡️ PermissionGuard Component Demo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">
                    Course Management
                  </h4>

                  <PermissionGuard permission="course:create">
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      ✅ Create Course Button (course:create)
                    </div>
                  </PermissionGuard>

                  <PermissionGuard permission="course:delete">
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      🗑️ Delete Course Button (course:delete)
                    </div>
                  </PermissionGuard>

                  <PermissionGuard
                    permission="course:publish"
                    fallback={
                      <div className="p-3 bg-gray-100 border border-gray-300 rounded text-gray-500">
                        🚫 Publish Course (No Permission)
                      </div>
                    }
                  >
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      📢 Publish Course Button (course:publish)
                    </div>
                  </PermissionGuard>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Admin Functions</h4>

                  <PermissionGuard permission="user:manage">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      👥 User Management Panel (user:manage)
                    </div>
                  </PermissionGuard>

                  <PermissionGuard permission="system:admin">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                      ⚙️ System Settings (system:admin)
                    </div>
                  </PermissionGuard>

                  <PermissionGuard
                    permissions={["blog:create", "blog:edit"]}
                    requireAll={false}
                  >
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      📝 Blog Management (blog:create OR blog:edit)
                    </div>
                  </PermissionGuard>
                </div>
              </div>
            </div>

            {/* Navigation Demo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                🧭 Dynamic Navigation Demo
              </h3>

              <nav className="space-y-2">
                <div className="p-2 bg-gray-100 rounded">
                  📊 Dashboard (Always visible)
                </div>

                <PermissionGuard permission="course:create">
                  <div className="p-2 bg-green-100 rounded">
                    ➕ Create Course
                  </div>
                </PermissionGuard>

                <PermissionGuard permissions={["course:edit", "course:delete"]}>
                  <div className="p-2 bg-blue-100 rounded">
                    ⚙️ Manage Courses
                  </div>
                </PermissionGuard>

                <PermissionGuard permission="blog:create">
                  <div className="p-2 bg-yellow-100 rounded">
                    ✍️ Create Blog Post
                  </div>
                </PermissionGuard>

                <PermissionGuard permission="user:manage">
                  <div className="p-2 bg-red-100 rounded">
                    👥 User Management
                  </div>
                </PermissionGuard>

                <PermissionGuard permission="analytics:view">
                  <div className="p-2 bg-purple-100 rounded">📈 Analytics</div>
                </PermissionGuard>
              </nav>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🎉 Your RBAC system is working perfectly!</p>
          <p>
            Try switching between different users to see how the UI adapts to
            their permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
