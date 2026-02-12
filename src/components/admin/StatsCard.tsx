import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {Icon && <Icon className="h-5 w-5 text-gray-400" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {trend && (
            <p className={cn(
              'text-sm flex items-center gap-1',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500">vs last period</span>
            </p>
          )}

          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
