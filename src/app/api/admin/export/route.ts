import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { exportToolsToCSV, exportReviewsToCSV, toCSV } from '@/utils/csv';
import type { Tool, Review } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === process.env.ADMIN_TOKEN;
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      type,
      format = 'csv',
      filters = {},
      fields = [],
    } = await request.json();

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Export type is required' },
        { status: 400 }
      );
    }

    let data: any;
    let filename: string;

    switch (type) {
      case 'tools':
        data = await exportTools(filters, fields);
        filename = `tools_export_${Date.now()}.csv`;
        break;

      case 'reviews':
        data = await exportReviews(filters, fields);
        filename = `reviews_export_${Date.now()}.csv`;
        break;

      case 'analytics':
        data = await exportAnalytics(filters);
        filename = `analytics_export_${Date.now()}.csv`;
        break;

      case 'clicks':
        data = await exportClicks(filters);
        filename = `clicks_export_${Date.now()}.csv`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        );
    }

    // Log the export
    await supabase.from('audit_logs').insert({
      action: 'export',
      entity_type: type,
      metadata: { format, filters, recordCount: data.split('\n').length - 1 },
      created_at: new Date().toISOString(),
    });

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function exportTools(filters: any, fields: string[]): Promise<string> {
  let query = supabase.from('tools').select('*');

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.pricing_model) {
    query = query.eq('pricing_model', filters.pricing_model);
  }

  if (filters.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured);
  }

  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Order by
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch tools: ${error.message}`);
  }

  // Filter fields if specified
  let exportData = data || [];
  if (fields.length > 0) {
    exportData = exportData.map((tool) => {
      const filtered: any = {};
      fields.forEach((field) => {
        if (field in tool) {
          filtered[field] = tool[field as keyof Tool];
        }
      });
      return filtered;
    });
  }

  return exportToolsToCSV(exportData as Tool[]);
}

async function exportReviews(filters: any, fields: string[]): Promise<string> {
  let query = supabase
    .from('reviews')
    .select('*, tools(name)');

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.author) {
    query = query.eq('author', filters.author);
  }

  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  if (filters.min_rating) {
    query = query.gte('rating', filters.min_rating);
  }

  // Order by
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  // Add tool name to reviews
  const reviewsWithToolName = (data || []).map((review: any) => ({
    ...review,
    tool_name: review.tools?.name || 'Unknown',
  }));

  // Filter fields if specified
  let exportData = reviewsWithToolName;
  if (fields.length > 0) {
    exportData = exportData.map((review) => {
      const filtered: any = {};
      fields.forEach((field) => {
        if (field in review) {
          filtered[field] = review[field];
        }
      });
      return filtered;
    });
  }

  return exportReviewsToCSV(exportData as Review[]);
}

async function exportAnalytics(filters: any): Promise<string> {
  let query = supabase
    .from('tools')
    .select('id, name, slug, category, views, clicks, rating, review_count, status, created_at');

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  // Order by views
  query = query.order('views', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }

  // Calculate click-through rate
  const analyticsData = (data || []).map((tool) => ({
    ...tool,
    click_through_rate: tool.views > 0 ? ((tool.clicks / tool.views) * 100).toFixed(2) : '0',
  }));

  return toCSV(analyticsData);
}

async function exportClicks(filters: any): Promise<string> {
  let query = supabase
    .from('click_logs')
    .select('*, tools(name, slug)');

  // Apply filters
  if (filters.tool_id) {
    query = query.eq('tool_id', filters.tool_id);
  }

  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  // Order by
  query = query.order('created_at', { ascending: false });

  // Limit to prevent huge exports
  query = query.limit(10000);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch clicks: ${error.message}`);
  }

  // Format data
  const clicksData = (data || []).map((click: any) => ({
    id: click.id,
    tool_name: click.tools?.name || 'Unknown',
    tool_slug: click.tools?.slug || 'unknown',
    ip_hash: click.ip_hash,
    referrer: click.referrer,
    user_agent: click.user_agent,
    created_at: click.created_at,
  }));

  return toCSV(clicksData);
}
