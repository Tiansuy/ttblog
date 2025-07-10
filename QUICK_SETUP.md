# TTBlog 快速设置指南

## 🚀 5分钟快速启动

### 1. 设置环境变量

创建 `.env.local` 文件：

```bash
# 从 Supabase Dashboard > Settings > API 获取以下信息
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. 在 Supabase 中创建数据库表

在 Supabase Dashboard > SQL Editor 中执行以下 SQL：

```sql
-- 创建 posts 表
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

-- 创建索引
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- 创建功能函数
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET views = views + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_post_likes(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET likes = likes + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建用户点赞记录表 🆕
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

-- 创建检查用户是否已点赞的函数 🆕
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

-- 创建安全的点赞函数 🆕
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

-- 授予权限
GRANT EXECUTE ON FUNCTION increment_post_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_post_likes(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_user_liked_post(TEXT, UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION like_post(TEXT, UUID, TEXT) TO anon, authenticated;
```

### 3. 初始化示例数据

```bash
npm run db:init
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 🔧 故障排除

### 环境变量检查

运行以下命令检查环境变量是否正确设置：

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置');
console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置');
console.log('SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已设置' : '❌ 未设置');
"
```

### 常见问题

1. **"Missing Supabase environment variables"**
   - 确保 `.env.local` 文件在项目根目录
   - 检查变量名是否正确拼写

2. **"relation 'public.posts' does not exist"**
   - 确保已在 Supabase SQL 编辑器中运行了完整的 SQL 脚本
   - 检查表是否在正确的 schema 中创建

3. **"Failed to fetch posts"**
   - 检查 Supabase 项目是否暂停
   - 验证 API 密钥是否正确

4. **点赞功能不工作** 🆕
   - 确保已运行包含用户点赞记录表的完整 SQL 脚本
   - 检查浏览器控制台是否有错误信息
   - 验证 RLS 策略是否正确设置

## 📝 NPM Scripts

- `npm run dev` - 启动开发服务器
- `npm run db:init` - 初始化示例数据
- `npm run db:reset` - 重置示例数据

## 🆕 新功能: 文章点赞

### 功能特性
- ✅ **防重复点赞**: 每个用户只能对一篇文章点赞一次
- ✅ **支持未登录用户**: 使用浏览器指纹识别未登录用户
- ✅ **永久记录**: 点赞记录存储在数据库中，不会丢失
- ✅ **实时更新**: 点赞后立即更新点赞数量
- ✅ **状态显示**: 清楚显示用户是否已点赞

### 使用方式
1. 访问任意文章页面
2. 滚动到文章底部
3. 点击"点赞"按钮
4. 点赞成功后按钮变为红色，显示"您已经点赞过了"
5. 再次点击无效，防止重复点赞 