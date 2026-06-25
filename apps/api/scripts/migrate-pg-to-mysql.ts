/**
 * Backup PostgreSQL + copy all app data to MySQL.
 *
 * Usage:
 *   1. Copy .env.migrate.example → .env.migrate
 *   2. Fill SOURCE_DATABASE_URL (PostgreSQL) and TARGET_DATABASE_URL (MySQL)
 *   3. Ensure MySQL schema exists: TARGET_DATABASE_URL=... DATABASE_PROVIDER=mysql pnpm db:push
 *   4. pnpm db:migrate:to-mysql
 *
 * Env:
 *   SOURCE_DATABASE_URL — PostgreSQL (Supabase / local)
 *   TARGET_DATABASE_URL — MySQL (VPS)
 *   SKIP_BACKUP=true     — skip pg_dump step
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";
import { createPrismaClient } from "../src/lib/create-prisma-client.js";
import { materializePrismaSchema } from "./materialize-schema.mjs";

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const name of [".env.migrate", ".env.local", ".env"]) {
  const envPath = resolve(apiRoot, name);
  if (existsSync(envPath)) {
    config({ path: envPath, override: name !== ".env.migrate" });
  }
}

const sourceUrl = process.env.SOURCE_DATABASE_URL?.trim();
const targetUrl = process.env.TARGET_DATABASE_URL?.trim();

if (!sourceUrl?.startsWith("postgresql://") && !sourceUrl?.startsWith("postgres://")) {
  console.error("SOURCE_DATABASE_URL must be a PostgreSQL URL (postgresql://...)");
  console.error("Set it in apps/api/.env.migrate");
  process.exit(1);
}

if (!targetUrl?.startsWith("mysql://")) {
  console.error("TARGET_DATABASE_URL must be a MySQL URL (mysql://...)");
  console.error("Set it in apps/api/.env.migrate");
  process.exit(1);
}

function backupPostgres(url: string): string | null {
  if (process.env.SKIP_BACKUP === "true") {
    console.log("Skipping pg_dump (SKIP_BACKUP=true)");
    return null;
  }

  const backupsDir = resolve(apiRoot, "backups");
  mkdirSync(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const file = resolve(backupsDir, `postgres-${stamp}.sql`);

  console.log("==> PostgreSQL backup (pg_dump)...");
  const result = spawnSync("pg_dump", [url, "-f", file, "--no-owner", "--no-acl"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.warn("pg_dump failed — install PostgreSQL client tools or set SKIP_BACKUP=true");
    return null;
  }

  console.log(`Backup saved: ${file}`);
  return file;
}

async function fetchTable(client: pg.Client, table: string, orderBy = "id") {
  const res = await client.query(`SELECT * FROM "${table}" ORDER BY "${orderBy}"`);
  return res.rows;
}

async function fetchJunction(client: pg.Client, table: string) {
  const res = await client.query(`SELECT * FROM "${table}"`);
  return res.rows;
}

async function resetAutoIncrement(prisma: ReturnType<typeof createPrismaClient>, table: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ m: number | null }>>(
    `SELECT COALESCE(MAX(id), 0) AS m FROM \`${table}\``,
  );
  const next = Number(rows[0]?.m ?? 0) + 1;
  await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = ${next}`);
}

async function main() {
  backupPostgres(sourceUrl!);

  console.log("==> Connecting to PostgreSQL...");
  const pgClient = new pg.Client({ connectionString: sourceUrl });
  await pgClient.connect();

  console.log("==> Connecting to MySQL...");
  process.env.DATABASE_URL = targetUrl;
  process.env.DATABASE_PROVIDER = "mysql";
  materializePrismaSchema("mysql", apiRoot);
  const prisma = createPrismaClient(targetUrl);

  const [categories, ageGroups, admins, settings, contents, contentCategories, contentAgeGroups] =
    await Promise.all([
      fetchTable(pgClient, "Category"),
      fetchTable(pgClient, "AgeGroup"),
      fetchTable(pgClient, "Admin"),
      fetchTable(pgClient, "AppSetting"),
      fetchTable(pgClient, "Content"),
      fetchJunction(pgClient, "ContentCategory"),
      fetchJunction(pgClient, "ContentAgeGroup"),
    ]);

  console.log("==> Reading from PostgreSQL:");
  console.log(
    `   categories=${categories.length} ageGroups=${ageGroups.length} admins=${admins.length}`,
  );
  console.log(
    `   settings=${settings.length} contents=${contents.length} links=${contentCategories.length + contentAgeGroups.length}`,
  );

  console.log("==> Clearing MySQL target tables...");
  await prisma.contentCategory.deleteMany();
  await prisma.contentAgeGroup.deleteMany();
  await prisma.content.deleteMany();
  await prisma.category.deleteMany();
  await prisma.ageGroup.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.appSetting.deleteMany();

  console.log("==> Writing to MySQL...");
  for (const row of categories) {
    await prisma.category.create({ data: row });
  }
  for (const row of ageGroups) {
    await prisma.ageGroup.create({ data: row });
  }
  for (const row of admins) {
    await prisma.admin.create({ data: row });
  }
  for (const row of settings) {
    await prisma.appSetting.create({ data: row });
  }
  for (const row of contents) {
    await prisma.content.create({ data: row });
  }
  for (const row of contentCategories) {
    await prisma.contentCategory.create({ data: row });
  }
  for (const row of contentAgeGroups) {
    await prisma.contentAgeGroup.create({ data: row });
  }

  for (const table of ["Category", "AgeGroup", "Admin", "AppSetting", "Content"]) {
    await resetAutoIncrement(prisma, table);
  }

  await pgClient.end();
  await prisma.$disconnect();

  console.log("==> Done. Data copied from PostgreSQL to MySQL.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
