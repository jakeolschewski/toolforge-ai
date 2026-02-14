// Admin Vault API - Purchases

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

// GET - List all purchases with user email and workflow title
export async function GET(_request: NextRequest) {
  try {
    // Fetch purchases with related data
    const { data: purchases, error } = await supabaseAdmin
      .from('vault_purchases')
      .select(`
        *,
        vault_workflows ( title, slug ),
        users ( email )
      `)
      .order('purchased_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Flatten the joined data for the frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flattenedPurchases = (purchases || []).map((p: any) => ({
      ...p,
      workflow_title: p.vault_workflows?.title || 'Unknown',
      workflow_slug: p.vault_workflows?.slug || '',
      user_email: p.users?.email || 'Unknown',
      // Clean up nested objects
      vault_workflows: undefined,
      users: undefined,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: flattenedPurchases,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load purchases',
      },
      { status: 500 }
    );
  }
}
