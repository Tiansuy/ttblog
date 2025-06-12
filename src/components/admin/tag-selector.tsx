"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Check } from "lucide-react"
import { getTags, createTag } from "@/lib/tags"
import { Tag } from "@/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TagSelectorProps {
  selectedTagIds: string[]
  onTagsChange: (tagIds: string[]) => void
}

export function TagSelector({ selectedTagIds, onTagsChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagDescription, setNewTagDescription] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const fetchedTags = await getTags()
      setTags(fetchedTags)
    } catch (error) {
      console.error('Failed to load tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId))
    } else {
      onTagsChange([...selectedTagIds, tagId])
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      setCreating(true)
      const newTag = await createTag({
        name: newTagName.trim(),
        description: newTagDescription.trim() || undefined
      })
      
      setTags(prev => [...prev, newTag])
      onTagsChange([...selectedTagIds, newTag.id])
      
      setNewTagName("")
      setNewTagDescription("")
      setShowCreateDialog(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
      alert('创建标签失败，请检查控制台')
    } finally {
      setCreating(false)
    }
  }

  const getSelectedTags = () => {
    return tags.filter(tag => selectedTagIds.includes(tag.id))
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">加载标签中...</div>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>标签</Label>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-3 w-3" />
              新建标签
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新标签</DialogTitle>
              <DialogDescription>
                为您的博客添加一个新的标签分类
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">标签名称</Label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="输入标签名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-description">描述（可选）</Label>
                <Input
                  id="tag-description"
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                  placeholder="输入标签描述"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleCreateTag} 
                  disabled={creating || !newTagName.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {creating ? '创建中...' : '创建标签'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                >
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 已选择的标签 */}
      {selectedTagIds.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">已选择的标签:</div>
          <div className="flex flex-wrap gap-2">
            {getSelectedTags().map((tag) => (
              <Badge 
                key={tag.id} 
                variant="default" 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.name}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 所有可用标签 */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">可用标签:</div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {tags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id)
            return (
              <Badge 
                key={tag.id} 
                variant={isSelected ? "default" : "outline"} 
                className="flex items-center gap-1 cursor-pointer hover:bg-secondary"
                onClick={() => handleTagToggle(tag.id)}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {tag.name}
              </Badge>
            )
          })}
        </div>
      </div>

      {tags.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p>暂无标签，点击"新建标签"开始创建</p>
        </div>
      )}
    </div>
  )
} 