"use client"

import { useEffect, useState, useMemo } from "react"
import { PostCard } from "@/components/post-card"
import { getPostsWithTags } from "@/lib/posts"

import { format } from "date-fns"
import { PostWithTags, Tag } from '@/types/database'
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search,
  Filter,
  X
} from "lucide-react"

interface SortOption {
  key: string
  label: string
  getValue: (post: PostWithTags) => number | Date
  order: 'asc' | 'desc'
}

export default function PostsPage() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<PostWithTags[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 筛选和排序状态
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("time-desc")
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  // 获取文章关联的标签（同时支持新旧标签系统）
  const getPostTags = (post: PostWithTags): Tag[] => {
    // 优先从关联表获取标签（新系统）
    const relatedTags = post.post_tags?.map(pt => pt.tag).filter((tag): tag is Tag => Boolean(tag)) || []
    
    // 如果关联表没有标签，尝试从 tags 字段获取（旧系统）
    if (relatedTags.length === 0 && post.tags && Array.isArray(post.tags)) {
      // 将标签名称转换为 Tag 对象
      return post.tags.map(tagName => ({
        id: tagName, // 使用标签名作为临时ID
        name: tagName,
        description: undefined,
        created_at: '',
        updated_at: ''
      }))
    }
    
    return relatedTags
  }

  const sortOptions: SortOption[] = [
    {
      key: "time-desc",
      label: t('posts.filters.sortDesc'),
      getValue: (post) => new Date(post.published_at || post.created_at),
      order: 'desc'
    },
    {
      key: "time-asc", 
      label: t('posts.filters.sortAsc'),
      getValue: (post) => new Date(post.published_at || post.created_at),
      order: 'asc'
    },
    {
      key: "views-desc",
      label: t('posts.filters.sortViewsDesc'),
      getValue: (post) => post.views || 0,
      order: 'desc'
    },
    {
      key: "views-asc",
      label: t('posts.filters.sortViewsAsc'), 
      getValue: (post) => post.views || 0,
      order: 'asc'
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsData = await getPostsWithTags()
        setPosts(postsData)
        
        // 从已发布的文章中提取所有使用过的标签（支持新旧标签系统）
        const publishedPosts = postsData.filter(post => post.status === 'published')
        const usedTagsMap = new Map<string, Tag>()
        
        publishedPosts.forEach(post => {
          const postTags = getPostTags(post)
          postTags.forEach(tag => {
            // 使用标签名称作为唯一键，避免重复
            usedTagsMap.set(tag.name, tag)
          })
        })
        
        // 转换为数组并按名称排序
        const usedTags = Array.from(usedTagsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
        setTags(usedTags)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 筛选和排序逻辑
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => post.status === 'published')

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        getPostTags(post).some(tag => tag.name.toLowerCase().includes(query))
      )
    }

    // 标签筛选（统一使用标签名称匹配）
    if (selectedTagIds.length > 0) {
      filtered = filtered.filter(post => {
        const postTagNames = getPostTags(post).map(tag => tag.name)
        return selectedTagIds.every(tagName => postTagNames.includes(tagName))
      })
    }

    // 排序
    const sortOption = sortOptions.find(option => option.key === sortBy)
    if (sortOption) {
      filtered.sort((a, b) => {
        const aValue = sortOption.getValue(a)
        const bValue = sortOption.getValue(b)
        
        if (sortOption.order === 'desc') {
          if (aValue > bValue) return -1
          if (aValue < bValue) return 1
          return 0
        } else {
          if (aValue < bValue) return -1
          if (aValue > bValue) return 1
          return 0
        }
      })
    }

    return filtered
  }, [posts, searchQuery, selectedTagIds, sortBy])

  // 分页逻辑
  const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = filteredAndSortedPosts.slice(startIndex, endIndex)

  // 重置分页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTagIds, sortBy, itemsPerPage])

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTagIds([])
    setSortBy("time-desc")
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (loading) {
    return (
      <div className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              {t('posts.title')}
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              {t('posts.loading')}
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {t('posts.title')}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t('posts.subtitle')}
          </p>
        </div>
      </section>
      
      <section className="container space-y-6 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[64rem]">
          {error ? (
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                {t('common.tryAgain')}
              </Button>
            </div>
          ) : (
            <>
              {/* 筛选和搜索区域 */}
              <Card className="mb-8">
                <CardContent className="p-6 space-y-6">
                  {/* 搜索框 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={t('posts.filters.search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* 排序和每页数量 */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">{t('posts.filters.sortBy')}:</label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">{t('posts.pagination.itemsPerPage')}:</label>
                      <select 
                        value={itemsPerPage} 
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                      </select>
                    </div>
                  </div>

                  {/* 标签筛选 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{t('posts.filters.filterByTags')}:</label>
                      {(selectedTagIds.length > 0 || searchQuery.trim()) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearFilters}
                          className="flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          {t('posts.filters.clearFilters')}
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {tags.map((tag) => {
                        // 使用标签名称作为统一的识别符（兼容新旧系统）
                        const tagIdentifier = tag.name
                        const isSelected = selectedTagIds.includes(tagIdentifier)
                        return (
                          <Badge
                            key={tag.id}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => handleTagToggle(tagIdentifier)}
                          >
                            {tag.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 统计信息 */}
              <div className="text-center mb-8">
                <p className="text-lg text-muted-foreground">
                  {t('posts.pagination.showing', {
                    start: currentPosts.length > 0 ? startIndex + 1 : 0,
                    end: Math.min(endIndex, filteredAndSortedPosts.length),
                    total: filteredAndSortedPosts.length
                  })}
                </p>
              </div>

              {/* 文章列表 */}
              {currentPosts.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        title={post.title}
                        excerpt={post.excerpt}
                        coverImage={post.cover_image || "https://picsum.photos/600/338?random=1"}
                        slug={post.slug}
                        views={post.views}
                        likes={post.likes}
                        publishedAt={format(new Date(post.published_at || post.created_at), 'yyyy-MM-dd')}
                      />
                    ))}
                  </div>

                  {/* 分页控制 */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col items-center space-y-4">
                      {/* 页码信息 */}
                      <p className="text-sm text-muted-foreground">
                        {t('posts.pagination.page', { current: currentPage, total: totalPages })}
                      </p>

                      {/* 分页按钮 */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                          {t('posts.pagination.first')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          {t('posts.pagination.previous')}
                        </Button>

                        {/* 页码选择器 */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                            if (page <= totalPages) {
                              return (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => goToPage(page)}
                                >
                                  {page}
                                </Button>
                              )
                            }
                            return null
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          {t('posts.pagination.next')}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          {t('posts.pagination.last')}
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* 快速跳转 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {t('posts.pagination.goToPage')}:
                        </span>
                        <Input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value)
                            if (page >= 1 && page <= totalPages) {
                              goToPage(page)
                            }
                          }}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {filteredAndSortedPosts.length === 0 && posts.length > 0 
                      ? t('posts.filters.noResults')
                      : t('posts.noPostsFound')
                    }
                  </p>
                  {filteredAndSortedPosts.length === 0 && posts.length === 0 && (
                    <pre className="mt-4 rounded-lg bg-muted p-4 text-sm inline-block">
                      {t('posts.runInitScript')}
                    </pre>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
} 