import { describe, it, expect } from "vitest";
import { generateJson } from "@/lib/generators/toJson";
import { DataModel } from "@/lib/types";

const model: DataModel = {
  columns: [
    { name: "id", type: "INTEGER", nullable: false },
    { name: "name", type: "VARCHAR", length: 64, nullable: false },
    { name: "score", type: "DECIMAL", nullable: true },
    { name: "active", type: "BOOLEAN", nullable: false },
  ],
  rows: [
    { id: "1", name: "Asha", score: "98.5", active: "true" },
    { id: "2", name: "Rohit", score: null, active: "false" },
  ],
};

describe("generateJson", () => {
  it("outputs valid JSON", () => {
    const output = generateJson(model);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it("coerces INTEGER columns to JS numbers", () => {
    const parsed = JSON.parse(generateJson(model));
    expect(typeof parsed[0].id).toBe("number");
    expect(parsed[0].id).toBe(1);
  });

  it("coerces DECIMAL columns to JS numbers", () => {
    const parsed = JSON.parse(generateJson(model));
    expect(typeof parsed[0].score).toBe("number");
    expect(parsed[0].score).toBe(98.5);
  });

  it("coerces BOOLEAN true correctly", () => {
    const parsed = JSON.parse(generateJson(model));
    expect(parsed[0].active).toBe(true);
  });

  it("coerces BOOLEAN false correctly", () => {
    const parsed = JSON.parse(generateJson(model));
    expect(parsed[1].active).toBe(false);
  });

  it("outputs null for null values", () => {
    const parsed = JSON.parse(generateJson(model));
    expect(parsed[1].score).toBeNull();
  });

  it("keeps VARCHAR as string", () => {
    const parsed = JSON.parse(generateJson(model));
    expect(typeof parsed[0].name).toBe("string");
  });

  it("returns empty array string for empty rows", () => {
    const empty: DataModel = { columns: model.columns, rows: [] };
    expect(generateJson(empty)).toBe("[]");
  });

  it("pretty prints with 2 space indent", () => {
    const output = generateJson(model);
    expect(output).toContain("  ");
  });
});