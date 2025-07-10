"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCommentsTree, getCommentsCount } from '@/lib/comments'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'
import { Button } from '@/components/ui/button'
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { CommentTree } from '@/types/database'

interface CommentSectionProps {
  postId: string
  className?: string
  isMobile?: boolean
}

export function CommentSection({ postId, className = '', isMobile = false }: CommentSectionProps) {
  const { t } = useTranslation()
  const [comments, setComments] = useState<CommentTree[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(isMobile) // 移动端默认折叠

  // 获取评论数据
  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [commentsData, countData] = await Promise.all([
        getCommentsTree(postId),
        getCommentsCount(postId)
      ])
      
      setComments(commentsData)
      setCommentCount(countData)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError(t('comments.loadCommentsError'))
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchComments()
  }, [postId])

  // 处理评论更新
  const handleCommentUpdate = () => {
    fetchComments()
  }

  if (loading) {
    return (
      <div className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-32"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-2">{error}</div>
          <Button variant="outline" size="sm" onClick={fetchComments}>
            {t('comments.retryLoading')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} ${isMobile ? 'border-t' : ''} bg-card flex flex-col overflow-hidden ${!isMobile ? 'h-full' : ''}`}>
      {/* 头部 */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-b bg-muted/50 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">{t('comments.title')} ({t('comments.count', { count: commentCount })})</h3>
          </div>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0"
            >
              {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* 评论内容 */}
      {(!isMobile || !collapsed) && (
        <>
          {/* 移动端：评论表单在上方 */}
          {isMobile && (
            <div className="p-4 border-b flex-shrink-0">
              <CommentForm
                postId={postId}
                onCommentAdded={handleCommentUpdate}
                placeholder={t('comments.writeComment')}
              />
            </div>
          )}

          {/* 评论列表 */}
          <div className={`${isMobile ? 'p-4' : 'p-6'} ${isMobile ? 'flex-1' : 'flex-1 overflow-y-auto min-h-0'}`}>
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('comments.noComments')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    onCommentAdded={handleCommentUpdate}
                    onCommentUpdated={handleCommentUpdate}
                    onCommentDeleted={handleCommentUpdate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 大屏幕：评论表单在下方 */}
          {!isMobile && (
            <div className="p-6 border-t flex-shrink-0">
              <CommentForm
                postId={postId}
                onCommentAdded={handleCommentUpdate}
                placeholder={t('comments.writeComment')}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
} 