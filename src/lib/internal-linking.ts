// Intelligent Internal Linking System
// Auto-suggests related tools and creates contextual links for SEO

import type { Tool } from '@/types';
import { supabase } from './supabase';

/**
 * Find related tools based on category, tags, and features
 */
export async function findRelatedTools(tool: Tool, limit: number = 6): Promise<Tool[]> {
  // Try to find tools with matching tags first
  const { data: tagMatches } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .neq('id', tool.id)
    .contains('tags', tool.tags)
    .limit(limit);

  if (tagMatches && tagMatches.length >= limit) {
    return tagMatches as Tool[];
  }

  // Fallback to same category
  const { data: categoryMatches } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .eq('category', tool.category)
    .neq('id', tool.id)
    .order('rating', { ascending: false })
    .limit(limit);

  return categoryMatches as Tool[] || [];
}

/**
 * Find tools mentioned in content and create link suggestions
 */
export async function findToolMentions(content: string): Promise<Array<{ tool: Tool; mentions: number }>> {
  // Get all published tools
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published');

  if (!tools) return [];

  const contentLower = content.toLowerCase();
  const mentions: Array<{ tool: Tool; mentions: number }> = [];

  tools.forEach((tool) => {
    const toolName = tool.name.toLowerCase();
    const regex = new RegExp(`\\b${toolName}\\b`, 'gi');
    const matches = contentLower.match(regex);

    if (matches && matches.length > 0) {
      mentions.push({
        tool: tool as Tool,
        mentions: matches.length,
      });
    }
  });

  // Sort by number of mentions
  return mentions.sort((a, b) => b.mentions - a.mentions);
}

/**
 * Auto-link tool mentions in HTML content
 */
export function autoLinkToolMentions(
  content: string,
  tools: Array<{ name: string; slug: string }>,
  maxLinks: number = 10
): string {
  let linkedContent = content;
  let linkCount = 0;

  // Keep track of already linked positions to avoid duplicate links
  const linkedPositions = new Set<number>();

  tools.forEach((tool) => {
    if (linkCount >= maxLinks) return;

    // Match tool name (case-insensitive, whole word)
    const regex = new RegExp(`\\b(${tool.name})\\b(?![^<]*>)`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null && linkCount < maxLinks) {
      const position = match.index;

      // Check if this position is already linked or inside an HTML tag
      if (linkedPositions.has(position)) continue;

      // Check if already inside a link tag
      const beforeMatch = content.substring(0, position);
      const insideLink = (beforeMatch.match(/<a[^>]*>/g) || []).length >
                        (beforeMatch.match(/<\/a>/g) || []).length;

      if (insideLink) continue;

      // Create the link
      const toolLink = `<a href="/tools/${tool.slug}" class="text-primary-600 hover:text-primary-700 underline" title="${tool.name} Review">${match[1]}</a>`;

      // Replace first occurrence only
      linkedContent = linkedContent.replace(match[0], toolLink);
      linkedPositions.add(position);
      linkCount++;
      break; // Only link first occurrence of each tool
    }
  });

  return linkedContent;
}

/**
 * Generate topic clusters for content organization
 */
export async function generateTopicClusters(): Promise<Map<string, Tool[]>> {
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('rating', { ascending: false });

  if (!tools) return new Map();

  const clusters = new Map<string, Tool[]>();

  tools.forEach((tool) => {
    const category = tool.category;
    if (!clusters.has(category)) {
      clusters.set(category, []);
    }
    clusters.get(category)!.push(tool as Tool);
  });

  return clusters;
}

/**
 * Suggest contextual internal links for a page
 */
