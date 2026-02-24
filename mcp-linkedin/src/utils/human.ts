/**
 * Human-like delays and behavior patterns to avoid bot detection.
 */
import type { Page, Locator } from "patchright";

/**
 * Wait for a random duration between min and max milliseconds.
 */
export async function randomDelay(
  minMs: number = 500,
  maxMs: number = 2000
): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  await new Promise((r) => setTimeout(r, delay));
}

/**
 * Type text character by character with random delays between keystrokes.
 * Accepts a Locator -- click + clear the field first, then type.
 */
export async function humanType(
  locator: Locator,
  text: string,
  opts: { minDelay?: number; maxDelay?: number; clear?: boolean } = {}
): Promise<void> {
  const minDelay = opts.minDelay ?? 30;
  const maxDelay = opts.maxDelay ?? 100;

  if (opts.clear) {
    await locator.click();
    await locator.selectText();
    await locator.page().keyboard.press("Backspace");
    await randomDelay(100, 300);
  }

  for (const char of text) {
    await locator.pressSequentially(char, {
      delay: Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay,
    });
  }
}
