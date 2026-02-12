'use client';

// Social Share Buttons Component

import React from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { generateShareUrl } from '@/utils/seo';
import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Social sharing buttons with copy link functionality
 */
export default function ShareButtons({
  url,
  title,
  description,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: generateShareUrl('twitter', { url, title, description }),
      color: 'hover:bg-blue-500 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: generateShareUrl('linkedin', { url, title, description }),
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: generateShareUrl('facebook', { url, title, description }),
      color: 'hover:bg-blue-600 hover:text-white',
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>

      {shareButtons.map((button) => (
        <a
          key={button.name}
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-lg border border-gray-300 text-gray-600 transition-colors ${button.color}`}
          aria-label={`Share on ${button.name}`}
          onClick={(e) => {
            // Track share event
            try {
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'share', {
                  method: button.name,
                  content_type: 'tool',
                  item_id: url,
                });
              }
            } catch (error) {
              // Ignore analytics errors
            }
          }}
        >
          <button.icon className="w-4 h-4" />
        </a>
      ))}

      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg border transition-colors ${
          copied
            ? 'bg-green-500 text-white border-green-500'
            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
