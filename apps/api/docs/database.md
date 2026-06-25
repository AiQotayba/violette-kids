# قاعدة البيانات — PostgreSQL (تطوير) + MySQL (إنتاج)

نفس نمط مشروع **19ergmbh-de**: ملف schema واحد، والـ provider يتغيّر حسب `.env`.

## التطوير (PostgreSQL)

في `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/violette_kids?schema=public"
DATABASE_PROVIDER=postgresql
```

```bash
cd apps/api
pnpm db:create      # ينشئ قاعدة PostgreSQL (مرة واحدة)
pnpm db:migrate     # migrations على PostgreSQL
pnpm db:seed
pnpm dev
```

## الإنتاج (MySQL على VPS)

### 1. أنشئ قاعدة في CloudPanel

- الموقع: `api-violette-kids.sy-calculator.com`
- أنشئ MySQL database + user
- انسخ `DATABASE_URL` بصيغة: `mysql://USER:PASS@127.0.0.1:3306/DB_NAME`

### 2. ملف `.env` على السيرفر

```bash
ssh sy-calculator-api-violette-kids@45.132.241.51
cd ~/violette-kids/apps/api
cp deploy/env.production.example .env
nano .env
```

```env
DATABASE_URL="mysql://USER:PASS@127.0.0.1:3306/violette_kids"
DATABASE_PROVIDER=mysql
NODE_ENV=production
PORT=4600
JWT_SECRET="..."
```

### 3. النشر

```bash
cd ~/violette-kids/apps/api
git pull
bash deploy/deploy-api.sh
# أو
pnpm deploy
```

السكربت يشغّل `db push` على MySQL (لأن migrations مكتوبة لـ PostgreSQL).

## كيف يشتغل تقنياً؟

| الملف | الوظيفة |
|-------|---------|
| `prisma/schema.prisma` | المصدر (provider placeholder) |
| `scripts/materialize-schema.mjs` | يولّد `.prisma/schema` حسب `DATABASE_PROVIDER` |
| `scripts/with-env.mjs` | يقرأ `.env` ويشغّل Prisma |
| `src/lib/create-prisma-client.ts` | adapter لـ PostgreSQL أو MySQL |

## أوامر مفيدة

| الأمر | متى |
|-------|-----|
| `pnpm db:generate` | بعد تغيير schema |
| `pnpm db:migrate` | تطوير PostgreSQL فقط |
| `pnpm db:push` | مزامنة schema (خصوصاً MySQL) |
| `pnpm db:seed` | بيانات تجريبية |
| `pnpm db:migrate:to-mysql` | نسخ بيانات PostgreSQL → MySQL |
| `pnpm deploy` | نشر على VPS |

---

## نقل البيانات: PostgreSQL → MySQL

لما عندك بيانات على Supabase أو PostgreSQL محلي وتبي تنقلها لـ MySQL على السيرفر.

### 1. جهّز ملف `.env.migrate`

```bash
cd apps/api
cp .env.migrate.example .env.migrate
```

```env
SOURCE_DATABASE_URL="postgresql://postgres:PASS@db.xxx.supabase.co:5432/postgres?sslmode=require"
TARGET_DATABASE_URL="mysql://violette:PASS@127.0.0.1:3306/violette"
```

### 2. جهّز MySQL (الجداول فاضية)

```bash
DATABASE_URL="mysql://..." DATABASE_PROVIDER=mysql pnpm db:push
```

### 3. شغّل النقل

```bash
pnpm db:migrate:to-mysql
```

**ماذا يفعل السكربت؟**

```
1. pg_dump  →  backups/postgres-YYYY-MM-DD.sql   (نسخة احتياطية)
2. يقرأ كل الجداول من PostgreSQL
3. يفرّغ MySQL ويكتب البيانات بنفس الـ IDs
4. يضبط AUTO_INCREMENT
```

**على Windows:** ثبّت [PostgreSQL tools](https://www.postgresql.org/download/windows/) عشان `pg_dump` يشتغل، أو حط `SKIP_BACKUP=true`.

### على السيرفر (بعد git pull)

```bash
cd ~/violette-kids
git stash          # لو في تعديلات محلية
git pull
cd apps/api
bash deploy/deploy-api.sh
```
