import type {
  PermitEnvironment,
  PermitRole,
  PermitResource,
  PermitUser,
  PermitUserRoleAssignment,
  PaginatedResponse,
} from "./types/permit.js";

export class PermitClient {
  private readonly baseUrl = "https://api.permit.io";
  private readonly apiKey: string;
  private readonly projectId: string;
  private readonly defaultEnvId?: string;

  constructor(config: {
    apiKey: string;
    projectId: string;
    defaultEnvId?: string;
  }) {
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.defaultEnvId = config.defaultEnvId;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Permit API error: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    return response.json() as Promise<T>;
  }

  private getEnvId(envId?: string): string {
    const id = envId ?? this.defaultEnvId;
    if (!id) {
      throw new Error(
        "Environment ID is required. Provide it as a parameter or set PERMIT_ENV_ID."
      );
    }
    return id;
  }

  // Environment endpoints
  async listEnvironments(): Promise<PermitEnvironment[]> {
    return this.request<PermitEnvironment[]>(
      `/v2/projects/${this.projectId}/envs`
    );
  }

  async getEnvironment(envId: string): Promise<PermitEnvironment> {
    return this.request<PermitEnvironment>(
      `/v2/projects/${this.projectId}/envs/${envId}`
    );
  }

  // Role endpoints
  async listRoles(envId?: string): Promise<PermitRole[]> {
    const env = this.getEnvId(envId);
    return this.request<PermitRole[]>(
      `/v2/schema/${this.projectId}/${env}/roles`
    );
  }

  async getRole(roleKey: string, envId?: string): Promise<PermitRole> {
    const env = this.getEnvId(envId);
    return this.request<PermitRole>(
      `/v2/schema/${this.projectId}/${env}/roles/${roleKey}`
    );
  }

  // Resource endpoints
  async listResources(envId?: string): Promise<PermitResource[]> {
    const env = this.getEnvId(envId);
    return this.request<PermitResource[]>(
      `/v2/schema/${this.projectId}/${env}/resources`
    );
  }

  async getResource(resourceKey: string, envId?: string): Promise<PermitResource> {
    const env = this.getEnvId(envId);
    return this.request<PermitResource>(
      `/v2/schema/${this.projectId}/${env}/resources/${resourceKey}`
    );
  }

  // User endpoints
  async listUsers(
    options?: { page?: number; perPage?: number; search?: string },
    envId?: string
  ): Promise<PaginatedResponse<PermitUser>> {
    const env = this.getEnvId(envId);
    const params = new URLSearchParams();

    if (options?.page) params.set("page", options.page.toString());
    if (options?.perPage) params.set("per_page", options.perPage.toString());
    if (options?.search) params.set("search", options.search);

    const queryString = params.toString();
    const endpoint = `/v2/facts/${this.projectId}/${env}/users${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<PermitUser>>(endpoint);
  }

  async getUser(userKey: string, envId?: string): Promise<PermitUser> {
    const env = this.getEnvId(envId);
    return this.request<PermitUser>(
      `/v2/facts/${this.projectId}/${env}/users/${userKey}`
    );
  }

  async getUserRoleAssignments(
    userKey: string,
    envId?: string
  ): Promise<PermitUserRoleAssignment[]> {
    const env = this.getEnvId(envId);
    return this.request<PermitUserRoleAssignment[]>(
      `/v2/facts/${this.projectId}/${env}/users/${userKey}/roles`
    );
  }

  // Get effective permissions for a user by combining their role assignments
  async getUserPermissions(
    userKey: string,
    envId?: string
  ): Promise<{
    user: PermitUser;
    roleAssignments: PermitUserRoleAssignment[];
    permissions: Array<{
      role: string;
      tenant: string;
      permissions: string[];
    }>;
  }> {
    const env = this.getEnvId(envId);

    const [user, roleAssignments, roles] = await Promise.all([
      this.getUser(userKey, env),
      this.getUserRoleAssignments(userKey, env),
      this.listRoles(env),
    ]);

    const roleMap = new Map(roles.map((r) => [r.key, r]));

    const permissions = roleAssignments.map((assignment) => {
      const role = roleMap.get(assignment.role);
      return {
        role: assignment.role,
        tenant: assignment.tenant,
        permissions: role?.permissions ?? [],
      };
    });

    return {
      user,
      roleAssignments,
      permissions,
    };
  }
}
