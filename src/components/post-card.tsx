import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Calendar } from "lucide-react"

interface PostCardProps {
  title: string
  excerpt: string
  coverImage: string
  slug: string
  views: number
  likes: number
  publishedAt: string
}

export function PostCard({
  title,
  excerpt,
  coverImage,
  slug,
  views,
  likes,
  publishedAt,
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              width={600}
              height={338}
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="mb-3 line-clamp-2 text-xl font-semibold leading-tight group-hover:text-primary">
            {title}
          </h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-6 pt-0">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{publishedAt}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{likes}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
} 