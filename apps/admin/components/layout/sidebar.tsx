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
  ChevronLeft,
  ChevronRight,
  Library,
  Baby,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
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

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  const handleLogout = () => {
    auth.logout()
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-screen border-l border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Library className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">المكتبة</span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Library className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-3 top-20 z-50 h-6 w-6 rounded-full border border-border bg-sidebar shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          {/* Main Nav */}
          <div className="space-y-1">
            {!collapsed && (
              <span className="mb-2 block px-3 text-xs font-medium text-muted-foreground">
                المحتوى
              </span>
            )}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="my-4 h-px bg-border" />

          {/* Management Nav */}
          <div className="space-y-1">
            {!collapsed && (
              <span className="mb-2 block px-3 text-xs font-medium text-muted-foreground">
                الإدارة
              </span>
            )}
            {managementNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>

      </aside>
    </TooltipProvider>
  )
}

function NavLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem
  pathname: string
  collapsed: boolean
}) {
  const isActive = pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href))
  const Icon = item.icon

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
      {!collapsed && <span>{item.title}</span>}
      {!collapsed && item.badge !== undefined && (
        <span className="mr-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
          {item.badge}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="left">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}
