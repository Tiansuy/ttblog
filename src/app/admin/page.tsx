"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/use-auth"
import { isAdmin } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PostManagement } from "@/components/admin/post-management"
import { Settings, FileText, MessageSquare, ShieldX, ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const { t } = useTranslation()
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // 防止hydration错误
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取文本，防止hydration错误
  const getText = (key: string, fallback: string) => {
    return mounted ? t(key) : fallback
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // 重定向到登录页面，并设置返回地址
      router.push('/login?redirect=/admin')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{getText('common.loading', '加载中...')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // 将重定向到登录页面
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
                您没有访问管理后台的权限
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>当前登录用户：{user?.email}</p>
                <p>只有管理员可以访问此页面</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{getText('admin.title', '管理后台')}</h1>
        <p className="text-muted-foreground">{getText('admin.description', '管理网站内容和设置')}</p>
        <p className="text-xs text-muted-foreground mt-2">{getText('admin.administrator', '管理员')}：{user?.email}</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {getText('admin.postManagement', '文章管理')}
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {getText('admin.commentManagement', '评论管理')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {getText('admin.siteSettings', '网站设置')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostManagement />
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>{getText('admin.commentManagement', '评论管理')}</CardTitle>
              <CardDescription>
                {getText('admin.manageComments', '管理网站评论和留言')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{getText('admin.inDevelopment', '功能开发中...')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{getText('admin.siteSettings', '网站设置')}</CardTitle>
              <CardDescription>
                {getText('admin.configureWebsite', '配置网站基本信息和参数')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{getText('admin.inDevelopment', '功能开发中...')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 