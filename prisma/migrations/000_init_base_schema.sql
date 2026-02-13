-- Base Schema Migration for ToolForge AI
-- Creates all core tables from Prisma schema

-- ================================================
-- TOOLS TABLE (Main)
-- ================================================
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  website_url TEXT NOT NULL,
  affiliate_link TEXT,
  logo_url TEXT,
  screenshot_url TEXT,
  pricing_model TEXT DEFAULT 'freemium',
  starting_price TEXT,
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_sponsored BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tools_views ON tools(views DESC);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tools_features ON tools USING GIN(features);

-- ================================================
-- REVIEWS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pros_html TEXT,
  cons_html TEXT,
  verdict TEXT,
  rating DECIMAL(3, 2),
  author TEXT DEFAULT 'ToolForge Team',
  status TEXT DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  read_time INTEGER,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- ================================================
-- CATEGORIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  tool_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);

-- ================================================
-- CLICK LOGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS click_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_click_logs_tool_id ON click_logs(tool_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_created_at ON click_logs(created_at);

-- ================================================
-- USERS TABLE (NextAuth)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  name TEXT,
  image TEXT,
  role TEXT DEFAULT 'user',
  stripe_customer_id TEXT,
  subscription_status TEXT,
  subscription_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ================================================
-- ACCOUNTS TABLE (NextAuth)
-- ================================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- ================================================
-- SESSIONS TABLE (NextAuth)
-- ================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- ================================================
-- VERIFICATION TOKENS TABLE (NextAuth)
-- ================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

-- ================================================
-- FAVORITES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tool_id ON favorites(tool_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at);

-- ================================================
-- USER COLLECTIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS user_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tool_ids UUID[] DEFAULT '{}',
  icon TEXT,
  color TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_collections_is_public ON user_collections(is_public);
CREATE INDEX IF NOT EXISTS idx_user_collections_created_at ON user_collections(created_at);

-- ================================================
-- TOOL REVIEWS TABLE (User-submitted)
-- ================================================
CREATE TABLE IF NOT EXISTS tool_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  rating DECIMAL(3, 2) NOT NULL,
  title TEXT,
  content TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0,
  not_helpful INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_reviews_user_id ON tool_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_tool_id ON tool_reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_status ON tool_reviews(status);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_created_at ON tool_reviews(created_at);

-- ================================================
-- BROWSE HISTORY TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS browse_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_browse_history_user_id ON browse_history(user_id);
CREATE INDEX IF NOT EXISTS idx_browse_history_tool_id ON browse_history(tool_id);
CREATE INDEX IF NOT EXISTS idx_browse_history_viewed_at ON browse_history(viewed_at);

-- ================================================
-- USER PREFERENCES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE,
  new_tools_alert BOOLEAN DEFAULT TRUE,
  favorite_category_alert BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  favorite_categories TEXT[] DEFAULT '{}',
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SOCIAL PROOF TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS social_proof (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID UNIQUE NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  favorite_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(3, 2) DEFAULT 0,
  views_last_7_days INTEGER DEFAULT 0,
  views_last_30_days INTEGER DEFAULT 0,
  trending_score DECIMAL(10, 2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_proof_trending_score ON social_proof(trending_score DESC);

-- ================================================
-- SCRAPED SOURCES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS scraped_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_url TEXT,
  description TEXT,
  category TEXT,
  raw_data TEXT,
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scraped_sources_status ON scraped_sources(status);
CREATE INDEX IF NOT EXISTS idx_scraped_sources_created_at ON scraped_sources(created_at);

-- ================================================
-- UPDATE TRIGGER FUNCTION
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_collections_updated_at BEFORE UPDATE ON user_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_reviews_updated_at BEFORE UPDATE ON tool_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_proof_updated_at BEFORE UPDATE ON social_proof
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published tools" ON tools FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published reviews" ON reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);

-- Users can manage their own data
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own collections" ON user_collections FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can manage their own collections" ON user_collections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view published tool reviews" ON tool_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can manage their own tool reviews" ON tool_reviews FOR ALL USING (auth.uid() = user_id);

-- Admin access via service role
CREATE POLICY "Service role has full access to tools" ON tools FOR ALL USING (true);
CREATE POLICY "Service role has full access to reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Service role has full access to categories" ON categories FOR ALL USING (true);

-- ================================================
-- SEED DATA
-- ================================================

-- Seed categories
INSERT INTO categories (slug, name, description, icon, order_index) VALUES
  ('writing', 'Writing & Content', 'AI writing assistants and content generation tools', '✍️', 1),
  ('image', 'Image Generation', 'AI-powered image creation and editing tools', '🎨', 2),
  ('video', 'Video', 'Video generation, editing, and enhancement tools', '🎥', 3),
  ('code', 'Code & Development', 'AI coding assistants and development tools', '💻', 4),
  ('chat', 'Chat & Assistants', 'Conversational AI and chatbot platforms', '💬', 5),
  ('productivity', 'Productivity', 'Tools to boost efficiency and automation', '⚡', 6),
  ('marketing', 'Marketing & SEO', 'Marketing automation and SEO optimization', '📈', 7),
  ('design', 'Design', 'Design tools and creative assistants', '🎨', 8),
  ('audio', 'Audio & Voice', 'Voice generation, transcription, and audio tools', '🎵', 9),
  ('research', 'Research & Data', 'Research assistants and data analysis tools', '🔬', 10)
ON CONFLICT (slug) DO NOTHING;
