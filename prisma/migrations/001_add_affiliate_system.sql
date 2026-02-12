-- Multi-Affiliate Program System Migration
-- Adds support for 100+ affiliate programs with intelligent tracking

-- 1. Create affiliate_links table
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  program TEXT NOT NULL, -- amazon, shareasale, impact, cj, etc.
  url TEXT NOT NULL,
  commission_rate DECIMAL(5,4), -- e.g., 0.15 for 15%
  cookie_duration_days INTEGER,
  geo_restrictions TEXT[], -- ISO country codes
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active', -- active, expired, broken
  last_checked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tool_id, program)
);

CREATE INDEX idx_affiliate_links_tool_id ON affiliate_links(tool_id);
CREATE INDEX idx_affiliate_links_program ON affiliate_links(program);
CREATE INDEX idx_affiliate_links_status ON affiliate_links(status);
CREATE INDEX idx_affiliate_links_priority ON affiliate_links(priority DESC);

-- 2. Create affiliate_click_logs table
CREATE TABLE IF NOT EXISTS affiliate_click_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  program TEXT NOT NULL,
  tracking_id TEXT NOT NULL UNIQUE,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_affiliate_click_logs_tool_id ON affiliate_click_logs(tool_id);
CREATE INDEX idx_affiliate_click_logs_program ON affiliate_click_logs(program);
CREATE INDEX idx_affiliate_click_logs_tracking_id ON affiliate_click_logs(tracking_id);
CREATE INDEX idx_affiliate_click_logs_created_at ON affiliate_click_logs(created_at DESC);

-- 3. Create affiliate_conversions table
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  program TEXT NOT NULL,
  tracking_id TEXT NOT NULL REFERENCES affiliate_click_logs(tracking_id),
  revenue DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,4),
  commission_amount DECIMAL(10,2),
  order_id TEXT,
  product_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tracking_id)
);

CREATE INDEX idx_affiliate_conversions_tool_id ON affiliate_conversions(tool_id);
CREATE INDEX idx_affiliate_conversions_program ON affiliate_conversions(program);
CREATE INDEX idx_affiliate_conversions_tracking_id ON affiliate_conversions(tracking_id);
CREATE INDEX idx_affiliate_conversions_created_at ON affiliate_conversions(created_at DESC);

-- 4. Create affiliate_performance table (aggregated metrics)
CREATE TABLE IF NOT EXISTS affiliate_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  program TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  epc DECIMAL(10,4) DEFAULT 0, -- Earnings Per Click
  conversion_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
  avg_commission DECIMAL(10,2) DEFAULT 0,
  last_conversion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tool_id, program)
);

CREATE INDEX idx_affiliate_performance_tool_id ON affiliate_performance(tool_id);
CREATE INDEX idx_affiliate_performance_program ON affiliate_performance(program);
CREATE INDEX idx_affiliate_performance_epc ON affiliate_performance(epc DESC);
CREATE INDEX idx_affiliate_performance_conversion_rate ON affiliate_performance(conversion_rate DESC);

