# Mock Data REST API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an Express REST API to the mock data generator so the reporting interface prototype can fetch government data on demand.

**Architecture:** Standalone Express server (`server/index.ts`) running on port 3001, importing shared data generation logic extracted from `DataGenerator.tsx`. Three GET endpoints: list datasets, get schema, generate data. CORS enabled for cross-origin access.

**Tech Stack:** Express, CORS (already installed), tsx (dev runner), concurrently (parallel dev scripts)

---

### Task 1: Extract data type configs into shared module

**Files:**
- Create: `src/generators/dataTypes.ts`
- Modify: `src/components/ConfigPanel.tsx`

**Step 1: Create the shared data types file**

Create `src/generators/dataTypes.ts` — move the `dataTypeConfigs` object from `ConfigPanel.tsx` into this file and export it:

```typescript
export interface DataTypeConfig {
  name: string;
  category: string;
  description: string;
  fields: string[];
}

export const dataTypeConfigs: Record<string, DataTypeConfig> = {
  citizens: {
    name: "Citizens",
    category: "People & Citizens",
    description: "Resident information and voter registration",
    fields: ["id", "firstName", "lastName", "ssn", "dateOfBirth", "address", "city", "state", "zipCode", "phone", "voterRegistered"],
  },
  employees: {
    name: "Government Employees",
    category: "People & Citizens",
    description: "Staff records and employment information",
    fields: ["id", "employeeId", "firstName", "lastName", "department", "position", "hireDate", "salary", "email", "phone", "clearanceLevel"],
  },
  services: {
    name: "Public Services",
    category: "Operations & Services",
    description: "Municipal services and programs",
    fields: ["id", "serviceName", "department", "description", "isActive", "budget", "contactPhone", "website", "hoursOfOperation"],
  },
  contracts: {
    name: "Government Contracts",
    category: "Operations & Services",
    description: "Vendor contracts and agreements",
    fields: ["id", "contractNumber", "vendor", "contractType", "value", "startDate", "endDate", "status", "department", "description"],
  },
  workOrders: {
    name: "Work Orders",
    category: "Operations & Services",
    description: "Maintenance and service requests",
    fields: ["id", "workOrderNumber", "workOrderType", "description", "location", "requestDate", "scheduledDate", "assignedTo", "priority", "status", "estimatedCost", "completionDate"],
  },
  balanceSheet: {
    name: "Balance Sheet",
    category: "Financial & Accounting",
    description: "Assets, liabilities, and equity positions",
    fields: ["id", "accountNumber", "accountName", "category", "currentPeriod", "priorPeriod", "change", "changePercent", "fiscalYear", "fund", "department", "notes"],
  },
  incomeStatement: {
    name: "Income Statement",
    category: "Financial & Accounting",
    description: "Revenue, expenses, and budget variance analysis",
    fields: ["id", "accountType", "fund", "function", "department", "division", "program", "location", "doeFunc", "grade", "object", "characterCode", "account", "fullAccount", "accountDescription", "fiscalCalendarName", "fiscalYear", "fiscalMonth", "calendarMonth"],
  },
  budget: {
    name: "Budget Records",
    category: "Financial & Accounting",
    description: "Budget planning and spending tracking",
    fields: ["id", "fiscalYear", "department", "category", "budgetedAmount", "spentAmount", "remainingAmount", "percentSpent", "lastUpdated", "status"],
  },
  purchaseOrders: {
    name: "Purchase Orders",
    category: "Financial & Accounting",
    description: "Procurement and purchasing records",
    fields: ["id", "poNumber", "vendor", "department", "description", "orderDate", "requestedBy", "totalAmount", "status", "deliveryDate", "approvedBy"],
  },
  invoices: {
    name: "Invoices & Payments",
    category: "Financial & Accounting",
    description: "Billing and payment processing",
    fields: ["id", "invoiceNumber", "vendor", "poNumber", "invoiceDate", "dueDate", "amount", "status", "department", "description", "paymentDate"],
  },
  permits: {
    name: "Permits & Applications",
    category: "Compliance & Licensing",
    description: "Building and development permits",
    fields: ["id", "permitNumber", "permitType", "applicantName", "propertyAddress", "applicationDate", "issueDate", "expirationDate", "status", "feeAmount", "inspector", "description"],
  },
  licenses: {
    name: "Business Licenses",
    category: "Compliance & Licensing",
    description: "Business licensing and registration",
    fields: ["id", "licenseNumber", "licenseType", "businessName", "ownerName", "businessAddress", "applicationDate", "issueDate", "renewalDate", "status", "annualFee", "phone"],
  },
  municipalAssets: {
    name: "Municipal Assets",
    category: "Assets & Inventory",
    description: "Government-owned property and equipment",
    fields: ["id", "assetTag", "assetType", "description", "department", "purchaseDate", "purchaseValue", "currentValue", "condition", "location", "serialNumber"],
  },
  inventory: {
    name: "Inventory Management",
    category: "Assets & Inventory",
    description: "Supplies and consumable inventory",
    fields: ["id", "itemCode", "itemName", "category", "description", "quantity", "unitPrice", "totalValue", "location", "reorderLevel", "supplier", "lastUpdated"],
  },
};
```

