"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import type { Admin, AdminFormData } from "@/lib/types"

interface AdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin?: Admin | null
  apiEndpoint: string
}

export function AdminDialog({
  open,
  onOpenChange,
  admin,
  apiEndpoint,
}: AdminDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isEdit = !!admin

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  React.useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        email: admin.email,
        password: "",
      })
    } else {
      reset({
        name: "",
        email: "",
        password: "",
      })
    }
  }, [admin, reset])

  const onSubmit = async (data: AdminFormData) => {
    try {
      setIsSubmitting(true)
      
      const submitData = isEdit && !data.password 
        ? { name: data.name, email: data.email }
        : data

      if (isEdit && admin) {
        const response = await api.put(`${apiEndpoint}/${admin.id}`, submitData)
        if (response.isError) throw new Error(response.message)
        toast.success("تم تحديث بيانات المدير بنجاح")
      } else {
        const response = await api.post(apiEndpoint, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم إضافة المدير بنجاح")
      }

      queryClient.invalidateQueries({ queryKey: ["table-data", apiEndpoint] })
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل بيانات المدير" : "إضافة مدير جديد"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "قم بتعديل بيانات المدير" : "أدخل بيانات المدير الجديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم *</Label>
            <Input
              id="name"
              {...register("name", { required: "الاسم مطلوب" })}
              placeholder="أدخل اسم المدير"
              className="bg-secondary"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { 
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "البريد الإلكتروني غير صالح"
                }
              })}
              placeholder="admin@example.com"
              className="bg-secondary"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              كلمة المرور {!isEdit && "*"}
              {isEdit && <span className="text-xs text-muted-foreground">(اتركها فارغة للإبقاء على كلمة المرور الحالية)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password", { 
                required: !isEdit ? "كلمة المرور مطلوبة" : false,
                minLength: {
                  value: 8,
                  message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                }
              })}
              placeholder="••••••••"
              className="bg-secondary"
              dir="ltr"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : isEdit ? "حفظ التغييرات" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
