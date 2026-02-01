import Link from "next/link";
import { BookOpen, Heart, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:animate-wiggle transition-transform">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                مكتبة الأطفال الآمنة
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              مكتبة رقمية آمنة للأطفال تحتوي على قصص مصورة وفيديوهات تعليمية
              وألعاب تفاعلية مختارة بعناية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-foreground">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/stories"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                القصص المصورة
              </Link>
              <Link
                href="/videos"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                الفيديوهات التعليمية
              </Link>
              <Link
                href="/games"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                الألعاب التفاعلية
              </Link>
              <Link
                href="/achievements"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                الإنجازات
              </Link>
            </nav>
          </div>

          {/* Safety Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              بيئة آمنة
            </h3>
            <ul className="text-muted-foreground text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                بدون إعلانات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                بدون تتبع
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                محتوى مختار بعناية
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                بدون حسابات مطلوبة
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            صُنع بـ
            <Heart className="w-4 h-4 text-destructive fill-destructive animate-bounce-soft" />
            للأطفال
          </p>
          <p className="text-muted-foreground text-sm">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
