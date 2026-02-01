import { prisma } from "../../config/db.js";
import { MAX_LIMIT } from "../../config/constants.js";

const select = { id: true, label: true, ageMin: true, ageMax: true } as const;

export const ageGroupsRepository = {
  async findMany(filters: { limit: number; offset: number; search?: string }) {
    const { limit, offset, search } = filters;
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const safeOffset = Math.max(0, offset);
    const where = search?.trim()
      ? { label: { contains: search.trim(), mode: "insensitive" as const } }
      : {};
    const [data, total] = await Promise.all([
      prisma.ageGroup.findMany({ where, select, orderBy: { ageMin: "asc" }, take: safeLimit, skip: safeOffset }),
      prisma.ageGroup.count({ where }),
    ]);
    return { data, total, limit: safeLimit, offset: safeOffset };
  },

  async findById(id: number) {
    return prisma.ageGroup.findUnique({ where: { id }, select });
  },

  async create(data: { label: string; ageMin: number; ageMax: number }) {
    return prisma.ageGroup.create({ data, select });
  },

  async update(id: number, data: { label?: string; ageMin?: number; ageMax?: number }) {
    return prisma.ageGroup.update({ where: { id }, data, select });
  },

  async delete(id: number) {
    return prisma.ageGroup.delete({ where: { id } });
  },
};
