import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-center px-6 py-32">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
        404
      </p>
      <h1 className="mb-4 text-[36px] font-normal leading-[1.1] tracking-[-0.02em] text-ink sm:text-[48px]">
        Page not found.
      </h1>
      <p className="mb-8 max-w-[45ch] text-[16px] leading-[1.5] text-body">
        The page you're looking for doesn't exist. It may have been moved or
        the URL might be wrong.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-[18px] py-[10px] text-[14px] font-medium text-on-primary hover:bg-primary-active transition-colors"
      >
        <ArrowLeft size={15} />
        Back to home
      </Link>

      <div className="mt-16 border-t border-hairline pt-8 w-full">
        <p className="mb-4 text-sm font-semibold text-ink">
          Or jump to a converter:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/csv-to-sql", label: "CSV → SQL" },
            { href: "/csv-to-json", label: "CSV → JSON" },
            { href: "/json-to-sql", label: "JSON → SQL" },
            { href: "/json-to-schema", label: "JSON → Schema" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-md border border-hairline-strong bg-surface-card px-3 py-1.5 text-sm text-body hover:text-ink hover:border-primary transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}