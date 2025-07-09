"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 获取 URL 中的 code 参数
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        // 如果有错误参数，直接处理错误
        if (error) {
          console.error('OAuth error:', error, errorDescription)
          router.push(`/login?error=oauth_error&details=${encodeURIComponent(error)}`)
          return
        }
        
        // 如果有 code 参数，处理 OAuth 成功回调
        if (code) {
          console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...')
          
          // 交换 code 获取 session
          const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (authError) {
            console.error('OAuth callback error:', authError)
            router.push(`/login?error=auth_error&details=${encodeURIComponent(authError.message)}`)
            return
          }
          
          if (data.session) {
            console.log('OAuth login successful, user:', data.user?.email)
            // 登录成功，重定向到主页或指定页面
            const redirectTo = searchParams.get('redirect_to') || '/'
            router.push(redirectTo)
            return
          }
        }
        
        // 如果既没有 code 也没有 error，可能是直接访问回调页面
        console.log('No code or error parameters found, redirecting to login')
        router.push('/login?message=请选择登录方式')
        
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push(`/login?error=callback_error&details=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unknown error'
        )}`)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">正在处理登录...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 