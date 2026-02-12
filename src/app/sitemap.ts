// Dynamic Sitemap Generation

import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import type { Tool, Category } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published tools
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, updated_at, created_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .order('order', { ascending: true });

  // Fetch all published blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Fetch all published comparisons
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  // Fetch all published collections
  const { data: collections } = await supabase
    .from('collections')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Tool pages
  const toolPages =
    tools?.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: new Date(tool.updated_at || tool.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];

  // Category pages
  const categoryPages =
    categories?.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })) || [];

  // Blog post pages
  const blogPages =
    blogPosts?.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

  // Comparison pages
  const comparisonPages =
    comparisons?.map((comparison) => ({
      url: `${SITE_URL}/compare/${comparison.slug}`,
      lastModified: new Date(comparison.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

  // Collection pages
  const collectionPages =
    collections?.map((collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      lastModified: new Date(collection.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

  return [
    ...staticPages,
    ...toolPages,
    ...categoryPages,
    ...blogPages,
    ...comparisonPages,
    ...collectionPages,
  ];
}
