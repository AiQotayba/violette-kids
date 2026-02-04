import { prisma } from "../../config/db.js";
import { adminRepository } from "./admin.repository.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";

const recentContentSelect = {
  id: true,
  title: true,
  type: true,
  ageMin: true,
  ageMax: true,
  sourceType: true,
  isActive: true,
  orderIndex: true,
  createdAt: true,
} as const;

export const adminService = {
  async getMe(adminId: number) {
    return adminRepository.findById(adminId);
  },

  async login(email: string, password: string): Promise<{ token: string; admin: { id: number; name: string; email: string } } | null> {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) return null;
    const ok = await comparePassword(password, admin.password);
    if (!ok) return null;
    const token = signToken({ sub: admin.id, email: admin.email });
    return {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  },

  async getUsersList(limit: number, offset: number, search?: string) {
    return adminRepository.findMany({ limit, offset, search });
  },

  async getUserById(id: number) {
    return adminRepository.findUserById(id);
  },

  async createUser(data: { name: string; email: string; password: string }) {
    const hashed = await hashPassword(data.password);
    return adminRepository.create({
      name: data.name,
      email: data.email,
      password: hashed,
    });
  },

  async updateUser(id: number, data: { name?: string; email?: string; password?: string }) {
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }
    return adminRepository.update(id, updateData);
  },

  async deleteUser(id: number) {
    return adminRepository.delete(id);
  },

  async getDashboardStats() {
    const [
      totalContent,
      totalStories,
      totalVideos,
      totalGames,
      totalCategories,
      totalAgeGroups,
      activeContent,
      recentContent,
    ] = await Promise.all([
      prisma.content.count(),
      prisma.content.count({ where: { type: "story" } }),
      prisma.content.count({ where: { type: "video" } }),
      prisma.content.count({ where: { type: "game" } }),
      prisma.category.count(),
      prisma.ageGroup.count(),
      prisma.content.count({ where: { isActive: true } }),
      prisma.content.findMany({
        select: recentContentSelect,
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);
    return {
      totalContent,
      totalStories,
      totalVideos,
      totalGames,
      totalCategories,
      totalAgeGroups,
      activeContent,
      recentContent,
    };
  },
};
