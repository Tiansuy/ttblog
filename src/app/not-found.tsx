'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <span className="text-4xl font-bold text-muted-foreground">404</span>
            </div>
            <CardTitle className="text-2xl">页面未找到</CardTitle>
            <CardDescription>
              抱歉，您访问的页面不存在或已被删除
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>可能的原因：</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• 页面链接输入错误</li>
                <li>• 页面已被移动或删除</li>
                <li>• 网站正在维护中</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  返回首页
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/posts" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  浏览文章
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回上一页
              </Button>
            </div>
            
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>TTBlog - Personal CMS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 