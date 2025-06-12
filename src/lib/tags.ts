import { supabase } from './supabase';
import { Tag, PostWithTags } from '@/types/database';

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }

  return data || [];
}

export async function createTag(tagData: {
  name: string;
  description?: string;
}): Promise<Tag> {
  // 生成slug
  const slug = tagData.name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: tagData.name,
      slug,
      description: tagData.description
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw new Error('Failed to create tag');
  }

  return data;
}

export async function updateTag(id: string, tagData: {
  name?: string;
  description?: string;
}): Promise<Tag> {
  const updateData: any = { ...tagData };
  
  // 如果更新了名称，重新生成slug
  if (tagData.name) {
    updateData.slug = tagData.name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const { data, error } = await supabase
    .from('tags')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tag:', error);
    throw new Error('Failed to update tag');
  }

  return data;
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tag:', error);
    throw new Error('Failed to delete tag');
  }
}

interface PostTagResponse {
  tag: Tag
}

export async function getPostTagsByPostId(postId: string): Promise<Tag[]> {
  // 首先获取文章的标签ID
  const { data: postTags, error: postTagsError } = await supabase
    .from('post_tags')
    .select('tag_id')
    .eq('post_id', postId);

  if (postTagsError) {
    console.error('Error fetching post tag IDs:', postTagsError);
    throw new Error('Failed to fetch post tags');
  }

  if (!postTags || postTags.length === 0) {
    return [];
  }

  // 然后获取标签详情
  const tagIds = postTags.map(pt => pt.tag_id);
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*')
    .in('id', tagIds);

  if (tagsError) {
    console.error('Error fetching tags:', tagsError);
    throw new Error('Failed to fetch tags');
  }

  return tags || [];
}

export async function updatePostTags(postId: string, tagIds: string[]): Promise<void> {
  // 先删除现有的标签关联
  const { error: deleteError } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId);

  if (deleteError) {
    console.error('Error deleting existing post tags:', deleteError);
    throw new Error('Failed to update post tags');
  }

  // 如果有新标签，添加关联
  if (tagIds.length > 0) {
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));

    const { error: insertError } = await supabase
      .from('post_tags')
      .insert(postTags);

    if (insertError) {
      console.error('Error inserting new post tags:', insertError);
      throw new Error('Failed to update post tags');
    }
  }
}

export async function getPostsWithTags(): Promise<PostWithTags[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      post_tags(
        tag:tags(*)
      )
    `)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts with tags:', error);
    throw new Error('Failed to fetch posts with tags');
  }

  return data || [];
} 