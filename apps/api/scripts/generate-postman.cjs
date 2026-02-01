/**
 * Generates Postman collection and environment from openapi.json.
 * Run after docs:generate (so openapi.json exists): pnpm run postman:generate
 */
const { convert } = require("openapi-to-postmanv2");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const openapiPath = path.join(rootDir, "openapi.json");

if (!fs.existsSync(openapiPath)) {
  console.error("❌ openapi.json not found. Run: pnpm run docs:generate");
  process.exit(1);
}

const swaggerSpec = JSON.parse(fs.readFileSync(openapiPath, "utf8"));

convert({ type: "json", data: swaggerSpec }, {}, (err, result) => {
  if (err) {
    console.error("❌ Error converting to Postman:", err);
    process.exit(1);
  }

  if (!result.result || !result.output || !result.output[0]) {
    console.error("❌ No Postman output from converter");
    process.exit(1);
  }

  const collection = result.output[0].data;
  const collectionPath = path.join(rootDir, "postman-collection.json");
  fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
  console.log("✅ Postman collection: postman-collection.json");

  const environment = {
    id: "kids-library-env",
    name: "Kids Library Environment",
    values: [
      { key: "baseUrl", value: "http://localhost:4000", type: "default", enabled: true },
      { key: "jwtToken", value: "{{your-jwt-after-login}}", type: "secret", enabled: true },
    ],
    _postman_variable_scope: "environment",
  };
  const envPath = path.join(rootDir, "postman-environment.json");
  fs.writeFileSync(envPath, JSON.stringify(environment, null, 2));
  console.log("✅ Postman environment: postman-environment.json");
});
