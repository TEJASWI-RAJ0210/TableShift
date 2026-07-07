"use client";

import { useEffect, useMemo, useState } from "react";
import InputPanel from "@/components/converter/InputPanel";
import OutputPanel from "@/components/converter/OutputPanel";
import ColumnSettings from "@/components/converter/ColumnSettings";
import { parseJson } from "@/lib/parsers/jsonParser";
import { generateJsonSchema, generateOpenApiSchema } from "@/lib/generators/toJsonSchema";
import { ColumnDef, DataModel, InferredType, ParseStatus } from "@/lib/types";

const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Asha Verma",
    "email": "asha@example.com",
    "signup_date": "2024-01-12",
    "is_active": true,
    "score": 98.5
  },
  {
    "id": 2,
    "name": "Rohit Singh",
    "email": "rohit@example.com",
    "signup_date": "2024-02-03",
    "is_active": true,
    "score": 74.0
  },
  {
    "id": 3,
    "name": "Meera Iyer",
    "email": null,
    "signup_date": "2024-03-21",
    "is_active": false,
    "score": 88.2
  }
]`;

type OutputMode = "json-schema" | "openapi";

const MODE_LABELS: Record<OutputMode, string> = {
  "json-schema": "JSON Schema (draft-7)",
  "openapi": "OpenAPI 3.0 Component",
};

export default function JsonToSchemaPage() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [model, setModel] = useState<DataModel>({ columns: [], rows: [] });
  const [overrides, setOverrides] = useState<Record<string, InferredType>>({});
  const [schemaTitle, setSchemaTitle] = useState("MyModel");
  const [outputMode, setOutputMode] = useState<OutputMode>("json-schema");
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
    const title = schemaTitle.trim() || "MyModel";
    const m = { columns: finalColumns, rows: model.rows };
    return outputMode === "json-schema"
      ? generateJsonSchema(m, title)
      : generateOpenApiSchema(m, title);
  }, [finalColumns, model.rows, schemaTitle, outputMode, status]);

  const filename =
    outputMode === "json-schema"
      ? `${schemaTitle || "schema"}.json`
      : `${schemaTitle || "schema"}.openapi.json`;

  function handleTypeOverride(index: number, type: InferredType) {
    const col = model.columns[index];
    setOverrides((prev) => ({ ...prev, [col.name]: type }));
  }

  return (
    <div className="mx-auto max-w-300 px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[32px] font-normal tracking-[-0.02em] text-ink sm:text-[36px]">
          JSON to Schema Converter
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-normal text-body">
          Paste a JSON array or object and get a JSON Schema (draft-7) or
          OpenAPI 3.0 component — inferred from your actual data, entirely
          in your browser.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-body">Schema name</span>
          <input
            value={schemaTitle}
            onChange={(e) =>
              setSchemaTitle(e.target.value.replace(/\s+/g, ""))
            }
            className="rounded-md border border-hairline-strong bg-surface-card px-3 py-1.5 text-sm font-mono text-ink focus:outline-none focus:border-primary"
          />
        </div>

        {/* Output mode toggle */}
        <div className="flex items-center gap-1 rounded-md border border-hairline-strong bg-surface-card p-1">
          {(Object.keys(MODE_LABELS) as OutputMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setOutputMode(mode)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                outputMode === mode
                  ? "bg-primary text-on-primary"
                  : "text-body hover:text-ink"
              }`}
            >
              {MODE_LABELS[mode]}
            </button>
          ))}
        </div>
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
          language="json"
          filename={filename}
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