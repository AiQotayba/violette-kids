import { PrismaClient, ContentType, ContentSourceType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 تنظيف البيانات القديمة...')
  await prisma.contentPage.deleteMany()
  await prisma.contentCategory.deleteMany()
  await prisma.contentAgeGroup.deleteMany()
  await prisma.content.deleteMany()
  await prisma.category.deleteMany()
  await prisma.ageGroup.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.appSetting.deleteMany()

  // 1. الفئات مع أيقونات شغالة (PNG)
  const categoriesData = [
    { name: 'عالم الحيوان', icon: 'https://cdn-icons-png.flaticon.com/512/188/188414.png' },
    { name: 'الفضاء', icon: 'https://cdn-icons-png.flaticon.com/512/1048/1048453.png' },
    { name: 'الرياضة والنشاط', icon: 'https://cdn-icons-png.flaticon.com/512/2871/2871210.png' }, // الفئة الرياضية
    { name: 'الرياضيات', icon: 'https://cdn-icons-png.flaticon.com/512/2432/2432304.png' },
    { name: 'حكايات قبل النوم', icon: 'https://cdn-icons-png.flaticon.com/512/3094/3094371.png' },
    { name: 'اللغة العربية', icon: 'https://cdn-icons-png.flaticon.com/512/3873/3873960.png' },
    { name: 'مختبر العلوم', icon: 'https://cdn-icons-png.flaticon.com/512/1048/1048951.png' },
    { name: 'فن وتلوين', icon: 'https://cdn-icons-png.flaticon.com/512/588/588395.png' },
  ]
  const categories = await prisma.category.createManyAndReturn({ data: categoriesData })

  // 2. الفئات العمرية
  const ageGroups = await prisma.ageGroup.createManyAndReturn({
    data: [
      { label: '3-5 سنوات', ageMin: 3, ageMax: 5 },
      { label: '6-8 سنوات', ageMin: 6, ageMax: 8 },
      { label: '9-12 سنة', ageMin: 9, ageMax: 12 },
    ],
  })

  // 3. إنشاء المدير
  const hashedPassword = await hash('Admin123!', 10)
  await prisma.admin.create({
    data: { name: 'مدير ڤيوليت', email: 'admin@violette.com', password: hashedPassword },
  })

  // 4. مصفوفات البيانات لتوليد 50 عنصراً فريداً
  const titles = [
    'مغامرة الأسد سيمبا', 'مباراة كرة القدم الحماسية', 'رحلة إلى القمر', 
    'تعلم الجمع ببساطة', 'البطة الذكية', 'أبطال التنس', 'أسرار المحيط', 
    'سباق الدراجات', 'النوم العميق', 'حروف الهجاء الممتعة', 'كواكب المجموعة الشمسية',
    'يوجا للأطفال', 'كيف نصنع الألوان؟', 'قصة الأرنب والسلحفاة', 'تمارين الصباح'
  ]

  const youtubeVideos = [
    '5vTofH_lGvE', 'L2G_O7F0qB4', 'L_A_HjHZxfI', '78SOn3p_qX8', '9N9L-qVzE8I'
  ]

  console.log('📚 جاري إنشاء 50 عنصراً تعليمياً...')

  for (let i = 0; i < 50; i++) {
    const typeIdx = i % 3; // دورة بين القصة، الفيديو، واللعبة
    const catIdx = i % categories.length;
    const ageIdx = i % ageGroups.length;
    
    let type: ContentType = ContentType.story;
    let sourceType: ContentSourceType = ContentSourceType.uploaded;
    let contentUrl: string | null = null;
    let fileUrl: string | null = null;

    if (typeIdx === 1) {
      type = ContentType.video;
      sourceType = ContentSourceType.youtube;
      contentUrl = `https://www.youtube.com/watch?v=${youtubeVideos[i % youtubeVideos.length]}`;
    } else if (typeIdx === 2) {
      type = ContentType.game;
      fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // رابط PDF عالمي مستقر
    }

    const content = await prisma.content.create({
      data: {
        title: `${titles[i % titles.length]} (${i + 1})`,
        description: `هذا المحتوى مصمم خصيصاً لتعزيز مهارات الأطفال في ${categories[catIdx].name}.`,
        type,
        thumbnailUrl: `https://loremflickr.com/400/300/${['kids','animals','sports','space'][i % 4]}?lock=${i}`,
        contentUrl,
        fileUrl,
        sourceType,
        ageMin: ageGroups[ageIdx].ageMin,
        ageMax: ageGroups[ageIdx].ageMax,
        orderIndex: i,
        // صفحات وهمية للقصص فقط
        pages: type === ContentType.story ? {
          create: [
            { pageNumber: 1, text: 'في البداية، كان هناك بطل صغير يحب الاستكشاف...', imageUrl: `https://loremflickr.com/600/400/story?lock=${i}` },
            { pageNumber: 2, text: 'وفجأة، ظهر له صديق جديد ساعده في رحلته.', imageUrl: `https://loremflickr.com/600/400/friend?lock=${i+50}` }
          ]
        } : undefined
      }
    })

    // ربط الفئة والفئة العمرية
    await prisma.contentCategory.create({ data: { contentId: content.id, categoryId: categories[catIdx].id } })
    await prisma.contentAgeGroup.create({ data: { contentId: content.id, ageGroupId: ageGroups[ageIdx].id } })
  }

  console.log('✅ تم الانتهاء! 50 عنصراً جاهزاً مع روابط شغالة وفئة رياضية.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })