import { Page, expect } from "@playwright/test";

export async function waitForReady(page: Page) {
  await expect(page.getByText("Ready")).toBeVisible({ timeout: 5000 });
}

export async function waitForError(page: Page) {
  await expect(page.getByText("Error")).toBeVisible({ timeout: 5000 });
}

export async function clearInput(page: Page) {
  const textarea = page.locator("textarea");
  await textarea.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
}

export async function typeInput(page: Page, text: string) {
  const textarea = page.locator("textarea");
  await textarea.fill(text);
}

export async function getOutputText(page: Page): Promise<string> {
  return page.locator(".cm-content").innerText();
}

export async function enableDarkMode(page: Page) {
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
}