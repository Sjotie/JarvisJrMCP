#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { networkInterfaces } from 'os';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { handleWebhookRequest, getToolsList } from './utils/webhookHandler.js';

/**
 * Example of how to add resource types:
 *
const notes = {
  "1": { title: "First Note", content: "This is note 1" },
  "2": { title: "Second Note", content: "This is note 2" }
};
*/

/**
 * Create an MCP server with capabilities
 */
const server = new Server(
  {
    name: "memory-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);


/**
 * Handler that lists available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: getToolsList()
  };
});

/**
 * Handler for tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const response = await handleWebhookRequest(request.params.name, request.params.arguments);
  return {
    content: [{
      type: "text",
      text: JSON.stringify(response, null, 2)
    }]
  };
});

/**
 * Example of how to add prompt handlers:
 *
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "example_prompt",
        description: "Example prompt handler",
      }
    ]
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  // Prompt handler implementation
});
*/

/**
 * Start the server using stdio transport
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
