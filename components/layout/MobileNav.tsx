"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const converters = [
  { href: "/csv-to-sql", label: "CSV → SQL" },
  { href: "/csv-to-json", label: "CSV → JSON" },
  { href: "/json-to-sql", label: "JSON → SQL" },
  { href: "/json-to-schema", label: "JSON → Schema" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline-strong bg-surface-card text-ink cursor-pointer"
      >
        <Menu size={16} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-canvas shadow-none border-l border-hairline transform transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <span className="text-[15px] font-normal text-ink">
            Table<span className="text-primary">Shift</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-ink cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col px-4 py-4 gap-1">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            Converters
          </p>
          {converters.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-body hover:bg-surface-card hover:text-ink transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}