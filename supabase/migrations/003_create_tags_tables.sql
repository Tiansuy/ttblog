-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create updated_at trigger for tags
CREATE TRIGGER update_tags_updated_at 
  BEFORE UPDATE ON tags 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for tags
CREATE POLICY "Tags are viewable by everyone" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tags" ON tags
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for post_tags
CREATE POLICY "Post tags are viewable by everyone" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can manage post tags for their own posts" ON post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_tags.post_id 
      AND posts.author_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id); 