-- 5. Create ab_tests table (for A/B testing affiliate programs)
CREATE TABLE IF NOT EXISTS ab_tests (
  id TEXT PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  program_a TEXT NOT NULL,
  program_b TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  winner TEXT,
  program_a_clicks INTEGER DEFAULT 0,
  program_a_conversions INTEGER DEFAULT 0,
  program_a_revenue DECIMAL(10,2) DEFAULT 0,
  program_a_epc DECIMAL(10,4) DEFAULT 0,
  program_b_clicks INTEGER DEFAULT 0,
  program_b_conversions INTEGER DEFAULT 0,
  program_b_revenue DECIMAL(10,2) DEFAULT 0,
  program_b_epc DECIMAL(10,4) DEFAULT 0,
  confidence DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ab_tests_tool_id ON ab_tests(tool_id);
CREATE INDEX idx_ab_tests_started_at ON ab_tests(started_at DESC);

-- 6. Add multiple affiliate URL columns to tools table (backward compatibility)
ALTER TABLE tools ADD COLUMN IF NOT EXISTS amazon_url TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS shareasale_url TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS impact_url TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS cj_url TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS direct_url TEXT;

-- 7. Create function to increment affiliate clicks
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(
  p_tool_id UUID,
  p_program TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO affiliate_performance (tool_id, program, clicks, conversions, revenue, epc, conversion_rate, avg_commission)
  VALUES (p_tool_id, p_program, 1, 0, 0, 0, 0, 0)
  ON CONFLICT (tool_id, program)
  DO UPDATE SET
    clicks = affiliate_performance.clicks + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 8. Create function to record affiliate conversion
CREATE OR REPLACE FUNCTION record_affiliate_conversion(
  p_tool_id UUID,
  p_program TEXT,
  p_revenue DECIMAL
)
RETURNS VOID AS $$
DECLARE
  v_clicks INTEGER;
  v_conversions INTEGER;
  v_total_revenue DECIMAL;
BEGIN
  -- Get current stats
  SELECT clicks, conversions, revenue
  INTO v_clicks, v_conversions, v_total_revenue
  FROM affiliate_performance
  WHERE tool_id = p_tool_id AND program = p_program;

  -- Update performance
  UPDATE affiliate_performance
  SET
    conversions = conversions + 1,
    revenue = revenue + p_revenue,
    epc = (revenue + p_revenue) / NULLIF(clicks, 0),
    conversion_rate = ((conversions + 1)::DECIMAL / NULLIF(clicks, 0)) * 100,
    avg_commission = (revenue + p_revenue) / NULLIF(conversions + 1, 0),
    last_conversion = NOW(),
    updated_at = NOW()
  WHERE tool_id = p_tool_id AND program = p_program;
END;
$$ LANGUAGE plpgsql;

-- 9. Create function to calculate program EPC
CREATE OR REPLACE FUNCTION calculate_program_epc(
  p_program TEXT,
  p_days INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
  v_epc DECIMAL;
BEGIN
  SELECT
    COALESCE(SUM(revenue) / NULLIF(SUM(clicks), 0), 0)
  INTO v_epc
  FROM affiliate_performance
  WHERE program = p_program
    AND updated_at >= NOW() - (p_days || ' days')::INTERVAL;

  RETURN v_epc;
END;
$$ LANGUAGE plpgsql;

-- 10. Create function to get top performing affiliate programs
CREATE OR REPLACE FUNCTION get_top_performing_programs(
  p_limit INTEGER DEFAULT 10,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  program TEXT,
  total_clicks INTEGER,
  total_conversions INTEGER,
  total_revenue DECIMAL,
  avg_epc DECIMAL,
  avg_conversion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ap.program,
    SUM(ap.clicks)::INTEGER as total_clicks,
    SUM(ap.conversions)::INTEGER as total_conversions,
    SUM(ap.revenue) as total_revenue,
    AVG(ap.epc) as avg_epc,
    AVG(ap.conversion_rate) as avg_conversion_rate
  FROM affiliate_performance ap
  WHERE ap.updated_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY ap.program
  ORDER BY avg_epc DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 11. Create function to get tool performance breakdown
CREATE OR REPLACE FUNCTION get_tool_affiliate_performance(
  p_tool_id UUID
)
RETURNS TABLE(
  program TEXT,
  clicks INTEGER,
  conversions INTEGER,
  revenue DECIMAL,
  epc DECIMAL,
  conversion_rate DECIMAL,
  avg_commission DECIMAL,
  last_conversion TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ap.program,
    ap.clicks,
    ap.conversions,
    ap.revenue,
    ap.epc,
    ap.conversion_rate,
    ap.avg_commission,
    ap.last_conversion
  FROM affiliate_performance ap
  WHERE ap.tool_id = p_tool_id
  ORDER BY ap.epc DESC;
END;
$$ LANGUAGE plpgsql;

-- 12. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_links_updated_at
  BEFORE UPDATE ON affiliate_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_performance_updated_at
  BEFORE UPDATE ON affiliate_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 13. Create view for affiliate performance dashboard
CREATE OR REPLACE VIEW affiliate_dashboard AS
SELECT
  t.id as tool_id,
  t.name as tool_name,
  t.category,
  ap.program,
  ap.clicks,
  ap.conversions,
  ap.revenue,
  ap.epc,
  ap.conversion_rate,
  ap.avg_commission,
  ap.last_conversion,
  al.url as affiliate_url,
  al.commission_rate,
  al.status as link_status
FROM tools t
LEFT JOIN affiliate_performance ap ON t.id = ap.tool_id
LEFT JOIN affiliate_links al ON t.id = al.tool_id AND ap.program = al.program
WHERE t.status = 'published'
ORDER BY ap.epc DESC NULLS LAST;

-- 14. Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON affiliate_links TO authenticated;
-- GRANT SELECT, INSERT ON affiliate_click_logs TO authenticated;
-- GRANT SELECT, INSERT ON affiliate_conversions TO authenticated;
-- GRANT SELECT ON affiliate_performance TO authenticated;
-- GRANT SELECT ON affiliate_dashboard TO authenticated;

-- Migration complete!
-- Now run: npx prisma db pull to sync the Prisma schema
