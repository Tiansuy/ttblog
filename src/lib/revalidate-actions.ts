'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateHomePage() {
  revalidatePath('/')
}

export async function revalidatePostPage(slug: string) {
  revalidatePath(`/posts/${slug}`)
}

export async function revalidateMultiplePaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path)
  }
} 