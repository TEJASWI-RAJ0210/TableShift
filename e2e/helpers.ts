import { Page, expect } from "@playwright/test";

/** Waits for the StatusPill to show "Ready" text */
export async function waitForReady(page: Page) {
  await expect(page.getByText("Ready")).toBeVisible({ timeout: 5000 });
}

/** Waits for the StatusPill to show "Error" text */
export async function waitForError(page: Page) {
  await expect(page.getByText("Error")).toBeVisible({ timeout: 5000 });
}

/** Clears the input textarea completely */
export async function clearInput(page: Page) {
  const textarea = page.locator("textarea");
  await textarea.click();
  await textarea.selectAll?.();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
}

/** Types into the input textarea (clears first) */
export async function typeInput(page: Page, text: string) {
  await clearInput(page);
  const textarea = page.locator("textarea");
  await textarea.fill(text);
}

/** Returns the full text content of the CodeMirror output panel */
export async function getOutputText(page: Page): Promise<string> {
  return page.locator(".cm-content").innerText();
}

/** Enables dark mode via the toggle button */
export async function enableDarkMode(page: Page) {
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
}