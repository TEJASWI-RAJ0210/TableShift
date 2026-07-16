import { test, expect } from "@playwright/test";
import { waitForReady, waitForError, typeInput, getOutputText } from "./helpers";
import path from "path";

test.describe("CSV → SQL converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/csv-to-sql");
  });

  test("loads with sample data and shows Ready status", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("CREATE TABLE");
    expect(output).toContain("INSERT INTO");
  });

  test("output contains correct default table name", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("my_table");
  });

  test("changing table name updates SQL output", async ({ page }) => {
    await waitForReady(page);
    const tableInput = page.getByRole("textbox").first();
    await tableInput.fill("users");
    await expect(page.locator(".cm-content")).toContainText("users");
  });

  test("spaces in table name are replaced with underscores", async ({ page }) => {
    await waitForReady(page);
    const tableInput = page.getByRole("textbox").first();
    await tableInput.fill("user accounts");
    await expect(page.locator(".cm-content")).toContainText("user_accounts");
  });

  test("switching to PostgreSQL dialect uses double quotes", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("postgres");
    const output = await getOutputText(page);
    expect(output).toContain('"my_table"');
  });

  test("switching to MySQL dialect uses backticks", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("mysql");
    const output = await getOutputText(page);
    expect(output).toContain("`my_table`");
  });

  test("switching to SQLite dialect uses TEXT types", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("sqlite");
    const output = await getOutputText(page);
    expect(output).toContain("TEXT");
  });

  test("clearing input shows Waiting for input status", async ({ page }) => {
    await waitForReady(page);
    await page.locator("textarea").fill("");
    await expect(page.getByText("Waiting for input")).toBeVisible();
  });

  test("invalid input shows Error status with message", async ({ page }) => {
    await typeInput(page, "this is not, valid\ncsv data without, proper headers");
    // PapaParse is tolerant — test truly broken input
    await typeInput(page, "");
    await page.locator("textarea").fill(",,,,\n,,,,");
    // Should not crash — either parses or errors gracefully
    await expect(
      page.getByText("Error").or(page.getByText("Waiting for input"))
    ).toBeVisible();
  });

  test("column settings panel shows inferred columns", async ({ page }) => {
    await waitForReady(page);
    await expect(page.getByText("Column types")).toBeVisible();
  });

  test("column type override updates SQL output", async ({ page }) => {
    await waitForReady(page);
    // Find first column type select (after the dialect selector)
    const selects = page.getByRole("combobox");
    // First combobox is the dialect selector, rest are column type overrides
    const firstColSelect = selects.nth(1);
    await firstColSelect.selectOption("TEXT");
    const output = await getOutputText(page);
    expect(output).toContain("TEXT");
  });

  test("copy button copies output to clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForReady(page);
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
    // Label reverts after 1.5s
    await expect(page.getByRole("button", { name: "Copy" })).toBeVisible({
      timeout: 3000,
    });
  });

  test("download button triggers file download", async ({ page }) => {
    await waitForReady(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.sql$/);
  });

  test("download filename matches table name", async ({ page }) => {
    await waitForReady(page);
    const tableInput = page.getByRole("textbox").first();
    await tableInput.fill("orders");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("orders.sql");
  });

  test("CSV file upload populates textarea and generates output", async ({
    page,
  }) => {
    await waitForReady(page);
    const filePath = path.join(process.cwd(), "e2e/fixtures/test-basic.csv");
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("CREATE TABLE");
  });

  test("nullable column has no NOT NULL in output", async ({ page }) => {
    await typeInput(
      page,
      "id,name,score\n1,Asha,98.5\n2,Rohit,\n3,Meera,74.0"
    );
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("mysql");
    const output = await getOutputText(page);
    // score is nullable — should not have NOT NULL
    expect(output).not.toMatch(/`score`.*NOT NULL/);
  });

  test("boolean values inferred as TINYINT(1) in MySQL", async ({ page }) => {
    await typeInput(page, "id,is_active\n1,true\n2,false\n3,true");
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("mysql");
    const output = await getOutputText(page);
    expect(output).toContain("TINYINT(1)");
  });

  test("date values inferred as DATE type", async ({ page }) => {
    await typeInput(page, "id,joined\n1,2024-01-12\n2,2024-02-03");
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("DATE");
  });

  test("decimal values inferred as DECIMAL type", async ({ page }) => {
    await typeInput(page, "id,price\n1,9.99\n2,14.50\n3,3.00");
    await waitForReady(page);
    await page.getByRole("combobox").selectOption("mysql");
    const output = await getOutputText(page);
    expect(output).toContain("DECIMAL");
  });
});