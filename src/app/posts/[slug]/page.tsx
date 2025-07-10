import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { ViewTracker } from '@/components/view-tracker'
import { LikeButton } from '@/components/like-button'
import { CommentSection } from '@/components/comment-section'
import { PostHeader } from '@/components/post-header'
import { PostFooter } from '@/components/post-footer'
import Image from 'next/image'

// 设置缓存时间为1小时，可以通过 revalidatePath/revalidateTag 手动触发更新
export const revalidate = 3600;

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  if (!slug) return { title: 'Post Not Found' }

  // 解码 URL 编码的 slug
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)
  
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

  // 解码 URL 编码的 slug
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    notFound()
  }

  // 估算阅读时间（基于字数，平均每分钟 200 字）
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="min-h-screen bg-background">
      {/* 客户端浏览量跟踪组件 */}
      <ViewTracker postSlug={decodedSlug} />

      {/* 响应式布局容器 */}
      <div className="container max-w-7xl mx-auto py-6 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* 文章内容区域 */}
          <main className="flex-1 lg:max-w-4xl">
            <article className="space-y-8">
              {/* 文章头部 */}
              <PostHeader 
                title={post.title}
                publishedAt={post.published_at}
                readingTime={readingTime}
                views={post.views}
                tags={post.tags}
              />

              {/* 封面图片 */}
              {post.cover_image && (
                <div className="overflow-hidden rounded-lg border bg-muted">
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
              <PostFooter 
                updatedAt={post.updated_at}
                postSlug={decodedSlug}
                initialLikeCount={post.likes}
              />
            </article>
          </main>

          {/* 大屏幕评论区域 - 固定侧边栏 */}
          <aside className="hidden lg:block lg:w-96">
            <div className="sticky top-[3.5rem] -mt-12 pt-12">
              <CommentSection 
                postId={post.id} 
                className="h-[600px] rounded-lg border shadow-sm bg-card"
              />
            </div>
          </aside>
        </div>

        {/* 移动端：底部评论 */}
        <div className="lg:hidden mt-12">
          <CommentSection postId={post.id} isMobile={true} className="rounded-lg border" />
        </div>
      </div>
    </div>
  )
} 