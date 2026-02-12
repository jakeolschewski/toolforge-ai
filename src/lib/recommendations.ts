/**
 * AI-Powered Recommendation Engine for ToolForge AI
 *
 * Features:
 * - Content-based filtering using tool descriptions, features, and categories
 * - Collaborative filtering based on user behavior patterns
 * - Hybrid recommendations combining multiple signals
 * - Trending and rising star detection
 * - Personalized recommendations based on browsing history
 */

import { supabase } from './supabase';
import type { Tool } from '@/types';

// Types for recommendation system
export interface RecommendationScore {
  toolId: string;
  score: number;
  reason: string;
}

export interface UserBrowsingHistory {
  viewedTools: string[];
  clickedTools: string[];
  lastViewed: string;
  categories: string[];
  pricingPreferences: string[];
}

export interface TrendingTool extends Tool {
  trendScore: number;
  growthRate: number;
}

// Constants
const SIMILARITY_WEIGHTS = {
  category: 0.3,
  pricing: 0.15,
  features: 0.35,
  tags: 0.2,
};

const TRENDING_WINDOW_DAYS = 7;
const RISING_STAR_MIN_VIEWS = 50;
const RECOMMENDATION_LIMIT = 6;

/**
 * Get personalized recommendations for a user based on their browsing history
 */
export async function getPersonalizedRecommendations(
  history: UserBrowsingHistory,
  limit: number = RECOMMENDATION_LIMIT
): Promise<Tool[]> {
  try {
    // Get all tools to analyze
    const { data: allTools, error } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error || !allTools) {
      console.error('Error fetching tools for recommendations:', error);
      return [];
    }

    // Filter out already viewed tools
    const unseenTools = allTools.filter(
      tool => !history.viewedTools.includes(tool.id) && !history.clickedTools.includes(tool.id)
    );

    // Score each unseen tool based on user preferences
    const scoredTools = unseenTools.map(tool => {
      let score = 0;

      // Category match (strongest signal)
      if (history.categories.includes(tool.category)) {
        score += 0.4;
      }

      // Pricing preference match
      if (history.pricingPreferences.includes(tool.pricing_model)) {
        score += 0.2;
      }

      // Quality signals
      score += (tool.rating / 5) * 0.2;
      score += Math.min(tool.review_count / 100, 0.1);

      // Recency boost
      const daysSincePublished = getDaysSince(tool.published_at || tool.created_at);
      if (daysSincePublished < 30) {
        score += 0.1;
      }

      // Featured/Sponsored boost
      if (tool.is_featured) score += 0.05;

      return { tool, score };
    });

    // Sort by score and return top recommendations
    return scoredTools
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tool);
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    return [];
  }
}

/**
 * Get similar tools based on content-based filtering
 * Uses category, features, pricing, and tags similarity
 */
export async function getSimilarTools(
  tool: Tool,
  limit: number = RECOMMENDATION_LIMIT
): Promise<Tool[]> {
  try {
    // Get all published tools except the current one
    const { data: allTools, error } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .neq('id', tool.id);

    if (error || !allTools) {
      console.error('Error fetching similar tools:', error);
      return [];
    }

    // Calculate similarity scores
    const scoredTools = allTools.map(otherTool => {
      const similarityScore = calculateSimilarity(tool, otherTool);
      return { tool: otherTool, score: similarityScore };
    });

    // Sort by similarity and return top matches
    return scoredTools
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tool);
  } catch (error) {
    console.error('Error finding similar tools:', error);
    return [];
  }
}

/**
 * Calculate similarity score between two tools
 */
