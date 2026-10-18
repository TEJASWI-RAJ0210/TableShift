import Link from "next/link";

const converters = [
  { href: "/csv-to-sql", label: "CSV to SQL" },
  { href: "/csv-to-json", label: "CSV to JSON" },
  { href: "/json-to-sql", label: "JSON to SQL" },
  { href: "/json-to-schema", label: "JSON to Schema" },
];

const legal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-300 px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-[16px] font-normal tracking-[-0.02em] text-ink"
            >
              Table<span className="text-primary">Shift</span>
            </Link>
            <p className="max-w-[28ch] text-[13px] leading-[1.6] text-muted">
              Free data conversion tools that run entirely in your browser.
              Nothing uploaded. Nothing stored.
            </p>
          </div>

          {/* Converters */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Converters
            </p>
            <nav className="flex flex-col gap-2">
              {converters.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="text-[13px] text-body hover:text-ink transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Legal
            </p>
            <nav className="flex flex-col gap-2">
              {legal.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[13px] text-body hover:text-ink transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          <p className="text-[12px] text-muted-soft">
            © {new Date().getFullYear()} TableShift. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-soft">
            Every conversion runs in your browser — your data never leaves your device.
          </p>
        </div>
      </div>
    </footer>
  );
}