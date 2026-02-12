// Public API - Fetch Single Tool by Slug

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Fetch tool
    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !tool) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Fetch reviews for this tool
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', tool.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Increment view count (fire and forget)
    supabaseAdmin
      .from('tools')
      .update({ views: (tool.views || 0) + 1 })
      .eq('id', tool.id)
      .then(() => {}, console.error);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          tool,
          reviews: reviews || [],
        },
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
        error: error instanceof Error ? error.message : 'Failed to fetch tool',
      },
      { status: 500 }
    );
  }
}
