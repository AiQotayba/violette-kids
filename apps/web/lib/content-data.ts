// Mock data for the kids library - In production, this would come from the database

export type ContentType = "story" | "video" | "game";
export type AgeGroup = "3-4" | "5-6" | "7-8";
export type Category =
  | "adventure"
  | "animals"
  | "science"
  | "arabic"
  | "math"
  | "art"
  | "nature"
  | "social";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  ageGroup: AgeGroup;
  category: Category;
  thumbnail: string;
  duration?: string;
  pages?: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Story extends ContentItem {
  type: "story";
  pages: number;
  pageImages: string[];
}

export interface Video extends ContentItem {
  type: "video";
  duration: string;
  videoUrl: string;
}

export interface Game extends ContentItem {
  type: "game";
  videoUrl: string;
  duration: string;
}

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "adventure", label: "مغامرات", icon: "compass" },
  { id: "animals", label: "حيوانات", icon: "cat" },
  { id: "science", label: "علوم", icon: "flask" },
  { id: "arabic", label: "اللغة العربية", icon: "book" },
  { id: "math", label: "رياضيات", icon: "calculator" },
  { id: "art", label: "فنون", icon: "palette" },
  { id: "nature", label: "طبيعة", icon: "tree" },
  { id: "social", label: "مهارات اجتماعية", icon: "users" },
];

export const ageGroups: { id: AgeGroup; label: string }[] = [
  { id: "3-4", label: "٣-٤ سنوات" },
  { id: "5-6", label: "٥-٦ سنوات" },
  { id: "7-8", label: "٧-٨ سنوات" },
];

export const contentTypes: { id: ContentType; label: string; icon: string }[] =
  [
    { id: "story", label: "قصص", icon: "book-open" },
    { id: "video", label: "فيديوهات", icon: "play-circle" },
    { id: "game", label: "ألعاب", icon: "gamepad-2" },
  ];

// Story cover images
const storyImages = [
  "/images/stories/bears.png", // الدببة الثلاثة
  "/images/stories/lion.png", // الأسد الوفي
  "/images/stories/dinosaurs.png", // الديناصورات
  "/images/stories/kids-stories.png", // قصص أطفال
  "/images/stories/grandma.png", // حكاياتي الجزء الأول
  "/images/stories/custom-stories.png", // قصص خاصه بطفلك
  "/images/stories/forest-kids.png", // أطفال الغابة
  "/images/stories/hikayati.png", // حكاياتي الجزء الثاني
  "/images/stories/farmer.png", // الفلاح البخيل
];

// Sample Stories
export const stories: Story[] = [
  {
    id: "story-1",
    title: "الدببة الثلاثة",
    description: "قصة كلاسيكية ممتعة عن الدببة الثلاثة الظريفة",
    type: "story",
    ageGroup: "3-4",
    category: "animals",
    thumbnail: storyImages[0],
    pages: 8,
    pageImages: Array(8).fill(storyImages[0]),
    isFeatured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "story-2",
    title: "الأسد الوفي",
    description: "قصة جميلة عن الصداقة والوفاء بين طفل وأسد",
    type: "story",
    ageGroup: "5-6",
    category: "animals",
    thumbnail: storyImages[1],
    pages: 12,
    pageImages: Array(12).fill(storyImages[1]),
    isFeatured: true,
    createdAt: "2024-01-20",
  },
  {
    id: "story-3",
    title: "أنا أكتضف الديناصورات لم تنقرض",
    description: "رحلة علمية مثيرة لاكتشاف عالم الديناصورات",
    type: "story",
    ageGroup: "7-8",
    category: "science",
    thumbnail: storyImages[2],
    pages: 15,
    pageImages: Array(15).fill(storyImages[2]),
    isFeatured: true,
    createdAt: "2024-02-01",
  },
  {
    id: "story-4",
    title: "قصص أطفال",
    description: "مجموعة قصص ممتعة للأطفال الصغار",
    type: "story",
    ageGroup: "3-4",
    category: "adventure",
    thumbnail: storyImages[3],
    pages: 10,
    pageImages: Array(10).fill(storyImages[3]),
    createdAt: "2024-02-10",
  },
  {
    id: "story-5",
    title: "حكاياتي - الجزء الأول",
    description: "حكايات جميلة من الجدة لأحفادها",
    type: "story",
    ageGroup: "5-6",
    category: "social",
    thumbnail: storyImages[4],
    pages: 20,
    pageImages: Array(20).fill(storyImages[4]),
    createdAt: "2024-02-15",
  },
  {
    id: "story-6",
    title: "قصص خاصة بطفلك",
    description: "قصص أطفال ممتعة وملهمة برسومات جذابة",
    type: "story",
    ageGroup: "3-4",
    category: "animals",
    thumbnail: storyImages[5],
    pages: 8,
    pageImages: Array(8).fill(storyImages[5]),
    createdAt: "2024-02-20",
  },
  {
    id: "story-7",
    title: "أطفال الغابة",
    description: "مغامرات أطفال الغابة الشجعان",
    type: "story",
    ageGroup: "5-6",
    category: "nature",
    thumbnail: storyImages[6],
    pages: 12,
    pageImages: Array(12).fill(storyImages[6]),
    createdAt: "2024-02-25",
  },
  {
    id: "story-8",
    title: "حكاياتي - الجزء الثاني",
    description: "المزيد من الحكايات الممتعة للأطفال",
    type: "story",
    ageGroup: "5-6",
    category: "adventure",
    thumbnail: storyImages[7],
    pages: 18,
    pageImages: Array(18).fill(storyImages[7]),
    isFeatured: true,
    createdAt: "2024-03-01",
  },
  {
    id: "story-9",
    title: "الفلاح البخيل",
    description: "قصة تعليمية عن الكرم ومساعدة الآخرين",
    type: "story",
    ageGroup: "5-6",
    category: "social",
    thumbnail: storyImages[8],
    pages: 10,
    pageImages: Array(10).fill(storyImages[8]),
    createdAt: "2024-03-05",
  },
  {
    id: "story-10",
    title: "مغامرة الدببة",
    description: "مغامرة جديدة مع أصدقائنا الدببة",
    type: "story",
    ageGroup: "3-4",
    category: "adventure",
    thumbnail: storyImages[0],
    pages: 8,
    pageImages: Array(8).fill(storyImages[0]),
    createdAt: "2024-03-10",
  },
];