export async function suggestInternalLinks(params: {
  currentPageType: 'tool' | 'blog' | 'category';
  currentSlug: string;
  keywords: string[];
  limit?: number;
}): Promise<Array<{ title: string; url: string; relevance: number }>> {
  const suggestions: Array<{ title: string; url: string; relevance: number }> = [];

  // Get related tools
  const { data: tools } = await supabase
    .from('tools')
    .select('name, slug, tags, category')
    .eq('status', 'published')
    .limit(params.limit || 10);

  // Get related blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug, keywords, category')
    .eq('status', 'published')
    .limit(params.limit || 10);

  // Calculate relevance scores for tools
  tools?.forEach((tool) => {
    let relevance = 0;

    params.keywords.forEach(keyword => {
      if (tool.name.toLowerCase().includes(keyword.toLowerCase())) relevance += 3;
      if (tool.category.toLowerCase().includes(keyword.toLowerCase())) relevance += 2;
      if (tool.tags.some((tag: string) => tag.toLowerCase().includes(keyword.toLowerCase()))) relevance += 1;
    });

    if (relevance > 0) {
      suggestions.push({
        title: `${tool.name} Review`,
        url: `/tools/${tool.slug}`,
        relevance,
      });
    }
  });

  // Calculate relevance scores for blog posts
  posts?.forEach((post) => {
    let relevance = 0;

    params.keywords.forEach(keyword => {
      if (post.title.toLowerCase().includes(keyword.toLowerCase())) relevance += 3;
      if (post.keywords?.some((kw: string) => kw.toLowerCase().includes(keyword.toLowerCase()))) relevance += 2;
      if (post.category.toLowerCase().includes(keyword.toLowerCase())) relevance += 1;
    });

    if (relevance > 0) {
      suggestions.push({
        title: post.title,
        url: `/blog/${post.slug}`,
        relevance,
      });
    }
  });

  // Sort by relevance and return top suggestions
  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, params.limit || 10);
}

/**
 * Generate breadcrumb structure for SEO
 */
export interface Breadcrumb {
  name: string;
  url: string;
}

export function generateBreadcrumbs(path: string, pageName?: string): Breadcrumb[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [
    { name: 'Home', url: '/' },
  ];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Capitalize and format segment name
    let name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Use custom name for last segment if provided
    if (index === segments.length - 1 && pageName) {
      name = pageName;
    }

    breadcrumbs.push({
      name,
      url: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Find similar content based on tags and keywords
 */
export async function findSimilarContent(params: {
  contentType: 'tool' | 'blog' | 'comparison';
  tags: string[];
  category?: string;
  excludeId?: string;
  limit?: number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any[]> {
  const limit = params.limit || 6;

  switch (params.contentType) {
    case 'tool':
      const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'published')
        .neq('id', params.excludeId || '')
        .or(`category.eq.${params.category},tags.cs.{${params.tags.join(',')}}`)
        .limit(limit);
      return tools || [];

    case 'blog':
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .neq('id', params.excludeId || '')
        .or(`category.eq.${params.category},tags.cs.{${params.tags.join(',')}}`)
        .limit(limit);
      return posts || [];

    case 'comparison':
      const { data: comparisons } = await supabase
        .from('comparisons')
        .select('*')
        .eq('status', 'published')
        .neq('id', params.excludeId || '')
        .limit(limit);
      return comparisons || [];

    default:
      return [];
  }
}

/**
 * Build internal link network for a category
 */
export async function buildLinkNetwork(category: string): Promise<{
  pillarPage: string;
  clusterPages: Array<{ title: string; url: string }>;
  supportingContent: Array<{ title: string; url: string }>;
}> {
  // Get category page as pillar
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: categoryData } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', category.toLowerCase())
    .single();

  // Get all tools in category
  const { data: tools } = await supabase
    .from('tools')
    .select('name, slug')
    .eq('status', 'published')
    .eq('category', category)
    .limit(20);

  // Get related blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug')
    .eq('status', 'published')
    .eq('category', category)
    .limit(10);

  return {
    pillarPage: `/category/${category.toLowerCase()}`,
    clusterPages: (tools || []).map(tool => ({
      title: tool.name,
      url: `/tools/${tool.slug}`,
    })),
    supportingContent: (posts || []).map(post => ({
      title: post.title,
      url: `/blog/${post.slug}`,
    })),
  };
}

/**
 * Calculate internal PageRank-like score for prioritizing links
 */
export function calculateLinkPriority(params: {
  targetRating: number;
  targetViews: number;
  relevanceScore: number;
  isRecent: boolean;
}): number {
  let priority = 0;

  // Rating weight (0-5 stars)
  priority += (params.targetRating / 5) * 30;

  // Views weight (normalize to 0-30)
  priority += Math.min((params.targetViews / 1000) * 30, 30);

  // Relevance weight (0-100)
  priority += params.relevanceScore * 0.3;

  // Recency bonus
  if (params.isRecent) {
    priority += 10;
  }

  return Math.round(priority);
}
