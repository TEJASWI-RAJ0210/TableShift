import { Shield, Zap, Globe, Upload, Settings2, Copy } from "lucide-react";
import { ElementType } from "react";

interface Feature {
  icon: ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Shield,
    title: "100% private",
    description:
      "Every conversion runs locally in your browser. Your data is never sent to a server, stored, or logged anywhere — not even temporarily.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description:
      "Output updates live as you type. No convert button, no loading spinner, no page reload. Paste and it's done.",
  },
  {
    icon: Globe,
    title: "No account needed",
    description:
      "Open the page and start converting. No signup, no email address, no subscription required — ever.",
  },
  {
    icon: Upload,
    title: "File upload support",
    description:
      "Paste data directly or upload a .csv, .xlsx, or .json file. Both paths use the same inference engine and produce identical output.",
  },
  {
    icon: Settings2,
    title: "Smart type inference",
    description:
      "TableShift detects integers, decimals, booleans, dates, and datetimes automatically — with per-column overrides if the inference needs adjusting.",
  },
  {
    icon: Copy,
    title: "Copy or download",
    description:
      "One-click copy to clipboard or download as a named file. SQL files are named after your table; schema files after your model name.",
  },
];

export default function Features() {
  return (
    <section className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Features
        </p>
        <h2 className="mt-2 text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[32px]">
          Built around trust and speed.
        </h2>
        <p className="mt-3 max-w-[50ch] text-[15px] leading-[1.6] text-body">
          No ads, no tracking, no upsells. Just a tool that works.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface-card p-6"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-md text-primary"
                style={{ backgroundColor: "rgba(45,106,79,0.1)" }}
              >
                <f.icon size={17} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-body">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}