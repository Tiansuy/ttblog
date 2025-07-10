"use client"

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/use-auth'
import { createComment } from '@/lib/comments'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send } from 'lucide-react'

interface CommentFormProps {
  postId: string
  parentId?: string
  onCommentAdded?: () => void
  onCancel?: () => void
  placeholder?: string
  compact?: boolean
}

export function CommentForm({ 
  postId, 
  parentId, 
  onCommentAdded, 
  onCancel, 
  placeholder,
  compact = false
}: CommentFormProps) {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultPlaceholder = placeholder || t('comments.writeComment')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || !isAuthenticated) return

    setIsSubmitting(true)
    
    try {
      const result = await createComment(postId, content, parentId)
      
      if (result.success) {
        setContent('')
        onCommentAdded?.()
      } else {
        console.error('Failed to create comment:', result.error)
        // 这里可以添加错误提示
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} border rounded-lg bg-muted/50`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{t('comments.pleaseLogin')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-4'} border rounded-lg bg-card`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img 
            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.name || user?.email?.split('@')[0] || 'User')}&background=random`}
            alt={user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
            className="h-6 w-6 rounded-full"
          />
          <span>{user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous'}</span>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={defaultPlaceholder}
          className={`resize-none ${compact ? 'min-h-[80px]' : 'min-h-[100px]'}`}
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {t('comments.characterLimit', { current: content.length, max: 1000 })}
          </div>
          
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t('comments.cancel')}
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || isSubmitting || content.length > 1000}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  {t('comments.submitting')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {parentId ? t('comments.submitReply') : t('comments.submit')}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
} 