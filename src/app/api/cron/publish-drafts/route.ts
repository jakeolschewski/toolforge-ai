// Auto-Publish Drafts and Generate Reviews Cron Job
// Vercel Cron: Configure in vercel.json to run daily

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyCronSecret } from '@/utils/helpers';
import { sendApprovalReminder, sendErrorNotification } from '@/lib/email';
import { generateReview, getToolsNeedingReviews } from '@/utils/generators/review';
import type { ApiResponse, Tool, Review } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for Hobby plan

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  if (!verifyCronSecret(request)) {
    console.warn('Unauthorized cron attempt');
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const results = {
    toolsPublished: 0,
    reviewsGenerated: 0,
    errors: 0,
    pendingReminder: false,
  };

  try {
    console.log('🚀 Starting auto-publish and review generation...');

    // Step 1: Auto-publish approved draft tools
    const publishResults = await autoPublishApprovedDrafts();
    results.toolsPublished = publishResults.published;
    results.errors += publishResults.errors;

    console.log(`📤 Published ${results.toolsPublished} tools`);

    // Step 2: Generate reviews for published tools without reviews
    const reviewResults = await generateMissingReviews();
    results.reviewsGenerated = reviewResults.generated;
    results.errors += reviewResults.errors;

    console.log(`📝 Generated ${results.reviewsGenerated} reviews`);

    // Step 3: Send approval reminders if there are pending items
    const pendingCount = await checkPendingApprovals();
    if (pendingCount > 0) {
      results.pendingReminder = true;
      await sendApprovalReminder({
        pendingCount,
        oldestPendingDate: await getOldestPendingDate(),
      });
      console.log(`📧 Sent approval reminder for ${pendingCount} pending items`);
    }

    // Step 4: Update sitemap (if implemented)
    // await updateSitemap();

    const duration = Date.now() - startTime;

    const summary = {
      ...results,
      duration,
    };

    console.log('✨ Auto-publish complete:', summary);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        ...summary,
        message: `Published ${results.toolsPublished} tools, generated ${results.reviewsGenerated} reviews`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Auto-publish failed';

    console.error('❌ Auto-publish cron error:', error);

    // Send error notification email
    try {
      await sendErrorNotification(errorMessage, {
        ...results,
        duration,
      });
    } catch (emailError) {
      console.error('Failed to send error notification email:', emailError);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: errorMessage,
        data: {
          ...results,
          duration,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Auto-publish approved draft tools
 */
async function autoPublishApprovedDrafts(): Promise<{
  published: number;
  errors: number;
}> {
  const result = { published: 0, errors: 0 };

  try {
    // Get draft tools that are marked as featured (auto-approval flag)
    // Or draft tools older than X days (configurable)
    const autoPublishDays = parseInt(process.env.AUTO_PUBLISH_DAYS || '7', 10);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - autoPublishDays);

    const { data: drafts, error: fetchError } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'draft')
      .or(`is_featured.eq.true,created_at.lt.${cutoffDate.toISOString()}`)
      .limit(10); // Process max 10 per run

    if (fetchError) {
      console.error('Error fetching drafts:', fetchError);
      result.errors++;
      return result;
    }

    if (!drafts || drafts.length === 0) {
      console.log('No draft tools ready for auto-publish');
      return result;
    }

    console.log(`Found ${drafts.length} draft tools to publish`);

    for (const tool of drafts) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from('tools')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`Failed to publish ${tool.name}:`, updateError);
          result.errors++;
        } else {
          console.log(`✅ Published: ${tool.name}`);
          result.published++;
        }
      } catch (error) {
        console.error(`Error publishing ${tool.name}:`, error);
        result.errors++;
      }
    }
  } catch (error) {
    console.error('Error in autoPublishApprovedDrafts:', error);
    result.errors++;
  }

  return result;
}

/**
 * Generate reviews for tools that don't have one
 */
async function generateMissingReviews(): Promise<{
  generated: number;
  errors: number;
}> {
  const result = { generated: 0, errors: 0 };

  try {
    // Get published tools
    const { data: tools, error: toolsError } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20); // Process max 20 per run

    if (toolsError || !tools) {
      console.error('Error fetching tools:', toolsError);
      result.errors++;
      return result;
    }

    // Get all reviews
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select('*');

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      result.errors++;
      return result;
    }

    // Find tools needing reviews
    const toolsNeedingReviews = getToolsNeedingReviews(
      tools as Tool[],
      (reviews || []) as Review[]
    );

    console.log(`${toolsNeedingReviews.length} tools need reviews`);

    // Generate reviews (limit to 5 per run to stay within time limits)
    for (const tool of toolsNeedingReviews.slice(0, 5)) {
      try {
        console.log(`Generating review for: ${tool.name}`);

        const reviewData = await generateReview(tool);

        const { error: insertError } = await supabaseAdmin.from('reviews').insert({
          tool_id: tool.id,
          ...reviewData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error(`Failed to save review for ${tool.name}:`, insertError);
          result.errors++;
        } else {
          console.log(`✅ Generated review for: ${tool.name}`);
          result.generated++;
        }
      } catch (error) {
        console.error(`Error generating review for ${tool.name}:`, error);
        result.errors++;
      }
    }
  } catch (error) {
    console.error('Error in generateMissingReviews:', error);
    result.errors++;
  }

  return result;
}

/**
 * Check for pending approvals
 */
async function checkPendingApprovals(): Promise<number> {
  try {
    // Count pending scraped sources
    const { count: scrapedCount } = await supabaseAdmin
      .from('scraped_sources')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Count draft tools
    const { count: draftCount } = await supabaseAdmin
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    return (scrapedCount || 0) + (draftCount || 0);
  } catch (error) {
    console.error('Error checking pending approvals:', error);
    return 0;
  }
}

/**
 * Get oldest pending date
 */
async function getOldestPendingDate(): Promise<string | undefined> {
  try {
    const { data } = await supabaseAdmin
      .from('scraped_sources')
      .select('created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    return data?.created_at;
  } catch (error) {
    return undefined;
  }
}

// POST endpoint for manual trigger
export async function POST(request: NextRequest) {
  console.log('Manual auto-publish trigger');
  return GET(request);
}
