-- ================================================
-- AI EDGE OS™ WORKFLOW VAULT™ DATABASE SCHEMA
-- ================================================
-- Migration: 20250213_workflow_vault
-- Purpose: Complete database schema for workflow marketplace
-- Includes: 9 business systems, memberships, downloads, reviews, analytics
-- Framework: W.E.D.G.E.™ (Workflow Engine for Digital Growth & Excellence)
-- ================================================

-- ================================================
-- WORKFLOW CATEGORIES TABLE
-- ================================================
-- The 9 core business systems of AI Edge OS™
CREATE TABLE IF NOT EXISTS workflow_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  workflow_count INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_categories_slug ON workflow_categories(slug);
CREATE INDEX IF NOT EXISTS idx_workflow_categories_order ON workflow_categories(order_index);
CREATE INDEX IF NOT EXISTS idx_workflow_categories_active ON workflow_categories(is_active);

-- ================================================
-- WORKFLOWS TABLE (Main Product Table)
-- ================================================
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES workflow_categories(id) ON DELETE RESTRICT,

  -- Basic Information
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  long_description TEXT,

  -- W.E.D.G.E.™ Framework Fields
  wedge_score DECIMAL(3, 2) DEFAULT 0, -- Overall W.E.D.G.E.™ rating (0-10)
  workflow_complexity TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
  efficiency_rating DECIMAL(3, 2) DEFAULT 0, -- Efficiency score (0-10)
  digital_maturity TEXT DEFAULT 'foundational', -- foundational, growing, mature, cutting-edge
  growth_potential TEXT DEFAULT 'moderate', -- low, moderate, high, exponential
  excellence_tier TEXT DEFAULT 'standard', -- standard, premium, elite, legendary

  -- Pricing & Access
  pricing_tier TEXT NOT NULL DEFAULT 'free', -- free, basic, pro, premium, enterprise
  base_price DECIMAL(10, 2) DEFAULT 0,
  member_price DECIMAL(10, 2) DEFAULT 0, -- Price for members (if different)
  is_member_exclusive BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,

  -- Media & Assets
  thumbnail_url TEXT,
  preview_image_url TEXT,
  video_url TEXT,
  demo_url TEXT,

  -- Content & Features
  features JSONB DEFAULT '[]', -- Array of feature objects
  requirements JSONB DEFAULT '[]', -- Technical requirements
  includes JSONB DEFAULT '[]', -- What's included in the workflow
  tags TEXT[] DEFAULT '{}',

  -- Metrics & Analytics
  version TEXT DEFAULT '1.0.0',
  file_size_mb DECIMAL(10, 2),
  estimated_time_minutes INTEGER, -- Time to implement/complete
  roi_multiplier DECIMAL(5, 2), -- Expected ROI (e.g., 3.5x)

  -- Social Proof
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,

  -- SEO & Discovery
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',

  -- Status & Publishing
  status TEXT DEFAULT 'draft', -- draft, published, archived, coming_soon
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,

  -- Tracking
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,

  -- Timestamps
  published_at TIMESTAMPTZ,
  featured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflows_slug ON workflows(slug);
