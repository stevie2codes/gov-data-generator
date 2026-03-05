import { dataTypeConfigs } from "../../src/generators/dataTypes.js";

// ─── Dynamic OpenAPI 3.0 spec generation ──────────────────────────────────────
// Built from the live `dataTypeConfigs` so it's always in sync.

export function buildOpenApiSpec(): Record<string, unknown> {
  const typeEnum = Object.keys(dataTypeConfigs);
  const typeDescriptions = Object.entries(dataTypeConfigs)
    .map(([key, c]) => `- \`${key}\` — ${c.description}`)
    .join("\n");

  return {
    openapi: "3.0.3",
    info: {
      title: "Government Mock Data API",
      description:
        "Generate realistic mock data for government and municipal use cases. " +
        "Supports 14 data types across 5 categories, with deterministic seeded generation, " +
        "field-level filtering, sorting, pagination, CSV export, and relational cross-type scenarios.",
      version: "1.0.0",
      contact: { name: "MockMakeData" },
    },
    servers: [{ url: "http://localhost:3001", description: "Local development" }],
    paths: {
      "/api/datasets": {
        get: {
          tags: ["Datasets"],
          summary: "List available data types",
          description: "Returns all 14 available data types with their categories, descriptions, and field counts.",
          responses: {
            "200": {
              description: "List of data types",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            type: { type: "string" },
                            label: { type: "string" },
                            category: { type: "string" },
                            description: { type: "string" },
                            fieldCount: { type: "integer" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/datasets/{type}/schema": {
        get: {
          tags: ["Datasets"],
          summary: "Get field schema for a data type",
          parameters: [
            {
              name: "type",
              in: "path",
              required: true,
              schema: { type: "string", enum: typeEnum },
              description: `Data type key.\n${typeDescriptions}`,
            },
          ],
          responses: {
            "200": { description: "Field schema" },
            "400": { description: "Unknown data type" },
          },
        },
      },

      "/api/datasets/{type}": {
        get: {
          tags: ["Datasets"],
          summary: "Generate mock data",
          description:
            "Generate mock records for the specified data type. " +
            "Supports deterministic seeding, field selection, filtering, sorting, pagination, and CSV export.",
          parameters: [
            {
              name: "type",
              in: "path",
              required: true,
              schema: { type: "string", enum: typeEnum },
              description: "Data type key",
            },
            {
              name: "count",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 1000, default: 10 },
              description: "Number of records to generate",
            },
            {
              name: "fields",
              in: "query",
              schema: { type: "string" },
              description: "Comma-separated field names to include (default: all)",
            },
            {
              name: "seed",
              in: "query",
              schema: { type: "string" },
              description: "Seed string for deterministic generation. Same seed → same data.",
            },
            {
              name: "format",
              in: "query",
              schema: { type: "string", enum: ["json", "csv"], default: "json" },
              description: "Response format",
            },
            {
              name: "sort",
              in: "query",
              schema: { type: "string" },
              description: 'Sort fields, e.g. "salary:desc" or "department:asc,salary:desc"',
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1 },
              description: "Page number (enables pagination)",
            },
            {
              name: "pageSize",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 50 },
              description: "Records per page (max 100)",
            },
          ],
          responses: {
            "200": {
              description: "Generated data (JSON or CSV)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: { type: "array", items: { type: "object" } },
                      meta: { type: "object" },
                    },
                  },
                },
                "text/csv": {
                  schema: { type: "string" },
                },
              },
            },
            "400": { description: "Invalid parameters or unknown type" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },

      "/api/scenarios": {
        get: {
          tags: ["Scenarios"],
          summary: "List available relational scenarios",
          description: "Returns all available cross-type scenarios with their dataset compositions.",
          responses: {
            "200": {
              description: "List of scenarios",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            scenario: { type: "string" },
                            name: { type: "string" },
                            description: { type: "string" },
                            datasets: {
                              type: "array",
                              items: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/scenarios/{name}": {
        get: {
          tags: ["Scenarios"],
          summary: "Generate relational scenario data",
          description:
            "Generate multiple related datasets with shared foreign keys (e.g., invoices reference real PO numbers).",
          parameters: [
            {
              name: "name",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: ["municipal-finance", "citizen-services"],
              },
              description: "Scenario name",
            },
            {
              name: "count",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 500, default: 10 },
              description: "Records per dataset",
            },
            {
              name: "seed",
              in: "query",
              schema: { type: "string" },
              description: "Seed for deterministic generation",
            },
          ],
          responses: {
            "200": { description: "Relational datasets" },
            "400": { description: "Unknown scenario" },
          },
        },
      },

      "/api/stats": {
        get: {
          tags: ["System"],
          summary: "Request statistics",
          description: "Returns server uptime, total request counts, and per-type generation stats.",
          responses: {
            "200": {
              description: "Stats snapshot",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          uptimeSeconds: { type: "number" },
                          totalRequests: { type: "integer" },
                          totalRecordsGenerated: { type: "integer" },
                          requestsByEndpoint: { type: "object" },
                          requestsByDataType: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          responses: {
            "200": {
              description: "Server is running",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Datasets", description: "Generate and explore mock data types" },
      { name: "Scenarios", description: "Cross-type relational data generation" },
      { name: "System", description: "Server health and usage statistics" },
    ],
  };
}
