import { adminRepository } from "./admin.repository.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";

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
};
