// Admin Vault API - Workflows CRUD

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

// GET - List all workflows (admin sees all statuses)
export async function GET(_request: NextRequest) {
  try {
    const { data: workflows, error } = await supabaseAdmin
      .from('vault_workflows')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workflows,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load workflows',
      },
      { status: 500 }
    );
  }
}

// POST - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Remove fields that shouldn't be set on create
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at: _created_at, updated_at: _updated_at, ...workflowData } = body;

    // Generate slug if not provided
    if (!workflowData.slug && workflowData.title) {
      workflowData.slug = workflowData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const { data: workflow, error } = await supabaseAdmin
      .from('vault_workflows')
      .insert(workflowData)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workflow,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create workflow',
      },
      { status: 500 }
    );
  }
}
