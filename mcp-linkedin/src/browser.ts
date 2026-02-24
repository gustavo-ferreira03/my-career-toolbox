import { chromium, type BrowserContext, type Page } from "patchright";
import path from "node:path";
import os from "node:os";

const DEFAULT_PROFILE_DIR = path.join(
  os.homedir(),
  ".linkedin-mcp",
  "profile"
);

export interface BrowserOptions {
  headless?: boolean;
  profileDir?: string;
  slowMo?: number;
}

let context: BrowserContext | null = null;
let activePage: Page | null = null;

export async function getBrowser(
  opts: BrowserOptions = {}
): Promise<BrowserContext> {
  if (context) return context;

  const profileDir = opts.profileDir ?? DEFAULT_PROFILE_DIR;

  context = await chromium.launchPersistentContext(profileDir, {
    headless: opts.headless ?? true,
    slowMo: opts.slowMo ?? 50,
    viewport: { width: 1280, height: 900 },
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
    ],
  });

  return context;
}

export async function getPage(
  opts: BrowserOptions = {}
): Promise<Page> {
  if (activePage && !activePage.isClosed()) return activePage;

  const ctx = await getBrowser(opts);
  const pages = ctx.pages();
  activePage = pages.length > 0 ? pages[0] : await ctx.newPage();
  return activePage;
}

export async function closeBrowser(): Promise<void> {
  if (context) {
    await context.close();
    context = null;
    activePage = null;
  }
}

export function getProfileDir(custom?: string): string {
  return custom ?? DEFAULT_PROFILE_DIR;
}
