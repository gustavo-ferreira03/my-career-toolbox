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
 * Accepts either a selector string (legacy) or a Locator object.
 */
export async function humanType(
  pageOrLocator: import("patchright").Page | import("patchright").Locator,
  selectorOrText: string,
  text?: string,
  delayMinMs?: number,
  delayMaxMs?: number
): Promise<void> {
  // Handle overloaded signatures: humanType(page, selector, text) or humanType(locator, text)
  let element: import("patchright").Locator;

  if (text === undefined) {
    // Signature: humanType(locator, text, delayMinMs?, delayMaxMs?)
    // pageOrLocator is a Locator, selectorOrText is the text
    element = pageOrLocator as import("patchright").Locator;
    text = selectorOrText;
  } else {
    // Signature: humanType(page, selector, text, delayMinMs?, delayMaxMs?)
    // pageOrLocator is a Page, selectorOrText is the selector
    const page = pageOrLocator as import("patchright").Page;
    element = page.locator(selectorOrText);
  }

  const minDelay = delayMinMs ?? 30;
  const maxDelay = delayMaxMs ?? 100;

  for (const char of text) {
    await element.pressSequentially(char, {
      delay: Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay,
    });
  }
}
