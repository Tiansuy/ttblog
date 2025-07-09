"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { isAdmin } from "@/lib/admin"
import { PostForm } from "@/components/admin/post-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft } from "lucide-react"

export default function NewPostPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/admin/posts/new')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // 检查管理员权限
  if (!isAdmin(user)) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                <ShieldX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">权限不足</CardTitle>
              <CardDescription>
                您没有创建文章的权限
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>当前登录用户：{user?.email}</p>
                <p>只有管理员可以创建和编辑文章</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  variant="default"
                >
                  切换账户
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <PostForm mode="create" />
    </div>
  )
} 