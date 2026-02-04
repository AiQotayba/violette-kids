"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Gamepad2,
  FolderTree,
  Baby,
  TrendingUp,
  Clock,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api-client"
import type { DashboardStats } from "@/lib/types"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const contentTypeLabels: Record<string, string> = {
  story: "قصة",
  video: "فيديو",
  game: "لعبة",
}

const contentTypeColors: Record<string, string> = {
  story: "bg-chart-1/20 text-chart-1",
  video: "bg-chart-2/20 text-chart-2",
  game: "bg-chart-3/20 text-chart-3",
}

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard")
      if (response.isError) throw new Error(response.message)
      return response as unknown as DashboardStats
    },
    staleTime: 60000,
  })

  const stats = dashboard
  const recentContent = dashboard?.recentContent ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم"
        description="نظرة عامة على محتوى المكتبة الرقمية"
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="إجمالي المحتوى"
              value={stats?.totalContent || 0}
              icon={TrendingUp}
              description="جميع أنواع المحتوى"
              iconClassName="bg-primary/10"
            />
            <StatsCard
              title="القصص"
              value={stats?.totalStories || 0}
              icon={BookOpen}
              iconClassName="bg-chart-1/10"
            />
            <StatsCard
              title="الفيديوهات"
              value={stats?.totalVideos || 0}
              icon={Video}
              iconClassName="bg-chart-2/10"
            />
            <StatsCard
              title="الألعاب"
              value={stats?.totalGames || 0}
              icon={Gamepad2}
              iconClassName="bg-chart-3/10"
            />
          </>
        )}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="التصنيفات"
              value={stats?.totalCategories || 0}
              icon={FolderTree}
              iconClassName="bg-chart-4/10"
            />
            <StatsCard
              title="الفئات العمرية"
              value={stats?.totalAgeGroups || 0}
              icon={Baby}
              iconClassName="bg-chart-5/10"
            />
            <StatsCard
              title="المحتوى النشط"
              value={stats?.activeContent || 0}
              icon={Clock}
              description="من إجمالي المحتوى"
              iconClassName="bg-success/10"
            />
          </>
        )}
      </div>

      {/* Recent Content */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            آخر المحتوى المضاف
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentContent?.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card">
                    {content.type === "story" && (
                      <BookOpen className="h-6 w-6 text-chart-1" />
                    )}
                    {content.type === "video" && (
                      <Video className="h-6 w-6 text-chart-2" />
                    )}
                    {content.type === "game" && (
                      <Gamepad2 className="h-6 w-6 text-chart-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {content.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(content.createdAt), "dd MMMM yyyy", {
                        locale: ar,
                      })}
                      {" • "}
                      {content.ageMin}-{content.ageMax} سنوات
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={contentTypeColors[content.type]}
                    >
                      {contentTypeLabels[content.type]}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        content.isActive
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {content.isActive ? "نشط" : "معطل"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
