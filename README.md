# Violette Kids / عالم همسة – Full Stack README

## 🧱 Project Overview
تطبيق مكتبة رقمية للأطفال (3–12 سنة) يشمل:
- قصص مصوّرة
- فيديوهات تعليمية
- ألعاب تعليمية (PDF أو YouTube)
- تجربة آمنة وبسيطة بدون تسجيل دخول أو تتبع

---

## 🗂️ Monorepo Structure
```

violette-kids/
├── apps/
│   ├── mobile/    # (React Native + Expo) 
│   ├── api/       # (Node.js + Express + Prisma + PostgreSQL)
│   ├── admin/     # (Next.js + TypeScript)
│   ├── landing/   # (Next.js)
```

---

## 1️⃣ Backend (apps/api)
- Node.js + Express + TypeScript  
- PostgreSQL + Prisma  
- JWT auth (Admin only)  
- Zod validation + Rate limiting  
- Public API: content, categories, age-groups, settings  
- Admin API: CRUD للمحتوى والتصنيفات والأعمار والإعدادات  

---

## 2️⃣ Admin Dashboard (apps/admin)
- Next.js + TypeScript  
- إدارة CRUD للمحتوى والتصنيفات والأعمار  
- RTL وواجهة مبسطة  

---

## 3️⃣ Mobile App (apps/mobile)
- React Native + Expo + TypeScript  
- AsyncStorage للتقدم المحلي  
- Reanimated 3 للأنيميشن  
- Tamagui / NativeWind للـ UI  
- RTL، Arabic، واجهة مبسطة، ألوان وخطوط مطابقة للتطبيق  

---

## 4️⃣ Landing Page (apps/landing)
- Next.js + Tailwind أو HTML/CSS/JS ثابت  
- RTL عربي، responsive  
- Hero + Sections (قصص، فيديوهات، ألعاب) + CTA تحميل أندرويد  
- الهوية البصرية من تطبيق الموبايل (colors, fonts, logo)  
