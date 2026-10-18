import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TableShift",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-180 px-6 py-16 sm:py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        Legal
      </p>
      <h1 className="mt-2 text-[32px] font-normal tracking-[-0.02em] text-ink">
        Terms of Service
      </h1>
      <p className="mt-2 text-[14px] text-muted">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-10 flex flex-col gap-8 text-[15px] leading-[1.8] text-body">
        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Acceptance of terms
          </h2>
          <p>
            By using TableShift you agree to these terms. If you do not
            agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Description of service
          </h2>
          <p>
            TableShift is a free, browser-based data conversion tool. It
            converts CSV, Excel, and JSON data into SQL, JSON, JSON Schema,
            and OpenAPI formats. All processing occurs on your device — no
            data is sent to our servers.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Use of the service
          </h2>
          <p>You agree not to use TableShift to:</p>
          <ul className="mt-2 flex flex-col gap-2 pl-4">
            {[
              "Violate any applicable law or regulation",
              "Attempt to reverse-engineer, scrape, or systematically extract data from the service",
              "Use the service in any way that could damage, disable, or impair it",
              "Distribute malware or malicious code via the service",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Intellectual property
          </h2>
          <p>
            The TableShift codebase is open source. The name, logo, and
            design are the property of the creator. You may not use the
            TableShift name or branding without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Disclaimer of warranties
          </h2>
          <p>
            TableShift is provided "as is" without warranties of any kind,
            express or implied. We do not warrant that the service will be
            error-free, uninterrupted, or that the output will be accurate
            for your specific use case. Always verify generated SQL, schema,
            or JSON before using it in production.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, TableShift and its
            creator shall not be liable for any indirect, incidental,
            special, or consequential damages arising from your use of the
            service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Changes to these terms
          </h2>
          <p>
            We reserve the right to update these terms at any time. Changes
            take effect when posted. Continued use of TableShift after
            changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold text-ink">
            Contact
          </h2>
          <p>
            Questions about these terms? Reach out via the GitHub repository
            or email listed in the project README.
          </p>
        </section>
      </div>
    </div>
  );
}