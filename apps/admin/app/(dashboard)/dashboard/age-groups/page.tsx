"use client"

import * as React from "react"
import { Baby, Users } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable, type TableColumn } from "@/components/table/data-table"
import { AgeGroupDialog } from "@/components/dialogs/age-group-dialog"
import { Badge } from "@/components/ui/badge"
import type { AgeGroup } from "@/lib/types"

const columns: TableColumn<AgeGroup>[] = [
  {
    key: "label",
    label: "الفئة العمرية",
    width: "min-w-[200px]",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
          <Users className="h-4 w-4 text-chart-3" />
        </div>
        <span className="font-medium text-foreground">{String(value)}</span>
      </div>
    ),
  },
  {
    key: "ageMin",
    label: "العمر الأدنى",
    sortable: true,
    width: "w-32",
    render: (value) => (
      <Badge variant="secondary" className="bg-primary/10 text-primary">
        {String(value)} سنة
      </Badge>
    ),
  },
  {
    key: "ageMax",
    label: "العمر الأقصى",
    sortable: true,
    width: "w-32",
    render: (value) => (
      <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
        {String(value)} سنة
      </Badge>
    ),
  },
]

export default function AgeGroupsPage() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedAgeGroup, setSelectedAgeGroup] = React.useState<AgeGroup | null>(null)
  const apiEndpoint = "/admin/age-groups"

  const handleAdd = () => {
    setSelectedAgeGroup(null)
    setFormOpen(true)
  }

  const handleEdit = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الفئات العمرية"
        description="إدارة الفئات العمرية للمحتوى"
        icon={Baby}
      />

      <DataTable<AgeGroup>
        columns={columns}
        apiEndpoint={apiEndpoint}
        onAdd={handleAdd}
        addLabel="إضافة فئة عمرية"
        searchPlaceholder="ابحث في الفئات العمرية..."
        emptyMessage="لا توجد فئات عمرية"
        enableView={false}
        enableEdit={true}
        enableDelete={true}
        enableReorder={true}
        actions={{
          onEdit: handleEdit,
        }}
        deleteTitle="حذف الفئة العمرية"
        deleteDescription={(ageGroup) =>
          `هل أنت متأكد من حذف فئة "${ageGroup.label}"؟ سيتم إزالة الفئة العمرية من جميع المحتوى المرتبط بها.`
        }
      />

      <AgeGroupDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        ageGroup={selectedAgeGroup}
        apiEndpoint={apiEndpoint}
      />
    </div>
  )
}
