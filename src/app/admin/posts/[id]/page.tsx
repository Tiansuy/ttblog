import { getPostById } from "@/lib/posts"
import { notFound } from "next/navigation"
import { PostForm } from "@/components/admin/post-form"

interface PostEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-8">
      <PostForm mode="edit" postId={id} />
    </div>
  )
} 