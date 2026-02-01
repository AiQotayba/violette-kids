#!/usr/bin/env node
/**
 * Builds all API documentation: OpenAPI spec + Postman collection.
 * Run from apps/api: pnpm run docs:build  or  node scripts/build-docs.cjs
 */
const { execSync } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const run = (cmd, opts = {}) => execSync(cmd, { cwd: rootDir, stdio: "inherit", ...opts });

console.log("🚀 Building API documentation...\n");

run("pnpm run docs:generate");
console.log("");
run("pnpm run postman:generate");

console.log("\n✅ Documentation build complete!");
console.log("📁 Generated files:");
console.log("   - openapi.json (for GPT / tools)");
console.log("   - openapi.yaml (human readable)");
console.log("   - postman-collection.json (import in Postman)");
console.log("   - postman-environment.json (baseUrl, jwtToken)");
console.log("\n🌐 Swagger UI: http://localhost:4000/api-docs (when server is running)");
