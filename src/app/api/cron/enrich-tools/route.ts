// Daily Tool Enrichment Cron Job
// Uses Claude to enhance sparse tool data (descriptions, features, tags)
// Schedule: 0 6 * * * (6am daily, after 2am discovery)

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { needsEnrichment, enrichAndSaveTool } from '@/lib/tool-enricher';
import { verifyCronSecret } from '@/utils/helpers';
import type { ApiResponse, Tool } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_TOOLS_PER_RUN = 10;

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const results = { enriched: 0, skipped: 0, errors: 0 };

  try {
    console.log('Starting tool enrichment...');

    // Find published tools that need enrichment
    const { data: tools, error } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !tools) {
      throw new Error(`Failed to fetch tools: ${error?.message}`);
    }

    // Filter to tools that actually need enrichment
    const sparseTools = (tools as Tool[]).filter(needsEnrichment).slice(0, MAX_TOOLS_PER_RUN);

    console.log(`Found ${sparseTools.length} tools needing enrichment`);

    for (const tool of sparseTools) {
      try {
        const result = await enrichAndSaveTool(tool);
        if (result.updated) {
          console.log(`Enriched ${tool.name}: ${result.fields.join(', ')}`);
          results.enriched++;
        } else {
          results.skipped++;
        }
      } catch (err) {
        console.error(`Failed to enrich ${tool.name}:`, err);
        results.errors++;
      }
    }

    const duration = Date.now() - startTime;
    console.log(`Enrichment complete: ${results.enriched} enriched, ${results.skipped} skipped, ${results.errors} errors in ${(duration / 1000).toFixed(1)}s`);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        ...results,
        duration,
        message: `Enriched ${results.enriched} tools in ${(duration / 1000).toFixed(1)}s`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Enrichment failed';
    console.error('Enrichment cron error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: errorMessage, data: { ...results, duration } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
