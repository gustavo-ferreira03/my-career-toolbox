import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay, humanType } from "../utils/human.js";
import {
  profileSkillsSection,
  skillItems,
  addSkillButton,
  dismissModal,
} from "../utils/locators.js";
import {
  navigateToMyProfile,
  scrollToLoadSections,
} from "../utils/navigation.js";

/**
 * Extract visible skill names from the skills section.
 * Uses span[aria-hidden="true"] to get clean, deduplicated text.
 */
async function extractSkillNames(page: Page): Promise<string[]> {
  try {
    const section = profileSkillsSection(page);
    await section.waitFor({ state: "attached", timeout: 5000 });
    await section.scrollIntoViewIfNeeded({ timeout: 3000 });
    await randomDelay(300, 500);

    const items = skillItems(section);
    const count = await items.count();

    const skills: string[] = [];
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      // Each skill item has visible text in span[aria-hidden="true"]
      const spans = item.locator("span[aria-hidden='true']");
      const firstSpan = spans.first();
      const text = await firstSpan
        .innerText({ timeout: 2000 })
        .catch(() => null);

      if (text?.trim()) {
        skills.push(text.trim());
      }
    }

    return skills;
  } catch {
    return [];
  }
}

export function registerSkillsTools(server: McpServer): void {
  server.registerTool(
    "list_skills",
    {
      title: "List LinkedIn Skills",
      description:
        "Reads all skills/competencies from your LinkedIn profile. " +
        "Returns the list of skill names in the order they appear.",
    },
    async () => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);
        await scrollToLoadSections(page);

        const skills = await extractSkillNames(page);

        const result =
          skills.length > 0
            ? `Found ${skills.length} skills:\n\n` +
              skills.map((s, i) => `${i + 1}. ${s}`).join("\n")
            : "No skills found on your profile.";

        return {
          content: [{ type: "text" as const, text: result }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error listing skills: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "add_skill",
    {
      title: "Add Skill to LinkedIn Profile",
      description:
        "Adds a new skill to your LinkedIn profile. Opens the skills modal, " +
        "enters the skill name, and saves.",
      inputSchema: {
        skillName: z
          .string()
          .min(1)
          .describe(
            "The name of the skill to add (e.g., 'Python', 'Project Management')"
          ),
      },
    },
    async ({ skillName }) => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);
        await scrollToLoadSections(page);

        // Click the "Add skill" button (page-level, uses aria-label)
        const addBtn = addSkillButton(page);
        await addBtn.waitFor({ state: "visible", timeout: 5000 });
        await addBtn.click();
        await randomDelay(1000, 2000);

        // The modal should now be open with an input field.
        // LinkedIn's add-skill modal has an input with a combobox role
        // or a text input for the skill name.
        const modal = page.locator('.artdeco-modal[role="dialog"]').last();
        await modal.waitFor({ state: "visible", timeout: 5000 });

        // Find the skill name input inside the modal
        const input = modal
          .locator(
            'input[role="combobox"], ' +
            'input[aria-label*="competência"], ' +
            'input[aria-label*="skill"], ' +
            'input[placeholder*="competência"], ' +
            'input[placeholder*="skill"]'
          )
          .first();

        await input.waitFor({ state: "visible", timeout: 5000 });
        await input.click();
        await randomDelay(200, 400);
        await humanType(input, skillName);
        await randomDelay(1000, 1500);

        // Select the first suggestion from the dropdown (if it appears)
        try {
          const suggestion = modal
            .locator('[role="option"], [role="listbox"] li')
            .first();
          if (await suggestion.isVisible({ timeout: 2000 })) {
            await suggestion.click();
            await randomDelay(500, 800);
          }
        } catch {
          // No dropdown, skill name typed directly
        }

        // Click Save
        const saveBtn = modal
          .getByRole("button", { name: /^(salvar|save)$/i })
          .first();
        await saveBtn.click();
        await randomDelay(2000, 3000);

        return {
          content: [
            {
              type: "text" as const,
              text: `Skill "${skillName}" added successfully.`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error adding skill: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "remove_skill",
    {
      title: "Remove Skill from LinkedIn Profile",
      description:
        "Removes a skill from your LinkedIn profile by name. " +
        "Navigates to the full skills page and deletes the matching skill.",
      inputSchema: {
        skillName: z
          .string()
          .min(1)
          .describe(
            "The exact name of the skill to remove (e.g., 'Python')"
          ),
      },
    },
    async ({ skillName }) => {
      try {
        const page = await ensureLoggedIn();

        // Navigate to the dedicated skills edit page for better access
        // The profile skills section has a "Show all X skills" link
        await navigateToMyProfile(page);
        await scrollToLoadSections(page);

        const section = profileSkillsSection(page);
        await section.waitFor({ state: "visible", timeout: 10000 });

        // Try to find the "Show all skills" link to get to the full list
        const showAllLink = section
          .locator("a")
          .filter({ hasText: /mostrar todas|show all/i })
          .first();

        try {
          if (await showAllLink.isVisible({ timeout: 3000 })) {
            await showAllLink.click();
            await randomDelay(1500, 2500);
          }
        } catch {
          // Already on skills page or no "show all" link
        }

        // Find the skill by name and click its delete/edit button
        // On the skills detail page, each skill has an edit button
        const skillItem = page
          .locator("li, div[class*='skill']")
          .filter({
            has: page.locator("span[aria-hidden='true']").filter({
              hasText: new RegExp(`^${escapeRegex(skillName)}$`, "i"),
            }),
          })
          .first();

        try {
          await skillItem.waitFor({ state: "visible", timeout: 5000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `Skill "${skillName}" not found on your profile.`,
              },
            ],
            isError: true,
          };
        }

        // Click the edit/delete button for this skill
        // PT-BR: "Deletar competência" / "Excluir"; EN: "Delete skill"
        const deleteBtn = skillItem
          .locator(
            'button[aria-label*="Deletar"], ' +
            'button[aria-label*="Excluir"], ' +
            'button[aria-label*="Delete"], ' +
            'button[aria-label*="Remove"]'
          )
          .first();

        try {
          await deleteBtn.waitFor({ state: "visible", timeout: 3000 });
          await deleteBtn.click();
        } catch {
          // Try finding an overflow menu (three dots) instead
          const menuBtn = skillItem
            .locator('button[aria-label*="mais"], button[aria-label*="more"]')
            .first();
          await menuBtn.click();
          await randomDelay(500, 800);

          // Click delete in the dropdown
          const dropdownDelete = page
            .locator('[role="menuitem"], [role="option"]')
            .filter({ hasText: /deletar|excluir|delete|remove/i })
            .first();
          await dropdownDelete.click();
        }

        await randomDelay(1000, 2000);

        // Confirm deletion if a confirmation dialog appears
        try {
          const confirmBtn = page
            .locator('.artdeco-modal[role="dialog"]')
            .last()
            .getByRole("button", {
              name: /confirmar|deletar|excluir|delete|remove|sim|yes/i,
            })
            .first();
          if (await confirmBtn.isVisible({ timeout: 2000 })) {
            await confirmBtn.click();
            await randomDelay(2000, 3000);
          }
        } catch {
          // No confirmation needed
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Skill "${skillName}" removed successfully.`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error removing skill: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}

/** Escape a string for use in a RegExp. */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
