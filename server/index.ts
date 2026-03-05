import express from "express";
import cors from "cors";

// Routes
import datasetsRouter from "./routes/datasets.js";
import scenariosRouter from "./routes/scenarios.js";
import statsRouter from "./routes/stats.js";
import docsRouter from "./routes/docs.js";

// Middleware
import { statsMiddleware } from "./middleware/requestStats.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3001;

// ─── Global middleware ────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(statsMiddleware);
app.use(rateLimiterMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/datasets", datasetsRouter);
app.use("/api/scenarios", scenariosRouter);
app.use("/api/stats", statsRouter);
app.use("/api", docsRouter); // GET /api/openapi.json & /api/docs

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handler (must be last) ─────────────────────────────────────────────

app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  Mock Data API running at http://localhost:${PORT}\n`);
  console.log(`  Endpoints:`);
  console.log(`    GET /api/datasets              — list data types`);
  console.log(`    GET /api/datasets/:type         — generate data`);
  console.log(`    GET /api/datasets/:type/schema  — field definitions`);
  console.log(`    GET /api/scenarios              — list scenarios`);
  console.log(`    GET /api/scenarios/:name        — generate relational data`);
  console.log(`    GET /api/stats                  — request statistics`);
  console.log(`    GET /api/health                 — health check`);
  console.log(`    GET /api/openapi.json           — OpenAPI 3.0 spec`);
  console.log(`    GET /api/docs                   — Swagger UI\n`);
});
