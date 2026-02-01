import { prisma } from "../../config/db.js";
import type { ContentType, Prisma } from "@prisma/client";
import { CONTENT_CATEGORIES_LIMIT, MAX_LIMIT } from "../../config/constants.js";

const contentSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  ageMin: true,
  ageMax: true,
  thumbnailUrl: true,
  contentUrl: true,
  fileUrl: true,
  sourceType: true,
  isActive: true,
  orderIndex: true,
  createdAt: true,
  categories: {
    take: CONTENT_CATEGORIES_LIMIT,
    select: {
      category: {
        select: { id: true, name: true, icon: true },
      },
    },
  },
  ageGroups: {
    select: {
      ageGroup: {
        select: { id: true, label: true, ageMin: true, ageMax: true },
      },
    },
  },
} as const;

export const contentRepository = {
  async findManyPublic(filters: {
    ageMin?: number;
    ageMax?: number;
    type?: ContentType;
    categoryIds?: number[];
    limit: number;
    offset: number;
    search?: string;
  }) {
    const { ageMin, ageMax, type, categoryIds, limit, offset, search } = filters;
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const safeOffset = Math.max(0, offset);

    const where: Prisma.ContentWhereInput = {
      isActive: true,
    };
    if (type) where.type = type;
    if (search?.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }
    // Age filter "3-5" => content overlapping [ageMin, ageMax]: content.ageMin <= ageMax && content.ageMax >= ageMin
    if (ageMin != null) where.ageMax = { gte: ageMin };
    if (ageMax != null) where.ageMin = { lte: ageMax };
    if (categoryIds?.length) {
      where.categories = { some: { categoryId: { in: categoryIds } } };
    }

    const [data, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: contentSelect,
        orderBy: { orderIndex: "asc" },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.content.count({ where }),
    ]);

    return { data, total, limit: safeLimit, offset: safeOffset };
  },

  async findByIdPublic(id: number) {
    return prisma.content.findFirst({
      where: { id, isActive: true },
      select: {
        ...contentSelect,
        pages: {
          orderBy: { pageNumber: "asc" },
          select: { pageNumber: true, imageUrl: true, text: true },
        },
      },
    });
  },

  async findManyAdmin(filters: {
    type?: ContentType;
    categoryIds?: number[];
    limit: number;
    offset: number;
    search?: string;
  }) {
    const { type, categoryIds, limit, offset, search } = filters;
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const safeOffset = Math.max(0, offset);

    const where: Prisma.ContentWhereInput = {};
    if (type) where.type = type;
    if (search?.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ];
    }
    if (categoryIds?.length) {
      where.categories = { some: { categoryId: { in: categoryIds } } };
    }

    const [data, total] = await Promise.all([
      prisma.content.findMany({
        where,
        select: contentSelect,
        orderBy: { orderIndex: "asc" },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.content.count({ where }),
    ]);

    return { data, total, limit: safeLimit, offset: safeOffset };
  },

  async findByIdAdmin(id: number) {
    return prisma.content.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        ageMin: true,
        ageMax: true,
        thumbnailUrl: true,
        contentUrl: true,
        fileUrl: true,
        sourceType: true,
        isActive: true,
        orderIndex: true,
        createdAt: true,
        categories: { select: { categoryId: true, category: { select: { id: true, name: true, icon: true } } } },
        ageGroups: { select: { ageGroupId: true, ageGroup: { select: { id: true, label: true, ageMin: true, ageMax: true } } } },
        pages: { orderBy: { pageNumber: "asc" }, select: { id: true, pageNumber: true, imageUrl: true, text: true } },
      },
    });
  },

  async create(data: {
    title: string;
    description?: string | null;
    type: ContentType;
    ageMin: number;
    ageMax: number;
    thumbnailUrl?: string | null;
    contentUrl?: string | null;
    fileUrl?: string | null;
    sourceType: "uploaded" | "youtube" | "external";
    isActive?: boolean;
    orderIndex?: number;
    categoryIds?: number[];
    ageGroupIds?: number[];
    pages?: { pageNumber: number; imageUrl: string; text?: string | null }[];
  }) {
    const { categoryIds, ageGroupIds, pages: pagesData, ...rest } = data;
    return prisma.content.create({
      data: {
        ...rest,
        ...(categoryIds?.length
          ? { categories: { create: categoryIds.map((categoryId) => ({ categoryId })) } }
          : {}),
        ...(ageGroupIds?.length
          ? { ageGroups: { create: ageGroupIds.map((ageGroupId) => ({ ageGroupId })) } }
          : {}),
        ...(pagesData?.length
          ? { pages: { create: pagesData.map((p) => ({ pageNumber: p.pageNumber, imageUrl: p.imageUrl, text: p.text ?? null })) } }
          : {}),
      },
      select: contentSelect,
    });
  },

  async update(
    id: number,
    data: Partial<{
      title: string;
      description: string | null;
      type: ContentType;
      ageMin: number;
      ageMax: number;
      thumbnailUrl: string | null;
      contentUrl: string | null;
      fileUrl: string | null;
      sourceType: "uploaded" | "youtube" | "external";
      isActive: boolean;
      orderIndex: number;
      categoryIds: number[];
      ageGroupIds: number[];
    }>
  ) {
    const { categoryIds, ageGroupIds, ...rest } = data;
    if (categoryIds) {
      await prisma.contentCategory.deleteMany({ where: { contentId: id } });
      if (categoryIds.length) {
        await prisma.contentCategory.createMany({
          data: categoryIds.map((categoryId) => ({ contentId: id, categoryId })),
        });
      }
    }
    if (ageGroupIds) {
      await prisma.contentAgeGroup.deleteMany({ where: { contentId: id } });
      if (ageGroupIds.length) {
        await prisma.contentAgeGroup.createMany({
          data: ageGroupIds.map((ageGroupId) => ({ contentId: id, ageGroupId })),
        });
      }
    }
    return prisma.content.update({
      where: { id },
      data: rest,
      select: contentSelect,
    });
  },

  async delete(id: number) {
    return prisma.content.delete({ where: { id } });
  },
};
