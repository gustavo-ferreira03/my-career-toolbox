import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page, Locator } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay, humanType } from "../utils/human.js";
import {
  navigateToJobView,
} from "../utils/navigation.js";
import {
  easyApplyButton,
  easyApplyModal,
  easyApplyFormField,
  easyApplyFileInput,
  easyApplyNextButton,
  easyApplySubmitButton,
  dismissModal,
  easyApplyComplexFormWarning,
} from "../utils/locators.js";

/**
 * Fill out Easy Apply form fields with basic info.
 * Supports: name, email, phone, message fields.
 * Returns true if form was successfully filled, false if complex dynamic fields detected.
 */
async function fillEasyApplyForm(
  page: Page,
  modal: Locator,
  formData: Record<string, string>
): Promise<boolean> {
  try {
    // Check for complex dynamic form fields we can't handle
    try {
      const complexWarning = easyApplyComplexFormWarning(modal);
      if (await complexWarning.isVisible({ timeout: 1000 })) {
        return false; // Complex form detected
      }
    } catch {
      // Not a complex form, continue
    }

    // Fill in provided form fields
    for (const [fieldName, value] of Object.entries(formData)) {
      try {
        const field = easyApplyFormField(modal, fieldName);
        if (await field.isVisible({ timeout: 2000 })) {
          await field.click();
          await randomDelay(300, 500);
          await humanType(field, value);
          await randomDelay(400, 700);
        }
      } catch {
        // Field not found or not visible, skip
        continue;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if there's a file upload field and try to upload a resume.
 */
async function tryUploadResume(
  page: Page,
  modal: Locator,
  resumePath?: string
): Promise<void> {
  try {
    if (!resumePath) return;

    const fileInput = easyApplyFileInput(modal);
    if (await fileInput.isVisible({ timeout: 2000 })) {
      // Set the file input value
      await fileInput.setInputFiles(resumePath);
      await randomDelay(1000, 1500);
    }
   } catch {
     // File upload not available, skip
   }
 }

 export function registerApplyTools(server: McpServer): void {
  // -- apply_to_job tool --
  server.registerTool(
    "apply_to_job",
    {
      title: "Apply to LinkedIn Job (Easy Apply)",
      description:
        "Applies to a LinkedIn job using Easy Apply (1-at-a-time, user-controlled). " +
        "Navigates to the job, opens Easy Apply form, fills in basic fields (name, email, phone), " +
        "and pauses before final submission to show a preview for user confirmation.",
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
          .describe("Your phone number (optional)", ),
        message: z
          .string()
          .optional()
          .describe("Optional cover letter / application message"),
        resumePath: z
          .string()
          .optional()
          .describe("Optional path to resume file to upload"),
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
        if (!await applyBtn.isVisible({ timeout: 10000 })) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Easy Apply button not found for this job. The job may not support Easy Apply or may have closed.`,
              },
            ],
            isError: true,
          };
        }

        await applyBtn.click();
        await randomDelay(1000, 2000);

        // Get the modal
        const modal = easyApplyModal(page);
        await modal.waitFor({ state: "visible", timeout: 10000 });
        await randomDelay(500, 1000);

        // Build form data with provided values
        const formData: Record<string, string> = {
          name: fullName,
          email: email,
        };

        if (phone) {
          formData.phone = phone;
        }

        if (message) {
          formData.message = message;
        }

        // Try to fill the form
        const formFilled = await fillEasyApplyForm(page, modal, formData);

        if (!formFilled) {
          // Complex form detected, can't proceed automatically
          await dismissModal(page).click().catch(() => {});
          return {
            content: [
              {
                type: "text" as const,
                text: [
                  `This job has a complex application form with dynamic fields.`,
                  `Easy Apply support is limited to simple forms.`,
                  `Please apply manually on LinkedIn.`,
                ].join("\n"),
              },
            ],
            isError: true,
          };
        }

        // Try to upload resume if provided
        if (resumePath) {
          await tryUploadResume(page, modal, resumePath);
        }

        // Check for "Next" button to navigate through multi-step forms
        try {
          const nextBtn = easyApplyNextButton(modal);
          if (await nextBtn.isVisible({ timeout: 2000 })) {
            await nextBtn.click();
            await randomDelay(1500, 2500);
          }
        } catch {
          // No next button, form is single-step
        }

        // Get the submit button
        const submitBtn = easyApplySubmitButton(modal);
        if (!await submitBtn.isVisible({ timeout: 5000 })) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Could not find submit button. The form may still be loading or may have changed.`,
              },
            ],
            isError: true,
          };
        }

        // Pause and show preview before submission
        const previewText = [
          `## Application Preview`,
          ``,
          `Job ID: ${jobId}`,
          `Full Name: ${fullName}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : "",
          message ? `Message: ${message}` : "",
          resumePath ? `Resume: ${resumePath}` : "",
          ``,
          `Ready to submit? User confirmation required.`,
          `Click submit button to proceed with application.`,
        ]
          .filter((line) => line !== "")
          .join("\n");

        // IMPORTANT: Do NOT click submit button automatically.
        // User must confirm before we submit.
        // Return the preview and wait for user input.

        return {
          content: [
            {
              type: "text" as const,
              text: [
                previewText,
                "",
                `NEXT STEP: To complete the application, ask the MCP to click the submit button.`,
                `NOTE: This is designed to be 1-at-a-time with user control.`,
              ].join("\n"),
            },
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

  // -- submit_application tool --
  // This is a separate tool to allow the user to review the form before submission.
  server.registerTool(
    "submit_application",
    {
      title: "Submit Pending Job Application",
      description:
        "Submits the application form that was prepared by apply_to_job. " +
        "Use this after reviewing the application preview from apply_to_job.",
    },
    async () => {
      try {
        const page = await ensureLoggedIn();

        // Find the submit button in the current modal
        const modal = easyApplyModal(page);
        const submitBtn = easyApplySubmitButton(modal);

        if (!await submitBtn.isVisible({ timeout: 5000 })) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Submit button not found. No pending application to submit. Run apply_to_job first.`,
              },
            ],
            isError: true,
          };
        }

        // Click the submit button
        await submitBtn.click();
        await randomDelay(3000, 4000);

        return {
          content: [
            {
              type: "text" as const,
              text: `Application submitted successfully! LinkedIn should show a confirmation message.`,
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
