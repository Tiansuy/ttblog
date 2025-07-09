"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"

function LoginContent() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const error = searchParams.get('error')
  const errorDetails = searchParams.get('details')
  const message = searchParams.get('message')

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push(redirect)
    }
  }, [isAuthenticated, loading, router, redirect])

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

  if (isAuthenticated) {
    return null // 将重定向到redirect页面
  }

  // 处理错误消息
  const getErrorMessage = (error: string | null, details: string | null) => {
    if (!error) return null
    
    switch (error) {
      case 'oauth_error':
        return `OAuth 登录失败${details ? `: ${details}` : ''}`
      case 'auth_error':
        return `认证失败${details ? `: ${details}` : ''}`
      case 'callback_error':
        return `回调处理失败${details ? `: ${details}` : ''}`
      default:
        return `登录失败${details ? `: ${details}` : ''}`
    }
  }

  const errorMessage = getErrorMessage(error, errorDetails)

  return (
    <div className="container mx-auto py-8">
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* 显示消息或错误 */}
          {message && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200 rounded-md text-sm text-center">
              {message}
            </div>
          )}
          {errorMessage && (  
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200 rounded-md text-sm text-center">
              {errorMessage}
            </div>
          )}
          
          <LoginForm onSuccess={() => router.push(redirect)} />
          
          {redirect !== '/' && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              登录后将跳转到: {redirect}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
} 