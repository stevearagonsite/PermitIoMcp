# Permit MCP Server

MCP Server de solo lectura para consultar la configuración de Permit.io.

## Requisitos

- Node.js 22+
- pnpm
- Docker (opcional)

## Instalación Local

```bash
cd permit-mcp
pnpm install
pnpm build
```

## Configuración

Crear un archivo `.env` basado en `.env.example`:

```env
PERMIT_API_KEY=permit_key_xxxxx
PERMIT_PROJECT_ID=default
PERMIT_ENV_ID=dev
```

### Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `PERMIT_API_KEY` | Sí | API Key de Permit.io |
| `PERMIT_PROJECT_ID` | No | ID del proyecto (default: "default") |
| `PERMIT_ENV_ID` | No | Environment por defecto |

## Docker

### Levantar con Docker Compose

```bash
cd permit-mcp && docker compose -f docker-compose.local.yml up -d --build
```

### Detener

```bash
docker compose -f docker-compose.local.yml down
```

### Ver logs

```bash
docker logs -f permit-mcp
```

## Tools Disponibles

### Environments

- **list-environments**: Lista todos los environments del proyecto
- **get-environment**: Obtiene detalles de un environment específico

### Roles

- **list-roles**: Lista todos los roles de un environment
- **get-role**: Obtiene un rol con sus permisos

### Resources

- **list-resources**: Lista todos los resources definidos
- **get-resource**: Obtiene un resource con sus acciones y atributos

### Users

- **list-users**: Lista usuarios con filtros opcionales (paginación, búsqueda)
- **get-user**: Obtiene información de un usuario
- **get-user-permissions**: Obtiene permisos efectivos de un usuario

## Uso con Claude Code

Agregar a `.mcp.json` del workspace:

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

## Desarrollo

```bash
# Compilar
pnpm build

# Watch mode
pnpm dev

# Verificar tipos
pnpm typecheck

# Ejecutar
pnpm start
```

## Arquitectura

```
permit-mcp/
├── src/
│   ├── index.ts              # Entry point del MCP server
│   ├── permit-client.ts      # Cliente HTTP para Permit.io API
│   └── types/
│       └── permit.ts         # Tipos de Permit.io API
├── Dockerfile                # Imagen Docker
├── docker-compose.local.yml  # Docker Compose para desarrollo
├── package.json
├── tsconfig.json
└── README.md
```
