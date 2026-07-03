import { ParseStatus } from "@/lib/types";
import clsx from "clsx";

const LABELS: Record<ParseStatus, string> = {
    idle: "Waiting for input",
    parsing: "Parsing",
    inferring: "Inferring types",
    ready: "Ready",
    error: "Error"
};

const COLOR_VAR: Record<ParseStatus, string> = {
    idle: "var(--hairline-strong)",
    parsing: "var(--pill-parsing)",
    inferring: "var(--pill-inferring)",
    ready: "var(--pill-ready)",
    error:"var(--pill-error)"
    
};

export default function StatusPill({status}: {status: ParseStatus}){
    return (
        <span className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]",
            status==="ready" || status==="error" ? "text-on-primary" : "text-ink"

        )}
        style={{backgroundColor: COLOR_VAR[status]}}
        >
            {LABELS[status]}
        </span>
    );
}