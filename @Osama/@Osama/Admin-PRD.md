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

- Framework: Next.js 16 (App Router)
- UI: shadcn/ui (كل الـ components + dialogs)
- Tables: nextjsVip (Table + pagination + filters)
- Data Fetching: React Query + API Client (fetch)
- JWT stored (httpOnly cookie أو memory – حسب backend)

## 🌐 API Endpoints

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

## 🧠 Architecture Principle

> ❝ Frontend غبي، Backend ذكي ❞
>
> الفرونت:

- يستدعي API
- يعرض Table
- يفلتر
- يبجّن
- يعرض Dialog
  **ولا يحلل ولا يقرر**

---

## 🗂️ Folder Structure (Next.js App Router)

```yaml
admin-panel/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar + Header
│   │   ├── page.tsx            # Dashboard
│   │   │
│   │   ├── users/
│   │   │   └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   │
│   │   ├── videos/
│   │   │   └── page.tsx
│   │   │
│   │   ├── stories/
│   │   │   └── page.tsx
│   │   │
│   │   ├── games/
│   │   │   └── page.tsx
│   │   │
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   │
│   │   ├── age-groups/
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│
├── components/
│   ├── ui/                     # shadcn (Button, Dialog, Table...)
│   │   ├── upload/
│   │   │   ├── ImageUpload.tsx         # ⬅️ لرفع الصور
│   │   │   └── FileUpload.tsx          # ⬅️ لرفع PDF
│   │   ├── feedback/
│   │   │   ├── LoadingSpinner.tsx      # ⬅️ مؤشر تحميل
│   │   │   ├── EmptyState.tsx          # ⬅️ حالة فارغة
│   │   │   └── ErrorMessage.tsx        # ⬅️ رسالة خطأ
│   │   │
│   │   └── layout/
│   │       └── StatsCard.tsx           # ⬅️ بطاقة إحصائية
│   ├── dialogs/
│   │   ├── ContentDialog.tsx           # ⬅️ موحد للمحتوى
│   │   ├── AdminDialog.tsx             # ⬅️ لإدارة الأدمن
│   │   └── ConfirmDialog.tsx           # موجود لكن يحتاج تحسين
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PageHeader.tsx
│   │
│   ├── table/
│   │   ├── DataTable.tsx       # wrapper over nextjsVip
│   │
│   ├── dialogs/
│   │   ├── ConfirmDelete.tsx
│   │   └── ContentDialog.tsx
│
├── features/
│   ├── admins/
│   │   ├── admins.columns.ts
│   │   ├── admins.form.tsx
│   │   ├── admins.filters.ts
│   │   └── admins.schema.ts            # ⬅️ validation schema
│   ├── videos/
│   │   ├── videos.columns.ts
│   │   ├── videos.form.tsx
│   │   └── videos.filters.ts
│   │
│   ├── stories/
│   │   ├── stories.columns.ts
│   │   ├── stories.form.tsx
│   │   └── stories.filters.ts
│   │
│   ├── profile/
│   │   ├── profile.form.tsx
│   │   └── profile.schema.ts
│   │
│   ├── games/
│   │   ├── games.columns.ts
│   │   ├── games.form.tsx
│   │   └── games.filters.ts
│   │
│   ├── categories/
│   │   ├── categories.columns.ts
│   │   ├── categories.form.tsx
│   │   └── categories.filters.ts
│   │
│   ├── age-groups/
│   │   ├── age-groups.columns.ts
│   │   ├── age-groups.form.tsx
│   │   └── age-groups.filters.ts
│   │
│   ├── settings/
│   │   ├── settings.columns.ts
│   │   ├── settings.form.tsx
│   │   └── settings.filters.ts
│   │
│   └── dashboard/
│       ├── dashboard.stats.ts
│       └── dashboard.charts.ts
├── lib/
│   ├── api-client.ts           # fetch wrapper
│   ├── query-client.ts
│   ├── auth.ts                 # token helpers
│   └── constants.ts
│   ├── validation/
│   │   ├── schemas.ts                  # Zod schemas
│   │   └── constants.ts
│   └── utils/
│       ├── format.ts                   # تنسيق التواريخ والأرقام
│       └── helpers.ts                  # دوال مساعدة
├── hooks/
│   ├── useAuth.ts
│   └── usePagination.ts
│
├── types/
│   ├── videos.types.ts
│   ├── stories.types.ts
│   ├── games.types.ts
│   ├── categories.types.ts
│   ├── age-groups.types.ts
│   ├── settings.types.ts
│   ├── api.ts
│   ├── admins.types.ts
│   ├── upload.types.ts
│   └── dashboard.types.ts
│
├── middleware.ts               # Auth guard
├── package.json
└── README.md

```

## 🔌 API Client (بدون API Layer)

### `lib/api-client.ts`

- fetch wrapper
- يضيف:
  - baseURL
  - Authorization header
  - error normalization

```ts
apiClient.get("/admin/content");
```

❌ لا routes
❌ لا handlers
❌ لا server actions

---

## 🔁 React Query Pattern

```ts
useQuery({
  queryKey: ["content", filters, page],
  queryFn: () => contentService.list(filters),
});
```

- Pagination من backend
- Filters تمر كما هي
- Cache تلقائي
- Refetch بعد create/update/delete

---

## 📊 Tables (nextjsVip)

- Server-side:
  - pagination
  - filtering
  - search

- Columns معرفة في:
  - `features/*/*.columns.ts`

- Actions:
  - Edit → Dialog
  - Delete → Confirm Dialog

---

## 🪟 Dialogs (shadcn)

- Create / Edit:
  - Dialog
  - Form

- Delete:
  - ConfirmDialog

- No pages للتعديل (UX أسرع)

---

## 🔐 Auth Flow

- `/login`
- JWT محفوظ
- `middleware.ts`:
  - يمنع الدخول للـ dashboard بدون token

- `/admin/me` للتحقق

---

## 🚫 ممنوع

- API routes
- Server Actions
- Business logic
- Complex state managers
- Over abstraction

## 🧠 AI Prompt Injection

> نفّذ Backend نظيف، بسيط، وآمن.
> التزم بهذه البنية وحسب الـ MVP.
> أي Feature خارج القواعد أعلاه اسأل قبل التنفيذ.


## update 1
- فورم المحتوى يجب ان يكون مرن بحيث يستخدم للقصص والفيديوهات والالعاب