'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Flame, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Tool } from '@/types';
import ToolCard from '@/components/tools/ToolCard';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

interface TrendingToolsProps {
  limit?: number;
  showRisingStars?: boolean;
  compact?: boolean;
}

interface TrendingTool extends Tool {
  trendScore?: number;
  growthRate?: number;
}

export default function TrendingTools({
  limit = 10,
  showRisingStars = true,
  compact = false
}: TrendingToolsProps) {
  const [trendingTools, setTrendingTools] = useState<TrendingTool[]>([]);
  const [risingStars, setRisingStars] = useState<TrendingTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrendingData() {
      try {
        setLoading(true);

        // Fetch trending tools
        const trendingResponse = await fetch(
          `/api/recommendations/trending?limit=${limit}`
        );

        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          setTrendingTools(trendingData.trending || []);
        }

        // Fetch rising stars
        if (showRisingStars) {
          const risingResponse = await fetch(
            `/api/recommendations/rising?limit=${Math.min(limit, 6)}`
          );

          if (risingResponse.ok) {
            const risingData = await risingResponse.json();
            setRisingStars(risingData.rising || []);
          }
        }
      } catch (error) {
        console.error('Error loading trending data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTrendingData();
  }, [limit, showRisingStars]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (trendingTools.length === 0 && risingStars.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="space-y-6">
        {/* Compact Trending List */}
        {trendingTools.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900">Trending This Week</h3>
              </div>
              <div className="space-y-3">
                {trendingTools.slice(0, 5).map((tool, index) => (
                  <a
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {tool.tagline || tool.description}
                      </p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compact Rising Stars */}
        {risingStars.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900">Rising Stars</h3>
              </div>
              <div className="space-y-3">
                {risingStars.slice(0, 5).map((tool) => (
                  <a
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {tool.tagline || tool.description}
                      </p>
                    </div>
                    {tool.growthRate && tool.growthRate > 0 && (
                      <Badge variant="success" size="sm">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {Math.round(tool.growthRate)}%
                      </Badge>
                    )}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Trending Tools Section */}
      {trendingTools.length > 0 && (
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Trending This Week
              </h2>
            </div>
            <p className="text-gray-600">
              Most viewed AI tools in the last 7 days. Stay ahead of the curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.map((tool, index) => (
              <div key={tool.id} className="relative">
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                )}
                <ToolCard tool={tool} featured={index === 0} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rising Stars Section */}
      {risingStars.length > 0 && showRisingStars && (
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Rising Stars
              </h2>
            </div>
            <p className="text-gray-600">
              Fastest growing tools with exceptional potential. Don't miss out on these hidden gems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {risingStars.map((tool) => (
              <div key={tool.id} className="relative">
                <ToolCard tool={tool} />
                {tool.growthRate && tool.growthRate > 50 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="success">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {Math.round(tool.growthRate)}%
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Growth Insight Card */}
          <Card className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Why These Tools Are Growing
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Rising stars show exceptional growth in user interest and engagement.
                    These tools are gaining traction for their innovative features, competitive pricing,
                    or unique approach to solving problems.
                  </p>
                  <p className="text-xs text-gray-600">
                    Growth rate calculated based on view trends over the last 7 days compared to previous period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
