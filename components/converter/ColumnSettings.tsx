"use client";

import { ColumnDef, InferredType } from "@/lib/types";

const TYPES: InferredType[] = [
  "INTEGER",
  "DECIMAL",
  "BOOLEAN",
  "DATE",
  "DATETIME",
  "VARCHAR",
  "TEXT",
];

interface ColumnSettingsProps {
  columns: ColumnDef[];
  onChange: (index: number, type: InferredType) => void;
}

export default function ColumnSettings({ columns, onChange }: ColumnSettingsProps) {
  if (columns.length === 0) return null;

  return (
    <div className="rounded-lg border border-hairline bg-surface-card p-4">
      <p className="mb-3 text-sm font-semibold text-ink">Column types</p>
      <div className="flex flex-col gap-2">
        {columns.map((col, i) => (
          <div
            key={col.name}
            className="flex items-center justify-between gap-3 rounded-md border border-hairline-soft px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{col.name}</p>
              {col.sample && (
                <p className="truncate text-xs text-muted">e.g. {col.sample}</p>
              )}
            </div>
            <select
              value={col.type}
              onChange={(e) => onChange(i, e.target.value as InferredType)}
              className="rounded-md border border-hairline-strong bg-canvas-soft px-2 py-1 text-xs font-mono text-ink focus:outline-none focus:border-primary cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}