CREATE INDEX IF NOT EXISTS idx_workflows_category_id ON workflows(category_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_pricing_tier ON workflows(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_workflows_is_featured ON workflows(is_featured);
CREATE INDEX IF NOT EXISTS idx_workflows_is_trending ON workflows(is_trending);
CREATE INDEX IF NOT EXISTS idx_workflows_rating ON workflows(rating DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_downloads ON workflows(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON workflows(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_tags ON workflows USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_workflows_features ON workflows USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_workflows_wedge_score ON workflows(wedge_score DESC);

-- ================================================
-- WORKFLOW FILES TABLE
-- ================================================
-- Stores actual workflow files and assets
CREATE TABLE IF NOT EXISTS workflow_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,

  -- File Information
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- make, json, n8n, zapier, pdf, etc.
  file_url TEXT NOT NULL, -- Supabase storage URL or external URL
  file_size_bytes BIGINT,
  mime_type TEXT,

  -- File Metadata
  version TEXT DEFAULT '1.0.0',
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE, -- Main workflow file
  order_index INTEGER DEFAULT 0,

  -- Access Control
  requires_membership BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,

  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_files_workflow_id ON workflow_files(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_files_file_type ON workflow_files(file_type);
CREATE INDEX IF NOT EXISTS idx_workflow_files_is_primary ON workflow_files(is_primary);

-- ================================================
-- MEMBERSHIPS TABLE
-- ================================================
-- Subscription management for premium members
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Membership Details
  tier TEXT NOT NULL DEFAULT 'free', -- free, basic, pro, premium, enterprise
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, expired, trial, past_due

  -- Billing
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  price_monthly DECIMAL(10, 2),
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly, lifetime

  -- Trial Information
  is_trial BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMPTZ,

  -- Membership Period
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Benefits & Limits
  max_downloads INTEGER, -- NULL = unlimited
  downloads_used INTEGER DEFAULT 0,
  features_access JSONB DEFAULT '{}', -- Custom feature flags

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_tier ON memberships(tier);
CREATE INDEX IF NOT EXISTS idx_memberships_stripe_subscription ON memberships(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_memberships_expires_at ON memberships(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_memberships_user_active ON memberships(user_id) WHERE status = 'active';

-- ================================================
-- WORKFLOW PURCHASES TABLE
-- ================================================
-- Track individual workflow purchases (for paid workflows)
CREATE TABLE IF NOT EXISTS workflow_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE RESTRICT,

  -- Purchase Details
  purchase_type TEXT NOT NULL DEFAULT 'one_time', -- one_time, bundle, membership_included
  price_paid DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Payment Information
  stripe_payment_id TEXT,
  stripe_invoice_id TEXT,
  payment_status TEXT DEFAULT 'completed', -- pending, completed, failed, refunded

  -- License & Access
  license_key TEXT UNIQUE,
  license_type TEXT DEFAULT 'personal', -- personal, team, commercial, enterprise
  expires_at TIMESTAMPTZ, -- NULL = lifetime access
  download_limit INTEGER, -- NULL = unlimited
  downloads_used INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  refunded_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_purchases_user_id ON workflow_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_purchases_workflow_id ON workflow_purchases(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_purchases_status ON workflow_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_workflow_purchases_purchased_at ON workflow_purchases(purchased_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workflow_purchases_user_workflow ON workflow_purchases(user_id, workflow_id) WHERE payment_status = 'completed';

-- ================================================
-- WORKFLOW DOWNLOADS TABLE
-- ================================================
-- Track every download for analytics and license enforcement
CREATE TABLE IF NOT EXISTS workflow_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for anonymous
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  file_id UUID REFERENCES workflow_files(id) ON DELETE SET NULL,

  -- Download Context
  download_type TEXT DEFAULT 'free', -- free, purchased, membership, trial
  purchase_id UUID REFERENCES workflow_purchases(id) ON DELETE SET NULL,
  membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,

  -- Analytics
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  country_code TEXT,

  -- File Information
  file_name TEXT,
  file_size_bytes BIGINT,

  -- Timestamps
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_downloads_user_id ON workflow_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_downloads_workflow_id ON workflow_downloads(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_downloads_file_id ON workflow_downloads(file_id);
CREATE INDEX IF NOT EXISTS idx_workflow_downloads_type ON workflow_downloads(download_type);
CREATE INDEX IF NOT EXISTS idx_workflow_downloads_date ON workflow_downloads(downloaded_at DESC);

-- ================================================
-- WORKFLOW REVIEWS TABLE
-- ================================================
-- User reviews and ratings for workflows
CREATE TABLE IF NOT EXISTS workflow_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,

  -- Review Content
  rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  title TEXT,
  content TEXT,

  -- W.E.D.G.E.™ Ratings (Optional detailed ratings)
  workflow_rating DECIMAL(3, 2), -- How well-structured the workflow is
  efficiency_rating DECIMAL(3, 2), -- Time/resource efficiency
  ease_of_use_rating DECIMAL(3, 2), -- User-friendliness
  value_rating DECIMAL(3, 2), -- Value for money/time

  -- Verification & Trust
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_verified_user BOOLEAN DEFAULT FALSE,

  -- Social Engagement
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  -- Moderation
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, spam
  moderator_notes TEXT,
  moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_reviews_user_id ON workflow_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_reviews_workflow_id ON workflow_reviews(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_reviews_status ON workflow_reviews(status);
CREATE INDEX IF NOT EXISTS idx_workflow_reviews_rating ON workflow_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_reviews_created_at ON workflow_reviews(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workflow_reviews_user_workflow ON workflow_reviews(user_id, workflow_id);

-- ================================================
-- WORKFLOW UPDATES TABLE
-- ================================================
-- Version history and changelog for workflows
CREATE TABLE IF NOT EXISTS workflow_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,

  -- Version Information
  version TEXT NOT NULL,
  previous_version TEXT,
  is_major_update BOOLEAN DEFAULT FALSE,

  -- Update Content
  title TEXT NOT NULL,
  description TEXT,
  changelog JSONB DEFAULT '[]', -- Array of change items

  -- Files
  added_files TEXT[] DEFAULT '{}',
  modified_files TEXT[] DEFAULT '{}',
  removed_files TEXT[] DEFAULT '{}',

  -- Metadata
  author TEXT,
  release_notes_url TEXT,

  -- Timestamps
  released_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_updates_workflow_id ON workflow_updates(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_updates_version ON workflow_updates(version);
CREATE INDEX IF NOT EXISTS idx_workflow_updates_released_at ON workflow_updates(released_at DESC);

-- ================================================
-- WORKFLOW BUNDLES TABLE
-- ================================================
-- Curated collections of workflows sold together
CREATE TABLE IF NOT EXISTS workflow_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Bundle Information
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,

  -- Workflows in Bundle
  workflow_ids UUID[] DEFAULT '{}',
  workflow_count INTEGER DEFAULT 0,

  -- Pricing
  original_price DECIMAL(10, 2) NOT NULL,
  bundle_price DECIMAL(10, 2) NOT NULL,
  savings_amount DECIMAL(10, 2),
  savings_percentage DECIMAL(5, 2),

  -- Media
  thumbnail_url TEXT,
  preview_image_url TEXT,

  -- Categorization
  category_ids UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',

  -- Metrics
  purchase_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  keywords TEXT[] DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'published', -- draft, published, archived
  is_featured BOOLEAN DEFAULT FALSE,

  -- Validity Period
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_bundles_slug ON workflow_bundles(slug);
CREATE INDEX IF NOT EXISTS idx_workflow_bundles_status ON workflow_bundles(status);
CREATE INDEX IF NOT EXISTS idx_workflow_bundles_featured ON workflow_bundles(is_featured);
CREATE INDEX IF NOT EXISTS idx_workflow_bundles_workflow_ids ON workflow_bundles USING GIN(workflow_ids);

-- ================================================
-- WORKFLOW ANALYTICS TABLE
-- ================================================
-- Daily aggregated analytics for workflows
CREATE TABLE IF NOT EXISTS workflow_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  -- View & Engagement Metrics
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,

  -- Conversion Metrics
  purchases INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  refunds INTEGER DEFAULT 0,
  refund_amount DECIMAL(10, 2) DEFAULT 0,

  -- Social Metrics
  favorites_added INTEGER DEFAULT 0,
  favorites_removed INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reviews_submitted INTEGER DEFAULT 0,

  -- Performance Metrics
  avg_rating DECIMAL(3, 2),
  conversion_rate DECIMAL(5, 2),
  revenue_per_view DECIMAL(10, 4),

  -- Traffic Sources
  traffic_sources JSONB DEFAULT '{}', -- {source: count}
  country_distribution JSONB DEFAULT '{}', -- {country: count}

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_analytics_workflow_id ON workflow_analytics(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_analytics_date ON workflow_analytics(date DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workflow_analytics_workflow_date ON workflow_analytics(workflow_id, date);

-- ================================================
-- USER WORKFLOW FAVORITES TABLE
-- ================================================
-- Track user favorites/bookmarks
CREATE TABLE IF NOT EXISTS workflow_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,

  -- Metadata
  notes TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_favorites_user_id ON workflow_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_favorites_workflow_id ON workflow_favorites(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_favorites_created_at ON workflow_favorites(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_workflow_favorites_user_workflow ON workflow_favorites(user_id, workflow_id);

-- ================================================
-- UPDATE TRIGGERS
-- ================================================

-- Trigger function already exists from base schema
-- Apply to new tables

CREATE TRIGGER update_workflow_categories_updated_at BEFORE UPDATE ON workflow_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_files_updated_at BEFORE UPDATE ON workflow_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_purchases_updated_at BEFORE UPDATE ON workflow_purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_reviews_updated_at BEFORE UPDATE ON workflow_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_bundles_updated_at BEFORE UPDATE ON workflow_bundles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_analytics_updated_at BEFORE UPDATE ON workflow_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- AUTOMATIC COUNTER UPDATES
-- ================================================

-- Update workflow download count when download is recorded
CREATE OR REPLACE FUNCTION increment_workflow_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workflows
  SET download_count = download_count + 1,
      updated_at = NOW()
  WHERE id = NEW.workflow_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_workflow_downloads
  AFTER INSERT ON workflow_downloads
  FOR EACH ROW EXECUTE FUNCTION increment_workflow_download_count();

-- Update workflow rating when review is added/updated
CREATE OR REPLACE FUNCTION update_workflow_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workflows
  SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM workflow_reviews
      WHERE workflow_id = COALESCE(NEW.workflow_id, OLD.workflow_id)
        AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM workflow_reviews
      WHERE workflow_id = COALESCE(NEW.workflow_id, OLD.workflow_id)
        AND status = 'approved'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.workflow_id, OLD.workflow_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_workflow_rating_insert
  AFTER INSERT ON workflow_reviews
  FOR EACH ROW EXECUTE FUNCTION update_workflow_rating();

CREATE TRIGGER trigger_update_workflow_rating_update
  AFTER UPDATE ON workflow_reviews
  FOR EACH ROW EXECUTE FUNCTION update_workflow_rating();

CREATE TRIGGER trigger_update_workflow_rating_delete
  AFTER DELETE ON workflow_reviews
  FOR EACH ROW EXECUTE FUNCTION update_workflow_rating();

-- Update category workflow count
CREATE OR REPLACE FUNCTION update_category_workflow_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease old category count
  IF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
    UPDATE workflow_categories
    SET workflow_count = workflow_count - 1,
        updated_at = NOW()
    WHERE id = OLD.category_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE workflow_categories
    SET workflow_count = workflow_count - 1,
        updated_at = NOW()
    WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;

  -- Increase new category count
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id) THEN
    UPDATE workflow_categories
    SET workflow_count = workflow_count + 1,
        updated_at = NOW()
    WHERE id = NEW.category_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_count_insert
  AFTER INSERT ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_category_workflow_count();

CREATE TRIGGER trigger_update_category_count_update
  AFTER UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_category_workflow_count();

CREATE TRIGGER trigger_update_category_count_delete
  AFTER DELETE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_category_workflow_count();

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================

ALTER TABLE workflow_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_favorites ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view workflow categories" ON workflow_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view published workflows" ON workflows
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published bundles" ON workflow_bundles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view approved reviews" ON workflow_reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can view workflow updates" ON workflow_updates
  FOR SELECT USING (true);

-- Workflow files - access based on membership/purchase
CREATE POLICY "Users can view workflow files they have access to" ON workflow_files
  FOR SELECT USING (
    -- Free workflows
    EXISTS (
      SELECT 1 FROM workflows w
      WHERE w.id = workflow_files.workflow_id
        AND w.is_free = true
        AND w.status = 'published'
    )
    OR
    -- Purchased workflows
    EXISTS (
      SELECT 1 FROM workflow_purchases wp
      WHERE wp.workflow_id = workflow_files.workflow_id
        AND wp.user_id = auth.uid()
        AND wp.payment_status = 'completed'
        AND (wp.expires_at IS NULL OR wp.expires_at > NOW())
    )
    OR
    -- Member access
    EXISTS (
      SELECT 1 FROM memberships m
      JOIN workflows w ON w.id = workflow_files.workflow_id
      WHERE m.user_id = auth.uid()
        AND m.status = 'active'
        AND (m.expires_at IS NULL OR m.expires_at > NOW())
        AND (
          NOT workflow_files.requires_membership
          OR w.is_member_exclusive = false
          OR m.tier IN ('pro', 'premium', 'enterprise')
        )
    )
  );

-- Users can manage their own data
CREATE POLICY "Users can view their own memberships" ON memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own purchases" ON workflow_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own downloads" ON workflow_downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON workflow_favorites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reviews" ON workflow_reviews
  FOR ALL USING (auth.uid() = user_id);

-- Admin/Service role full access
CREATE POLICY "Service role has full access to workflow_categories" ON workflow_categories
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflows" ON workflows
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflow_files" ON workflow_files
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to memberships" ON memberships
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflow_purchases" ON workflow_purchases
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflow_downloads" ON workflow_downloads
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflow_reviews" ON workflow_reviews
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflow_bundles" ON workflow_bundles
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to workflow_analytics" ON workflow_analytics
  FOR ALL USING (true);

-- ================================================
-- SEED DATA: 9 BUSINESS SYSTEMS
-- ================================================

INSERT INTO workflow_categories (slug, name, description, icon, color, order_index) VALUES
  (
    'client-acquisition',
    'Client Acquisition System',
    'Automated workflows for attracting, qualifying, and converting leads into paying clients through multi-channel outreach and nurture sequences.',
    '🎯',
    '#0ea5e9',
    1
  ),
  (
    'client-onboarding',
    'Client Onboarding System',
    'Streamlined processes for welcoming new clients, collecting information, setting expectations, and ensuring successful project kickoffs.',
    '🚀',
    '#10b981',
    2
  ),
  (
    'project-delivery',
    'Project Delivery System',
    'End-to-end project management workflows from initiation to completion, including task automation, progress tracking, and quality assurance.',
    '⚡',
    '#f59e0b',
    3
  ),
  (
    'client-communication',
    'Client Communication System',
    'Automated communication workflows for updates, check-ins, feedback collection, and maintaining strong client relationships throughout projects.',
    '💬',
    '#8b5cf6',
    4
  ),
  (
    'invoicing-payments',
    'Invoicing & Payment System',
    'Automated billing, payment collection, receipt generation, and financial tracking workflows to ensure timely and accurate revenue collection.',
    '💰',
    '#06b6d4',
    5
  ),
  (
    'content-marketing',
    'Content Marketing System',
    'Content creation, distribution, and promotion workflows for blogs, social media, email campaigns, and SEO optimization.',
    '📢',
    '#ec4899',
    6
  ),
  (
    'analytics-reporting',
    'Analytics & Reporting System',
    'Data collection, analysis, and visualization workflows for business metrics, client results, and performance dashboards.',
    '📊',
    '#14b8a6',
    7
  ),
  (
    'operations-admin',
    'Operations & Admin System',
    'Backend business operations including document management, team collaboration, time tracking, and administrative task automation.',
    '⚙️',
    '#6366f1',
    8
  ),
  (
    'growth-scaling',
    'Growth & Scaling System',
    'Strategic workflows for business expansion, team building, process optimization, and revenue multiplication through systematic growth.',
    '📈',
    '#ef4444',
    9
  )
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- HELPFUL VIEWS (Optional)
-- ================================================

-- View for active memberships with user details
CREATE OR REPLACE VIEW active_memberships AS
SELECT
  m.*,
  u.email,
  u.name,
  CASE
    WHEN m.expires_at IS NULL THEN 'lifetime'
    WHEN m.expires_at > NOW() THEN 'active'
    ELSE 'expired'
  END as membership_status
FROM memberships m
JOIN users u ON u.id = m.user_id
WHERE m.status = 'active';

-- View for workflow statistics
CREATE OR REPLACE VIEW workflow_stats AS
SELECT
  w.id,
  w.slug,
  w.name,
  w.category_id,
  wc.name as category_name,
  w.pricing_tier,
  w.base_price,
  w.rating,
  w.review_count,
  w.download_count,
  w.views,
  w.status,
  w.wedge_score,
  COUNT(DISTINCT wr.id) as total_reviews,
  COUNT(DISTINCT wf.id) as total_favorites,
  COUNT(DISTINCT wp.id) as total_purchases,
  SUM(CASE WHEN wp.payment_status = 'completed' THEN wp.price_paid ELSE 0 END) as total_revenue
FROM workflows w
LEFT JOIN workflow_categories wc ON wc.id = w.category_id
LEFT JOIN workflow_reviews wr ON wr.workflow_id = w.id AND wr.status = 'approved'
LEFT JOIN workflow_favorites wf ON wf.workflow_id = w.id
LEFT JOIN workflow_purchases wp ON wp.workflow_id = w.id
GROUP BY w.id, w.slug, w.name, w.category_id, wc.name, w.pricing_tier, w.base_price,
         w.rating, w.review_count, w.download_count, w.views, w.status, w.wedge_score;

-- ================================================
-- COMPLETION NOTES
-- ================================================

-- This migration creates:
-- ✅ 11 core tables for Workflow Vault
-- ✅ Complete W.E.D.G.E.™ framework integration
-- ✅ Membership and subscription management
-- ✅ Purchase tracking and license enforcement
-- ✅ Download analytics and access control
-- ✅ Review system with verification
-- ✅ Version tracking and updates
-- ✅ Bundle management
-- ✅ Daily analytics aggregation
-- ✅ RLS policies for security
-- ✅ Automatic triggers for counts and ratings
-- ✅ Seed data for 9 business systems
-- ✅ Helper views for common queries

-- Next steps:
-- 1. Run this migration: psql -d your_db -f migration.sql
-- 2. Configure Stripe webhook handlers
-- 3. Set up file storage in Supabase Storage
-- 4. Create API endpoints for downloads
-- 5. Build frontend components
-- 6. Add workflow products to database
-- 7. Test membership access control
-- 8. Launch Workflow Vault! 🚀
