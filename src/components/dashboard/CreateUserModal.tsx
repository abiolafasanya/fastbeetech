"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCreateUser } from "@/hooks/useUserManagement";
import { X } from "lucide-react";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role"),
  permissions: z.array(z.string()).optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { mutate: createUser, isPending } = useCreateUser();
  // const { data: roleHierarchy } = useRoleHierarchy(); // TODO: Use for dynamic role loading

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      permissions: [],
    },
  });

  const availableRoles = [
    { value: "user", label: "User", level: 1 },
    { value: "student", label: "Student", level: 2 },
    { value: "instructor", label: "Instructor", level: 3 },
    { value: "author", label: "Author", level: 4 },
    { value: "editor", label: "Editor", level: 5 },
    { value: "moderator", label: "Moderator", level: 6 },
    { value: "admin", label: "Admin", level: 7 },
    { value: "super-admin", label: "Super Admin", level: 8 },
  ];

  const availablePermissions = [
    // Blog permissions
    "blog:create",
    "blog:read",
    "blog:update",
    "blog:delete",
    "blog:publish",
    // Course permissions
    "course:create",
    "course:read",
    "course:update",
    "course:delete",
    "course:publish",
    // User management permissions
    "user:create",
    "user:read",
    "user:update",
    "user:delete",
    "user:manage",
    "user:manage_roles",
    "user:manage_permissions",
    // Comment permissions
    "comment:create",
    "comment:read",
    "comment:update",
    "comment:delete",
    "comment:moderate",
    // Analytics permissions
    "analytics:read",
    "analytics:export",
    // System permissions
    "system:admin",
    "system:backup",
    "system:restore",
    // Internship permissions
    "internship:create",
    "internship:read",
    "internship:update",
    "internship:delete",
    "internship:manage",
  ];

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const removePermission = (permission: string) => {
    setSelectedPermissions((prev) => prev.filter((p) => p !== permission));
  };

  const onSubmit = (data: CreateUserFormData) => {
    createUser(
      {
        ...data,
        permissions: selectedPermissions,
      },
      {
        onSuccess: () => {
          form.reset();
          setSelectedPermissions([]);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system and assign them a role and permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 6 characters required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The user&apos;s primary role in the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Permissions Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Custom Permissions (Optional)
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Add specific permissions beyond what the role provides
                </p>
              </div>

              {/* Selected Permissions */}
              {selectedPermissions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Selected Permissions:
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {selectedPermissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        {permission}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removePermission(permission)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission Categories */}
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
                      {permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={permission}
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission)
                            }
                          />
                          <label
                            htmlFor={permission}
                            className="text-xs cursor-pointer"
                          >
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
