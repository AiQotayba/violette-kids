/**
 * Stub types until you run `pnpm db:generate` (or `prisma generate`).
 * After generation, remove this file; @prisma/client will provide real types.
 */
declare module "@prisma/client" {
  interface PrismaDelegate {
    upsert(args: { where: unknown; update?: unknown; create: unknown }): Promise<Record<string, unknown>>;
  }

  export class PrismaClient {
    constructor(options?: unknown);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    admin: PrismaDelegate;
    category: PrismaDelegate;
    ageGroup: PrismaDelegate;
    appSetting: PrismaDelegate;
    content: PrismaDelegate;
    contentPage: PrismaDelegate;
    contentCategory: PrismaDelegate;
    contentAgeGroup: PrismaDelegate;
  }
}
