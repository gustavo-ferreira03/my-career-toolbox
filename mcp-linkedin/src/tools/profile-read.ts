import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page, Locator } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay } from "../utils/human.js";
import {
  profileName,
  profileHeadline,
  profileAboutSection,
  profileExperienceSection,
  seeMoreButton,
} from "../utils/locators.js";

async function navigateToMyProfile(page: Page): Promise<void> {
  await page.goto("https://www.linkedin.com/in/me/", {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await randomDelay(1000, 2000);
}

/**
 * Scroll down the page progressively to trigger lazy-loading of sections.
 * LinkedIn profile pages load sections on demand as the user scrolls.
 */
async function scrollToLoadSections(page: Page): Promise<void> {
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await randomDelay(300, 600);
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await randomDelay(300, 500);
}

/**
 * Extract the About section text.
 * LinkedIn duplicates all text in two spans: aria-hidden="true" (visible) and
 * .visually-hidden (sr-only). We grab only the first aria-hidden="true" span
 * inside the content area to get clean, deduplicated text.
 */
async function extractAboutText(
  section: Locator,
  page: Page
): Promise<string | null> {
  try {
    await section.waitFor({ state: "attached", timeout: 3000 });
    await section.scrollIntoViewIfNeeded({ timeout: 3000 });
    await randomDelay(300, 500);

    // Try to expand "see more" / "ver mais"
    try {
      const seeMore = seeMoreButton(section, page);
      if (await seeMore.isVisible({ timeout: 1500 })) {
        await seeMore.click();
        await randomDelay(300, 600);
      }
    } catch {
      // not present or not clickable -- fine
    }

    // The about text is inside a span[aria-hidden="true"] within the content area
    const text = await section
      .locator("div.display-flex span[aria-hidden='true']")
      .first()
      .innerText({ timeout: 5000 });

    return text ?? null;
  } catch {
    return null;
  }
}

/**
 * Extract Experience section text.
 * Uses span[aria-hidden="true"] elements to avoid sr-only duplication,
 * then joins them with newlines.
 */
async function extractExperienceText(
  section: Locator,
  page: Page
): Promise<string | null> {
  try {
    await section.waitFor({ state: "attached", timeout: 3000 });
    await section.scrollIntoViewIfNeeded({ timeout: 3000 });
    await randomDelay(300, 500);

    // Collect all visible text spans (aria-hidden="true" = the rendered text)
    const texts = await section
      .locator("span[aria-hidden='true']")
      .allInnerTexts();

    if (texts.length === 0) return null;

    // Filter out empty strings, the section title, and join
    const filtered = texts
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .filter((t) => !/^(Experiência|Experience)$/i.test(t));

    return filtered.join("\n") || null;
  } catch {
    return null;
  }
}

export function registerProfileReadTools(server: McpServer): void {
  server.registerTool(
    "get_my_profile",
    {
      title: "Get My LinkedIn Profile",
      description:
        "Reads the currently logged-in user's LinkedIn profile. " +
        "Returns name, headline, about section, and experience entries as text.",
    },
    async () => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);

        // Extract top card data (name + headline) before scrolling
        const name = await profileName(page)
          .textContent({ timeout: 5000 })
          .catch(() => null);

        const headline = await profileHeadline(page)
          .textContent({ timeout: 5000 })
          .catch(() => null);

        // Scroll down progressively to trigger lazy-loading
        await scrollToLoadSections(page);

        // Extract About section (clean, deduplicated)
        const aboutText = await extractAboutText(
          profileAboutSection(page),
          page
        );

        // Extract Experience section (clean, deduplicated)
        const experienceText = await extractExperienceText(
          profileExperienceSection(page),
          page
        );

        const result = [
          `## Name`,
          name?.trim() ?? "(not found)",
          "",
          `## Headline`,
          headline?.trim() ?? "(not found)",
          "",
          `## About`,
          aboutText?.trim() ?? "(not found)",
          "",
          `## Experience`,
          experienceText?.trim() ?? "(not found)",
        ].join("\n");

        return {
          content: [{ type: "text" as const, text: result }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error reading profile: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
