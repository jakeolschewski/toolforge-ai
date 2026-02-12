-- Add share_events table for tracking social shares
CREATE TABLE IF NOT EXISTS share_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_share_events_platform ON share_events(platform);
CREATE INDEX IF NOT EXISTS idx_share_events_shared_at ON share_events(shared_at);
CREATE INDEX IF NOT EXISTS idx_share_events_url ON share_events(url);

-- Add ad_impressions table for tracking display ads
CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_slot TEXT NOT NULL,
  position TEXT NOT NULL,
  page_url TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_slot ON ad_impressions(ad_slot);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_viewed_at ON ad_impressions(viewed_at);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_page_url ON ad_impressions(page_url);

-- Add ad_clicks table for tracking ad clicks
CREATE TABLE IF NOT EXISTS ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_slot TEXT NOT NULL,
  position TEXT NOT NULL,
  page_url TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_ad_clicks_ad_slot ON ad_clicks(ad_slot);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_clicked_at ON ad_clicks(clicked_at);

-- Add social_proof stats to tools table (if not exists)
ALTER TABLE tools ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

-- Function to update tool stats
CREATE OR REPLACE FUNCTION update_tool_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update share count when share event is logged
  IF TG_TABLE_NAME = 'share_events' THEN
    UPDATE tools
    SET share_count = share_count + 1
    WHERE website = NEW.url OR slug = split_part(NEW.url, '/', -1);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update tool stats
DROP TRIGGER IF EXISTS trigger_update_tool_stats ON share_events;
CREATE TRIGGER trigger_update_tool_stats
AFTER INSERT ON share_events
FOR EACH ROW
EXECUTE FUNCTION update_tool_stats();

-- Function to calculate trending tools (last 7 days)
CREATE OR REPLACE FUNCTION update_trending_tools()
RETURNS void AS $$
BEGIN
  -- Reset all trending flags
  UPDATE tools SET is_trending = FALSE;

  -- Mark top 10 most viewed/shared tools in last 7 days as trending
  WITH trending AS (
    SELECT t.id
    FROM tools t
    LEFT JOIN share_events se ON se.url LIKE '%' || t.slug || '%'
      AND se.shared_at > NOW() - INTERVAL '7 days'
    GROUP BY t.id, t.view_count
    ORDER BY (COUNT(se.id) + t.view_count) DESC
    LIMIT 10
  )
  UPDATE tools
  SET is_trending = TRUE
  WHERE id IN (SELECT id FROM trending);
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON share_events TO postgres, anon, authenticated, service_role;
GRANT ALL ON ad_impressions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ad_clicks TO postgres, anon, authenticated, service_role;

-- Row Level Security
ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;

-- Allow public read, authenticated write
CREATE POLICY "Public read share_events" ON share_events FOR SELECT USING (true);
CREATE POLICY "Authenticated insert share_events" ON share_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read ad_impressions" ON ad_impressions FOR SELECT USING (true);
CREATE POLICY "Authenticated insert ad_impressions" ON ad_impressions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read ad_clicks" ON ad_clicks FOR SELECT USING (true);
CREATE POLICY "Authenticated insert ad_clicks" ON ad_clicks FOR INSERT WITH CHECK (true);
