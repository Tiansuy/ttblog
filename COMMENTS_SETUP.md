# 评论系统设置指南

## 快速修复错误

如果你看到 "Error fetching comments: {}" 错误，这是因为评论表还没有创建。

## 设置步骤

### 1. 在 Supabase Dashboard 中创建评论表

1. **访问 Supabase Dashboard**
   - 登录 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 选择你的项目

2. **打开 SQL 编辑器**
   - 点击左侧菜单的 "SQL Editor"

3. **执行以下 SQL 脚本**
   ```sql
   -- Create comments table
   CREATE TABLE IF NOT EXISTS public.comments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
     parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     is_deleted BOOLEAN DEFAULT FALSE
   );

   -- Create updated_at trigger for comments
   CREATE TRIGGER update_comments_updated_at 
     BEFORE UPDATE ON comments 
     FOR EACH ROW 
     EXECUTE FUNCTION update_updated_at_column();

   -- Enable RLS (Row Level Security)
   ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

   -- Create policy for public read access to comments
   CREATE POLICY "Comments are viewable by everyone" ON comments
     FOR SELECT USING (is_deleted = FALSE);

   -- Create policy for authenticated users to create comments
   CREATE POLICY "Authenticated users can create comments" ON comments
     FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

   -- Create policy for users to update their own comments
   CREATE POLICY "Users can update their own comments" ON comments
     FOR UPDATE USING (auth.uid() = user_id);

   -- Create policy for users to soft delete their own comments
   CREATE POLICY "Users can delete their own comments" ON comments
     FOR UPDATE USING (auth.uid() = user_id);

   -- Create indexes for better performance
   CREATE INDEX idx_comments_post_id ON comments(post_id);
   CREATE INDEX idx_comments_parent_id ON comments(parent_id);
   CREATE INDEX idx_comments_user_id ON comments(user_id);
   CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
   CREATE INDEX idx_comments_is_deleted ON comments(is_deleted);

   -- Create function to get comments count for a post
   CREATE OR REPLACE FUNCTION get_comments_count(post_uuid UUID)
   RETURNS INTEGER AS $$
   BEGIN
     RETURN (
       SELECT COUNT(*)::INTEGER
       FROM comments
       WHERE post_id = post_uuid AND is_deleted = FALSE
     );
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create function to get comments with user info
   CREATE OR REPLACE FUNCTION get_comments_with_user(post_uuid UUID)
   RETURNS TABLE (
     id UUID,
     post_id UUID,
     parent_id UUID,
     user_id UUID,
     content TEXT,
     created_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE,
     user_email TEXT,
     user_name TEXT,
     user_avatar_url TEXT
   ) AS $$
   BEGIN
     RETURN QUERY
     SELECT 
       c.id,
       c.post_id,
       c.parent_id,
       c.user_id,
       c.content,
       c.created_at,
       c.updated_at,
       u.email as user_email,
       COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as user_name,
       u.raw_user_meta_data->>'avatar_url' as user_avatar_url
     FROM comments c
     JOIN auth.users u ON c.user_id = u.id
     WHERE c.post_id = post_uuid AND c.is_deleted = FALSE
     ORDER BY c.created_at ASC;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Grant necessary permissions
   GRANT SELECT ON comments TO anon;
   GRANT SELECT ON comments TO authenticated;
   GRANT INSERT ON comments TO authenticated;
   GRANT UPDATE ON comments TO authenticated;
   GRANT EXECUTE ON FUNCTION get_comments_count(UUID) TO anon;
   GRANT EXECUTE ON FUNCTION get_comments_count(UUID) TO authenticated;
   GRANT EXECUTE ON FUNCTION get_comments_with_user(UUID) TO anon;
   GRANT EXECUTE ON FUNCTION get_comments_with_user(UUID) TO authenticated;
   ```

4. **点击 "Run" 按钮执行**

### 2. 验证安装

运行完成后，你应该能看到：
- 在 "Table Editor" 中看到 `comments` 表
- 错误消息消失，评论区域正常显示

### 3. 测试评论功能

1. 确保你已经登录（使用 GitHub 或 Google 登录）
2. 访问任意文章页面
3. 在评论区输入评论并发布
4. 测试回复功能

## 功能特性

✅ **用户认证**: 只有登录用户能发表评论
✅ **回复功能**: 支持多层回复（最多3层）
✅ **编辑删除**: 用户可以编辑删除自己的评论
✅ **响应式设计**: 
  - 大屏幕：评论显示在右侧
  - 移动端：评论显示在底部
✅ **实时更新**: 评论立即显示
✅ **用户信息**: 显示用户头像和名称

## 故障排除

### 问题1：仍然看到错误
- 确保 SQL 脚本完整执行
- 检查 Supabase 控制台是否有错误信息
- 尝试刷新页面

### 问题2：无法发表评论
- 确保已经登录
- 检查网络连接
- 查看浏览器控制台错误

### 问题3：用户头像不显示
- 检查 OAuth 登录配置
- 确保用户信息包含头像 URL

## 安全说明

评论系统使用 Supabase 的 Row Level Security (RLS) 来保护数据：

- 所有人都可以查看评论
- 只有登录用户可以创建评论
- 用户只能编辑和删除自己的评论
- 评论使用软删除，不会真正删除数据

如果你遇到任何问题，请检查 Supabase 控制台的日志或联系管理员。 