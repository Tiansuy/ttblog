import { PostCard } from "@/components/post-card"
import { getPublishedPosts } from "@/lib/posts"
import { format } from "date-fns"
import { Post } from '@/types/database'

// 设置缓存时间为1小时，可以通过 revalidatePath/revalidateTag 手动触发更新
export const revalidate = 3600;

export default async function Home() {
  let posts: Post[] = [];
  
  try {
    posts = await getPublishedPosts();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to TTBlog
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            A modern personal content management system built with Next.js, Supabase, and more.
          </p>
        </div>
      </section>
      
      <section className="container space-y-6 py-8 md:py-12 lg:py-16">
        {posts.length > 0 ? (
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                title={post.title}
                excerpt={post.excerpt}
                coverImage={post.cover_image || "https://picsum.photos/600/338?random=1"}
                slug={post.slug}
                views={post.views}
                likes={post.likes}
                publishedAt={format(new Date(post.published_at), 'yyyy-MM-dd')}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-[64rem] text-center">
            <p className="text-muted-foreground">
              No posts available. Please run the initialization script to add sample posts.
            </p>
            <pre className="mt-4 rounded-lg bg-muted p-4 text-sm">
              npm run db:init
            </pre>
          </div>
        )}
      </section>
    </div>
  )
}
