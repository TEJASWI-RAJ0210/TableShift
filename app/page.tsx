import Link from "next/link";
import { ArrowRight } from "lucide-react";

const converters = [
  {
    href: "/csv-to-sql",
    title: "CSV to SQL",
    description: "Generate CREATE TABLE and INSERT statements from CSV or Excel data.",
    live: true,
  },
  {
    href: "/csv-to-json",
    title: "CSV to JSON",
    description: "Turn spreadsheet rows into a clean JSON array of objects.",
    live: false,
  },
  {
    href: "/json-to-sql",
    title: "JSON to SQL",
    description: "Infer a table schema and statements directly from a JSON sample.",
    live: false,
  },
  {
    href: "/json-to-schema",
    title: "JSON to Schema",
    description: "Generate a JSON Schema or OpenAPI fragment from a sample payload.",
    live: false,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <section className="flex flex-col items-start gap-6 py-20 sm:py-24">
        <h1 className="max-w-[18ch] text-[40px] font-normal leading-[1.1] tracking-[-0.02em] text-ink sm:text-[56px]">
          Move data between formats, instantly.
        </h1>
        <p className="max-w-[55ch] text-[16px] leading-[1.5] text-body">
          TableShift converts CSV, Excel, JSON, SQL, and API schemas back and
          forth — no login, no upload, no waiting. Every conversion runs
          locally in your browser.
        </p>
        <Link
          href="/csv-to-sql"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-[18px] py-[10px] text-[14px] font-medium text-on-primary hover:bg-primary-active transition-colors"
        >
          Try CSV to SQL
          <ArrowRight size={15} />
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-5 pb-24 sm:grid-cols-2">
        {converters.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col gap-2 rounded-lg border border-hairline bg-surface-card p-6 transition-colors hover:border-hairline-strong"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-ink">{c.title}</h2>
              {!c.live && (
                <span className="rounded-full bg-surface-strong px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                  Soon
                </span>
              )}
            </div>
            <p className="text-[14px] leading-[1.5] text-body">{c.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}