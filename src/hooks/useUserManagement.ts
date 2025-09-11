import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserApi, {
  User,
  UserFilters,
  UsersListResponse,
  UserRole,
  RoleHierarchy,
  BulkAssignResult,
  PermissionAnalysis,
} from "@/api/UserApi";

// Re-export types for convenience
export type {
  User,
  UserFilters,
  UsersListResponse,
  UserRole,
  RoleHierarchy,
  BulkAssignResult,
  PermissionAnalysis,
};

// Query Keys
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (filters: UserFilters) => [...userQueryKeys.lists(), filters] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  roleHierarchy: () => [...userQueryKeys.all, "role-hierarchy"] as const,
  permissionAnalysis: (id: string) =>
    [...userQueryKeys.all, "permissions", id] as const,
};

// Hooks
export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: userQueryKeys.list(filters),
    queryFn: () => UserApi.getAllUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => UserApi.getUserById(userId),
    enabled: !!userId,
  });
};

export const useRoleHierarchy = () => {
  return useQuery({
    queryKey: userQueryKeys.roleHierarchy(),
    queryFn: () => UserApi.getRoleHierarchy(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePermissionAnalysis = (userId: string) => {
  return useQuery({
    queryKey: userQueryKeys.permissionAnalysis(userId),
    queryFn: () => UserApi.getPermissionAnalysis(userId),
    enabled: !!userId,
  });
};

// Mutations
export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      UserApi.assignRole(userId, role),
    onSuccess: (data, variables) => {
      toast.success(data.data.message || "Role assigned successfully");
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.userId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign role");
    },
  });
};

export const useAddPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permissions,
    }: {
      userId: string;
      permissions: string[];
    }) => UserApi.addPermissions(userId, permissions),
    onSuccess: (data, variables) => {
      toast.success(data.data.message || "Permissions added successfully");
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.permissionAnalysis(variables.userId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add permissions");
    },
  });
};

export const useRemovePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permissions,
    }: {
      userId: string;
      permissions: string[];
    }) => UserApi.removePermissions(userId, permissions),
    onSuccess: (data, variables) => {
      toast.success(data.data.message || "Permissions removed successfully");
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.permissionAnalysis(variables.userId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove permissions");
    },
  });
};

export const useResetPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserApi.resetPermissions(userId),
    onSuccess: (data, userId) => {
      toast.success(data.data.message || "Permissions reset successfully");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.permissionAnalysis(userId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset permissions");
    },
  });
};

export const useBulkAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, role }: { userIds: string[]; role: string }) =>
      UserApi.bulkAssignRole(userIds, role),
    onSuccess: (data) => {
      toast.success(data.data.message || "Roles assigned successfully");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign roles");
    },
  });
};

export const useMakeMeSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => UserApi.makeMeSuperAdmin(),
    onSuccess: (data) => {
      toast.success(data.data.message || "You are now a super admin!");
      // Invalidate all queries to refresh permissions
      queryClient.invalidateQueries();
      // Reload the page to update permissions context
      window.location.reload();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to make super admin");
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      name: string;
      email: string;
      password: string;
      role?: string;
      permissions?: string[];
    }) => UserApi.createUser(userData),
    onSuccess: () => {
      toast.success("User created successfully");
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<{
        name: string;
        email: string;
        role: string;
        permissions: string[];
        status: string;
      }>;
    }) => UserApi.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(variables.userId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserApi.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

// Helper hook for user management actions
export const useUserActions = () => {
  const assignRole = useAssignRole();
  const addPermissions = useAddPermissions();
  const removePermissions = useRemovePermissions();
  const resetPermissions = useResetPermissions();
  const bulkAssignRole = useBulkAssignRole();
  const makeMeSuperAdmin = useMakeMeSuperAdmin();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  return {
    assignRole: assignRole.mutate,
    addPermissions: addPermissions.mutate,
    removePermissions: removePermissions.mutate,
    resetPermissions: resetPermissions.mutate,
    bulkAssignRole: bulkAssignRole.mutate,
    makeMeSuperAdmin: makeMeSuperAdmin.mutate,
    createUser: createUser.mutate,
    updateUser: updateUser.mutate,
    deleteUser: deleteUser.mutate,
    isLoading:
      assignRole.isPending ||
      addPermissions.isPending ||
      removePermissions.isPending ||
      resetPermissions.isPending ||
      bulkAssignRole.isPending ||
      makeMeSuperAdmin.isPending ||
      createUser.isPending ||
      updateUser.isPending ||
      deleteUser.isPending,
  };
};
