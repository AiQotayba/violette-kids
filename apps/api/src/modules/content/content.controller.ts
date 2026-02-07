import type { Request, Response } from "express";
import { contentService } from "./content.service.js";
import { sendError, sendSuccess } from "../../utils/response.js";
import { z } from "zod";
import type { ContentType } from "./content.types.js";

const querySchema = z.object({
  age: z.string().optional(),
  type: z.enum(["story", "video", "game"]).optional(),
  category: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional(),
  search: z.string().optional(),
});

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

const createBodySchema = z
  .object({
    title: z.string().min(1),
    description: z.string().nullable().optional(),
    type: z.enum(["story", "video", "game"]),
    ageMin: z.number().int().min(0),
    ageMax: z.number().int().min(0),
    thumbnailUrl: z.string().url().nullable().optional(),
    contentUrl: z.string().url().nullable().optional(),
    fileUrl: z.string().url().nullable().optional(),
    sourceType: z.enum(["uploaded", "youtube", "external"]),
    isActive: z.boolean().optional(),
    orderIndex: z.number().int().optional(),
    categoryIds: z.array(z.number().int().positive()).optional(),
    ageGroupIds: z.array(z.number().int().positive()).optional(),
    pages: z
      .array(z.object({ pageNumber: z.number().int().min(1), imageUrl: z.string().url(), text: z.string().nullable().optional() }))
      .optional(),
  })
  .strict();

const updateBodySchema = createBodySchema.partial();

const reorderBodySchema = z
  .object({
    order: z.array(
      z.object({ id: z.number().int().positive(), orderIndex: z.number().int().min(0) })
    ),
  })
  .strict();

export const contentController = {
  async listPublic(req: Request, res: Response): Promise<void> {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      const result = await contentService.getListPublic(parsed.data as { age?: string; type?: ContentType; category?: string; limit?: number; offset?: number; page?: number; search?: string });
      sendSuccess(res, result);
    } catch (e) {
      sendError(res, (e as Error).message, 500);
    }
  },

  async getByIdPublic(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const item = await contentService.getByIdPublic(parsed.data.id);
    if (!item) {
      sendError(res, "Content not found", 404);
      return;
    }
    sendSuccess(res, item);
  },

  async listAdmin(req: Request, res: Response): Promise<void> {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      const result = await contentService.getListAdmin(parsed.data as Parameters<typeof contentService.getListAdmin>[0]);
      sendSuccess(res, result);
    } catch (e) {
      sendError(res, (e as Error).message, 500);
    }
  },

  async getByIdAdmin(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const item = await contentService.getByIdAdmin(parsed.data.id);
    if (!item) {
      sendError(res, "Content not found", 404);
      return;
    }
    sendSuccess(res, item);
  },

  async create(req: Request, res: Response): Promise<void> {
    const parsed = createBodySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      const created = await contentService.create(parsed.data as Parameters<typeof contentService.create>[0]);
      sendSuccess(res, created, 201);
    } catch (e) {
      sendError(res, (e as Error).message, 400);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    const paramParsed = idParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    const bodyParsed = updateBodySchema.safeParse(req.body);
    if (!bodyParsed.success) {
      sendError(res, bodyParsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      const updated = await contentService.update(paramParsed.data.id, bodyParsed.data);
      if (!updated) {
        sendError(res, "Content not found", 404);
        return;
      }
      sendSuccess(res, updated);
    } catch (e) {
      sendError(res, (e as Error).message, 400);
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, "Invalid id", 400);
      return;
    }
    try {
      await contentService.delete(parsed.data.id);
      res.status(204).send();
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "P2025") {
        sendError(res, "Content not found", 404);
        return;
      }
      sendError(res, (e as Error).message, 500);
    }
  },

  async reorder(req: Request, res: Response): Promise<void> {
    const parsed = reorderBodySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues.map((e: { message: string }) => e.message).join("; "), 400);
      return;
    }
    try {
      await contentService.reorder(parsed.data.order);
      sendSuccess(res, { order: parsed.data.order });
    } catch (e) {
      sendError(res, (e as Error).message, 500);
    }
  },
};
