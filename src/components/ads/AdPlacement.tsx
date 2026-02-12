'use client';

import { useEffect, useState } from 'react';
import GoogleAdsense from './GoogleAdsense';

interface AdPlacementProps {
  position: 'sidebar' | 'in-content' | 'header' | 'footer' | 'between-posts';
  className?: string;
}

const AD_SLOTS = {
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || '',
  'in-content': process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || '',
  header: process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT || '',
  footer: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT || '',
  'between-posts': process.env.NEXT_PUBLIC_ADSENSE_FEED_SLOT || '',
};

export default function AdPlacement({ position, className = '' }: AdPlacementProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const adSlot = AD_SLOTS[position];

  useEffect(() => {
    // Check if ads should be shown
    // Don't show to admin users
    const isAdmin = localStorage.getItem('admin_token');
    if (isAdmin) {
      setShouldShow(false);
      return;
    }

    // Only show if AdSense is configured
    if (process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && adSlot) {
      setShouldShow(true);
    }
  }, [adSlot]);

  if (!shouldShow || !adSlot) {
    return null;
  }

  const getAdFormat = () => {
    switch (position) {
      case 'sidebar':
        return 'vertical';
      case 'header':
        return 'horizontal';
      case 'footer':
        return 'horizontal';
      case 'in-content':
        return 'rectangle';
      case 'between-posts':
        return 'fluid';
      default:
        return 'auto';
    }
  };

  return (
    <div className={`ad-container ${className}`}>
      {/* Ad label */}
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>

      <GoogleAdsense
        adSlot={adSlot}
        adFormat={getAdFormat()}
        fullWidthResponsive={position !== 'sidebar'}
      />
    </div>
  );
}
