import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as localTools from './localTools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let toolsConfig;
try {
    // Try loading from build directory first
    const configPath = join(__dirname, '../config/tools.json');
    const fallbackPath = join(__dirname, '../../src/config/tools.json');
    
    try {
        toolsConfig = JSON.parse(await readFile(configPath, 'utf8'));
    } catch (error) {
        // Fallback to src directory
        toolsConfig = JSON.parse(await readFile(fallbackPath, 'utf8'));
    }
} catch (error) {
    console.error('Failed to load tools configuration:', error);
    process.exit(1);
}

export async function handleWebhookRequest(toolName, args) {
  // Check if this is a local tool first
  if (toolsConfig.local?.tools?.[toolName]) {
    const localTool = localTools[toolName];
    if (typeof localTool === 'function') {
      return localTool(args);
    }
    throw new Error(`Local tool ${toolName} is not implemented`);
  }

  // Handle webhook tools
  let tool;
  let baseUrl;
  
  for (const [serviceName, service] of Object.entries(toolsConfig.webhooks)) {
    if (service.tools[toolName]) {
      tool = service.tools[toolName];
      baseUrl = service.baseUrl;
      break;
    }
  }

  if (!tool || !baseUrl) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  try {
    // Replace environment variables in URL
    const processedUrl = baseUrl.replace(/\${([^}]+)}/g, (_, key) => {
      return process.env[key] || '';
    });
    const url = new URL(processedUrl);
    url.searchParams.set('function', toolName);
    
    // Spread the args directly into the payload
    const payload = {
      source: 'mcp-server',
      timestamp: new Date().toISOString(),
      ...args
    };

    const options = {
      method: tool.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (tool.method !== 'GET' && tool.method !== 'HEAD') {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url.toString(), options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    return result;

  } catch (error) {
    throw error;
  }
}

export function getToolsList() {
  const tools = [];
  
  // Collect tools from all webhook services
  for (const service of Object.values(toolsConfig.webhooks)) {
    for (const [name, tool] of Object.entries(service.tools)) {
      tools.push({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema
      });
    }
  }
  
  return tools;
}
