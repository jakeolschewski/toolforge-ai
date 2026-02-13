-- ============================================================================
-- WORKFLOW VAULT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This migration creates all tables needed for the Workflow Vault system:
-- - Workflows (templates, automations, dashboards, etc.)
-- - Categories (W.E.D.G.E. framework)
-- - Purchases & Downloads
-- - Memberships & Subscriptions
-- - Reviews & Ratings
-- - Favorites & Collections
-- - Analytics & Tracking
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(200),
  color VARCHAR(50),
  wedge_category VARCHAR(50), -- workflows, engines, dashboards, generators, environments
  business_system VARCHAR(50), -- crm, sales, marketing, operations, etc.
  workflow_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_categories_slug ON vault_categories(slug);
CREATE INDEX IF NOT EXISTS idx_vault_categories_order ON vault_categories(order_index);

-- ----------------------------------------------------------------------------
-- WORKFLOWS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) UNIQUE NOT NULL,

  -- Basic Information
  title VARCHAR(300) NOT NULL,
  tagline VARCHAR(500),
  description TEXT NOT NULL,
  long_description TEXT,

  -- Categorization
  category_id UUID REFERENCES vault_categories(id) ON DELETE SET NULL,
  wedge_category VARCHAR(50), -- workflows, engines, dashboards, generators, environments
  business_system VARCHAR(50), -- crm, sales, marketing, operations, etc.
  subcategory VARCHAR(100),

  -- Pricing
  pricing_type VARCHAR(20) DEFAULT 'free', -- free, premium, members_only
  pricing_tier VARCHAR(20), -- free, starter, pro, premium, enterprise
  price INTEGER DEFAULT 0, -- in cents
  original_price INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',
  is_free BOOLEAN DEFAULT TRUE,

  -- Media
  featured_image VARCHAR(500),
  thumbnail_url VARCHAR(500),
  gallery_images JSONB DEFAULT '[]',
  preview_video_url VARCHAR(500),
  demo_url VARCHAR(500),
  preview_images TEXT[],

  -- Files
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(20) DEFAULT 'json', -- json, zip, pdf, docx, etc.
  file_size BIGINT,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  related_tools TEXT[],
  required_tools TEXT[],

  -- Difficulty & Effort
  difficulty_level VARCHAR(20), -- beginner, intermediate, advanced, expert
  estimated_time INTEGER, -- in minutes
  step_count INTEGER,

  -- Features & Benefits
  features JSONB DEFAULT '[]',
  includes JSONB DEFAULT '[]',
  outcomes JSONB DEFAULT '[]',
  use_cases JSONB DEFAULT '[]',
  target_audience TEXT[],
  prerequisites TEXT[],
  requirements TEXT[],

  -- Author
  author VARCHAR(200) DEFAULT 'ToolForge AI',
  author_id UUID,
  author_name VARCHAR(200),
  author_avatar VARCHAR(500),

  -- Version & Updates
  version VARCHAR(20) DEFAULT '1.0.0',
  update_frequency VARCHAR(20), -- weekly, monthly, quarterly, yearly, as_needed
  changelog JSONB DEFAULT '[]',

  -- Status & Visibility
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived, coming_soon
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,

  -- Engagement Metrics
  downloads INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,

  -- Stripe Integration
  stripe_product_id VARCHAR(200),
  stripe_price_id VARCHAR(200),

  -- SEO
  seo_title VARCHAR(200),
  seo_description TEXT,
  seo_keywords TEXT[],
  keywords TEXT[] DEFAULT '{}',
  og_image VARCHAR(500),

  -- Additional Data
  faq JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  affiliate_commission DECIMAL(5,2),
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  last_downloaded_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vault_workflows_slug ON vault_workflows(slug);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_category ON vault_workflows(category_id);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_status ON vault_workflows(status);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_pricing ON vault_workflows(pricing_type);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_featured ON vault_workflows(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_vault_workflows_downloads ON vault_workflows(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_rating ON vault_workflows(rating DESC);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_wedge ON vault_workflows(wedge_category);
CREATE INDEX IF NOT EXISTS idx_vault_workflows_business ON vault_workflows(business_system);

-- ----------------------------------------------------------------------------
-- PURCHASES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User & Workflow
  user_id UUID NOT NULL,
  user_email VARCHAR(300) NOT NULL,
  workflow_id UUID NOT NULL REFERENCES vault_workflows(id) ON DELETE CASCADE,
  workflow_slug VARCHAR(200),
  workflow_title VARCHAR(300),

  -- Payment Details
  amount INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method VARCHAR(50),

  -- Stripe Integration
  stripe_payment_intent_id VARCHAR(200),
  stripe_checkout_session_id VARCHAR(200),
  stripe_customer_id VARCHAR(200),
  transaction_id VARCHAR(200),

  -- License & Access
  license_key VARCHAR(200),
  access_granted BOOLEAN DEFAULT FALSE,
  download_limit INTEGER DEFAULT 999,
  downloads_used INTEGER DEFAULT 0,

  -- Discounts & Referrals
  coupon_code VARCHAR(100),
  discount_amount INTEGER DEFAULT 0,
  referral_source VARCHAR(200),
  affiliate_id UUID,

  -- Documents
  invoice_url VARCHAR(500),
  receipt_url VARCHAR(500),

  -- Refunds
  refund_reason TEXT,
  refunded_at TIMESTAMP,
  refund_amount INTEGER,

  -- Notes
  notes TEXT,

  -- Timestamps
  purchase_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_purchases_user ON vault_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_purchases_workflow ON vault_purchases(workflow_id);
CREATE INDEX IF NOT EXISTS idx_vault_purchases_status ON vault_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_vault_purchases_date ON vault_purchases(purchase_date DESC);

-- ----------------------------------------------------------------------------
-- MEMBERSHIPS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Information
  user_id UUID NOT NULL UNIQUE,
  user_email VARCHAR(300) NOT NULL,

  -- Membership Details
  plan VARCHAR(20) NOT NULL, -- monthly, yearly
  tier VARCHAR(20) DEFAULT 'basic', -- free, basic, pro, premium, lifetime
  status VARCHAR(20) DEFAULT 'active', -- active, canceled, past_due, paused, expired, trialing
  billing_period VARCHAR(20) DEFAULT 'monthly', -- monthly, annual

  -- Pricing
  price INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',

  -- Stripe Integration
  stripe_subscription_id VARCHAR(200),
  stripe_customer_id VARCHAR(200),
  payment_method_id VARCHAR(200),
  payment_method_brand VARCHAR(50),
  payment_method_last4 VARCHAR(4),

  -- Trial Period
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  is_trial BOOLEAN DEFAULT FALSE,

  -- Billing Cycle
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,

  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,

  -- Access Benefits
  workflows_included TEXT[] DEFAULT '{}',
  download_limit INTEGER,
  has_priority_support BOOLEAN DEFAULT FALSE,
  has_early_access BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vault_memberships_user ON vault_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_memberships_status ON vault_memberships(status);
CREATE INDEX IF NOT EXISTS idx_vault_memberships_stripe_sub ON vault_memberships(stripe_subscription_id);

-- ----------------------------------------------------------------------------
-- FAVORITES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workflow_id UUID NOT NULL REFERENCES vault_workflows(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, workflow_id)
);

CREATE INDEX IF NOT EXISTS idx_vault_favorites_user ON vault_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_favorites_workflow ON vault_favorites(workflow_id);

-- ----------------------------------------------------------------------------
-- DOWNLOAD TOKENS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(100) UNIQUE NOT NULL,
  workflow_id UUID NOT NULL REFERENCES vault_workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  downloads_remaining INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_download_tokens_token ON vault_download_tokens(token);
CREATE INDEX IF NOT EXISTS idx_vault_download_tokens_expires ON vault_download_tokens(expires_at);

-- ----------------------------------------------------------------------------
-- DOWNLOAD LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES vault_workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  purchase_id UUID REFERENCES vault_purchases(id) ON DELETE SET NULL,
  download_token VARCHAR(100),
  file_type VARCHAR(20),
  file_size BIGINT,
  ip_hash VARCHAR(100),
  user_agent TEXT,
  is_completed BOOLEAN DEFAULT TRUE,
  downloaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_download_logs_workflow ON vault_download_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_vault_download_logs_user ON vault_download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_download_logs_date ON vault_download_logs(downloaded_at DESC);

-- ----------------------------------------------------------------------------
-- REVIEWS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Associations
  workflow_id UUID NOT NULL REFERENCES vault_workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  purchase_id UUID REFERENCES vault_purchases(id) ON DELETE SET NULL,

  -- Review Content
  title VARCHAR(300),
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

  -- Verification
  is_verified_purchase BOOLEAN DEFAULT FALSE,

  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, flagged

  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  -- Author Info
  author_name VARCHAR(200),
  author_avatar VARCHAR(500),
  author_verified BOOLEAN DEFAULT FALSE,

  -- Creator Response
  creator_response TEXT,
  creator_responded_at TIMESTAMP,

  -- Moderation
  flagged_reason TEXT,
  moderated_by UUID,
  moderated_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vault_reviews_workflow ON vault_reviews(workflow_id);
CREATE INDEX IF NOT EXISTS idx_vault_reviews_user ON vault_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_reviews_status ON vault_reviews(status);
CREATE INDEX IF NOT EXISTS idx_vault_reviews_rating ON vault_reviews(rating DESC);

-- ----------------------------------------------------------------------------
-- REVIEW VOTES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES vault_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_vault_review_votes_review ON vault_review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_vault_review_votes_user ON vault_review_votes(user_id);

-- ----------------------------------------------------------------------------
-- BUNDLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) UNIQUE NOT NULL,

  -- Bundle Details
  name VARCHAR(300) NOT NULL,
  description TEXT,
  tagline VARCHAR(500),

  -- Included Workflows
  workflow_ids UUID[] NOT NULL,

  -- Pricing
  price INTEGER NOT NULL, -- in cents
  original_price INTEGER NOT NULL,
  savings_percentage INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Type
  bundle_type VARCHAR(20), -- themed, system, complete, seasonal

  -- Display
  featured_image VARCHAR(500),
  badge VARCHAR(100),

  -- Stats
  purchase_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  is_limited_time BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,

  -- SEO
  seo_title VARCHAR(200),
  seo_description TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vault_bundles_slug ON vault_bundles(slug);
