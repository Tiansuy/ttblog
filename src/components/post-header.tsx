"use client"

import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { Eye, Calendar, Clock, Tag } from 'lucide-react'

interface PostHeaderProps {
  title: string
  publishedAt: string
  readingTime: number
  views: number
  tags?: string[]
}

export function PostHeader({ title, publishedAt, readingTime, views, tags }: PostHeaderProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'zh' ? zhCN : enUS
    const formatString = i18n.language === 'zh' ? 'yyyy年MM月dd日' : 'MMM dd, yyyy'
    return format(new Date(dateString), formatString, { locale })
  }

  return (
    <header className="space-y-4">
      <h1 className="inline-block font-heading text-4xl lg:text-5xl">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={publishedAt}>
            {formatDate(publishedAt)}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{t('post.readingTime', { time: readingTime })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{t('post.views', { count: views })}</span>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>{tags.join(', ')}</span>
          </div>
        )}
      </div>
    </header>
  )
} 