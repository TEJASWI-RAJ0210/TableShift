import { describe, it, expect } from "vitest";
import { generateJsonSchema, generateOpenApiSchema } from "@/lib/generators/toJsonSchema";
import { DataModel } from "@/lib/types";

const model: DataModel = {
  columns: [
    { name: "id", type: "INTEGER", nullable: false },
    { name: "name", type: "VARCHAR", length: 64, nullable: false },
    { name: "email", type: "VARCHAR", length: 128, nullable: true },
    { name: "score", type: "DECIMAL", nullable: false },
    { name: "active", type: "BOOLEAN", nullable: false },
    { name: "joined", type: "DATE", nullable: false },
    { name: "last_seen", type: "DATETIME", nullable: true },
  ],
  rows: [],
};

describe("generateJsonSchema", () => {
  it("outputs valid JSON", () => {
    expect(() => JSON.parse(generateJsonSchema(model, "User"))).not.toThrow();
  });

  it("includes correct $schema and title", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.$schema).toBe("http://json-schema.org/draft-07/schema#");
    expect(parsed.title).toBe("User");
  });

  it("sets root type to object", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.type).toBe("object");
  });

  it("maps INTEGER to type: integer", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.properties.id.type).toBe("integer");
  });

  it("maps DECIMAL to type: number", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.properties.score.type).toBe("number");
  });

  it("maps BOOLEAN to type: boolean", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.properties.active.type).toBe("boolean");
  });

  it("maps DATE with format: date", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.properties.joined.type).toBe("string");
    expect(parsed.properties.joined.format).toBe("date");
  });

  it("maps DATETIME with format: date-time", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    // last_seen is nullable so uses oneOf — check format is still present
    const prop = parsed.properties.last_seen;
    expect(prop.format).toBe("date-time");
  });

  it("puts non-nullable columns in required array", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    expect(parsed.required).toContain("id");
    expect(parsed.required).toContain("name");
    expect(parsed.required).not.toContain("email");
    expect(parsed.required).not.toContain("last_seen");
  });

  it("uses oneOf with null for nullable columns", () => {
    const parsed = JSON.parse(generateJsonSchema(model, "User"));
    const emailProp = parsed.properties.email;
    expect(emailProp.oneOf).toBeDefined();
    const types = emailProp.oneOf.map((o: { type: string }) => o.type);
    expect(types).toContain("null");
  });

  it("returns empty string for model with no columns", () => {
    const empty: DataModel = { columns: [], rows: [] };
    expect(generateJsonSchema(empty, "Empty")).toBe("");
  });
});

describe("generateOpenApiSchema", () => {
  it("outputs valid JSON", () => {
    expect(() => JSON.parse(generateOpenApiSchema(model, "User"))).not.toThrow();
  });

  it("nests schema under components.schemas.<title>", () => {
    const parsed = JSON.parse(generateOpenApiSchema(model, "User"));
    expect(parsed.components.schemas.User).toBeDefined();
    expect(parsed.components.schemas.User.type).toBe("object");
  });

  it("uses nullable: true instead of oneOf for nullable columns", () => {
    const parsed = JSON.parse(generateOpenApiSchema(model, "User"));
    const emailProp = parsed.components.schemas.User.properties.email;
    expect(emailProp.nullable).toBe(true);
    expect(emailProp.oneOf).toBeUndefined();
  });

  it("puts non-nullable columns in required array", () => {
    const parsed = JSON.parse(generateOpenApiSchema(model, "User"));
    const required = parsed.components.schemas.User.required;
    expect(required).toContain("id");
    expect(required).not.toContain("email");
  });

  it("maps DATE with format: date", () => {
    const parsed = JSON.parse(generateOpenApiSchema(model, "User"));
    expect(parsed.components.schemas.User.properties.joined.format).toBe("date");
  });
});