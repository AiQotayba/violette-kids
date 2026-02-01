import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? [{ emit: "event", level: "query" }, { emit: "stdout", level: "error" }]
      : [{ emit: "stdout", level: "error" }],
});

if (process.env.NODE_ENV === "development") {
  (prisma as unknown as { $on: (event: string, cb: (e: unknown) => void) => void }).$on(
    "query",
    (e: unknown) => {
      const ev = e as { query?: string; duration?: number };
      logger.debug?.("query", { query: ev.query, duration: ev.duration });
    }
  );
}

export { prisma };
