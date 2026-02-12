// Admin API - Manage Tools

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { slugify } from '@/utils/helpers';
import type { ApiResponse, Tool } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Verify admin password (simple auth - upgrade to NextAuth in production)
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('ADMIN_PASSWORD not set!');
    return true; // Allow in development
  }

  return authHeader === `Bearer ${adminPassword}`;
}

// GET - List all tools (including drafts)
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  try {
    let query = supabaseAdmin
      .from('tools')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST - Create new tool
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = slugify(body.name);
    }

    // Ensure slug is unique
    const { data: existing } = await supabaseAdmin
      .from('tools')
      .select('id')
      .eq('slug', body.slug)
      .maybeSingle();

    if (existing) {
      body.slug = `${body.slug}-${Date.now()}`;
    }

    const { data, error } = await supabaseAdmin
      .from('tools')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
      message: 'Tool created successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create tool' },
      { status: 500 }
    );
  }
}

// PUT - Update tool
export async function PUT(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('tools')
      .update({
        ...updates,
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

// DELETE - Delete tool
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Tool ID required' },
      { status: 400 }
    );
  }

  try {
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
