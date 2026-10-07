import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter — Free, No Login | TableShift",
  description:
    "Convert CSV or Excel data to a clean JSON array instantly. Numbers, booleans and dates are coerced to correct types. Runs entirely in your browser.",
  openGraph: {
    title: "CSV to JSON Converter — TableShift",
    description:
      "Turn spreadsheet rows into properly typed JSON objects. Free, no signup.",
    url: "https://yourdomain.com/csv-to-json",
    siteName: "TableShift",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}