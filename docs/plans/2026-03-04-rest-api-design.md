# Mock Data REST API Design

## Goal

Expose the Government Data Generator's mock data generation as a REST API so the reporting interface prototype can fetch realistic government data on demand instead of using hardcoded static data.

## Context

- **Consumer:** React-based reporting interface with a canvas drag-and-drop UI for building data pipelines and reports. Currently uses static mock data. Runs locally on a separate machine/port.
- **Provider:** The existing `my-mock` project (Government Data Generator) which already has generation logic for 14 government data types.
- **Future:** The REST API will later be wrapped with an MCP server layer for AI agent integration.

## Architecture

Standalone Express server living alongside the existing Vite frontend in the `my-mock` project. Imports the same data generation logic.

- Server port: **3001**
- CORS enabled for cross-origin access from the reporting app
- No database, no auth — ephemeral generation only
- Data generated fresh on each request (no persistence)

## Endpoints

All endpoints use GET. Responses use a consistent JSON envelope.

### GET /api/datasets

List all available data types with metadata.

Response:
```json
{
  "success": true,
  "data": [
    {
      "type": "citizens",
      "label": "Citizens",
      "category": "People & Citizens",
      "fieldCount": 7
    }
  ]
}
```

### GET /api/datasets/:type/schema

Get field definitions for a specific data type.

Response:
```json
{
  "success": true,
  "data": {
    "type": "citizens",
    "label": "Citizens",
    "category": "People & Citizens",
    "fields": [
      { "key": "id", "label": "Citizen ID" },
      { "key": "name", "label": "Full Name" },
      { "key": "ssn", "label": "SSN" }
    ]
  }
}
```

### GET /api/datasets/:type?count=100&fields=name,ssn,dob

Generate mock records. Count defaults to 10, max 1000. Fields param is optional (omit to get all fields).

Response:
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "type": "citizens",
    "count": 100,
    "fields": ["name", "ssn", "dob"],
    "generatedAt": "2026-03-04T19:30:00.000Z"
  }
}
```

## Project Structure Changes

```
my-mock/
├── server/
│   ├── index.ts              # Express app, CORS, port config
│   └── routes/
│       └── datasets.ts       # 3 API endpoints
├── src/
│   ├── generators/
│   │   └── index.ts          # Data gen logic extracted from DataGenerator.tsx
│   └── components/
│       ├── DataGenerator.tsx  # Refactored to import from generators/
│       └── ...
```

Key change: extract generation logic from `DataGenerator.tsx` into `src/generators/index.ts` so both the frontend and Express server can share it.

## Dependencies to Add

- `tsx` — run TypeScript server directly (dev)
- `concurrently` — run Vite + Express together (dev)

Express and CORS are already in package.json.

## Scripts

```json
"server": "tsx server/index.ts",
"dev:all": "concurrently \"vite\" \"tsx server/index.ts\""
```

## Error Handling

- Invalid data type: `400 { "success": false, "error": "Unknown data type: foo" }`
- Count out of range: `400 { "success": false, "error": "Count must be between 1 and 1000" }`
- Invalid fields: ignored silently (generate with valid fields only)

## Future: MCP Layer

Once the REST API is stable, add an MCP server that wraps the same endpoints as tools:
- `generate_government_data` — calls GET /api/datasets/:type
- `list_available_data_types` — calls GET /api/datasets
- `get_data_type_info` — calls GET /api/datasets/:type/schema

This is out of scope for now.
