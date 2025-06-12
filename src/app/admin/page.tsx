"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostManagement } from "@/components/admin/post-management"
import { Settings, FileText, MessageSquare } from "lucide-react"

export default function AdminPage() {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()

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
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // 将重定向到登录页面
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">管理后台</h1>
        <p className="text-muted-foreground">管理您的博客内容和站点设置</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            文章管理
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            评论管理
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            站点设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostManagement />
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>评论管理</CardTitle>
              <CardDescription>
                管理网站评论和留言
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">评论管理功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>站点设置</CardTitle>
              <CardDescription>
                配置网站的基本信息和参数
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">站点设置功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 