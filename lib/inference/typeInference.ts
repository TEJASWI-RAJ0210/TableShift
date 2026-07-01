import { ColumnDef, InferredType } from "../types";

const INT_RE = /^-?\d+$/;
const DECIMAL_RE = /^-?\d+\.\d+$/;
const BOOLEAN_VALUES = new Set([
    "true",
    "false",
    "yes",
    "no",
    "y",
    "n",
    "0",
    "1"
]);

// Common explicit date formats. Ambiguous DD/MM vs MM/DD is intentionally
// treated as DATE either way — the user can override per-column if wrong.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{2,4}$|^\d{1,2}-\d{1,2}-\d{2,4}$/;
const DATETIME_RE =
  /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/;

function classifyValue(raw: string): InferredType {
    const value = raw.trim();
    if (value === "") return "TEXT"; // empty treated as unknown, resolved by majority vote
    if (DATETIME_RE.test(value)) return "DATETIME";
    if (DATE_RE.test(value)) return "DATE";
    if (INT_RE.test(value)) return "INTEGER";
    if (DECIMAL_RE.test(value)) return "DECIMAL";
    if (BOOLEAN_VALUES.has(value.toLowerCase()) && value.length <= 5) return "BOOLEAN";
    return value.length > 200 ? "TEXT" : "VARCHAR";
}

/**
 * Infers a column's type by majority vote across non-empty sample values.
 * Falls back to VARCHAR if signals are mixed/ambiguous.
 */
export function inferColumnType(values: (string | null | undefined)[]): {
  type: InferredType;
  length?: number;
  nullable: boolean;
} {
  const nonEmpty = values.filter((v): v is string => v != null && v.trim() !== "");
  const nullable = nonEmpty.length < values.length;

  if (nonEmpty.length === 0) {
    return { type: "VARCHAR", length: 255, nullable: true };
  }

  const votes: Record<InferredType, number> = {
    INTEGER: 0,
    DECIMAL: 0,
    BOOLEAN: 0,
    DATE: 0,
    DATETIME: 0,
    VARCHAR: 0,
    TEXT: 0,
  };

  let maxLength = 0;
  for (const v of nonEmpty) {
    const t = classifyValue(v);
    votes[t]++;
    maxLength = Math.max(maxLength, v.length);
  }

  // Pick the type with the most votes; INTEGER/DECIMAL mixed -> DECIMAL wins
  // since an int column with one decimal value still needs DECIMAL storage.
  if (votes.DECIMAL > 0 && votes.INTEGER + votes.DECIMAL === nonEmpty.length) {
    return { type: "DECIMAL", nullable };
  }

  let best: InferredType = "VARCHAR";
  let bestCount = -1;
  (Object.keys(votes) as InferredType[]).forEach((t) => {
    if (votes[t] > bestCount) {
      best = t;
      bestCount = votes[t];
    }
  });

  // Require near-unanimous agreement for non-VARCHAR types; otherwise
  // mixed-content columns safely fall back to VARCHAR/TEXT.
  const confidence = bestCount / nonEmpty.length;
  if (best !== "VARCHAR" && best !== "TEXT" && confidence < 0.9) {
    best = maxLength > 200 ? "TEXT" : "VARCHAR";
  }

  if (best === "VARCHAR") {
    // Round suggested length up to a clean boundary.
    const rounded = [32, 64, 128, 255, 512].find((n) => n >= maxLength) ?? 1024;
    return { type: "VARCHAR", length: rounded, nullable };
  }

  return { type: best, nullable };
}

/**
 * Builds full column definitions from raw row data (array of objects).
 */
export function inferColumns(rows: Record<string, string | null>[]): ColumnDef[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0]);

  return headers.map((name) => {
    const values = rows.map((r) => r[name]);
    const { type, length, nullable } = inferColumnType(values);
    return {
      name,
      type,
      length,
      nullable,
      sample: values.find((v) => v != null && v !== "") ?? undefined,
    };
  });
}