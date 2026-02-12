// AI-Powered Meta Description Generator
// Automatically generates compelling meta descriptions optimized for CTR

import type { Tool, BlogPost, Category } from '@/types';

/**
 * Generate compelling meta description for tool pages
 */
export function generateToolMetaDescription(tool: Tool): string {
  const templates = [
    `Discover ${tool.name} - ${tool.tagline}. Read our comprehensive review, compare pricing, and explore key features of this ${tool.category} AI tool.`,
    `${tool.name} review: ${tool.tagline}. Learn about pricing, features, pros & cons. ${tool.rating > 4 ? 'Highly rated' : 'Detailed analysis'} of this ${tool.category} tool.`,
    `Looking for ${tool.category} solutions? Explore ${tool.name} - ${tool.tagline}. Compare features, pricing (${tool.pricing_model}), and user reviews.`,
    `${tool.name} - The ${tool.category} tool that ${tool.tagline.toLowerCase()}. Get pricing info, feature breakdown, and expert review.`,
  ];

  // Select template based on available data
  if (tool.rating > 4.0 && tool.review_count > 10) {
    return templates[1];
  } else if (tool.pricing_model === 'free') {
    return `${tool.name} - Free ${tool.category} tool. ${tool.tagline}. Read our complete review, explore features, and start using this AI tool today.`;
  } else if (tool.starting_price) {
    return `${tool.name} review: ${tool.tagline}. Starting at ${tool.starting_price}. Compare features, pricing plans, and see why it's a top ${tool.category} tool.`;
  }

  return templates[0];
}

/**
 * Generate meta description for blog posts
 */
export function generateBlogMetaDescription(post: BlogPost): string {
  if (post.seo_description) {
    return post.seo_description;
  }

  if (post.excerpt) {
    return truncateText(post.excerpt, 155);
  }

  // Extract first paragraph from content
  const content = stripHtml(post.content);
  const firstParagraph = content.split('\n\n')[0];
  return truncateText(firstParagraph, 155);
}

/**
 * Generate meta description for category pages
 */
export function generateCategoryMetaDescription(category: Category, toolCount: number): string {
  const templates = [
    `Explore ${toolCount}+ best ${category.name} AI tools. Compare features, pricing, and reviews. Find the perfect ${category.name} solution for your needs.`,
    `Browse our curated list of ${toolCount} ${category.name} AI tools. Read expert reviews, compare pricing, and discover the best ${category.name} software.`,
    `Top ${category.name} AI tools for 2026. Compare ${toolCount}+ solutions, read reviews, and find the perfect tool. Free and paid options available.`,
  ];

  if (category.description) {
    return truncateText(category.description, 155);
  }

  return templates[0];
}

/**
 * Generate meta description for comparison pages
 */
export function generateComparisonMetaDescription(toolNames: string[], category: string): string {
  const toolList = toolNames.slice(0, 3).join(' vs ');
  return `${toolList} comparison: Which ${category} AI tool is best? Compare features, pricing, pros & cons. Make an informed decision with our detailed analysis.`;
}

/**
 * Generate meta description for collection pages
 */
export function generateCollectionMetaDescription(title: string, description: string, toolCount: number): string {
  if (description) {
    return truncateText(description, 155);
  }

  return `${title}: Explore our curated collection of ${toolCount} AI tools. Compare features, pricing, and find the perfect solution for your needs.`;
}

/**
 * Generate title tag variations for A/B testing
 */
export function generateTitleVariations(baseName: string, type: 'tool' | 'category' | 'blog'): string[] {
  switch (type) {
    case 'tool':
      return [
        `${baseName} Review - Features, Pricing & Alternatives | ToolForge AI`,
        `${baseName}: Complete Review & Pricing Guide 2026`,
        `${baseName} - Honest Review, Features & Pricing`,
        `Is ${baseName} Worth It? Complete Review & Analysis`,
      ];
    case 'category':
      return [
        `Best ${baseName} AI Tools 2026 - Reviews & Comparisons`,
        `${baseName} AI Tools: Top Picks & Reviews`,
        `${baseName} Software - Compare Best AI Tools`,
        `Top ${baseName} AI Tools - Expert Reviews`,
      ];
    case 'blog':
      return [
        `${baseName} | ToolForge AI Blog`,
        `${baseName} - Guide & Tips`,
        `${baseName}: Everything You Need to Know`,
      ];
  }
}

/**
 * Optimize meta description for CTR
 * Adds power words and calls to action
 */
