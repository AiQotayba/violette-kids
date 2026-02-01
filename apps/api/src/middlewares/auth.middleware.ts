import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Missing or invalid authorization header", 401);
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    req.admin = payload;
    next();
  } catch {
    sendError(res, "Invalid or expired token", 401);
  }
}
