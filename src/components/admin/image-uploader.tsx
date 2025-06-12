"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ExternalLink } from "lucide-react"
import { uploadImage, validateImageFile, deleteImage } from "@/lib/storage"
import Image from "next/image"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUploader({ value, onChange, label = "封面图片" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    console.log('选择的文件:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })

    const validationError = validateImageFile(file)
    if (validationError) {
      console.error('文件验证失败:', validationError)
      alert(validationError)
      return
    }

    try {
      setUploading(true)
      console.log('开始上传文件...')
      const imageUrl = await uploadImage(file, 'covers')
      console.log('上传成功，URL:', imageUrl)
      onChange(imageUrl)
    } catch (error) {
      console.error('图片上传失败:', error)
      const errorMessage = error instanceof Error ? error.message : '图片上传失败，请重试'
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleRemoveImage = async () => {
    if (value) {
      try {
        await deleteImage(value)
      } catch (error) {
        console.error('删除图片失败:', error)
      }
      onChange("")
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* URL输入 */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg 或上传文件"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => window.open(value, '_blank')}
              title="在新窗口打开"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 文件上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value && !uploading ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Image
                src={value}
                alt="预览"
                width={200}
                height={120}
                className="rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              点击 X 删除图片，或拖拽新图片替换
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {uploading ? '上传中...' : '拖拽图片到此处，或点击选择文件'}
              </p>
              <p className="text-xs text-muted-foreground">
                支持 JPEG、PNG、WebP、GIF，最大 5MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              选择文件
            </Button>
          </div>
        )}
      </div>

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