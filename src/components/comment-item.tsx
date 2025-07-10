"use client"

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/use-auth'
import { deleteComment, updateComment } from '@/lib/comments'
import { CommentForm } from './comment-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Reply, Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { CommentTree } from '@/types/database'

interface CommentItemProps {
  comment: CommentTree
  postId: string
  onCommentAdded?: () => void
  onCommentUpdated?: () => void
  onCommentDeleted?: () => void
  depth?: number
  maxDepth?: number
}

export function CommentItem({ 
  comment, 
  postId, 
  onCommentAdded, 
  onCommentUpdated, 
  onCommentDeleted, 
  depth = 0,
  maxDepth = 3
}: CommentItemProps) {
  const { t, i18n } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const canEdit = isAuthenticated && user?.id === comment.user_id
  const canReply = isAuthenticated && depth < maxDepth
  const hasReplies = comment.replies && comment.replies.length > 0

  const handleReplyAdded = () => {
    setShowReplyForm(false)
    onCommentAdded?.()
  }

  const handleEdit = async () => {
    if (!editContent.trim()) return

    setIsUpdating(true)
    try {
      const result = await updateComment(comment.id, editContent)
      if (result.success) {
        setIsEditing(false)
        onCommentUpdated?.()
      } else {
        console.error('Failed to update comment:', result.error)
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('comments.confirmDelete'))) return

    setIsDeleting(true)
    try {
      const result = await deleteComment(comment.id)
      if (result.success) {
        onCommentDeleted?.()
      } else {
        console.error('Failed to delete comment:', result.error)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const locale = i18n.language === 'zh' ? zhCN : enUS
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: locale 
      })
    } catch (error) {
      return t('comments.justNow')
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}`}>
      <div className="group space-y-3">
        {/* 评论头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={comment.user_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name)}&background=random`}
              alt={comment.user_name}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <div className="font-medium text-sm">{comment.user_name}</div>
              <div className="text-xs text-muted-foreground">{formatTime(comment.created_at)}</div>
            </div>
          </div>

          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  {t('comments.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('comments.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* 评论内容 */}
        <div className="text-sm">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="resize-none min-h-[80px]"
                disabled={isUpdating}
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {t('comments.characterLimit', { current: editContent.length, max: 1000 })}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditContent(comment.content)
                    }}
                    disabled={isUpdating}
                  >
                    {t('comments.cancel')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={!editContent.trim() || isUpdating || editContent.length > 1000}
                  >
                    {isUpdating ? t('comments.updating') : t('comments.save')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          )}
        </div>

        {/* 操作按钮 */}
        {!isEditing && (
          <div className="flex items-center gap-4 text-sm">
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                <Reply className="h-4 w-4 mr-1" />
                {t('comments.reply')}
              </Button>
            )}
            
            {hasReplies && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{t('comments.repliesCount', { count: comment.replies.length })}</span>
              </div>
            )}
          </div>
        )}

        {/* 回复表单 */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onCommentAdded={handleReplyAdded}
              onCancel={() => setShowReplyForm(false)}
              placeholder={t('comments.replyTo', { name: comment.user_name })}
              compact={true}
            />
          </div>
        )}

        {/* 回复列表 */}
        {hasReplies && (
          <div className="space-y-4 mt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onCommentAdded={onCommentAdded}
                onCommentUpdated={onCommentUpdated}
                onCommentDeleted={onCommentDeleted}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 