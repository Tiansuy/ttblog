import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 py-8 text-center">
      <FileX className="mb-6 h-24 w-24 text-muted-foreground" />
      <h1 className="mb-4 text-4xl font-bold">文章未找到</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        抱歉，您要查找的文章不存在或已被删除。
      </p>
      <Button asChild>
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>
      </Button>
    </div>
  )
} 