import type { Request, Response, NextFunction } from "express";

// ─── Error codes ────────────────────────────────────────────────────────────────

export const ErrorCodes = {
  UNKNOWN_TYPE: "UNKNOWN_TYPE",
  INVALID_PARAM: "INVALID_PARAM",
  RATE_LIMITED: "RATE_LIMITED",
  UNKNOWN_SCENARIO: "UNKNOWN_SCENARIO",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

// ─── Structured API error ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public hint?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Express error-handling middleware (must have 4 args) ────────────────────────

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.hint && { hint: err.hint }),
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  // Unexpected errors
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: "An unexpected error occurred.",
    },
  });
}
