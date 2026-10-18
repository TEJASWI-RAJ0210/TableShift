const steps = [
  {
    number: "01",
    title: "Paste or upload your data",
    description:
      "Paste CSV, Excel, or JSON directly into the input panel, or click Upload to load a file from your device. A sample is pre-loaded so you can see the output immediately.",
  },
  {
    number: "02",
    title: "Review inferred column types",
    description:
      "TableShift scans your data and infers the best type for each column — INTEGER, DECIMAL, BOOLEAN, DATE, DATETIME, VARCHAR, or TEXT. The Column types panel shows exactly what was detected.",
  },
  {
    number: "03",
    title: "Adjust settings if needed",
    description:
      "Override any column type with a single click. For SQL output, pick your dialect (MySQL, PostgreSQL, or SQLite) and set the table name. Every change reflects instantly in the output.",
  },
  {
    number: "04",
    title: "Copy or download the output",
    description:
      "Click Copy to grab the output to your clipboard, or Download to save it as a file. SQL files are named after your table; schema files after your model name.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          How it works
        </p>
        <h2 className="mt-2 text-[28px] font-normal tracking-[-0.02em] text-ink sm:text-[32px]">
          Four steps to your output.
        </h2>
        <p className="mt-3 max-w-[50ch] text-[15px] leading-[1.6] text-body">
          Designed to get out of your way — paste, tweak if needed, copy.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface-card">
                  <span className="text-[12px] font-semibold tabular-nums text-muted">
                    {step.number}
                  </span>
                </div>
                {/* Connector line — hide on last item */}
                {i < steps.length - 1 && (
                  <div className="hidden h-px flex-1 bg-hairline lg:block" />
                )}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-body">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}