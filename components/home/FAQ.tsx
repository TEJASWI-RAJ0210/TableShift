"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is my data safe?",
    a: "Yes. TableShift runs entirely in your browser using JavaScript. No data is ever sent to a server. You can disconnect from the internet after the page loads and the converters will still work.",
  },
  {
    q: "What file formats can I upload?",
    a: "CSV (.csv), Excel (.xlsx, .xls), and JSON (.json) files are supported. For Excel files, the first sheet is used.",
  },
  {
    q: "How does type inference work?",
    a: "TableShift scans all values in each column and votes on the most likely type. A type wins only if at least 90% of non-empty values agree — otherwise the column safely falls back to VARCHAR or TEXT. You can override any column manually.",
  },
  {
    q: "What SQL dialects are supported?",
    a: "MySQL, PostgreSQL, and SQLite. Each uses the correct quoting style, type names, and boolean representation. BigQuery and Snowflake are on the roadmap.",
  },
  {
    q: "What is the difference between JSON Schema and OpenAPI output?",
    a: "JSON Schema (draft-7) is a standalone validation document. The OpenAPI 3.0 output is a components.schemas block you paste into an existing spec. Nullable columns are represented differently in each format.",
  },
  {
    q: "Is there a file size limit?",
    a: "Everything runs in the browser so the limit is your device memory. Files under 10MB convert instantly. Very large files may be slower on older devices.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-hairline last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-6 py-5 text-left cursor-pointer"
      >
        <span className="text-[15px] font-semibold leading-snug text-ink">
          {q}
        </span>
        <span className="mt-0.5 shrink-0 text-muted">
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      {open && (
        <p className="pb-5 text-[14px] leading-[1.7] text-body">{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-canvas border-b border-hairline">
      <div className="mx-auto max-w-300 px-6 py-14 sm:py-18">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          FAQ
        </p>
        <h2 className="mt-2 text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[32px]">
          Common questions.
        </h2>
        <p className="mt-3 max-w-[50ch] text-[15px] leading-[1.6] text-body">
          Something missing? Open a GitHub issue or reach out.
        </p>

        {/* Single column — no height mismatch ever */}
        <div className="mt-10 rounded-lg border border-hairline bg-surface-card px-6">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}