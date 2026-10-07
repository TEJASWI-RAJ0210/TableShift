import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to SQL Converter — Free, No Login | TableShift",
  description:
    "Convert CSV or Excel files to SQL CREATE TABLE and INSERT statements instantly. Supports MySQL, PostgreSQL, and SQLite. Runs in your browser — nothing uploaded.",
  openGraph: {
    title: "CSV to SQL Converter — TableShift",
    description:
      "Paste CSV data and get ready-to-run SQL in seconds. Free, no signup, works offline.",
    url: "https://yourdomain.com/csv-to-sql",
    siteName: "TableShift",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}