**Step 2: Update ConfigPanel.tsx to import from shared module**

Replace the inline `dataTypeConfigs` in `ConfigPanel.tsx` with an import. Add emoji prefixes back in the component's grouping logic (the shared module keeps them clean for API use):

At the top of `ConfigPanel.tsx`, add:
```typescript
import { dataTypeConfigs } from "@/generators/dataTypes";
```

Remove the entire `const dataTypeConfigs = { ... };` block (lines 24-109).

Update the `groupedDataTypes` reduce to add emoji prefixes for the UI:
```typescript
const categoryEmojis: Record<string, string> = {
  "People & Citizens": "👥",
  "Operations & Services": "🏢",
  "Financial & Accounting": "💰",
  "Compliance & Licensing": "📋",
  "Assets & Inventory": "🏗️",
};

const groupedDataTypes = Object.entries(dataTypeConfigs).reduce((acc, [key, config]) => {
  const emoji = categoryEmojis[config.category] ?? "";
  const displayCategory = `${emoji} ${config.category}`;
  if (!acc[displayCategory]) {
    acc[displayCategory] = [];
  }
  acc[displayCategory].push({ key, ...config });
  return acc;
}, {} as Record<string, Array<{ key: string; name: string; description: string; fields: string[] }>>);
```

**Step 3: Verify the frontend still works**

Run: `npx vite --port 5173` and verify the app loads and data type selection still works in the browser.

**Step 4: Commit**

```bash
git add src/generators/dataTypes.ts src/components/ConfigPanel.tsx
git commit -m "refactor: extract dataTypeConfigs into shared generators module"
```

---

### Task 2: Install dev dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install tsx and concurrently**

Run:
```bash
npm install --save-dev tsx concurrently
```

**Step 2: Add server scripts to package.json**

Add these to the `"scripts"` section:
```json
"server": "tsx server/index.ts",
"dev:all": "concurrently \"vite\" \"tsx --watch server/index.ts\""
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add tsx and concurrently for API server"
```

---

### Task 3: Create Express server with /api/datasets endpoint

**Files:**
- Create: `server/index.ts`
- Create: `server/routes/datasets.ts`

**Step 1: Create the datasets route file**

Create `server/routes/datasets.ts`:

