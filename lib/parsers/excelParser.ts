import * as XLSX from "xlsx";
import { DataModel } from "../types";
import { inferColumns } from "../inference/typeInference";

export function parseExcel(buffer: ArrayBuffer): DataModel {
    const workbook = XLSX.read(buffer, {type: "array"});
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    const raw: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false,
    });

    const rows = raw.map((row)=>{
        const clean: Record<string, string | null> = {};
        for (const key of Object.keys(row)) {
            const val = row[key];
            clean[key.trim()] = val === undefined || val === "" ? null : String(val);
        }
        return clean;
    });

    const columns = inferColumns(rows);
    return {columns,rows};
}