export function optimizeMetaDescription(description: string): string {
  const powerWords = ['discover', 'explore', 'learn', 'compare', 'find', 'get'];
  const ctas = ['Read our review', 'Compare now', 'Explore features', 'Learn more', 'Get started'];

  // Add CTA if not present
  const hasCTA = ctas.some(cta => description.toLowerCase().includes(cta.toLowerCase()));

  if (!hasCTA && description.length < 130) {
    const randomCTA = ctas[Math.floor(Math.random() * ctas.length)];
    description = `${description.trim()} ${randomCTA}.`;
  }

  return truncateText(description, 155);
}

/**
 * Generate keywords from content
 */
export function generateKeywords(content: string, baseKeywords: string[] = []): string[] {
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const frequency: Record<string, number> = {};

  // Common words to exclude
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'they', 'have', 'been', 'their',
    'which', 'about', 'would', 'there', 'could', 'other', 'make',
  ]);

  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  const topWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return [...new Set([...baseKeywords, ...topWords])].slice(0, 15);
}

/**
 * Calculate keyword density
 */
export function calculateKeywordDensity(content: string, keyword: string): number {
  const contentLower = content.toLowerCase();
  const keywordLower = keyword.toLowerCase();

  const totalWords = contentLower.split(/\s+/).length;
  const keywordOccurrences = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;

  return (keywordOccurrences / totalWords) * 100;
}

/**
 * Generate long-tail keyword suggestions
 */
export function generateLongTailKeywords(baseTerm: string, category: string): string[] {
  const modifiers = [
    'best', 'top', 'free', 'affordable', 'professional', 'enterprise',
    'small business', 'beginners', 'advanced', 'easy to use',
  ];

  const suffixes = [
    'review', 'pricing', 'features', 'alternatives', 'comparison',
    'guide', 'tutorial', 'tips', 'vs', 'for teams',
  ];

  const keywords: string[] = [];

  // Base + modifier
  modifiers.forEach(mod => {
    keywords.push(`${mod} ${baseTerm}`);
    keywords.push(`${mod} ${category} tool`);
  });

  // Base + suffix
  suffixes.forEach(suffix => {
    keywords.push(`${baseTerm} ${suffix}`);
  });

  // Combined
  keywords.push(`${baseTerm} ${category} tool review`);
  keywords.push(`best ${baseTerm} alternatives`);
  keywords.push(`${baseTerm} vs competitors`);

  return keywords;
}

/**
 * Helper: Strip HTML tags
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Helper: Truncate text to max length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');

  return truncated.slice(0, lastSpace) + '...';
}

/**
 * Generate structured snippet data
 */
export function generateStructuredSnippet(tool: Tool) {
  return {
    name: tool.name,
    category: tool.category,
    price: tool.pricing_model === 'free' ? 'Free' : tool.starting_price,
    rating: tool.rating > 0 ? `${tool.rating.toFixed(1)}/5` : undefined,
    features: tool.features.slice(0, 5),
  };
}

/**
 * Analyze content for SEO score
 */
export function analyzeSEOScore(params: {
  title: string;
  description: string;
  content: string;
  targetKeyword: string;
}): {
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Title checks
  if (params.title.length < 30) {
    issues.push('Title is too short (min 30 characters)');
    score -= 10;
  }
  if (params.title.length > 60) {
    issues.push('Title is too long (max 60 characters)');
    score -= 10;
  }
  if (!params.title.toLowerCase().includes(params.targetKeyword.toLowerCase())) {
    issues.push('Target keyword not in title');
    score -= 15;
  }

  // Description checks
  if (params.description.length < 120) {
    issues.push('Meta description is too short (min 120 characters)');
    score -= 10;
  }
  if (params.description.length > 160) {
    issues.push('Meta description is too long (max 160 characters)');
    score -= 5;
  }

  // Content checks
  const keywordDensity = calculateKeywordDensity(params.content, params.targetKeyword);
  if (keywordDensity < 0.5) {
    suggestions.push('Increase keyword density (currently too low)');
    score -= 5;
  }
  if (keywordDensity > 3) {
    issues.push('Keyword density too high (risk of keyword stuffing)');
    score -= 15;
  }

  // Word count
  const wordCount = params.content.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push('Add more content (min 300 words recommended)');
    score -= 10;
  }

  // Headings
  const hasH1 = /<h1[^>]*>/.test(params.content);
  const hasH2 = /<h2[^>]*>/.test(params.content);
  if (!hasH1) {
    issues.push('Missing H1 heading');
    score -= 10;
  }
  if (!hasH2) {
    suggestions.push('Add H2 headings for better structure');
    score -= 5;
  }

  return {
    score: Math.max(0, score),
    issues,
    suggestions,
  };
}
