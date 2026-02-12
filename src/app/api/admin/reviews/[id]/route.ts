// Admin API - Manage Individual Review

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH - Update specific review
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Review ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
      message: 'Review updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific review
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Review ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete review' },
      { status: 500 }
    );
  }
}
