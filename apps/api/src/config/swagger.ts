import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Kids Safe Digital Library API",
    version: "1.0.0",
    description:
      "API لمكتبة أطفال رقمية آمنة: قصص، فيديوهات، ألعاب. واجهة عامة للقراءة فقط + لوحة إدارة (JWT). لا حسابات مستخدمين عامة، لا تتبع أو تحليلات.",
  },
  servers: [
    { url: "http://192.168.1.3:4000/api", description: "Development" },
    { url: "https://api-violette-kids.sy-calculator.com/api", description: "Production" },
  ],
  tags: [
    { name: "Public", description: "Endpoints عامة بدون توثيق", },
    { name: "Admin_Auth", description: "Endpoints إدارة (JWT مطلوب)" },
    { name: "Admin_Users", description: "Endpoints إدارة (JWT مطلوب)" },
    { name: "Admin_Content", description: "Endpoints إدارة (JWT مطلوب)" },
    { name: "Admin_Categories", description: "Endpoints إدارة (JWT مطلوب)" },
    { name: "Admin_Age_Groups", description: "Endpoints إدارة (JWT مطلوب)" },
    { name: "Admin_Settings", description: "Endpoints إدارة (JWT مطلوب)" },
    { name: "Admin_Upload", description: "Endpoints إدارة (JWT مطلوب)" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "توكن من POST /admin/login",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["error", "message"],
        properties: {
          error: { type: "boolean", example: true },
          message: { type: "string", description: "رسالة خطأ قابلة للقراءة" },
        },
        description: "استجابة الخطأ الموحدة",
      },
      ContentPage: {
        type: "object",
        properties: {
          pageNumber: { type: "integer", minimum: 1 },
          imageUrl: { type: "string", format: "uri" },
          text: { type: "string", nullable: true },
        },
        description: "صفحة من محتوى (قصة)",
      },
      Content: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          type: { type: "string", enum: ["story", "video", "game"] },
          ageMin: { type: "integer", minimum: 0 },
          ageMax: { type: "integer", minimum: 0 },
          thumbnailUrl: { type: "string", format: "uri", nullable: true },
          contentUrl: { type: "string", format: "uri", nullable: true, description: "فيديو أو رابط خارجي" },
          fileUrl: { type: "string", format: "uri", nullable: true, description: "ملف PDF للألعاب (sourceType=uploaded)" },
          sourceType: { type: "string", enum: ["uploaded", "youtube", "external"] },
          isActive: { type: "boolean", default: true },
          orderIndex: { type: "integer", default: 0 },
          createdAt: { type: "string", format: "date-time" },
          categories: { type: "array", items: { $ref: "#/components/schemas/CategoryItem" } },
          ageGroups: { type: "array", items: { $ref: "#/components/schemas/AgeGroupItem" } },
          pages: { type: "array", items: { $ref: "#/components/schemas/ContentPage" }, description: "للقصص فقط" },
        },
        description: "محتوى (قصة/فيديو/لعبة). للألعاب: إما youtube (فيديو) أو uploaded (PDF)",
      },
      CategoryItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          icon: { type: "string", nullable: true },
        },
        description: "ملخص فئة (حتى 3 لكل محتوى في القائمة العامة)",
      },
      AgeGroupItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          label: { type: "string", example: "3-5" },
          ageMin: { type: "integer" },
          ageMax: { type: "integer" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string", unique: true },
          icon: { type: "string", nullable: true },
        },
      },
      AgeGroup: {
        type: "object",
        properties: {
          id: { type: "integer" },
          label: { type: "string", unique: true, example: "3-5" },
          ageMin: { type: "integer" },
          ageMax: { type: "integer" },
        },
      },
      AppSetting: {
        type: "object",
        properties: {
          id: { type: "integer" },
          key: { type: "string", unique: true },
          value: { type: "string" },
        },
      },
      Admin: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
        },
        description: "مدير (بدون كلمة المرور)",
      },
      PaginatedContent: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Content" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
          page: { type: "integer", nullable: true },
        },
      },
      PaginatedCategories: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Category" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      PaginatedAgeGroups: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/AgeGroup" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      PaginatedSettings: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/AppSetting" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      PaginatedAdmins: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Admin" } },
          total: { type: "integer" },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 1 },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", description: "JWT للاستخدام في Authorization: Bearer" },
          admin: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
      ContentCreateBody: {
        type: "object",
        required: ["title", "type", "ageMin", "ageMax", "sourceType"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", nullable: true },
          type: { type: "string", enum: ["story", "video", "game"] },
          ageMin: { type: "integer", minimum: 0 },
          ageMax: { type: "integer", minimum: 0 },
          thumbnailUrl: { type: "string", format: "uri", nullable: true },
          contentUrl: { type: "string", format: "uri", nullable: true },
          fileUrl: { type: "string", format: "uri", nullable: true },
          sourceType: { type: "string", enum: ["uploaded", "youtube", "external"] },
          isActive: { type: "boolean" },
          orderIndex: { type: "integer" },
          categoryIds: { type: "array", items: { type: "integer" } },
          ageGroupIds: { type: "array", items: { type: "integer" } },
          pages: { type: "array", items: { $ref: "#/components/schemas/ContentPage" } },
        },
        description: "للألعاب: sourceType=uploaded يتطلب fileUrl (PDF)، sourceType=youtube يتطلب contentUrl صالح",
      },
      ContentUpdateBody: {
        type: "object",
        description: "جميع الحقول اختيارية (تحديث جزئي)",
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", nullable: true },
          type: { type: "string", enum: ["story", "video", "game"] },
          ageMin: { type: "integer", minimum: 0 },
          ageMax: { type: "integer", minimum: 0 },
          thumbnailUrl: { type: "string", format: "uri", nullable: true },
          contentUrl: { type: "string", format: "uri", nullable: true },
          fileUrl: { type: "string", format: "uri", nullable: true },
          sourceType: { type: "string", enum: ["uploaded", "youtube", "external"] },
          isActive: { type: "boolean" },
          orderIndex: { type: "integer" },
          categoryIds: { type: "array", items: { type: "integer" } },
          ageGroupIds: { type: "array", items: { type: "integer" } },
        },
      },
      CategoryCreateBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          icon: { type: "string", nullable: true },
        },
      },
      CategoryUpdateBody: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          icon: { type: "string", nullable: true },
        },
      },
      AgeGroupCreateBody: {
        type: "object",
        required: ["label", "ageMin", "ageMax"],
        properties: {
          label: { type: "string", minLength: 1, example: "3-5" },
          ageMin: { type: "integer", minimum: 0 },
          ageMax: { type: "integer", minimum: 0 },
        },
      },
      AgeGroupUpdateBody: {
        type: "object",
        properties: {
          label: { type: "string", minLength: 1 },
          ageMin: { type: "integer", minimum: 0 },
          ageMax: { type: "integer", minimum: 0 },
        },
      },
      AppSettingCreateBody: {
        type: "object",
        required: ["key", "value"],
        properties: {
          key: { type: "string", minLength: 1 },
          value: { type: "string" },
        },
      },
      AppSettingUpdateBody: {
        type: "object",
        properties: {
          key: { type: "string", minLength: 1 },
          value: { type: "string" },
        },
      },
      AdminCreateBody: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      AdminUpdateBody: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: options,
  apis: ["./src/modules/**/*.ts", "./src/routes.ts"],
});
