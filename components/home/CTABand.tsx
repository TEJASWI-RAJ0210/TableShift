import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABand() {
  return (
    <section className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
        <div className="rounded-lg border border-hairline bg-surface-card px-8 py-14 sm:px-14 sm:py-16">
          <div className="max-w-[480px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Get started
            </p>
            <h2 className="mt-3 text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-ink sm:text-[36px]">
              Ready to convert your data?
            </h2>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.7] text-body">
              No account. No upload. No waiting. Paste your data and get the
              output in under a second.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/csv-to-sql"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[14px] font-medium text-on-primary hover:bg-primary-active transition-colors"
              >
                Try CSV to SQL
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/json-to-schema"
                className="inline-flex items-center gap-2 rounded-md border border-hairline-strong bg-canvas px-5 py-2.5 text-[14px] font-medium text-body hover:text-ink transition-colors"
              >
                Try JSON to Schema
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}