-- 创建用户点赞记录表
CREATE TABLE IF NOT EXISTS public.user_post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_identifier TEXT, -- 用于未登录用户的标识（基于IP和浏览器指纹）
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_identifier, post_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_post_likes_user_id ON public.user_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_post_likes_post_id ON public.user_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_user_post_likes_user_identifier ON public.user_post_likes(user_identifier);

-- 启用 RLS
ALTER TABLE public.user_post_likes ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Users can view all likes" ON public.user_post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON public.user_post_likes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

-- 创建检查用户是否已点赞的函数
CREATE OR REPLACE FUNCTION check_user_liked_post(
  post_slug TEXT,
  p_user_id UUID DEFAULT NULL,
  p_user_identifier TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  post_uuid UUID;
  like_exists BOOLEAN := FALSE;
BEGIN
  -- 获取文章ID
  SELECT id INTO post_uuid FROM posts WHERE slug = post_slug AND status = 'published';
  
  IF post_uuid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 检查已登录用户的点赞记录
  IF p_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM user_post_likes 
      WHERE post_id = post_uuid AND user_id = p_user_id
    ) INTO like_exists;
  END IF;
  
  -- 如果已登录用户未点赞，检查未登录用户的点赞记录
  IF NOT like_exists AND p_user_identifier IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM user_post_likes 
      WHERE post_id = post_uuid AND user_identifier = p_user_identifier
    ) INTO like_exists;
  END IF;
  
  RETURN like_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建安全的点赞函数
CREATE OR REPLACE FUNCTION like_post(
  post_slug TEXT,
  p_user_id UUID DEFAULT NULL,
  p_user_identifier TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  post_uuid UUID;
  like_exists BOOLEAN := FALSE;
  new_like_count INTEGER;
  result JSON;
BEGIN
  -- 获取文章ID
  SELECT id INTO post_uuid FROM posts WHERE slug = post_slug AND status = 'published';
  
  IF post_uuid IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Post not found');
  END IF;
  
  -- 检查用户是否已经点赞
  SELECT check_user_liked_post(post_slug, p_user_id, p_user_identifier) INTO like_exists;
  
  IF like_exists THEN
    RETURN json_build_object('success', false, 'message', 'Already liked');
  END IF;
  
  -- 插入点赞记录
  INSERT INTO user_post_likes (user_id, post_id, user_identifier)
  VALUES (p_user_id, post_uuid, p_user_identifier);
  
  -- 增加文章点赞数
  UPDATE posts 
  SET likes = likes + 1 
  WHERE id = post_uuid
  RETURNING likes INTO new_like_count;
  
  result := json_build_object(
    'success', true, 
    'message', 'Like added successfully',
    'new_like_count', new_like_count
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 授予函数执行权限
GRANT EXECUTE ON FUNCTION check_user_liked_post(TEXT, UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION like_post(TEXT, UUID, TEXT) TO anon, authenticated; 