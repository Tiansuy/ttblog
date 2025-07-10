"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { checkUserLikedPost, likePost } from '@/lib/posts'
import { supabase } from '@/lib/supabase'

interface LikeButtonProps {
  postSlug: string
  initialLikeCount: number
}

export function LikeButton({ postSlug, initialLikeCount }: LikeButtonProps) {
  const { t } = useTranslation()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // 生成用户标识符（基于浏览器特征，用于未登录用户）
  const generateUserIdentifier = (): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('fingerprint', 10, 10)
    const fingerprint = canvas.toDataURL()
    
    const userAgent = navigator.userAgent
    const language = navigator.language
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const screen = `${window.screen.width}x${window.screen.height}`
    
    const identifier = btoa(`${fingerprint}-${userAgent}-${language}-${timezone}-${screen}`)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 50)
    
    return identifier
  }

  // 检查用户点赞状态
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        setCheckingStatus(true)
        
        // 获取当前用户
        const { data: { user } } = await supabase.auth.getUser()
        
        let userId: string | undefined
        let userIdentifier: string | undefined
        
        if (user) {
          userId = user.id
        } else {
          userIdentifier = generateUserIdentifier()
        }
        
        const hasLiked = await checkUserLikedPost(postSlug, userId, userIdentifier)
        setIsLiked(hasLiked)
        
        console.log(`[LikeButton] Checked like status for post ${postSlug}: ${hasLiked}`)
      } catch (error) {
        console.error('[LikeButton] Error checking like status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkLikeStatus()
  }, [postSlug])

  // 处理点赞点击
  const handleLike = async () => {
    if (isLoading || isLiked) return

    try {
      setIsLoading(true)
      
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser()
      
      let userId: string | undefined
      let userIdentifier: string | undefined
      
      if (user) {
        userId = user.id
      } else {
        userIdentifier = generateUserIdentifier()
      }
      
      const result = await likePost(postSlug, userId, userIdentifier)
      
      if (result.success) {
        setIsLiked(true)
        if (result.newLikeCount !== undefined) {
          setLikeCount(result.newLikeCount)
        }
        console.log(`[LikeButton] Successfully liked post: ${postSlug}`)
      } else {
        console.log(`[LikeButton] Like failed: ${result.message}`)
        // 如果已经点赞过，更新状态
        if (result.message === 'Already liked') {
          setIsLiked(true)
        }
      }
    } catch (error) {
      console.error('[LikeButton] Error liking post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 如果正在检查状态，显示加载状态
  if (checkingStatus) {
    return (
      <button 
        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm opacity-50"
        disabled
      >
        <Heart className="h-4 w-4" />
        {t('like.like')} {t('like.likeCount', { count: likeCount })}
      </button>
    )
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || isLiked}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
        isLiked
          ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 cursor-not-allowed'
          : isLoading
          ? 'bg-secondary opacity-50 cursor-not-allowed'
          : 'bg-secondary hover:bg-secondary/80 hover:scale-105 active:scale-95'
      }`}
      title={
        isLiked 
          ? t('like.alreadyLiked')
          : isLoading 
          ? t('like.liking')
          : t('like.likePost')
      }
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          isLiked ? 'fill-current' : ''
        } ${isLoading ? 'animate-pulse' : ''}`} 
      />
      {isLoading 
        ? t('like.liking') 
        : isLiked 
        ? `${t('like.liked')} ${t('like.likeCount', { count: likeCount })}`
        : `${t('like.like')} ${t('like.likeCount', { count: likeCount })}`
      }
    </button>
  )
} 