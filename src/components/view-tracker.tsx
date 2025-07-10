"use client"

import { useEffect, useRef } from 'react'
import { incrementPostViews } from '@/lib/posts'

interface ViewTrackerProps {
  postSlug: string
}

export function ViewTracker({ postSlug }: ViewTrackerProps) {
  const hasTracked = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 防止重复执行
    if (hasTracked.current) return

    // 清理可能存在的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // 获取 cookie 的辅助函数
    const getCookie = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null
      }
      return null
    }

    // 设置 cookie 的辅助函数
    const setCookie = (name: string, value: string, minutes: number) => {
      if (typeof document === 'undefined') return
      
      const expiryTime = new Date(Date.now() + minutes * 60 * 1000)
      document.cookie = `${name}=${value}; expires=${expiryTime.toUTCString()}; path=/; SameSite=Strict`
    }

    // 检查是否应该增加浏览量
    const shouldIncrementViews = (): boolean => {
      const cookieName = `viewed_post_${postSlug.replace(/[^a-zA-Z0-9]/g, '_')}`
      const cookieValue = getCookie(cookieName)
      
      if (!cookieValue) return true
      
      const viewedTime = parseInt(cookieValue)
      if (isNaN(viewedTime)) return true
      
      const now = Date.now()
      const timeDiff = now - viewedTime
      const thirtyMinutes = 30 * 60 * 1000
      
      // 如果在30分钟内访问过，不重复计算
      if (timeDiff < thirtyMinutes) {
        console.log(`[ViewTracker] Skipping view increment for post: ${postSlug} (viewed ${Math.round(timeDiff / 60000)} minutes ago)`)
        return false
      }
      
      return true
    }

    // 设置浏览记录cookie
    const setViewedCookie = () => {
      const cookieName = `viewed_post_${postSlug.replace(/[^a-zA-Z0-9]/g, '_')}`
      const now = Date.now()
      setCookie(cookieName, now.toString(), 30) // 30分钟过期
    }

    // 增加浏览量的函数
    const incrementViews = async () => {
      try {
        await incrementPostViews(postSlug)
        setViewedCookie()
        console.log(`[ViewTracker] Successfully incremented views for post: ${postSlug}`)
      } catch (error) {
        console.error('[ViewTracker] Error incrementing views:', error)
      }
    }

    // 延迟执行，确保是真实的用户访问，避免开发环境的重复渲染
    timerRef.current = setTimeout(() => {
      if (shouldIncrementViews()) {
        hasTracked.current = true
        incrementViews()
      }
    }, 1500) // 1.5秒延迟，避免机器人或快速跳转

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [postSlug]) // 只依赖 postSlug，避免不必要的重新执行

  // 这个组件不渲染任何内容
  return null
} 