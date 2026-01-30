# Permit MCP Server

Read-only MCP Server for querying Permit.io configuration.

## Quick Start with npx

Run directly without installation:

```bash
PERMIT_API_KEY=your_key npx permit-mcp-server
```

## Requirements

- Node.js 22+
- pnpm (for development)
- Docker (optional)

## Installation

### Global Installation

```bash
npm install -g permit-mcp-server
```

### Local Installation

```bash
cd permit-mcp
pnpm install
pnpm build
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
PERMIT_API_KEY=permit_key_xxxxx
PERMIT_PROJECT_ID=default
PERMIT_ENV_ID=dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PERMIT_API_KEY` | Yes | Permit.io API Key |
| `PERMIT_PROJECT_ID` | No | Project ID (default: "default") |
| `PERMIT_ENV_ID` | No | Default environment |

## Docker

### Start with Docker Compose

```bash
cd permit-mcp && docker compose -f docker-compose.local.yml up -d --build
```

### Stop

```bash
docker compose -f docker-compose.local.yml down
```

### View logs

```bash
docker logs -f permit-mcp
```

## Available Tools

### Environments

- **list-environments**: List all environments in the project
- **get-environment**: Get details of a specific environment

### Roles

- **list-roles**: List all roles in an environment
- **get-role**: Get a role with its permissions

### Resources

- **list-resources**: List all defined resources
- **get-resource**: Get a resource with its actions and attributes

### Users

- **list-users**: List users with optional filters (pagination, search)
- **get-user**: Get user information
- **get-user-permissions**: Get effective permissions for a user

## Usage with Claude Code

Add to workspace `.mcp.json`:

### Using npx (Recommended)

```json
{
  "mcpServers": {
    "permit": {
      "command": "npx",
      "args": ["-y", "permit-mcp-server"],
      "env": {
        "PERMIT_API_KEY": "${PERMIT_API_KEY}",
        "PERMIT_PROJECT_ID": "default"
      }
    }
  }
}
```

### Using local installation

```json
{
  "mcpServers": {
    "permit": {
      "command": "node",
      "args": ["permit-mcp/dist/index.js"],
      "env": {
        "PERMIT_API_KEY": "${PERMIT_API_KEY}",
        "PERMIT_PROJECT_ID": "default"
      }
    }
  }
}
```

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck

# Run
pnpm start
```

## Architecture

```
permit-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── permit-client.ts      # HTTP client for Permit.io API
│   └── types/
│       └── permit.ts         # Permit.io API types
├── Dockerfile                # Docker image
├── docker-compose.local.yml  # Docker Compose for development
├── package.json
├── tsconfig.json
└── README.md
```
