# JarvisJr MCP Server

A Model Context Protocol server that implements various tools for task management, calendar operations, and web searching capabilities.

## Features

### Tools
- Calendar management (create, update, delete, search events)
- Task management (create, update, retrieve to-dos)
- Note storage
- Web search functionality
- Current time retrieval in various formats

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config and webhook URL:

On Windows: `%APPDATA%/Claude/claude_desktop_config.json`
On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jarvisjr": {
      "command": "node",
      "args": [
        "/path/to/your/build/index.js"
      ],
      "env": {
        "WEBHOOK_URL": "your-webhook-url-here"
      }
    }
  }
}
```

### Adding New Tools

Tools can be added by modifying the `src/config/tools.json` file. The configuration supports both local tools and webhook services.

Structure of the tools configuration:

```json
{
  "local": {
    "tools": {
      "toolName": {
        "description": "Tool description",
        "method": "GET",
        "inputSchema": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "webhooks": {
    "serviceName": {
      "baseUrl": "${WEBHOOK_URL}",
      "tools": {
        "toolName": {
          "description": "Tool description",
          "method": "POST",
          "inputSchema": {
            "type": "object",
            "properties": {
              "parameter1": {
                "type": "string",
                "description": "Parameter description"
              }
            },
            "required": ["parameter1"]
          }
        }
      }
    }
  }
}
```

Key components:
- `local`: Container for tools implemented directly in the server
- `webhooks`: Container for external webhook services
- `baseUrl`: Base URL for the webhook service (supports environment variables)
- `tools`: Collection of available tools
  - `description`: A brief description of what the tool does
  - `method`: HTTP method (GET/POST)
  - `inputSchema`: JSON Schema defining the expected input parameters

The server automatically:
- Handles both local and webhook-based tools
- Resolves environment variables in URLs
- Routes requests to the appropriate implementation
