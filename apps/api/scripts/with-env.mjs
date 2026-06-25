import { config } from "dotenv";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { materializePrismaSchema } from "./materialize-schema.mjs";

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const name of [".env", ".env.local"]) {
  const envPath = resolve(apiRoot, name);
  if (existsSync(envPath)) {
    config({ path: envPath, override: true });
  }
}

const args = process.argv.slice(2);
const isGenerateOnly = args.length === 1 && args[0] === "generate";

if (isGenerateOnly && !process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = "postgresql://build:build@127.0.0.1:5432/build";
  process.env.DATABASE_PROVIDER = "postgresql";
}

const dbUrl = process.env.DATABASE_URL?.trim();
const dbProvider = process.env.DATABASE_PROVIDER?.trim().toLowerCase();
const validDb =
  dbUrl?.startsWith("mysql://") || dbUrl?.startsWith("postgresql://");
const validProvider = dbProvider === "mysql" || dbProvider === "postgresql";

if (!validDb) {
  const preview = dbUrl
    ? dbUrl.replace(/:[^:@]+@/, ":****@").slice(0, 60)
    : "(empty or unset)";
  console.error("DATABASE_URL must start with mysql:// or postgresql://");
  console.error(`Expected in: ${resolve(apiRoot, ".env")}`);
  console.error(`Current value: ${preview}`);
  process.exit(1);
}

if (!validProvider) {
  console.error('DATABASE_PROVIDER must be "mysql" or "postgresql"');
  console.error(`Expected in: ${resolve(apiRoot, ".env")}`);
  process.exit(1);
}

if (dbProvider === "mysql" && !dbUrl.startsWith("mysql://")) {
  console.error("DATABASE_PROVIDER=mysql but DATABASE_URL is not mysql://");
  process.exit(1);
}

if (
  dbProvider === "postgresql" &&
  !dbUrl.startsWith("postgresql://") &&
  !dbUrl.startsWith("postgres://")
) {
  console.error("DATABASE_PROVIDER=postgresql but DATABASE_URL is not postgresql://");
  process.exit(1);
}

materializePrismaSchema(dbProvider, apiRoot);

if (args.length === 0) {
  console.error("Usage: node scripts/with-env.mjs <prisma-args...>");
  process.exit(1);
}

const schemaPath = resolve(apiRoot, ".prisma/schema");
const prismaArgs = [...args, "--schema", schemaPath];

const binDir = resolve(apiRoot, "node_modules/.bin");
const prismaBin = ["prisma.CMD", "prisma.cmd", "prisma"].find((name) =>
  existsSync(resolve(binDir, name)),
);

if (!prismaBin) {
  console.error("Prisma CLI not found. Run pnpm install in apps/api first.");
  process.exit(1);
}

const result = spawnSync(resolve(binDir, prismaBin), prismaArgs, {
  cwd: apiRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

process.exit(result.status ?? 1);
