import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Page, Locator } from "patchright";
import { ensureLoggedIn } from "../auth.js";
import { randomDelay } from "../utils/human.js";
import {
  jobSearchResultsList,
  jobCardItems,
  jobCardTitle,
  extractJobId,
  jobDetailsTitle,
  jobDetailsDescription,
  jobDetailsCompany,
  jobDetailsMetadata,
} from "../utils/locators.js";
import {
  navigateToJobsSearch,
  navigateToJobView,
} from "../utils/navigation.js";

export function registerJobsTools(server: McpServer): void {
  server.registerTool(
    "search_jobs",
    {
      title: "Search LinkedIn Jobs",
      description:
        "Searches for jobs on LinkedIn using keywords and optional filters. " +
        "Returns a list of up to 25 jobs from the first results page with titles, " +
        "companies, and job IDs.",
      inputSchema: {
        keywords: z
          .string()
          .min(1)
          .describe("Job search keywords (e.g., 'Software Engineer', 'Product Manager')"),
        location: z
          .string()
          .optional()
          .describe("Job location (e.g., 'Sao Paulo', 'Remote')"),
        filters: z
          .object({
            datePosted: z
              .enum(["past-24h", "past-week", "past-month"])
              .optional(),
            remote: z
              .enum(["on-site", "remote", "hybrid"])
              .optional(),
          })
          .optional()
          .describe("Optional search filters"),
      },
    },
    async ({ keywords, location, filters }) => {
      try {
        const page = await ensureLoggedIn();

        // Navigate to jobs search
        const navFilters: Record<string, string> = {};
        if (filters?.datePosted) navFilters.datePosted = filters.datePosted;
        if (filters?.remote) navFilters.remote = filters.remote;

        await navigateToJobsSearch(page, keywords, location, navFilters);
        await randomDelay(2000, 3000);

        // Wait for the results list
        const container = jobSearchResultsList(page);
        try {
          await container.waitFor({ state: "attached", timeout: 8000 });
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `No jobs found for "${keywords}"${location ? ` in ${location}` : ""}. Try different keywords or filters.`,
              },
            ],
          };
        }

        // Extract job cards (limit to 25)
        const cards = jobCardItems(container);
        const count = Math.min(await cards.count(), 25);

        interface JobResult {
          title: string;
          company: string;
          jobId: string;
        }
        const jobs: JobResult[] = [];

        for (let i = 0; i < count; i++) {
          const card = cards.nth(i);

          const title = await jobCardTitle(card)
            .textContent({ timeout: 3000 })
            .catch(() => null);

          const jobId = await extractJobId(card);

          // Company name: try aria-hidden span inside the subtitle area
          const company = await card
            .locator(
              "[class*='subtitle'] span[aria-hidden='true'], " +
              "[class*='company'] span[aria-hidden='true']"
            )
            .first()
            .textContent({ timeout: 2000 })
            .catch(() => null);

          if (title?.trim() && jobId) {
            jobs.push({
              title: title.trim(),
              company: company?.trim() ?? "",
              jobId,
            });
          }
        }

        if (jobs.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Search returned results but could not extract job details. LinkedIn may have changed its layout.`,
              },
            ],
            isError: true,
          };
        }

        const lines = jobs.map(
          (j, i) =>
            `${i + 1}. [${j.jobId}] ${j.title}${j.company ? ` -- ${j.company}` : ""}`
        );

        const result = [
          `Found ${jobs.length} jobs for "${keywords}"${location ? ` in ${location}` : ""}:`,
          "",
          ...lines,
          "",
          "Use get_job_details with a job ID above to see the full description.",
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

  server.registerTool(
    "get_job_details",
    {
      title: "Get LinkedIn Job Details",
      description:
        "Retrieves full job description and details for a specific job by its LinkedIn ID.",
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

        await navigateToJobView(page, jobId);
        await randomDelay(2000, 3000);

        // Extract title
        const title = await jobDetailsTitle(page)
          .textContent({ timeout: 5000 })
          .catch(() => null);

        if (!title) {
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

        // Extract company
        const company = await jobDetailsCompany(page)
          .textContent({ timeout: 5000 })
          .catch(() => null);

        // Extract metadata (location, seniority, etc.)
        const metadata = await jobDetailsMetadata(page)
          .innerText({ timeout: 5000 })
          .catch(() => null);

        // Extract full description
        const description = await jobDetailsDescription(page)
          .innerText({ timeout: 8000 })
          .catch(() => null);

        const result = [
          `## ${title.trim()}`,
          "",
          company ? `**Company:** ${company.trim()}` : "",
          metadata ? `**Details:** ${metadata.trim()}` : "",
          "",
          `## Description`,
          "",
          description?.trim() ?? "(Description not found)",
          "",
          `**Job ID:** ${jobId}`,
          `**URL:** https://www.linkedin.com/jobs/view/${jobId}/`,
        ]
          .filter((l) => l !== "")
          .join("\n");

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
