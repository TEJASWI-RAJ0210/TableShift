import { describe, it, expect } from "vitest";
import { parseJson } from "@/lib/parsers/jsonParser";

describe("parseJson", () => {
  it("parses a basic JSON array", () => {
    const input = JSON.stringify([
      { id: 1, name: "Asha", active: true },
      { id: 2, name: "Rohit", active: false },
    ]);
    const { model, error } = parseJson(input);
    expect(error).toBeUndefined();
    expect(model.rows).toHaveLength(2);
    expect(model.columns.map((c) => c.name)).toEqual(["id", "name", "active"]);
  });

  it("treats a single object as one row", () => {
    const input = JSON.stringify({ id: 1, name: "Asha" });
    const { model, error } = parseJson(input);
    expect(error).toBeUndefined();
    expect(model.rows).toHaveLength(1);
  });

  it("returns error for invalid JSON", () => {
    const { error } = parseJson("{ not valid json }");
    expect(error).toBeDefined();
    expect(error).toContain("Invalid JSON");
  });

  it("returns error for a primitive (not object/array)", () => {
    const { error } = parseJson('"just a string"');
    expect(error).toBeDefined();
  });

  it("returns error for an empty array", () => {
    const { error } = parseJson("[]");
    expect(error).toBeDefined();
    expect(error).toContain("empty");
  });

  it("handles null values in objects", () => {
    const input = JSON.stringify([{ id: 1, email: null }]);
    const { model } = parseJson(input);
    expect(model.rows[0]["email"]).toBeNull();
    const emailCol = model.columns.find((c) => c.name === "email");
    expect(emailCol?.nullable).toBe(true);
  });

  it("handles inconsistent schemas — merges all keys", () => {
    const input = JSON.stringify([
      { id: 1, name: "Asha", email: "asha@example.com" },
      { id: 2, name: "Rohit" }, // missing email
    ]);
    const { model } = parseJson(input);
    const keys = model.columns.map((c) => c.name);
    expect(keys).toContain("email");
    expect(model.rows[1]["email"]).toBeNull();
  });

  it("stringifies nested objects into TEXT column", () => {
    const input = JSON.stringify([
      { id: 1, meta: { role: "admin", level: 2 } },
    ]);
    const { model } = parseJson(input);
    const metaCol = model.columns.find((c) => c.name === "meta");
    expect(metaCol?.type).toBe("TEXT");
    expect(model.rows[0]["meta"]).toBe(JSON.stringify({ role: "admin", level: 2 }));
  });

  it("stringifies nested arrays into TEXT column", () => {
    const input = JSON.stringify([{ id: 1, tags: ["a", "b", "c"] }]);
    const { model } = parseJson(input);
    expect(model.rows[0]["tags"]).toBe('["a","b","c"]');
  });

  it("infers correct types from JSON native types", () => {
    const input = JSON.stringify([
      { id: 1, score: 98.5, active: true, joined: "2024-01-12" },
    ]);
    const { model } = parseJson(input);
    expect(model.columns.find((c) => c.name === "id")?.type).toBe("INTEGER");
    expect(model.columns.find((c) => c.name === "score")?.type).toBe("DECIMAL");
    expect(model.columns.find((c) => c.name === "active")?.type).toBe("BOOLEAN");
    expect(model.columns.find((c) => c.name === "joined")?.type).toBe("DATE");
  });
});