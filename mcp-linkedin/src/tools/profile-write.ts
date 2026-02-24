import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay } from "../utils/human.js";
import {
  editIntroButton,
  headlineInput,
  saveIntroButton,
  editAboutLink,
  aboutTextarea,
  saveAboutButton,
} from "../utils/locators.js";
import { navigateToMyProfile } from "../utils/navigation.js";

export function registerProfileWriteTools(server: McpServer): void {
  server.registerTool(
    "update_headline",
    {
      title: "Update LinkedIn Headline",
      description:
        "Updates the headline on your LinkedIn profile. " +
        "Opens the 'Edit intro' modal, clears the headline field, " +
        "types the new headline, and saves.",
      inputSchema: {
        headline: z
          .string()
          .describe("The new headline text for your LinkedIn profile"),
      },
    },
    async ({ headline }) => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);

        // Click the edit intro button (pencil icon)
        const editBtn = editIntroButton(page);
        await editBtn.waitFor({ state: "visible", timeout: 10000 });
        await editBtn.click();
        await randomDelay(1000, 2000);

        // Find and clear the headline input
        const input = headlineInput(page);
        await input.waitFor({ state: "visible", timeout: 10000 });
        await input.click({ clickCount: 3 }); // Select all
        await randomDelay(200, 400);
        await input.fill(headline);
        await randomDelay(500, 1000);

        // Save
        const saveBtn = saveIntroButton(page);
        await saveBtn.click();
        await randomDelay(2000, 3000);

        return {
          content: [
            {
              type: "text" as const,
              text: `Headline updated to: "${headline}"`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error updating headline: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "update_about",
    {
      title: "Update LinkedIn About Section",
      description:
        "Updates the About/Summary section on your LinkedIn profile. " +
        "Opens the edit modal, clears the existing text, " +
        "types the new content, and saves.",
      inputSchema: {
        about: z
          .string()
          .describe("The new About section text for your LinkedIn profile"),
      },
    },
    async ({ about }) => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);

        // Scroll to About section
        await page.evaluate(() => window.scrollBy(0, 400));
        await randomDelay(500, 1000);

        // Click the edit link in the About section (it's an <a>, not a button)
        const editLink = editAboutLink(page);
        await editLink.waitFor({ state: "visible", timeout: 10000 });
        await editLink.click();
        await randomDelay(1000, 2000);

        // Find and clear the about textarea
        const textarea = aboutTextarea(page);
        await textarea.waitFor({ state: "visible", timeout: 10000 });

        // Select all and replace
        await textarea.click();
        await page.keyboard.press("Control+A");
        await randomDelay(200, 400);
        await textarea.fill(about);
        await randomDelay(500, 1000);

        // Save
        const saveBtn = saveAboutButton(page);
        await saveBtn.click();
        await randomDelay(2000, 3000);

        return {
          content: [
            {
              type: "text" as const,
              text: `About section updated successfully. New text (${about.length} chars).`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error updating about section: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
