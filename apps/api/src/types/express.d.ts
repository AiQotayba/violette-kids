/// <reference types="multer" />
import type { JwtPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
      file?: Express.Multer.File;
    }
  }
}

export {};
