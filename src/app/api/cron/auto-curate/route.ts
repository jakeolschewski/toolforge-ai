// Weekly Auto-Curation Cron Job
// Creates collections and comparisons automatically
// Schedule: 0 16 * * 1 (4pm every Monday)

import { NextRequest, NextResponse } from 'next/server';
import { generateAutoCollections } from '@/lib/auto-collections';
import { generateAutoComparisons } from '@/lib/auto-comparisons';
import { verifyCronSecret } from '@/utils/helpers';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();

  try {
    console.log('Starting auto-curation...');

    // Generate collections first
    console.log('Generating auto-collections...');
    const collections = await generateAutoCollections();
    console.log(`Collections: ${collections.created} created, ${collections.skipped} skipped`);

    // Then generate comparisons
    console.log('Generating auto-comparisons...');
    const comparisons = await generateAutoComparisons();
    console.log(`Comparisons: ${comparisons.created} created, ${comparisons.skipped} skipped`);

    const duration = Date.now() - startTime;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        collections,
        comparisons,
        duration,
        message: `Created ${collections.created} collections and ${comparisons.created} comparisons in ${(duration / 1000).toFixed(1)}s`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Auto-curation failed';
    console.error('Auto-curation cron error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: errorMessage, data: { duration } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
