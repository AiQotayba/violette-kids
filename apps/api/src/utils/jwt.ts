import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, env.JWT_SECRET as string, { expiresIn: env.JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"] });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET as string) as unknown as JwtPayload;
  return decoded;
}