function calculateSimilarity(tool1: Tool, tool2: Tool): number {
  let score = 0;

  // Category similarity (exact match or subcategory match)
  if (tool1.category === tool2.category) {
    score += SIMILARITY_WEIGHTS.category;
    if (tool1.subcategory && tool1.subcategory === tool2.subcategory) {
      score += 0.1; // Bonus for subcategory match
    }
  }

  // Pricing model similarity
  if (tool1.pricing_model === tool2.pricing_model) {
    score += SIMILARITY_WEIGHTS.pricing;
  }

  // Feature similarity (Jaccard index)
  const featureSimilarity = calculateJaccardSimilarity(
    tool1.features,
    tool2.features
  );
  score += SIMILARITY_WEIGHTS.features * featureSimilarity;

  // Tag similarity (Jaccard index)
  const tagSimilarity = calculateJaccardSimilarity(
    tool1.tags,
    tool2.tags
  );
  score += SIMILARITY_WEIGHTS.tags * tagSimilarity;

  return score;
}

/**
 * Calculate Jaccard similarity between two sets
 */
function calculateJaccardSimilarity(set1: string[], set2: string[]): number {
  if (set1.length === 0 && set2.length === 0) return 0;
  if (set1.length === 0 || set2.length === 0) return 0;

  const intersection = set1.filter(item => set2.includes(item)).length;
  const union = new Set([...set1, ...set2]).size;

  return intersection / union;
}

/**
 * Get collaborative filtering recommendations
 * "Users who viewed X also viewed Y"
 */
export async function getCollaborativeRecommendations(
  toolId: string,
  limit: number = RECOMMENDATION_LIMIT
): Promise<Tool[]> {
  try {
    // Query: Find tools that were viewed in the same sessions as the target tool
    // This requires analyzing click_logs table
    const { data: relatedClicks, error } = await supabase.rpc(
      'get_collaborative_recommendations',
      {
        target_tool_id: toolId,
        result_limit: limit
      }
    );

    if (error) {
      console.error('Collaborative filtering error:', error);
      // Fall back to similar tools if RPC fails
      const { data: tool } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single();

      if (tool) {
        return getSimilarTools(tool, limit);
      }
      return [];
    }

    return relatedClicks || [];
  } catch (error) {
    console.error('Error in collaborative recommendations:', error);
    return [];
  }
}

/**
 * Get trending tools (most viewed in the last week)
 */
export async function getTrendingTools(limit: number = 10): Promise<TrendingTool[]> {
  try {
    const { data: trendingData, error } = await supabase.rpc(
      'get_trending_tools',
      {
        days: TRENDING_WINDOW_DAYS,
        result_limit: limit
      }
    );

    if (error) {
      console.error('Error fetching trending tools:', error);
      // Fallback to most viewed tools
      const { data: fallbackTools } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(limit);

      return (fallbackTools || []).map(tool => ({
        ...tool,
        trendScore: tool.views,
        growthRate: 0
      }));
    }

    return trendingData || [];
  } catch (error) {
    console.error('Error getting trending tools:', error);
    return [];
  }
}

/**
 * Get rising star tools (fastest growing in views)
 */
export async function getRisingStarTools(limit: number = 10): Promise<TrendingTool[]> {
  try {
    const { data: risingStars, error } = await supabase.rpc(
      'get_rising_star_tools',
      {
        days: TRENDING_WINDOW_DAYS,
        min_views: RISING_STAR_MIN_VIEWS,
        result_limit: limit
      }
    );

    if (error) {
      console.error('Error fetching rising stars:', error);
      // Fallback to recently published high-rated tools
      const { data: fallbackTools } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'published')
        .gte('rating', 4.0)
        .order('published_at', { ascending: false })
        .limit(limit);

      return (fallbackTools || []).map(tool => ({
        ...tool,
        trendScore: tool.rating * 20,
        growthRate: 100
      }));
    }

    return risingStars || [];
  } catch (error) {
    console.error('Error getting rising stars:', error);
    return [];
  }
}

/**
 * Get alternative tools (direct competitors)
 */
