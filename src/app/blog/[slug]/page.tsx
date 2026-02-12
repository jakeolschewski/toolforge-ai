// Individual Blog Post Page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types';
import ReadingProgress from '@/components/blog/ReadingProgress';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Eye, Calendar, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 600;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const blogPost = post as BlogPost;

  return {
    title: blogPost.seo_title || `${blogPost.title} | ToolForge AI Blog`,
    description: blogPost.seo_description || blogPost.excerpt,
    keywords: blogPost.keywords.join(', '),
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt || blogPost.seo_description,
      type: 'article',
      publishedTime: blogPost.published_at || undefined,
      authors: [blogPost.author],
      images: blogPost.featured_image ? [{ url: blogPost.featured_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blogPost.title,
      description: blogPost.excerpt || blogPost.seo_description,
      images: blogPost.featured_image ? [blogPost.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  const blogPost = post as BlogPost;

  // Fetch related posts (same category, exclude current)
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', blogPost.category)
    .neq('id', blogPost.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const publishDate = blogPost.published_at
    ? new Date(blogPost.published_at)
    : new Date(blogPost.created_at);

  const currentUrl = `https://toolforge.ai/blog/${blogPost.slug}`;

  return (
    <>
      <ReadingProgress />

      <article className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-white/80">
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <Link href={`/blog?category=${blogPost.category}`} className="hover:text-white">
                {blogPost.category}
              </Link>
            </nav>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full">
                {blogPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {blogPost.title}
            </h1>

            {/* Excerpt */}
            {blogPost.excerpt && (
              <p className="text-xl text-white/90 mb-6">
                {blogPost.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blogPost.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={publishDate.toISOString()}>
                  {formatDistanceToNow(publishDate, { addSuffix: true })}
                </time>
              </div>
              {blogPost.read_time && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blogPost.read_time} min read</span>
                  </div>
                </>
              )}
              {blogPost.views > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{blogPost.views.toLocaleString()} views</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blogPost.featured_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={blogPost.featured_image}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 lg:p-12">
            {/* Share Buttons */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share this article
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blogPost.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(blogPost.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts as BlogPost[]} />
            )}
          </div>
        </div>

        {/* Schema.org Article Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: blogPost.title,
              description: blogPost.excerpt || blogPost.seo_description,
              image: blogPost.featured_image,
              datePublished: blogPost.published_at || blogPost.created_at,
              dateModified: blogPost.updated_at,
              author: {
                '@type': 'Person',
                name: blogPost.author,
              },
              publisher: {
                '@type': 'Organization',
                name: 'ToolForge AI',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://toolforge.ai/logo.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': currentUrl,
              },
            }),
          }}
        />
      </article>
    </>
  );
}
