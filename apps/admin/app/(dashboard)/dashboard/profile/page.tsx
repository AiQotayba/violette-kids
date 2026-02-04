"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { User, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api-client"
import { auth } from "@/lib/auth"
import type { Admin, AdminFormData } from "@/lib/types"
import { toast } from "sonner"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => {
      const response = await api.get("/admin/me")
      if (response.isError) throw new Error(response.message)
      const raw = response as unknown as { data?: Admin }
      return (raw.data ?? raw) as Admin
    },
    staleTime: 60000,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
    }
  }, [admin, reset])

  const onSubmit = async (data: AdminFormData) => {
    if (!admin) return
    try {
      setIsSubmitting(true)
      const submitData =
        !data.password || data.password.trim() === ""
          ? { name: data.name, email: data.email }
          : data

      const response = await api.put(`/admin/users/${admin.id}`, submitData)
      if (response.isError) throw new Error(response.message)

      auth.setUser({ ...admin, name: data.name, email: data.email })
      queryClient.invalidateQueries({ queryKey: ["admin-me"] })
      toast.success("تم تحديث الملف الشخصي بنجاح")
      reset({ ...data, password: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="الملف الشخصي"
        description="عرض وتعديل بيانات حسابك"
        icon={User}
      />

      <div className="max-w-2xl">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        ) : admin ? (
          <Card>
            <CardHeader>
              <CardTitle>بيانات الحساب</CardTitle>
              <CardDescription>
                تم الانضمام في{" "}
                {format(new Date(admin.createdAt), "dd MMMM yyyy", { locale: ar })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">الاسم *</Label>
                  <Input
                    id="profile-name"
                    {...register("name", { required: "الاسم مطلوب" })}
                    placeholder="الاسم"
                    className="bg-secondary"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">البريد الإلكتروني *</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    {...register("email", {
                      required: "البريد الإلكتروني مطلوب",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "البريد الإلكتروني غير صالح",
                      },
                    })}
                    placeholder="admin@example.com"
                    className="bg-secondary"
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-password">
                    كلمة المرور الجديدة{" "}
                    <span className="text-xs text-muted-foreground">
                      (اتركها فارغة للإبقاء على كلمة المرور الحالية)
                    </span>
                  </Label>
                  <Input
                    id="profile-password"
                    type="password"
                    {...register("password", {
                      minLength: {
                        value: 8,
                        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
                      },
                    })}
                    placeholder="••••••••"
                    className="bg-secondary"
                    dir="ltr"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              تعذر تحميل بيانات الملف الشخصي. يرجى المحاولة لاحقاً.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
