import { test, expect } from "@playwright/test";
import { waitForReady, typeInput, getOutputText } from "./helpers";

test.describe("CSV → JSON converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/csv-to-json");
  });

  test("loads with sample data and shows Ready status", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("[");
    expect(output).toContain("]");
  });

  test("output is valid JSON", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  test("integers are coerced to JSON numbers not strings", async ({ page }) => {
    await typeInput(page, "id,name\n1,Asha\n2,Rohit");
    await waitForReady(page);
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(typeof parsed[0].id).toBe("number");
  });

  test("booleans are coerced to JSON booleans", async ({ page }) => {
    await typeInput(page, "id,active\n1,true\n2,false");
    await waitForReady(page);
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(parsed[0].active).toBe(true);
    expect(parsed[1].active).toBe(false);
  });

  test("empty cells become null in JSON output", async ({ page }) => {
    await typeInput(page, "id,email\n1,\n2,rohit@example.com");
    await waitForReady(page);
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(parsed[0].email).toBeNull();
  });

  test("column type override affects coercion", async ({ page }) => {
    await typeInput(page, "id,score\n1,98\n2,74");
    await waitForReady(page);
    // Force score to VARCHAR — values should become strings
    const selects = page.getByRole("combobox");
    await selects.nth(1).selectOption("VARCHAR");
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(typeof parsed[0].score).toBe("string");
  });

  test("download saves as .json file", async ({ page }) => {
    await waitForReady(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test("copy button works", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForReady(page);
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  });
});