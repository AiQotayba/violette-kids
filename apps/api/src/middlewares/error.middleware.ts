import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(err.message, { stack: err.stack });
  const status = (err as Error & { status?: number }).status ?? 500;
  const message = status >= 500 ? "Internal server error" : err.message;
  sendError(res, message, status);
}
