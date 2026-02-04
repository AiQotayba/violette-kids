"use client"

import * as React from "react"
import { FolderTree, Hash } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable, type TableColumn } from "@/components/table/data-table"
import { CategoryDialog } from "@/components/dialogs/category-dialog"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"

const columns: TableColumn<Category>[] = [
  {
    key: "name",
    label: "اسم التصنيف",
    width: "min-w-[200px]",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Hash className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium text-foreground">{String(value)}</span>
      </div>
    ),
  },
  {
    key: "icon",
    label: "الأيقونة",
    width: "w-32",
    render: (value) => (
      <Badge variant="secondary" className="bg-secondary text-foreground">
        {value ? String(value) : "—"}
      </Badge>
    ),
  },
]

export default function CategoriesPage() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)
  const apiEndpoint = "/admin/categories"

  const handleAdd = () => {
    setSelectedCategory(null)
    setFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة التصنيفات"
        description="إدارة تصنيفات المحتوى"
        icon={FolderTree}
      />

      <DataTable<Category>
        columns={columns}
        apiEndpoint={apiEndpoint}
        onAdd={handleAdd}
        addLabel="إضافة تصنيف"
        searchPlaceholder="ابحث في التصنيفات..."
        emptyMessage="لا توجد تصنيفات"
        enableView={false}
        enableEdit={true}
        enableDelete={true}
        actions={{
          onEdit: handleEdit,
        }}
        deleteTitle="حذف التصنيف"
        deleteDescription={(category) =>
          `هل أنت متأكد من حذف تصنيف "${category.name}"؟ سيتم إزالة التصنيف من جميع المحتوى المرتبط به.`
        }
      />

      <CategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
        apiEndpoint={apiEndpoint}
      />
    </div>
  )
}
