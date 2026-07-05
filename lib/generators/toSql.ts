import { ColumnDef, DataModel, InferredType, SqlDialect } from "@/lib/types";

const QUOTE: Record<SqlDialect, string> = {
  mysql: "`",
  postgres: '"',
  sqlite: '"',
};

function quoteIdent(name: string, dialect: SqlDialect): string {
  const q = QUOTE[dialect];
  return `${q}${name.replace(/"/g, '""')}${q}`;
}

function sqlType(col: ColumnDef, dialect: SqlDialect): string {
  const map: Record<SqlDialect, Record<InferredType, string>> = {
    mysql: {
      INTEGER: "INT",
      DECIMAL: "DECIMAL(10,2)",
      BOOLEAN: "TINYINT(1)",
      DATE: "DATE",
      DATETIME: "DATETIME",
      VARCHAR: `VARCHAR(${col.length ?? 255})`,
      TEXT: "TEXT",
    },
    postgres: {
      INTEGER: "INTEGER",
      DECIMAL: "NUMERIC(10,2)",
      BOOLEAN: "BOOLEAN",
      DATE: "DATE",
      DATETIME: "TIMESTAMP",
      VARCHAR: `VARCHAR(${col.length ?? 255})`,
      TEXT: "TEXT",
    },
    sqlite: {
      INTEGER: "INTEGER",
      DECIMAL: "REAL",
      BOOLEAN: "INTEGER",
      DATE: "TEXT",
      DATETIME: "TEXT",
      VARCHAR: "TEXT",
      TEXT: "TEXT",
    },
  };
  return map[dialect][col.type];
}

function sqlLiteral(value: string | null, type: InferredType): string {
  if (value === null) return "NULL";
  if (type === "INTEGER" || type === "DECIMAL") return value;
  if (type === "BOOLEAN") {
    const v = value.toLowerCase();
    return v === "true" || v === "yes" || v === "1" || v === "y" ? "1" : "0";
  }
  return `'${value.replace(/'/g, "''")}'`;
}

export function generateCreateTable(
  model: DataModel,
  tableName: string,
  dialect: SqlDialect
): string {
  const lines = model.columns.map((col) => {
    const ident = quoteIdent(col.name, dialect);
    const type = sqlType(col, dialect);
    const nullClause = col.nullable ? "" : " NOT NULL";
    return `  ${ident} ${type}${nullClause}`;
  });

  return `CREATE TABLE ${quoteIdent(tableName, dialect)} (\n${lines.join(",\n")}\n);`;
}

export function generateInserts(
  model: DataModel,
  tableName: string,
  dialect: SqlDialect
): string {
  if (model.rows.length === 0) return "";
  const colNames = model.columns.map((c) => quoteIdent(c.name, dialect)).join(", ");

  const statements = model.rows.map((row) => {
    const values = model.columns
      .map((col) => sqlLiteral(row[col.name], col.type))
      .join(", ");
    return `INSERT INTO ${quoteIdent(tableName, dialect)} (${colNames}) VALUES (${values});`;
  });

  return statements.join("\n");
}

export function generateSql(
  model: DataModel,
  tableName: string,
  dialect: SqlDialect
): string {
  const create = generateCreateTable(model, tableName, dialect);
  const inserts = generateInserts(model, tableName, dialect);
  return inserts ? `${create}\n\n${inserts}` : create;
}