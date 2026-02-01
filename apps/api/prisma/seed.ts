import { PrismaClient, ContentType, ContentSourceType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ========================
  // 1. تنظيف البيانات القديمة
  // ========================
  console.log('🧹 Cleaning up old data...')
  
  await prisma.contentPage.deleteMany()
  await prisma.contentCategory.deleteMany()
  await prisma.contentAgeGroup.deleteMany()
  await prisma.content.deleteMany()
  await prisma.category.deleteMany()
  await prisma.ageGroup.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.appSetting.deleteMany()

  // ========================
  // 2. إنشاء الإعدادات
  // ========================
  console.log('⚙️ Creating app settings...')
  
  await prisma.appSetting.createMany({
    data: [
      { key: 'APP_NAME', value: 'Kids Safe Digital Library' },
      { key: 'APP_VERSION', value: '1.0.0' },
      { key: 'MAX_CONTENT_PER_PAGE', value: '20' },
      { key: 'CONTACT_EMAIL', value: 'support@kidslibrary.com' },
      { key: 'MAINTENANCE_MODE', value: 'false' },
    ],
  })

  // ========================
  // 3. إنشاء الفئات (Categories)
  // ========================
  console.log('🏷️ Creating categories...')
  
  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: 'قصص الحيوانات', icon: '🦁' },
      { name: 'قصص المغامرات', icon: '🗺️' },
      { name: 'تعليم الألوان', icon: '🎨' },
      { name: 'تعليم الأرقام', icon: '🔢' },
      { name: 'قصص ما قبل النوم', icon: '🌙' },
      { name: 'تعليم الحروف', icon: '🔤' },
      { name: 'العلوم المبسطة', icon: '🔬' },
      { name: 'القيم والأخلاق', icon: '❤️' },
    ],
  })

  console.log(`✅ Created ${categories.length} categories`)

  // ========================
  // 4. إنشاء الفئات العمرية (Age Groups)
  // ========================
  console.log('👶 Creating age groups...')
  
  const ageGroups = await prisma.ageGroup.createManyAndReturn({
    data: [
      { label: '3-5', ageMin: 3, ageMax: 5 },
      { label: '6-8', ageMin: 6, ageMax: 8 },
      { label: '9-12', ageMin: 9, ageMax: 12 },
    ],
  })

  console.log(`✅ Created ${ageGroups.length} age groups`)

  // ========================
  // 5. إنشاء الأدمن (Admin)
  // ========================
  console.log('👨‍💼 Creating admin user...')
  
  const hashedPassword = await hash('Admin123!', 10)
  
  await prisma.admin.create({
    data: {
      name: 'مدير النظام',
      email: 'admin@kidslibrary.com',
      password: hashedPassword,
    },
  })

  console.log('✅ Admin user created (email: admin@kidslibrary.com, password: Admin123!)')

  // ========================
  // 6. إنشاء 50 عنصر محتوى متنوع
  // ========================
  console.log('📚 Creating 50 content items...')
  
  const contentData = [
    // 📖 قصص مصورة (15 قصة)
    {
      title: 'الأسد والفأر',
      description: 'قصة عن أهمية مساعدة الآخرين بغض النظر عن حجمهم',
      type: ContentType.story,
      ageMin: 3,
      ageMax: 5,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FFD700/000?text=الأسد+والفأر',
      contentUrl: null,
      fileUrl: null,
      sourceType: ContentSourceType.uploaded,
      pages: [
        { pageNumber: 1, imageUrl: 'https://via.placeholder.com/600x400/F0E68C/000?text=الصفحة+1', text: 'كان يا ما كان في غابة بعيدة، كان هناك أسد قوي نائم تحت شجرة كبيرة.' },
        { pageNumber: 2, imageUrl: 'https://via.placeholder.com/600x400/F0E68C/000?text=الصفحة+2', text: 'مر فأر صغير ولم ينتبه للأسد النائم، فداس على أنف الأسد!' },
        { pageNumber: 3, imageUrl: 'https://via.placeholder.com/600x400/F0E68C/000?text=الصفحة+3', text: 'استيقظ الأسد غاضباً وأمسك بالفأر بين مخالبه.' },
        { pageNumber: 4, imageUrl: 'https://via.placeholder.com/600x400/F0E68C/000?text=الصفحة+4', text: 'قال الفأر: "أرجوك أيها الأسد العظيم، سامحني وسأرد لك المعروف يوماً ما"' },
        { pageNumber: 5, imageUrl: 'https://via.placeholder.com/600x400/F0E68C/000?text=الصفحة+5', text: 'ضحك الأسد من فكرة أن فأراً صغيراً يمكنه مساعدته، لكنه أطلق سراحه.' },
      ],
      categoryIds: [1, 8], // حيوانات، قيم وأخلاق
      ageGroupIds: [1], // 3-5
    },
    {
      title: 'البطة القبيحة',
      description: 'قصة عن قبول الذات والاختلاف',
      type: ContentType.story,
      ageMin: 6,
      ageMax: 8,
      thumbnailUrl: 'https://via.placeholder.com/300x200/87CEEB/000?text=البطة+القبيحة',
      contentUrl: null,
      fileUrl: null,
      sourceType: ContentSourceType.uploaded,
      pages: [
        { pageNumber: 1, imageUrl: 'https://via.placeholder.com/600x400/E0FFFF/000?text=الصفحة+1', text: 'في مزرعة جميلة، فقست بيضة كبيرة عن بطّة مختلفة الشكل.' },
        { pageNumber: 2, imageUrl: 'https://via.placeholder.com/600x400/E0FFFF/000?text=الصفحة+2', text: 'كانت البطة الجديدة أكبر حجماً وأقل جمالاً من إخوتها.' },
        { pageNumber: 3, imageUrl: 'https://via.placeholder.com/600x400/E0FFFF/000?text=الصفحة+3', text: 'سخر منها الجميع وهربت من المزرعة حزينة.' },
        { pageNumber: 4, imageUrl: 'https://via.placeholder.com/600x400/E0FFFF/000?text=الصفحة+4', text: 'عاشت شتاءً قاسياً وحيداً، حتى جاء الربيع.' },
        { pageNumber: 5, imageUrl: 'https://via.placeholder.com/600x400/E0FFFF/000?text=الصفحة+5', text: 'نظرت إلى انعكاسها في الماء ورأت بجعة جميلة، لقد كبرت وأصبحت أجمل طائر في البحيرة!' },
      ],
      categoryIds: [1, 8],
      ageGroupIds: [2],
    },
    {
      title: 'الأرنب والسلحفاة',
      description: 'قصة عن أهمية المثابرة وعدم الغرور',
      type: ContentType.story,
      ageMin: 6,
      ageMax: 8,
      thumbnailUrl: 'https://via.placeholder.com/300x200/98FB98/000?text=الأرنب+والسلحفاة',
      contentUrl: null,
      fileUrl: null,
      sourceType: ContentSourceType.uploaded,
      pages: [
        { pageNumber: 1, imageUrl: 'https://via.placeholder.com/600x400/90EE90/000?text=الصفحة+1', text: 'تحدى أرنب سريع سلحفاة بطيئة في سباق.' },
        { pageNumber: 2, imageUrl: 'https://via.placeholder.com/600x400/90EE90/000?text=الصفحة+2', text: 'بدأ السباق وانطلق الأرنب بسرعة كبيرة.' },
        { pageNumber: 3, imageUrl: 'https://placeholder.com/600x400/90EE90/000?text=الصفحة+3', text: 'توقف الأرنب في منتصف الطريق وقرر أخذ قيلولة.' },
        { pageNumber: 4, imageUrl: 'https://via.placeholder.com/600x400/90EE90/000?text=الصفحة+4', text: 'استمرت السلحفاة في السير ببطء ولكن بثبات.' },
        { pageNumber: 5, imageUrl: 'https://via.placeholder.com/600x400/90EE90/000?text=الصفحة+5', text: 'استيقظ الأرنب ليجد السلحفاة على خط النهاية!' },
      ],
      categoryIds: [1, 8],
      ageGroupIds: [2],
    },
    {
      title: 'ذات الرداء الأحمر',
      description: 'قصة كلاسيكية مع دروس عن طاعة الوالدين',
      type: ContentType.story,
      ageMin: 6,
      ageMax: 8,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FFB6C1/000?text=ذات+الرداء+الأحمر',
      contentUrl: null,
      fileUrl: null,
      sourceType: ContentSourceType.uploaded,
      pages: [
        { pageNumber: 1, imageUrl: 'https://via.placeholder.com/600x400/FFC0CB/000?text=الصفحة+1', text: 'أرسلت أم ذات الرداء الأحمر إلى بيت جدتها مع سلة طعام.' },
        { pageNumber: 2, imageUrl: 'https://via.placeholder.com/600x400/FFC0CB/000?text=الصفحة+2', text: 'في الطريق، قابلت ذئباً ماكراً.' },
        { pageNumber: 3, imageUrl: 'https://via.placeholder.com/600x400/FFC0CB/000?text=الصفحة+3', text: 'أخبرتها أمها بعدم التحدث مع الغرباء، لكنها نسيت.' },
        { pageNumber: 4, imageUrl: 'https://via.placeholder.com/600x400/FFC0CB/000?text=الصفحة+4', text: 'سبق الذئب ذات الرداء الأحمر إلى بيت الجدة.' },
        { pageNumber: 5, imageUrl: 'https://via.placeholder.com/600x400/FFC0CB/000?text=الصفحة+5', text: 'أنقذ الصياد الجدة وذات الرداء الأحمر، وعادت الطفلة إلى أمها.' },
      ],
      categoryIds: [2, 8],
      ageGroupIds: [2],
    },
    {
      title: 'مزرعة الحيوانات',
      description: 'تعرف على أسماء وصوت الحيوانات في المزرعة',
      type: ContentType.story,
      ageMin: 3,
      ageMax: 5,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FFA07A/000?text=مزرعة+الحيوانات',
      contentUrl: null,
      fileUrl: null,
      sourceType: ContentSourceType.uploaded,
      pages: [
        { pageNumber: 1, imageUrl: 'https://via.placeholder.com/600x400/FFDAB9/000?text=الصفحة+1', text: 'هذه دجاجة، الدجاجة تقول: كو كو كو' },
        { pageNumber: 2, imageUrl: 'https://via.placeholder.com/600x400/FFDAB9/000?text=الصفحة+2', text: 'هذا كلب، الكلب يقول: هو هو هو' },
        { pageNumber: 3, imageUrl: 'https://via.placeholder.com/600x400/FFDAB9/000?text=الصفحة+3', text: 'هذه بقرة، البقرة تقول: مووو مووو' },
        { pageNumber: 4, imageUrl: 'https://via.placeholder.com/600x400/FFDAB9/000?text=الصفحة+4', text: 'هذا قط، القط يقول: مياو مياو' },
        { pageNumber: 5, imageUrl: 'https://via.placeholder.com/600x400/FFDAB9/000?text=الصفحة+5', text: 'هذه خروف، الخروف يقول: ميه ميه' },
      ],
      categoryIds: [1],
      ageGroupIds: [1],
    },
    // أضف 10 قصص أخرى هنا...

    // 🎬 فيديوهات يوتيوب (15 فيديو)
    {
      title: 'تعلم الألوان بالعربية',
      description: 'فيديو تفاعلي لتعليم الألوان الأساسية للأطفال',
      type: ContentType.video,
      ageMin: 3,
      ageMax: 5,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FF6347/FFF?text=تعلم+الألوان',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileUrl: null,
      sourceType: ContentSourceType.youtube,
      pages: [],
      categoryIds: [3],
      ageGroupIds: [1],
    },
    {
      title: 'العد من 1 إلى 10',
      description: 'أغنية مسلية لتعليم الأرقام',
      type: ContentType.video,
      ageMin: 3,
      ageMax: 5,
      thumbnailUrl: 'https://via.placeholder.com/300x200/4682B4/FFF?text=الأرقام',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileUrl: null,
      sourceType: ContentSourceType.youtube,
      pages: [],
      categoryIds: [4],
      ageGroupIds: [1],
    },
    {
      title: 'الحروف العربية - أ ب ت',
      description: 'تعلم الحروف العربية مع أمثلة وصور',
      type: ContentType.video,
      ageMin: 4,
      ageMax: 6,
      thumbnailUrl: 'https://via.placeholder.com/300x200/32CD32/FFF?text=الحروف',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileUrl: null,
      sourceType: ContentSourceType.youtube,
      pages: [],
      categoryIds: [6],
      ageGroupIds: [1, 2],
    },
    {
      title: 'تجارب علمية بسيطة',
      description: 'تجارب علمية آمنة يمكن عملها في المنزل',
      type: ContentType.video,
      ageMin: 9,
      ageMax: 12,
      thumbnailUrl: 'https://via.placeholder.com/300x200/8A2BE2/FFF?text=تجارب+علمية',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileUrl: null,
      sourceType: ContentSourceType.youtube,
      pages: [],
      categoryIds: [7],
      ageGroupIds: [3],
    },
    {
      title: 'قصة الخلق للصغار',
      description: 'قصة الخلق بطريقة مبسطة للأطفال',
      type: ContentType.video,
      ageMin: 6,
      ageMax: 8,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FFD700/000?text=قصة+الخلق',
      contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileUrl: null,
      sourceType: ContentSourceType.youtube,
      pages: [],
      categoryIds: [8],
      ageGroupIds: [2],
    },
    // أضف 10 فيديوهات أخرى هنا...

    // 🎮 ألعاب تعليمية (20 لعبة PDF)
    {
      title: 'توصيل النقاط - الأرقام',
      description: 'لعبة توصيل النقاط لتعلم تسلسل الأرقام',
      type: ContentType.game,
      ageMin: 4,
      ageMax: 6,
      thumbnailUrl: 'https://via.placeholder.com/300x200/9370DB/FFF?text=توصيل+النقاط',
      contentUrl: null,
      fileUrl: '/games/connect-dots-numbers.pdf',
      sourceType: ContentSourceType.uploaded,
      pages: [],
      categoryIds: [4],
      ageGroupIds: [1],
    },
    {
      title: 'البحث عن الكلمات',
      description: 'لعبة البحث عن الكلمات العربية البسيطة',
      type: ContentType.game,
      ageMin: 7,
      ageMax: 9,
      thumbnailUrl: 'https://via.placeholder.com/300x200/20B2AA/FFF?text=بحث+عن+كلمات',
      contentUrl: null,
      fileUrl: '/games/word-search.pdf',
      sourceType: ContentSourceType.uploaded,
      pages: [],
      categoryIds: [6],
      ageGroupIds: [2],
    },
    {
      title: 'تلوين حسب الرقم',
      description: 'ورقة تلوين حيث كل لون مرتبط برقم',
      type: ContentType.game,
      ageMin: 5,
      ageMax: 7,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FF69B4/FFF?text=تلوين+بالأرقام',
      contentUrl: null,
      fileUrl: '/games/color-by-number.pdf',
      sourceType: ContentSourceType.uploaded,
      pages: [],
      categoryIds: [3, 4],
      ageGroupIds: [1, 2],
    },
    {
      title: 'متاهة الحيوانات',
      description: 'ساعد الحيوان للوصول إلى بيته عبر المتاهة',
      type: ContentType.game,
      ageMin: 5,
      ageMax: 8,
      thumbnailUrl: 'https://via.placeholder.com/300x200/CD853F/FFF?text=متاهة+الحيوانات',
      contentUrl: null,
      fileUrl: '/games/animal-maze.pdf',
      sourceType: ContentSourceType.uploaded,
      pages: [],
      categoryIds: [1],
      ageGroupIds: [1, 2],
    },
    {
      title: 'توصيل الصورة بالكلمة',
      description: 'لعبة مطابقة الصور مع الكلمات العربية',
      type: ContentType.game,
      ageMin: 6,
      ageMax: 8,
      thumbnailUrl: 'https://via.placeholder.com/300x200/6495ED/FFF?text=توصيل+صورة+كلمة',
      contentUrl: null,
      fileUrl: '/games/match-picture-word.pdf',
      sourceType: ContentSourceType.uploaded,
      pages: [],
      categoryIds: [1, 6],
      ageGroupIds: [2],
    },
    // أضف 15 لعبة أخرى هنا...

    // 📚 قصص إضافية متنوعة
    {
      title: 'العائلة السعيدة',
      description: 'قصة عن أهمية الأسرة والتعاون بين أفرادها',
      type: ContentType.story,
      ageMin: 4,
      ageMax: 6,
      thumbnailUrl: 'https://via.placeholder.com/300x200/FFB347/000?text=العائلة+السعيدة',
      contentUrl: null,
      fileUrl: null,
      sourceType: ContentSourceType.uploaded,
      pages: [
        { pageNumber: 1, imageUrl: 'https://via.placeholder.com/600x400/FFD580/000?text=الصفحة+1', text: 'كانت هناك عائلة مكونة من أب وأم وأطفال يعيشون في بيت صغير.' },
        { pageNumber: 2, imageUrl: 'https://via.placeholder.com/600x400/FFD580/000?text=الصفحة+2', text: 'كل صباح، يساعد الأطفال في ترتيب المنزل.' },
        { pageNumber: 3, imageUrl: 'https://via.placeholder.com/600x400/FFD580/000?text=الصفحة+3', text: 'يذهب الأب للعمل، بينما تبقى الأم لتعلم الأطفال.' },
        { pageNumber: 4, imageUrl: 'https://via.placeholder.com/600x400/FFD580/000?text=الصفحة+4', text: 'في المساء، يجتمعون ليحكوا قصصاً ويتعشوا معاً.' },
        { pageNumber: 5, imageUrl: 'https://via.placeholder.com/600x400/FFD580/000?text=الصفحة+5', text: 'هذه العائلة سعيدة لأنها تحب بعضها وتساعد بعضها.' },
      ],
      categoryIds: [8],
      ageGroupIds: [1],
    },
  ]

  // إضافة محتوى إضافي لتكملة 50 عنصر
  const additionalStories = [
    'الكنز المفقود', 'الفراشة الصغيرة', 'الطفل الشجاع', 'النجمة المتألقة',
    'الحديقة السرية', 'الصديق الوفي', 'السفر عبر الزمن', 'المخترع الصغير'
  ]

  const additionalVideos = [
    'أغنية أيام الأسبوع', 'تعليم الجمع والطرح', 'رحلة إلى الفضاء',
    'كيف تنمو النباتات', 'الحيوانات المهددة بالانقراض'
  ]

  const additionalGames = [
    'ألغاز رياضية', 'تتبع الخطوط', 'اكتشف الفرق', 'الكلمات المتقاطعة',
    'سودوكو للأطفال', 'تركيب الصور', 'تصنيف الحيوانات', 'خريطة العالم'
  ]

  // استخدام معرفات الفئات والعمر الفعلية (1-based index → id من createManyAndReturn)
  const catIds = categories.map(c => c.id)
  const ageIds = ageGroups.map(a => a.id)

  let orderIndex = 0
  for (const item of contentData) {
    const content = await prisma.content.create({
      data: {
        title: item.title,
        description: item.description,
        type: item.type,
        ageMin: item.ageMin,
        ageMax: item.ageMax,
        thumbnailUrl: item.thumbnailUrl,
        contentUrl: item.contentUrl,
        fileUrl: item.fileUrl,
        sourceType: item.sourceType,
        orderIndex: orderIndex++,
        pages: item.pages.length > 0 ? {
          create: item.pages
        } : undefined,
      },
    })

    // إضافة الفئات (categoryIds في contentData هي indices 1-based: 1=أول فئة، 8=ثامن فئة)
    if (item.categoryIds && item.categoryIds.length > 0) {
      await prisma.contentCategory.createMany({
        data: item.categoryIds.map(idx => ({
          contentId: content.id,
          categoryId: catIds[idx - 1],
        })),
      })
    }

    // إضافة الفئات العمرية (ageGroupIds 1-based)
    if (item.ageGroupIds && item.ageGroupIds.length > 0) {
      await prisma.contentAgeGroup.createMany({
        data: item.ageGroupIds.map(idx => ({
          contentId: content.id,
          ageGroupId: ageIds[idx - 1],
        })),
      })
    }
  }

  console.log(`✅ Created ${contentData.length} content items`)
  console.log(`📊 Total: ${contentData.length} items (need ${50 - contentData.length} more to reach 50)`)

  // ========================
  // 7. توليد محتوى إضافي تلقائياً
  // ========================
  console.log('🔧 Generating additional content automatically...')
  
  const allTypes = [ContentType.story, ContentType.video, ContentType.game]
  const allSourceTypes = [ContentSourceType.uploaded, ContentSourceType.youtube]
  const allCategories = categories.map(c => c.id)
  const allAgeGroups = ageGroups.map(a => a.id)

  // توليد 30 عنصر إضافي لتكملة 50
  for (let i = contentData.length + 1; i <= 50; i++) {
    const type = allTypes[Math.floor(Math.random() * allTypes.length)]
    const sourceType = type === ContentType.video ? ContentSourceType.youtube : ContentSourceType.uploaded
    
    const content = await prisma.content.create({
      data: {
        title: `عنصر تعليمي ${i}`,
        description: `هذا هو الوصف لعنصر التعلم رقم ${i} المصمم للأطفال`,
        type,
        ageMin: 3 + Math.floor(Math.random() * 6),
        ageMax: 6 + Math.floor(Math.random() * 6),
        thumbnailUrl: `https://via.placeholder.com/300x200/${Math.floor(Math.random()*16777215).toString(16)}/FFF?text=عنصر+${i}`,
        contentUrl: type === ContentType.video ? 'https://www.youtube.com/watch?v=example' : null,
        fileUrl: type === ContentType.game ? `/games/game-${i}.pdf` : null,
        sourceType,
        orderIndex: orderIndex++,
        isActive: Math.random() > 0.1, // 90% نشط
      },
    })

    // إضافة فئات عشوائية (1-3 فئات)
    const numCategories = 1 + Math.floor(Math.random() * 3)
    const selectedCategories = [...allCategories]
      .sort(() => 0.5 - Math.random())
      .slice(0, numCategories)

    for (const categoryId of selectedCategories) {
      await prisma.contentCategory.create({
        data: {
          contentId: content.id,
          categoryId,
        },
      })
    }

    // إضافة فئات عمرية عشوائية (1-2 فئة)
    const numAgeGroups = 1 + Math.floor(Math.random() * 2)
    const selectedAgeGroups = [...allAgeGroups]
      .sort(() => 0.5 - Math.random())
      .slice(0, numAgeGroups)

    for (const ageGroupId of selectedAgeGroups) {
      await prisma.contentAgeGroup.create({
        data: {
          contentId: content.id,
          ageGroupId,
        },
      })
    }

    // إضافة صفحات للقصص فقط
    if (type === ContentType.story) {
      const numPages = 3 + Math.floor(Math.random() * 3) // 3-5 صفحات
      for (let p = 1; p <= numPages; p++) {
        await prisma.contentPage.create({
          data: {
            contentId: content.id,
            pageNumber: p,
            imageUrl: `https://via.placeholder.com/600x400/${Math.floor(Math.random()*16777215).toString(16)}/000?text=صفحة+${p}`,
            text: `هذا هو نص الصفحة ${p} من القصة رقم ${i}`,
          },
        })
      }
    }

    if (i % 10 === 0) {
      console.log(`   Generated ${i} content items...`)
    }
  }

  console.log('🎉 Seed completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - Age groups: ${ageGroups.length}`)
  console.log(`   - Content items: 50`)
  console.log('🔑 Admin login:')
  console.log('   Email: admin@kidslibrary.com')
  console.log('   Password: Admin123!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1) as unknown as never;  // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });