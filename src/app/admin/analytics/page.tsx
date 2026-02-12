import { supabaseAdmin } from '@/lib/supabase';
import { TrendingUp, Eye, MousePointerClick, Package, Calendar } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

async function getAnalyticsData() {
  try {
    // Get top tools by views
    const { data: topViewedTools } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(10);

    // Get top tools by clicks
    const { data: topClickedTools } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('clicks', { ascending: false })
      .limit(10);

    // Get tools by category
    const { data: toolsByCategory } = await supabaseAdmin
      .from('tools')
      .select('category')
      .eq('status', 'published');

    const categoryStats = toolsByCategory?.reduce((acc: any, tool) => {
      const category = tool.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentTools } = await supabaseAdmin
      .from('tools')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    // Calculate total stats
    const totalViews = topViewedTools?.reduce((sum, tool) => sum + (tool.views || 0), 0) || 0;
    const totalClicks = topClickedTools?.reduce((sum, tool) => sum + (tool.clicks || 0), 0) || 0;
    const avgCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

    return {
      topViewedTools: topViewedTools || [],
      topClickedTools: topClickedTools || [],
      categoryStats,
      recentTools: recentTools || [],
      totalViews,
      totalClicks,
      avgCTR,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      topViewedTools: [],
      topClickedTools: [],
      categoryStats: {},
      recentTools: [],
      totalViews: 0,
      totalClicks: 0,
      avgCTR: '0.00',
    };
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track performance and engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Views"
          value={analytics.totalViews.toLocaleString()}
          icon={Eye}
          description="All-time tool views"
        />

        <StatsCard
          title="Total Clicks"
          value={analytics.totalClicks.toLocaleString()}
          icon={MousePointerClick}
          description="Outbound clicks"
        />

        <StatsCard
          title="Average CTR"
          value={`${analytics.avgCTR}%`}
          icon={TrendingUp}
          description="Click-through rate"
        />
      </div>

      {/* Top Tools by Views */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tools by Views</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topViewedTools.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {analytics.topViewedTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400 w-8">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                      <p className="text-sm text-gray-600">{tool.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {(tool.views || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Tools by Clicks */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tools by Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topClickedTools.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {analytics.topClickedTools.map((tool, index) => {
                const ctr = tool.views > 0
                  ? ((tool.clicks / tool.views) * 100).toFixed(1)
                  : '0.0';

                return (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400 w-8">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                        <p className="text-sm text-gray-600">{tool.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {(tool.clicks || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{ctr}% CTR</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Tools by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(analytics.categoryStats).length === 0 ? (
            <p className="text-gray-600 text-center py-8">No data available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.categoryStats)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([category, count]) => (
                  <div
                    key={category}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 capitalize mb-1">
                      {category}
                    </h4>
                    <p className="text-2xl font-bold text-primary-600">
                      {count as number}
                    </p>
                    <p className="text-xs text-gray-500">tools</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentTools.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                    <p className="text-sm text-gray-600">{tool.category}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(tool.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
