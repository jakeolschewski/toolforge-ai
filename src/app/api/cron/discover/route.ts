// Daily Tool Discovery Cron Job
// Vercel Cron: Configure in vercel.json to run daily

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { runAllScrapers, deduplicateResults } from '@/utils/scrapers';
import { verifyCronSecret } from '@/utils/helpers';
import { sendDiscoveryDigest, sendErrorNotification } from '@/lib/email';
import { validateScraperResults } from '@/utils/validation';
import { categorizeTools } from '@/utils/ai-categorizer';
import type { ApiResponse } from '@/types';

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
    scraped: 0,
    saved: 0,
    duplicates: 0,
    errors: 0,
    invalidResults: 0,
  };

  let scraperSummary: any[] = [];

  try {
    console.log('🚀 Starting daily tool discovery...');

    // Run all scrapers with enhanced error handling
    const { results: scrapedTools, summary } = await runAllScrapers();
    scraperSummary = summary;

    results.scraped = scrapedTools.length;

    console.log(`📊 Scraping complete: ${results.scraped} tools from ${summary.length} sources`);

    // Validate all results
    const { valid, invalid } = validateScraperResults(scrapedTools);
    results.invalidResults = invalid.length;

    if (invalid.length > 0) {
      console.warn(`⚠️  Filtered ${invalid.length} invalid results`);
    }

    // Deduplicate
    const uniqueTools = deduplicateResults(valid);
    results.duplicates = valid.length - uniqueTools.length;

    console.log(`🔄 Deduplication: ${valid.length} -> ${uniqueTools.length} unique tools`);

    // Auto-categorize tools using AI
    const categorizedTools = categorizeTools(uniqueTools);
    console.log(`🤖 AI categorization complete`);

    // Save to database as pending sources
    for (const tool of categorizedTools) {
      try {
        // Check if already exists (by name or URL)
        const { data: existingByName } = await supabaseAdmin
          .from('scraped_sources')
          .select('id, status')
          .eq('tool_name', tool.tool_name)
          .maybeSingle();

        if (existingByName) {
          // Only skip if status is pending or recently processed
          if (existingByName.status === 'pending') {
            console.log(`⏭️  Already pending: ${tool.tool_name}`);
            results.duplicates++;
            continue;
          }
        }

        // Check by URL if available
        if (tool.tool_url) {
          const { data: existingByUrl } = await supabaseAdmin
            .from('scraped_sources')
            .select('id, status')
            .eq('tool_url', tool.tool_url)
            .eq('status', 'pending')
            .maybeSingle();

          if (existingByUrl) {
            console.log(`⏭️  URL already pending: ${tool.tool_url}`);
            results.duplicates++;
            continue;
          }
        }

        // Insert new scraped source
        const { error } = await supabaseAdmin.from('scraped_sources').insert({
          source_url: 'auto-discovery',
          tool_name: tool.tool_name,
          tool_url: tool.tool_url || null,
          description: tool.description || null,
          category: tool.category || 'productivity',
          raw_data: JSON.stringify(tool),
          status: 'pending',
        });

        if (error) {
          console.error(`❌ Failed to save ${tool.tool_name}:`, error.message);
          results.errors++;
        } else {
          console.log(`✅ Saved: ${tool.tool_name}`);
          results.saved++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${tool.tool_name}:`, error);
        results.errors++;
      }
    }

    const duration = Date.now() - startTime;

    const finalSummary = {
      ...results,
      duration,
      scraperDetails: scraperSummary,
    };

    console.log('✨ Discovery complete:', finalSummary);

    // Send email notification
    try {
      await sendDiscoveryDigest({
        scraped: results.scraped,
        saved: results.saved,
        duplicates: results.duplicates,
        errors: results.errors,
        duration,
      });
    } catch (emailError) {
      console.error('Failed to send discovery digest email:', emailError);
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        ...finalSummary,
        message: `Discovered ${results.saved} new tools in ${(duration / 1000).toFixed(2)}s`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Discovery failed';

    console.error('❌ Discovery cron error:', error);

    // Send error notification email
    try {
      await sendErrorNotification(errorMessage, {
        ...results,
        duration,
        scraperSummary,
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
          scraperDetails: scraperSummary,
        },
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual trigger
export async function POST(request: NextRequest) {
  console.log('Manual discovery trigger');
  return GET(request);
}
