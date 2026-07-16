import { test, expect } from "@playwright/test";
import { waitForReady, waitForError, typeInput, getOutputText } from "./helpers";

test.describe("JSON → SQL converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/json-to-sql");
  });

  test("loads with sample JSON and shows Ready status", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("CREATE TABLE");
  });

  test("single JSON object treated as one row", async ({ page }) => {
    await typeInput(page, '{ "id": 1, "name": "Asha" }');
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("INSERT INTO");
  });

  test("invalid JSON shows Error status", async ({ page }) => {
    await typeInput(page, "{ not valid json }");
    await waitForError(page);
    await expect(page.getByText(/invalid json/i)).toBeVisible();
  });

  test("empty array shows error message", async ({ page }) => {
    await typeInput(page, "[]");
    await waitForError(page);
    await expect(page.getByText(/empty/i)).toBeVisible();
  });

  test("inconsistent schemas handled — missing keys become NULL", async ({
    page,
  }) => {
    await typeInput(
      page,
      JSON.stringify([
        { id: 1, name: "Asha", email: "asha@example.com" },
        { id: 2, name: "Rohit" },
      ])
    );
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("email");
    expect(output).toContain("NULL");
  });

  test("nested objects stringified into TEXT column", async ({ page }) => {
    await typeInput(
      page,
      JSON.stringify([{ id: 1, meta: { role: "admin" } }])
    );
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("TEXT");
  });

  test("dialect switcher works same as CSV→SQL", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("postgres");
    const output = await getOutputText(page);
    expect(output).toContain('"my_table"');
  });

  test("table name change updates output", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("textbox").first().fill("events");
    await expect(page.locator(".cm-content")).toContainText("events");
  });

  test("download saves as .sql file", async ({ page }) => {
    await waitForReady(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.sql$/);
  });

  test("JSON file upload works", async ({ page }) => {
    const filePath = `${process.cwd()}/e2e/fixtures/test-basic.json`;
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("CREATE TABLE");
  });
});