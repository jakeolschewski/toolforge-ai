import { Check, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export interface PricingTier {
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  cta: string;
  ctaLink: string;
}

export interface PricingCardProps {
  tier: PricingTier;
  billingPeriod: 'monthly' | 'yearly';
  isCurrentPlan?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  tier,
  billingPeriod,
  isCurrentPlan = false,
  onSelect
}: PricingCardProps) {
  const price = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  const monthlyEquivalent = billingPeriod === 'yearly' ? tier.yearlyPrice / 12 : tier.monthlyPrice;
  const savings = billingPeriod === 'yearly'
    ? ((tier.monthlyPrice * 12 - tier.yearlyPrice) / (tier.monthlyPrice * 12) * 100).toFixed(0)
    : null;

  return (
    <Card
      hover={!isCurrentPlan}
      className={`relative ${
        tier.isPopular
          ? 'ring-2 ring-primary-500 shadow-xl scale-105'
          : isCurrentPlan
          ? 'ring-2 ring-green-500'
          : ''
      }`}
    >
      {/* Popular Badge */}
      {tier.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
            Current Plan
          </div>
        </div>
      )}

      <CardContent className={tier.isPopular ? 'pt-8' : 'pt-6'}>
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
          <p className="text-gray-600">{tier.description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">
              ${monthlyEquivalent.toFixed(0)}
            </span>
            <span className="text-gray-600">/month</span>
          </div>

          {billingPeriod === 'yearly' && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Billed ${price.toFixed(0)}/year
              </span>
              {savings && (
                <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Save {savings}%
                </span>
              )}
            </div>
          )}
          {billingPeriod === 'monthly' && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Billed ${price.toFixed(0)}/month
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {tier.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-600" />
                </div>
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant={tier.isPopular ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
          onClick={onSelect}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : tier.cta}
        </Button>
      </CardContent>
    </Card>
  );
}
