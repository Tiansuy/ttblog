'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateHomePage() {
  revalidatePath('/')
}

export async function revalidatePostPage(slug: string) {
  // 对 slug 进行 URL 编码以支持中文字符
  const encodedSlug = encodeURIComponent(slug)
  revalidatePath(`/posts/${encodedSlug}`)
  
  // 也重新验证原始 slug 路径（以防万一）
  if (encodedSlug !== slug) {
    revalidatePath(`/posts/${slug}`)
  }
}

export async function revalidateMultiplePaths(paths: string[]) {
  for (const path of paths) {
    // 如果路径包含 /posts/，对 slug 部分进行编码
    if (path.startsWith('/posts/')) {
      const slug = path.replace('/posts/', '')
      const encodedSlug = encodeURIComponent(slug)
      revalidatePath(`/posts/${encodedSlug}`)
      
      // 也重新验证原始路径（以防万一）
      if (encodedSlug !== slug) {
        revalidatePath(path)
      }
    } else {
      revalidatePath(path)
    }
  }
} 