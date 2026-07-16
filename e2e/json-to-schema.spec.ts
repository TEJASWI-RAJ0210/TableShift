import { test, expect } from "@playwright/test";
import { waitForReady, waitForError, typeInput, getOutputText } from "./helpers";

test.describe("JSON → Schema converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/json-to-schema");
  });

  test("loads with sample JSON and shows Ready status", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(output).toContain("$schema");
  });

  test("output is valid JSON", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  test("JSON Schema output contains correct $schema URL", async ({ page }) => {
    await waitForReady(page);
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(parsed.$schema).toContain("json-schema.org");
  });

  test("schema title matches schema name input", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("textbox").first().fill("Order");
    await expect(async () => {
      const output = await getOutputText(page);
      const parsed = JSON.parse(output);
      expect(parsed.title).toBe("Order");
    }).toPass({ timeout: 3000 });
  });

  test("non-nullable columns appear in required array", async ({ page }) => {
    await typeInput(page, JSON.stringify([{ id: 1, name: "Asha" }]));
    await waitForReady(page);
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(parsed.required).toContain("id");
    expect(parsed.required).toContain("name");
  });

  test("nullable columns use oneOf with null in JSON Schema mode", async ({
    page,
  }) => {
    await typeInput(
      page,
      JSON.stringify([{ id: 1, email: null }, { id: 2, email: "a@b.com" }])
    );
    await waitForReady(page);
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    const emailProp = parsed.properties.email;
    const types = emailProp.oneOf.map((o: { type: string }) => o.type);
    expect(types).toContain("null");
  });

  test("mode toggle switches to OpenAPI output", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("button", { name: /OpenAPI/i }).click();
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(parsed.components).toBeDefined();
    expect(parsed.components.schemas).toBeDefined();
  });

  test("OpenAPI mode uses nullable: true instead of oneOf", async ({ page }) => {
    await typeInput(
      page,
      JSON.stringify([{ id: 1, email: null }, { id: 2, email: "a@b.com" }])
    );
    await waitForReady(page);
    await page.getByRole("button", { name: /OpenAPI/i }).click();
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    const schemaName = Object.keys(parsed.components.schemas)[0];
    const emailProp = parsed.components.schemas[schemaName].properties.email;
    expect(emailProp.nullable).toBe(true);
    expect(emailProp.oneOf).toBeUndefined();
  });

  test("switching back to JSON Schema mode works", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("button", { name: /OpenAPI/i }).click();
    await page.getByRole("button", { name: /JSON Schema/i }).click();
    const output = await getOutputText(page);
    const parsed = JSON.parse(output);
    expect(parsed.$schema).toBeDefined();
  });

  test("invalid JSON shows Error status", async ({ page }) => {
    await typeInput(page, "not valid json at all");
    await waitForError(page);
  });

  test("download in JSON Schema mode saves as .json", async ({ page }) => {
    await waitForReady(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test("download in OpenAPI mode saves as .openapi.json", async ({ page }) => {
    await waitForReady(page);
    await page.getByRole("button", { name: /OpenAPI/i }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.openapi\.json$/);
  });
});