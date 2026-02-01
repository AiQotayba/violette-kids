import type { Express } from "express";
import { contentRoutes } from "./modules/content/content.routes.js";
import { categoriesRoutes } from "./modules/categories/categories.routes.js";
import { ageGroupsRoutes } from "./modules/age-groups/age-groups.routes.js";
import { settingsRoutes } from "./modules/settings/settings.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";

export function registerRoutes(app: Express): void {
  const base = "/api";

  // Public (PRD: GET /content, /categories, /age-groups, /settings)
  app.use(`${base}/content`, contentRoutes.public);
  app.use(`${base}/categories`, categoriesRoutes.public);
  app.use(`${base}/age-groups`, ageGroupsRoutes.public);
  app.use(`${base}/settings`, settingsRoutes.public);

  // Admin (JWT required)
  app.use(`${base}/admin`, adminRoutes.router);
}
