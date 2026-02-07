"use client"

import * as React from "react"
import { Upload, X, Loader2, FileText } from "lucide-react"
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
  return (d.url as string) ?? (d.image_url as string) ?? (d.imageUrl as string) ?? (d.path as string) ?? ""
}

const ACCEPT_PDF = "application/pdf"

export interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  disabled?: boolean
  className?: string
  /** Optional: show URL input to paste link */
  showUrlInput?: boolean
}

export function FileUpload({
  value,
  onChange,
  label = "الملف",
  accept = ACCEPT_PDF,
  disabled = false,
  className,
  showUrlInput = true,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const hasValue = !!value?.trim()
  const fileName = value ? value.split("/").pop() || value.slice(0, 40) : ""

  const handleFile = async (file: File) => {
    try {
      setUploading(true)
      setProgress(0)
      const response = await api.uploadFile(file, {
        onProgress: setProgress,
        showSuccessToast: false,
        showErrorToast: true,
      })
      if (response.isError) return
      const url = getUploadUrl(response.data)
      if (url) {
        onChange(`${process.env.NEXT_PUBLIC_API_URL?.replace("com/api", "com")}${url}`)
        toast.success("تم رفع الملف بنجاح")
      } else {
        toast.error("لم يُرجع الرابط بعد الرفع")
      }
    } catch {
      // Error already shown by api
    } finally {
      setUploading(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleFile(file)
  }

  const clearFile = () => {
    onChange("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled || uploading}
          onChange={onInputChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 gap-2 border-dashed"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{progress}%</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              رفع ملف
            </>
          )}
        </Button>
        {uploading && <Progress value={progress} className="max-w-[120px] flex-1" />}
        {hasValue && !uploading && (
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate" title={value}>
              {fileName}
            </span>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      {showUrlInput && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="أو الصق رابط الملف"
          className="bg-secondary text-sm mt-1 hidden"
          dir="ltr"
          disabled={disabled}
        />
      )}
    </div>
  )
}
