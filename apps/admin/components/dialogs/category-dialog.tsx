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
import { ImageUpload } from "@/components/ui/upload/ImageUpload"
import { api } from "@/lib/api-client"
import type { Category, CategoryFormData } from "@/lib/types"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  apiEndpoint: string
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  apiEndpoint,
}: CategoryDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isEdit = !!category

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      icon: "",
    },
  })

  React.useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon || "",
      })
    } else {
      reset({
        name: "",
        icon: "",
      })
    }
  }, [category, reset])

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && category) {
        const response = await api.put(`${apiEndpoint}/${category.id}`, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم تحديث التصنيف بنجاح")
      } else {
        const response = await api.post(apiEndpoint, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم إضافة التصنيف بنجاح")
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
          <DialogTitle>{isEdit ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "قم بتعديل بيانات التصنيف" : "أدخل بيانات التصنيف الجديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">اسم التصنيف *</Label>
            <Input
              id="name"
              {...register("name", { required: "اسم التصنيف مطلوب" })}
              placeholder="مثال: قصص إسلامية"
              className="bg-secondary"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Icon: image upload or paste URL / icon name */}
          <ImageUpload
            label="صورة التصنيف / الأيقونة (اختياري)"
            folder="categories"
            value={watch("icon") ?? ""}
            onChange={(url) => setValue("icon", url)}
            showUrlInput={true}
          />
          <p className="text-xs text-muted-foreground -mt-1">
            رفع صورة، لصق رابط الصورة، أو كتابة اسم أيقونة من Lucide (مثل: book، star)
          </p>

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
