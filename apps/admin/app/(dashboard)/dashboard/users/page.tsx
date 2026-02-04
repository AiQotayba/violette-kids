"use client"

import * as React from "react"
import { Users2, Mail, Shield } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable, type TableColumn } from "@/components/table/data-table"
import { AdminDialog } from "@/components/dialogs/admin-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Admin } from "@/lib/types"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const columns: TableColumn<Admin>[] = [
  {
    key: "name",
    label: "المدير",
    width: "min-w-[200px]",
    render: (value, row) => {
      const initials = String(value)
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{String(value)}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span dir="ltr">{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    key: "email",
    label: "البريد الإلكتروني",
    width: "w-48",
    className: "hidden md:table-cell",
    render: (value) => (
      <span className="text-muted-foreground" dir="ltr">
        {String(value)}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "تاريخ الإنشاء",
    sortable: true,
    width: "w-36",
    render: (value) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(String(value)), "dd MMM yyyy", { locale: ar })}
      </span>
    ),
  },
]

export default function UsersPage() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedAdmin, setSelectedAdmin] = React.useState<Admin | null>(null)
  const apiEndpoint = "/admin/users"

  const handleAdd = () => {
    setSelectedAdmin(null)
    setFormOpen(true)
  }

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة المديرين"
        description="إدارة حسابات مديري النظام"
        icon={Users2}
      />

      <DataTable<Admin>
        columns={columns}
        apiEndpoint={apiEndpoint}
        onAdd={handleAdd}
        addLabel="إضافة مدير"
        searchPlaceholder="ابحث في المديرين..."
        emptyMessage="لا يوجد مديرون"
        enableView={false}
        enableEdit={true}
        enableDelete={true}
        actions={{
          onEdit: handleEdit,
        }}
        deleteTitle="حذف المدير"
        deleteDescription={(admin) =>
          `هل أنت متأكد من حذف حساب "${admin.name}"؟ لن يتمكن من الوصول إلى لوحة التحكم.`
        }
      />

      <AdminDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        admin={selectedAdmin}
        apiEndpoint={apiEndpoint}
      />
    </div>
  )
}
