"use client"

import * as React from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api-client"
import type { UploadResponse } from "@/lib/api-client"
import { toast } from "sonner"

function getUploadUrl(data: UploadResponse): string {
  if (!data || typeof data !== "object") return ""
  const d = data as Record<string, unknown>
  return (d.url as string) ?? (d.image_url as string) ?? (d.imageUrl as string) ?? ""
}

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"

export interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  label?: string
  accept?: string
  disabled?: boolean
  className?: string
  /** Optional: show URL input to paste link */
  showUrlInput?: boolean
}

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "الصورة",
  accept = ACCEPT_IMAGES,
  disabled = false,
  className,
  showUrlInput = true,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [preview, setPreview] = React.useState<string | null>(null)

  const hasValue = !!value?.trim()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة (JPEG، PNG، WebP أو GIF)")
      return
    }
    try {
      setUploading(true)
      setProgress(0)
      const response = await api.uploadImage(file, folder, {
        onProgress: setProgress,
        showSuccessToast: false,
        showErrorToast: true,
      })
      if (response.isError) return
      const url = getUploadUrl(response.data)
      if (url) {
        onChange(`${process.env.NEXT_PUBLIC_API_URL?.replace("com/api", "com")}${url}`)
        toast.success("تم رفع الصورة بنجاح")
      } else {
        toast.error("لم يُرجع الرابط بعد الرفع")
      }
    } catch {
      // Error already shown by api
    } finally {
      setUploading(false)
      setProgress(0)
      if (preview) {
        URL.revokeObjectURL(preview)
        setPreview(null)
      }
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    handleFile(file)
  }

  const clearImage = () => {
    onChange("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-col gap-3">
        {/* الصورة أولاً — معاينة أكبر */}
        <div className="flex shrink-0 items-start gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={disabled || uploading}
            onChange={onInputChange}
          />
          {hasValue ? (
            <div className="relative">
              <img
                src={value}
                alt="معاينة"
                className="h-40 w-40 rounded-xl border border-border object-cover bg-muted sm:h-48 sm:w-48"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={clearImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-40 w-40 sm:h-48 sm:w-48 flex flex-col gap-2 rounded-xl border-dashed"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="text-sm font-medium">{progress}%</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs">رفع صورة</span>
                </>
              )}
            </Button>
          )}
          {uploading && (
            <Progress value={progress} className="w-40 sm:w-48 shrink-0" />
          )}
        </div>
        {showUrlInput && (
          <div className="min-w-0">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="أو الصق رابط الصورة"
              className="bg-secondary text-sm hidden"
              dir="ltr"
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  )
}
