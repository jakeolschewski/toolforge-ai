'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link2, Mail, MessageCircle } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'default' | 'floating' | 'minimal';
  showLabels?: boolean;
  className?: string;
}

export default function SocialShareButtons({
  url,
  title,
  description = '',
  variant = 'default',
  showLabels = false,
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=ToolForgeAI`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    // Track share event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'tool',
        item_id: url,
      });
    }

    // Open share window
    const shareUrl = shareLinks[platform];
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      shareUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track copy event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).gtag) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'share', {
          method: 'copy_link',
          content_type: 'tool',
          item_id: url,
        });
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });

        // Track native share
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).gtag) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).gtag('event', 'share', {
            method: 'native',
            content_type: 'tool',
            item_id: url,
          });
        }
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  // Floating variant
  if (variant === 'floating') {
    return (
      <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block ${className}`}>
        <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-700" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            aria-label="Copy link"
          >
            {copied ? (
              <span className="text-xs text-green-600">✓</span>
            ) : (
              <Link2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {showLabels && 'Share'}
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <Twitter className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span className="text-sm">LinkedIn</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <Link2 className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Native share on mobile */}
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors md:hidden"
        >
          <Share2 className="w-4 h-4" />
          {showLabels && 'Share'}
        </button>
      )}

      {/* Twitter */}
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        {showLabels && 'Twitter'}
      </button>

      {/* Facebook */}
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        {showLabels && 'Facebook'}
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare('linkedin')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        {showLabels && 'LinkedIn'}
      </button>

      {/* Email */}
      <button
        onClick={() => handleShare('email')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        aria-label="Share via Email"
      >
        <Mail className="w-4 h-4" />
        {showLabels && 'Email'}
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => handleShare('whatsapp')}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        {showLabels && 'WhatsApp'}
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        aria-label="Copy link"
      >
        <Link2 className="w-4 h-4" />
        {showLabels && (copied ? 'Copied!' : 'Copy Link')}
      </button>
    </div>
  );
}
