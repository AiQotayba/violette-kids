import { prisma } from "../../config/db.js";
import { MAX_LIMIT } from "../../config/constants.js";

const selectSafe = { id: true, name: true, email: true, createdAt: true } as const;
const selectWithPassword = { id: true, name: true, email: true, password: true, createdAt: true } as const;

export const adminRepository = {
  async findById(id: number) {
    return prisma.admin.findUnique({
      where: { id },
      select: selectSafe,
    });
  },

  async findByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: selectWithPassword,
    });
  },

  async findMany(filters: { limit: number; offset: number; search?: string }) {
    const { limit, offset, search } = filters;
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const safeOffset = Math.max(0, offset);
    const where = search?.trim()
      ? {
          OR: [
            { name: { contains: search.trim(), mode: "insensitive" as const } },
            { email: { contains: search.trim(), mode: "insensitive" as const } },
          ],
        }
      : {};
    const [data, total] = await Promise.all([
      prisma.admin.findMany({
        where,
        select: selectSafe,
        orderBy: { createdAt: "desc" },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.admin.count({ where }),
    ]);
    return { data, total, limit: safeLimit, offset: safeOffset };
  },

  async findUserById(id: number) {
    return prisma.admin.findUnique({
      where: { id },
      select: selectSafe,
    });
  },

  async create(data: { name: string; email: string; password: string }) {
    const created = await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email.trim().toLowerCase(),
        password: data.password,
      },
      select: selectSafe,
    });
    return created;
  },

  async update(id: number, data: { name?: string; email?: string; password?: string }) {
    const updateData: { name?: string; email?: string; password?: string } = { ...data };
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    return prisma.admin.update({
      where: { id },
      data: updateData,
      select: selectSafe,
    });
  },

  async delete(id: number) {
    return prisma.admin.delete({ where: { id } });
  },
};
