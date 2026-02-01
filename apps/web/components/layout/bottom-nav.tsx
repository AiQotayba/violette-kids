"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Video, Gamepad2, Trophy } from "lucide-react";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/stories", label: "قصص", icon: BookOpen },
  { href: "/videos", label: "فيديو", icon: Video },
  { href: "/games", label: "ألعاب", icon: Gamepad2 },
  { href: "/achievements", label: "نجومي", icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show on detail pages
  if (
    pathname.match(/^\/stories\/[^/]+$/) ||
    pathname.match(/^\/videos\/[^/]+$/) ||
    pathname.match(/^\/games\/[^/]+$/)
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t-2 border-border safe-area-bottom">
      <div className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-all duration-200 touch-target ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-primary"
              }`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 scale-110"
                    : "active:bg-muted active:scale-95"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 transition-transform ${isActive ? "animate-bounce-soft" : ""}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium ${isActive ? "font-bold" : ""}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
