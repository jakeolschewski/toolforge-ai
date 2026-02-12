-- ToolForge AI - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_sponsored BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pros_html TEXT,
  cons_html TEXT,
  verdict TEXT,
  rating NUMERIC(3,2),
  author TEXT DEFAULT 'ToolForge Team',
  status TEXT DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  read_time INTEGER,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  tool_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Click Logs Table
CREATE TABLE IF NOT EXISTS click_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (for admin/membership)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  role TEXT DEFAULT 'user',
  stripe_customer_id TEXT,
  subscription_status TEXT,
  subscription_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scraped Sources Table
CREATE TABLE IF NOT EXISTS scraped_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_url TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_url TEXT,
  description TEXT,
  category TEXT,
  raw_data TEXT,
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_published_at ON reviews(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_click_logs_tool_id ON click_logs(tool_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_created_at ON click_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraped_sources_status ON scraped_sources(status);
CREATE INDEX IF NOT EXISTS idx_scraped_sources_created_at ON scraped_sources(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (slug, name, description, "order") VALUES
  ('writing', 'AI Writing Tools', 'Tools for content creation, copywriting, and text generation', 1),
  ('image', 'AI Image Generators', 'Create images, art, and graphics with AI', 2),
  ('video', 'AI Video Tools', 'Video generation, editing, and enhancement', 3),
  ('code', 'AI Coding Assistants', 'Code generation, debugging, and development tools', 4),
  ('chat', 'AI Chatbots', 'Conversational AI and virtual assistants', 5),
  ('productivity', 'AI Productivity', 'Tools to enhance workflow and efficiency', 6),
  ('marketing', 'AI Marketing', 'Marketing automation and content tools', 7),
  ('design', 'AI Design Tools', 'Design, UI/UX, and creative tools', 8),
  ('audio', 'AI Audio & Music', 'Voice, music, and audio generation', 9),
  ('research', 'AI Research Tools', 'Research, analysis, and data tools', 10)
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_sources ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published tools" ON tools
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read published reviews" ON reviews
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

-- Service role has full access (for API routes)
CREATE POLICY "Service role has full access to tools" ON tools
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to reviews" ON reviews
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to click_logs" ON click_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to scraped_sources" ON scraped_sources
  FOR ALL USING (auth.role() = 'service_role');