// Sample Videos
export const videos: Video[] = [
  {
    id: "video-1",
    title: "تعلم الأرقام من ١ إلى ١٠",
    description: "فيديو تعليمي ممتع لتعلم الأرقام العربية",
    type: "video",
    ageGroup: "3-4",
    category: "math",
    thumbnail: storyImages[3],
    duration: "5:30",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isFeatured: true,
    createdAt: "2024-01-10",
  },
  {
    id: "video-2",
    title: "أصوات الحيوانات",
    description: "تعرف على أصوات الحيوانات المختلفة",
    type: "video",
    ageGroup: "3-4",
    category: "animals",
    thumbnail: storyImages[1],
    duration: "4:15",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    createdAt: "2024-01-18",
  },
  {
    id: "video-3",
    title: "كيف ينمو النبات؟",
    description: "رحلة مثيرة لاكتشاف كيف تنمو النباتات",
    type: "video",
    ageGroup: "5-6",
    category: "science",
    thumbnail: storyImages[6],
    duration: "7:45",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isFeatured: true,
    createdAt: "2024-01-25",
  },
  {
    id: "video-4",
    title: "تعلم الألوان",
    description: "اكتشف عالم الألوان الممتع",
    type: "video",
    ageGroup: "3-4",
    category: "art",
    thumbnail: storyImages[5],
    duration: "6:00",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    createdAt: "2024-02-05",
  },
  {
    id: "video-5",
    title: "رحلة إلى المحيط",
    description: "اكتشف عجائب المحيط والكائنات البحرية",
    type: "video",
    ageGroup: "7-8",
    category: "nature",
    thumbnail: storyImages[2],
    duration: "10:20",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isFeatured: true,
    createdAt: "2024-02-12",
  },
];

// Sample Games (now as embedded videos)
export const games: Game[] = [
  {
    id: "game-1",
    title: "تعلم الرسم للأطفال",
    description: "فيديو تعليمي لتعلم الرسم خطوة بخطوة",
    type: "game",
    ageGroup: "3-4",
    category: "art",
    thumbnail: storyImages[5],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "8:00",
    isFeatured: true,
    createdAt: "2024-01-12",
  },
  {
    id: "game-2",
    title: "أغاني الحيوانات",
    description: "أغاني تعليمية ممتعة عن الحيوانات",
    type: "game",
    ageGroup: "3-4",
    category: "animals",
    thumbnail: storyImages[0],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "12:30",
    createdAt: "2024-01-22",
  },
  {
    id: "game-3",
    title: "تعلم الجمع والطرح",
    description: "فيديو تعليمي للجمع والطرح بطريقة ممتعة",
    type: "game",
    ageGroup: "5-6",
    category: "math",
    thumbnail: storyImages[7],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "15:00",
    isFeatured: true,
    createdAt: "2024-02-02",
  },
  {
    id: "game-4",
    title: "نشيد الحروف العربية",
    description: "أنشودة تعليمية للحروف العربية",
    type: "game",
    ageGroup: "3-4",
    category: "arabic",
    thumbnail: storyImages[4],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "5:45",
    createdAt: "2024-02-08",
  },
  {
    id: "game-5",
    title: "رحلة الديناصورات",
    description: "فيديو تعليمي عن عالم الديناصورات",
    type: "game",
    ageGroup: "7-8",
    category: "science",
    thumbnail: storyImages[2],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18:00",
    isFeatured: true,
    createdAt: "2024-02-18",
  },
];

// Combine all content
export const allContent: ContentItem[] = [...stories, ...videos, ...games];

// Helper functions
export function getContentById(id: string): ContentItem | undefined {
  return allContent.find((item) => item.id === id);
}

export function getStoryById(id: string): Story | undefined {
  return stories.find((story) => story.id === id);
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((video) => video.id === id);
}

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}

export function getFeaturedContent(): ContentItem[] {
  return allContent.filter((item) => item.isFeatured);
}

export function filterContent(
  type?: ContentType,
  ageGroup?: AgeGroup,
  category?: Category
): ContentItem[] {
  return allContent.filter((item) => {
    if (type && item.type !== type) return false;
    if (ageGroup && item.ageGroup !== ageGroup) return false;
    if (category && item.category !== category) return false;
    return true;
  });
}

export function getContentByType(type: ContentType): ContentItem[] {
  return allContent.filter((item) => item.type === type);
}
