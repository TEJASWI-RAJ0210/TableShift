import { describe, it, expect } from "vitest";
import { inferColumnType, inferColumns } from "@/lib/inference/typeInference";

describe("inferColumnType", () => {
  it("detects INTEGER columns", () => {
    const result = inferColumnType(["1", "2", "3", "42"]);
    expect(result.type).toBe("INTEGER");
    expect(result.nullable).toBe(false);
  });

  it("detects DECIMAL columns", () => {
    const result = inferColumnType(["1.5", "2.0", "98.75"]);
    expect(result.type).toBe("DECIMAL");
  });

  it("upgrades INTEGER to DECIMAL when mixed", () => {
    const result = inferColumnType(["1", "2", "3.5"]);
    expect(result.type).toBe("DECIMAL");
  });

  it("detects BOOLEAN columns", () => {
    const result = inferColumnType(["true", "false", "true"]);
    expect(result.type).toBe("BOOLEAN");
  });

  it("detects BOOLEAN with yes/no values", () => {
    const result = inferColumnType(["yes", "no", "yes"]);
    expect(result.type).toBe("BOOLEAN");
  });

  it("detects DATE columns", () => {
    const result = inferColumnType(["2024-01-12", "2024-02-03", "2024-03-21"]);
    expect(result.type).toBe("DATE");
  });

  it("detects DATETIME columns", () => {
    const result = inferColumnType([
      "2024-01-12 09:30:00",
      "2024-02-03 14:22:10",
    ]);
    expect(result.type).toBe("DATETIME");
  });

  it("detects VARCHAR for short strings", () => {
    const result = inferColumnType(["Asha", "Rohit", "Meera"]);
    expect(result.type).toBe("VARCHAR");
  });

  it("detects TEXT for long strings", () => {
    const longString = "a".repeat(201);
    const result = inferColumnType([longString]);
    expect(result.type).toBe("TEXT");
  });

  it("marks nullable when empty values present", () => {
    const result = inferColumnType(["1", null, "3"]);
    expect(result.nullable).toBe(true);
  });

  it("marks non-nullable when no empty values", () => {
    const result = inferColumnType(["1", "2", "3"]);
    expect(result.nullable).toBe(false);
  });

  it("falls back to VARCHAR on mixed ambiguous values", () => {
    // Less than 90% agreement — should fall back
    const result = inferColumnType(["1", "2", "hello", "world", "5", "6", "7", "8", "9", "10"]);
    expect(result.type).toBe("VARCHAR");
  });

  it("returns VARCHAR with sensible length boundaries", () => {
    const result = inferColumnType(["hello"]); // 5 chars → rounds to 32
    expect(result.type).toBe("VARCHAR");
    expect(result.length).toBe(32);
  });

  it("handles all-null column", () => {
    const result = inferColumnType([null, null, null]);
    expect(result.type).toBe("VARCHAR");
    expect(result.nullable).toBe(true);
  });
});

describe("inferColumns", () => {
  it("builds correct column definitions from rows", () => {
    const rows = [
      { id: "1", name: "Asha", is_active: "true", score: "98.5" },
      { id: "2", name: "Rohit", is_active: "false", score: "74.0" },
    ];
    const cols = inferColumns(rows);
    expect(cols.find((c) => c.name === "id")?.type).toBe("INTEGER");
    expect(cols.find((c) => c.name === "name")?.type).toBe("VARCHAR");
    expect(cols.find((c) => c.name === "is_active")?.type).toBe("BOOLEAN");
    expect(cols.find((c) => c.name === "score")?.type).toBe("DECIMAL");
  });

  it("returns empty array for empty rows", () => {
    expect(inferColumns([])).toEqual([]);
  });

  it("includes a sample value for each column", () => {
    const rows = [{ id: "1", name: "Asha" }];
    const cols = inferColumns(rows);
    expect(cols.find((c) => c.name === "id")?.sample).toBe("1");
    expect(cols.find((c) => c.name === "name")?.sample).toBe("Asha");
  });
});