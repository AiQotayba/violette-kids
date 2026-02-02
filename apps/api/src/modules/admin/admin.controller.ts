import type { Request, Response } from "express";
import { adminService } from "./admin.service.js";
import { sendError, sendSuccess } from "../../utils/response.js";
import { z } from "zod";

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
  search: z.string().optional(),
});

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
const createUserSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();
const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  })
  .strict();
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) }).strict();

export const adminController = {
  async me(req: Request, res: Response): Promise<void> {
    const adminId = req.admin?.sub;
    if (!adminId) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const admin = await adminService.getMe(adminId);
    if (!admin) {
      sendError(res, "Admin not found", 404);
      return;
    }
    sendSuccess(res, admin);
  },

  async login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    const result = await adminService.login(parsed.data.email, parsed.data.password);
    if (!result) {
      sendError(res, "Invalid email or password", 401);
      return;
    }
    sendSuccess(res, result);
  },

  async listUsers(req: Request, res: Response): Promise<void> {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    const { limit = 10, offset = 0, page, search } = parsed.data;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safeOffset = page != null ? (Math.max(1, page) - 1) * safeLimit : Math.max(0, offset);
    const result = await adminService.getUsersList(safeLimit, safeOffset, search);
    sendSuccess(res, result);
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const user = await adminService.getUserById(parsed.data.id);
    if (!user) {
      sendError(res, "Admin user not found", 404);
      return;
    }
    sendSuccess(res, user);
  },

  async createUser(req: Request, res: Response): Promise<void> {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      const created = await adminService.createUser(parsed.data);
      sendSuccess(res, created, 201);
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2002") sendError(res, "Admin with this email already exists", 409);
      else sendError(res, (e as Error).message, 500);
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    const paramParsed = idParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const bodyParsed = updateUserSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      sendError(res, bodyParsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      const updated = await adminService.updateUser(paramParsed.data.id, bodyParsed.data);
      sendSuccess(res, updated);
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2025") sendError(res, "Admin user not found", 404);
      else if (err.code === "P2002") sendError(res, "Admin with this email already exists", 409);
      else sendError(res, (e as Error).message, 500);
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      await adminService.deleteUser(parsed.data.id);
      res.status(204).send();
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2025") sendError(res, "Admin user not found", 404);
      else sendError(res, (e as Error).message, 500);
    }
  },
};
