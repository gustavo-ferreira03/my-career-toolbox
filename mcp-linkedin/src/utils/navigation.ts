/**
 * Shared navigation utilities for LinkedIn pages.
 */
import type { Page } from "patchright";
import { randomDelay } from "./human.js";

/**
 * Navigate to the logged-in user's own profile page.
 */
export async function navigateToMyProfile(page: Page): Promise<void> {
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
export async function scrollToLoadSections(page: Page): Promise<void> {
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await randomDelay(300, 600);
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await randomDelay(300, 500);
}

/**
 * LinkedIn jobs search URL parameter mappings.
 * LinkedIn uses encoded filter parameters like f_TPR, f_WT, etc.
 */
const DATE_POSTED_MAP: Record<string, string> = {
  "past-24h": "r86400",
  "past-week": "r604800",
  "past-month": "r2592000",
};

const REMOTE_MAP: Record<string, string> = {
  "on-site": "1",
  remote: "2",
  hybrid: "3",
};

/**
 * Navigate to the LinkedIn jobs search page with query parameters.
 * Filters are translated to LinkedIn's internal f_ parameters.
 */
export async function navigateToJobsSearch(
  page: Page,
  keywords: string,
  location?: string,
  filters?: Record<string, string>
): Promise<void> {
  const params = new URLSearchParams();
  params.set("keywords", keywords);
  if (location) params.set("location", location);

  if (filters) {
    if (filters.datePosted && DATE_POSTED_MAP[filters.datePosted]) {
      params.set("f_TPR", DATE_POSTED_MAP[filters.datePosted]);
    }
    if (filters.remote && REMOTE_MAP[filters.remote]) {
      params.set("f_WT", REMOTE_MAP[filters.remote]);
    }
  }

  await page.goto(
    `https://www.linkedin.com/jobs/search/?${params.toString()}`,
    {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    }
  );
  await randomDelay(1500, 2500);
}

/**
 * Navigate to a specific job posting by ID.
 */
export async function navigateToJobView(
  page: Page,
  jobId: string
): Promise<void> {
  await page.goto(`https://www.linkedin.com/jobs/view/${jobId}/`, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await randomDelay(1000, 2000);
}

/**
 * Navigate to the LinkedIn feed page.
 */
export async function navigateToFeed(page: Page): Promise<void> {
  await page.goto("https://www.linkedin.com/feed/", {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await randomDelay(1000, 2000);
}

/**
 * Navigate to the logged-in user's activity page (recent posts).
 */
export async function navigateToMyActivity(page: Page): Promise<void> {
  await page.goto(
    "https://www.linkedin.com/in/me/recent-activity/all/",
    {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    }
  );
  await randomDelay(1500, 2500);
}
