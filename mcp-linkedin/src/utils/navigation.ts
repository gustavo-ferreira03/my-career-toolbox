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
 * Navigate to the LinkedIn jobs search page with query parameters.
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
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }
  await page.goto(`https://www.linkedin.com/jobs/search/?${params}`, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await randomDelay(1000, 2000);
}

/**
 * Navigate to a specific job posting by ID.
 */
export async function navigateToJobView(page: Page, jobId: string): Promise<void> {
  await page.goto(`https://www.linkedin.com/jobs/view/${jobId}/`, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });
  await randomDelay(1000, 2000);
}
