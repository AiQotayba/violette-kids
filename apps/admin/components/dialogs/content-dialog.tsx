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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/upload/ImageUpload"
import { FileUpload } from "@/components/ui/upload/FileUpload"
import { api } from "@/lib/api-client"
import type { Content, ContentType, ContentSourceType, ContentFormData } from "@/lib/types"

interface ContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content?: Content | null
  contentType: ContentType
  apiEndpoint: string
}

const sourceTypeLabels: Record<ContentSourceType, string> = {
  uploaded: "ملف مرفوع",
  youtube: "يوتيوب",
  external: "رابط خارجي",
}

export function ContentDialog({
  open,
  onOpenChange,
  content,
  contentType,
  apiEndpoint,
}: ContentDialogProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isEdit = !!content

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContentFormData>({
    defaultValues: {
      title: "",
      description: "",
      type: contentType,
      ageMin: 3,
      ageMax: 12,
      thumbnailUrl: "",
      contentUrl: "",
      fileUrl: "",
      sourceType: contentType === "story" ? "uploaded" : "youtube",
      isActive: true,
    },
  })

  const sourceType = watch("sourceType")

  React.useEffect(() => {
    if (content) {
      reset({
        title: content.title,
        description: content.description || "",
        type: content.type,
        ageMin: content.ageMin,
        ageMax: content.ageMax,
        thumbnailUrl: content.thumbnailUrl || "",
        contentUrl: content.contentUrl || "",
        fileUrl: content.fileUrl || "",
        sourceType: content.sourceType,
        isActive: content.isActive,
      })
    } else {
      reset({
        title: "",
        description: "",
        type: contentType,
        ageMin: 3,
        ageMax: 12,
        thumbnailUrl: "",
        contentUrl: "",
        fileUrl: "",
        sourceType: contentType === "story" ? "uploaded" : "youtube",
        isActive: true,
      })
    }
  }, [content, contentType, reset])

  const onSubmit = async (data: ContentFormData) => {
    try {
      setIsSubmitting(true)

      // Don't send empty URL strings — backend may validate them as "Invalid URL"
      const payload: ContentFormData = {
        ...data,
        thumbnailUrl: data.thumbnailUrl?.trim() || undefined,
        contentUrl: data.contentUrl?.trim() || undefined,
        fileUrl: data.fileUrl?.trim() || undefined,
      }

      if (isEdit && content) {
        const response = await api.put(`${apiEndpoint}/${content.id}`, payload)
        if (response.isError) throw new Error(response.message)
        toast.success("تم تحديث المحتوى بنجاح")
        queryClient.invalidateQueries({ queryKey: ["table-data", apiEndpoint] })
      } else {
        const response = await api.post(apiEndpoint, payload)
        if (response.isError) throw new Error(response.message)
        toast.success("تم إضافة المحتوى بنجاح")
      }

      queryClient.invalidateQueries({ queryKey: ["table-data", apiEndpoint] })
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    const types = { story: "قصة", video: "فيديو", game: "لعبة" }
    return isEdit ? `تعديل ${types[contentType]}` : `إضافة ${types[contentType]} جديدة`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {isEdit ? "قم بتعديل بيانات المحتوى" : "أدخل بيانات المحتوى الجديد"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">العنوان *</Label>
            <Input
              id="title"
              {...register("title", { required: "العنوان مطلوب" })}
              placeholder="أدخل عنوان المحتوى"
              className="bg-secondary"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="أدخل وصف المحتوى"
              className="bg-secondary min-h-[100px]"
            />
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
            </div>
          </div>

          {/* Source Type */}
          <div className="space-y-2">
            <Label>نوع المصدر *</Label>
            <Select
              dir="rtl"
              value={sourceType}
              onValueChange={(value: ContentSourceType) => setValue("sourceType", value)}
            >
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="اختر نوع المصدر" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sourceTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content URL (for youtube/external) */}
          {(sourceType === "youtube" || sourceType === "external") && (
            <div className="space-y-2">
              <Label htmlFor="contentUrl">
                {sourceType === "youtube" ? "رابط يوتيوب" : "الرابط الخارجي"} *
              </Label>
              <Input
                id="contentUrl"
                {...register("contentUrl")}
                placeholder={
                  sourceType === "youtube"
                    ? "https://youtube.com/watch?v=..."
                    : "https://example.com/..."
                }
                className="bg-secondary"
                dir="ltr"
              />
            </div>
          )}

          {/* File upload (for uploaded: story = PDF, video/game = file) */}
          {sourceType === "uploaded" && (
            <FileUpload
              label={contentType === "story" ? "ملف القصة (PDF)" : "رابط الملف / رفع ملف"}
              value={watch("fileUrl") ?? ""}
              onChange={(url) => setValue("fileUrl", url)}
              accept={contentType === "story" ? "application/pdf,.pdf" : "application/pdf,.pdf,video/*"}
              showUrlInput={true}
            />
          )}

          {/* Thumbnail: image upload + URL */}
          <ImageUpload
            label="الصورة المصغرة"
            folder="thumbnails"
            value={watch("thumbnailUrl") ?? ""}
            onChange={(url) => setValue("thumbnailUrl", url)}
            showUrlInput={true}
          />

          {/* Active Switch */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">حالة النشر</Label>
              <p className="text-sm text-muted-foreground">
                هل تريد نشر هذا المحتوى فوراً؟
              </p>
            </div>
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter className="flex flex-row-reverse gap-4 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="mx-2"
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
