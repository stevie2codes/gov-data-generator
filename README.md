# Government Data Generator

A mock data generator for government and municipal use cases. Generate realistic test data for civic tech projects, government applications, and municipal ERP systems. Includes a full-featured REST API with deterministic seeding, pagination, filtering, sorting, CSV export, relational scenarios, and interactive Swagger docs.

## Features

- **14 Government Data Types** across 5 categories — citizens, employees, permits, licenses, contracts, assets, budget records, and more
- **Realistic Data** — proper formatting, reference numbers, and field structures reflecting actual municipal operations
- **REST API** with 9 endpoints, rate limiting, and structured error responses
- **Deterministic Generation** — seed-based PRNG produces identical datasets on every request
- **Relational Scenarios** — generate linked datasets where invoices reference real PO numbers, permits reference real citizens
- **Pagination, Sorting & Filtering** — full query parameter support for slicing and dicing results
- **Multi-Format Export** — JSON and CSV response formats
- **Interactive API Docs** — Swagger UI at `/api/docs` for trying endpoints in the browser
- **OpenAPI 3.0 Spec** — auto-generated from live data type definitions
- **Professional UI** — dark "Federal Data Terminal" aesthetic with search, sort, and column operations

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/stevie2codes/playground.git
cd playground
npm install
```

### Running

```bash
# Frontend only (port 3000)
npm run dev

# API server only (port 3001)
npm run server

# Both frontend and API together
npm run dev:all
```

## REST API

The API server runs on **port 3001** with CORS enabled and a rate limit of **100 requests/minute** per IP.

### Quick Links

| Resource | URL |
|----------|-----|
| Swagger UI (interactive docs) | http://localhost:3001/api/docs |
| OpenAPI 3.0 spec | http://localhost:3001/api/openapi.json |
| Health check | http://localhost:3001/api/health |

### Endpoints

#### List all data types

```
GET /api/datasets
```

Returns all 14 available data types with metadata.

#### Get schema for a data type

```
GET /api/datasets/:type/schema
```

Returns field definitions for a specific data type.

#### Generate mock data

```
GET /api/datasets/:type
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | number | 10 | Number of records (1–1000) |
| `fields` | string | all | Comma-separated field names to include |
| `seed` | string | — | Seed for deterministic generation (same seed = same data) |
| `format` | string | json | Response format: `json` or `csv` |
| `sort` | string | — | Sort fields, e.g. `salary:desc` or `department:asc,salary:desc` |
| `page` | number | — | Page number (enables pagination) |
| `pageSize` | number | 50 | Records per page (max 100) |
| `filter[field]` | string | — | Filter by field value, e.g. `filter[department]=Finance` |

**Examples:**

```bash
# Basic generation
curl "http://localhost:3001/api/datasets/citizens?count=100"

# Deterministic — run twice, get identical data
curl "http://localhost:3001/api/datasets/employees?count=50&seed=demo"

# Filter + sort + paginate
curl "http://localhost:3001/api/datasets/employees?count=200&filter%5Bdepartment%5D=Finance&sort=salary:desc&page=1&pageSize=10"

# CSV export
curl "http://localhost:3001/api/datasets/invoices?count=50&format=csv" -o invoices.csv
```

**JSON response:**

```json
{
  "success": true,
  "data": [
    { "firstName": "John", "lastName": "King", "salary": 95000 }
  ],
  "meta": {
    "type": "employees",
    "count": 10,
    "totalGenerated": 200,
    "fields": ["firstName", "lastName", "salary"],
    "generatedAt": "2026-03-05T...",
    "seed": "demo",
    "filters": ["department=Finance"],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 3,
      "totalRecords": 28,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### List relational scenarios

```
GET /api/scenarios
```

Returns available cross-type scenarios with their dataset compositions.

#### Generate relational scenario

```
GET /api/scenarios/:name
```

Generate multiple linked datasets with shared foreign keys.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | number | 10 | Records per dataset (1–500) |
| `seed` | string | — | Seed for deterministic generation |

**Available scenarios:**

| Scenario | Datasets | Linkage |
|----------|----------|---------|
| `municipal-finance` | contracts, purchaseOrders, invoices | Shared vendors; invoices reference real PO numbers |
| `citizen-services` | citizens, permits, licenses | Permits and licenses reference real citizen names/addresses |

```bash
# Invoices automatically reference real PO numbers and vendors
curl "http://localhost:3001/api/scenarios/municipal-finance?count=10&seed=demo"

