import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

// Playwright exposes no getter for the current cursor position, so every
// humanized mouse move tracks the last position this module moved the mouse
// to (per page). The browser's real cursor starts at (0, 0), which matches the
// fallback used here.
const lastMousePosition = new WeakMap<Page, { x: number; y: number }>();

function readMousePosition(page: Page): { x: number; y: number } {
  return lastMousePosition.get(page) ?? { x: 0, y: 0 };
}

function writeMousePosition(page: Page, x: number, y: number): void {
  lastMousePosition.set(page, { x, y });
}

/**
 * Returns a random integer between `min` and `max`, both inclusive.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pauses the run for a natural, human-like random delay in milliseconds.
 */
export async function humanPause(page: Page, minMs = 300, maxMs = 800): Promise<void> {
  await page.waitForTimeout(randomInt(minMs, maxMs));
}

/**
 * Moves the mouse to an absolute page coordinate in several small steps,
 * mimicking how a real user drags the cursor across the screen.
 */
export async function humanMoveTo(page: Page, x: number, y: number): Promise<void> {
  await page.mouse.move(x, y, { steps: randomInt(8, 20) });
  writeMousePosition(page, x, y);
  await humanPause(page, 100, 300);
}

/**
 * Hovers a locator by moving the cursor in a slightly jittered arc from the
 * current position to the center of the element, then resting briefly.
 */
export async function humanHover(locator: Locator): Promise<void> {
  const box = await locator.boundingBox();
  if (box === null) {
    throw new Error('humanHover: locator has no bounding box; element may be off-screen.');
  }
  const page = locator.page();
  const start = readMousePosition(page);
  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;
  const waypoints = randomInt(2, 3);
  for (let i = 1; i <= waypoints; i += 1) {
    const progress = i / (waypoints + 1);
    await page.mouse.move(
      start.x + (targetX - start.x) * progress + (Math.random() * 2 - 1) * 5,
      start.y + (targetY - start.y) * progress + (Math.random() * 2 - 1) * 5,
      { steps: randomInt(4, 8) },
    );
  }
  await page.mouse.move(targetX, targetY, { steps: randomInt(4, 8) });
  writeMousePosition(page, targetX, targetY);
  await humanPause(page, 150, 400);
}

/**
 * Clicks a locator humanized: hover first, then a plain click that waits for
 * the element to become actionable, followed by a short pause.
 */
export async function humanClick(locator: Locator): Promise<void> {
  await humanHover(locator);
  await locator.click({ timeout: Timeouts.RENDER });
  await humanPause(locator.page(), 150, 400);
}

/**
 * Types text into a locator one character at a time with a random per-character
 * delay and occasional "thinking" pauses, mimicking a real human typist. The
 * field is clicked first so the input receives keyboard focus.
 */
export async function humanType(locator: Locator, text: string): Promise<void> {
  const page = locator.page();
  await humanClick(locator);
  await humanPause(page, 200, 500);
  for (const char of text) {
    await page.keyboard.type(char, { delay: randomInt(50, 160) });
    if (Math.random() < 0.1) {
      await humanPause(page, 200, 500);
    }
  }
}

/**
 * Scrolls the page by `deltaY` pixels in small human-like wheel steps. The
 * pointer is first moved to the center of the viewport so the wheel event
 * targets the page itself.
 */
export async function humanScroll(page: Page, deltaY: number): Promise<void> {
  const viewport = page.viewportSize();
  const centerX = viewport !== null ? viewport.width / 2 : 0;
  const centerY = viewport !== null ? viewport.height / 2 : 0;
  await page.mouse.move(centerX, centerY, { steps: 5 });
  writeMousePosition(page, centerX, centerY);
  const direction = deltaY >= 0 ? 1 : -1;
  let remaining = Math.abs(deltaY);
  while (remaining > 0) {
    const step = Math.min(randomInt(120, 180), remaining);
    await page.mouse.wheel(0, direction * step);
    remaining -= step;
    await humanPause(page, 80, 200);
  }
}
