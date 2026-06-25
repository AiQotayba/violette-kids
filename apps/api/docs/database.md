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
| `pnpm deploy` | نشر على VPS |
