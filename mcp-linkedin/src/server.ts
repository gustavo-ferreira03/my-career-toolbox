import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSessionTools } from "./tools/session.js";
import { registerProfileReadTools } from "./tools/profile-read.js";
import { registerProfileWriteTools } from "./tools/profile-write.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "linkedin",
    version: "0.1.0",
  });

  registerSessionTools(server);
  registerProfileReadTools(server);
  registerProfileWriteTools(server);

  return server;
}
