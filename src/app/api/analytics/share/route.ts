import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { platform, url, timestamp } = await request.json();

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Log share event
    const { error } = await supabase.from('share_events').insert([
      {
        platform,
        url,
        shared_at: timestamp || new Date().toISOString(),
        user_agent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
      },
    ]);

    if (error) {
      console.error('Error logging share:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Share tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const period = searchParams.get('period') || '30'; // days

    const supabase = createClient();

    let query = supabase
      .from('share_events')
      .select('platform, count')
      .gte(
        'shared_at',
        new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString()
      );

    if (toolId) {
      query = query.like('url', `%${toolId}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Aggregate by platform
    const aggregated = data?.reduce((acc: any, row: any) => {
      acc[row.platform] = (acc[row.platform] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      shares: aggregated,
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching share stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
