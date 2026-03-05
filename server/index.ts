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
