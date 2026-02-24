import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getPage, closeBrowser } from "../browser.js";
import { isLoggedIn, waitForManualLogin } from "../auth.js";

export function registerSessionTools(server: McpServer): void {
  server.registerTool(
    "login",
    {
      title: "LinkedIn Login",
      description:
        "Opens a browser window for manual LinkedIn login. " +
        "Handles 2FA and captcha since the user completes them. " +
        "Session is saved persistently -- only needs to be done once.",
    },
    async () => {
      // Check if already logged in
      try {
        const page = await getPage({ headless: false });
        if (await isLoggedIn(page)) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Already logged in to LinkedIn. Session is active.",
              },
            ],
          };
        }
      } catch {
        // Browser not running yet, that's fine
      }

      const success = await waitForManualLogin({ headless: false });

      if (success) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Login successful. Session saved persistently. You can now use other LinkedIn tools.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: "Login timed out after 5 minutes. Please try again.",
          },
        ],
        isError: true,
      };
    }
  );

  server.registerTool(
    "check_session",
    {
      title: "Check LinkedIn Session",
      description:
        "Checks if the current LinkedIn session is active and valid.",
    },
    async () => {
      try {
        const page = await getPage();
        const loggedIn = await isLoggedIn(page);
        return {
          content: [
            {
              type: "text" as const,
              text: loggedIn
                ? "Session is active. You are logged in to LinkedIn."
                : "Session is not active. Please use the 'login' tool first.",
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Could not check session: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "logout",
    {
      title: "LinkedIn Logout",
      description:
        "Closes the browser and clears the active session. " +
        "Note: the persistent profile is kept on disk. " +
        "You may need to login again next time.",
    },
    async () => {
      await closeBrowser();
      return {
        content: [
          {
            type: "text" as const,
            text: "Browser closed. Session ended.",
          },
        ],
      };
    }
  );
}
