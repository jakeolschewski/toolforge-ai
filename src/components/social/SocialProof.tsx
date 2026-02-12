'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, Star, Eye } from 'lucide-react';

interface SocialProofProps {
  toolId?: string;
  variant?: 'views' | 'favorites' | 'rating' | 'trending' | 'all';
  className?: string;
}

export default function SocialProof({
  toolId,
  variant = 'all',
  className = '',
}: SocialProofProps) {
  const [stats, setStats] = useState({
    views: 0,
    favorites: 0,
    rating: 0,
    trending: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!toolId) {
      setLoading(false);
      return;
    }

    // Fetch social proof stats
    fetch(`/api/tools/${toolId}/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [toolId]);

  if (loading) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderStat = (type: string) => {
    switch (type) {
      case 'views':
        return stats.views > 0 ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(stats.views)} views</span>
          </div>
        ) : null;

      case 'favorites':
        return stats.favorites > 0 ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{formatNumber(stats.favorites)} users love this</span>
          </div>
        ) : null;

      case 'rating':
        return stats.rating > 0 ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{stats.rating.toFixed(1)} rating</span>
          </div>
        ) : null;

      case 'trending':
        return stats.trending ? (
          <div className="flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (variant === 'all') {
    return (
      <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        {renderStat('views')}
        {renderStat('favorites')}
        {renderStat('rating')}
        {renderStat('trending')}
      </div>
    );
  }

  return <div className={className}>{renderStat(variant)}</div>;
}
