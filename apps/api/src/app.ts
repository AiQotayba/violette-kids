import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { publicRateLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { registerRoutes } from "./routes.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files (e.g. /uploads/files/xxx.pdf, /uploads/images/xxx.jpg)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Public API: rate limit
app.use("/api", publicRateLimiter);

// Swagger at /api-docs (PRD: /api-docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Raw OpenAPI spec (for GPT / tools)
app.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.get("/openapi.yaml", (_req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const yaml = require("js-yaml") as { dump: (obj: unknown, opts?: { lineWidth?: number }) => string };
  res.setHeader("Content-Type", "text/yaml");
  res.send(yaml.dump(swaggerSpec, { lineWidth: -1 }));
});

registerRoutes(app);

app.use(errorMiddleware);

export { app };
