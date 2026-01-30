#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { PermitClient } from "./permit-client.js";

function getEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name];
  if (required && !value) {
    console.error(`Error: Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value ?? "";
}

async function main() {
  const apiKey = getEnvVar("PERMIT_API_KEY");
  const projectId = getEnvVar("PERMIT_PROJECT_ID", false) || "default";
  const defaultEnvId = getEnvVar("PERMIT_ENV_ID", false) || undefined;

  const client = new PermitClient({
    apiKey,
    projectId,
    defaultEnvId,
  });

  const server = new McpServer({
    name: "permit-mcp",
    version: "1.0.0",
  });

  // Environment tools
  server.registerTool(
    "list-environments",
    {
      description:
        "List all environments in the Permit.io project. Returns environment keys, names, and configuration details.",
    },
    async () => {
      try {
        const environments = await client.listEnvironments();
        return {
          content: [{ type: "text", text: JSON.stringify(environments, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get-environment",
    {
      description:
        "Get details of a specific environment by its ID or key. Returns full configuration including settings and JWKS.",
      inputSchema: {
        envId: z.string().describe("The environment ID or key to retrieve"),
      },
    },
    async ({ envId }) => {
      try {
        const environment = await client.getEnvironment(envId);
        return {
          content: [{ type: "text", text: JSON.stringify(environment, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  // Role tools
  server.registerTool(
    "list-roles",
    {
      description:
        "List all roles defined in a Permit.io environment. Returns role keys, names, descriptions, and basic permission info.",
      inputSchema: {
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
      },
    },
    async ({ envId }) => {
      try {
        const roles = await client.listRoles(envId);
        return {
          content: [{ type: "text", text: JSON.stringify(roles, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get-role",
    {
      description:
        "Get detailed information about a specific role including all its permissions, extended roles, and grant conditions.",
      inputSchema: {
        roleKey: z.string().describe("The role key to retrieve"),
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
      },
    },
    async ({ roleKey, envId }) => {
      try {
        const role = await client.getRole(roleKey, envId);
        return {
          content: [{ type: "text", text: JSON.stringify(role, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  // Resource tools
  server.registerTool(
    "list-resources",
    {
      description:
        "List all resources defined in a Permit.io environment. Resources represent the entities in your system that can be protected with permissions.",
      inputSchema: {
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
      },
    },
    async ({ envId }) => {
      try {
        const resources = await client.listResources(envId);
        return {
          content: [{ type: "text", text: JSON.stringify(resources, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get-resource",
    {
      description:
        "Get detailed information about a specific resource including all its actions, attributes, resource roles, and relations.",
      inputSchema: {
        resourceKey: z.string().describe("The resource key to retrieve"),
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
      },
    },
    async ({ resourceKey, envId }) => {
      try {
        const resource = await client.getResource(resourceKey, envId);
        return {
          content: [{ type: "text", text: JSON.stringify(resource, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  // User tools
  server.registerTool(
    "list-users",
    {
      description:
        "List users in a Permit.io environment with optional pagination and search. Returns user keys, emails, names, and tenant associations.",
      inputSchema: {
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
        page: z.number().optional().describe("Page number for pagination"),
        perPage: z.number().optional().describe("Number of results per page"),
        search: z.string().optional().describe("Search query to filter users"),
      },
    },
    async ({ envId, page, perPage, search }) => {
      try {
        const result = await client.listUsers({ page, perPage, search }, envId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get-user",
    {
      description:
        "Get detailed information about a specific user including their attributes, associated tenants, and role assignments.",
      inputSchema: {
        userKey: z.string().describe("The user key or ID to retrieve"),
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
      },
    },
    async ({ userKey, envId }) => {
      try {
        const user = await client.getUser(userKey, envId);
        return {
          content: [{ type: "text", text: JSON.stringify(user, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "get-user-permissions",
    {
      description:
        "Get the effective permissions for a user by combining their role assignments with role definitions. Shows which permissions the user has through each role in each tenant.",
      inputSchema: {
        userKey: z.string().describe("The user key or ID to get permissions for"),
        envId: z.string().optional().describe("Environment ID (uses default if not provided)"),
      },
    },
    async ({ userKey, envId }) => {
      try {
        const result = await client.getUserPermissions(userKey, envId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
          ],
          isError: true,
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Permit MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
