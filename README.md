# TableShift

> Move data between formats, instantly — no login, no upload, no waiting.

TableShift is a free, open-source data conversion tool that runs entirely in the browser. Paste or upload CSV, Excel, or JSON data and get back SQL, JSON, JSON Schema, or OpenAPI components — with smart type inference and per-column overrides.

---

## Features

- **CSV → SQL** — Generates `CREATE TABLE` and `INSERT` statements with inferred column types. Supports MySQL, PostgreSQL, and SQLite dialects.
- **CSV → JSON** — Converts spreadsheet rows into a clean JSON array with numbers, booleans, and dates coerced to their correct types.
- **JSON → SQL** — Infers a relational schema directly from a JSON array or object and generates ready-to-run SQL.
- **JSON → Schema** — Produces a JSON Schema (draft-7) document or an OpenAPI 3.0 component from any JSON sample.

**Every conversion runs locally in your browser. Nothing is ever uploaded.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CSV parsing | PapaParse |
| Excel parsing | SheetJS (xlsx) |
| Code display | CodeMirror 6 |
| Icons | Lucide React |
| Fonts | Inter + JetBrains Mono |
| Deployment | Vercel |

---

## Project Structure

```
tableshift/
├── app/
│   ├── layout.tsx               # Root layout, fonts, dark mode script
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Design tokens (CSS variables, light + dark)
│   ├── csv-to-sql/page.tsx
│   ├── csv-to-json/page.tsx
│   ├── json-to-sql/page.tsx
│   └── json-to-schema/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── converter/
│   │   ├── InputPanel.tsx       # Paste area + file upload
│   │   ├── OutputPanel.tsx      # Syntax-highlighted output + copy/download
│   │   ├── StatusPill.tsx       # Conversion state indicator
│   │   ├── DialectSelector.tsx  # SQL dialect picker
│   │   └── ColumnSettings.tsx   # Per-column type override UI
│   └── ui/
│       └── ThemeToggle.tsx      # Light/dark mode toggle
├── lib/
│   ├── types.ts                 # Shared TypeScript types (DataModel, etc.)
│   ├── useTheme.ts              # Dark mode hook
│   ├── inference/
│   │   └── typeInference.ts     # Majority-vote column type inference engine
│   ├── parsers/
│   │   ├── csvParser.ts
│   │   ├── excelParser.ts
│   │   └── jsonParser.ts
│   └── generators/
│       ├── toSql.ts
│       ├── toJson.ts
│       └── toJsonSchema.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/TEJASWI-RAJ0210/tableshift.git
cd tableshift
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

---

## How Type Inference Works

TableShift scans every value in a column and votes on its type. The type with the most votes wins — but only if it has at least 90% agreement across non-empty values. Otherwise the column safely falls back to `VARCHAR` or `TEXT`. This means one stray empty cell won't break an otherwise clearly-integer column.

The inference priority order per value is:

```
DATETIME → DATE → INTEGER → DECIMAL → BOOLEAN → VARCHAR → TEXT
```

After inference, every column's type is shown in the **Column types** panel below the converter, where you can override any individual column before generating output. The output re-renders instantly on every change.

---

## Design System

TableShift uses a warm-editorial design language — a cream canvas in light mode, warm charcoal in dark mode, a single teal-green accent used sparingly, hairline-only depth (no drop shadows), and monospace fonts for all code/output surfaces.

Dark mode is toggled via the button in the header. Preference is persisted in `localStorage` and applied before first paint to avoid a flash of the wrong theme.

Color tokens, typography scale, and component patterns are all defined as CSS custom properties in `app/globals.css` and exposed to Tailwind via `@theme inline`.

---

## Contributing

Pull requests are welcome. For significant changes, please open an issue first to discuss what you'd like to change.

```bash
# Run the dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built by [Tejaswi Raj](https://github.com/TEJASWI-RAJ0210) 