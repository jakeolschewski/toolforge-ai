// Database optimization utilities and query helpers
// Improves Supabase query performance with proper indexes and query patterns

import { supabase, supabaseAdmin } from './supabase';
import { cachedQuery, CacheKeys, CacheTTL } from './cache';
import type { Tool, Review, Category } from '@/types';

// Optimized queries with caching and pagination

/**
 * Get tools with optimized query and caching
 */
export async function getToolsOptimized(options: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  status?: 'published' | 'draft';
  sortBy?: 'rating' | 'created_at' | 'views' | 'name';
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const {
    page = 1,
    limit = 20,
    category,
    featured,
    status = 'published',
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  const offset = (page - 1) * limit;
  const cacheKey = CacheKeys.tools(
    page,
    limit,
    `${category || 'all'}_${featured ? 'featured' : 'all'}_${sortBy}_${sortOrder}`
  );

  return cachedQuery(
    cacheKey,
    async () => {
      let query = supabase
        .from('tools')
        .select('*', { count: 'exact' })
        .eq('status', status);

      if (category) {
        query = query.eq('category', category);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        tools: (data || []) as Tool[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },
    CacheTTL.MEDIUM
  );
}

/**
 * Get single tool with reviews (cached)
 */
export async function getToolWithReviews(slug: string) {
  const cacheKey = CacheKeys.tool(slug);

  return cachedQuery(
    cacheKey,
    async () => {
      // Fetch tool
      const { data: tool, error: toolError } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (toolError || !tool) return null;

      // Fetch reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('tool_id', tool.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      return {
        tool: tool as Tool,
        reviews: (reviews || []) as Review[],
      };
    },
    CacheTTL.LONG
  );
}

/**
 * Get featured tools (heavily cached)
 */
export async function getFeaturedToolsOptimized(limit: number = 6) {
  return cachedQuery(
    CacheKeys.featuredTools(),
    async () => {
      const { data } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      return (data || []) as Tool[];
    },
    CacheTTL.LONG
  );
}

/**
 * Get latest tools (cached)
 */
export async function getLatestToolsOptimized(limit: number = 8) {
  return cachedQuery(
    CacheKeys.latestTools(),
    async () => {
      const { data } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      return (data || []) as Tool[];
    },
    CacheTTL.MEDIUM
  );
}

/**
 * Get tools by category (cached)
 */
export async function getToolsByCategory(category: string, page: number = 1, limit: number = 20) {
  const cacheKey = CacheKeys.toolsByCategory(category, page);

  return cachedQuery(
    cacheKey,
    async () => {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('tools')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .eq('category', category)
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        tools: (data || []) as Tool[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },
    CacheTTL.MEDIUM
  );
}

/**
 * Increment tool views (async, no await needed)
 */
export async function incrementToolViews(toolId: string) {
  // Fire and forget - don't block the request
  supabaseAdmin
    .rpc('increment_tool_views', { tool_id: toolId })
    .then(({ error }: any) => {
      if (error) console.error('Failed to increment views:', error);
    });
}

/**
 * Batch fetch tools by IDs (for collections, comparisons, etc.)
 */
export async function getToolsByIds(toolIds: string[]) {
  if (toolIds.length === 0) return [];

  const { data } = await supabase
    .from('tools')
    .select('*')
    .in('id', toolIds)
    .eq('status', 'published');

  return (data || []) as Tool[];
}

/**
 * Get categories with tool counts
 */
export async function getCategoriesWithCounts() {
  return cachedQuery(
    CacheKeys.categories(),
    async () => {
      // This would ideally use a materialized view or aggregation
      const { data: tools } = await supabase
        .from('tools')
        .select('category')
        .eq('status', 'published');

      const counts: Record<string, number> = {};
      (tools || []).forEach((tool) => {
        counts[tool.category] = (counts[tool.category] || 0) + 1;
      });

      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    },
    CacheTTL.HOUR
  );
}

// SQL migration for creating indexes (run manually)
export const DATABASE_INDEXES = `
-- Indexes for tools table
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_views ON tools(views DESC);
CREATE INDEX IF NOT EXISTS idx_tools_status_category ON tools(status, category);
CREATE INDEX IF NOT EXISTS idx_tools_status_featured ON tools(status, is_featured);

-- Indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_status ON reviews(tool_id, status);

-- Indexes for blog_posts table (if exists)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tools_lookup ON tools(status, category, is_featured, rating DESC);

-- Function to increment views efficiently
CREATE OR REPLACE FUNCTION increment_tool_views(tool_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tools SET views = views + 1 WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Materialized view for analytics (optional, for better performance)
export const MATERIALIZED_VIEWS = `
-- Materialized view for category statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS category_stats AS
SELECT
  category,
  COUNT(*) as tool_count,
  AVG(rating) as avg_rating,
  SUM(views) as total_views
FROM tools
WHERE status = 'published'
GROUP BY category;

-- Index on materialized view
CREATE INDEX IF NOT EXISTS idx_category_stats_category ON category_stats(category);

-- Refresh function (call this periodically, e.g., via cron)
CREATE OR REPLACE FUNCTION refresh_category_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY category_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
