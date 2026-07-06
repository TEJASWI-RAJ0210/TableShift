"use client";

import { useEffect, useMemo, useState } from "react";
import InputPanel from "@/components/converter/InputPanel";
import OutputPanel from "@/components/converter/OutputPanel";
import DialectSelector from "@/components/converter/DialectSelector";
import ColumnSettings from "@/components/converter/ColumnSettings";
import { parseCsv } from "@/lib/parsers/csvParser";
import { parseExcel } from "@/lib/parsers/excelParser";
import { generateSql } from "@/lib/generators/toSql";
import { ColumnDef, DataModel, InferredType, ParseStatus, SqlDialect } from "@/lib/types";

const SAMPLE_CSV = `id,name,email,signup_date,is_active
1,Asha Verma,asha@example.com,2024-01-12,true
2,Rohit Singh,rohit@example.com,2024-02-03,true
3,Meera Iyer,meera@example.com,2024-03-21,false`;

export default function CsvToSqlPage() {
  const [input, setInput] = useState(SAMPLE_CSV);
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
      try {
        const { model: parsed, errors } = parseCsv(input);
        if (errors.length > 0 && parsed.rows.length === 0) {
          setError(errors[0]);
          setStatus("error");
          return;
        }
        setError(null);
        setStatus("inferring");
        setModel(parsed);
        setOverrides({});
        setStatus("ready");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse input");
        setStatus("error");
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [input]);

  async function handleFile(file: File) {
    if (file.name.endsWith(".csv")) {
      const text = await file.text();
      setInput(text);
    } else {
      setStatus("parsing");
      const buffer = await file.arrayBuffer();
      try {
        const parsed = parseExcel(buffer);
        setModel(parsed);
        setOverrides({});
        setInput(""); // excel doesn't populate the textarea
        setStatus("ready");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse Excel file");
        setStatus("error");
      }
    }
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
    return generateSql({ columns: finalColumns, rows: model.rows }, tableName || "my_table", dialect);
  }, [finalColumns, model.rows, tableName, dialect, status]);

  function handleTypeOverride(index: number, type: InferredType) {
    const col = model.columns[index];
    setOverrides((prev) => ({ ...prev, [col.name]: type }));
  }

  return (
    <div className="mx-auto max-w-300 px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[32px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">
          CSV to SQL Converter
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-normal text-body">
          Paste CSV data or upload a file. TableShift infers column types and
          generates a ready-to-run CREATE TABLE and INSERT statements —
          entirely in your browser.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-body">Table name</span>
          <input
            value={tableName}
            onChange={(e) => setTableName(e.target.value.replace(/\s+/g, "_"))}
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
          placeholder="Paste CSV data here..."
        />
        <OutputPanel
          value={output}
          status={status}
          language="sql"
          filename={`${tableName || "my_table"}.sql`}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-error">{error}</p>
      )}

      {finalColumns.length > 0 && (
        <div className="mt-5">
          <ColumnSettings columns={finalColumns} onChange={handleTypeOverride} />
        </div>
      )}
    </div>
  );
}