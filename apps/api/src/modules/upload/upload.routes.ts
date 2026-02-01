import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { Router } from "express";
import multer from "multer";
import { uploadController } from "./upload.controller.js";
import {
  UPLOAD_MAX_FILE_SIZE,
  UPLOAD_ALLOWED_FILE_MIMES,
  UPLOAD_ALLOWED_IMAGE_MIMES,
} from "../../config/constants.js";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const FILES_SUBDIR = "files";
const IMAGES_SUBDIR = "images";

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getExtension(mimetype: string): string {
  const map: Record<string, string> = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
  };
  return map[mimetype] ?? "";
}

const filesDir = path.join(UPLOADS_DIR, FILES_SUBDIR);
const imagesDir = path.join(UPLOADS_DIR, IMAGES_SUBDIR);
ensureDir(filesDir);
ensureDir(imagesDir);

const fileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(filesDir);
    cb(null, filesDir);
  },
  filename: (_req, file, cb) => {
    const ext = getExtension(file.mimetype) || path.extname(file.originalname) || ".bin";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(imagesDir);
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    const ext = getExtension(file.mimetype) || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const uploadFile = multer({
  storage: fileStorage,
  limits: { fileSize: UPLOAD_MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = [...UPLOAD_ALLOWED_FILE_MIMES];
    if (allowed.includes(file.mimetype as (typeof allowed)[number])) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowed.join(", ")}`));
    }
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: UPLOAD_MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = [...UPLOAD_ALLOWED_IMAGE_MIMES];
    if (allowed.includes(file.mimetype as (typeof allowed)[number])) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid image type. Allowed: ${allowed.join(", ")}`));
    }
  },
});

const router = Router();

/**
 * @openapi
 * /admin/upload/file:
 *   post:
 *     tags: [Admin_Upload]
 *     summary: رفع ملف (مثل PDF)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: ملف PDF
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string, description: "رابط الملف (مثل /uploads/files/xxx.pdf)" }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/file", uploadFile.single("file"), uploadController.uploadFile);

/**
 * @openapi
 * /admin/upload/image:
 *   post:
 *     tags: [Admin_Upload]
 *     summary: رفع صورة
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: صورة (jpeg, png, gif, webp)
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string, description: "رابط الصورة (مثل /uploads/images/xxx.jpg)" }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/image", uploadImage.single("image"), uploadController.uploadImage);

export const uploadRoutes = { router: router as Router };
