export type InferredType = "INTEGER" | "DECIMAL" | "BOOLEAN" | "DATE" | "DATETIME" | "VARCHAR" | "TEXT";

export interface ColumnDef {
    name: string;
    type: InferredType;
    length?: number;
    nullable: boolean;
    sample?: string;
}

export interface DataModel {
    columns: ColumnDef[];
    rows: Record<string, string | null>[];
}

export type SqlDialect = "mysql" | "postgres" | "sqlite";

export type ParseStatus = "idle" | "parsing" | "inferring" | "ready" | "error";