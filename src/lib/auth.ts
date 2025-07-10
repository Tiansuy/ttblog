import { supabase } from './supabase'
import type { User, Provider } from '@supabase/supabase-js'

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// 第三方 OAuth 登录
export async function signInWithOAuth(provider: Provider, redirectTo?: string, forceReauth = true) {
  // 获取正确的域名
  const getBaseUrl = () => {
    // 智能检测环境并处理重定向URL
    const currentOrigin = window.location.origin
    
    console.log(`[Auth] 当前域名: ${currentOrigin}`)
    console.log(`[Auth] 环境变量: ${process.env.NEXT_PUBLIC_SITE_URL || 'undefined'}`)
    
    // 如果是localhost开发环境，直接使用当前域名
    if (currentOrigin.includes('localhost')) {
      console.log(`[Auth] 检测到开发环境，使用当前域名: ${currentOrigin}`)
      return currentOrigin
    }
    
    // 如果是Vercel预览环境（包含git分支信息），强制使用当前域名
    if (currentOrigin.includes('vercel.app') && currentOrigin.includes('-git-')) {
      console.log(`[Auth] 检测到Vercel预览环境，强制使用当前域名: ${currentOrigin}`)
      return currentOrigin
    }
    
    // 如果是Vercel但不是预览环境（生产环境），检查环境变量
    if (currentOrigin.includes('vercel.app')) {
      console.log(`[Auth] 检测到Vercel生产环境`)
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        console.log(`[Auth] 使用环境变量: ${process.env.NEXT_PUBLIC_SITE_URL}`)
        return process.env.NEXT_PUBLIC_SITE_URL
      } else {
        console.log(`[Auth] 环境变量未设置，使用当前域名: ${currentOrigin}`)
        return currentOrigin
      }
    }
    
    // 其他情况：如果设置了环境变量，使用环境变量
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      // 检查环境变量是否与当前域名一致
      if (currentOrigin !== process.env.NEXT_PUBLIC_SITE_URL) {
        console.warn(`[Auth] 环境变量NEXT_PUBLIC_SITE_URL (${process.env.NEXT_PUBLIC_SITE_URL}) 与当前域名 (${currentOrigin}) 不一致`)
        console.warn(`[Auth] 为了解决重定向问题，强制使用当前域名: ${currentOrigin}`)
        return currentOrigin  // 临时修复：强制使用当前域名
      }
      console.log(`[Auth] 使用环境变量: ${process.env.NEXT_PUBLIC_SITE_URL}`)
      return process.env.NEXT_PUBLIC_SITE_URL
    }
    
    // 默认情况：使用当前域名
    console.log(`[Auth] 默认使用当前域名: ${currentOrigin}`)
    return currentOrigin
  }
  
  const baseRedirectTo = redirectTo || `${getBaseUrl()}/auth/callback`
  
  const options: any = {
    redirectTo: baseRedirectTo,
  }

  console.log(`[OAuth Login] Provider: ${provider}, ForceReauth: ${forceReauth}`)

  // 为不同的 OAuth 提供商添加强制重新验证参数
  if (forceReauth) {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2)
    
    if (provider === 'github') {
      // GitHub 强制重新验证策略
      // GitHub 不支持 prompt 参数，但我们可以通过清除会话+随机参数来实现
      options.queryParams = {
        // 使用时间戳和随机数避免缓存
        t: timestamp,
        r: randomId,
        // GitHub 支持的参数
        allow_signup: 'true',
      }
      // 添加时间戳到重定向 URL 以避免缓存
      options.redirectTo = `${baseRedirectTo}${baseRedirectTo.includes('?') ? '&' : '?'}_gh_force=${timestamp}&_r=${randomId}`
      
      // 在登录前尝试清除 GitHub 会话
      try {
        // 创建一个隐藏的 iframe 来清除 GitHub 会话
        const clearFrame = document.createElement('iframe')
        clearFrame.style.display = 'none'
        clearFrame.style.position = 'absolute'
        clearFrame.style.left = '-9999px'
        clearFrame.src = 'https://github.com/logout'
        document.body.appendChild(clearFrame)
        
        setTimeout(() => {
          if (document.body.contains(clearFrame)) {
            document.body.removeChild(clearFrame)
          }
        }, 2000)
      } catch (e) {
        console.warn('无法清除 GitHub 会话:', e)
      }
    } else if (provider === 'google') {
      // Google 强制重新验证
      options.queryParams = {
        prompt: 'consent select_account', // 强制选择账户并重新授权
        access_type: 'offline',
        include_granted_scopes: 'false', // 不包含之前授权的范围
        // 时间戳避免缓存
        t: timestamp,
        r: randomId,
      }
      // 添加时间戳到重定向 URL
      options.redirectTo = `${baseRedirectTo}${baseRedirectTo.includes('?') ? '&' : '?'}_gl_t=${timestamp}&_r=${randomId}`
    }
  } else {
    // 当用户选择记住登录状态时，不添加强制重新验证参数
    console.log(`[OAuth Login] 用户选择记住登录状态，将使用现有会话（如果有）`)
  }

  console.log('OAuth login attempt:', { 
    provider, 
    forceReauth, 
    queryParams: options.queryParams,
    redirectTo: options.redirectTo,
    baseUrl: getBaseUrl(),
    currentOrigin: window.location.origin,
    envSiteUrl: process.env.NEXT_PUBLIC_SITE_URL
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  })
  
  if (error) {
    console.error('OAuth login error:', error)
    throw error
  }
  
  return data
}

