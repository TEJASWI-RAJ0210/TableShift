import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const converters = [
  { href: "/csv-to-sql", label: "CSV → SQL" },
  { href: "/csv-to-json", label: "CSV → JSON" },
  { href: "/json-to-sql", label: "JSON → SQL" },
  { href: "/json-to-schema", label: "JSON → Schema" },
];

export default function Header() {
  return (
    <header className="h-16 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="text-[18px] font-normal tracking-[-0.02em] text-ink">
          Table<span className="text-primary">Shift</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {converters.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="text-sm font-medium text-body hover:text-ink transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}