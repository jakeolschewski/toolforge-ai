import { supabaseAdmin } from '@/lib/supabase';
import { Package, FileText, Eye, MousePointerClick, DollarSign, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

async function getAdminStats() {
  try {
    // Get total tools count
    const { count: toolsCount } = await supabaseAdmin
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get pending drafts count
    const { count: pendingCount } = await supabaseAdmin
      .from('scraped_sources')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get total views
    const { data: viewsData } = await supabaseAdmin
      .from('tools')
      .select('views')
      .eq('status', 'published');

    const totalViews = viewsData?.reduce((sum, tool) => sum + (tool.views || 0), 0) || 0;

    // Get total clicks
    const { data: clicksData } = await supabaseAdmin
      .from('tools')
      .select('clicks')
      .eq('status', 'published');

    const totalClicks = clicksData?.reduce((sum, tool) => sum + (tool.clicks || 0), 0) || 0;

    // Get recent tools
    const { data: recentTools } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get reviews count
    const { count: reviewsCount } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    return {
      toolsCount: toolsCount || 0,
      pendingCount: pendingCount || 0,
      totalViews,
      totalClicks,
      reviewsCount: reviewsCount || 0,
      recentTools: recentTools || [],
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      toolsCount: 0,
      pendingCount: 0,
      totalViews: 0,
      totalClicks: 0,
      reviewsCount: 0,
      recentTools: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const ctr = stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your ToolForge AI platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tools"
          value={stats.toolsCount}
          icon={Package}
          description="Published tools"
        />

        <StatsCard
          title="Pending Drafts"
          value={stats.pendingCount}
          icon={FileText}
          description="Awaiting approval"
        />

        <StatsCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          description="Tool page views"
        />

        <StatsCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={MousePointerClick}
          description={`${ctr}% CTR`}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/drafts"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Review Drafts</h3>
              <p className="text-sm text-gray-600 mt-1">
                {stats.pendingCount} pending approval
              </p>
            </a>

            <a
              href="/admin/tools"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Package className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Tools</h3>
              <p className="text-sm text-gray-600 mt-1">
                Edit and organize tools
              </p>
            </a>

            <a
              href="/admin/analytics"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Track performance metrics
              </p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Published Tools</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentTools.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No tools published yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {tool.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" />
                        {tool.clicks || 0} clicks
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/tools/${tool.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