# Permits reference real citizen names and addresses
curl "http://localhost:3001/api/scenarios/citizen-services?count=10&seed=gov"
```

#### Request statistics

```
GET /api/stats
```

Returns server uptime, request counts, and per-type generation stats.

```json
{
  "success": true,
  "data": {
    "uptimeSeconds": 3600,
    "totalRequests": 142,
    "totalRecordsGenerated": 5000,
    "requestsByEndpoint": { "/api/datasets/employees": 45 },
    "requestsByDataType": { "employees": 2500 }
  }
}
```

#### Health check

```
GET /api/health
```

### Error Responses

All errors return structured JSON with error codes and hints:

```json
{
  "success": false,
  "error": {
    "code": "UNKNOWN_TYPE",
    "message": "Unknown data type: \"foo\".",
    "hint": "Use GET /api/datasets to see available types.",
    "details": {
      "availableTypes": ["citizens", "employees", "..."]
    }
  }
}
```

Error codes: `UNKNOWN_TYPE`, `INVALID_PARAM`, `RATE_LIMITED`, `UNKNOWN_SCENARIO`, `INTERNAL_ERROR`

## Data Types

### People & Citizens
- **Citizens** — personal information, addresses, voter registration
- **Government Employees** — department assignments, clearance levels, salary

### Operations & Services
- **Public Services** — department services, budgets, hours of operation
- **Government Contracts** — vendor agreements, contract values, status
- **Work Orders** — maintenance requests, assignment tracking, cost estimates

### Financial & Accounting
- **Balance Sheet** — assets, liabilities, equity positions
- **Income Statement** — revenue, expenses, budget variance
- **Budget Records** — fiscal year budgets, spending, allocations
- **Purchase Orders** — procurement tracking, vendor management
- **Invoices & Payments** — billing, payment status, department charges

### Compliance & Licensing
- **Permits & Applications** — building permits, zoning, application tracking
- **Business Licenses** — license types, business info, renewal dates

### Assets & Inventory
- **Municipal Assets** — property tracking, conditions, purchase values
- **Inventory Management** — supplies, supplier info, reorder levels

## Usage

### Web UI

1. Select a data type from the dropdown
2. Set the number of records (1–1000)
3. Choose which fields to include
4. Click **Generate Dataset**
5. Preview, search, sort, and download as JSON or CSV
6. Click the **API** button in the header to view full endpoint documentation

### From Another Application

```javascript
// Basic fetch
const res = await fetch("http://localhost:3001/api/datasets/citizens?count=500&seed=prod");
const { data, meta } = await res.json();

// With pagination
const page1 = await fetch("http://localhost:3001/api/datasets/employees?count=1000&page=1&pageSize=50");
const { data, meta: { pagination } } = await page1.json();

// Relational scenario
const scenario = await fetch("http://localhost:3001/api/scenarios/municipal-finance?count=100&seed=test");
const { data: { contracts, purchaseOrders, invoices } } = await scenario.json();
```

## Technology Stack

- **React 18** with TypeScript (strict mode)
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component library (Radix UI primitives)
- **Express 5** — REST API server
- **Lucide React** — icons
- **Sonner** — toast notifications
- **mulberry32** — seeded PRNG for deterministic generation (zero dependencies)

## Project Structure

```
├── server/                       # Express REST API
│   ├── index.ts                  # Server entry point (port 3001)
│   ├── routes/
│   │   ├── datasets.ts           # Data generation endpoints
│   │   ├── scenarios.ts          # Relational scenario endpoints
│   │   ├── stats.ts              # Request statistics endpoint
│   │   └── docs.ts               # OpenAPI spec + Swagger UI
│   ├── middleware/
│   │   ├── errorHandler.ts       # ApiError class + error middleware
│   │   ├── rateLimiter.ts        # Sliding window rate limiter
│   │   └── requestStats.ts       # Request counting middleware
│   └── utils/
│       ├── seededRng.ts          # Deterministic PRNG (mulberry32)
│       ├── queryHelpers.ts       # Pagination parsing + slicing
│       ├── sorting.ts            # Multi-field sort utilities
│       ├── filtering.ts          # Field-level filter utilities
│       └── openapi.ts            # Dynamic OpenAPI 3.0 spec builder
├── src/
│   ├── generators/
│   │   └── dataTypes.ts          # Shared data type definitions
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── ConfigPanel.tsx       # Data configuration panel
│   │   ├── DataPreview.tsx       # Data preview and download
│   │   ├── DataGenerator.tsx     # Mock data generation logic
│   │   └── ApiInfoPanel.tsx      # API documentation dialog
│   ├── styles/
│   │   └── globals.css           # Global styles and Tailwind config
│   ├── App.tsx                   # Main application component
│   └── main.tsx                  # Application entry point
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run server` | Start API server (port 3001) |
| `npm run dev:all` | Run both frontend and API concurrently |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## License

MIT License — see [LICENSE](LICENSE) for details.

## Disclaimer

This tool generates mock data for testing and development purposes only. Do not use for collecting real personal information or sensitive government data.