```typescript
import { Router, Request, Response } from "express";
import { dataTypeConfigs } from "../../src/generators/dataTypes.js";
import { generateMockData } from "../../src/components/DataGenerator.js";

const router = Router();

// GET /api/datasets — list all available data types
router.get("/", (_req: Request, res: Response) => {
  const data = Object.entries(dataTypeConfigs).map(([key, config]) => ({
    type: key,
    label: config.name,
    category: config.category,
    description: config.description,
    fieldCount: config.fields.length,
  }));

  res.json({ success: true, data });
});

// GET /api/datasets/:type/schema — get field definitions
router.get("/:type/schema", (req: Request, res: Response) => {
  const { type } = req.params;
  const config = dataTypeConfigs[type];

  if (!config) {
    res.status(400).json({
      success: false,
      error: `Unknown data type: ${type}. Use GET /api/datasets to see available types.`,
    });
    return;
  }

  res.json({
    success: true,
    data: {
      type,
      label: config.name,
      category: config.category,
      description: config.description,
      fields: config.fields.map((f) => ({ key: f, label: f })),
    },
  });
});

// GET /api/datasets/:type?count=10&fields=name,ssn — generate mock data
router.get("/:type", (req: Request, res: Response) => {
  const { type } = req.params;
  const config = dataTypeConfigs[type];

  if (!config) {
    res.status(400).json({
      success: false,
      error: `Unknown data type: ${type}. Use GET /api/datasets to see available types.`,
    });
    return;
  }

  const count = Math.min(Math.max(parseInt(req.query.count as string) || 10, 1), 1000);

  let fields: string[];
  if (req.query.fields) {
    const requested = (req.query.fields as string).split(",").map((f) => f.trim());
    fields = requested.filter((f) => config.fields.includes(f));
    if (fields.length === 0) {
      fields = config.fields;
    }
  } else {
    fields = config.fields;
  }

  const data = generateMockData(type, count, fields);

  res.json({
    success: true,
    data,
    meta: {
      type,
      label: config.name,
      count: data.length,
      fields,
      generatedAt: new Date().toISOString(),
    },
  });
});

export default router;
```

**Step 2: Create the Express server entry point**

Create `server/index.ts`:

```typescript
import express from "express";
import cors from "cors";
import datasetsRouter from "./routes/datasets.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/datasets", datasetsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock Data API running at http://localhost:${PORT}`);
  console.log(`  GET /api/datasets          — list data types`);
  console.log(`  GET /api/datasets/:type     — generate data`);
  console.log(`  GET /api/datasets/:type/schema — field definitions`);
});
```

**Step 3: Add server directory to tsconfig include**

The current `tsconfig.json` only includes `"src"`. The server uses ESM imports from `src/`, but `tsx` handles TypeScript natively, so no tsconfig change is needed — `tsx` will resolve the imports.

However, we need a `server/tsconfig.json` for the server code since it uses Node APIs:

Create `server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "..",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [".", "../src/generators"]
}
```

**Step 4: Test the server starts**

Run: `npx tsx server/index.ts`

Expected output:
```
Mock Data API running at http://localhost:3001
  GET /api/datasets          — list data types
  GET /api/datasets/:type     — generate data
  GET /api/datasets/:type/schema — field definitions
```

**Step 5: Test all three endpoints with curl**

```bash
# List datasets
curl http://localhost:3001/api/datasets | head -c 500

# Get schema
curl http://localhost:3001/api/datasets/citizens/schema

# Generate data
curl "http://localhost:3001/api/datasets/citizens?count=3&fields=firstName,lastName,ssn"
```

Expected: JSON responses with `"success": true` and appropriate data.

**Step 6: Commit**

```bash
git add server/
git commit -m "feat: add Express REST API for mock data generation"
```

---

### Task 4: Test edge cases and error handling

**Files:**
- No new files — manual testing

**Step 1: Test invalid data type**

Run: `curl http://localhost:3001/api/datasets/bogus`

Expected: `{"success":false,"error":"Unknown data type: bogus. Use GET /api/datasets to see available types."}`

**Step 2: Test count boundaries**

```bash
# Count of 0 should clamp to 1
curl "http://localhost:3001/api/datasets/citizens?count=0" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']))"

# Count of 9999 should clamp to 1000
curl "http://localhost:3001/api/datasets/citizens?count=9999" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']))"
```

Expected: `1` and `1000`

**Step 3: Test invalid fields fall back to all fields**

Run: `curl "http://localhost:3001/api/datasets/citizens?fields=notAField,alsoFake"`

Expected: Response includes all citizen fields (falls back when no valid fields match).

**Step 4: Test CORS headers**

Run: `curl -I -X OPTIONS http://localhost:3001/api/datasets`

Expected: Response includes `Access-Control-Allow-Origin` header.

---

### Task 5: Update package.json scripts and verify dev:all

**Files:**
- Modify: `package.json` (scripts already added in Task 2)

**Step 1: Test the combined dev command**

Run: `npm run dev:all`

Expected: Both Vite and the API server start. Vite on port 5173 (or 3000), API on port 3001.

**Step 2: Verify both services respond**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health
```

Expected: Both return `200`.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: mock data REST API complete — 3 endpoints on port 3001"
```
