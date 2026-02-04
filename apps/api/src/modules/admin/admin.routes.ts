import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import { contentRoutes } from "../content/content.routes.js";
import { categoriesRoutes } from "../categories/categories.routes.js";
import { ageGroupsRoutes } from "../age-groups/age-groups.routes.js";
import { settingsRoutes } from "../settings/settings.routes.js";
import { uploadRoutes } from "../upload/upload.routes.js";

const router = Router();

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags: [Admin_Auth]    
 *     summary: تسجيل دخول المدير
 *     description: يرجع JWT وبيانات المدير. لا يتطلب توثيقاً.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginBody' }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResponse' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: بريد أو كلمة مرور غير صحيحة
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/login", adminController.login);


/**
 * @openapi
 * /admin/me:
 *   get:
 *     tags: [Admin_Users]
 *     summary: بيانات المدير الحالي
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Admin' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get("/me", authMiddleware, adminController.me);

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: إحصائيات لوحة التحكم
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: إجماليات المحتوى، التصنيفات، الفئات العمرية، وآخر المحتوى
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalContent: { type: integer }
 *                 totalStories: { type: integer }
 *                 totalVideos: { type: integer }
 *                 totalGames: { type: integer }
 *                 totalCategories: { type: integer }
 *                 totalAgeGroups: { type: integer }
 *                 activeContent: { type: integer }
 *                 recentContent: { type: array, items: { $ref: '#/components/schemas/Content' } }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get("/dashboard", authMiddleware, adminController.getDashboard);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin_Users]
 *     summary: قائمة مديري النظام
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
 *         description: بحث في الاسم أو البريد
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaginatedAdmins' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get("/users", authMiddleware, adminController.listUsers);

/**
 * @openapi
 * /admin/users:
 *   post:
 *     tags: [Admin_Users]
 *     summary: إنشاء مدير جديد
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdminCreateBody' }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Admin' }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: مدير بنفس البريد موجود
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/users", authMiddleware, adminController.createUser);

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     tags: [Admin_Users]
 *     summary: تفاصيل مدير بالمعرف
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
 *             schema: { $ref: '#/components/schemas/Admin' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get("/users/:id", authMiddleware, adminController.getUserById);

/**
 * @openapi
 * /admin/users/{id}:
 *   put:
 *     tags: [Admin_Users]
 *     summary: تحديث مدير
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdminUpdateBody' }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Admin' }
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
router.put("/users/:id", authMiddleware, adminController.updateUser);

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     tags: [Admin_Users]
 *     summary: حذف مدير
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
router.delete("/users/:id", authMiddleware, adminController.deleteUser);

router.use("/content", contentRoutes.admin); // not authenticated
router.use("/categories", authMiddleware, categoriesRoutes.admin); // authenticated
router.use("/age-groups", authMiddleware, ageGroupsRoutes.admin); // authenticated
router.use("/settings", authMiddleware, settingsRoutes.admin); // authenticated
router.use("/upload", authMiddleware, uploadRoutes.router); // authenticated

export const adminRoutes: { router: Router } = { router };