// GitHub 登录
export async function signInWithGitHub(redirectTo?: string) {
  return signInWithOAuth('github', redirectTo, true)
}

// Google 登录
export async function signInWithGoogle(redirectTo?: string) {
  return signInWithOAuth('google', redirectTo, true)
}

// QQ 登录 - 自定义实现
export async function signInWithQQ(redirectTo?: string) {
  // 由于 Supabase 不直接支持 QQ 登录，这里提供一个占位符实现
  // 在实际应用中，您可以：
  // 1. 使用 QQ 互联 SDK 进行登录
  // 2. 获取用户信息后，通过 Supabase 创建用户
  // 3. 或者重定向到 QQ 互联的授权页面
  
  throw new Error('QQ 登录功能暂未实现。请使用 GitHub 或 Google 登录，或联系管理员。')
  
  // 如果要实现 QQ 登录，可以使用以下方式：
  // 1. 重定向到 QQ 互联授权页面
  // const qqAuthUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=YOUR_QQ_APP_ID&redirect_uri=${encodeURIComponent(redirectTo || window.location.origin + '/auth/qq-callback')}&scope=get_user_info`
  // window.location.href = qqAuthUrl
  
  // 2. 或者使用 QQ 互联 SDK（需要先引入）
  // QC.Login.showPopup({
  //   appId: 'YOUR_QQ_APP_ID',
  //   redirectURI: redirectTo || window.location.origin + '/auth/qq-callback'
  // })
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

// 强制清除 OAuth 提供商会话的函数
async function clearOAuthSessions() {
  return new Promise<void>((resolve) => {
    let completed = 0
    const total = 2 // GitHub + Google
    
    const checkComplete = () => {
      completed++
      if (completed >= total) {
        resolve()
      }
    }
    
    // 清除 GitHub 会话
    try {
      const githubIframe = document.createElement('iframe')
      githubIframe.style.display = 'none'
      githubIframe.style.position = 'absolute'
      githubIframe.style.left = '-9999px'
      githubIframe.src = 'https://github.com/logout'
      
      githubIframe.onload = () => {
        setTimeout(() => {
          if (document.body.contains(githubIframe)) {
            document.body.removeChild(githubIframe)
          }
          checkComplete()
        }, 1000)
      }
      
      githubIframe.onerror = () => {
        if (document.body.contains(githubIframe)) {
          document.body.removeChild(githubIframe)
        }
        checkComplete()
      }
      
      document.body.appendChild(githubIframe)
    } catch (e) {
      checkComplete()
    }
    
    // 清除 Google 会话
    try {
      const googleIframe = document.createElement('iframe')
      googleIframe.style.display = 'none'
      googleIframe.style.position = 'absolute'
      googleIframe.style.left = '-9999px'
      googleIframe.src = 'https://accounts.google.com/logout'
      
      googleIframe.onload = () => {
        setTimeout(() => {
          if (document.body.contains(googleIframe)) {
            document.body.removeChild(googleIframe)
          }
          checkComplete()
        }, 1000)
      }
      
      googleIframe.onerror = () => {
        if (document.body.contains(googleIframe)) {
          document.body.removeChild(googleIframe)
        }
        checkComplete()
      }
      
      document.body.appendChild(googleIframe)
    } catch (e) {
      checkComplete()
    }
    
    // 超时保护
    setTimeout(() => {
      resolve()
    }, 5000)
  })
}

// 改进的登出函数，支持选择性清除 OAuth 会话
export async function signOut(shouldClearOAuthSessions: boolean = false) {
  try {
    console.log('开始登出流程...', { shouldClearOAuthSessions })
    
    // 获取当前用户信息以确定登录方式
    const { data: { user } } = await supabase.auth.getUser()
    const provider = user?.app_metadata?.provider
    
    console.log('当前用户提供商:', provider)
    
    // 执行 Supabase 登出
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    console.log('Supabase 登出成功')
    
    // 清除应用相关的本地存储
    try {
      // 只清除应用相关的存储，不清除所有存储
      const keysToRemove = [
        'supabase.auth.token',
        'sb-auth-token',
        'supabase-auth-token',
        'sb-localhost-auth-token'
      ]
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
      
      console.log('应用本地存储已清除')
    } catch (e) {
      console.warn('清除本地存储时出错:', e)
    }
    
    // 只有明确要求时才清除 OAuth 提供商会话
    if (shouldClearOAuthSessions && provider && (provider === 'github' || provider === 'google')) {
      console.log('清除 OAuth 提供商会话...')
      
      // 清除特定的 OAuth cookies
      if (provider === 'github') {
        const githubCookies = ['_gh_sess', 'logged_in', 'dotcom_user', '_octo', 'user_session']
        githubCookies.forEach(cookieName => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.github.com`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=github.com`
        })
      }
      
      await clearOAuthSessions()
      console.log('OAuth 会话清除完成')
    } else {
      console.log('跳过 OAuth 会话清除，保留第三方登录状态')
    }
    
    // 强制刷新页面以清除所有状态
    console.log('重定向到登录页面...')
    setTimeout(() => {
      window.location.href = '/login?message=已成功登出&_t=' + Date.now()
    }, 1000) // 减少延迟
    
  } catch (error) {
    console.error('登出失败:', error)
    // 即使登出失败，也尝试跳转到登录页面
    setTimeout(() => {
      window.location.href = '/login?error=logout_failed&_t=' + Date.now()
    }, 1000)
    throw error
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
} 