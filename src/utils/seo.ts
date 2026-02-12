// SEO Utility Functions

import type { Tool, Review, Category } from '@/types';
import { stripHtml, truncate, calculateReadTime } from './helpers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai';
const SITE_NAME = 'ToolForge AI';
const TWITTER_HANDLE = '@toolforgeai';

/**
 * Generate meta tags for a page
 */
export function generateMetaTags({
  title,
  description,
  keywords = [],
  canonical,
  noindex = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
}) {
  return {
    title,
    description: truncate(description, 160),
    keywords: keywords.join(', '),
    alternates: canonical ? { canonical } : undefined,
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Generate Open Graph tags
 */
export function generateOpenGraphTags({
  title,
  description,
  type = 'website',
  images = [],
  url,
}: {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'product';
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  url?: string;
}) {
  return {
    type,
    locale: 'en_US',
    siteName: SITE_NAME,
    title,
    description: truncate(description, 200),
    url: url || SITE_URL,
    images: images.length > 0 ? images : [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  };
}

/**
 * Generate Twitter Card tags
 */
export function generateTwitterCardTags({
  title,
  description,
  images = [],
  creator = TWITTER_HANDLE,
}: {
  title: string;
  description: string;
  images?: string[];
  creator?: string;
}) {
  return {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator,
    title: truncate(title, 70),
    description: truncate(description, 200),
    images: images.length > 0 ? images : [`${SITE_URL}/og-image.png`],
  };
}

/**
 * Generate Schema.org structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Discover, compare, and choose the best AI tools for your needs',
    sameAs: [
      'https://twitter.com/toolforgeai',
      'https://linkedin.com/company/toolforgeai',
    ],
  };
}

/**
 * Generate Schema.org structured data for Product (AI Tool)
 */
export function generateProductSchema(tool: Tool) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    image: tool.screenshot_url || tool.logo_url,
    brand: {
      '@type': 'Brand',
      name: tool.name,
    },
  };

  // Add rating if available
  if (tool.rating > 0 && tool.review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tool.rating.toFixed(1),
      reviewCount: tool.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add offers (pricing)
  if (tool.pricing_model) {
    schema.offers = {
      '@type': 'Offer',
      price: tool.starting_price ? parseFloat(tool.starting_price.replace(/[^0-9.]/g, '')) : 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: tool.website_url,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  }

  return schema;
}

/**
 * Generate Schema.org structured data for Review
 */
export function generateReviewSchema(tool: Tool, review: Review) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: tool.name,
      description: tool.description,
      image: tool.screenshot_url || tool.logo_url,
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: review.rating
      ? {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    reviewBody: stripHtml(review.content),
    datePublished: review.published_at || review.created_at,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

/**
 * Generate Schema.org BreadcrumbList
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Schema.org ItemList for category pages
 */
export function generateItemListSchema(
  tools: Tool[],
  category?: Category,
  url?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category ? `${category.name} AI Tools` : 'AI Tools',
    description: category?.description || 'Curated list of AI tools',
    url: url || SITE_URL,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: tool.name,
        description: tool.description,
        url: `${SITE_URL}/tools/${tool.slug}`,
        image: tool.screenshot_url || tool.logo_url,
      },
    })),
  };
}

/**
 * Extract keywords from content
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Remove HTML and common words
  const cleaned = stripHtml(text).toLowerCase();
  const commonWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'of', 'to', 'in', 'for',
    'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'and', 'but',
    'or', 'if', 'this', 'that', 'these', 'those',
  ]);

  // Extract words (minimum 3 characters)
  const words = cleaned.match(/\b[a-z]{3,}\b/g) || [];

  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    if (!commonWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Generate dynamic OG image URL
 */
export function generateOgImageUrl(params: {
  title: string;
  category?: string;
  rating?: number;
}): string {
  const searchParams = new URLSearchParams({
    title: params.title,
    ...(params.category && { category: params.category }),
    ...(params.rating && { rating: params.rating.toString() }),
  });

  return `${SITE_URL}/api/og?${searchParams.toString()}`;
}

/**
 * Generate meta tags for tool page
 */
export function generateToolMetadata(tool: Tool, review?: Review) {
  const title = `${tool.name} Review - ${tool.tagline || 'AI Tool'} | ${SITE_NAME}`;
  const description = review
    ? truncate(stripHtml(review.content), 160)
    : truncate(tool.description, 160);

  const keywords = [
    tool.name.toLowerCase(),
    tool.category,
    ...tool.tags,
    'ai tool',
    'review',
    'pricing',
    tool.pricing_model,
  ];

  const ogImage = generateOgImageUrl({
    title: tool.name,
    category: tool.category,
    rating: tool.rating,
  });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: generateCanonicalUrl(`/tools/${tool.slug}`),
    },
    openGraph: generateOpenGraphTags({
      title: `${tool.name} - ${tool.tagline || 'AI Tool'}`,
      description,
      type: 'product',
      url: generateCanonicalUrl(`/tools/${tool.slug}`),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    }),
    twitter: generateTwitterCardTags({
      title,
      description,
      images: [ogImage],
    }),
  };
}

/**
 * Generate meta tags for category page
 */
export function generateCategoryMetadata(category: Category, toolCount: number) {
  const title = `${category.name} AI Tools - Best ${category.name} Software | ${SITE_NAME}`;
  const description =
    category.description ||
    `Discover the best ${category.name} AI tools. Compare features, pricing, and reviews of ${toolCount}+ ${category.name} tools.`;

  const keywords = [
    `${category.name.toLowerCase()} ai tools`,
    `best ${category.name.toLowerCase()} software`,
    `${category.name.toLowerCase()} automation`,
    'ai tools',
    category.name.toLowerCase(),
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: generateCanonicalUrl(`/category/${category.slug}`),
    },
    openGraph: generateOpenGraphTags({
      title,
      description,
      type: 'website',
      url: generateCanonicalUrl(`/category/${category.slug}`),
    }),
    twitter: generateTwitterCardTags({
      title,
      description,
    }),
  };
}

/**
 * Calculate reading time for content
 */
export function getReadingTime(content: string): number {
  return calculateReadTime(stripHtml(content));
}

/**
 * Generate social share URL
 */
export function generateShareUrl(platform: 'twitter' | 'linkedin' | 'facebook', params: {
  url: string;
  title: string;
  description?: string;
}): string {
  const encodedUrl = encodeURIComponent(params.url);
  const encodedTitle = encodeURIComponent(params.title);
  const encodedDescription = params.description
    ? encodeURIComponent(params.description)
    : '';

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=toolforgeai`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    default:
      return params.url;
  }
}
