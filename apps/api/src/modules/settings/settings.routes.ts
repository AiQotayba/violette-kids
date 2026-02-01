import { Router } from "express";
import { settingsController } from "./settings.controller.js";
import { authMiddleware } from "../admin/auth.middleware.js";

const publicRouter = Router();

/**
 * @openapi
 * /settings:
 *   get:
 *     tags: [Public]
 *     summary: قائمة الإعدادات (عام)
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
 *             schema: { $ref: '#/components/schemas/PaginatedSettings' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
publicRouter.get("/", settingsController.listPublic);

const adminRouter = Router();

/**
 * @openapi
 * /admin/settings:
 *   get:
 *     tags: [Admin_Settings]
 *     summary: قائمة الإعدادات (إدارة)
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
 *             schema: { $ref: '#/components/schemas/PaginatedSettings' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get("/", authMiddleware, settingsController.listAdmin);

/**
 * @openapi
 * /admin/settings:
 *   post:
 *     tags: [Admin_Settings]
 *     summary: إنشاء إعداد
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AppSettingCreateBody' }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppSetting' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: إعداد بنفس key موجود
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.post("/", settingsController.create);

/**
 * @openapi
 * /admin/settings/{id}:
 *   get:
 *     tags: [Admin_Settings]
 *     summary: تفاصيل إعداد بالمعرف
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
 *             schema: { $ref: '#/components/schemas/AppSetting' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get("/:id", settingsController.getById);

/**
 * @openapi
 * /admin/settings/{id}:
 *   put:
 *     tags: [Admin_Settings]
 *     summary: تحديث إعداد
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AppSettingUpdateBody' }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppSetting' }
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
adminRouter.put("/:id", settingsController.update);

/**
 * @openapi
 * /admin/settings/{id}:
 *   delete:
 *     tags: [Admin_Settings]
 *     summary: حذف إعداد
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
adminRouter.delete("/:id", settingsController.delete);

export const settingsRoutes: { public: Router; admin: Router } = {
  public: publicRouter,
  admin: adminRouter,
};
