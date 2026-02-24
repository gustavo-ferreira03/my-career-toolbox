import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay, humanType } from "../utils/human.js";
import {
  profileSkillsSection,
  skillItems,
  skillEditButton,
  skillDeleteButton,
  addSkillButton,
  skillNameInput,
  skillModalSaveButton,
  dismissModal,
} from "../utils/locators.js";
import { navigateToMyProfile, scrollToLoadSections } from "../utils/navigation.js";

/**
 * Extract visible skill names from the skills section.
 * Uses span[aria-hidden="true"] to get clean, deduplicated text.
 */
async function extractSkillNames(page: Page): Promise<string[]> {
  try {
    const section = profileSkillsSection(page);
    await section.waitFor({ state: "attached", timeout: 3000 });
    await section.scrollIntoViewIfNeeded({ timeout: 3000 });
    await randomDelay(300, 500);

    // Get all skill items
    const items = skillItems(section);
    const count = await items.count();

    const skills: string[] = [];
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const skillName = await item
        .locator("span[aria-hidden='true']")
        .first()
        .innerText({ timeout: 3000 })
        .catch(() => null);

      if (skillName && skillName.trim()) {
        skills.push(skillName.trim());
      }
    }

    return skills;
  } catch {
    return [];
  }
}

export function registerSkillsTools(server: McpServer): void {
  // -- list_skills tool --
  server.registerTool(
    "list_skills",
    {
      title: "List LinkedIn Skills",
      description:
        "Reads all skills from your LinkedIn profile's Competências/Skills section. " +
        "Returns a list of skill names in the order they appear.",
    },
    async () => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);

        // Scroll to trigger lazy-loading of the skills section
        await scrollToLoadSections(page);

        // Extract skill names
        const skills = await extractSkillNames(page);

        const result =
          skills.length > 0
            ? `Found ${skills.length} skills:\n\n` + skills.map((s, i) => `${i + 1}. ${s}`).join("\n")
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

  // -- add_skill tool --
  server.registerTool(
    "add_skill",
    {
      title: "Add Skill to LinkedIn Profile",
      description:
        "Adds a new skill to your LinkedIn profile. Opens the Competências section, " +
        "clicks 'Adicionar' (Add), enters the skill name, and saves.",
      inputSchema: {
        skillName: z
          .string()
          .min(1)
          .describe("The name of the skill to add (e.g., 'Python', 'Project Management')"),
      },
    },
    async ({ skillName }) => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);

        // Scroll to trigger lazy-loading
        await scrollToLoadSections(page);

        // Find and click the "Add skill" button
        const section = profileSkillsSection(page);
        await section.waitFor({ state: "visible", timeout: 10000 });
        const addBtn = addSkillButton(section);
        await addBtn.waitFor({ state: "visible", timeout: 5000 });
        await addBtn.click();
        await randomDelay(1000, 2000);

        // Fill in the skill name in the modal
        const input = skillNameInput(page);
        await input.waitFor({ state: "visible", timeout: 10000 });
        await input.click();
        await randomDelay(200, 400);
        await humanType(input, skillName);
        await randomDelay(500, 1000);

        // Save the skill
        const saveBtn = skillModalSaveButton(page);
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

  // -- remove_skill tool --
  server.registerTool(
    "remove_skill",
    {
      title: "Remove Skill from LinkedIn Profile",
      description:
        "Removes a skill from your LinkedIn profile. Searches for the skill by name, " +
        "clicks the edit button, and deletes it.",
      inputSchema: {
        skillName: z
          .string()
          .min(1)
          .describe("The name of the skill to remove (e.g., 'Python', 'Project Management')"),
      },
    },
    async ({ skillName }) => {
      try {
        const page = await ensureLoggedIn();
        await navigateToMyProfile(page);

        // Scroll to trigger lazy-loading
        await scrollToLoadSections(page);

        // Find the skill in the list
        const section = profileSkillsSection(page);
        await section.waitFor({ state: "visible", timeout: 10000 });
        const items = skillItems(section);
        const count = await items.count();

        let found = false;
        for (let i = 0; i < count; i++) {
          const item = items.nth(i);
          const skillText = await item
            .locator("span[aria-hidden='true']")
            .first()
            .innerText({ timeout: 3000 })
            .catch(() => null);

          if (skillText && skillText.trim().toLowerCase() === skillName.toLowerCase()) {
            found = true;

            // Click the edit button for this skill
            const editBtn = skillEditButton(item);
            await editBtn.waitFor({ state: "visible", timeout: 5000 });
            await editBtn.click();
            await randomDelay(500, 1000);

            // Click the delete button in the dropdown menu
            const deleteBtn = skillDeleteButton(section);
            await deleteBtn.waitFor({ state: "visible", timeout: 5000 });
            await deleteBtn.click();
            await randomDelay(1000, 2000);

            // Confirm deletion if a confirmation modal appears
            try {
              const confirmBtn = page
                .getByRole("button", { name: /confirmar|confirm|deletar|delete/i })
                .first();
              if (await confirmBtn.isVisible({ timeout: 1500 })) {
                await confirmBtn.click();
                await randomDelay(2000, 3000);
              }
            } catch {
              // No confirmation modal, deletion likely already done
            }

            break;
          }
        }

        if (!found) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Skill "${skillName}" not found in your profile.`,
              },
            ],
            isError: true,
          };
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