export async function getAlternativeTools(
  tool: Tool,
  limit: number = 5
): Promise<Tool[]> {
  try {
    // Alternatives are tools in the same category with similar pricing
    const { data: alternatives, error } = await supabase
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .eq('category', tool.category)
      .neq('id', tool.id)
      .order('rating', { ascending: false })
      .limit(limit * 2); // Get more to filter

    if (error || !alternatives) {
      return [];
    }

    // Prioritize same pricing model
    const samePricing = alternatives.filter(
      alt => alt.pricing_model === tool.pricing_model
    );
    const differentPricing = alternatives.filter(
      alt => alt.pricing_model !== tool.pricing_model
    );

    return [...samePricing, ...differentPricing].slice(0, limit);
  } catch (error) {
    console.error('Error finding alternatives:', error);
    return [];
  }
}

/**
 * Get hybrid recommendations combining multiple strategies
 */
export async function getHybridRecommendations(
  tool: Tool,
  userHistory?: UserBrowsingHistory,
  limit: number = RECOMMENDATION_LIMIT
): Promise<Tool[]> {
  try {
    // Run multiple recommendation strategies in parallel
    const [similar, collaborative, personalized] = await Promise.all([
      getSimilarTools(tool, limit),
      getCollaborativeRecommendations(tool.id, limit),
      userHistory ? getPersonalizedRecommendations(userHistory, limit) : Promise.resolve([])
    ]);

    // Combine and deduplicate results
    const allRecommendations = new Map<string, { tool: Tool; score: number }>();

    // Content-based similarity (weight: 0.4)
    similar.forEach((t, index) => {
      const score = (1 - index / limit) * 0.4;
      allRecommendations.set(t.id, { tool: t, score });
    });

    // Collaborative filtering (weight: 0.4)
    collaborative.forEach((t, index) => {
      const score = (1 - index / limit) * 0.4;
      const existing = allRecommendations.get(t.id);
      if (existing) {
        existing.score += score;
      } else {
        allRecommendations.set(t.id, { tool: t, score });
      }
    });

    // Personalized recommendations (weight: 0.2)
    personalized.forEach((t, index) => {
      const score = (1 - index / limit) * 0.2;
      const existing = allRecommendations.get(t.id);
      if (existing) {
        existing.score += score;
      } else {
        allRecommendations.set(t.id, { tool: t, score });
      }
    });

    // Sort by combined score and return top recommendations
    return Array.from(allRecommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tool);
  } catch (error) {
    console.error('Error generating hybrid recommendations:', error);
    return [];
  }
}

/**
 * Track recommendation click for analytics
 */
export async function trackRecommendationClick(
  recommendedToolId: string,
  sourceToolId: string,
  recommendationType: string
): Promise<void> {
  try {
    await supabase.from('recommendation_clicks').insert({
      recommended_tool_id: recommendedToolId,
      source_tool_id: sourceToolId,
      recommendation_type: recommendationType,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking recommendation click:', error);
  }
}

/**
 * Get recommendation performance metrics
 */
export async function getRecommendationMetrics(days: number = 30): Promise<{
  totalClicks: number;
  clickThroughRate: number;
  byType: Record<string, { clicks: number; impressions: number; ctr: number }>;
}> {
  try {
    const { data, error } = await supabase.rpc('get_recommendation_metrics', {
      days
    });

    if (error) {
      console.error('Error fetching recommendation metrics:', error);
      return {
        totalClicks: 0,
        clickThroughRate: 0,
        byType: {}
      };
    }

    return data || { totalClicks: 0, clickThroughRate: 0, byType: {} };
  } catch (error) {
    console.error('Error getting recommendation metrics:', error);
    return {
      totalClicks: 0,
      clickThroughRate: 0,
      byType: {}
    };
  }
}

// Utility functions

function getDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Extract user preferences from browsing history
 */
export function extractUserPreferences(history: UserBrowsingHistory): {
  topCategories: string[];
  preferredPricing: string[];
  averageRating: number;
} {
  const categoryCount: Record<string, number> = {};
  const pricingCount: Record<string, number> = {};

  history.categories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  history.pricingPreferences.forEach(price => {
    pricingCount[price] = (pricingCount[price] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  const preferredPricing = Object.entries(pricingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0]);

  return {
    topCategories,
    preferredPricing,
    averageRating: 0
  };
}
