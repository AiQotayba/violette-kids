"use client"

import * as React from "react"
import { Video, Play } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable, type TableColumn } from "@/components/table/data-table"
import { ContentDialog } from "@/components/dialogs/content-dialog"
import { ContentViewDialog } from "@/components/dialogs/content-view-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Content } from "@/lib/types"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const sourceTypeLabels = {
  uploaded: "مرفوع",
  youtube: "يوتيوب",
  external: "خارجي",
}

const columns: TableColumn<Content>[] = [
  {
    key: "title",
    label: "العنوان",
    width: "min-w-[250px]",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 rounded-xl">
            <AvatarImage src={row.thumbnailUrl || ""} alt={String(value)} />
            <AvatarFallback className="rounded-xl bg-chart-2/10">
              <Video className="h-4 w-4 text-chart-2" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
            <Play className="h-4 w-4 text-white" fill="white" />
          </div>
        </div>
        <div>
          <p className="font-medium text-foreground">{String(value)}</p>
          {row.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
              {row.description}
            </p>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "sourceType",
    label: "المصدر",
    width: "w-24",
    render: (value) => (
      <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
        {sourceTypeLabels[value as keyof typeof sourceTypeLabels]}
      </Badge>
    ),
  },
  {
    key: "ageMin",
    label: "الفئة العمرية",
    sortable: true,
    width: "w-32",
    render: (value, row) => (
      <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
        {row.ageMin}-{row.ageMax} سنوات
      </Badge>
    ),
  },
  {
    key: "isActive",
    label: "الحالة",
    sortable: true,
    width: "w-24",
    render: (value) => (
      <Badge
        variant="secondary"
        className={
          value
            ? "bg-success/10 text-success"
            : "bg-muted text-muted-foreground"
        }
      >
        {value ? "نشط" : "معطل"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "تاريخ الإضافة",
    sortable: true,
    width: "w-36",
    render: (value) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(String(value)), "dd MMM yyyy", { locale: ar })}
      </span>
    ),
  },
]

export default function VideosPage() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [selectedContent, setSelectedContent] = React.useState<Content | null>(null)

  const handleAdd = () => {
    setSelectedContent(null)
    setFormOpen(true)
  }

  const handleEdit = (content: Content) => {
    setSelectedContent(content)
    setFormOpen(true)
  }

  const handleView = (content: Content) => {
    setSelectedContent(content)
    setViewOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الفيديوهات"
        description="إدارة الفيديوهات التعليمية للأطفال"
        icon={Video}
      />

      <DataTable<Content>
        columns={columns}
        apiEndpoint="/admin/content?type=video"
        onAdd={handleAdd}
        addLabel="إضافة فيديو"
        searchPlaceholder="ابحث في الفيديوهات..."
        emptyMessage="لا توجد فيديوهات"
        enableView={true}
        enableEdit={true}
        enableDelete={true}
        enableReorder={true}
        actions={{
          onView: handleView,
          onEdit: handleEdit,
        }}
        deleteTitle="حذف الفيديو"
        deleteDescription={(content) =>
          `هل أنت متأكد من حذف فيديو "${content.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
        }
      />

      <ContentDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        content={selectedContent}
        contentType="video"
        apiEndpoint="/admin/content"
      />

      <ContentViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        content={selectedContent}
      />
    </div>
  )
}
