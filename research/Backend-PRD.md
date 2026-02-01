# 🤖 Backend PRD – AI Prompt (Detailed Folder Structure)

Kids Safe Digital Library

---

## 🎯 Role Definition (for AI)

> أنت **Senior Backend Engineer** بخبرة Production عالية.
> تعمل على Backend لتطبيق أطفال آمن.
> أي قرار يجب أن يقدّم **بساطة، أمان، واستقرار** قبل أي شيء.

> ملاحظة: كل Admin يعتبر بصلاحيات كاملة، لا حاجة لتحديد Roles.

## 📌 Project Overview

تطبيق تعليمي للأطفال يعمل كمكتبة رقمية:

- قصص مصوّرة
- فيديوهات تعليمية
- ألعاب تعليمية

❌ بدون حسابات مستخدمين
❌ بدون تتبع أو Analytics
❌ بدون AI أو Gamification في الـ MVP

Backend مسؤول فقط عن:

- تقديم محتوى Read-only للعامة
- إدارة المحتوى عبر Admin Panel خاص

## 🧱 Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT (Admin فقط)
- Validation: Zod
- swagger: swagger-jsdoc and swagger-ui-express

## 🗂️ Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app.ts           # Express app initialization
│   ├── server.ts        # Server startup
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── db.ts
│   │   ├── swagger.ts
│   │   └── constants.ts
│   │
│   ├── modules/
│   │   ├── content/
│   │   │   ├── content.controller.ts
│   │   │   ├── content.service.ts
│   │   │   ├── content.repository.ts
│   │   │   ├── content.routes.ts
│   │   │   └── content.types.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── settings.controller.ts
│   │   │   ├── settings.service.ts
│   │   │   ├── settings.repository.ts
│   │   │   └── settings.routes.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.repository.ts
│   │   │   └── categories.routes.ts
│   │   │
│   │   ├── age-groups/
│   │   │   ├── age-groups.controller.ts
│   │   │   ├── age-groups.service.ts
│   │   │   ├── age-groups.repository.ts
│   │   │   └── age-groups.routes.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       ├── admin.repository.ts
│   │       ├── admin.routes.ts
│   │       └── auth.middleware.ts
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   ├── hash.ts
│   │   └── jwt.ts
│   │
│   ├── routes.ts
│   └── types/
│       └── express.d.ts
│
├── scripts/
│   ├── backup.sh
│   └── restore.sh
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🌐 API Endpoints

### Public API

```yaml
- GET /content?age=3-5&type=story&category=1,2,3&limit=10&offset=0&page=1&search=keyword # Returns structured response with up to 3 categories for each content
- GET /content/:id # Returns the content details
- GET /categories # Returns the categories list
- GET /age-groups # Returns the age groups list
- GET /settings # Returns the settings
```

### Admin API

```yaml
- GET /admin/me # Returns the admin details
- GET /admin/users?limit=10&offset=0&page=1&search=keyword # Returns the admin users list
- POST /admin/users # Creates a new admin user
- GET /admin/users/:id # Returns the admin user details
- PUT /admin/users/:id # Updates the admin user details
- DELETE /admin/users/:id # Deletes the admin user
- POST /admin/login → JWT

- GET /admin/content?age=3-5&type=story&category=1,2,3&limit=10&offset=0&page=1&search=keyword # Returns the content list
- POST /admin/content # Creates a new content
- GET /admin/content/:id # Returns the content details
- PUT /admin/content/:id # Updates the content details
- DELETE /admin/content/:id # Deletes the content

- GET /admin/categories?limit=10&offset=0&page=1&search=keyword # Returns the categories list
- POST /admin/categories # Creates a new category
- GET /admin/categories/:id # Returns the category details
- PUT /admin/categories/:id # Updates the category details
- DELETE /admin/categories/:id # Deletes the category

- GET /admin/age-groups?limit=10&offset=0&page=1&search=keyword # Returns the age groups list
- POST /admin/age-groups # Creates a new age group
- GET /admin/age-groups/:id # Returns the age group details
- PUT /admin/age-groups/:id # Updates the age group details
- DELETE /admin/age-groups/:id # Deletes the age group

- GET /admin/settings?limit=10&offset=0&page=1&search=keyword # Returns the settings list
- POST /admin/settings # Creates a new setting
- GET /admin/settings/:id # Returns the setting details
- PUT /admin/settings/:id # Updates the setting details
- DELETE /admin/settings/:id # Deletes the setting
```

## 🛡️ Security & Best Practices

- JWT auth for admin routes
- Rate limiting on public endpoints
- Validation required on all inputs
- Explicit Prisma select statements
- No sensitive data exposed

---

## ⚠️ Forbidden Features

- User accounts for public
- Analytics or tracking
- Personalization or recommendations
- Features outside MVP

---

## 📦 Coding Standards

- TypeScript strict mode
- ESLint + Prettier
- camelCase variables
- No `any` type
- Explicit Prisma select

---

## 🧪 Error Response

```json
{
  "error": true,
  "message": "Readable error message"
}
```

---

## 💾 Backup & Ops

- Scripts for backup/restore using `pg_dump`
- Ready for cron job automation

---

## 🧠 AI Prompt Injection

> نفّذ Backend نظيف، بسيط، وآمن.
> التزم بهذه البنية وحسب الـ MVP.
> أي Feature خارج القواعد أعلاه اسأل قبل التنفيذ.

## update PRD 1

1. **الألعاب**: وضّح في الـ API والـ types إن `game` ممكن يكون **فيديو (youtube)** أو **PDF (uploaded)** فقط.
2. **حقل جديد**: أضف `fileUrl` في الـ Content model للألعاب PDF.
3. **Validation**: تحقق من صحة الحقول قبل الحفظ:
   - `sourceType = uploaded` → `fileUrl` موجود وصالح PDF
   - `sourceType = youtube` → `contentUrl` موجود وصالح

4. **Admin API Docs**: حدّد القواعد للألعاب في الـ POST/PUT endpoints.
5. **TypeScript Types**: عرّف GameContent بوضوح للفيديو و PDF لضمان type-safety.

## 📖 API Documentation

- Swagger UI will be available at `/api-docs`
- Auto-generated documentation from JSDoc comments
- Interactive testing for all endpoints
- Separate documentation for Public and Admin APIs