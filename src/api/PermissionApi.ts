import axios, { AxiosResponse } from "axios";

export interface UserPermissions {
  effective: string[];
  role: string[];
  extra: string[];
}

export interface PermissionResponse {
  user: {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  permissions: UserPermissions;
}

export interface CheckPermissionRequest {
  permission: string;
}

export interface CheckPermissionsRequest {
  permissions: string[];
}

export interface PermissionCheckResponse {
  hasPermission: boolean;
  permission?: string;
  permissions?: string[];
  hasAny?: boolean;
}

class PermissionApi {
  private readonly url = "/api/v1/me/permissions";

  /**
   * Get current user's effective permissions
   */
  async getUserPermissions(): Promise<PermissionResponse> {
    const { data }: AxiosResponse<{ data: PermissionResponse }> =
      await axios.get(this.url);
    return data.data;
  }

  /**
   * Check if user has a specific permission
   */
  async checkPermission(permission: string): Promise<PermissionCheckResponse> {
    const { data }: AxiosResponse<{ data: PermissionCheckResponse }> =
      await axios.post(`${this.url}/check`, { permission });
    return data.data;
  }

  /**
   * Check if user has any of the specified permissions
   */
  async checkAnyPermissions(
    permissions: string[]
  ): Promise<PermissionCheckResponse> {
    const { data }: AxiosResponse<{ data: PermissionCheckResponse }> =
      await axios.post(`${this.url}/check-any`, { permissions });
    return data.data;
  }
}

const permissionApi = new PermissionApi();
export default permissionApi;
