"use client";

import { ChangeEvent, useRef } from "react";
import { Upload } from "lucide-react";

interface InputPanelProps {
    value: string;
    onChange: (value: string) => void;
    onFile: (file:File) => void;
    placeholder?: string;
    accept?: string;
}

export default function InputPanel({
    value,
    onChange,
    onFile,
    placeholder,
    accept = ".csv,.xlsx,.xls",
}: InputPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = "";
    }

    return (
        <div className="flex flex-col rounded-lg border border-hairline bg-surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                <span className="text-sm font-semibold text-ink">Input</span>
                <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-md border border-hairline-strong px-2.5 py-1 text-xs font-medium text-body hover:text-ink hover:border-primary transition-colors cursor-pointer"
                >
                <Upload size={13} />
                Upload file
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <textarea
                value={value}
                onChange={(e)=> onChange(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
                className="h-80 w-full resize-none bg-canvas-soft p-4 font-mono text-[13px] leading-1.5 text-ink placeholder:text-muted-soft focus:outline-none"
            />
        </div>
    );
}