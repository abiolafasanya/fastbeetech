"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { usePermissions } from "@/hooks/usePermissions";
import {
  useUsers,
  useUserActions,
  // useRoleHierarchy, // TODO: Use for role dropdown options
  type User,
  type UserFilters,
} from "@/hooks/useUserManagement";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Search } from "lucide-react";
import { CreateUserModal } from "@/components/dashboard/CreateUserModal";
import { ViewUserPermissionsModal } from "@/components/dashboard/ViewUserPermissionsModal";

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const { can, is } = usePermissions();

  // Use the new hooks
  const filters: UserFilters = {
    page: 1,
    limit: 50,
    ...(search && { search }),
    ...(roleFilter !== "all" && { role: roleFilter }),
  };

  const { data, isLoading, error } = useUsers(filters);
  const {
    assignRole,
    makeMeSuperAdmin,
    deleteUser,
    isLoading: isActionLoading,
  } = useUserActions();
  // const { data: roleHierarchy } = useRoleHierarchy(); // TODO: Use for role dropdown options

  const handleRoleChange = (userId: string, newRole: string) => {
    assignRole({ userId, role: newRole });
  };

  const handleMakeSuperAdmin = () => {
    makeMeSuperAdmin();
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      deleteUser(userId);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: { row: { original: User } }) => {
        const role = row.original.role;
        return (
          <Badge
            variant={
              role === "super-admin"
                ? "destructive"
                : role === "admin"
                ? "default"
                : "secondary"
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: User } }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "inactive"
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }: { row: { original: User } }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }: { row: { original: User } }) => {
        const lastLogin = row.original.lastLogin;
        return lastLogin ? new Date(lastLogin).toLocaleDateString() : "Never";
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {/* View Permissions - Available for all authorized users */}
              {(can.manageUsers() || is.superAdmin()) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setShowPermissionsModal(true);
                    }}
                  >
                    View Permissions
                  </DropdownMenuItem>
                </>
              )}

              {(can.manageUsers() || is.superAdmin()) &&
                user.role !== "super-admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user._id, "user")}
                    >
                      Set as User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user._id, "author")}
                    >
                      Set as Author
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user._id, "instructor")}
                    >
                      Set as Instructor
                    </DropdownMenuItem>
                    {is.superAdmin() && (
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user._id, "admin")}
                      >
                        Set as Admin
                      </DropdownMenuItem>
                    )}
                  </>
                )}

              {/* Delete User - Only for Super Admin and not self */}
              {is.superAdmin() && user.role !== "super-admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete User
                  </DropdownMenuItem>
                </>
              )}

              {/* TODO: Add status change functionality */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load users. Please try again.</p>
      </div>
    );
  }

  return (
    <RoleGuard permissions={["user:view", "user:manage"]} showFallback={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            {(can.createUsers() || is.admin() || is.superAdmin()) && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            )}
            {/* Temporary Super Admin Button for Development */}
            {!is.superAdmin() && (
              <Button
                variant="outline"
                onClick={handleMakeSuperAdmin}
                disabled={isActionLoading}
              >
                🚀 Make Me Super Admin
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="student">Student</option>
            <option value="author">Author</option>
            <option value="instructor">Instructor</option>
            <option value="editor">Editor</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
            {is.superAdmin() && (
              <option value="super-admin">Super Admin</option>
            )}
          </select>
        </div>

        {/* Users Table */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          globalFilterPlaceholder="Search users..."
        />

        {isLoading && (
          <div className="text-center py-4">
            <p>Loading users...</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {/* View User Permissions Modal */}
      {selectedUserId && (
        <ViewUserPermissionsModal
          open={showPermissionsModal}
          onOpenChange={setShowPermissionsModal}
          userId={selectedUserId}
        />
      )}
    </RoleGuard>
  );
}
