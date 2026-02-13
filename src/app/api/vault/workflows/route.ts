// Workflow Vault API - List/Create Workflows

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, VaultWorkflow } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const category = searchParams.get('category');
  const pricingType = searchParams.get('pricingType');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const difficulty = searchParams.get('difficulty');
  const sortBy = searchParams.get('sortBy') || 'newest';

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('vault_workflows')
      .select('*, vault_categories!inner(name, slug)', { count: 'exact' })
      .eq('status', 'published');

    // Filters
    if (category) {
      query = query.eq('vault_categories.slug', category);
    }

    if (pricingType) {
      query = query.eq('pricing_type', pricingType);
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`
      );
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('downloads', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false, nullsLast: true });
        break;
      case 'favorites':
        query = query.order('favorites', { ascending: false });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      case 'price-low':
        query = query.order('price', { ascending: true, nullsLast: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false, nullsLast: true });
        break;
      case 'newest':
      default:
        query = query.order('published_at', { ascending: false, nullsLast: true });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data to include category_name
    const workflows = (data || []).map((workflow: any) => ({
      ...workflow,
      category_name: workflow.vault_categories?.name,
      vault_categories: undefined,
    })) as VaultWorkflow[];

    const response: PaginatedResponse<VaultWorkflow> = {
      data: workflows,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: response,
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
        error: error instanceof Error ? error.message : 'Failed to fetch workflows',
      },
      { status: 500 }
    );
  }
}

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

    // Validate required fields
    const requiredFields = ['title', 'description', 'category_id', 'file_url', 'pricing_type'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const workflowData = {
      slug,
      title: body.title,
      description: body.description,
      long_description: body.long_description,
      category_id: body.category_id,
      thumbnail_url: body.thumbnail_url,
      preview_images: body.preview_images || [],
      file_url: body.file_url,
      file_type: body.file_type || 'json',
      file_size: body.file_size,
      pricing_type: body.pricing_type,
      price: body.price,
      currency: body.currency || 'USD',
      stripe_product_id: body.stripe_product_id,
      stripe_price_id: body.stripe_price_id,
      tags: body.tags || [],
      difficulty_level: body.difficulty_level,
      estimated_time: body.estimated_time,
      requirements: body.requirements || [],
      features: body.features || [],
      use_cases: body.use_cases || [],
      author: body.author || 'ToolForge AI',
      author_avatar: body.author_avatar,
      version: body.version || '1.0.0',
      downloads: 0,
      favorites: 0,
      rating: null,
      review_count: 0,
      status: body.status || 'draft',
      is_featured: body.is_featured || false,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      keywords: body.keywords || [],
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabaseAdmin
      .from('vault_workflows')
      .insert(workflowData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data,
        message: 'Workflow created successfully',
      },
      { status: 201 }
    );
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
