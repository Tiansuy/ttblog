import type { User } from '@supabase/supabase-js'

// 管理员邮箱列表 - 在这里添加/删除管理员邮箱
const ADMIN_EMAILS = [
  // 'admin@example.com',
  // 在这里添加更多管理员邮箱
  // 'tiansuy27@gmail.com',
  '2734333845@qq.com',
]

/**
 * 检查用户是否为管理员
 */
export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase())
}

/**
 * 检查用户是否有管理员权限（包含详细信息）
 */
export function checkAdminPermission(user: User | null): {
  isAdmin: boolean
  email: string | null
  provider: string | null
} {
  const email = user?.email || null
  const provider = user?.app_metadata?.provider || null
  
  return {
    isAdmin: isAdmin(user),
    email,
    provider
  }
}

/**
 * 获取管理员邮箱列表（用于显示）
 */
export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS]
} 