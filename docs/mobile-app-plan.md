# خطة بناء تطبيق Violette Kids (Mobile)

## 1. نظرة عامة

| البند | القيمة |
|-------|--------|
| **المشروع** | تطبيق تعليمي تفاعلي للأطفال (3–12 سنة) |
| **التقنية** | React Native (Expo) + TypeScript |
| **الواجهة** | Tamagui أو NativeWind (اختيار: NativeWind لسهولة الدمج) |
| **المحتوى** | من API عام: `GET /content`, `GET /content/:id`, `GET /categories`, `GET /age-groups`, `GET /settings` |
| **التخزين المحلي** | AsyncStorage (تقدم، إنجازات محلية فقط) |

---

## 2. مراحل البناء

### المرحلة 1: Init (التهيئة)

- [x] إنشاء خطة البناء (هذا الملف)
- [ ] إنشاء مشروع Expo في `apps/mobile`
- [ ] إعداد Expo Router (file-based): `app/(tabs)/`, `app/(modals)/`
- [ ] إعداد TypeScript ومسارات الـ imports
- [ ] ربط المشروع بـ Nx (project.json + scripts في الجذر)
- [ ] إعداد متغير البيئة لـ API base URL

**هيكل المجلدات (الهدف):**

```
apps/mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # الرئيسية
│   │   ├── stories.tsx
│   │   ├── games.tsx
│   │   ├── videos.tsx
│   │   └── achievements.tsx
│   ├── (modals)/
│   │   ├── story/[id].tsx
│   │   ├── game/[id].tsx
│   │   └── video/[id].tsx
│   ├── _layout.tsx
│   └── index.tsx            # redirect to tabs
├── components/
│   ├── ui/
│   ├── cards/
│   ├── navigation/
│   └── gamification/
├── features/
│   ├── stories/
│   ├── games/
│   ├── videos/
│   └── achievements/
├── lib/
│   ├── api/
│   ├── gamification/
│   └── constants/
├── assets/
│   ├── images/
│   ├── sounds/
│   └── fonts/
├── types/
├── app.json
├── package.json
└── project.json (Nx)
```

---

### المرحلة 2: الثيم (Theme)

- [ ] **نظام الألوان** (حسب mobile-PRD):
  - Primary: أحمر (#FF2E2E, #FF0000)
  - Secondary: Teal (#4ECDC4, #26A69A)
  - Accent: أصفر (#FFD166, #FFB300)
  - Neutral: رمادي فاتح/غامق
  - Success / Warning / Error
- [ ] **الخطوط**: Rubik أو Cairo (Bold للعناوين، Regular للنص، Medium للأرقام)
- [ ] **ثيم موحد**: إنشاء `lib/theme/colors.ts`, `lib/theme/fonts.ts`, وربطها بـ NativeWind أو Tamagui
- [ ] **مكونات UI أساسية**: زر كبير للمس، بطاقة محتوى، شريط تبويبات سفلي

---

### المرحلة 3: التفاصيل والميزات

#### 3.1 الاتصال بالـ API

- [ ] `lib/api/client.ts`: Axios/fetch مع base URL من env
- [ ] `lib/api/content.ts`: `getContentList`, `getContentById` (مع query: age, type, category, limit, offset)
- [ ] `lib/api/categories.ts`: `getCategories`
- [ ] `lib/api/age-groups.ts`: `getAgeGroups`
- [ ] `lib/api/settings.ts`: `getSettings`
- [ ] `types/content.ts`: Content, ContentPage, Category, AgeGroup (متوافقة مع openapi.yaml)

#### 3.2 الصفحة الرئيسية

- [ ] Hero section (عنوان، صورة/أيقونة)
- [ ] أقسام: قصص، ألعاب، فيديوهات (صفوف أفقية مع "عرض الكل")
- [ ] استخدام `getContentList` مع type=story | game | video و limit صغير

#### 3.3 تبويبات القصص / الألعاب / الفيديوهات

- [ ] قائمة محتوى مع فلترة: الفئة العمرية، الفئة (category)، بحث
- [ ] بطاقات: صورة مصغرة، عنوان، وصف قصير
- [ ] تنقل إلى تفاصيل: `/(modals)/story/[id]` أو game أو video

#### 3.4 صفحات التفاصيل

- [ ] **قصة**: عرض صفحات (ContentPage) مع صورة ونص؛ تمرير أفقي أو عمودي
- [ ] **لعبة**: إن كان `sourceType=youtube` → مشغل فيديو؛ إن كان `uploaded` → فتح/عرض PDF (ملف من fileUrl)
- [ ] **فيديو**: مشغل فيديو (contentUrl، أو YouTube embed إن لزم)

#### 3.5 الإنجازات (محلي فقط)

- [ ] تعريف إنجازات ثابتة (مثلاً: قراءة أول قصة، مشاهدة أول فيديو، إلخ)
- [ ] حفظ التقدم في AsyncStorage
- [ ] صفحة الإنجازات: قائمة شارات/نجوم مع حالة (مكتمل/غير مكتمل)
- [ ] بدون جمع نجوم/شارات متقدم أو تحديات أسبوعية (حسب update 1 في PRD)

#### 3.6 التنقل والـ UX

- [ ] شريط تبويبات سفلي: الرئيسية، قصص، ألعاب، فيديوهات، إنجازات
- [ ] مساحات لمس كبيرة، أزرار واضحة
- [ ] دعم RTL للعربية

---

## 3. التوافق مع الـ API (openapi.yaml)

| الاستخدام في التطبيق | Endpoint |
|----------------------|----------|
| قائمة المحتوى (مع فلترة) | `GET /api/content?age=3-5&type=story&category=1,2&limit=10&offset=0&search=...` |
| تفاصيل محتوى واحد | `GET /api/content/:id` |
| الفئات | `GET /api/categories` |
| الفئات العمرية | `GET /api/age-groups` |
| إعدادات التطبيق | `GET /api/settings` |

**ملاحظة:** الـ Base URL للتطبيق (مثلاً `http://localhost:4000/api` للتطوير أو عنوان الإنتاج لاحقاً).

---

## 4. الأداء والأمان (من PRD)

- وقت تحميل الصفحة: < 2 ثانية
- 60 FPS للأنيميشن
- لا بيانات شخصية؛ لا تتبع
- محتوى مناسب للأطفال فقط

---

## 5. الملفات المرجعية

- `mobile-PRD.md`: المتطلبات والثيم والهيكلية
- `readmap.yaml`: المسارات والـ partials (نستخدمها كمرجع للشاشات)
- `research/schema.prisma`: نماذج المحتوى والفئات والعمر
- `research/Backend-PRD.md`: وصف الـ API
- `apps/api/openapi.yaml`: تفاصيل الـ endpoints والـ schemas

---

*آخر تحديث: حسب طلب التخطيط والبناء.*
