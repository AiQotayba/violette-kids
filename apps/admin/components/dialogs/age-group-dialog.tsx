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
import type { AgeGroup, AgeGroupFormData } from "@/lib/types"

interface AgeGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ageGroup?: AgeGroup | null
  apiEndpoint: string
}

export function AgeGroupDialog({
  open,
  onOpenChange,
  ageGroup,
  apiEndpoint,
}: AgeGroupDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isEdit = !!ageGroup

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgeGroupFormData>({
    defaultValues: {
      label: "",
      ageMin: 0,
      ageMax: 0,
    },
  })

  React.useEffect(() => {
    if (ageGroup) {
      reset({
        label: ageGroup.label,
        ageMin: ageGroup.ageMin,
        ageMax: ageGroup.ageMax,
      })
    } else {
      reset({
        label: "",
        ageMin: 0,
        ageMax: 0,
      })
    }
  }, [ageGroup, reset])

  const onSubmit = async (data: AgeGroupFormData) => {
    try {
      setIsSubmitting(true)
      
      if (data.ageMin > data.ageMax) {
        toast.error("العمر الأدنى يجب أن يكون أقل من العمر الأقصى")
        return
      }

      if (isEdit && ageGroup) {
        const response = await api.put(`${apiEndpoint}/${ageGroup.id}`, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم تحديث الفئة العمرية بنجاح")
      } else {
        const response = await api.post(apiEndpoint, data)
        if (response.isError) throw new Error(response.message)
        toast.success("تم إضافة الفئة العمرية بنجاح")
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
          <DialogTitle>{isEdit ? "تعديل الفئة العمرية" : "إضافة فئة عمرية جديدة"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "قم بتعديل بيانات الفئة العمرية" : "أدخل بيانات الفئة العمرية الجديدة"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">التسمية *</Label>
            <Input
              id="label"
              {...register("label", { required: "التسمية مطلوبة" })}
              placeholder="مثال: 3-5 سنوات"
              className="bg-secondary"
            />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>

          {/* Age Range */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ageMin">العمر الأدنى *</Label>
              <Input
                id="ageMin"
                type="number"
                min={0}
                max={18}
                {...register("ageMin", { 
                  required: "العمر الأدنى مطلوب",
                  valueAsNumber: true 
                })}
                className="bg-secondary"
              />
              {errors.ageMin && (
                <p className="text-sm text-destructive">{errors.ageMin.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageMax">العمر الأقصى *</Label>
              <Input
                id="ageMax"
                type="number"
                min={0}
                max={18}
                {...register("ageMax", { 
                  required: "العمر الأقصى مطلوب",
                  valueAsNumber: true 
                })}
                className="bg-secondary"
              />
              {errors.ageMax && (
                <p className="text-sm text-destructive">{errors.ageMax.message}</p>
              )}
            </div>
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
