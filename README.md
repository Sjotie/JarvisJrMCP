# hello-world MCP Server

A Model Context Protocol server

This is a TypeScript-based MCP server that implements a simple notes system. It demonstrates core MCP concepts by providing:

- Resources representing text notes with URIs and metadata
- Tools for creating new notes
- Prompts for generating summaries of notes

## Features

### Resources
- List and access notes via `note://` URIs
- Each note has a title, content and metadata
- Plain text mime type for simple content access

### Tools
- `create_note` - Create new text notes
  - Takes title and content as required parameters
  - Stores note in server state

### Prompts
- `summarize_notes` - Generate a summary of all stored notes
  - Includes all note contents as embedded resources
  - Returns structured prompt for LLM summarization

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

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hello-world": {
      "command": "/path/to/hello-world/build/index.js"
    }
  }
}
```

### Adding New Tools

Tools can be added by modifying the `src/config/tools.json` file. The configuration supports multiple webhook services, each with its own base URL and set of tools.

Structure of the tools configuration:

```json
{
  "webhooks": {
    "service_name": {
      "baseUrl": "http://${LOCAL_IP}:port/webhook/path",
      "tools": {
        "tool_name": {
          "description": "Description of what the tool does",
          "method": "POST",
          "inputSchema": {
            "type": "object",
            "properties": {
              "parameter1": {
                "type": "string",
                "description": "Description of parameter1"
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
- `webhooks`: Container for all webhook services
- `service_name`: Unique identifier for each webhook service
- `baseUrl`: Base URL for the service (supports ${LOCAL_IP} variable)
- `tools`: Collection of tools for this service
  - `description`: A brief description of what the tool does
  - `method`: HTTP method (GET/POST) for the webhook
  - `inputSchema`: JSON Schema defining the expected input parameters

The server automatically:
- Resolves ${LOCAL_IP} in URLs to your local IP address
- Routes requests to the appropriate service based on the tool name
- Handles tool registration and webhook routing based on this configuration

The server automatically handles tool registration and webhook routing based on this configuration.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
