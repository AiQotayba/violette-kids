import { Router } from "express";
import { ageGroupsController } from "./age-groups.controller.js";
import { authMiddleware } from "../admin/auth.middleware.js";

const publicRouter = Router();

/**
 * @openapi
 * /age-groups:
 *   get:
 *     tags: [Public]
 *     summary: قائمة الفئات العمرية (عام)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0 }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaginatedAgeGroups' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
publicRouter.get("/", ageGroupsController.listPublic);

const adminRouter = Router();

/**
 * @openapi
 * /admin/age-groups:
 *   get:
 *     tags: [Admin_Age_Groups]
 *     summary: قائمة الفئات العمرية (إدارة)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0 }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaginatedAgeGroups' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get("/", ageGroupsController.listAdmin);

/**
 * @openapi
 * /admin/age-groups:
 *   post:
 *     tags: [Admin_Age_Groups]
 *     summary: إنشاء فئة عمرية
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgeGroupCreateBody' }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgeGroup' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: فئة عمرية بنفس label موجودة
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.post("/", ageGroupsController.create);

adminRouter.patch("/reorder", authMiddleware, ageGroupsController.reorder);

/**
 * @openapi
 * /admin/age-groups/{id}:
 *   get:
 *     tags: [Admin_Age_Groups]
 *     summary: تفاصيل فئة عمرية بالمعرف
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgeGroup' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get("/:id", ageGroupsController.getById);

/**
 * @openapi
 * /admin/age-groups/{id}:
 *   put:
 *     tags: [Admin_Age_Groups]
 *     summary: تحديث فئة عمرية
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgeGroupUpdateBody' }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgeGroup' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.put("/:id", ageGroupsController.update);

/**
 * @openapi
 * /admin/age-groups/{id}:
 *   delete:
 *     tags: [Admin_Age_Groups]
 *     summary: حذف فئة عمرية
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: تم الحذف
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.delete("/:id", ageGroupsController.delete);

export const ageGroupsRoutes: { public: Router; admin: Router } = {
  public: publicRouter,
  admin: adminRouter,
};
