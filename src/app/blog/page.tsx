// Blog Listing Page

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogCategory } from '@/types';
import BlogGrid from '@/components/blog/BlogGrid';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Blog - Latest News, Guides & Tutorials | ToolForge AI',
  description: 'Discover the latest AI news, tool reviews, tutorials, and industry insights. Stay updated with comprehensive guides on AI tools and productivity tips.',
  keywords: 'AI blog, AI news, AI tutorials, AI tool reviews, productivity tips, AI industry trends',
  openGraph: {
    title: 'AI Blog - Latest News & Tutorials',
    description: 'Discover the latest AI news, tool reviews, and tutorials',
    type: 'website',
  },
};

export const revalidate = 600; // Revalidate every 10 minutes

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  // Fetch categories
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('order_index', { ascending: true });

  // Build query
  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (category) {
    query = query.eq('category', category);
  }

  query = query
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  const { data: posts, count } = await query;

  // Get featured post (most viewed)
  const { data: featuredPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(1);

  const featured = page === 1 && !category ? featuredPosts?.[0] : undefined;
  const regularPosts = featured
    ? (posts || []).filter((p) => p.id !== featured.id)
    : posts || [];

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI Blog & Resources
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Stay updated with the latest AI news, tool reviews, tutorials, and industry insights
          </p>
        </div>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  !category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Posts
              </Link>
              {categories.map((cat: BlogCategory) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    category === cat.slug
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogGrid posts={regularPosts as BlogPost[]} featured={featured as BlogPost | undefined} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?${category ? `category=${category}&` : ''}page=${page - 1}`}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Previous
              </Link>
            )}
            <div className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Page {page} of {totalPages}
            </div>
            {page < totalPages && (
              <Link
                href={`/blog?${category ? `category=${category}&` : ''}page=${page + 1}`}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
