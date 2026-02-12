'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import type { Tool } from '@/types';
import ToolCard from '@/components/tools/ToolCard';
import { Card } from '@/components/ui/Card';

interface SimilarToolsProps {
  currentTool: Tool;
  limit?: number;
  showAlternatives?: boolean;
}

export default function SimilarTools({
  currentTool,
  limit = 6,
  showAlternatives = false
}: SimilarToolsProps) {
  const [recommendations, setRecommendations] = useState<Tool[]>([]);
  const [alternatives, setAlternatives] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);

        // Fetch similar tools
        const response = await fetch(
          `/api/recommendations/similar?toolId=${currentTool.id}&limit=${limit}`
        );

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }

        // Fetch alternatives if requested
        if (showAlternatives) {
          const altResponse = await fetch(
            `/api/recommendations/alternatives?toolId=${currentTool.id}&limit=4`
          );

          if (altResponse.ok) {
            const altData = await altResponse.json();
            setAlternatives(altData.alternatives || []);
          }
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [currentTool.id, limit, showAlternatives]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0 && alternatives.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Alternatives Section */}
      {alternatives.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Alternative to {currentTool.name}
            </h2>
            <p className="text-gray-600">
              Looking for similar tools? These alternatives offer comparable features in the same category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternatives.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Similar Tools Section */}
      {recommendations.length > 0 && (
        <section>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  You Might Also Like
                </h2>
              </div>
              <p className="text-gray-600">
                Based on {currentTool.name}, here are some tools we think you'll find useful.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* If You Like X, Try Y Card */}
          {recommendations.length >= 2 && (
            <Card className="mt-8 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Smart Suggestion
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-sm text-gray-600 mb-2">If you like</p>
                    <p className="font-semibold text-gray-900">{currentTool.name}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-sm text-gray-600 mb-2">You should try</p>
                    <a
                      href={`/tools/${recommendations[0].slug}`}
                      className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {recommendations[0].name}
                    </a>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {recommendations[0].tagline || recommendations[0].description.slice(0, 120)}...
                </p>
              </div>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
