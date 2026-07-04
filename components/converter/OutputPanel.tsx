"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql as sqlLang } from "@codemirror/lang-sql";
import { json as jsonLang } from "@codemirror/lang-json";
import { Copy, Download, Check } from "lucide-react";
import StatusPill from "@/components/converter/StatusPill";
import { ParseStatus } from "@/lib/types";

interface OutputPanelProps {
  value: string;
  status: ParseStatus;
  language?: "sql" | "json";
  filename?: string;
}

export default function OutputPanel({
  value,
  status,
  language = "sql",
  filename = "output.sql",
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col rounded-lg border border-hairline bg-surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-ink">Output</span>
          <StatusPill status={status} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!value}
            className="flex items-center gap-1.5 rounded-md border border-hairline-strong px-2.5 py-1 text-xs font-medium text-body hover:text-ink hover:border-primary transition-colors disabled:opacity-40 cursor-pointer"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            disabled={!value}
            className="flex items-center gap-1.5 rounded-md border border-hairline-strong px-2.5 py-1 text-xs font-medium text-body hover:text-ink hover:border-primary transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      </div>
      <div className="h-80 overflow-auto bg-canvas-soft">
        <CodeMirror
          value={value}
          height="320px"
          extensions={[language === "sql" ? sqlLang() : jsonLang()]}
          editable={false}
          basicSetup={{ lineNumbers: true, foldGutter: false }}
          theme="none"
          style={{ fontSize: "13px" }}
        />
      </div>
    </div>
  );
}