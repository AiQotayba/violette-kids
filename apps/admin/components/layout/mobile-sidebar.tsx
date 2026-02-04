"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Gamepad2,
  FolderTree,
  Users2,
  User,
  Settings,
  Library,
  Baby,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { SheetClose } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: NavItem[] = [
  { title: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { title: "القصص", href: "/dashboard/stories", icon: BookOpen },
  { title: "الفيديوهات", href: "/dashboard/videos", icon: Video },
  { title: "الألعاب", href: "/dashboard/games", icon: Gamepad2 },
]

const managementNavItems: NavItem[] = [
  { title: "التصنيفات", href: "/dashboard/categories", icon: FolderTree },
  { title: "الفئات العمرية", href: "/dashboard/age-groups", icon: Baby },
  { title: "المديرون", href: "/dashboard/users", icon: Users2 },
  { title: "الملف الشخصي", href: "/dashboard/profile", icon: User },
  { title: "الإعدادات", href: "/dashboard/settings", icon: Settings },
]

export function MobileSidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    auth.logout()
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Library className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">المكتبة</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {/* Main Nav */}
        <div className="space-y-1">
          <span className="mb-2 block px-3 text-xs font-medium text-muted-foreground">
            المحتوى
          </span>
          {mainNavItems.map((item) => (
            <MobileNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        {/* Separator */}
        <div className="my-4 h-px bg-border" />

        {/* Management Nav */}
        <div className="space-y-1">
          <span className="mb-2 block px-3 text-xs font-medium text-muted-foreground">
            الإدارة
          </span>
          {managementNavItems.map((item) => (
            <MobileNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>
    </div>
  )
}

function MobileNavLink({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const isActive = pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href))
  const Icon = item.icon

  return (
    <SheetClose asChild>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
        <span>{item.title}</span>
      </Link>
    </SheetClose>
  )
}
