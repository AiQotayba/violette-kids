"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Star, BookOpen, Gamepad2, Video, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGamificationState, type GamificationState } from "@/lib/gamification";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/stories", label: "القصص", icon: BookOpen },
  { href: "/videos", label: "الفيديوهات", icon: Video },
  { href: "/games", label: "الألعاب", icon: Gamepad2 },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gamificationState, setGamificationState] = useState<GamificationState | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setGamificationState(getGamificationState());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:animate-wiggle transition-transform">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">
              مكتبة الأطفال
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 touch-target btn-press"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Stars Counter & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Stars Display */}
            {gamificationState && (
              <Link
                href="/achievements"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/50 hover:bg-accent transition-colors btn-press"
              >
                <Star className="w-5 h-5 text-accent-foreground fill-accent-foreground animate-sparkle" />
                <span className="font-bold text-accent-foreground">
                  {gamificationState.stars}
                </span>
                <div className="hidden sm:flex items-center gap-1 border-r border-accent-foreground/20 pr-2 mr-1">
                  <span className="text-xs text-muted-foreground">المستوى</span>
                  <span className="font-bold text-primary">
                    {gamificationState.level}
                  </span>
                </div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden touch-target"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-64 border-t border-border" : "max-h-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-all duration-200 touch-target animate-slide-up stagger-${index + 1}`}
              style={{ opacity: isMenuOpen ? 1 : 0 }}
            >
              <item.icon className="w-6 h-6 text-primary" />
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
