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

-- 授予权限
GRANT EXECUTE ON FUNCTION increment_post_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_post_likes(TEXT) TO anon, authenticated;
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

## 📝 NPM Scripts

- `npm run dev` - 启动开发服务器
- `npm run db:init` - 初始化示例数据
- `npm run db:reset` - 重置示例数据
- `npm run build` - 构建生产版本

## 🎉 完成！

设置完成后，访问 [http://localhost:3000](http://localhost:3000) 查看您的博客！

您会看到 3 篇示例文章：
- Next.js 15 和 Server Components 入门
- 使用 Supabase 和 Next.js 构建博客
- 使用 Next-Themes 实现暗色模式 