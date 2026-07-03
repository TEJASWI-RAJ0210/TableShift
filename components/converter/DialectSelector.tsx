"use client"

import { SqlDialect } from "@/lib/types"

const DIALECTS: {value: SqlDialect; label:string} [] = [
    {value:"mysql",label:"MySQL"},
    {value:"postgres",label:"PostgreSQL"},
    {value:"sqlite", label:"SQLite"},
];

interface DialectSelectorProps {
    value: SqlDialect;
    onChange: (dialect: SqlDialect) => void;

}

export default function DialectSelector({value, onChange}:DialectSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-body">Dialect</span>
            <select
               value={value}
               onChange={(e)=>onChange(e.target.value as SqlDialect)}
               className="rounded-md border border-hairline-strong bg-surface-card px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-primary cursor-pointer"
            >
                {DIALECTS.map((d)=>(
                    <option key={d.value} value={d.value}>
                        {d.label}
                    </option>
                ))}
            </select>
        </div>
    );
}