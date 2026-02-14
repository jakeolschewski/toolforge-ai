// Workflow Vault API - Get/Update/Delete Single Workflow

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, VaultWorkflow } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Fetch workflow with category information
    const { data: workflow, error } = await supabase
      .from('vault_workflows')
      .select('*, vault_categories!inner(name, slug)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !workflow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Transform data
    const transformedWorkflow = {
      ...workflow,
      category_name: workflow.vault_categories?.name,
      vault_categories: undefined,
    } as VaultWorkflow;

    // Increment view count (fire and forget)
    supabaseAdmin.rpc('increment_counter', {
      row_id: workflow.id,
      table_name: 'vault_workflows',
      column_name: 'view_count',
    }).then(() => {}, () => {
      // Fallback: direct update if RPC doesn't exist
      supabaseAdmin
        .from('vault_workflows')
        .update({ view_count: (workflow.view_count || 0) + 1 })
        .eq('id', workflow.id)
        .then(() => {}, console.error);
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: transformedWorkflow,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch workflow',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Get existing workflow
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('vault_workflows')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Build update object (only update provided fields)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    const allowedFields = [
      'title',
      'description',
      'long_description',
      'category_id',
      'thumbnail_url',
      'preview_images',
      'file_url',
      'file_type',
      'file_size',
      'pricing_type',
      'price',
      'currency',
      'stripe_product_id',
      'stripe_price_id',
      'tags',
      'difficulty_level',
      'estimated_time',
      'requirements',
      'features',
      'use_cases',
      'author',
      'author_avatar',
      'version',
      'status',
      'is_featured',
      'seo_title',
      'seo_description',
      'keywords',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // If status changes to published, set published_at
    if (body.status === 'published' && existing.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('vault_workflows')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
      message: 'Workflow updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update workflow',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Soft delete - set status to archived
    const { error } = await supabaseAdmin
      .from('vault_workflows')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Workflow deleted successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete workflow',
      },
      { status: 500 }
    );
  }
}
