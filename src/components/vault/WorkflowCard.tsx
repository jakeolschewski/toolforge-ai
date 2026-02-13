import Link from 'next/link';
import { Download, Heart, Star, Clock, TrendingUp, Lock } from 'lucide-react';
import type { VaultWorkflow } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { truncate } from '@/utils/helpers';

export interface WorkflowCardProps {
  workflow: VaultWorkflow;
  featured?: boolean;
  showPurchaseButton?: boolean;
  isPurchased?: boolean;
  isFavorited?: boolean;
  onFavorite?: (id: string) => void;
}

export default function WorkflowCard({
  workflow,
  featured = false,
  showPurchaseButton = false,
  isPurchased = false,
  isFavorited = false,
  onFavorite
}: WorkflowCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getPricingBadge = () => {
    if (workflow.pricing_type === 'free') {
      return <Badge variant="success" size="sm">Free</Badge>;
    } else if (workflow.pricing_type === 'members_only') {
      return <Badge variant="secondary" size="sm">Members Only</Badge>;
    } else if (workflow.price) {
      return <Badge variant="primary" size="sm">${workflow.price}</Badge>;
    }
    return null;
  };

  return (
    <Card hover className={`relative ${featured ? 'ring-2 ring-primary-500' : ''}`}>
      {/* Thumbnail */}
      {workflow.thumbnail_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={workflow.thumbnail_url}
            alt={workflow.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {workflow.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="primary" size="sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
          {isPurchased && (
            <div className="absolute top-3 right-3">
              <Badge variant="success" size="sm">Purchased</Badge>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/vault/${workflow.slug}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                {workflow.title}
              </h3>
            </Link>
          </div>

          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={() => onFavorite(workflow.id)}
              className={`ml-2 p-2 rounded-full transition-colors ${
                isFavorited
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
              aria-label="Favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {getPricingBadge()}
          {workflow.difficulty_level && (
            <Badge
              variant={getDifficultyColor(workflow.difficulty_level) as any}
              size="sm"
            >
              {workflow.difficulty_level}
            </Badge>
          )}
          {workflow.category_name && (
            <Badge variant="outline" size="sm">
              {workflow.category_name}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {truncate(workflow.description, 150)}
        </p>

        {/* Tags */}
        {workflow.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {workflow.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
            {workflow.tags.length > 3 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{workflow.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {workflow.rating && workflow.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{workflow.rating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{(workflow.downloads || 0).toLocaleString()}</span>
          </div>
          {workflow.estimated_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workflow.estimated_time}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <div className="flex items-center justify-between w-full gap-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            {workflow.author_avatar && (
              <img
                src={workflow.author_avatar}
                alt={workflow.author}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">{workflow.author}</span>
          </div>

          {/* CTA */}
          <Link
            href={`/vault/${workflow.slug}`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {isPurchased ? 'Download' : 'View Details'}
            <Download className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
