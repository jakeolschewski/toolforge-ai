import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Middleware already handles admin auth for /api/admin/* routes
const supabase = supabaseAdmin;

export async function GET(_request: NextRequest) {
  try {

    const healthData = {
      database: await checkDatabase(),
      api: await checkAPI(),
      storage: await checkStorage(),
      lastScraper: await checkLastScraper(),
    };

    return NextResponse.json({
      success: true,
      data: healthData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkDatabase() {
  try {
    const startTime = Date.now();

    // Test database connection with a simple query
    const { error } = await supabase
      .from('tools')
      .select('id')
      .limit(1);

    const responseTime = Date.now() - startTime;

    if (error) {
      return {
        status: 'error' as const,
        message: `Database connection failed: ${error.message}`,
        responseTime,
      };
    }

    // Get record counts
    const [toolsCount, reviewsCount, usersCount] = await Promise.all([
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
    ]);

    return {
      status: responseTime < 1000 ? 'healthy' as const : 'warning' as const,
      message: responseTime < 1000
        ? 'Database is responding normally'
        : 'Database response time is slow',
      responseTime,
      recordCount: {
        tools: toolsCount.count || 0,
        reviews: reviewsCount.count || 0,
        users: usersCount.count || 0,
      },
    };
  } catch (error) {
    return {
      status: 'error' as const,
      message: `Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkAPI() {
  try {
    const startTime = Date.now();

    // Test API by fetching a single tool
    const { error } = await supabase
      .from('tools')
      .select('id, name')
      .eq('status', 'published')
      .limit(1)
      .single();

    const responseTime = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      return {
        status: 'error' as const,
        message: `API test failed: ${error.message}`,
        responseTime,
      };
    }

    return {
      status: responseTime < 500 ? 'healthy' as const : 'warning' as const,
      message: responseTime < 500
        ? 'API is responding normally'
        : 'API response time is slow',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'error' as const,
      message: `API check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkStorage() {
  try {
    // Get storage usage
    const [toolsCount, reviewsCount, clicksCount] = await Promise.all([
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('click_logs').select('id', { count: 'exact', head: true }),
    ]);

    const totalRecords =
      (toolsCount.count || 0) +
      (reviewsCount.count || 0) +
      (clicksCount.count || 0);

    // Warning if approaching limits (example: 10k records)
    const status = totalRecords < 8000 ? 'healthy' : totalRecords < 10000 ? 'warning' : 'error';
    const message =
      status === 'healthy' ? 'Storage usage is normal' :
      status === 'warning' ? 'Storage usage is high' :
      'Storage usage is critical';

    return {
      status,
      message,
      usage: {
        tools: toolsCount.count || 0,
        reviews: reviewsCount.count || 0,
        clicks: clicksCount.count || 0,
        total: totalRecords,
      },
    };
  } catch (error) {
    return {
      status: 'error' as const,
      message: `Storage check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function checkLastScraper() {
  try {
    // Check audit logs for last scraper run
    const { data: lastLog } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('action', 'scraper_run')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastLog) {
      return {
        status: 'pending' as const,
        lastRun: undefined,
        toolsAdded: 0,
        errors: [],
      };
    }

    return {
      status: lastLog.metadata?.status || 'pending',
      lastRun: lastLog.created_at,
      toolsAdded: lastLog.metadata?.toolsAdded || 0,
      errors: lastLog.metadata?.errors || [],
    };
  } catch (error) {
    return {
      status: 'error' as const,
      lastRun: undefined,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
