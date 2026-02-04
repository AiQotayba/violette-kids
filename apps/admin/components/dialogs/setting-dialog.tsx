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
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api-client"
import type { AppSetting, SettingFormData } from "@/lib/types"

interface SettingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  setting?: AppSetting | null
  apiEndpoint: string
}

export function SettingDialog({
  open,
  onOpenChange,
  setting,
  apiEndpoint,
}: SettingDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isEdit = !!setting

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingFormData>({
    defaultValues: {
      key: "",
      value: "",
    },
  })

  React.useEffect(() => {
    if (setting) {
      reset({
        key: setting.key,
        value: setting.value,
      })
    } else {
      reset({
        key: "",
        value: "",
      })
    }
  }, [setting, reset])

  const onSubmit = async (data: SettingFormData) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && setting) {
        const response = await api.put(`${apiEndpoint}/${setting.id}`, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم تحديث الإعداد بنجاح")
      } else {
        const response = await api.post(apiEndpoint, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم إضافة الإعداد بنجاح")
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
          <DialogTitle>{isEdit ? "تعديل الإعداد" : "إضافة إعداد جديد"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "قم بتعديل قيمة الإعداد" : "أدخل مفتاح وقيمة الإعداد الجديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="key">المفتاح *</Label>
            <Input
              id="key"
              {...register("key", { required: "المفتاح مطلوب" })}
              placeholder="مثال: app_name"
              className="bg-secondary"
              dir="ltr"
              disabled={isEdit}
            />
            {errors.key && (
              <p className="text-sm text-destructive">{errors.key.message}</p>
            )}
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                لا يمكن تغيير المفتاح بعد الإنشاء
              </p>
            )}
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label htmlFor="value">القيمة *</Label>
            <Textarea
              id="value"
              {...register("value", { required: "القيمة مطلوبة" })}
              placeholder="أدخل قيمة الإعداد"
              className="bg-secondary min-h-[100px]"
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
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
