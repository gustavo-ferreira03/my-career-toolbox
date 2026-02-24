import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page, Locator } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay, humanType } from "../utils/human.js";
import { navigateToJobView } from "../utils/navigation.js";
import {
  easyApplyButton,
  easyApplyModal,
  easyApplyFileInput,
  easyApplyNextButton,
  easyApplySubmitButton,
  easyApplyReviewButton,
  dismissModal,
} from "../utils/locators.js";

/**
 * Fill a form field by label, clearing any pre-filled value first.
 * Returns true if the field was found and filled.
 */
async function fillField(
  modal: Locator,
  label: string,
  value: string
): Promise<boolean> {
  try {
    const field = modal.getByLabel(new RegExp(label, "i")).first();
    if (await field.isVisible({ timeout: 1500 })) {
      await humanType(field, value, { clear: true });
      await randomDelay(300, 500);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Navigate through multi-step Easy Apply forms.
 * Clicks "Next" / "Review" until the submit button appears or we run out of steps.
 * Returns the number of steps navigated, or -1 if an unknown form element blocked us.
 */
async function navigateFormSteps(
  page: Page,
  modal: Locator,
  maxSteps: number = 10
): Promise<number> {
  let steps = 0;

  for (let i = 0; i < maxSteps; i++) {
    // Check if submit button is already visible (final step)
    const submitBtn = easyApplySubmitButton(modal);
    try {
      if (await submitBtn.isVisible({ timeout: 1000 })) {
        return steps;
      }
    } catch {
      // not visible yet
    }

    // Try "Review" button (appears before final submit on some forms)
    const reviewBtn = easyApplyReviewButton(modal);
    try {
      if (await reviewBtn.isVisible({ timeout: 500 })) {
        await reviewBtn.click();
        await randomDelay(1000, 2000);
        steps++;
        continue;
      }
    } catch {
      // no review button
    }

    // Try "Next" button
    const nextBtn = easyApplyNextButton(modal);
    try {
      if (await nextBtn.isVisible({ timeout: 500 })) {
        await nextBtn.click();
        await randomDelay(1000, 2000);
        steps++;
        continue;
      }
    } catch {
      // no next button
    }

    // Neither next, review, nor submit visible -- stuck
    return -1;
  }

  return -1; // exceeded max steps
}

/**
 * Upload a resume file if the file input is present.
 */
async function tryUploadResume(
  modal: Locator,
  resumePath: string
): Promise<boolean> {
  try {
    const fileInput = easyApplyFileInput(modal);
    // file inputs are usually hidden, check count instead of visibility
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(resumePath);
      await randomDelay(1000, 1500);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function registerApplyTools(server: McpServer): void {
  server.registerTool(
    "apply_to_job",
    {
      title: "Apply to LinkedIn Job (Easy Apply)",
      description:
        "Applies to a LinkedIn job using Easy Apply (1-at-a-time, user-controlled). " +
        "Navigates to the job, opens Easy Apply form, fills basic fields, " +
        "navigates multi-step forms, and pauses before final submission for user confirmation.",
      inputSchema: {
        jobId: z
          .string()
          .min(1)
          .describe("The LinkedIn job ID to apply to"),
        fullName: z
          .string()
          .min(1)
          .describe("Your full name for the application"),
        email: z
          .string()
          .email()
          .describe("Your email address"),
        phone: z
          .string()
          .optional()
          .describe("Your phone number"),
        message: z
          .string()
          .optional()
          .describe("Optional cover letter / application message"),
        resumePath: z
          .string()
          .optional()
          .describe("Optional absolute path to resume file to upload (PDF)"),
      },
    },
    async ({ jobId, fullName, email, phone, message, resumePath }) => {
      try {
        const page = await ensureLoggedIn();

        // Navigate to the job
        await navigateToJobView(page, jobId);
        await randomDelay(1500, 2500);

        // Click the Easy Apply button
        const applyBtn = easyApplyButton(page);
        try {
          await applyBtn.waitFor({ state: "visible", timeout: 10000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `Easy Apply button not found for job ${jobId}. The job may not support Easy Apply, may have closed, or you may have already applied.`,
              },
            ],
            isError: true,
          };
        }

        await applyBtn.click();
        await randomDelay(1500, 2500);

        // Get the Easy Apply modal
        const modal = easyApplyModal(page);
        try {
          await modal.waitFor({ state: "visible", timeout: 10000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `Easy Apply modal did not open. LinkedIn may have redirected to external application.`,
              },
            ],
            isError: true,
          };
        }
        await randomDelay(500, 1000);

        // Fill basic form fields (clear pre-filled values first)
        const filled: string[] = [];
        if (await fillField(modal, "nome|name|first.name", fullName)) {
          filled.push("name");
        }
        if (await fillField(modal, "e-?mail", email)) {
          filled.push("email");
        }
        if (phone && await fillField(modal, "telefone|phone|celular|mobile", phone)) {
          filled.push("phone");
        }
        if (message && await fillField(modal, "mensagem|message|carta|cover.letter", message)) {
          filled.push("message");
        }

        // Upload resume if provided
        if (resumePath) {
          const uploaded = await tryUploadResume(modal, resumePath);
          if (uploaded) filled.push("resume");
        }

        // Navigate through multi-step form
        const stepsResult = await navigateFormSteps(page, modal);

        if (stepsResult === -1) {
          // Stuck -- close modal and report
          try {
            await dismissModal(page).click();
          } catch {
            // ignore
          }
          return {
            content: [
              {
                type: "text" as const,
                text: [
                  `Could not complete the Easy Apply form for job ${jobId}.`,
                  `The form has steps that require manual input (e.g., custom questions, required fields).`,
                  `Fields filled: ${filled.length > 0 ? filled.join(", ") : "none"}`,
                  `Please apply manually at: https://www.linkedin.com/jobs/view/${jobId}/`,
                ].join("\n"),
              },
            ],
            isError: true,
          };
        }

        // Verify submit button is now visible
        const submitBtn = easyApplySubmitButton(modal);
        try {
          await submitBtn.waitFor({ state: "visible", timeout: 5000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `Navigated ${stepsResult} steps but submit button not found. The form may require additional information.`,
              },
            ],
            isError: true,
          };
        }

        // DO NOT submit -- return preview for user confirmation
        const previewLines = [
          `## Application Ready`,
          ``,
          `Job ID: ${jobId}`,
          `Fields filled: ${filled.length > 0 ? filled.join(", ") : "none (pre-filled by LinkedIn)"}`,
          `Form steps navigated: ${stepsResult}`,
          ``,
          `The submit button is visible. Use submit_application to finalize.`,
          `To cancel, the modal will close automatically on navigation.`,
        ];

        return {
          content: [
            { type: "text" as const, text: previewLines.join("\n") },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error applying to job: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "submit_application",
    {
      title: "Submit Pending Job Application",
      description:
        "Submits the Easy Apply form that was prepared by apply_to_job. " +
        "Only use this after reviewing the preview from apply_to_job.",
    },
    async () => {
      try {
        const page = await ensureLoggedIn();

        const modal = easyApplyModal(page);
        const submitBtn = easyApplySubmitButton(modal);

        try {
          await submitBtn.waitFor({ state: "visible", timeout: 5000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `Submit button not found. No pending application. Run apply_to_job first.`,
              },
            ],
            isError: true,
          };
        }

        await submitBtn.click();
        await randomDelay(3000, 4000);

        return {
          content: [
            {
              type: "text" as const,
              text: `Application submitted. Check LinkedIn for confirmation.`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error submitting application: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
