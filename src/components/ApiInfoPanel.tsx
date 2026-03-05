import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1 rounded-sm text-muted-foreground/60 hover:text-foreground transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function MethodBadge({ method }: { method: string }) {
  const color = method === "GET" ? "text-green-400 bg-green-400/10 border-green-400/25" : "text-blue-400 bg-blue-400/10 border-blue-400/25";
  return (
    <span className={`text-xs font-data font-semibold px-1.5 py-0.5 rounded-sm border ${color}`}>
      {method}
    </span>
  );
}

interface Param {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: Param[];
  example: string;
  response: string;
}

const endpoints: Endpoint[] = [
  // ─── Datasets ───────────────────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/datasets",
    description: "List all available data types with their categories and field counts.",
    example: "curl http://localhost:3001/api/datasets",
    response: `{
  "success": true,
  "data": [
    {
      "type": "citizens",
      "label": "Citizens",
      "category": "People & Citizens",
      "fieldCount": 11
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/datasets/:type/schema",
    description: "Get the field schema for a specific data type.",
    example: "curl http://localhost:3001/api/datasets/citizens/schema",
    response: `{
  "success": true,
  "data": {
    "type": "citizens",
    "label": "Citizens",
    "fields": [
      { "key": "id", "label": "id" },
      { "key": "firstName", "label": "firstName" }
    ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/datasets/:type",
    description: "Generate mock data with filtering, sorting, pagination, seeded determinism, and CSV export.",
    params: [
      { name: "count", type: "number", default: "10", description: "Records to generate (1–1000)" },
      { name: "fields", type: "string", default: "all", description: "Comma-separated field names" },
      { name: "seed", type: "string", default: "—", description: "Seed for deterministic output" },
      { name: "format", type: "string", default: "json", description: "Response format: json or csv" },
      { name: "sort", type: "string", default: "—", description: "Sort fields, e.g. salary:desc" },
      { name: "page", type: "number", default: "—", description: "Page number (enables pagination)" },
      { name: "pageSize", type: "number", default: "50", description: "Records per page (max 100)" },
      { name: "filter[field]", type: "string", default: "—", description: "Filter by field value" },
    ],
    example: 'curl "http://localhost:3001/api/datasets/employees?count=50&sort=salary:desc&page=1&pageSize=10&seed=demo"',
    response: `{
  "success": true,
  "data": [ ... ],
  "meta": {
    "type": "employees",
    "count": 10,
    "totalGenerated": 50,
    "seed": "demo",
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "hasNext": true
    }
  }
}`,
  },

  // ─── Scenarios ──────────────────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/scenarios",
    description: "List available relational scenarios with their dataset compositions.",
    example: "curl http://localhost:3001/api/scenarios",
    response: `{
  "success": true,
  "data": [
    {
      "scenario": "municipal-finance",
      "name": "Municipal Finance",
      "datasets": ["contracts", "purchaseOrders", "invoices"]
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/scenarios/:name",
    description: "Generate cross-type relational data with shared foreign keys (e.g., invoices referencing real PO numbers).",
    params: [
      { name: "count", type: "number", default: "10", description: "Records per dataset (1–500)" },
      { name: "seed", type: "string", default: "—", description: "Seed for deterministic output" },
    ],
    example: 'curl "http://localhost:3001/api/scenarios/municipal-finance?count=5&seed=test"',
    response: `{
  "success": true,
  "data": {
    "contracts": [ ... ],
    "purchaseOrders": [ ... ],
    "invoices": [ ... ]
  },
  "meta": {
    "scenario": "municipal-finance",
    "recordsPerDataset": 5,
    "seed": "test"
  }
}`,
  },

  // ─── System ─────────────────────────────────────────────────────────────
  {
    method: "GET",
    path: "/api/stats",
    description: "Server request statistics including uptime, totals, and per-type generation counts.",
    example: "curl http://localhost:3001/api/stats",
    response: `{
  "success": true,
  "data": {
    "uptimeSeconds": 3600,
    "totalRequests": 142,
    "totalRecordsGenerated": 5000,
    "requestsByDataType": { ... }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/health",
    description: "Health check endpoint. Returns server status.",
    example: "curl http://localhost:3001/api/health",
    response: `{
  "status": "ok",
  "timestamp": "2026-03-05T..."
}`,
  },
  {
    method: "GET",
    path: "/api/openapi.json",
    description: "OpenAPI 3.0 specification. Dynamically generated from live data type configs.",
    example: "curl http://localhost:3001/api/openapi.json",
    response: `{
  "openapi": "3.0.3",
  "info": { "title": "Government Mock Data API", ... },
  "paths": { ... }
}`,
  },
  {
    method: "GET",
    path: "/api/docs",
    description: "Interactive Swagger UI documentation. Open in your browser.",
    example: "open http://localhost:3001/api/docs",
    response: `(Swagger UI HTML page — open in browser)`,
  },
];

export function ApiInfoPanel({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg tracking-[0.1em] uppercase font-semibold">
            REST API
          </DialogTitle>
          <DialogDescription>
            The API server runs on <span className="font-data text-foreground/90">port 3001</span> and serves generated mock data over REST.
            Start it with <code className="font-data text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground/90">npm run server</code> or <code className="font-data text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground/90">npm run dev:all</code>.
            Rate limited to <span className="font-data text-foreground/90">100 req/min</span> per IP.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="border border-primary/15 rounded-sm overflow-hidden"
            >
              {/* Endpoint header */}
              <div className="px-3 py-2.5 bg-secondary/80 flex items-center gap-2.5 border-b border-primary/10">
                <MethodBadge method={ep.method} />
                <code className="text-sm font-data text-foreground font-medium">{ep.path}</code>
              </div>

              <div className="p-3 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{ep.description}</p>

                {/* Query params table */}
                {ep.params && (
                  <div className="space-y-1.5">
                    <span className="text-xs tracking-[0.15em] text-muted-foreground/80 uppercase font-semibold">
                      Query Parameters
                    </span>
                    <div className="border border-primary/10 rounded-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-secondary/50 border-b border-primary/10">
                            <th className="text-left px-3 py-1.5 text-xs text-muted-foreground font-semibold">Param</th>
                            <th className="text-left px-3 py-1.5 text-xs text-muted-foreground font-semibold">Type</th>
                            <th className="text-left px-3 py-1.5 text-xs text-muted-foreground font-semibold">Default</th>
                            <th className="text-left px-3 py-1.5 text-xs text-muted-foreground font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p) => (
                            <tr key={p.name} className="border-b border-primary/[0.07] last:border-0">
                              <td className="px-3 py-1.5 font-data text-accent">{p.name}</td>
                              <td className="px-3 py-1.5 font-data text-muted-foreground">{p.type}</td>
                              <td className="px-3 py-1.5 font-data text-muted-foreground">{p.default}</td>
                              <td className="px-3 py-1.5 text-foreground/80">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Example request */}
                <div className="space-y-1.5">
                  <span className="text-xs tracking-[0.15em] text-muted-foreground/80 uppercase font-semibold">
                    Example
                  </span>
                  <div className="relative bg-secondary rounded-sm p-3 pr-10">
                    <code className="text-xs font-data text-foreground/90 break-all leading-relaxed">{ep.example}</code>
                    <CopyButton text={ep.example} />
                  </div>
                </div>

                {/* Example response */}
                <div className="space-y-1.5">
                  <span className="text-xs tracking-[0.15em] text-muted-foreground/80 uppercase font-semibold">
                    Response
                  </span>
                  <div className="relative bg-secondary rounded-sm p-3 pr-10">
                    <pre className="text-xs font-data text-foreground/80 leading-relaxed overflow-x-auto">{ep.response}</pre>
                    <CopyButton text={ep.response} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
