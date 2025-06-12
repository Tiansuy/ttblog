import { supabase } from './supabase';
import { getCurrentUser } from './auth';

export async function uploadImage(file: File, path?: string): Promise<string> {
  console.log('开始上传图片:', file.name, file.size, file.type);
  
  // 获取当前用户
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('用户未登录，无法上传图片');
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // 按照RLS策略要求：用户UID/子路径/文件名
  const filePath = path 
    ? `${user.id}/${path}/${fileName}` 
    : `${user.id}/${fileName}`;

  console.log('上传路径:', filePath);
  console.log('用户ID:', user.id);

  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('上传错误详情:', {
      message: error.message,
      error: error,
      code: error.name,
      details: error
    });
    throw new Error(`图片上传失败: ${error.message}`);
  }

  console.log('上传成功:', data);

  // 获取公开URL
  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(data.path);

  console.log('生成的公开URL:', publicUrl);
  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // 获取当前用户
    const user = await getCurrentUser();
    if (!user) {
      console.warn('用户未登录，无法删除图片');
      return;
    }

    // 从URL中提取文件路径
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'post-images');
    
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL');
    }
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    // 验证文件路径是否属于当前用户
    if (!filePath.startsWith(user.id + '/')) {
      throw new Error('无权限删除此图片');
    }
    
    const { error } = await supabase.storage
      .from('post-images')
      .remove([filePath]);

    if (error) {
      console.error('删除文件错误:', error);
      throw new Error(`删除图片失败: ${error.message}`);
    }
  } catch (error) {
    console.error('解析图片URL错误:', error);
    // 不抛出错误，因为文件可能已经不存在
  }
}

export function validateImageFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > maxSize) {
    return '文件大小不能超过 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return '只支持 JPEG、PNG、WebP 和 GIF 格式的图片';
  }

  return null;
} 