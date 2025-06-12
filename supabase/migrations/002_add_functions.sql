-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET views = views + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post likes
CREATE OR REPLACE FUNCTION increment_post_likes(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET likes = likes + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION increment_post_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_post_likes(TEXT) TO anon, authenticated; 