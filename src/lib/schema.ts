// Advanced Schema.org Generators for SEO
// Comprehensive structured data for enhanced search visibility

import type { Tool, BlogPost, Comparison, Collection } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai';
const SITE_NAME = 'ToolForge AI';

/**
 * Generate SoftwareApplication schema for AI tools
 * More specific than Product schema for software
 */
export function generateSoftwareApplicationSchema(tool: Tool) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: tool.pricing_model === 'free' ? '0' :
             tool.starting_price ? parseFloat(tool.starting_price.replace(/[^0-9.]/g, '')) : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  // Add screenshot/image
  if (tool.screenshot_url) {
    schema.screenshot = tool.screenshot_url;
  }
  if (tool.logo_url) {
    schema.image = tool.logo_url;
  }

  // Add aggregate rating
  if (tool.rating > 0 && tool.review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tool.rating.toFixed(1),
      reviewCount: tool.review_count,
      bestRating: '5',
      worstRating: '1',
    };
  }

  // Add features
  if (tool.features && tool.features.length > 0) {
    schema.featureList = tool.features.join(', ');
  }

  // Add software version if available
  schema.softwareVersion = '1.0';

  // Add author/creator
  schema.author = {
    '@type': 'Organization',
    name: tool.name,
  };

  return schema;
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.seo_description,
    image: post.featured_image || `${SITE_URL}/og-image.png`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords?.join(', ') || '',
    articleSection: post.category,
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    })),
  };
}

/**
 * Generate HowTo schema for guides
 */
export function generateHowToSchema(params: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    totalTime: params.totalTime,
    estimatedCost: params.estimatedCost,
    step: params.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
}

/**
 * Generate ItemList schema for collections
 */
export function generateCollectionSchema(collection: Collection, tools: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collection.name,
    description: collection.description,
    url: `${SITE_URL}/collections/${collection.slug}`,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: `${SITE_URL}/tools/${tool.slug}`,
        image: tool.logo_url || tool.screenshot_url,
        applicationCategory: 'BusinessApplication',
      },
    })),
  };
}

/**
 * Generate Comparison table schema
 */
export function generateComparisonSchema(comparison: Comparison, tools: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComparisonTable',
    name: comparison.title,
    description: comparison.description,
    itemsCompared: tools.map((tool) => ({
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
      offers: {
        '@type': 'Offer',
        price: tool.pricing_model === 'free' ? '0' :
               tool.starting_price ? parseFloat(tool.starting_price.replace(/[^0-9.]/g, '')) : undefined,
        priceCurrency: 'USD',
      },
      aggregateRating: tool.rating > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: tool.rating.toFixed(1),
        reviewCount: tool.review_count,
      } : undefined,
    })),
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Discover, compare, and choose the best AI tools for your needs',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate LocalBusiness schema (if applicable)
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Comprehensive AI tools directory and review platform',
    sameAs: [
      'https://twitter.com/toolforgeai',
      'https://linkedin.com/company/toolforgeai',
      'https://facebook.com/toolforgeai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@toolforge.ai',
    },
  };
}

/**
 * Generate VideoObject schema for video content
 */
export function generateVideoSchema(params: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: params.name,
    description: params.description,
    thumbnailUrl: params.thumbnailUrl,
    uploadDate: params.uploadDate,
    duration: params.duration,
    contentUrl: params.contentUrl,
  };
}

/**
 * Generate Course schema for tutorials
 */
export function generateCourseSchema(params: {
  name: string;
  description: string;
  provider: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: params.name,
    description: params.description,
    provider: {
      '@type': 'Organization',
      name: params.provider,
      url: SITE_URL,
    },
    url: params.url,
  };
}

/**
 * Generate Rating schema
 */
export function generateRatingSchema(rating: number, reviewCount: number) {
  return {
    '@type': 'AggregateRating',
    ratingValue: rating.toFixed(1),
    reviewCount: reviewCount,
    bestRating: '5',
    worstRating: '1',
  };
}

/**
 * Combine multiple schemas into a graph
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateSchemaGraph(schemas: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
