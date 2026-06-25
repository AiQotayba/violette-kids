import { createPrismaClient } from "../lib/create-prisma-client.js";
import { logger } from "../utils/logger.js";

const prisma = createPrismaClient();

if (process.env.NODE_ENV === "development") {
  (prisma as unknown as { $on: (event: string, cb: (e: unknown) => void) => void }).$on(
    "query",
    (e: unknown) => {
      const ev = e as { query?: string; duration?: number };
      logger.debug?.("query", { query: ev.query, duration: ev.duration });
    },
  );
}

export { prisma };
