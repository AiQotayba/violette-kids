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

const dbProvider = process.env.DATABASE_PROVIDER?.trim().toLowerCase();
if (dbProvider !== "mysql" && dbProvider !== "postgresql") {
  console.error('DATABASE_PROVIDER must be "mysql" or "postgresql"');
  process.exit(1);
}

materializePrismaSchema(dbProvider, apiRoot);

const binDir = resolve(apiRoot, "node_modules/.bin");
const tsxBin = ["tsx", "tsx.cmd", "tsx.CMD"].find((name) =>
  existsSync(resolve(binDir, name)),
);

if (!tsxBin) {
  console.error("tsx not found. Run pnpm install in apps/api first.");
  process.exit(1);
}

const result = spawnSync(resolve(binDir, tsxBin), ["prisma/seed.ts"], {
  cwd: apiRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
