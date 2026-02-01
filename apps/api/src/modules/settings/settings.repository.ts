import { prisma } from "../../config/db.js";
import { MAX_LIMIT } from "../../config/constants.js";

const select = { id: true, key: true, value: true } as const;

export const settingsRepository = {
  async findMany(filters: { limit: number; offset: number; search?: string }) {
    const { limit, offset, search } = filters;
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const safeOffset = Math.max(0, offset);
    const where = search?.trim()
      ? { OR: [{ key: { contains: search.trim(), mode: "insensitive" as const } }, { value: { contains: search.trim(), mode: "insensitive" as const } }] }
      : {};
    const [data, total] = await Promise.all([
      prisma.appSetting.findMany({ where, select, orderBy: { key: "asc" }, take: safeLimit, skip: safeOffset }),
      prisma.appSetting.count({ where }),
    ]);
    return { data, total, limit: safeLimit, offset: safeOffset };
  },

  async findById(id: number) {
    return prisma.appSetting.findUnique({ where: { id }, select });
  },

  async create(data: { key: string; value: string }) {
    return prisma.appSetting.create({ data, select });
  },

  async update(id: number, data: { key?: string; value?: string }) {
    return prisma.appSetting.update({ where: { id }, data, select });
  },

  async delete(id: number) {
    return prisma.appSetting.delete({ where: { id } });
  },
};
