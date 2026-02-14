import Link from 'next/link';
import { ExternalLink, TrendingUp } from 'lucide-react';
import type { Tool } from '@/types';
import { truncate } from '@/utils/helpers';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import Badge, { PricingBadge, CategoryBadge, FeatureBadge } from '@/components/ui/Badge';
import RatingStars from '@/components/shared/RatingStars';

export interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
  showFullDescription?: boolean;
}

export default function ToolCard({ tool, featured = false, showFullDescription = false }: ToolCardProps) {
  return (
    <Card hover className={featured ? 'ring-2 ring-primary-500' : ''}>
      {/* Badge */}
      {(tool.is_featured || tool.is_sponsored) && (
        <div className="px-4 pt-3">
          {tool.is_featured && (
            <Badge variant="primary" size="sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {tool.is_sponsored && !tool.is_featured && (
            <Badge variant="secondary" size="sm">
              Sponsored
            </Badge>
          )}
        </div>
      )}

      {/* Logo & Header */}
      <CardContent className={tool.is_featured || tool.is_sponsored ? 'pt-3' : 'pt-6'}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/tools/${tool.slug}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                {tool.name}
              </h3>
            </Link>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <CategoryBadge category={tool.category} />
              <PricingBadge pricing={tool.pricing_model} />
            </div>
          </div>

          {/* Rating */}
          {tool.rating > 0 && (
            <div className="ml-3">
              <RatingStars rating={tool.rating} size="sm" showValue />
            </div>
          )}
        </div>

        {/* Tagline */}
        {tool.tagline && (
          <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-1">
            {tool.tagline}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {showFullDescription ? tool.description : truncate(tool.description, 120)}
        </p>

        {/* Features */}
        {(tool.features || []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {(tool.features || []).slice(0, 3).map((feature, idx) => (
              <FeatureBadge key={idx} feature={feature} />
            ))}
            {(tool.features || []).length > 3 && (
              <Badge variant="outline" size="sm">
                +{(tool.features || []).length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          {/* Pricing */}
          <div className="text-sm">
            {tool.starting_price ? (
              <div>
                <span className="font-semibold text-gray-900">{tool.starting_price}</span>
                <span className="text-gray-600 ml-1">/ month</span>
              </div>
            ) : (
              <span className="text-gray-600">
                {tool.pricing_model === 'free' && 'Free to use'}
                {tool.pricing_model === 'freemium' && 'Free plan available'}
                {tool.pricing_model === 'paid' && 'One-time payment'}
                {tool.pricing_model === 'subscription' && 'Subscription based'}
              </span>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View Details
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
