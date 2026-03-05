# Government Data Generator

An AI-powered mock data generator for government and municipal use cases. Generate realistic test data for civic tech projects, government applications, and municipal ERP systems. Includes a REST API for integration with other applications.

## Features

- **14 Government Data Types**: Citizens, employees, permits, licenses, contracts, assets, budget records, and more
- **Realistic Government Data**: Proper formatting, reference numbers, and field structures reflecting actual municipal operations
- **Flexible Field Selection**: Choose specific fields to include in your generated data
- **Multiple Export Formats**: Download data in JSON or CSV format
- **REST API**: Serve generated data over HTTP for use by other applications
- **Preview Functionality**: See a sample of your data before generating the full dataset
- **Professional UI**: Dark "Federal Data Terminal" aesthetic with loading states and notifications

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm

### Installation

```bash
git clone https://github.com/your-org/government-data-generator.git
cd government-data-generator
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

The API server runs on **port 3001** with CORS enabled.

### Endpoints

#### List all data types

```
GET /api/datasets
```

Returns all 14 available data types with metadata.

```json
{
  "success": true,
  "data": [
    {
      "type": "citizens",
      "label": "Citizens",
      "category": "People & Citizens",
      "description": "Resident information and voter registration",
      "fieldCount": 11
    }
  ]
}
```

#### Get schema for a data type

```
GET /api/datasets/:type/schema
```

Returns field definitions for a specific data type.

```json
{
  "success": true,
  "data": {
    "type": "citizens",
    "label": "Citizens",
    "category": "People & Citizens",
    "description": "Resident information and voter registration",
    "fields": [
      { "key": "id", "label": "id" },
      { "key": "firstName", "label": "firstName" }
    ]
  }
}
```

#### Generate mock data

```
GET /api/datasets/:type?count=100&fields=firstName,lastName,ssn
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `count` | Number of records (1-1000) | 10 |
| `fields` | Comma-separated field names | All fields |

```json
{
  "success": true,
  "data": [
    { "firstName": "John", "lastName": "King", "ssn": "822-90-6809" }
  ],
  "meta": {
    "type": "citizens",
    "count": 1,
    "fields": ["firstName", "lastName", "ssn"],
    "generatedAt": "2026-03-04T..."
  }
}
```

#### Health check

```
GET /api/health
```

### Error responses

Invalid data type or out-of-range count returns a 400:

```json
{
  "success": false,
  "error": "Unknown data type: foo. Use GET /api/datasets to see available types."
}
```

## Data Types

### People & Citizens
- **Citizens** — Personal information, addresses, voter registration
- **Government Employees** — Department assignments, clearance levels, salary

### Operations & Services
- **Public Services** — Department services, budgets, hours of operation
- **Government Contracts** — Vendor agreements, contract values, status
- **Work Orders** — Maintenance requests, assignment tracking, cost estimates

### Financial & Accounting
- **Balance Sheet** — Assets, liabilities, equity positions
- **Income Statement** — Revenue, expenses, budget variance
- **Budget Records** — Fiscal year budgets, spending, allocations
- **Purchase Orders** — Procurement tracking, vendor management
- **Invoices & Payments** — Billing, payment status, department charges

### Compliance & Licensing
- **Permits & Applications** — Building permits, zoning, application tracking
- **Business Licenses** — License types, business info, renewal dates

### Assets & Inventory
- **Municipal Assets** — Property tracking, conditions, purchase values
- **Inventory Management** — Supplies, supplier info, reorder levels

## Usage

### Web UI

1. Select a data type from the dropdown
2. Set the number of records (1-1000)
3. Choose which fields to include
4. Click "Generate Dataset"
5. Preview, search, sort, and download as JSON or CSV

### From another application

```javascript
const res = await fetch("http://localhost:3001/api/datasets/citizens?count=500");
const { data } = await res.json();
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — accessible component library (Radix UI primitives)
- **Express** — REST API server
- **Lucide React** — icons
- **Sonner** — toast notifications

## Project Structure

```
├── server/                  # Express REST API
│   ├── index.ts             # Server entry point (port 3001)
│   └── routes/
│       └── datasets.ts      # API endpoints
├── src/
│   ├── generators/
│   │   └── dataTypes.ts     # Shared data type definitions
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ConfigPanel.tsx  # Data configuration panel
│   │   ├── DataPreview.tsx  # Data preview and download
│   │   └── DataGenerator.tsx # Mock data generation logic
│   ├── styles/
│   │   └── globals.css      # Global styles and Tailwind config
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── docs/plans/              # Design and implementation docs
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run server` | Start API server (port 3001) |
| `npm run dev:all` | Run both frontend and API |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## License

MIT License — see [LICENSE](LICENSE) for details.

## Disclaimer

This tool generates mock data for testing and development purposes only. Do not use for collecting real personal information or sensitive government data.
