نعم سيدي، لقد قرأت دراسة الـ Gamification الحالية وأفهم متطلباتك جيداً: **نظام Gamification محلي بالكامل** مع إمكانية الربط لاحقاً بالـ Backend، مع تركيز على الأداء، قابلية التوسع، وسهولة الصيانة. سأضع لك تصميمًا احترافيًا جديدًا يرفع مستوى المعمارية الحالية ويوفر قاعدة قوية للـ Violette Kids Mobile.

---

## ١. المبادئ الأساسية للمعمارية الجديدة

1. **المصدر الوحيد للحقيقة محلياً**: كل النقاط، المستويات، الإنجازات، وتقدم المحتوى مخزنة محلياً (AsyncStorage/MMKV).
2. **Context واحد مركزي لكل Gamification**: كل المكونات تتعامل مع Context موحد، مما يقلل تكرار الأكواد.
3. **خدمة منفصلة للـ Gamification (Service Layer)**: تحتوي على جميع القواعد، الحسابات، والتحقق من الإنجازات.
4. **إشعارات وتحفيز مباشر**: عند تسجيل أي حدث (إكمال قصة/فيديو/لعبة) يتم تحديث النقاط والمستوى والإنجازات فوراً، مع إمكانية عرض Toast/Popup.
5. **نظام توسعة آمن للـ Backend لاحقاً**: كل التغييرات المحلية يمكن مزامنتها مع API بسهولة دون الحاجة لتغيير واجهات الـ UI.
6. **تفكيك الأحداث حسب النوع**: `Story`, `Video`, `Game` بحيث يكون لكل نوع قواعده الخاصة للـ Points و Unlockables.

---

## ٢. طبقات المعمارية الجديدة

```
┌───────────────────────────────────────────────────────────────┐
│  UI (Screens & Components)                                     │
│  HeaderWithPoints • HomeHero • Achievements • Notifications    │
└───────────────┬───────────────────────────────────────────────┘
                │
┌───────────────▼───────────────────────────────────────────────┐
│  Gamification Context / Provider                                 │
│  useGamification(): { points, level, achievements, progress,   │
│                     recordCompletion() }                        │
└───────────────┬───────────────────────────────────────────────┘
                │
┌───────────────▼───────────────────────────────────────────────┐
│  Gamification Service Layer                                      │
│  - حساب النقاط (Rules Engine)                                    │
│  - حساب المستوى (Level Engine)                                   │
│  - فتح الإنجازات (Achievement Engine)                             │
│  - سجل الأحداث (Event Logger)                                     │
└───────────────┬───────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────┐
│  Storage Local                                │
│  - MMKV / AsyncStorage                         │
│  - Points, Level, Achievements, Progress      │
│                                               │
│  (Optional Future API)                        │
│  - Sync endpoints for progress & achievements │
└──────────────────────────────────────────────┘
```

---

## ٣. نموذج البيانات المحسن (Local-first)

### ٣.١ UserProgress

```ts
type ContentType = "story" | "video" | "game";

interface ContentCompletion {
  contentType: ContentType;
  contentId: string;
  completedAt: string; // timestamp
}

interface UserProgress {
  points: number;
  level: number;
  achievements: Achievement[];
  completions: ContentCompletion[];
}
```

### ٣.٢ Achievement

```ts
interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string; // timestamp
  criteria: (progress: UserProgress) => boolean; // شرط فتح الإنجاز
}
```

### ٣.٣ Constants (قابلة للتعديل بسهولة)

```ts
const POINTS = {
  story: 10,
  video: 5,
  game: 15,
};

const LEVEL_THRESHOLDS = [0, 50, 120, 200, 300]; // مثال
```

---

## ٤. تدفق تسجيل الإكمال (Record Completion)

1. المستخدم ينهي محتوى (قصة/فيديو/لعبة).
2. `GamificationContext.recordCompletion(contentType, contentId)` يُستدعى.
3. الخدمة تقوم بـ:
   - التحقق إن المحتوى لم يُكمل سابقاً.
   - إضافة نقاط حسب النوع.
   - إعادة حساب المستوى (نقطة + مستوى).
   - التحقق من الإنجازات الجديدة (criteria).
   - تحديث التخزين المحلي فوراً.
   - إطلاق حدث للـ UI لإظهار إشعار أو Toast.

> هذه الطريقة تضمن تحديث جميع المكونات بشكل لحظي ودون إعادة تحميل الشاشة.

---

## ٥. استراتيجيات متقدمة للمستوى والإنجازات

- **المستوى التراكمي:** يمكن تحديد مستوى حسب نقاط كل نوع محتوى أو عدد الإكمالات.
- **إنجازات ذكية:** يمكن ربط الإنجازات بسلاسل أحداث (مثلاً: "3 قصص متتالية خلال أسبوع").
- **إشعارات تحفيزية:** يمكن لكل حدث أن يولد Toast أو Animation صغير يشجع الأطفال.

---

## ٦. واجهات الاستخدام (UI Integration)

| المكون                  | ما يقرأه         | ما ينفذه                                 |
| ----------------------- | ---------------- | ---------------------------------------- |
| HeaderWithPoints        | points           | —                                        |
| HomeHero                | level + progress | —                                        |
| AchievementsScreen      | achievements     | —                                        |
| Story/Game/Video Screen | —                | recordCompletion(contentType, contentId) |

---

## ٧. مزايا التصميم الجديد

1. **Local-first:** كل شيء يعمل بدون Backend.
2. **Plug-and-play:** أي شاشة أو مكون يمكنه القراءة مباشرة من Context.
3. **قابلية التوسع:** إضافة أنواع جديدة من المحتوى أو إنجازات بسهولة.
4. **قابلية المزامنة:** لاحقاً يمكن إضافة Sync مع API دون تعديل Context أو UI.
5. **أمان الأداء:** كل العمليات محلية، استخدام MMKV يجعل القراءة والكتابة فورية.

---

إذا أحببت، يمكن أن أصنع لك **خريطة ذهنية كاملة للمعمارية الجديدة مع تدفق تسجيل الإكمال، فتح الإنجازات وحساب النقاط والمستوى** لتكون جاهزة للتنفيذ مباشرة في التطبيق، سيدي.

هل تريد أن أفعل ذلك؟
