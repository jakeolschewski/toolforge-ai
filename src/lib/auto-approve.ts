// Auto-Approve Scraped Sources
// Shared approval logic used by both the cron job and admin endpoint

import { supabaseAdmin } from '@/lib/supabase';
import { slugify } from '@/utils/helpers';
import { generateTemplateReview } from '@/utils/generators/content';
import type { Tool, Review, ScrapedSource } from '@/types';

export interface ApproveResult {
  tool: Tool;
  review?: Partial<Review>;
  alreadyExists?: boolean;
}

/**
 * Approve a scraped source and convert it into a published tool + optional review.
 * Used by both the auto-approve cron and the manual admin approval endpoint.
 */
export async function approveScrapedSource(
  source: ScrapedSource,
  options?: {
    autoGenerate?: boolean;
    status?: 'draft' | 'published';
  }
): Promise<ApproveResult> {
  const { autoGenerate = true, status = 'published' } = options || {};

  const slug = slugify(source.tool_name);

  // Check for duplicate slug
  const { data: existingTool } = await supabaseAdmin
    .from('tools')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existingTool) {
    // Tool already exists, mark source as processed
    await supabaseAdmin
      .from('scraped_sources')
      .update({
        status: 'processed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', source.id);

    return { tool: existingTool as unknown as Tool, alreadyExists: true };
  }

  const isPublished = status === 'published';

  const toolData: Partial<Tool> = {
    slug,
    name: source.tool_name,
    description: source.description || `${source.tool_name} - AI-powered tool`,
    category: source.category || 'productivity',
    website_url: source.tool_url || '',
    affiliate_link: source.tool_url,
    features: [],
    tags: [source.category || 'ai-tool'],
    status,
    pricing_model: 'freemium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: isPublished ? new Date().toISOString() : undefined,
  };

  // Insert tool
  const { data: newTool, error: toolError } = await supabaseAdmin
    .from('tools')
    .insert(toolData)
    .select()
    .single();

  if (toolError) throw toolError;

  // Auto-generate review if requested
  let reviewData: Partial<Review> | undefined;
  if (autoGenerate && newTool) {
    const generatedReview = generateTemplateReview(newTool as Tool);

    const { data: newReview, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        ...generatedReview,
        tool_id: newTool.id,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!reviewError && newReview) {
      reviewData = newReview;
    }
  }

  // Mark source as processed
  await supabaseAdmin
    .from('scraped_sources')
    .update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    })
    .eq('id', source.id);

  return {
    tool: newTool as Tool,
    review: reviewData,
  };
}
