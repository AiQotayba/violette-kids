/**
 * Creates the database from DATABASE_URL if it doesn't exist.
 * Run once before db:migrate / db:push / db:seed.
 */
import "dotenv/config";
import { Client } from "pg";

function getDbName(url: string): string {
  const u = new URL(url);
  const name = u.pathname.slice(1).replace(/\?.*$/, "") || "postgres";
  return decodeURIComponent(name);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  const dbName = getDbName(url);
  if (dbName === "postgres") {
    console.log("Database name is 'postgres', nothing to create.");
    return;
  }
  const baseUrl = url.replace(/\/[^/]*(\?|$)/, "/postgres$1");
  const client = new Client({ connectionString: baseUrl });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
      console.log(`Created database: ${dbName}`);
    } else {
      console.log(`Database already exists: ${dbName}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
