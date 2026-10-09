"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const converters = [
  {
    href: "/csv-to-sql",
    label: "CSV → SQL",
    description: "Generate CREATE TABLE and INSERT statements",
  },
  {
    href: "/csv-to-json",
    label: "CSV → JSON",
    description: "Turn spreadsheet rows into typed JSON objects",
  },
  {
    href: "/json-to-sql",
    label: "JSON → SQL",
    description: "Infer a SQL schema from a JSON sample",
  },
  {
    href: "/json-to-schema",
    label: "JSON → Schema",
    description: "Generate JSON Schema or OpenAPI components",
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on route change / escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative md:hidden" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline-strong bg-surface-card text-ink transition-colors hover:border-primary cursor-pointer"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute right-0 top-[calc(100%+10px)] w-[calc(100vw-48px)] max-w-sm rounded-lg border border-hairline bg-surface-card shadow-none overflow-hidden
          transition-all duration-200 origin-top-right
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
      >
        {/* Header */}
        <div className="border-b border-hairline px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            Converters
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-col p-2">
          {converters.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              className="group flex items-start justify-between gap-3 rounded-md px-3 py-3 transition-colors hover:bg-canvas"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-ink">
                  {c.label}
                </span>
                <span className="text-xs text-muted">{c.description}</span>
              </div>
              <ArrowRight
                size={14}
                className="mt-0.5 shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </nav>

        {/* Footer note */}
        <div className="border-t border-hairline px-4 py-3">
          <p className="text-[11px] text-muted-soft">
            All conversions run in your browser — nothing uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}