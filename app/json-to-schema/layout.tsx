import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to Schema Converter — JSON Schema & OpenAPI | TableShift",
  description:
    "Generate a JSON Schema (draft-7) or OpenAPI 3.0 component from any JSON sample. Types and required fields inferred automatically. Free, no login, runs in your browser.",
  openGraph: {
    title: "JSON to Schema Converter — TableShift",
    description:
      "Paste a JSON payload and get a JSON Schema or OpenAPI component instantly. Free, no signup.",
    url: "https://yourdomain.com/json-to-schema",
    siteName: "TableShift",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}