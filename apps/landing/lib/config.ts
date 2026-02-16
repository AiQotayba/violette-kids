/**
 * رابط التحميل المباشر للتطبيق (APK).
 * ضع ملف الـ APK في public/download/app.apk أو غيّر القيمة لرابط خارجي.
 */
export const DOWNLOAD_APP_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_APP_URL ?? "/download/app.apk";

/** مسار لقطة شاشة التطبيق — الشاشة الرئيسية (تقدم + قصص) */
export const APP_SCREENSHOT_PATH = "/app-screenshot.png";

/** مسار لقطة الشاشة الثانية — الشعار والشارات */
export const APP_SCREENSHOT_PATH_2 = "/app-screenshot-2.png";

/** صورة الهيرو — هاتفان مائلان ومتداخلان (تصميم جاهز) */
export const HERO_PHONES_IMAGE = "/hero-phones.png";
