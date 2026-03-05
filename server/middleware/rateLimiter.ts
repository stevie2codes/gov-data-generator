import type { Request, Response, NextFunction } from "express";
import { ApiError, ErrorCodes } from "./errorHandler.js";

// ─── In-memory sliding window rate limiter ──────────────────────────────────────

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100;

const store = new Map<string, number[]>();

export function rateLimiterMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  let timestamps = store.get(ip);
  if (!timestamps) {
    timestamps = [];
    store.set(ip, timestamps);
  }

  // Prune expired timestamps
  const cutoff = now - WINDOW_MS;
  while (timestamps.length > 0 && timestamps[0] <= cutoff) {
    timestamps.shift();
  }

  if (timestamps.length >= MAX_REQUESTS) {
    throw new ApiError(
      429,
      ErrorCodes.RATE_LIMITED,
      "Rate limit exceeded. Maximum 100 requests per minute.",
      "Wait a moment and try again."
    );
  }

  timestamps.push(now);
  next();
}

// Periodic cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of store) {
    const cutoff = now - WINDOW_MS;
    while (timestamps.length > 0 && timestamps[0] <= cutoff) {
      timestamps.shift();
    }
    if (timestamps.length === 0) store.delete(ip);
  }
}, 300_000).unref();
