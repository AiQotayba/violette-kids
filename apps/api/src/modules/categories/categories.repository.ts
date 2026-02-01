import { prisma } from "../../config/db.js";
import { MAX_LIMIT } from "../../config/constants.js";

const select = { id: true, name: true, icon: true } as const;

export const categoriesRepository = {
  async findMany(filters: { limit: number; offset: number; search?: string }) {
    const { limit, offset, search } = filters;
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const safeOffset = Math.max(0, offset);
    const where = search?.trim()
      ? { name: { contains: search.trim(), mode: "insensitive" as const } }
      : {};
    const [data, total] = await Promise.all([
      prisma.category.findMany({ where, select, orderBy: { name: "asc" }, take: safeLimit, skip: safeOffset }),
      prisma.category.count({ where }),
    ]);
    return { data, total, limit: safeLimit, offset: safeOffset };
  },

  async findById(id: number) {
    return prisma.category.findUnique({ where: { id }, select });
  },

  async create(data: { name: string; icon?: string | null }) {
    return prisma.category.create({ data, select });
  },

  async update(id: number, data: { name?: string; icon?: string | null }) {
    return prisma.category.update({ where: { id }, data, select });
  },

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  },
};
