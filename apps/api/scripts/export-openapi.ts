/**
 * Exports OpenAPI spec to openapi.json and openapi.yaml.
 * Run from apps/api: pnpm run docs:generate
 */
/// <reference types="node" />
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerSpec } from "../src/config/swagger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const outJson = path.join(rootDir, "openapi.json");
const outYaml = path.join(rootDir, "openapi.yaml");

fs.writeFileSync(outJson, JSON.stringify(swaggerSpec, null, 2));
const yaml = require("js-yaml") as { dump: (obj: unknown, opts?: { lineWidth?: number }) => string };
fs.writeFileSync(outYaml, yaml.dump(swaggerSpec, { lineWidth: -1 }));

console.log("✅ OpenAPI specs exported:");
console.log("   - openapi.json");
console.log("   - openapi.yaml");
