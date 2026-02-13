// Admin Vault API - Memberships

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

// GET - List all memberships with user email
export async function GET(request: NextRequest) {
  try {
    const { data: memberships, error } = await supabaseAdmin
      .from('vault_memberships')
      .select(`
        *,
        users ( email )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Flatten the joined data for the frontend
    const flattenedMemberships = (memberships || []).map((m: any) => ({
      ...m,
      user_email: m.users?.email || 'Unknown',
      users: undefined,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: flattenedMemberships,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load memberships',
      },
      { status: 500 }
    );
  }
}
