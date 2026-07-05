import {DataModel, InferredType} from "@/lib/types";

function coerceValue(value:string | null, type: InferredType):unknown {
    if (value === null) return null;
    switch (type) {
        case "INTEGER":
            return parseInt(value, 10);
        case "DECIMAL":
            return parseFloat(value);
        case "BOOLEAN": {
            const v = value.toLowerCase();
            return v === "true" || v === "yes" || v ==="1" || v === "y";
        }
        default:
            return value;
    }    
}

export function generateJson(model: DataModel): string {
    if (model.rows.length === 0) return "[]";

    const typeByColumn = new Map(model.columns.map((c)=> [c.name, c.type]));

    const objects = model.rows.map((row)=>{
        const obj: Record<string, unknown> = {};
        for (const col of model.columns) {
            const type = typeByColumn.get(col.name) ?? "VARCHAR";
            obj[col.name] = coerceValue(row[col.name],type);
        }
        return obj;
    });

    return JSON.stringify(objects, null, 2);
}