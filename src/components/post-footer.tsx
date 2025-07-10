"use client"

import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { LikeButton } from '@/components/like-button'

interface PostFooterProps {
  updatedAt: string
  postSlug: string
  initialLikeCount: number
}

export function PostFooter({ updatedAt, postSlug, initialLikeCount }: PostFooterProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'zh' ? zhCN : enUS
    const formatString = i18n.language === 'zh' ? 'yyyy年MM月dd日' : 'MMM dd, yyyy'
    return format(new Date(dateString), formatString, { locale })
  }

  return (
    <footer className="border-t border-border pt-8">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('post.lastUpdated')} {formatDate(updatedAt)}
        </div>
        
        <div className="flex items-center gap-4">
          <LikeButton postSlug={postSlug} initialLikeCount={initialLikeCount} />
        </div>
      </div>
    </footer>
  )
} 