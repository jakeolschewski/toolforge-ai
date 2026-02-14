// AI Content Generation Cron Job
// Vercel Cron: Configure in vercel.json to run daily
// Generates 1-2 blog posts per day about AI tools

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyCronSecret } from '@/utils/helpers';
import { sendErrorNotification } from '@/lib/email';
import {
  generateBlogPost,
  generateToolComparison,
  saveGeneratedBlogPost,
  selectRandomTopic,
} from '@/lib/ai-content-generator';
import type { ApiResponse, Tool } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for Hobby plan

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  if (!verifyCronSecret(request)) {
    console.warn('Unauthorized cron attempt');
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if Anthropic API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not configured');
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'ANTHROPIC_API_KEY not configured',
      },
      { status: 500 }
    );
  }

  const startTime = Date.now();
  const results = {
    blogPostsGenerated: 0,
    comparisonsGenerated: 0,
    errors: 0,
    topics: [] as string[],
  };

  try {
    console.log('🚀 Starting AI content generation...');

    // Decide what to generate (70% blog posts, 30% comparisons)
    const shouldGenerateComparison = Math.random() < 0.3;

    if (shouldGenerateComparison) {
      // Generate a tool comparison
      console.log('📊 Generating tool comparison...');
      await generateComparisonContent(results);
    } else {
      // Generate 1-2 blog posts
      const postCount = Math.random() < 0.5 ? 1 : 2;
      console.log(`📝 Generating ${postCount} blog post(s)...`);

      for (let i = 0; i < postCount; i++) {
        await generateBlogContent(results);

        // Add delay between generations to avoid rate limits
        if (i < postCount - 1) {
          await delay(2000);
        }
      }
    }

    const duration = Date.now() - startTime;

    const summary = {
      ...results,
      duration,
      message: `Generated ${results.blogPostsGenerated} blog post(s) and ${results.comparisonsGenerated} comparison(s)`,
    };

    console.log('✨ Content generation complete:', summary);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: summary,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Content generation failed';

    console.error('❌ Content generation cron error:', error);

    // Send error notification email
    try {
      await sendErrorNotification(errorMessage, {
        ...results,
        duration,
      });
    } catch (emailError) {
      console.error('Failed to send error notification email:', emailError);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: errorMessage,
        data: {
          ...results,
          duration,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Generate a blog post about trending AI tools
 */
async function generateBlogContent(results: {
  blogPostsGenerated: number;
  errors: number;
  topics: string[];
}): Promise<void> {
  try {
    // Select a random topic
    const topic = selectRandomTopic();
    results.topics.push(topic);

    console.log(`📝 Topic: ${topic}`);

    // Fetch trending tools for the post
    const tools = await fetchToolsForPost();

    if (tools.length === 0) {
      console.warn('⚠️  No tools available for blog post generation');
      results.errors++;
      return;
    }

    console.log(`🔧 Using ${tools.length} tools: ${tools.map((t) => t.name).join(', ')}`);

    // Generate content with Claude
    const generatedContent = await generateBlogPost({
      tools,
      topic,
      keywords: extractKeywordsFromTopic(topic),
      includeAffiliate: true,
      category: 'AI Tools',
    });

    // Add affiliate links to content
    const contentWithAffiliates = addAffiliateLinks(generatedContent.content, tools);
    generatedContent.content = contentWithAffiliates;

    // Save to database (as published)
    await saveGeneratedBlogPost(generatedContent, 'published');

    results.blogPostsGenerated++;
    console.log(`✅ Blog post generated: ${generatedContent.title}`);
  } catch (error) {
    console.error('❌ Error generating blog post:', error);
    results.errors++;
  }
}

/**
 * Generate a comparison between tools
 */
async function generateComparisonContent(results: {
  comparisonsGenerated: number;
  errors: number;
  topics: string[];
}): Promise<void> {
  try {
    // Find 2-3 tools in the same category for comparison
    const tools = await fetchToolsForComparison();

    if (tools.length < 2) {
      console.warn('⚠️  Not enough tools for comparison');
      results.errors++;
      return;
    }

    console.log(`🔧 Comparing: ${tools.map((t) => t.name).join(' vs ')}`);

    const toolIds = tools.map((t) => t.id);
    const generatedContent = await generateToolComparison(toolIds);

    // Add affiliate links
    const contentWithAffiliates = addAffiliateLinks(generatedContent.content, tools);
    generatedContent.content = contentWithAffiliates;

    // Save to database
    await saveGeneratedBlogPost(generatedContent, 'published');

    results.comparisonsGenerated++;
    results.topics.push(generatedContent.title);
    console.log(`✅ Comparison generated: ${generatedContent.title}`);
  } catch (error) {
    console.error('❌ Error generating comparison:', error);
    results.errors++;
  }
}

/**
 * Fetch trending tools for blog post
 */
async function fetchToolsForPost(): Promise<Tool[]> {
  // Get top trending tools (by clicks and views)
  const { data: trending, error: trendingError } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('clicks', { ascending: false })
    .limit(10);

  if (trendingError || !trending || trending.length === 0) {
    console.warn('No trending tools found, fetching recent tools instead');

    // Fallback to recently published tools
    const { data: recent, error: recentError } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    if (recentError || !recent) {
      return [];
    }

    return recent as Tool[];
  }

  // Randomly select 3-5 tools from top 10
  const count = Math.floor(Math.random() * 3) + 3; // 3-5 tools
  const shuffled = trending.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count) as Tool[];
}

/**
 * Fetch tools for comparison (same category)
 */
async function fetchToolsForComparison(): Promise<Tool[]> {
  // Get popular categories
  const { data: categories } = await supabaseAdmin
    .from('tools')
    .select('category')
    .eq('status', 'published')
    .limit(100);

  if (!categories || categories.length === 0) {
    return [];
  }

  // Count tools per category
  const categoryCounts: Record<string, number> = {};
  categories.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Find category with most tools
  const popularCategory = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Top 5 categories
    .map(([cat]) => cat);

  // Pick a random category from top 5
  const selectedCategory = popularCategory[Math.floor(Math.random() * popularCategory.length)];

  // Get 2-3 tools from that category
  const { data: tools } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .eq('category', selectedCategory)
    .order('clicks', { ascending: false })
    .limit(5);

  if (!tools || tools.length < 2) {
    return [];
  }

  // Randomly select 2 or 3 tools
  const count = Math.min(3, tools.length);
  const shuffled = tools.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count) as Tool[];
}

/**
 * Extract keywords from topic
 */
function extractKeywordsFromTopic(topic: string): string[] {
  const keywords: string[] = [];

  // Extract main keywords from topic
  const words = topic.toLowerCase().split(' ');
  const stopWords = ['the', 'for', 'and', 'in', 'to', 'a', 'of', 'that'];

  words.forEach((word) => {
    if (!stopWords.includes(word) && word.length > 3) {
      keywords.push(word);
    }
  });

  // Add common AI tool keywords
  keywords.push('AI tools', 'artificial intelligence', 'productivity', 'automation');

  return keywords.slice(0, 7); // Max 7 keywords
}

/**
 * Add affiliate links to content
 */
function addAffiliateLinks(content: string, tools: Tool[]): string {
  let updatedContent = content;

  for (const tool of tools) {
    if (!tool.affiliate_link) continue;

    // Replace tool website links with affiliate links
    const websitePattern = new RegExp(
      `\\[([^\\]]+)\\]\\(${escapeRegex(tool.website_url)}\\)`,
      'gi'
    );
    const affiliateMarkdown = `[$1](${tool.affiliate_link}?ref=toolforge&utm_source=toolforge&utm_medium=blog&utm_campaign=${tool.slug})`;
    updatedContent = updatedContent.replace(websitePattern, affiliateMarkdown);

    // Also replace plain mentions of tool slug links
    // Keep internal links but add affiliate CTA nearby
    // Don't replace internal links with affiliate links
  }

  return updatedContent;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// POST endpoint for manual trigger
export async function POST(request: NextRequest) {
  console.log('Manual content generation trigger');
  return GET(request);
}
