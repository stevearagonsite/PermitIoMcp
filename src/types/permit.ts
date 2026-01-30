export interface PermitEnvironment {
  key: string;
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  description?: string;
  custom_branch_name?: string;
  jwks?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PermitRole {
  key: string;
  id: string;
  organization_id: string;
  project_id: string;
  environment_id: string;
  name: string;
  description?: string;
  permissions?: string[];
  extends?: string[];
  granted_to?: {
    users_with_role?: Array<{
      linked_by_relation?: string;
      on_resource?: string;
      role: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface PermitResourceAction {
  key: string;
  id: string;
  name: string;
  description?: string;
  permission_name: string;
}

export interface PermitResource {
  key: string;
  id: string;
  organization_id: string;
  project_id: string;
  environment_id: string;
  name: string;
  description?: string;
  urn?: string;
  actions: Record<string, PermitResourceAction>;
  attributes?: Record<string, {
    key: string;
    type: string;
    description?: string;
  }>;
  roles?: Record<string, {
    key: string;
    name: string;
    description?: string;
    permissions?: string[];
    extends?: string[];
  }>;
  relations?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PermitUser {
  key: string;
  id: string;
  organization_id: string;
  project_id: string;
  environment_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  attributes?: Record<string, unknown>;
  associated_tenants?: Array<{
    tenant: string;
    roles: string[];
    status: string;
  }>;
  roles?: Array<{
    role: string;
    tenant: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface PermitUserRoleAssignment {
  id: string;
  user: string;
  user_id: string;
  role: string;
  role_id: string;
  tenant: string;
  tenant_id: string;
  organization_id: string;
  project_id: string;
  environment_id: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total_count: number;
  page_count: number;
}

export interface PermitApiError {
  error_code?: string;
  message: string;
  details?: Record<string, unknown>;
}
