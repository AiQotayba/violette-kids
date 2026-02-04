"use client"

import * as React from "react"
import { Settings, Key, FileText } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable, type TableColumn } from "@/components/table/data-table"
import { SettingDialog } from "@/components/dialogs/setting-dialog"
import { Badge } from "@/components/ui/badge"
import type { AppSetting } from "@/lib/types"

const columns: TableColumn<AppSetting>[] = [
  {
    key: "key",
    label: "المفتاح",
    width: "min-w-[200px]",
    render: (value) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/10">
          <Key className="h-4 w-4 text-chart-4" />
        </div>
        <Badge variant="secondary" className="font-mono bg-secondary text-foreground">
          {String(value)}
        </Badge>
      </div>
    ),
  },
  {
    key: "value",
    label: "القيمة",
    width: "min-w-[300px]",
    render: (value) => {
      const strValue = String(value)
      const isTruncated = strValue.length > 50
      
      return (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-foreground">
            {isTruncated ? `${strValue.slice(0, 50)}...` : strValue}
          </span>
        </div>
      )
    },
  },
]

export default function SettingsPage() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedSetting, setSelectedSetting] = React.useState<AppSetting | null>(null)
  const apiEndpoint = "/admin/settings"

  const handleAdd = () => {
    setSelectedSetting(null)
    setFormOpen(true)
  }

  const handleEdit = (setting: AppSetting) => {
    setSelectedSetting(setting)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إعدادات التطبيق"
        description="إدارة إعدادات التطبيق العامة"
        icon={Settings}
      />

      <DataTable<AppSetting>
        columns={columns}
        apiEndpoint={apiEndpoint}
        onAdd={handleAdd}
        addLabel="إضافة إعداد"
        searchPlaceholder="ابحث في الإعدادات..."
        emptyMessage="لا توجد إعدادات"
        enableView={false}
        enableEdit={true}
        enableDelete={true}
        actions={{
          onEdit: handleEdit,
        }}
        deleteTitle="حذف الإعداد"
        deleteDescription={(setting) =>
          `هل أنت متأكد من حذف إعداد "${setting.key}"؟ قد يؤثر هذا على سلوك التطبيق.`
        }
      />

      <SettingDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        setting={selectedSetting}
        apiEndpoint={apiEndpoint}
      />
    </div>
  )
}
