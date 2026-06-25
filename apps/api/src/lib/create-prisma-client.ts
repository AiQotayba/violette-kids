import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { parseMysqlUrl, resolveDatabaseProvider } from "./database-url.js";

export function createPrismaClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const provider = resolveDatabaseProvider(connectionString);
  const log: Array<Prisma.LogLevel | Prisma.LogDefinition> =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  if (provider === "mysql") {
    const adapter = new PrismaMariaDb(parseMysqlUrl(connectionString));
    return new PrismaClient({ adapter, log });
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log,
  });
}
