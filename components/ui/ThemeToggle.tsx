"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline-strong bg-surface-card text-ink hover:border-hairline-strong/80 transition-colors cursor-pointer"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}