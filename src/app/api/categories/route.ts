// Public API - Fetch Categories

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, Category } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: (data || []) as Category[],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
