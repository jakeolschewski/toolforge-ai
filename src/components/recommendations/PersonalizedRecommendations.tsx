'use client';

import { useEffect, useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import type { Tool } from '@/types';
import ToolCard from '@/components/tools/ToolCard';
import { Card, CardContent } from '@/components/ui/Card';
import { getUserBrowsingHistory } from '@/lib/browsing-history';

interface PersonalizedRecommendationsProps {
  limit?: number;
  title?: string;
  showInsights?: boolean;
}

export default function PersonalizedRecommendations({
  limit = 6,
  title = 'Recommended For You',
  showInsights = true
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasHistory, setHasHistory] = useState(false);
  const [topCategories, setTopCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadPersonalizedRecommendations() {
      try {
        setLoading(true);

        // Get browsing history
        const history = getUserBrowsingHistory();

        if (!history || history.viewedTools.length === 0) {
          setHasHistory(false);
          setLoading(false);
          return;
        }

        setHasHistory(true);

        // Fetch personalized recommendations
        const response = await fetch(
          `/api/recommendations?type=personalized&limit=${limit}`
        );

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.data?.recommendations || []);

          // Extract top categories from history
          const categoryCount: Record<string, number> = {};
          history.categories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          });

          const sorted = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

          setTopCategories(sorted);
        }
      } catch (error) {
        console.error('Error loading personalized recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPersonalizedRecommendations();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!hasHistory) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <User className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Personalized Recommendations Coming Soon
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Browse some tools to get personalized recommendations based on your interests.
            We'll analyze your preferences to suggest the perfect tools for you.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-gray-600">
            Based on your browsing history and preferences
          </p>
        </div>
      </div>

      {/* Insights Card */}
      {showInsights && topCategories.length > 0 && (
        <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Your Interests
                </h3>
                <p className="text-sm text-gray-700">
                  You've been exploring:{' '}
                  <span className="font-semibold">
                    {topCategories.join(', ')}
                  </span>
                  . Here are some tools we think you'll love.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
