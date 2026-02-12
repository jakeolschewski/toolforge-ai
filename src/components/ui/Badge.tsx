import * as React from 'react';
import { cn } from '@/utils/helpers';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-700 bg-white',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function PricingBadge({ pricing }: { pricing: 'free' | 'freemium' | 'paid' | 'subscription' }) {
  const variants: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    free: { variant: 'success', label: 'Free' },
    freemium: { variant: 'primary', label: 'Free + Paid' },
    paid: { variant: 'warning', label: 'Paid' },
    subscription: { variant: 'secondary', label: 'Subscription' },
  };

  const config = variants[pricing] || variants.paid;

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="outline" size="sm">
      {category}
    </Badge>
  );
}

export function FeatureBadge({ feature }: { feature: string }) {
  return (
    <Badge variant="primary" size="sm">
      {feature}
    </Badge>
  );
}
