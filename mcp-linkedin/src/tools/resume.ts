import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page } from "patchright";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay } from "../utils/human.js";
import { navigateToJobView } from "../utils/navigation.js";
import {
  jobDetailsTitle,
  jobDetailsDescription,
  jobDetailsCompany,
  jobDetailsMetadata,
} from "../utils/locators.js";

// Resolve project root: mcp-linkedin/src/tools/resume.ts -> mcp-linkedin/ -> project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

/**
 * Extract job details from LinkedIn and save to data/input/ for agent processing.
 */
async function saveJobToInput(
  page: Page,
  jobId: string
): Promise<{ filePath: string; jobTitle: string; jobText: string } | null> {
  try {
    await navigateToJobView(page, jobId);
    await randomDelay(2000, 3000);

    const title = await jobDetailsTitle(page)
      .textContent({ timeout: 5000 })
      .catch(() => null);

    if (!title?.trim()) return null;

    const company = await jobDetailsCompany(page)
      .textContent({ timeout: 5000 })
      .catch(() => null);

    const metadata = await jobDetailsMetadata(page)
      .innerText({ timeout: 5000 })
      .catch(() => null);

    const description = await jobDetailsDescription(page)
      .innerText({ timeout: 8000 })
      .catch(() => null);

    const lines = [
      `Job ID: ${jobId}`,
      `URL: https://www.linkedin.com/jobs/view/${jobId}/`,
      `Title: ${title.trim()}`,
      company?.trim() ? `Company: ${company.trim()}` : "",
      metadata?.trim() ? `Details: ${metadata.trim()}` : "",
      "",
      "## Job Description",
      "",
      description?.trim() ?? "(No description available)",
    ].filter((l) => l !== "");

    const jobText = lines.join("\n");

    // Save to data/input/job-{id}.txt
    const inputDir = path.join(PROJECT_ROOT, "data", "input");
    fs.mkdirSync(inputDir, { recursive: true });

    const filePath = path.join(inputDir, `job-${jobId}.txt`);
    fs.writeFileSync(filePath, jobText, "utf-8");

    return { filePath, jobTitle: title.trim(), jobText };
  } catch {
    return null;
  }
}

export function registerResumeTools(server: McpServer): void {
  server.registerTool(
    "generate_tailored_resume",
    {
      title: "Generate Tailored Resume for LinkedIn Job",
      description:
        "Fetches a job posting from LinkedIn and saves it to data/input/ so the " +
        "career assistant can generate a tailored LaTeX resume. " +
        "Returns the saved job description and instructions for the agent.",
      inputSchema: {
        jobId: z
          .string()
          .min(1)
          .describe("The LinkedIn job ID (numeric)"),
        outputFileName: z
          .string()
          .optional()
          .describe("Custom output filename without .tex extension"),
      },
    },
    async ({ jobId, outputFileName }) => {
      try {
        const page = await ensureLoggedIn();

        const jobData = await saveJobToInput(page, jobId);

        if (!jobData) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Could not fetch job details for ID ${jobId}. The job may not exist or the page failed to load.`,
              },
            ],
            isError: true,
          };
        }

        const texFileName = outputFileName ?? `resume-${jobId}`;
        const outputPath = path.join(
          PROJECT_ROOT,
          "data",
          "output",
          "latex",
          `${texFileName}.tex`
        );

        const result = [
          `## Job Saved`,
          "",
          `File: ${jobData.filePath}`,
          `Title: ${jobData.jobTitle}`,
          "",
          `## Job Description (for context)`,
          "",
          jobData.jobText,
          "",
          `## Next Steps`,
          "",
          `Use the career-assistant and tailored-resume-generator skills to:`,
          `1. Read the job from ${jobData.filePath}`,
          `2. Match against profile/`,
          `3. Generate LaTeX resume to ${outputPath}`,
          `4. Compile with: npm run compile-latex`,
        ].join("\n");

        return {
          content: [{ type: "text" as const, text: result }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
