import { Router } from "express";
import { contentController } from "./content.controller.js";
import { authMiddleware } from "../admin/auth.middleware.js";

const publicRouter = Router();

/**
 * @openapi
 * /content:
 *   get:
 *     tags: [Public]
 *     summary: قائمة المحتوى (عام)
 *     description: يرجع محتوى منشور مع فلترة عمر، نوع، فئات، بحث. كل عنصر يحتوي حتى 3 فئات.
 *     parameters:
 *       - in: query
 *         name: age
 *         schema: { type: string, example: "3-5" }
 *         description: نطاق عمر (مثال 3-5، 6-8)
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [story, video, game] }
 *         description: نوع المحتوى
 *       - in: query
 *         name: category
 *         schema: { type: string, example: "1" }
 *         description: معرفات الفئات مفصولة بفاصلة
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: بديل عن offset (يُحسب offset = (page-1)*limit)
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: بحث في العنوان والوصف
 *     responses:
 *       200:
 *         description: قائمة منسقة مع data, total, limit, offset
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaginatedContent' }
 *       400:
 *         description: معاملات غير صالحة
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: خطأ داخلي
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
publicRouter.get("/", contentController.listPublic);

/**
 * @openapi
 * /content/{id}:
 *   get:
 *     tags: [Public]
 *     summary: تفاصيل محتوى بالمعرف (عام)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: تفاصيل المحتوى (بما فيها pages للقصص)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Content' }
 *       400:
 *         description: معرف غير صالح
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: المحتوى غير موجود
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
publicRouter.get("/:id", contentController.getByIdPublic);

const adminRouter = Router();

/**
 * @openapi
 * /admin/content:
 *   get:
 *     tags: [Admin_Content]
 *     summary: قائمة المحتوى (إدارة)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [story, video, game] }
 *       - in: query
 *         name: category
 *         schema: { type: string, example: "1,2,3" }
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
 *             schema: { $ref: '#/components/schemas/PaginatedContent' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get("/", authMiddleware, contentController.listAdmin);

/**
 * @openapi
 * /admin/content:
 *   post:
 *     tags: [Admin_Content]
 *     summary: إنشاء محتوى
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ContentCreateBody' }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Content' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.post("/", authMiddleware, contentController.create);

/**
 * @openapi
 * /admin/content/{id}:
 *   get:
 *     tags: [Admin_Content]
 *     summary: تفاصيل محتوى بالمعرف (إدارة)
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
 *             schema: { $ref: '#/components/schemas/Content' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.get("/:id", authMiddleware, contentController.getByIdAdmin);

/**
 * @openapi
 * /admin/content/{id}:
 *   put:
 *     tags: [Admin_Content]
 *     summary: تحديث محتوى
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ContentUpdateBody' }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Content' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.put("/:id", authMiddleware, contentController.update);

/**
 * @openapi
 * /admin/content/{id}:
 *   delete:
 *     tags: [Admin_Content]
 *     summary: حذف محتوى
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
adminRouter.delete("/:id", authMiddleware, contentController.delete);

/**
 * @openapi
 * /admin/content/reorder:
 *   patch:
 *     tags: [Admin_Content]
 *     summary: تحديث ترتيب المحتوى
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order]
 *             properties:
 *               order:
 *                 type: array
 *                 items: { type: object, required: [id, orderIndex], properties: { id: { type: integer }, orderIndex: { type: integer } } }
 *     responses:
 *       200:
 *         description: تم تحديث الترتيب
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
adminRouter.patch("/reorder", authMiddleware, contentController.reorder);

export const contentRoutes: { public: Router; admin: Router } = {
  public: publicRouter,
  admin: adminRouter,
};
