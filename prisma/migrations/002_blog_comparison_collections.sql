-- Migration: Blog, Comparison, and Collections System
-- Created: 2026-02-11

-- ================================================
-- BLOG POSTS TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'ToolForge Team',
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',

  -- Analytics
  views INTEGER DEFAULT 0,
  read_time INTEGER, -- in minutes

  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views DESC);

-- GIN index for tag searches
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- ================================================
-- COMPARISONS TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Tools being compared (references tools table)
  tool_ids UUID[] NOT NULL,

  -- Comparison data (JSON structure with features matrix)
  comparison_data JSONB DEFAULT '{}',

  -- Winner/recommendation
  winner_tool_id UUID,

  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',

  -- Analytics
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for comparisons
CREATE INDEX IF NOT EXISTS idx_comparisons_slug ON comparisons(slug);
CREATE INDEX IF NOT EXISTS idx_comparisons_status ON comparisons(status);
CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON comparisons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comparisons_views ON comparisons(views DESC);

-- GIN index for tool_ids array searches
CREATE INDEX IF NOT EXISTS idx_comparisons_tool_ids ON comparisons USING GIN(tool_ids);

-- ================================================
-- COLLECTIONS TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  -- Tools in this collection
  tool_ids UUID[] DEFAULT '{}',

  -- Visual customization
  icon TEXT,
  color TEXT,
  featured_image TEXT,

  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',

  -- Analytics & ordering
  views INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for collections
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_status ON collections(status);
CREATE INDEX IF NOT EXISTS idx_collections_order ON collections(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON collections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_views ON collections(views DESC);

-- GIN index for tool_ids array searches
CREATE INDEX IF NOT EXISTS idx_collections_tool_ids ON collections USING GIN(tool_ids);

-- ================================================
-- BLOG CATEGORIES TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for blog_categories
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_order ON blog_categories(order_index ASC);

-- ================================================
-- UPDATE TRIGGERS
-- ================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comparisons_updated_at ON comparisons;
CREATE TRIGGER update_comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SEED DATA
-- ================================================

-- Seed blog categories
INSERT INTO blog_categories (slug, name, description, icon, color, order_index) VALUES
  ('ai-news', 'AI News', 'Latest news and updates from the AI world', '📰', '#3B82F6', 1),
  ('tutorials', 'Tutorials', 'Step-by-step guides and how-tos', '📚', '#10B981', 2),
  ('reviews', 'Reviews', 'In-depth tool reviews and comparisons', '⭐', '#F59E0B', 3),
  ('productivity', 'Productivity', 'Tips to boost your productivity with AI', '⚡', '#8B5CF6', 4),
  ('industry-trends', 'Industry Trends', 'Analysis of AI industry trends', '📊', '#EC4899', 5)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view published comparisons"
  ON comparisons FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view published collections"
  ON collections FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view blog categories"
  ON blog_categories FOR SELECT
  USING (true);

-- Admin full access (you'll need to adjust this based on your auth setup)
-- For now, allowing all operations through service role key
CREATE POLICY "Service role has full access to blog_posts"
  ON blog_posts FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to comparisons"
  ON comparisons FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to collections"
  ON collections FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to blog_categories"
  ON blog_categories FOR ALL
  USING (true);
