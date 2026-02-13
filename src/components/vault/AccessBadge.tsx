import { Check, Lock, Crown, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/vault/constants';

export interface AccessBadgeProps {
  hasAccess: boolean;
  isPremium: boolean;
  isFree: boolean;
  userTier?: 'free' | 'pro' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function AccessBadge({
  hasAccess,
  isPremium,
  isFree,
  userTier = 'free',
  size = 'md',
  showIcon = true
}: AccessBadgeProps) {
  // Free workflow - always accessible
  if (isFree) {
    return (
      <Badge variant="success" size={size}>
        {showIcon && <Check className="w-3 h-3 mr-1" />}
        Free
      </Badge>
    );
  }

  // Premium workflow
  if (isPremium) {
    if (hasAccess) {
      return (
        <Badge variant="secondary" size={size}>
          {showIcon && <Crown className="w-3 h-3 mr-1" />}
          Members Only
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" size={size}>
          {showIcon && <Lock className="w-3 h-3 mr-1" />}
          Membership Required
        </Badge>
      );
    }
  }

  // Paid workflow
  if (hasAccess) {
    return (
      <Badge variant="success" size={size}>
        {showIcon && <Check className="w-3 h-3 mr-1" />}
        Purchased
      </Badge>
    );
  }

  return (
    <Badge variant="primary" size={size}>
      {showIcon && <Sparkles className="w-3 h-3 mr-1" />}
      Premium
    </Badge>
  );
}

export function MembershipBadge({ tier }: { tier: 'free' | 'pro' | 'premium' }) {
  const config = {
    free: {
      variant: 'default' as const,
      icon: null,
      label: 'Free Member'
    },
    pro: {
      variant: 'primary' as const,
      icon: Sparkles,
      label: 'Pro Member'
    },
    premium: {
      variant: 'secondary' as const,
      icon: Crown,
      label: 'Premium Member'
    }
  };

  const { variant, icon: Icon, label } = config[tier];

  return (
    <Badge variant={variant} size="md">
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </Badge>
  );
}

export function PricingTypeBadge({
  type,
  price
}: {
  type: 'free' | 'premium' | 'members_only';
  price?: number;
}) {
  if (type === 'free') {
    return <Badge variant="success" size="sm">Free</Badge>;
  }

  if (type === 'members_only') {
    return (
      <Badge variant="secondary" size="sm">
        <Crown className="w-3 h-3 mr-1" />
        Members Only
      </Badge>
    );
  }

  if (price) {
    return <Badge variant="primary" size="sm">{formatPrice(price)}</Badge>;
  }

  return <Badge variant="primary" size="sm">Premium</Badge>;
}
