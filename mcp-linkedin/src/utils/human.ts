/**
 * Human-like delays and behavior patterns to avoid bot detection.
 */

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
 */
export async function humanType(
  page: import("patchright").Page,
  selector: string,
  text: string
): Promise<void> {
  const element = page.locator(selector);
  await element.click();
  for (const char of text) {
    await element.pressSequentially(char, {
      delay: Math.floor(Math.random() * 100) + 30,
    });
  }
}
