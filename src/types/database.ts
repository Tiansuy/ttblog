export interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  slug: string
  views: number
  likes: number
  published_at: string
  created_at: string
  updated_at: string
  author_id?: string
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
}

export interface Tag {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface PostTag {
  post_id: string
  tag_id: string
  tag?: Tag
}

export interface PostWithTags extends Post {
  post_tags?: PostTag[]
}

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes'>
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tag, 'id' | 'created_at' | 'updated_at'>>
      }
      post_tags: {
        Row: PostTag
        Insert: Omit<PostTag, 'id' | 'created_at'>
        Update: Partial<Omit<PostTag, 'id' | 'created_at'>>
      }
    }
  }
} 