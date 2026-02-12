/**
 * Social Sharing Utilities
 * Comprehensive social media sharing and optimization
 */

interface ShareData {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
}

/**
 * Generate Open Graph meta tags for social sharing
 */
export function generateOGTags(data: ShareData) {
  const tags = [
    { property: 'og:url', content: data.url },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description || '' },
    { property: 'og:image', content: data.image || '/og-default.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'ToolForge AI' },
  ];

  return tags;
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags(data: ShareData) {
  const tags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ToolForgeAI' },
    { name: 'twitter:creator', content: '@ToolForgeAI' },
    { name: 'twitter:title', content: data.title },
    { name: 'twitter:description', content: data.description || '' },
    { name: 'twitter:image', content: data.image || '/og-default.png' },
  ];

  return tags;
}

/**
 * Track social share events
 */
export function trackShare(platform: string, url: string) {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'tool',
        item_id: url,
      });
    }

    // Supabase analytics (optional)
    fetch('/api/analytics/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        url,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  }
}

/**
 * Generate shareable quote for Click-to-Tweet
 */
export function generateTweetQuote(toolName: string, benefit: string): string {
  const quotes = [
    `Just discovered ${toolName} - ${benefit} 🚀`,
    `${toolName} is a game-changer for ${benefit}`,
    `Pro tip: Use ${toolName} to ${benefit} faster`,
    `${toolName}: The best way to ${benefit}`,
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Get optimal sharing time based on platform
 */
export function getOptimalShareTime(platform: string): string {
  const times: Record<string, string> = {
    twitter: '9am-3pm EST (weekdays)',
    linkedin: '7-9am, 5-6pm EST (weekdays)',
    facebook: '1-4pm EST',
    instagram: '11am-1pm EST',
  };

  return times[platform] || 'Anytime';
}

/**
 * Format share count for display
 */
export function formatShareCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Get share URL for platform
 */
export function getShareUrl(
  platform: string,
  url: string,
  title: string,
  description?: string
): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const urls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
  };

  return urls[platform] || url;
}

/**
 * Calculate social sharing score (for analytics)
 */
export function calculateSocialScore(metrics: {
  shares: number;
  likes: number;
  comments: number;
  clicks: number;
}): number {
  // Weighted scoring
  const weights = {
    shares: 10, // Most valuable
    likes: 2,
    comments: 5,
    clicks: 1,
  };

  return (
    metrics.shares * weights.shares +
    metrics.likes * weights.likes +
    metrics.comments * weights.comments +
    metrics.clicks * weights.clicks
  );
}

/**
 * Generate hashtags for tool sharing
 */
export function generateHashtags(
  category: string,
  toolName: string
): string[] {
  const baseHashtags = ['AI', 'AITools', 'Productivity'];
  const categoryHashtags: Record<string, string[]> = {
    writing: ['Writing', 'ContentCreation', 'Copywriting'],
    image: ['AIArt', 'ImageGeneration', 'DigitalArt'],
    video: ['VideoEditing', 'AIVideo', 'ContentCreation'],
    code: ['Coding', 'Programming', 'DevTools'],
    chat: ['Chatbot', 'AI', 'Automation'],
    productivity: ['Productivity', 'WorkTools', 'Efficiency'],
    marketing: ['Marketing', 'DigitalMarketing', 'GrowthHacking'],
    design: ['Design', 'UIDesign', 'CreativeTools'],
    audio: ['AI', 'VoiceAI', 'AudioTools'],
    research: ['Research', 'AIResearch', 'DataAnalysis'],
  };

  const toolHashtag = toolName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

  return [
    ...baseHashtags,
    ...(categoryHashtags[category] || []),
    toolHashtag,
  ].slice(0, 5); // Max 5 hashtags
}
