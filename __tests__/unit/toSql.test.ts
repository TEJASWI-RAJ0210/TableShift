import { describe, it, expect } from "vitest";
import { generateSql, generateCreateTable, generateInserts } from "@/lib/generators/toSql";
import { DataModel } from "@/lib/types";

const basicModel: DataModel = {
  columns: [
    { name: "id", type: "INTEGER", nullable: false },
    { name: "name", type: "VARCHAR", length: 64, nullable: false },
    { name: "score", type: "DECIMAL", nullable: true },
    { name: "active", type: "BOOLEAN", nullable: false },
    { name: "joined", type: "DATE", nullable: false },
  ],
  rows: [
    { id: "1", name: "Asha", score: "98.5", active: "true", joined: "2024-01-12" },
    { id: "2", name: "Rohit", score: null, active: "false", joined: "2024-02-03" },
  ],
};

describe("generateCreateTable", () => {
  it("generates correct MySQL CREATE TABLE", () => {
    const sql = generateCreateTable(basicModel, "users", "mysql");
    expect(sql).toContain("CREATE TABLE `users`");
    expect(sql).toContain("`id` INT NOT NULL");
    expect(sql).toContain("`name` VARCHAR(64) NOT NULL");
    expect(sql).toContain("`score` DECIMAL(10,2)");
    expect(sql).toContain("`active` TINYINT(1) NOT NULL");
    expect(sql).toContain("`joined` DATE NOT NULL");
    // nullable column should NOT have NOT NULL
    expect(sql).not.toMatch(/`score`.*NOT NULL/);
  });

  it("generates correct PostgreSQL CREATE TABLE", () => {
    const sql = generateCreateTable(basicModel, "users", "postgres");
    expect(sql).toContain('CREATE TABLE "users"');
    expect(sql).toContain('"id" INTEGER NOT NULL');
    expect(sql).toContain('"active" BOOLEAN NOT NULL');
    expect(sql).toContain('"joined" DATE NOT NULL');
    expect(sql).toContain('"score" NUMERIC(10,2)');
  });

  it("generates correct SQLite CREATE TABLE", () => {
    const sql = generateCreateTable(basicModel, "users", "sqlite");
    expect(sql).toContain('CREATE TABLE "users"');
    expect(sql).toContain('"id" INTEGER NOT NULL');
    expect(sql).toContain('"score" REAL'); // DECIMAL → REAL in SQLite
    expect(sql).toContain('"active" INTEGER NOT NULL'); // BOOLEAN → INTEGER
  });
});

describe("generateInserts", () => {
  it("generates INSERT statements for each row", () => {
    const sql = generateInserts(basicModel, "users", "mysql");
    const lines = sql.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^INSERT INTO `users`/);
  });

  it("outputs NULL for null values", () => {
    const sql = generateInserts(basicModel, "users", "mysql");
    expect(sql).toContain("NULL");
  });

  it("outputs 1 for true boolean", () => {
    const sql = generateInserts(basicModel, "users", "mysql");
    expect(sql).toContain(", 1,");
  });

  it("outputs 0 for false boolean", () => {
    const sql = generateInserts(basicModel, "users", "mysql");
    expect(sql).toContain(", 0,");
  });

  it("escapes single quotes in string values", () => {
    const model: DataModel = {
      columns: [{ name: "name", type: "VARCHAR", length: 128, nullable: false }],
      rows: [{ name: "O'Brien" }],
    };
    const sql = generateInserts(model, "test", "mysql");
    expect(sql).toContain("O''Brien");
  });

  it("returns empty string for empty rows", () => {
    const model: DataModel = { columns: basicModel.columns, rows: [] };
    expect(generateInserts(model, "users", "mysql")).toBe("");
  });
});

describe("generateSql", () => {
  it("combines CREATE TABLE and INSERTs with blank line separator", () => {
    const sql = generateSql(basicModel, "users", "mysql");
    expect(sql).toContain("CREATE TABLE");
    expect(sql).toContain("INSERT INTO");
    const parts = sql.split("\n\n");
    expect(parts).toHaveLength(2);
  });

  it("returns only CREATE TABLE when no rows", () => {
    const model: DataModel = { columns: basicModel.columns, rows: [] };
    const sql = generateSql(model, "users", "mysql");
    expect(sql).toContain("CREATE TABLE");
    expect(sql).not.toContain("INSERT");
  });
});