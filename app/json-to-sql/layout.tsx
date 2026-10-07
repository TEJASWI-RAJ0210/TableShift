import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to SQL Converter — Free, No Login | TableShift",
  description:
    "Convert a JSON array or object to SQL CREATE TABLE and INSERT statements. Column types are inferred from your data. Supports MySQL, PostgreSQL, and SQLite.",
  openGraph: {
    title: "JSON to SQL Converter — TableShift",
    description:
      "Paste JSON and get a ready-to-run SQL schema in seconds. Free, no signup.",
    url: "https://yourdomain.com/json-to-sql",
    siteName: "TableShift",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}