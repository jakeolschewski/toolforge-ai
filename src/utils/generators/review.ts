// Dedicated Review Generator with Templates

import type { Tool, Review } from '@/types';
import { generateTemplateReview } from './content';

/**
 * Generate a review for a tool using templates
 * This is the main entry point for review generation
 */
export async function generateReview(tool: Tool): Promise<Partial<Review>> {
  // Use template-based generation (no AI required)
  return generateTemplateReview(tool);
}

/**
 * Generate reviews in bulk for multiple tools
 */
export async function generateReviewsForTools(tools: Tool[]): Promise<
  Array<{
    tool_id: string;
    review: Partial<Review>;
    success: boolean;
    error?: string;
  }>
> {
  const results = [];

  for (const tool of tools) {
    try {
      const review = await generateReview(tool);
      results.push({
        tool_id: tool.id,
        review,
        success: true,
      });
    } catch (error) {
      results.push({
        tool_id: tool.id,
        review: {},
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate review',
      });
    }
  }

  return results;
}

/**
 * Update an existing review with fresh content
 */
export async function refreshReview(
  tool: Tool,
  existingReview: Review
): Promise<Partial<Review>> {
  const newReview = await generateReview(tool);

  // Merge with existing review, keeping important fields
  return {
    ...newReview,
    id: existingReview.id,
    tool_id: existingReview.tool_id,
    author: existingReview.author,
    created_at: existingReview.created_at,
    // Keep existing status unless it was archived
    status: existingReview.status === 'archived' ? 'archived' : newReview.status,
  };
}

/**
 * Check if a tool needs a review
 */
export function toolNeedsReview(tool: Tool, reviews: Review[]): boolean {
  // Check if tool has any published reviews
  const hasPublishedReview = reviews.some(
    (r) => r.tool_id === tool.id && r.status === 'published'
  );

  // Check if tool has any recent draft reviews (created in last 7 days)
  const hasRecentDraft = reviews.some((r) => {
    if (r.tool_id !== tool.id || r.status !== 'draft') return false;
    const createdAt = new Date(r.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return createdAt > weekAgo;
  });

  return !hasPublishedReview && !hasRecentDraft;
}

/**
 * Get tools that need reviews generated
 */
export function getToolsNeedingReviews(tools: Tool[], reviews: Review[]): Tool[] {
  return tools.filter((tool) => {
    // Only generate for published tools
    if (tool.status !== 'published') return false;

    return toolNeedsReview(tool, reviews);
  });
}

/**
 * Estimate time to generate reviews for multiple tools
 */
export function estimateReviewGenerationTime(toolCount: number): {
  seconds: number;
  minutes: number;
  formatted: string;
} {
  // Template generation is fast, ~100ms per review
  const seconds = Math.ceil((toolCount * 100) / 1000);
  const minutes = Math.ceil(seconds / 60);

  let formatted = '';
  if (minutes > 1) {
    formatted = `~${minutes} minutes`;
  } else {
    formatted = `~${seconds} seconds`;
  }

  return { seconds, minutes, formatted };
}

/**
 * Review quality score (0-100)
 * Based on completeness of the review
 */
export function calculateReviewQualityScore(review: Partial<Review>): number {
  let score = 0;

  // Title (required) - 20 points
  if (review.title && review.title.length >= 10) score += 20;

  // Content (required) - 30 points
  if (review.content && review.content.length >= 100) {
    score += 30;
    // Bonus for longer content
    if (review.content.length >= 500) score += 5;
    if (review.content.length >= 1000) score += 5;
  }

  // Pros and cons - 10 points each
  if (review.pros_html && review.pros_html.length > 0) score += 10;
  if (review.cons_html && review.cons_html.length > 0) score += 10;

  // Verdict - 10 points
  if (review.verdict && review.verdict.length >= 50) score += 10;

  // SEO fields - 5 points each
  if (review.seo_title && review.seo_title.length > 0) score += 5;
  if (review.seo_description && review.seo_description.length > 0) score += 5;

  // Keywords - 5 points
  if (review.keywords && review.keywords.length >= 3) score += 5;

  return Math.min(100, score);
}
