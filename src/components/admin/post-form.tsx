"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Plus, Edit, Trash2, Eye, Save, X, Clock, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { createPost, updatePost, getPostById } from "@/lib/posts"
import { getPostTagsByPostId } from "@/lib/tags"
import { TagSelector } from "./tag-selector"
import { ImageUploader } from "./image-uploader"
import { useDraftStore } from "@/stores/draft-store"
import { mdxToHtml, htmlToMarkdown } from "@/lib/mdx-converter"

interface PostFormProps {
  mode: "create" | "edit"
  postId?: string
}

export function PostForm({ mode, postId }: PostFormProps) {
  const router = useRouter()
  const {
    draft,
    hasUnsavedChanges,
    lastSavedAt,
    updateDraft,
    clearDraft,
    markAsSaved,
    loadFromPost
  } = useDraftStore()

  useEffect(() => {
    // 如果是编辑模式，加载文章数据
    if (mode === "edit" && postId) {
      loadPostData()
    } else {
      // 新建模式，清空草稿
      clearDraft()
    }
  }, [mode, postId])

  const loadPostData = async () => {
    try {
      const post = await getPostById(postId!)
      if (!post) {
        router.push("/admin")
        return
      }

      const postTags = await getPostTagsByPostId(post.id)
      const selectedTagIds = postTags.map(tag => tag.id)
      
      // 将MDX内容转换为HTML用于编辑
      const htmlContent = await mdxToHtml(post.content || "")
      
      // 将文章数据加载到草稿store
      loadFromPost({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: htmlContent,
        cover_image: post.cover_image || "",
        published: post.status === 'published',
        selectedTagIds
      })
    } catch (error) {
      console.error('Failed to load post:', error)
      router.push("/admin")
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const extractTextFromHTML = (html: string): string => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    const scripts = tempDiv.querySelectorAll('script, style')
    scripts.forEach(script => script.remove())
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const generateExcerpt = (content: string, maxLength: number = 200): string => {
    const plainText = extractTextFromHTML(content)
    const trimmed = plainText.trim()
    
    if (trimmed.length <= maxLength) {
      return trimmed
    }
    
    let excerpt = trimmed.substring(0, maxLength)
    const lastPunctIndex = excerpt.search(/[。！？.!?][^。！？.!?]*$/)
    
    if (lastPunctIndex > maxLength * 0.6) {
      excerpt = excerpt.substring(0, lastPunctIndex + 1)
    } else {
      excerpt = excerpt.trim() + '...'
    }
    
    return excerpt
  }

  const handleSavePost = async () => {
    try {
      const mdxContent = htmlToMarkdown(draft.content)
      
      let excerptToSave = draft.excerpt.trim()
      if (!excerptToSave && draft.content) {
        excerptToSave = generateExcerpt(draft.content)
        updateDraft('excerpt', excerptToSave)
      }

      const postData = {
        title: draft.title,
        slug: draft.slug,
        excerpt: excerptToSave,
        content: mdxContent,
        cover_image: draft.cover_image || undefined,
        tags: [],
        published: draft.published
      }

      if (mode === "edit" && postId) {
        await updatePost(postId, postData)
      } else {
        await createPost(postData)
      }

      markAsSaved()
      router.push("/admin")
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('保存失败，请检查控制台')
    }
  }

  const handleTitleChange = (title: string) => {
    updateDraft('title', title)
    updateDraft('slug', generateSlug(title))
  }

  const handleClearForm = () => {
    if (confirm('确定要清空表单吗？')) {
      clearDraft()
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "edit" ? "编辑文章" : "新建文章"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "edit" ? "修改现有文章内容" : "创建一篇新的文章"}
            </p>
          </div>
        </div>
        
        {/* 草稿状态指示器 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>有未保存的更改</span>
            </div>
          )}
          {lastSavedAt && (
            <span>
              草稿保存于: {format(new Date(lastSavedAt), 'MM-dd HH:mm')}
            </span>
          )}
        </div>
      </div>

      {/* 表单内容 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 左栏：基本信息 */}
        <div className="space-y-4">
          {/* 标题和Slug */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="文章标题"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={draft.slug}
                  onChange={(e) => updateDraft('slug', e.target.value)}
                  placeholder="文章slug"
                />
              </div>
            </div>
          </Card>

          {/* 摘要 */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="excerpt">摘要</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (draft.content) {
                      const autoExcerpt = generateExcerpt(draft.content)
                      updateDraft('excerpt', autoExcerpt)
                    } else {
                      alert('请先编写正文内容')
                    }
                  }}
                  className="text-xs h-6 px-2"
                >
                  自动生成
                </Button>
              </div>
              <Textarea
                id="excerpt"
                value={draft.excerpt}
                onChange={(e) => updateDraft('excerpt', e.target.value)}
                placeholder="文章摘要（留空将自动从正文生成）"
                rows={3}
              />
              {!draft.excerpt && draft.content && (
                <p className="text-xs text-muted-foreground">
                  💡 摘要为空时，保存时将自动从正文前200个字符生成
                </p>
              )}
            </div>
          </Card>

          {/* 封面图片 */}
          <Card className="p-6">
            <div className="space-y-4">
              {/* <Label>封面图片</Label> */}
              <ImageUploader
                value={draft.cover_image}
                onChange={(url) => updateDraft('cover_image', url)}
              />
            </div>
          </Card>

          {/* 标签选择 */}
          <Card className="p-6">
            <div className="space-y-4">
              {/* <Label>文章标签</Label> */}
              <TagSelector
                selectedTagIds={draft.selectedTagIds}
                onTagsChange={(tagIds) => updateDraft('selectedTagIds', tagIds)}
              />
            </div>
          </Card>
        </div>

        {/* 右栏：操作区域和富文本编辑器 */}
        <div className="space-y-4">
          {/* 操作区域 */}
          <Card className="p-6">
            <div className="space-y-4">
              {/* 发布状态开关 */}
              <div className="flex items-center justify-between">
                <Label htmlFor="published-switch" className="text-sm font-medium">
                  发布文章
                </Label>
                <Switch
                  id="published-switch"
                  checked={draft.published}
                  onCheckedChange={(checked) => updateDraft('published', checked)}
                />
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                <Button onClick={handleSavePost} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  保存
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearForm} 
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  清空
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin")} 
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  取消
                </Button>
              </div>
            </div>
          </Card>

          {/* 富文本编辑器 */}
          <Card className="flex-1">
            <RichTextEditor
              content={draft.content}
              onChange={(content) => updateDraft('content', content)}
              placeholder="开始写作..."
            />
          </Card>
        </div>
      </div>
    </div>
  )
} 