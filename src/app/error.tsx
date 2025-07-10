'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { ThemeToggle } from '@/components/theme-toggle'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('页面错误:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background">
      {/* 简单的头部，包含主题切换 */}
      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">出现错误</CardTitle>
            <CardDescription>
              抱歉，页面加载时出现了问题
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>错误信息：</p>
              <div className="mt-2 p-2 bg-muted rounded text-xs text-left">
                {error.message || '未知错误'}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={reset}
                className="w-full flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                重试
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <a href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  返回首页
                </a>
              </Button>
            </div>
            
            {/* 页面底部说明 */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>如果问题持续存在，请联系管理员</p>
              <p className="mt-1">TTBlog - Personal CMS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 