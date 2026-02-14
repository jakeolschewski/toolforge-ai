// Workflow Vault API - List Categories

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, VaultCategory } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('vault_categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: (data || []) as VaultCategory[],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
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
