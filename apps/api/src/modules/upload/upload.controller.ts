import type { Request, Response } from "express";
import {
  UPLOAD_ALLOWED_FILE_MIMES,
  UPLOAD_ALLOWED_IMAGE_MIMES,
} from "../../config/constants.js";
import { sendError, sendSuccess } from "../../utils/response.js";

const FILES_SUBDIR = "files";
const IMAGES_SUBDIR = "images";

export const uploadController = {
  uploadFile(req: Request, res: Response): void {
    const file = req.file;
    if (!file) {
      sendError(res, "No file uploaded. Use field name 'file'.", 400);
      return;
    }
    const allowed = [...UPLOAD_ALLOWED_FILE_MIMES];
    if (!allowed.includes(file.mimetype as (typeof allowed)[number])) {
      sendError(
        res,
        `Invalid file type. Allowed: ${allowed.join(", ")}`,
        400
      );
      return;
    }
    const url = `/uploads/${FILES_SUBDIR}/${file.filename}`;
    sendSuccess(res, { url }, 201);
  },

  uploadImage(req: Request, res: Response): void {
    const file = req.file;
    if (!file) {
      sendError(res, "No image uploaded. Use field name 'image'.", 400);
      return;
    }
    const allowed = [...UPLOAD_ALLOWED_IMAGE_MIMES];
    if (!allowed.includes(file.mimetype as (typeof allowed)[number])) {
      sendError(
        res,
        `Invalid image type. Allowed: ${allowed.join(", ")}`,
        400
      );
      return;
    }
    const url = `/uploads/${IMAGES_SUBDIR}/${file.filename}`;
    sendSuccess(res, { url }, 201);
  },
};
