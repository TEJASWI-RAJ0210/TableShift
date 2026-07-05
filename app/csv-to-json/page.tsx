"use client"

import { useEffect, useMemo, useState } from "react";
import InputPanel from "@/components/converter/InputPanel";
import OutputPanel from "@/components/converter/OutputPanel";
import ColumnSettings from "@/components/converter/ColumnSettings";
import { parseCsv } from "@/lib/parsers/csvParser";
import { parseExcel } from "@/lib/parsers/excelParser";
import { generateJson } from "@/lib/generators/toJson";
import { ColumnDef, DataModel, InferredType, ParseStatus } from "@/lib/types";

const SAMPLE_CSV = `id,name,email,signup_date,is_active
1,Asha Verma,asha@example.com,2024-01-12,true
2,Rohit Singh,rohit@example.com,2024-02-03,true
3,Meera Iyer,meera@example.com,2024-03-21,false`;

export default function CsvToJsonPage() {
  const [input, setInput] = useState(SAMPLE_CSV);
  const [model, setModel] = useState<DataModel>({ columns: [], rows: [] });
  const [overrides, setOverrides] = useState<Record<string, InferredType>>({});
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
        setInput("");
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
    return generateJson({ columns: finalColumns, rows: model.rows });
  }, [finalColumns, model.rows, status]);

  function handleTypeOverride(index: number, type: InferredType) {
    const col = model.columns[index];
    setOverrides((prev) => ({ ...prev, [col.name]: type }));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[32px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">
          CSV to JSON Converter
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.5] text-body">
          Paste CSV data or upload a file and get a clean JSON array of
          objects, with numbers and booleans coerced to real types — entirely
          in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InputPanel
          value={input}
          onChange={setInput}
          onFile={handleFile}
          placeholder="Paste CSV data here..."
        />
        <OutputPanel value={output} status={status} language="json" filename="data.json" />
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