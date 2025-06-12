import { notFound } from 'next/navigation'
import { getPostBySlug, incrementPostViews } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { format } from 'date-fns'
import { Eye, Heart, Calendar, Clock, Tag } from 'lucide-react'
import Image from 'next/image'

// 设置缓存时间为1小时，可以通过 revalidatePath/revalidateTag 手动触发更新
export const revalidate = 3600;

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  if (!slug) return { title: 'Post Not Found' }

  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  if (!slug) return notFound()

  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // 增加浏览量
  await incrementPostViews(slug)

  // 估算阅读时间（基于字数，平均每分钟 200 字）
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      {/* 文章头部 */}
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.published_at}>
              {format(new Date(post.published_at), 'yyyy年MM月dd日')}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} 分钟阅读</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views} 次浏览</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{post.tags.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* 封面图片 */}
      {post.cover_image && (
        <div className="my-8 overflow-hidden rounded-lg border bg-muted">
          <Image
            src={post.cover_image}
            alt={post.title}
            width={1200}
            height={630}
            className="aspect-[1200/630] object-cover"
            priority
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent content={post.content} />
      </div>

      {/* 文章底部 */}
      <footer className="mt-12 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            最后更新于 {format(new Date(post.updated_at), 'yyyy年MM月dd日')}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm hover:bg-secondary/80">
              <Heart className="h-4 w-4" />
              点赞 ({post.likes})
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
} 