import { test, expect } from "@playwright/test";
import { enableDarkMode } from "./helpers";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero heading and description", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Move data between formats/i })
    ).toBeVisible();
    await expect(page.getByText(/no login, no upload, no waiting/i)).toBeVisible();
  });

  test("CTA button navigates to CSV→SQL page", async ({ page }) => {
    await page.getByRole("link", { name: /Try CSV to SQL/i }).click();
    await expect(page).toHaveURL("/csv-to-sql");
  });

  test("renders all four converter cards", async ({ page }) => {
    await expect(page.getByText("CSV to SQL")).toBeVisible();
    await expect(page.getByText("CSV to JSON")).toBeVisible();
    await expect(page.getByText("JSON to SQL")).toBeVisible();
    await expect(page.getByText("JSON to Schema")).toBeVisible();
  });

  test("shows Soon badge on non-live converters", async ({ page }) => {
    const badges = page.getByText("Soon");
    await expect(badges).toHaveCount(3);
  });

  test("header nav links are present", async ({ page }) => {
    await expect(page.getByRole("link", { name: "CSV → SQL" })).toBeVisible();
    await expect(page.getByRole("link", { name: "CSV → JSON" })).toBeVisible();
    await expect(page.getByRole("link", { name: "JSON → SQL" })).toBeVisible();
    await expect(page.getByRole("link", { name: "JSON → Schema" })).toBeVisible();
  });

  test("logo links back to homepage", async ({ page }) => {
    await page.goto("/csv-to-sql");
    await page.getByRole("link", { name: /TableShift/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("footer renders privacy note", async ({ page }) => {
    await expect(
      page.getByText(/every conversion runs in your browser/i)
    ).toBeVisible();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
    await enableDarkMode(page);
    await expect(html).toHaveClass(/dark/);
  });

  test("dark mode preference persists after reload", async ({ page }) => {
    await enableDarkMode(page);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("no flash of wrong theme on load after dark mode set", async ({ page }) => {
    await enableDarkMode(page);
    // Navigate away and back — html.dark should be set before any paint
    await page.goto("/csv-to-sql");
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});