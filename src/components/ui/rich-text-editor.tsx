"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import { useCallback, useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Upload,
  Eye,
  Edit3
} from 'lucide-react'
import { uploadImage, validateImageFile } from '@/lib/storage'
import { htmlToMarkdown } from '@/lib/mdx-converter'
import { MDXContent } from '@/components/mdx-content'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "开始写作..." }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-primary hover:decoration-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // 监听content prop的变化，更新编辑器内容
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // 取消设置链接
    if (url === null) {
      return
    }

    // 清空链接
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // 设置链接
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImageFromUrl = useCallback(() => {
    const url = window.prompt('图片URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const handleFileUpload = useCallback(async (file: File) => {
    console.log('TipTap编辑器: 开始上传图片', file.name)
    
    const validationError = validateImageFile(file)
    if (validationError) {
      console.error('TipTap编辑器: 文件验证失败', validationError)
      alert(validationError)
      return
    }

    try {
      console.log('TipTap编辑器: 正在上传...')
      const imageUrl = await uploadImage(file, 'editor-images')
      console.log('TipTap编辑器: 上传成功', imageUrl)
      
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run()
      }
    } catch (error) {
      console.error('TipTap编辑器: 上传失败', error)
      const errorMessage = error instanceof Error ? error.message : '图片上传失败，请重试'
      alert(errorMessage)
    }
  }, [editor])

  const uploadImageFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    // 清空input以便重复选择同一文件
    e.target.value = ''
  }, [handleFileUpload])

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* <Label>内容</Label> */}
      <div className="border rounded-lg overflow-hidden">
        {/* 工具栏 */}
        <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
          {/* 编辑/预览模式切换 */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              type="button"
              variant={!isPreviewMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setIsPreviewMode(false)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={isPreviewMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* 分隔符 */}
          <div className="w-px h-6 bg-border mx-1" />

          {!isPreviewMode && (
            <>
              {/* 文本格式 */}
              <Button
                type="button"
                variant={editor?.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('strike') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('code') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleCode().run()}
              >
                <Code className="h-4 w-4" />
              </Button>

              {/* 分隔符 */}
              <div className="w-px h-6 bg-border mx-1" />

              {/* 标题 */}
              <Button
                type="button"
                variant={editor?.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                <Heading3 className="h-4 w-4" />
              </Button>

              {/* 分隔符 */}
              <div className="w-px h-6 bg-border mx-1" />

              {/* 列表 */}
              <Button
                type="button"
                variant={editor?.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('blockquote') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={editor?.isActive('codeBlock') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              >
                <Code2 className="h-4 w-4" />
              </Button>

              {/* 分隔符 */}
              <div className="w-px h-6 bg-border mx-1" />

              {/* 链接和图片 */}
              <Button
                type="button"
                variant={editor?.isActive('link') ? 'default' : 'ghost'}
                size="sm"
                onClick={setLink}
                title="添加链接"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImageFromUrl}
                title="通过URL添加图片"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={uploadImageFile}
                title="上传图片文件"
              >
                <Upload className="h-4 w-4" />
              </Button>

              {/* 分隔符 */}
              <div className="w-px h-6 bg-border mx-1" />

              {/* 撤销重做 */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* 内容区域 */}
        {isPreviewMode ? (
          /* 预览模式 */
          <div className="p-4 min-h-[400px] bg-background">
            <MDXContent content={htmlToMarkdown(content)} />
          </div>
        ) : (
          /* 编辑模式 */
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none dark:prose-invert"
          />
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}