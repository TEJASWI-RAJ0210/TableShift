import { DataModel, InferredType } from "@/lib/types";

// Maps our inferred types to JSON Schema primitive types + formats
function toJsonSchemaType(type: InferredType): {
  type: string;
  format?: string;
} {
  switch (type) {
    case "INTEGER":
      return { type: "integer" };
    case "DECIMAL":
      return { type: "number" };
    case "BOOLEAN":
      return { type: "boolean" };
    case "DATE":
      return { type: "string", format: "date" };
    case "DATETIME":
      return { type: "string", format: "date-time" };
    case "TEXT":
      return { type: "string" };
    case "VARCHAR":
    default:
      return { type: "string" };
  }
}

/**
 * Generates a JSON Schema (draft-7) document from a DataModel.
 * Each column becomes a property; non-nullable columns go into "required".
 */
export function generateJsonSchema(model: DataModel, title: string): string {
  if (model.columns.length === 0) return "";

  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const col of model.columns) {
    const { type, format } = toJsonSchemaType(col.type);

    if (col.nullable) {
      // JSON Schema draft-7 nullability via oneOf
      properties[col.name] = {
        oneOf: [{ type }, { type: "null" }],
        ...(format ? { format } : {}),
      };
    } else {
      properties[col.name] = {
        type,
        ...(format ? { format } : {}),
      };
      required.push(col.name);
    }
  }

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title,
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Generates an OpenAPI 3.0 schema component from a DataModel.
 * Produces the `components.schemas.<title>` block ready to paste
 * into an existing OpenAPI spec.
 */
export function generateOpenApiSchema(model: DataModel, title: string): string {
  if (model.columns.length === 0) return "";

  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const col of model.columns) {
    const { type, format } = toJsonSchemaType(col.type);

    if (col.nullable) {
      properties[col.name] = {
        type,
        nullable: true,
        ...(format ? { format } : {}),
      };
    } else {
      properties[col.name] = {
        type,
        ...(format ? { format } : {}),
      };
      required.push(col.name);
    }
  }

  const component = {
    components: {
      schemas: {
        [title]: {
          type: "object",
          properties,
          ...(required.length > 0 ? { required } : {}),
        },
      },
    },
  };

  return JSON.stringify(component, null, 2);
}