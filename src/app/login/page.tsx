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

  return (
    <div className="container mx-auto py-8">
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-full max-w-md">
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