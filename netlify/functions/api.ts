import express from "express";
import cors from "cors";
import serverless from "serverless-http";

// Routes
import datasetsRouter from "../../server/routes/datasets.js";
import scenariosRouter from "../../server/routes/scenarios.js";
import statsRouter from "../../server/routes/stats.js";
import docsRouter from "../../server/routes/docs.js";

// Middleware
import { statsMiddleware } from "../../server/middleware/requestStats.js";
import { rateLimiterMiddleware } from "../../server/middleware/rateLimiter.js";
import { errorHandler } from "../../server/middleware/errorHandler.js";

const app = express();

// ─── Global middleware ────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(statsMiddleware);
app.use(rateLimiterMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/datasets", datasetsRouter);
app.use("/api/scenarios", scenariosRouter);
app.use("/api/stats", statsRouter);
app.use("/api", docsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handler (must be last) ─────────────────────────────────────────────

app.use(errorHandler);

// ─── Serverless export ────────────────────────────────────────────────────────

export const handler = serverless(app);
