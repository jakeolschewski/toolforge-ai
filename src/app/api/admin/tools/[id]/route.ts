// Admin API - Manage Individual Tool

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH - Update specific tool
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('tools')
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
      message: 'Tool updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update tool' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific tool
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Tool deleted successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete tool' },
      { status: 500 }
    );
  }
}
