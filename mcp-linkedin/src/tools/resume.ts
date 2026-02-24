import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page } from "patchright";
import * as fs from "fs";
import * as path from "path";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay } from "../utils/human.js";
import { navigateToJobView } from "../utils/navigation.js";
import {
  jobDetailsTitle,
  jobDetailsDescription,
  jobDetailsMetadata,
} from "../utils/locators.js";

/**
 * Extract job details from LinkedIn and save to data/input/ for agent processing.
 * Returns the path to the saved file for the agent to process.
 */
async function saveJobToInput(
  page: Page,
  jobId: string
): Promise<{ filePath: string; jobTitle: string } | null> {
  try {
    // Navigate to the job
    await navigateToJobView(page, jobId);
    await randomDelay(1500, 2500);

    // Extract job details
    const title = await jobDetailsTitle(page)
      .textContent({ timeout: 5000 })
      .catch(() => null);

    const description = await jobDetailsDescription(page)
      .innerText({ timeout: 5000 })
      .catch(() => null);

    const metadata = await jobDetailsMetadata(page)
      .textContent({ timeout: 5000 })
      .catch(() => null);

    if (!title) {
      return null;
    }

    // Construct job details text
    const jobDetailsText = [
      `Job ID: ${jobId}`,
      `Title: ${title.trim()}`,
      metadata ? `Company/Location: ${metadata.trim()}` : "",
      "",
      `## Job Description`,
      description?.trim() ?? "(No description available)",
    ]
      .filter((line) => line !== "")
      .join("\n");

    // Ensure data/input directory exists
    const inputDir = path.resolve(process.cwd(), "data", "input");
    if (!fs.existsSync(inputDir)) {
      fs.mkdirSync(inputDir, { recursive: true });
    }

    // Save to job-{id}.txt
    const filePath = path.join(inputDir, `job-${jobId}.txt`);
    fs.writeFileSync(filePath, jobDetailsText, "utf-8");

    return { filePath, jobTitle: title.trim() };
  } catch {
    return null;
  }
}

export function registerResumeTools(server: McpServer): void {
  // -- generate_tailored_resume tool --
  server.registerTool(
    "generate_tailored_resume",
    {
      title: "Generate Tailored Resume for LinkedIn Job",
      description:
        "Extracts a job from LinkedIn and generates a tailored LaTeX resume optimized for that specific job. " +
        "Uses the MCP server to fetch job details from LinkedIn, saves them to data/input/, " +
        "and triggers the career assistant's tailored resume generator. " +
        "Returns the path to the generated .tex file ready for compilation.",
      inputSchema: {
        jobId: z
          .string()
          .min(1)
          .describe("The LinkedIn job ID (numeric)"),
        outputFileName: z
          .string()
          .optional()
          .describe("Optional custom output filename (without .tex extension)"),
      },
    },
    async ({ jobId, outputFileName }) => {
      try {
        const page = await ensureLoggedIn();

        // Step 1: Fetch job from LinkedIn and save to data/input/
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

        // Step 2: Notify user that job has been saved and next steps
        const texFileName = outputFileName || `resume-${jobId}`;
        const outputPath = path.join(
          process.cwd(),
          "data",
          "output",
          "latex",
          `${texFileName}.tex`
        );

        const nextSteps = [
          `## Job Saved`,
          "",
          `Job details saved to: ${jobData.filePath}`,
          `Job Title: ${jobData.jobTitle}`,
          "",
          `## Next Steps`,
          "",
          `The agent will now use the career assistant's tailored-resume-generator skill to:`,
          `1. Extract the job requirements from data/input/job-${jobId}.txt`,
          `2. Match them against your profile in profile/`,
          `3. Generate a LaTeX resume optimized for this job`,
          `4. Save to: ${outputPath}`,
          "",
          `Expected output file: ${texFileName}.tex`,
          `Compile with: npm run compile-latex`,
        ].join("\n");

        return {
          content: [{ type: "text" as const, text: nextSteps }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error generating tailored resume: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