CREATE INDEX IF NOT EXISTS idx_vault_bundles_status ON vault_bundles(status);

-- ----------------------------------------------------------------------------
-- ANALYTICS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vault_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES vault_workflows(id) ON DELETE CASCADE,

  -- Performance Metrics
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in cents

  -- Engagement Metrics
  avg_time_on_page INTEGER DEFAULT 0, -- in seconds
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,

  -- Time-based Metrics
  views_last_7_days INTEGER DEFAULT 0,
  views_last_30_days INTEGER DEFAULT 0,
  purchases_last_7_days INTEGER DEFAULT 0,
  purchases_last_30_days INTEGER DEFAULT 0,
  revenue_last_7_days INTEGER DEFAULT 0,
  revenue_last_30_days INTEGER DEFAULT 0,

  -- Quality Metrics
  avg_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  satisfaction_score DECIMAL(5,2),

  -- Rankings
  popularity_rank INTEGER,
  revenue_rank INTEGER,
  rating_rank INTEGER,

  -- Timestamps
  last_calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(workflow_id)
);

CREATE INDEX IF NOT EXISTS idx_vault_analytics_workflow ON vault_analytics(workflow_id);

-- ----------------------------------------------------------------------------
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vault_categories_updated_at BEFORE UPDATE ON vault_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_workflows_updated_at BEFORE UPDATE ON vault_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_purchases_updated_at BEFORE UPDATE ON vault_purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_memberships_updated_at BEFORE UPDATE ON vault_memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_reviews_updated_at BEFORE UPDATE ON vault_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_bundles_updated_at BEFORE UPDATE ON vault_bundles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_analytics_updated_at BEFORE UPDATE ON vault_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA - SAMPLE CATEGORIES
-- ============================================================================

