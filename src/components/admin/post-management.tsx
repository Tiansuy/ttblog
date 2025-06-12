"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { getPostsWithTags, deletePost } from "@/lib/posts"
import { PostWithTags } from "@/types/database"

export function PostManagement() {
  const [posts, setPosts] = useState<PostWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await getPostsWithTags()
      setPosts(fetchedPosts)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = () => {
    router.push("/admin/posts/new")
  }

  const handleEditPost = (post: PostWithTags) => {
    router.push(`/admin/posts/${post.id}`)
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      try {
        await deletePost(postId)
        await loadPosts()
      } catch (error) {
        console.error('Failed to delete post:', error)
        alert('删除失败，请检查控制台')
      }
    }
  }

  const getPostTagsFromPost = (post: PostWithTags) => {
    return post.post_tags?.map(pt => pt.tag).filter(Boolean) || []
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">加载中...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">文章管理</h2>
          <p className="text-muted-foreground">管理您的博客文章</p>
        </div>
        <Button onClick={handleCreatePost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新建文章
        </Button>
      </div>

      {/* 文章列表 */}
      <Card>
        <CardHeader>
          <CardTitle>文章列表</CardTitle>
          <CardDescription>
            共 {posts.length} 篇文章
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无文章，点击上方"新建文章"开始创建</p>
              </div>
            ) : (
              posts.map((post) => {
                const postTags = getPostTagsFromPost(post)
                return (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{post.title}</h3>
                        <Badge variant={post.status === 'published' ? "default" : "secondary"}>
                          {post.status === 'published' ? "已发布" : "草稿"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>发布于: {format(new Date(post.published_at), 'yyyy-MM-dd')}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                        {postTags.length > 0 && (
                          <div className="flex gap-1">
                            {postTags.map((tag) => (
                              <Badge key={tag?.id} variant="outline" className="text-xs">
                                {tag?.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditPost(post)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        编辑
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        删除
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 