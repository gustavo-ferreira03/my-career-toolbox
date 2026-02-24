import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSessionTools } from "./tools/session.js";
import { registerProfileReadTools } from "./tools/profile-read.js";
import { registerProfileWriteTools } from "./tools/profile-write.js";
import { registerSkillsTools } from "./tools/skills.js";
import { registerJobsTools } from "./tools/jobs.js";
import { registerResumeTools } from "./tools/resume.js";
import { registerApplyTools } from "./tools/apply.js";
import { registerPostTools } from "./tools/post.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "linkedin",
    version: "0.2.0",
  });

  registerSessionTools(server);
  registerProfileReadTools(server);
  registerProfileWriteTools(server);
  registerSkillsTools(server);
  registerJobsTools(server);
  registerResumeTools(server);
  registerApplyTools(server);
  registerPostTools(server);

  return server;
}
