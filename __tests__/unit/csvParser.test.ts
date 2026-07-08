import { describe, it, expect } from "vitest";
import { parseCsv } from "@/lib/parsers/csvParser";

describe("parseCsv", () => {
  it("parses a basic CSV correctly", () => {
    const input = `id,name,email\n1,Asha,asha@example.com\n2,Rohit,rohit@example.com`;
    const { model, errors } = parseCsv(input);
    expect(errors).toHaveLength(0);
    expect(model.rows).toHaveLength(2);
    expect(model.columns.map((c) => c.name)).toEqual(["id", "name", "email"]);
  });

  it("trims whitespace from column names", () => {
    const input = ` id , name , email \n1,Asha,asha@example.com`;
    const { model } = parseCsv(input);
    expect(model.columns.map((c) => c.name)).toEqual(["id", "name", "email"]);
  });

  it("handles quoted values containing commas", () => {
    const input = `id,bio\n1,"Engineer, loves hiking"`;
    const { model } = parseCsv(input);
    expect(model.rows[0]["bio"]).toBe("Engineer, loves hiking");
  });

  it("handles quoted values containing double quotes", () => {
    const input = `id,quote\n1,"Says: ""hello world"""`;
    const { model } = parseCsv(input);
    expect(model.rows[0]["quote"]).toBe(`Says: "hello world"`);
  });

  it("converts empty cells to null", () => {
    const input = `id,name,email\n1,,asha@example.com`;
    const { model } = parseCsv(input);
    expect(model.rows[0]["name"]).toBeNull();
  });

  it("correctly marks nullable column when some cells are empty", () => {
    const input = `id,score\n1,98.5\n2,\n3,74.0`;
    const { model } = parseCsv(input);
    const scoreCol = model.columns.find((c) => c.name === "score");
    expect(scoreCol?.nullable).toBe(true);
  });

  it("correctly marks non-nullable column when no cells are empty", () => {
    const input = `id,score\n1,98.5\n2,74.0`;
    const { model } = parseCsv(input);
    const scoreCol = model.columns.find((c) => c.name === "score");
    expect(scoreCol?.nullable).toBe(false);
  });

  it("handles unicode characters in values", () => {
    const input = `id,name\n1,李明\n2,José`;
    const { model } = parseCsv(input);
    expect(model.rows[0]["name"]).toBe("李明");
    expect(model.rows[1]["name"]).toBe("José");
  });

  it("returns empty model for empty string", () => {
    const { model } = parseCsv("");
    expect(model.rows).toHaveLength(0);
    expect(model.columns).toHaveLength(0);
  });

  it("skips empty lines", () => {
    const input = `id,name\n1,Asha\n\n2,Rohit\n`;
    const { model } = parseCsv(input);
    expect(model.rows).toHaveLength(2);
  });
});