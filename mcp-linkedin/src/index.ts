#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { waitForManualLogin } from "./auth.js";
import { closeBrowser } from "./browser.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // --login flag: interactive login mode (not MCP server)
  if (args.includes("--login")) {
    console.log("Opening browser for LinkedIn login...");
    console.log("Please log in manually. Supports 2FA and captcha.");
    console.log("Session will be saved persistently.");
    console.log("");

    const success = await waitForManualLogin({ headless: false });

    if (success) {
      console.log("Login successful! Session saved.");
      console.log("You can now start the MCP server normally.");
    } else {
      console.error("Login timed out. Please try again.");
      process.exitCode = 1;
    }

    await closeBrowser();
    return;
  }

  // Normal mode: start MCP server over stdio
  const server = createServer();
  const transport = new StdioServerTransport();

  // Clean up browser on exit
  process.on("SIGINT", async () => {
    await closeBrowser();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await closeBrowser();
    process.exit(0);
  });

  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
