"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { signInWithPassword, signInWithOAuth } from "@/lib/auth"
import { LogIn, Github, Chrome, MessageCircle, ExternalLink } from "lucide-react"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [rememberLogin, setRememberLogin] = useState(true)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithPassword(email, password)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'github' | 'google' | 'qq') => {
    setOauthLoading(provider)
    setError("")

    try {
      const redirectTo = `${window.location.origin}/auth/callback${
        window.location.search.includes('redirect=') 
          ? `?redirect_to=${new URLSearchParams(window.location.search).get('redirect')}` 
          : ''
      }`

      const forceReauth = !rememberLogin
      
      console.log(`[LoginForm] Provider: ${provider}, RememberLogin: ${rememberLogin}, ForceReauth: ${forceReauth}`)

      switch (provider) {
        case 'github':
          await signInWithOAuth('github', redirectTo, forceReauth)
          break
        case 'google':
          await signInWithOAuth('google', redirectTo, forceReauth)
          break
        case 'qq':
          throw new Error(t('auth.qqLoginNotImplemented', 'QQ login is not yet implemented. Please use GitHub or Google login, or contact the administrator.'))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginFailed')
      setError(errorMessage)
      setOauthLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          {t('auth.adminLogin', 'Administrator Login')}
        </CardTitle>
        <CardDescription>
          {t('auth.selectLoginMethod', 'Please select a login method to access the admin panel')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 第三方登录设置 */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember-login" 
            checked={rememberLogin}
            onCheckedChange={(checked: boolean) => setRememberLogin(checked)}
          />
          <Label 
            htmlFor="remember-login" 
            className="text-sm font-normal cursor-pointer"
          >
            {t('auth.rememberLogin')}
          </Label>
        </div>

        {/* 第三方登录按钮 */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLogin('github')}
            disabled={!!oauthLoading}
          >
            {oauthLoading === 'github' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <Github className="h-4 w-4 mr-2" />
            )}
{t('auth.loginWithGithub')}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLogin('google')}
            disabled={!!oauthLoading}
          >
            {oauthLoading === 'google' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <Chrome className="h-4 w-4 mr-2" />
            )}
{t('auth.loginWithGoogle')}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full opacity-60"
            onClick={() => handleOAuthLogin('qq')}
            disabled={!!oauthLoading}
            title="QQ 登录功能暂未实现，请使用其他方式登录"
          >
            {oauthLoading === 'qq' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <MessageCircle className="h-4 w-4 mr-2" />
            )}
{t('auth.loginWithQQ')}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('auth.orLoginWithEmail')}
            </span>
          </div>
        </div>

        {/* 邮箱密码登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || !!oauthLoading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </Button>
        </form>

        {error && (
          <div className="text-sm text-red-600 text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
            {error}
          </div>
        )}

        {/* 说明文字 */}
        <div className="text-xs text-muted-foreground text-center space-y-2">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 关于"记住登录状态"：</p>
            {rememberLogin ? (
              <div className="text-blue-700 dark:text-blue-300 space-y-1">
                <p>✅ <strong>已勾选</strong>：将使用您在第三方平台的现有登录状态</p>
                <p>• 如果您之前已在浏览器中登录 Google/GitHub，将直接使用该登录状态</p>
                <p>• 登录速度更快，但安全性相对较低</p>
              </div>
            ) : (
              <div className="text-blue-700 dark:text-blue-300 space-y-1">
                <p>🔒 <strong>未勾选</strong>（推荐）：每次都要求重新验证身份</p>
                <p>• 即使您在浏览器中已登录 Google/GitHub，也会要求重新确认</p>
                <p>• 安全性更高，适合管理后台登录</p>
              </div>
            )}
          </div>
          
          {!rememberLogin && (
            <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-md">
              <p className="text-amber-800 dark:text-amber-200 text-xs">
                🔧 如果 GitHub 登录仍然没有要求重新验证，您可以
                <a 
                  href="https://github.com/settings/applications" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mx-1 text-amber-600 hover:text-amber-800 underline"
                >
                  手动撤销授权
                  <ExternalLink className="h-3 w-3" />
                </a>
                后重新登录
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 