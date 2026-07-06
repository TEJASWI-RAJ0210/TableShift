"use client";

import { useEffect, useMemo, useState } from "react";
import InputPanel from "@/components/converter/InputPanel";
import OutputPanel from "@/components/converter/OutputPanel";
import DialectSelector from "@/components/converter/DialectSelector";
import ColumnSettings from "@/components/converter/ColumnSettings";
import { parseJson } from "@/lib/parsers/jsonParser";
import { generateSql } from "@/lib/generators/toSql";
import { ColumnDef, DataModel, InferredType, ParseStatus, SqlDialect } from "@/lib/types";

const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Asha Verma",
    "email": "asha@example.com",
    "signup_date": "2024-01-12",
    "is_active": true
  },
  {
    "id": 2,
    "name": "Rohit Singh",
    "email": "rohit@example.com",
    "signup_date": "2024-02-03",
    "is_active": true
  },
  {
    "id": 3,
    "name": "Meera Iyer",
    "email": "meera@example.com",
    "signup_date": "2024-03-21",
    "is_active": false
  }
]`;

export default function JsonToSqlPage() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [model, setModel] = useState<DataModel>({ columns: [], rows: [] });
  const [overrides, setOverrides] = useState<Record<string, InferredType>>({});
  const [dialect, setDialect] = useState<SqlDialect>("mysql");
  const [tableName, setTableName] = useState("my_table");
  const [status, setStatus] = useState<ParseStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setModel({ columns: [], rows: [] });
      setStatus("idle");
      return;
    }

    setStatus("parsing");
    const timer = setTimeout(() => {
      const { model: parsed, error: parseError } = parseJson(input);
      if (parseError) {
        setError(parseError);
        setStatus("error");
        return;
      }
      setError(null);
      setStatus("inferring");
      setModel(parsed);
      setOverrides({});
      setStatus("ready");
    }, 150);

    return () => clearTimeout(timer);
  }, [input]);

  // JSON files can also be uploaded directly
  async function handleFile(file: File) {
    const text = await file.text();
    setInput(text);
  }

  const finalColumns: ColumnDef[] = useMemo(
    () =>
      model.columns.map((c) => ({
        ...c,
        type: overrides[c.name] ?? c.type,
      })),
    [model.columns, overrides]
  );

  const output = useMemo(() => {
    if (status !== "ready" || finalColumns.length === 0) return "";
    return generateSql(
      { columns: finalColumns, rows: model.rows },
      tableName || "my_table",
      dialect
    );
  }, [finalColumns, model.rows, tableName, dialect, status]);

  function handleTypeOverride(index: number, type: InferredType) {
    const col = model.columns[index];
    setOverrides((prev) => ({ ...prev, [col.name]: type }));
  }

  return (
    <div className="mx-auto max-w-300 px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[32px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">
          JSON to SQL Converter
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-normal text-body">
          Paste a JSON array or object. TableShift infers column types from
          your data and generates a ready-to-run CREATE TABLE and INSERT
          statements — entirely in your browser.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-body">Table name</span>
          <input
            value={tableName}
            onChange={(e) =>
              setTableName(e.target.value.replace(/\s+/g, "_"))
            }
            className="rounded-md border border-hairline-strong bg-surface-card px-3 py-1.5 text-sm font-mono text-ink focus:outline-none focus:border-primary"
          />
        </div>
        <DialectSelector value={dialect} onChange={setDialect} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InputPanel
          value={input}
          onChange={setInput}
          onFile={handleFile}
          accept=".json"
          placeholder="Paste JSON array or object here..."
        />
        <OutputPanel
          value={output}
          status={status}
          language="sql"
          filename={`${tableName || "my_table"}.sql`}
        />
      </div>

      {error && <p className="mt-3 text-sm text-error">{error}</p>}

      {finalColumns.length > 0 && (
        <div className="mt-5">
          <ColumnSettings columns={finalColumns} onChange={handleTypeOverride} />
        </div>
      )}
    </div>
  );
}