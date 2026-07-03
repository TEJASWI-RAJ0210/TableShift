import Papa from "papaparse";
import { DataModel } from "../types";
import { inferColumns} from "../inference/typeInference";

export interface ParseResult {
    model: DataModel;
    errors: string[];
}

export function parseCsv(input: string): ParseResult {
    const result = Papa.parse<Record<string, string>>(input.trim(),{
        header: true,
        skipEmptyLines: true,
        dynamicTyping:false
    });

    const rows = result.data.map((row)=>{
        const clean: Record<string, string | null> = {};
        for (const key of Object.keys(row)) {
            const trimmedKey = key.trim();
            const val = row[key];
            clean[trimmedKey] = val === undefined || val === ""? null:val;
        }
        return clean;
    })

    const columns = inferColumns(rows);

    return {
        model : {columns, rows},
        errors: result.errors.map((e)=>`Row ${e.row}: ${e.message}`),

    };
}