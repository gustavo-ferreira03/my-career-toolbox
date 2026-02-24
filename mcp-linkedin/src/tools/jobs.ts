import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page, Locator } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay } from "../utils/human.js";
import {
  jobsSearchContainer,
  jobCards,
  jobCardTitle,
  jobDetailsTitle,
  jobDetailsDescription,
  jobDetailsMetadata,
} from "../utils/locators.js";
import {
  navigateToJobsSearch,
  navigateToJobView,
} from "../utils/navigation.js";

/**
 * Extract job ID from a job card's URL or data attributes.
 * LinkedIn job URLs follow the pattern: /jobs/view/{jobId}/
 */
async function extractJobIdFromCard(
  jobCard: Locator,
  page: Page
): Promise<string | null> {
  try {
    // Try to get the data attribute first
    const jobId = await jobCard.getAttribute("data-job-id");
    if (jobId) return jobId;

    // Try to find a link within the card and extract ID from href
    const link = jobCard.locator("a").first();
    const href = await link.getAttribute("href");
    if (href) {
      const match = href.match(/\/jobs\/view\/(\d+)/);
      if (match && match[1]) return match[1];
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract job details from the job details page.
 */
async function extractJobDetails(page: Page): Promise<{
  title: string | null;
  description: string | null;
  metadata: string | null;
}> {
  try {
    const title = await jobDetailsTitle(page)
      .textContent({ timeout: 5000 })
      .catch(() => null);

    const description = await jobDetailsDescription(page)
      .innerText({ timeout: 5000 })
      .catch(() => null);

    const metadata = await jobDetailsMetadata(page)
      .textContent({ timeout: 5000 })
      .catch(() => null);

    return { title, description, metadata };
  } catch {
    return { title: null, description: null, metadata: null };
  }
}

export function registerJobsTools(server: McpServer): void {
  // -- search_jobs tool --
  server.registerTool(
    "search_jobs",
    {
      title: "Search LinkedIn Jobs",
      description:
        "Searches for jobs on LinkedIn using keywords and optional filters. " +
        "Returns a list of up to 25 jobs from the first search results page with titles, " +
        "companies, and job IDs for further inspection.",
      inputSchema: {
        keywords: z
          .string()
          .min(1)
          .describe("Job search keywords (e.g., 'Software Engineer', 'Product Manager')"),
        location: z
          .string()
          .optional()
          .describe("Job location (optional, e.g., 'São Paulo', 'Remote')"),
        filters: z
          .object({
            jobType: z.enum(["full-time", "part-time", "contract", "temporary"]).optional(),
            level: z.enum(["entry", "mid", "senior", "executive"]).optional(),
            datePosted: z.enum(["past-day", "past-week", "past-month"]).optional(),
          })
          .optional()
          .describe("Optional filters for job search"),
      },
    },
    async ({ keywords, location, filters }) => {
      try {
        const page = await ensureLoggedIn();

        // Build filter object for navigation
        const navFilters: Record<string, string> = {};
        if (filters?.jobType)
          navFilters.jobType = filters.jobType;
        if (filters?.level) navFilters.level = filters.level;
        if (filters?.datePosted)
          navFilters.datePosted = filters.datePosted;

        // Navigate to jobs search with filters
        await navigateToJobsSearch(page, keywords, location, navFilters);

        // Wait for results to load
        await randomDelay(1000, 2000);

        // Extract job cards
        const container = jobsSearchContainer(page);
        let found = false;
        try {
          await container.waitFor({ state: "attached", timeout: 5000 });
          found = true;
        } catch {
          // Container not found
        }

        if (!found) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No jobs found for "${keywords}" ${location ? `in ${location}` : ""}. Try different keywords or filters.`,
              },
            ],
          };
        }

        // Get all job cards (limit to 25)
        const cards = jobCards(container);
        const count = Math.min(await cards.count(), 25);

        const jobsList: string[] = [];
        const jobIds: string[] = [];

        for (let i = 0; i < count; i++) {
          const card = cards.nth(i);

          // Extract job title
          const titleElement = jobCardTitle(card);
          const title = await titleElement
            .textContent({ timeout: 3000 })
            .catch(() => null);

          // Extract job ID
          const jobId = await extractJobIdFromCard(card, page);

          // Extract company name (usually a secondary text in the card)
          const company = await card
            .locator("[class*='company'], [class*='subtitle']")
            .first()
            .textContent({ timeout: 2000 })
            .catch(() => null);

          if (title && jobId) {
            jobsList.push(
              `${i + 1}. ${title?.trim() ?? "Unknown"}` +
                (company ? ` - ${company.trim()}` : "")
            );
            jobIds.push(jobId);
          }
        }

        if (jobsList.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Search returned results but could not extract job details. Try again.`,
              },
            ],
            isError: true,
          };
        }

        const result = [
          `Found ${jobsList.length} jobs for "${keywords}" ${location ? `in ${location}` : ""}:`,
          "",
          ...jobsList,
          "",
          "Use get_job_details with the job number or ID for full job description.",
        ].join("\n");

        return {
          content: [{ type: "text" as const, text: result }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error searching jobs: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // -- get_job_details tool --
  server.registerTool(
    "get_job_details",
    {
      title: "Get LinkedIn Job Details",
      description:
        "Retrieves full job description and details for a specific job by ID. " +
        "Returns job title, company, location, full description, and other metadata.",
      inputSchema: {
        jobId: z
          .string()
          .min(1)
          .describe("The LinkedIn job ID (numeric, e.g., '1234567890')"),
      },
    },
    async ({ jobId }) => {
      try {
        const page = await ensureLoggedIn();

        // Navigate to the job details page
        await navigateToJobView(page, jobId);

        // Wait for the job details to load
        await randomDelay(1500, 2500);

        // Extract job details
        const details = await extractJobDetails(page);

        if (!details.title) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Could not load job details for ID ${jobId}. The job may not exist or the page failed to load.`,
              },
            ],
            isError: true,
          };
        }

        const result = [
          `## ${details.title?.trim() ?? "Job Title"}`,
          "",
          details.metadata
            ? `**Company & Location:** ${details.metadata.trim()}`
            : "(Company info not found)",
          "",
          `## Job Description`,
          "",
          details.description?.trim() ?? "(Description not found)",
          "",
          `## Job ID`,
          jobId,
        ].join("\n");

        return {
          content: [{ type: "text" as const, text: result }],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error fetching job details: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
