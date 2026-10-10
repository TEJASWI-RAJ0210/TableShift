import Link from "next/link";
import { ArrowRight } from "lucide-react";

const converters = [
  {
    href: "/csv-to-sql",
    title: "CSV to SQL",
    description:
      "Generate CREATE TABLE and INSERT statements from CSV or Excel data. Supports MySQL, PostgreSQL, and SQLite.",
    live: true,
    tag: "Most used",
  },
  {
    href: "/csv-to-json",
    title: "CSV to JSON",
    description:
      "Turn spreadsheet rows into a clean JSON array. Numbers, booleans, and dates are coerced to their correct types.",
    live: true,
    tag: null,
  },
  {
    href: "/json-to-sql",
    title: "JSON to SQL",
    description:
      "Infer a relational schema and INSERT statements directly from a JSON array or single object.",
    live: true,
    tag: null,
  },
  {
    href: "/json-to-schema",
    title: "JSON to Schema",
    description:
      "Generate a JSON Schema (draft-7) or OpenAPI 3.0 component from any JSON sample payload.",
    live: true,
    tag: null,
  },
];

export default function ConverterGrid() {
  return (
    <section className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Converters
        </p>
        <h2 className="mt-2 text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[32px]">
          Four tools, one place.
        </h2>
        <p className="mt-3 max-w-[50ch] text-[15px] leading-[1.6] text-body">
          Every converter shares the same smart type inference engine and
          runs entirely in your browser.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {converters.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-3 rounded-lg border border-hairline bg-surface-card p-6 transition-colors hover:border-hairline-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[16px] font-semibold text-ink">
                  {c.title}
                </h3>
                <div className="flex shrink-0 items-center gap-2">
                  {c.tag && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                      style={{ backgroundColor: "rgba(45,106,79,0.1)" }}
                    >
                      {c.tag}
                    </span>
                  )}
                  {!c.live && (
                    <span className="rounded-full bg-surface-strong px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                      Soon
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[14px] leading-[1.6] text-body">
                {c.description}
              </p>
              <span className="flex items-center gap-1 text-[13px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open converter
                <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}