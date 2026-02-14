// Workflow Vault API - Favorite/Unfavorite Workflows

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

// Get user's favorite workflows
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Fetch favorites with workflow details
    const { data, error, count } = await supabaseAdmin
      .from('vault_favorites')
      .select(
        `
        *,
        vault_workflows!inner(
          id,
          slug,
          title,
          description,
          thumbnail_url,
          pricing_type,
          price,
          currency,
          category_id,
          rating,
          downloads,
          favorites
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', user.id)
      .eq('vault_workflows.status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Transform data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const favorites = (data || []).map((fav: any) => ({
      id: fav.id,
      user_id: fav.user_id,
      workflow_id: fav.workflow_id,
      created_at: fav.created_at,
      workflow: fav.vault_workflows,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        favorites,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorites',
      },
      { status: 500 }
    );
  }
}

// Add workflow to favorites
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { workflow_id } = body;

    if (!workflow_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing workflow_id' },
        { status: 400 }
      );
    }

    // Verify workflow exists
    const { data: workflow, error: workflowError } = await supabaseAdmin
      .from('vault_workflows')
      .select('id, favorites')
      .eq('id', workflow_id)
      .eq('status', 'published')
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const { data: existing } = await supabaseAdmin
      .from('vault_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('workflow_id', workflow_id)
      .single();

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Already favorited' },
        { status: 400 }
      );
    }

    // Add to favorites
    const { data, error } = await supabaseAdmin
      .from('vault_favorites')
      .insert({
        user_id: user.id,
        workflow_id,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment favorites count
    await supabaseAdmin
      .from('vault_workflows')
      .update({ favorites: (workflow.favorites || 0) + 1 })
      .eq('id', workflow_id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
      message: 'Added to favorites',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add favorite',
      },
      { status: 500 }
    );
  }
}

// Remove workflow from favorites
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const workflow_id = searchParams.get('workflow_id');

    if (!workflow_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing workflow_id' },
        { status: 400 }
      );
    }

    // Delete favorite
    const { error } = await supabaseAdmin
      .from('vault_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('workflow_id', workflow_id);

    if (error) throw error;

    // Decrement favorites count
    const { data: workflow } = await supabaseAdmin
      .from('vault_workflows')
      .select('favorites')
      .eq('id', workflow_id)
      .single();

    if (workflow && workflow.favorites > 0) {
      await supabaseAdmin
        .from('vault_workflows')
        .update({ favorites: workflow.favorites - 1 })
        .eq('id', workflow_id);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove favorite',
      },
      { status: 500 }
    );
  }
}
