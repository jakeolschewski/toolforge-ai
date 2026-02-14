// PricingComparison Component - Compare pricing plans

import Link from 'next/link';
import { Check, ExternalLink, Award } from 'lucide-react';
import type { Tool, ComparisonPricing } from '@/types';

interface PricingComparisonProps {
  tools: Tool[];
  pricingData: ComparisonPricing[];
}

export default function PricingComparison({ tools, pricingData }: PricingComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pricingData.map((pricing) => {
        const tool = tools.find((t) => t.id === pricing.tool_id);
        if (!tool) return null;

        return (
          <div
            key={pricing.tool_id}
            className={`relative rounded-2xl p-6 ${
              pricing.is_recommended
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-800'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
            }`}
          >
            {pricing.is_recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  <Award className="w-3 h-3" />
                  Best Value
                </span>
              </div>
            )}

            {/* Tool Logo & Name */}
            <div className="flex items-center gap-3 mb-4">
              {tool.logo_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className={`w-12 h-12 object-contain rounded-lg ${
                    pricing.is_recommended ? 'bg-white/20' : ''
                  }`}
                />
              )}
              <div>
                <h3
                  className={`font-bold ${
                    pricing.is_recommended
                      ? 'text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tool.name}
                </h3>
                <p
                  className={`text-sm ${
                    pricing.is_recommended
                      ? 'text-white/80'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {pricing.plan_name}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div
                className={`text-4xl font-bold ${
                  pricing.is_recommended
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {pricing.price}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {pricing.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      pricing.is_recommended
                        ? 'text-white'
                        : 'text-green-500 dark:text-green-400'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      pricing.is_recommended
                        ? 'text-white/90'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={`/tools/${tool.slug}`}
              className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all ${
                pricing.is_recommended
                  ? 'bg-white text-indigo-600 hover:bg-gray-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                View {tool.name}
                <ExternalLink className="w-4 h-4" />
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
