import { DataModel } from "@/lib/types";
import { inferColumns } from "@/lib/inference/typeInference";

export interface JsonParseResult {
  model: DataModel;
  error?: string;
}

/**
 * Accepts either:
 *   - An array of objects: [{ id: 1, name: "Asha" }, ...]
 *   - A single object (treated as one row): { id: 1, name: "Asha" }
 *
 * All values are stringified before passing to the inference engine
 * so the same type-inference logic applies regardless of source format.
 */
export function parseJson(input: string): JsonParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    return { model: { columns: [], rows: [] }, error: "Invalid JSON — check for missing brackets, commas, or quotes." };
  }

  // Normalise to array
  let items: unknown[];
  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (typeof parsed === "object" && parsed !== null) {
    items = [parsed];
  } else {
    return {
      model: { columns: [], rows: [] },
      error: "Input must be a JSON object or an array of objects.",
    };
  }

  if (items.length === 0) {
    return { model: { columns: [], rows: [] }, error: "Array is empty — nothing to infer." };
  }

// Collect all keys across all objects (handles inconsistent schemas)
const keySet = new Set<string>();
for (const item of items) {
  if (typeof item === "object" && item !== null && !Array.isArray(item)) {
    for (const k of Object.keys(item as Record<string, unknown>)) {
      keySet.add(k);
    }
  }
}
const allKeys = Array.from(keySet);

const rows: Record<string, string | null>[] = items.map((item) => {
  const row: Record<string, string | null> = {};
  for (const key of allKeys) {
    const val = (item as Record<string, unknown>)[key];
    if (val === undefined || val === null) {
      row[key] = null;
    } else if (typeof val === "object") {
      row[key] = JSON.stringify(val);
    } else {
      row[key] = String(val);
    }
  }
  return row;
});

// Track which keys came from nested objects/arrays so we can
// force their column type to TEXT after inference.
const objectKeys = new Set<string>();
for (const item of items) {
  if (typeof item === "object" && item !== null && !Array.isArray(item)) {
    for (const key of allKeys) {
      const val = (item as Record<string, unknown>)[key];
      if (val !== null && typeof val === "object") {
        objectKeys.add(key);
      }
    }
  }
}


  const columns = inferColumns(rows).map((col) =>
  objectKeys.has(col.name) ? { ...col, type: "TEXT" as const } : col
);

  return { model: { columns, rows } };
}