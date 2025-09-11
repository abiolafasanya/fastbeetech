import QueryBuilder from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/global";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  phone?: string;
}

export interface UserRole {
  name: string;
  title: string;
  permissions: string[];
  level: number;
}

export interface RoleHierarchy {
  roles: UserRole[];
  permissions: string[];
}

export interface BulkAssignResult {
  userId: string;
  success: boolean;
  message?: string;
}

export interface PermissionAnalysis {
  userId: string;
  currentRole: string;
  rolePermissions: string[];
  customPermissions: string[];
  effectivePermissions: string[];
  roleHierarchy: string[];
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface UsersListResponse extends ApiResponse<User[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * UserApi - Handles all user management and role-based access control operations
 *
 * Features:
 * - User CRUD operations
 * - Role assignment and management
 * - Permission management (add, remove, reset)
 * - Bulk operations
 * - Role hierarchy and permission analysis
 * - Current user permission checks
 *
 * Usage:
 * ```ts
 * import UserApi from "@/api/UserApi";
 *
 * // Get all users with filters
 * const users = await UserApi.getAllUsers({ role: "admin", search: "john" });
 *
 * // Assign role to user
 * await UserApi.assignRole("userId", "admin");
 * ```
 */
class UserApi {
  private readonly url = "/api/v1";

  // Fetch users with filters
  async getAllUsers(params: UserFilters = {}): Promise<UsersListResponse> {
    const qb = new QueryBuilder(`${this.url}/admin/users`).addParams(params);
    const res: AxiosResponse<UsersListResponse> = await axios.get(qb.build());
    return res.data;
  }

  // Fetch single user
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    const res: AxiosResponse<ApiResponse<User>> = await axios.get(
      `${this.url}/admin/users/${userId}`
    );
    return res.data;
  }

  // Get users with roles (for role management view)
  async getUsersWithRoles(): Promise<ApiResponse<User[]>> {
    const res: AxiosResponse<ApiResponse<User[]>> = await axios.get(
      `${this.url}/admin/users/roles`
    );
    return res.data;
  }

  // Role management endpoints
  async assignRole(
    userId: string,
    role: string
  ): Promise<ApiResponse<{ message: string }>> {
    const res: AxiosResponse<ApiResponse<{ message: string }>> =
      await axios.post(`${this.url}/admin/users/${userId}/role`, { role });
    return res.data;
  }

  // Add custom permissions to user
  async addPermissions(
    userId: string,
    permissions: string[]
  ): Promise<ApiResponse<{ message: string }>> {
    const res: AxiosResponse<ApiResponse<{ message: string }>> =
      await axios.post(`${this.url}/admin/users/${userId}/permissions`, {
        permissions,
      });
    return res.data;
  }

  // Remove permissions from user
  async removePermissions(
    userId: string,
    permissions: string[]
  ): Promise<ApiResponse<{ message: string }>> {
    const res: AxiosResponse<ApiResponse<{ message: string }>> =
      await axios.delete(`${this.url}/admin/users/${userId}/permissions`, {
        data: { permissions },
      });
    return res.data;
  }

  // Reset user permissions to role defaults
  async resetPermissions(
    userId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const res: AxiosResponse<ApiResponse<{ message: string }>> =
      await axios.post(`${this.url}/admin/users/${userId}/reset-permissions`);
    return res.data;
  }

  // Bulk assign role
  async bulkAssignRole(
    userIds: string[],
    role: string
  ): Promise<ApiResponse<{ message: string; results: BulkAssignResult[] }>> {
    const res: AxiosResponse<
      ApiResponse<{ message: string; results: BulkAssignResult[] }>
    > = await axios.post(`${this.url}/admin/users/bulk-assign-role`, {
      userIds,
      role,
    });
    return res.data;
  }

  // Get role hierarchy
  async getRoleHierarchy(): Promise<ApiResponse<RoleHierarchy>> {
    const res: AxiosResponse<ApiResponse<RoleHierarchy>> = await axios.get(
      `${this.url}/admin/roles/hierarchy`
    );
    return res.data;
  }

  // Get permission analysis for user
  async getPermissionAnalysis(
    userId: string
  ): Promise<ApiResponse<PermissionAnalysis>> {
    const res: AxiosResponse<ApiResponse<PermissionAnalysis>> = await axios.get(
      `${this.url}/admin/users/${userId}/permissions/analysis`
    );
    return res.data;
  }

  // Validate role transition
  async validateRoleTransition(
    userId: string,
    newRole: string
  ): Promise<
    ApiResponse<{ valid: boolean; message: string; warnings?: string[] }>
  > {
    const res: AxiosResponse<
      ApiResponse<{ valid: boolean; message: string; warnings?: string[] }>
    > = await axios.post(
      `${this.url}/admin/users/${userId}/validate-role-change`,
      {
        newRole,
      }
    );
    return res.data;
  }

  // Make current user super admin (temporary development endpoint)
  async makeMeSuperAdmin(): Promise<
    ApiResponse<{ message: string; role: string; warning: string }>
  > {
    const res: AxiosResponse<
      ApiResponse<{ message: string; role: string; warning: string }>
    > = await axios.post(`${this.url}/admin/make-me-super-admin`);
    return res.data;
  }

  // User status management
  async updateUserStatus(
    userId: string,
    status: "active" | "inactive" | "suspended"
  ): Promise<ApiResponse<{ message: string }>> {
    const res: AxiosResponse<ApiResponse<{ message: string }>> =
      await axios.patch(`${this.url}/admin/users/${userId}/status`, { status });
    return res.data;
  }

  // Create new user (admin)
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    permissions?: string[];
  }): Promise<ApiResponse<User>> {
    const res: AxiosResponse<ApiResponse<User>> = await axios.post(
      `${this.url}/admin/users`,
      userData
    );
    return res.data;
  }

  // Update user details
  async updateUser(
    userId: string,
    userData: Partial<{
      name: string;
      email: string;
      role: string;
      permissions: string[];
      status: string;
    }>
  ): Promise<ApiResponse<User>> {
    const res: AxiosResponse<ApiResponse<User>> = await axios.put(
      `${this.url}/admin/users/${userId}`,
      userData
    );
    return res.data;
  }

  // Delete user
  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    const res: AxiosResponse<ApiResponse<{ message: string }>> =
      await axios.delete(`${this.url}/admin/users/${userId}`);
    return res.data;
  }

  // Get current user permissions
  async getCurrentUserPermissions(): Promise<
    ApiResponse<{
      permissions: string[];
      role: string;
      effectivePermissions: string[];
    }>
  > {
    const res: AxiosResponse<
      ApiResponse<{
        permissions: string[];
        role: string;
        effectivePermissions: string[];
      }>
    > = await axios.get(`${this.url}/me/permissions`);
    return res.data;
  }

  // Check if user has specific permission
  async checkUserPermission(permission: string): Promise<
    ApiResponse<{
      hasPermission: boolean;
      permission: string;
    }>
  > {
    const res: AxiosResponse<
      ApiResponse<{
        hasPermission: boolean;
        permission: string;
      }>
    > = await axios.post(`${this.url}/me/permissions/check`, { permission });
    return res.data;
  }

  // Check if user has any of the specified permissions
  async checkUserAnyPermissions(permissions: string[]): Promise<
    ApiResponse<{
      hasAnyPermission: boolean;
      matchedPermissions: string[];
      checkedPermissions: string[];
    }>
  > {
    const res: AxiosResponse<
      ApiResponse<{
        hasAnyPermission: boolean;
        matchedPermissions: string[];
        checkedPermissions: string[];
      }>
    > = await axios.post(`${this.url}/me/permissions/check-any`, {
      permissions,
    });
    return res.data;
  }
}

const UserApiInstance = new UserApi();
export default UserApiInstance;
