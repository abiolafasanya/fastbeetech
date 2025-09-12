"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useUser,
  usePermissionAnalysis,
  useAddPermissions,
  useRemovePermissions,
  useResetPermissions,
} from "@/hooks/useUserManagement";
import { X, RefreshCw } from "lucide-react";

interface ViewUserPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

export function ViewUserPermissionsModal({
  open,
  onOpenChange,
  userId,
}: ViewUserPermissionsModalProps) {
  const [newPermissions, setNewPermissions] = useState<string[]>([]);

  const { data: userData } = useUser(userId || "");
  const { data: permissionAnalysis } = usePermissionAnalysis(userId || "");
  const { mutate: addPermissions, isPending: isAdding } = useAddPermissions();
  const { mutate: removePermissions } = useRemovePermissions();
  const { mutate: resetPermissions, isPending: isResetting } =
    useResetPermissions();

  const user = userData?.data;
  const analysis = permissionAnalysis?.data;

  const availablePermissions = [
    "blog:create",
    "blog:read",
    "blog:update",
    "blog:delete",
    "blog:publish",
    "course:create",
    "course:read",
    "course:update",
    "course:delete",
    "course:publish",
    "user:create",
    "user:read",
    "user:update",
    "user:delete",
    "user:manage",
    "user:manage_roles",
    "user:manage_permissions",
    "comment:create",
    "comment:read",
    "comment:update",
    "comment:delete",
    "comment:moderate",
    "analytics:read",
    "analytics:export",
    "system:admin",
    "system:backup",
    "system:restore",
    "internship:create",
    "internship:read",
    "internship:update",
    "internship:delete",
    "internship:manage",
  ];

  const handlePermissionToggle = (permission: string) => {
    setNewPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleAddPermissions = () => {
    if (userId && newPermissions.length > 0) {
      addPermissions(
        { userId, permissions: newPermissions },
        {
          onSuccess: () => {
            setNewPermissions([]);
          },
        }
      );
    }
  };

  const handleRemovePermission = (permission: string) => {
    if (userId) {
      removePermissions({ userId, permissions: [permission] });
    }
  };

  const handleResetPermissions = () => {
    if (
      userId &&
      confirm(
        "Are you sure you want to reset this user's permissions to their role defaults?"
      )
    ) {
      resetPermissions(userId);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Permissions - {user.name}</DialogTitle>
          <DialogDescription>
            View and manage permissions for {user.email} (Role: {user.role})
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Permissions</TabsTrigger>
            <TabsTrigger value="add">Add Permissions</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Current Custom Permissions
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetPermissions}
                disabled={isResetting}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Role Defaults
              </Button>
            </div>

            {user.permissions && user.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <Badge
                    key={permission}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {permission}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemovePermission(permission)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No custom permissions assigned. User has role-based permissions
                only.
              </p>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Add New Permissions</h3>
                {newPermissions.length > 0 && (
                  <Button
                    onClick={handleAddPermissions}
                    disabled={isAdding}
                    size="sm"
                  >
                    Add {newPermissions.length} Permission
                    {newPermissions.length > 1 ? "s" : ""}
                  </Button>
                )}
              </div>

              {newPermissions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Selected to add:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {newPermissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto border rounded-md p-3">
                {Object.entries({
                  "Blog Management": availablePermissions.filter((p) =>
                    p.startsWith("blog:")
                  ),
                  "Course Management": availablePermissions.filter((p) =>
                    p.startsWith("course:")
                  ),
                  "User Management": availablePermissions.filter((p) =>
                    p.startsWith("user:")
                  ),
                  "Comment Management": availablePermissions.filter((p) =>
                    p.startsWith("comment:")
                  ),
                  Analytics: availablePermissions.filter((p) =>
                    p.startsWith("analytics:")
                  ),
                  "System Administration": availablePermissions.filter((p) =>
                    p.startsWith("system:")
                  ),
                  "Internship Management": availablePermissions.filter((p) =>
                    p.startsWith("internship:")
                  ),
                }).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => {
                        const hasPermission =
                          user.permissions?.includes(permission);
                        const isSelected = newPermissions.includes(permission);

                        return (
                          <div
                            key={permission}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={permission}
                              checked={isSelected}
                              disabled={hasPermission}
                              onCheckedChange={() =>
                                handlePermissionToggle(permission)
                              }
                            />
                            <label
                              htmlFor={permission}
                              className={`text-xs cursor-pointer ${
                                hasPermission ? "text-muted-foreground" : ""
                              }`}
                            >
                              {permission} {hasPermission && "(already has)"}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {analysis ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Role Information</h3>
                  <p className="text-sm">
                    Current Role: <Badge>{analysis.currentRole}</Badge>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Role-Based Permissions
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {analysis.rolePermissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Custom Permissions
                  </h3>
                  {analysis.customPermissions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {analysis.customPermissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No custom permissions
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    All Effective Permissions
                  </h3>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {analysis?.effectivePermissions?.map((permission) => (
                      <Badge
                        key={permission}
                        variant="default"
                        className="text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Loading permission analysis...
              </p>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
