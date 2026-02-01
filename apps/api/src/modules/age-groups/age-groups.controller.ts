import type { Request, Response } from "express";
import { ageGroupsService } from "./age-groups.service.js";
import { sendError, sendSuccess } from "../../utils/response.js";
import { z } from "zod";

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
  search: z.string().optional(),
});

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
const createSchema = z.object({ label: z.string().min(1), ageMin: z.number().int().min(0), ageMax: z.number().int().min(0) }).strict();
const updateSchema = z.object({ label: z.string().min(1).optional(), ageMin: z.number().int().min(0).optional(), ageMax: z.number().int().min(0).optional() }).strict();

export const ageGroupsController = {
  async listPublic(req: Request, res: Response): Promise<void> {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join("; "), 400);
      return;
    }
    const { limit = 10, offset = 0, page, search } = parsed.data;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safeOffset = page != null ? (Math.max(1, page) - 1) * safeLimit : Math.max(0, offset);
    const result = await ageGroupsService.getList({ limit: safeLimit, offset: safeOffset, search });
    sendSuccess(res, result);
  },

  async listAdmin(req: Request, res: Response): Promise<void> {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join("; "), 400);
      return;
    }
    const { limit = 10, offset = 0, page, search } = parsed.data;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safeOffset = page != null ? (Math.max(1, page) - 1) * safeLimit : Math.max(0, offset);
    const result = await ageGroupsService.getList({ limit: safeLimit, offset: safeOffset, search });
    sendSuccess(res, result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const item = await ageGroupsService.getById(parsed.data.id);
    if (!item) {
      sendError(res, "Age group not found", 404);
      return;
    }
    sendSuccess(res, item);
  },

  async create(req: Request, res: Response): Promise<void> {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join("; "), 400);
      return;
    }
    try {
      const created = await ageGroupsService.create(parsed.data);
      sendSuccess(res, created, 201);
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2002") sendError(res, "Age group with this label already exists", 409);
      else sendError(res, (e as Error).message, 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    const paramParsed = idParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const bodyParsed = updateSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      sendError(res, bodyParsed.error.errors.map((e) => e.message).join("; "), 400);
      return;
    }
    try {
      const updated = await ageGroupsService.update(paramParsed.data.id, bodyParsed.data);
      sendSuccess(res, updated);
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2025") sendError(res, "Age group not found", 404);
      else if (err.code === "P2002") sendError(res, "Age group with this label already exists", 409);
      else sendError(res, (e as Error).message, 500);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      await ageGroupsService.delete(parsed.data.id);
      res.status(204).send();
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2025") sendError(res, "Age group not found", 404);
      else sendError(res, (e as Error).message, 500);
    }
  },
};
