-- 创建存储桶（如果不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- 删除旧的策略（如果存在）
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;

-- 创建新的RLS策略
-- 允许用户上传到自己的文件夹
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images'
  AND (select auth.uid()::text) = (storage.foldername(name))[1]
);

-- 允许所有人查看图片（公开访问）
CREATE POLICY "Users can view all images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- 允许用户删除自己的图片
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images'
  AND (select auth.uid()::text) = (storage.foldername(name))[1]
);

-- 允许用户更新自己的图片
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-images'
  AND (select auth.uid()::text) = (storage.foldername(name))[1]
);

-- 确保RLS开启
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 