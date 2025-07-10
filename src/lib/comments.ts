import { supabase } from './supabase'
import type { Comment, CommentWithUser, CommentTree } from '@/types/database'

/**
 * 检查评论表是否存在
 */
async function checkCommentsTableExists(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('comments')
      .select('id')
      .limit(1)
    
    return error === null
  } catch (error) {
    console.log('Comments table does not exist yet')
    return false
  }
}

/**
 * 获取文章的评论列表（包含用户信息）
 */
export async function getComments(postId: string): Promise<CommentWithUser[]> {
  try {
    // 检查评论表是否存在
    const tableExists = await checkCommentsTableExists()
    if (!tableExists) {
      return []
    }

    // 首先尝试使用RPC函数
    const { data, error } = await supabase.rpc('get_comments_with_user', {
      post_uuid: postId
    })

    if (error) {
      // 如果RPC函数不存在，尝试直接查询
      if (error.message?.includes('function') || error.code === '42883') {
        return await getCommentsDirectQuery(postId)
      }
      
      // 对于其他错误，也尝试降级查询
      return await getCommentsDirectQuery(postId)
    }

    return data || []
  } catch (error) {
    // 尝试备用查询方法
    try {
      return await getCommentsDirectQuery(postId)
    } catch (fallbackError) {
      console.error('Failed to fetch comments:', fallbackError)
      return []
    }
  }
}

/**
 * 直接查询评论（备用方法）
 */
async function getCommentsDirectQuery(postId: string): Promise<CommentWithUser[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        user_id,
        content,
        created_at,
        updated_at,
        is_deleted
      `)
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Direct query failed: ${error.message}`)
    }

    // 如果没有评论，直接返回空数组
    if (!data || data.length === 0) {
      return []
    }

    // 获取用户信息并组合数据
    const userIds = [...new Set(data.map(comment => comment.user_id))]
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      // 返回没有用户详细信息的评论
      return data.map(comment => ({
        ...comment,
        user_email: '',
        user_name: 'Anonymous',
        user_avatar_url: undefined
      }))
    }

    const userMap = new Map(users.users.map(user => [user.id, user]))

    return data.map(comment => {
      const user = userMap.get(comment.user_id)
      return {
        ...comment,
        user_email: user?.email || '',
        user_name: user?.user_metadata?.name || 
                   user?.user_metadata?.full_name || 
                   user?.email?.split('@')[0] || 
                   'Anonymous',
        user_avatar_url: user?.user_metadata?.avatar_url || undefined
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * 获取文章的评论树状结构
 */
export async function getCommentsTree(postId: string): Promise<CommentTree[]> {
  try {
    const comments = await getComments(postId)
    
    if (comments.length === 0) {
      return []
    }
    
    // 构建评论树
    const commentMap = new Map<string, CommentTree>()
    const rootComments: CommentTree[] = []

    // 初始化所有评论
    comments.forEach(comment => {
      commentMap.set(comment.id, {
        ...comment,
        replies: []
      })
    })

    // 构建树状结构
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!
      
      if (comment.parent_id) {
        // 如果有父评论，添加到父评论的回复列表
        const parentComment = commentMap.get(comment.parent_id)
        if (parentComment) {
          parentComment.replies.push(commentNode)
        }
      } else {
        // 如果没有父评论，添加到根评论列表
        rootComments.push(commentNode)
      }
    })

    return rootComments
  } catch (error) {
    console.error('Failed to build comments tree:', error)
    return []
  }
}

/**
 * 创建评论
 */
export async function createComment(
  postId: string,
  content: string,
  parentId?: string
): Promise<{ success: boolean; comment?: CommentWithUser; error?: string }> {
  try {
    // 检查评论表是否存在
    const tableExists = await checkCommentsTableExists()
    if (!tableExists) {
      return { success: false, error: 'Comments feature not available. Please run database migrations.' }
    }

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // 插入评论
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        parent_id: parentId || null,
        user_id: user.id,
        content: content.trim()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return { success: false, error: error.message }
    }

    // 获取包含用户信息的评论
    const { data: commentWithUser, error: fetchError } = await supabase
      .rpc('get_comments_with_user', { post_uuid: postId })

    if (fetchError) {
      console.error('Error fetching comment with user:', fetchError)
      return { success: false, error: fetchError.message }
    }

    // 找到刚刚创建的评论
    const newComment = commentWithUser.find((c: CommentWithUser) => c.id === data.id)

    return { 
      success: true, 
      comment: newComment || {
        ...data,
        user_email: user.email || '',
        user_name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        user_avatar_url: user.user_metadata?.avatar_url
      }
    }
  } catch (error) {
    console.error('Failed to create comment:', error)
    return { success: false, error: 'Failed to create comment' }
  }
}

/**
 * 更新评论
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查评论表是否存在
    const tableExists = await checkCommentsTableExists()
    if (!tableExists) {
      return { success: false, error: 'Comments feature not available' }
    }

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('comments')
      .update({ content: content.trim() })
      .eq('id', commentId)
      .eq('user_id', user.id) // 只能更新自己的评论

    if (error) {
      console.error('Error updating comment:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to update comment:', error)
    return { success: false, error: 'Failed to update comment' }
  }
}

/**
 * 删除评论（软删除）
 */
export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查评论表是否存在
    const tableExists = await checkCommentsTableExists()
    if (!tableExists) {
      return { success: false, error: 'Comments feature not available' }
    }

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', commentId)
      .eq('user_id', user.id) // 只能删除自己的评论

    if (error) {
      console.error('Error deleting comment:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}

/**
 * 获取评论数量
 */
export async function getCommentsCount(postId: string): Promise<number> {
  try {
    // 检查评论表是否存在
    const tableExists = await checkCommentsTableExists()
    if (!tableExists) {
      return 0
    }

    // 首先尝试使用RPC函数
    const { data, error } = await supabase.rpc('get_comments_count', {
      post_uuid: postId
    })

    if (error) {
      // 如果RPC函数不存在，尝试直接查询
      if (error.message?.includes('function') || error.code === '42883') {
        return await getCommentsCountDirect(postId)
      }
      throw new Error(`Failed to fetch comments count: ${error.message}`)
    }

    return data || 0
  } catch (error) {
    // 尝试备用查询方法
    try {
      return await getCommentsCountDirect(postId)
    } catch (fallbackError) {
      console.error('Failed to fetch comments count:', fallbackError)
      return 0
    }
  }
}

/**
 * 直接查询评论数量（备用方法）
 */
async function getCommentsCountDirect(postId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_deleted', false)

    if (error) {
      throw new Error(`Direct count query failed: ${error.message}`)
    }

    return count || 0
  } catch (error) {
    throw error
  }
}

/**
 * 检查用户是否可以编辑评论
 */
export async function canUserEditComment(commentId: string): Promise<boolean> {
  try {
    // 检查评论表是否存在
    const tableExists = await checkCommentsTableExists()
    if (!tableExists) {
      return false
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (error || !data) {
      return false
    }

    return data.user_id === user.id
  } catch (error) {
    console.error('Failed to check edit permission:', error)
    return false
  }
} 