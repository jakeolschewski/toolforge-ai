import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export default function RatingStars({
  rating,
  maxStars = 5,
  size = 'md',
  showValue = false,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeClasses[size], 'text-yellow-400 fill-yellow-400')}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizeClasses[size], 'text-gray-300 fill-gray-300')} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={cn(sizeClasses[size], 'text-yellow-400 fill-yellow-400')} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizeClasses[size], 'text-gray-300 fill-gray-300')}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn('font-semibold text-gray-700 ml-1', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function RatingDisplay({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-2">
      <RatingStars rating={rating} showValue size="md" />
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
      )}
    </div>
  );
}