INSERT INTO vault_categories (slug, name, description, icon, color, wedge_category, order_index, is_featured) VALUES
  ('workflows', 'Workflows', 'Complete step-by-step processes and templates', '⚡', '#3B82F6', 'workflows', 1, TRUE),
  ('engines', 'Automation Engines', 'Powerful automation systems and tools', '🔧', '#8B5CF6', 'engines', 2, TRUE),
  ('dashboards', 'Dashboards', 'Tracking and analytics interfaces', '📊', '#10B981', 'dashboards', 3, TRUE),
  ('generators', 'Content Generators', 'Content and asset creation tools', '✨', '#F59E0B', 'generators', 4, TRUE),
  ('environments', 'Complete Environments', 'Full working setups and systems', '🏗️', '#EF4444', 'environments', 5, TRUE),
  ('crm', 'CRM Systems', 'Customer relationship management workflows', '👥', '#6366F1', 'workflows', 6, FALSE),
  ('sales', 'Sales Workflows', 'Sales automation and processes', '💰', '#22C55E', 'workflows', 7, FALSE),
  ('marketing', 'Marketing Automation', 'Marketing campaigns and funnels', '📢', '#EC4899', 'workflows', 8, FALSE),
  ('operations', 'Operations', 'Business operations and processes', '⚙️', '#14B8A6', 'workflows', 9, FALSE),
  ('analytics', 'Analytics', 'Data tracking and reporting systems', '📈', '#06B6D4', 'dashboards', 10, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COMPLETE
-- ============================================================================
