# 标签表设置说明

## 1. 创建标签表

在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL：

```sql
-- 创建标签表
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建文章标签关联表（多对多关系）
CREATE TABLE IF NOT EXISTS public.post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, tag_id)
);

-- 创建标签更新时间触发器
CREATE OR REPLACE FUNCTION public.handle_updated_at_tags()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at_tags();

-- 为标签表创建索引
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags(tag_id);

-- 启用RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略（允许所有操作，生产环境中应该更严格）
CREATE POLICY "Enable read access for all users" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.tags FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.tags FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.post_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.post_tags FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.post_tags FOR DELETE USING (true);

-- 修改 posts 表，移除 tags 字段（保留兼容性）
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS tags;

-- 插入一些示例标签
INSERT INTO public.tags (name, slug, description) VALUES 
('Next.js', 'nextjs', 'Next.js相关文章'),
('React', 'react', 'React相关文章'),
('TypeScript', 'typescript', 'TypeScript相关文章'),
('前端开发', 'frontend', '前端开发相关文章'),
('后端开发', 'backend', '后端开发相关文章'),
('数据库', 'database', '数据库相关文章'),
('教程', 'tutorial', '教程类文章'),
('技巧', 'tips', '技巧分享')
ON CONFLICT (name) DO NOTHING;
```

## 2. 创建存储桶

在 Supabase Dashboard 的 Storage 中创建一个名为 `post-images` 的存储桶：

1. 进入 Storage 页面
2. 点击 "New bucket"
3. 输入桶名：`post-images`
4. 设置为 Public bucket（允许公开访问）
5. 点击 "Save"

## 3. 设置存储策略

```sql
-- 为存储桶创建策略
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- 允许所有用户上传图片
CREATE POLICY "Anyone can upload post images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images');

-- 允许所有用户查看图片
CREATE POLICY "Anyone can view post images" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');

-- 允许所有用户删除图片
CREATE POLICY "Anyone can delete post images" ON storage.objects FOR DELETE USING (bucket_id = 'post-images');
```

## 4. 注意事项

- 标签与文章是多对多关系，通过 `post_tags` 表关联
- 删除标签会自动从所有文章中移除该标签（CASCADE）
- 存储桶设置为公开，生产环境中应该考虑更严格的权限控制
- 图片文件建议限制大小和格式（在前端实现） 