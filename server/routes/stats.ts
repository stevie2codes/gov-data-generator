import { Router } from "express";
import { getStats } from "../middleware/requestStats.js";

const router = Router();

// GET /api/stats — request statistics
router.get("/", (_req, res) => {
  res.json({ success: true, data: getStats() });
});

export default router;
