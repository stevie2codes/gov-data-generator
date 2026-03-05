import type { Request, Response, NextFunction } from "express";

// ─── In-memory request statistics ───────────────────────────────────────────────

const startTime = Date.now();

const stats = {
  totalRequests: 0,
  totalRecordsGenerated: 0,
  requestsByEndpoint: {} as Record<string, number>,
  requestsByDataType: {} as Record<string, number>,
};

export function statsMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  stats.totalRequests++;
  const endpoint = req.path;
  stats.requestsByEndpoint[endpoint] =
    (stats.requestsByEndpoint[endpoint] || 0) + 1;
  next();
}

export function recordGeneration(dataType: string, count: number): void {
  stats.totalRecordsGenerated += count;
  stats.requestsByDataType[dataType] =
    (stats.requestsByDataType[dataType] || 0) + count;
}

export function getStats() {
  return {
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    totalRequests: stats.totalRequests,
    totalRecordsGenerated: stats.totalRecordsGenerated,
    requestsByEndpoint: { ...stats.requestsByEndpoint },
    requestsByDataType: { ...stats.requestsByDataType },
  };
}
