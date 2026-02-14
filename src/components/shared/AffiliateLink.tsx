'use client';

// Intelligent Affiliate Link Component
// Handles click tracking, sponsored badges, and graceful error handling

import { useState, useEffect } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { affiliateManager, type AffiliateProgram } from '@/lib/affiliate-manager';

interface AffiliateLinkProps {
  toolId: string;
  toolName: string;
  className?: string;
  children?: React.ReactNode;
  showBadge?: boolean;
  strategy?: 'highest_commission' | 'round_robin' | 'geo_based' | 'performance_based';
  fallbackUrl?: string;
  onClick?: () => void;
  variant?: 'button' | 'link' | 'card';
  size?: 'sm' | 'md' | 'lg';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackingMetadata?: Record<string, any>;
}

export default function AffiliateLink({
  toolId,
  toolName,
  className = '',
  children,
  showBadge = true,
  strategy = 'highest_commission',
  fallbackUrl,
  onClick,
  variant = 'button',
  size = 'md',
  trackingMetadata,
}: AffiliateLinkProps) {
  const [affiliateUrl, setAffiliateUrl] = useState<string | null>(null);
  const [program, setProgram] = useState<AffiliateProgram | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userGeo, setUserGeo] = useState<{ country_code: string; continent: string } | undefined>();

  // Fetch user's geo location
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        // Try to get geo from client-side API
        const response = await fetch('/api/geo');
        if (response.ok) {
          const data = await response.json();
          setUserGeo({
            country_code: data.country_code,
            continent: data.continent,
          });
        }
      } catch (err) {
        // Geo-targeting not critical, continue without it
        console.warn('Could not fetch geo location:', err);
      }
    };

    fetchGeo();
  }, []);

  // Fetch optimal affiliate link
  useEffect(() => {
    const fetchAffiliateLink = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await affiliateManager.getOptimalLink(
          toolId,
          strategy,
          userGeo
        );

        if (result) {
          setAffiliateUrl(result.url);
          setProgram(result.program);
          setTrackingId(result.tracking_id || null);
        } else if (fallbackUrl) {
          setAffiliateUrl(fallbackUrl);
          setProgram('direct');
        } else {
          setError('No affiliate link available');
        }
      } catch (err) {
        console.error('Error fetching affiliate link:', err);
        setError('Failed to load link');

        // Use fallback if available
        if (fallbackUrl) {
          setAffiliateUrl(fallbackUrl);
          setProgram('direct');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliateLink();
  }, [toolId, strategy, userGeo, fallbackUrl]);

  const handleClick = async (_e: React.MouseEvent) => {
    // Track the click
    if (program && trackingId) {
      try {
        await affiliateManager.trackClick(
          toolId,
          program,
          trackingId,
          {
            ...trackingMetadata,
            strategy,
            user_geo: userGeo,
            timestamp: new Date().toISOString(),
          }
        );
      } catch (err) {
        console.error('Error tracking click:', err);
      }
    }

    // Also call the legacy tracking endpoint
    try {
      await fetch('/api/track/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId }),
      });
    } catch (err) {
      console.error('Error tracking click (legacy):', err);
    }

    // Call custom onClick handler
    if (onClick) {
      onClick();
    }

    // Let the browser handle the navigation
  };

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all';

    switch (variant) {
      case 'button':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg`;
      case 'link':
        return `${baseStyles} text-blue-600 hover:text-blue-700 underline underline-offset-4`;
      case 'card':
        return `${baseStyles} w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl`;
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  // Error state
  if (error && !fallbackUrl) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`${getVariantStyles()} ${getSizeStyles()} ${className} opacity-50 cursor-not-allowed`}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // No URL available
  if (!affiliateUrl) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={`${getVariantStyles()} ${getSizeStyles()} ${className}`}
        aria-label={`Visit ${toolName} (Affiliate Link)`}
      >
        {children || (
          <>
            <span>Visit {toolName}</span>
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </a>

      {showBadge && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          Sponsored
        </div>
      )}

      {program && (
        <span className="sr-only">
          Affiliate link via {program}
        </span>
      )}
    </div>
  );
}

// Compact inline version without button styling
export function InlineAffiliateLink({
  toolId,
  toolName,
  className = '',
  children,
  trackingMetadata,
}: Pick<AffiliateLinkProps, 'toolId' | 'toolName' | 'className' | 'children' | 'trackingMetadata'>) {
  return (
    <AffiliateLink
      toolId={toolId}
      toolName={toolName}
      className={className}
      variant="link"
      size="sm"
      showBadge={false}
      trackingMetadata={trackingMetadata}
    >
      {children}
    </AffiliateLink>
  );
}

// Card-style CTA version
export function AffiliateCardCTA({
  toolId,
  toolName,
  className = '',
  ctaText = 'Get Started',
  trackingMetadata,
}: Pick<AffiliateLinkProps, 'toolId' | 'toolName' | 'className' | 'trackingMetadata'> & {
  ctaText?: string;
}) {
  return (
    <AffiliateLink
      toolId={toolId}
      toolName={toolName}
      className={className}
      variant="card"
      size="lg"
      showBadge={true}
      trackingMetadata={trackingMetadata}
    >
      <span>{ctaText}</span>
      <ExternalLink className="w-5 h-5" />
    </AffiliateLink>
  );
}

// Simple text link with sponsored indicator
export function SponsoredTextLink({
  toolId,
  toolName,
  text,
  className = '',
}: {
  toolId: string;
  toolName: string;
  text: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <InlineAffiliateLink toolId={toolId} toolName={toolName}>
        {text}
      </InlineAffiliateLink>
      <span className="text-xs text-gray-400" title="Sponsored link">
        *
      </span>
    </span>
  );
}
