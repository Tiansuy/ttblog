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

-- Create simplified function to get comments with basic user info
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
  -- Check if post exists
  IF NOT EXISTS (SELECT 1 FROM posts WHERE posts.id = post_uuid) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    c.id,
    c.post_id,
    c.parent_id,
    c.user_id,
    c.content,
    c.created_at,
    c.updated_at,
    COALESCE(u.email, 'unknown@example.com') as user_email,
    COALESCE(
      u.raw_user_meta_data->>'name',
      u.raw_user_meta_data->>'full_name',
      split_part(COALESCE(u.email, 'anonymous'), '@', 1),
      'Anonymous'
    ) as user_name,
    u.raw_user_meta_data->>'avatar_url' as user_avatar_url
  FROM comments c
  LEFT JOIN auth.users u ON c.user_id = u.id
  WHERE c.post_id = post_uuid AND c.is_deleted = FALSE
  ORDER BY c.created_at ASC;
  
EXCEPTION
  WHEN OTHERS THEN
    -- If there's any error accessing auth.users, return comments without user info
    RETURN QUERY
    SELECT 
      c.id,
      c.post_id,
      c.parent_id,
      c.user_id,
      c.content,
      c.created_at,
      c.updated_at,
      'anonymous@example.com'::TEXT as user_email,
      'Anonymous'::TEXT as user_name,
      NULL::TEXT as user_avatar_url
    FROM comments c
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