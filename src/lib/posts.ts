import { supabase } from './supabase';
import { Post, PostWithTags } from '@/types/database';

// 辅助函数：调用重新验证 API
async function revalidatePaths(paths: string[]) {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    });
  } catch (error) {
    console.error('Error revalidating paths:', error);
  }
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }

  return data || [];
}

export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    throw new Error('Failed to fetch published posts');
  }

  return data || [];
}

export async function getPostsWithTags(): Promise<PostWithTags[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      post_tags:post_tags (
        tag:tags (
          id,
          name
        )
      )
    `)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts with tags:', error);
    throw new Error('Failed to fetch posts with tags');
  }

  return data || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }

  return data;
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }

  return data;
}

export async function createPost(postData: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  tags: string[];
  published: boolean;
}): Promise<Post> {
  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('用户未登录');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      cover_image: postData.cover_image || null,
      tags: postData.tags,
      status: postData.published ? 'published' : 'draft',
      published_at: postData.published ? new Date().toISOString() : null,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error(`创建文章失败: ${error.message}`);
  }

  // 重新验证主页和文章详情页
  await revalidatePaths(['/', `/posts/${postData.slug}`]);

  return data;
}

export async function updatePost(id: string, postData: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  tags: string[];
  published: boolean;
}): Promise<Post> {
  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('用户未登录');
  }

  // 获取旧的文章数据以获取原来的 slug
  const oldPost = await getPostById(id);
  if (!oldPost) {
    throw new Error('文章不存在');
  }

  const { data, error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      cover_image: postData.cover_image || null,
      tags: postData.tags,
      status: postData.published ? 'published' : 'draft',
      updated_at: new Date().toISOString(),
      published_at: postData.published ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw new Error(`更新文章失败: ${error.message}`);
  }

  // 重新验证主页和新旧文章详情页
  const pathsToRevalidate = ['/', `/posts/${oldPost.slug}`];
  if (oldPost.slug !== postData.slug) {
    pathsToRevalidate.push(`/posts/${postData.slug}`);
  }
  await revalidatePaths(pathsToRevalidate);

  return data;
}

export async function deletePost(id: string): Promise<void> {
  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('用户未登录');
  }

  // 获取文章数据以获取 slug
  const post = await getPostById(id);
  if (!post) {
    throw new Error('文章不存在');
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error(`删除文章失败: ${error.message}`);
  }

  // 重新验证主页和文章详情页
  await revalidatePaths(['/', `/posts/${post.slug}`]);
}

export async function incrementPostViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_post_views', {
    post_slug: slug
  });

  if (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function incrementPostLikes(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_post_likes', {
    post_slug: slug
  });

  if (error) {
    console.error('Error incrementing likes:', error);
  }
} 