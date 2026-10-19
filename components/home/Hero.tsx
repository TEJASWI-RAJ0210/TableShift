import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-canvas border-b border-hairline min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-300 px-6 h-full">
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-start gap-10 py-12 lg:flex-row lg:items-center lg:gap-16 lg:py-0">

          {/* Left — text content */}
          <div className="flex-1">
            <span className="inline-flex items-center rounded-full border border-hairline bg-surface-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Free · No login · Browser-only
            </span>
            <h1 className="mt-5 text-[40px] font-normal leading-[1.1] tracking-tight text-ink sm:text-[52px] lg:text-[56px]">
              Move data between formats, instantly.
            </h1>
            <p className="mt-5 max-w-[48ch] text-[17px] leading-[1.7] text-body">
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

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
              {["No signup required", "Runs offline", "Open source"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-[13px] text-muted"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right — tilted terminal image, visible on all screens */}
          <div className="flex w-full flex-1 items-center justify-center pb-10 lg:pb-0">
            <div
              className="relative w-full max-w-85 sm:max-w-105 lg:max-w-130 transition-transform duration-500 hover:rotate-0"
              style={{ transform: "rotate(-9deg)" }}
            >
              <Image
                src="/hero-terminal.svg"
                alt="TableShift terminal showing CSV to SQL conversion output"
                width={520}
                height={390}
                priority
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}