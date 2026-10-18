"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is my data safe?",
    a: "Yes. TableShift runs entirely in your browser using JavaScript. No data is ever sent to a server. You can even disconnect from the internet after the page loads and the converters will still work.",
  },
  {
    q: "What file formats can I upload?",
    a: "CSV (.csv), Excel (.xlsx, .xls), and JSON (.json) files are all supported. For Excel files, the first sheet is used for conversion.",
  },
  {
    q: "How does type inference work?",
    a: "TableShift scans all values in each column and votes on the most likely type. A type wins only if at least 90% of non-empty values agree — otherwise the column safely falls back to VARCHAR or TEXT. You can always override any inferred type manually in the Column types panel.",
  },
  {
    q: "What SQL dialects are supported?",
    a: "MySQL, PostgreSQL, and SQLite are supported. Each dialect uses the correct quoting style, type names, and boolean representation. More dialects (BigQuery, Snowflake) are on the roadmap.",
  },
  {
    q: "What is the difference between JSON Schema and OpenAPI output?",
    a: "JSON Schema (draft-7) is a standalone schema document used for data validation. The OpenAPI 3.0 output produces a components.schemas block you can paste directly into an existing OpenAPI specification. Nullable columns are represented differently in each format.",
  },
  {
    q: "Is there a file size limit?",
    a: "Since everything runs in the browser, the practical limit depends on your device's memory. Most files under 10MB convert instantly. Very large files may be slower on older or low-memory devices.",
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
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-[14px] leading-[1.7] text-body">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          FAQ
        </p>
        <h2 className="mt-2 text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[32px]">
          Common questions.
        </h2>
        <p className="mt-3 max-w-[50ch] text-[15px] leading-[1.6] text-body">
          Something missing? Open a GitHub issue or reach out.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface-card px-6">
            {faqs.slice(0, 3).map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
          <div className="rounded-lg border border-hairline bg-surface-card px-6">
            {faqs.slice(3).map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}