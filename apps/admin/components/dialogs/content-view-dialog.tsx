"use client"

import * as React from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Gamepad2, Calendar, Clock, Link as LinkIcon } from "lucide-react"
import type { Content } from "@/lib/types"

interface ContentViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: Content | null
}

const contentTypeIcons = {
  story: BookOpen,
  video: Video,
  game: Gamepad2,
}

const contentTypeLabels = {
  story: "قصة",
  video: "فيديو",
  game: "لعبة",
}

const sourceTypeLabels = {
  uploaded: "ملف مرفوع",
  youtube: "يوتيوب",
  external: "رابط خارجي",
}

export function ContentViewDialog({
  open,
  onOpenChange,
  content,
}: ContentViewDialogProps) {
  if (!content) return null

  const Icon = contentTypeIcons[content.type]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {contentTypeLabels[content.type]}
            </Badge>
            <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
              {sourceTypeLabels[content.sourceType]}
            </Badge>
            <Badge
              variant="secondary"
              className={
                content.isActive
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }
            >
              {content.isActive ? "نشط" : "غير نشط"}
            </Badge>
            <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
              {content.ageMin}-{content.ageMax} سنوات
            </Badge>
          </div>

          {/* Thumbnail */}
          {content.thumbnailUrl && (
            <div className="overflow-hidden rounded-xl border border-border">
              <img
                src={content.thumbnailUrl || "/placeholder.svg"}
                alt={content.title}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {content.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">الوصف</h4>
              <p className="text-foreground">{content.description}</p>
            </div>
          )}

          {/* Links */}
          <div className="space-y-3">
            {content.contentUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">رابط المحتوى</p>
                  <a
                    href={content.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block"
                    dir="ltr"
                  >
                    {content.contentUrl}
                  </a>
                </div>
              </div>
            )}
            {content.fileUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">رابط الملف</p>
                  <a
                    href={content.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block"
                    dir="ltr"
                  >
                    {content.fileUrl}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(content.createdAt), "dd MMMM yyyy", {
                  locale: ar,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(content.createdAt), "hh:mm a", { locale: ar })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
