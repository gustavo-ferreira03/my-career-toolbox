import type { Page } from "patchright";
import { getPage, type BrowserOptions } from "./browser.js";
import { randomDelay } from "./utils/human.js";

const AUTH_BLOCKED_PATHS = [
  "/login",
  "/checkpoint",
  "/authwall",
  "/uas/login",
];

const LOGGED_IN_PATHS = [
  "/feed",
  "/mynetwork",
  "/jobs",
  "/messaging",
  "/notifications",
  "/in/",
];

/**
 * Check if the current browser session is logged into LinkedIn.
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const url = page.url();

  // If on an auth-blocked path, not logged in
  for (const blocked of AUTH_BLOCKED_PATHS) {
    if (url.includes(blocked)) return false;
  }

  // If on a known logged-in path, we're good
  for (const loggedIn of LOGGED_IN_PATHS) {
    if (url.includes(loggedIn)) return true;
  }

  // Try navigating to feed and check
  try {
    await page.goto("https://www.linkedin.com/feed/", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    // Wait a moment for any redirects to settle
    await new Promise((r) => setTimeout(r, 1500));
    const finalUrl = page.url();
    return !AUTH_BLOCKED_PATHS.some((p) => finalUrl.includes(p));
  } catch {
    return false;
  }
}

/**
 * Ensure the browser is logged into LinkedIn.
 * Retries up to 3 times with backoff to handle transient failures
 * (e.g., persistent session cookies not loaded on first navigation).
 * Returns the Page if logged in, throws if all retries fail.
 */
export async function ensureLoggedIn(): Promise<Page> {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const page = await getPage();
    if (await isLoggedIn(page)) {
      return page;
    }
    if (attempt < maxRetries) {
      // Wait before retrying -- cookies may need time to load
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error("Not logged in. Use the 'login' tool first.");
}

/**
 * Warm up the browser by visiting benign sites first.
 * This makes the browser fingerprint look more natural.
 */
export async function warmUp(page: Page): Promise<void> {
  const sites = [
    "https://www.google.com",
    "https://www.github.com",
  ];

  for (const site of sites) {
    try {
      await page.goto(site, { waitUntil: "domcontentloaded", timeout: 10000 });
      await randomDelay(1000, 3000);
    } catch {
      // Warm-up failures are not critical
    }
  }
}

/**
 * Open LinkedIn login page and wait for the user to log in manually.
 * Supports 2FA, captcha, etc. since the user handles it.
 * Returns true if login succeeded, false if timed out.
 */
export async function waitForManualLogin(
  opts: BrowserOptions = {},
  timeoutMs: number = 300000 // 5 minutes
): Promise<boolean> {
  const page = await getPage({ ...opts, headless: false });

  // Warm up first
  await warmUp(page);

  // Navigate to LinkedIn login
  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "domcontentloaded",
  });

  // Poll until logged in or timeout
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isLoggedIn(page)) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  return false;
}
