import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
      <div className="max-w-[600px]">
        <span className="inline-flex items-center rounded-full border border-hairline bg-surface-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Free · No login · Browser-only
        </span>
        <h1 className="mt-5 text-[40px] font-normal leading-[1.1] tracking-[-0.025em] text-ink sm:text-[56px]">
          Move data between formats, instantly.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.7] text-body">
          TableShift converts CSV, Excel, and JSON into SQL, JSON, JSON
          Schema, and OpenAPI components — with smart type inference, no
          login, and nothing ever leaving your device.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/csv-to-sql"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[14px] font-medium text-on-primary hover:bg-primary-active transition-colors"
          >
            Start converting
            <ArrowRight size={15} />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-md border border-hairline-strong bg-surface-card px-5 py-2.5 text-[14px] font-medium text-body hover:text-ink transition-colors"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}