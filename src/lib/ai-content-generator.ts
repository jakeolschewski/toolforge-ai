// AI Content Generator using Claude API
// Generates blog posts, comparisons, and SEO-optimized content

import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from './supabase';
import { slugify, calculateReadTime, stripHtml } from '@/utils/helpers';
import type { Tool } from '@/types';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface ContentGenerationOptions {
  tools?: Tool[];
  topic?: string;
  keywords?: string[];
  includeAffiliate?: boolean;
  category?: string;
  maxLength?: number;
}

export interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  category: string;
  tags: string[];
  featuredImage?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemaMarkup: Record<string, any>;
}

/**
 * Generate a blog post about AI tools using Claude
 */
export async function generateBlogPost(
  options: ContentGenerationOptions
): Promise<GeneratedContent> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tools, topic, keywords = [], category = 'AI Tools', maxLength = 2000 } = options;

  // Fetch related tools if not provided
  const relatedTools = tools || (await fetchTrendingTools(5));

  // Create the prompt for Claude
  const prompt = buildBlogPrompt(relatedTools, topic, keywords, category);

  console.log('🤖 Generating blog post with Claude API...');

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the content from Claude's response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const generatedText = content.text;

    // Parse the structured response
    const parsedContent = parseClaudeResponse(generatedText);

    // Enhance with schema markup
    const schemaMarkup = generateSchemaMarkup(parsedContent, relatedTools);

    // Add internal links to tools
    const contentWithLinks = addInternalLinks(parsedContent.content, relatedTools);

    console.log('✅ Blog post generated successfully');

    return {
      ...parsedContent,
      content: contentWithLinks,
      schemaMarkup,
    };
  } catch (error) {
    console.error('❌ Error generating content with Claude:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a tool comparison article
 */
export async function generateToolComparison(
  toolIds: string[]
): Promise<GeneratedContent> {
  if (toolIds.length < 2) {
    throw new Error('At least 2 tools are required for comparison');
  }

  console.log(`🔄 Generating comparison for ${toolIds.length} tools...`);

  // Fetch tool details
  const { data: tools, error } = await supabaseAdmin
    .from('tools')
    .select('*')
    .in('id', toolIds);

  if (error || !tools || tools.length < 2) {
    throw new Error('Failed to fetch tools for comparison');
  }

  const prompt = buildComparisonPrompt(tools as Tool[]);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const parsedContent = parseClaudeResponse(content.text);
  const schemaMarkup = generateComparisonSchema(parsedContent, tools as Tool[]);
  const contentWithLinks = addInternalLinks(parsedContent.content, tools as Tool[]);

  console.log('✅ Comparison generated successfully');

  return {
    ...parsedContent,
    content: contentWithLinks,
    schemaMarkup,
  };
}

/**
 * Generate SEO-optimized content for a specific tool
 */
export async function generateToolReview(tool: Tool): Promise<GeneratedContent> {
  console.log(`📝 Generating review for ${tool.name}...`);

  const prompt = buildToolReviewPrompt(tool);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const parsedContent = parseClaudeResponse(content.text);
  const schemaMarkup = generateReviewSchema(parsedContent, tool);

  console.log('✅ Review generated successfully');

  return {
    ...parsedContent,
    schemaMarkup,
  };
}

/**
 * Build the blog post prompt for Claude
 */
function buildBlogPrompt(
  tools: Tool[],
  topic?: string,
  keywords: string[] = [],
  category: string = 'AI Tools'
): string {
  const toolList = tools
    .map((t) => `- ${t.name}: ${t.description} (${t.website_url})`)
    .join('\n');

  const keywordList = keywords.length > 0 ? keywords.join(', ') : 'AI tools, productivity, automation';

  return `You are an expert AI tools content writer for ToolForge AI, a comprehensive AI tools directory.

Write a comprehensive, SEO-optimized blog post about ${topic || 'the latest AI tools for productivity'}.

Here are the tools to feature:
${toolList}

Requirements:
- Title: Catchy, SEO-friendly title (60 characters max)
- Content: Comprehensive article (1500-2000 words)
- Include H2 and H3 headings for structure
- Mention each tool naturally with its benefits
- Write in an engaging, professional tone
- Focus on practical use cases and benefits
- Include a clear conclusion with call-to-action
- Excerpt: Compelling summary (150-160 characters)
- SEO Title: Optimized for search (50-60 characters)
- SEO Description: Meta description (150-160 characters)
- Keywords: 5-7 relevant keywords including: ${keywordList}
- Category: ${category}
- Tags: 3-5 relevant tags

Format your response as JSON with the following structure:
{
  "title": "Main article title",
  "content": "Full article content in markdown format with H2 (##) and H3 (###) headings",
  "excerpt": "Brief summary",
  "seoTitle": "SEO-optimized title",
  "seoDescription": "Meta description",
  "keywords": ["keyword1", "keyword2", ...],
  "category": "${category}",
  "tags": ["tag1", "tag2", ...]
}

Write the article now:`;
}

/**
 * Build the comparison prompt for Claude
 */
function buildComparisonPrompt(tools: Tool[]): string {
  const toolDetails = tools
    .map(
      (t) => `
### ${t.name}
- Description: ${t.description}
- Pricing: ${t.pricing_model} ${t.starting_price ? `(starting at ${t.starting_price})` : ''}
- Features: ${t.features.join(', ')}
- Website: ${t.website_url}
`
    )
    .join('\n');

  const toolNames = tools.map((t) => t.name).join(' vs ');

  return `You are an expert AI tools reviewer for ToolForge AI.

Write a detailed comparison article between these AI tools:
${toolDetails}

Requirements:
- Title: "${toolNames}: Which AI Tool is Better in 2026?"
- Content: Comprehensive comparison (1500-2000 words)
- Include sections:
  - Introduction
  - Feature Comparison (use tables in markdown)
  - Pricing Comparison
  - Pros and Cons for each tool
  - Use Cases (when to use each tool)
  - Winner/Recommendation
- Be objective and balanced
- Highlight unique selling points
- Include practical examples
- SEO-optimized content

Format your response as JSON:
{
  "title": "Comparison title",
  "content": "Full comparison in markdown",
  "excerpt": "Brief summary",
  "seoTitle": "SEO title",
  "seoDescription": "Meta description",
  "keywords": ["keyword1", "keyword2", ...],
  "category": "Comparisons",
  "tags": ["tag1", "tag2", ...]
}`;
}

/**
 * Build the tool review prompt for Claude
 */
function buildToolReviewPrompt(tool: Tool): string {
  return `You are an expert AI tools reviewer for ToolForge AI.

Write a comprehensive, SEO-optimized review of this AI tool:

Tool Name: ${tool.name}
Tagline: ${tool.tagline || ''}
Description: ${tool.description}
Long Description: ${tool.long_description || ''}
Category: ${tool.category}
Pricing: ${tool.pricing_model} ${tool.starting_price ? `(starting at ${tool.starting_price})` : ''}
Features: ${tool.features.join(', ')}
Website: ${tool.website_url}

Requirements:
- Title: "${tool.name} Review: [Benefit-focused subtitle]"
- Content: In-depth review (1200-1500 words)
- Include sections:
  - Introduction
  - Key Features (detailed)
  - How It Works
  - Pricing & Plans
  - Pros and Cons
  - Who Should Use ${tool.name}
  - Alternatives to Consider
  - Final Verdict
- Be honest and balanced
- Include practical use cases
- SEO-optimized

Format your response as JSON:
{
  "title": "Review title",
  "content": "Full review in markdown",
  "excerpt": "Brief summary",
  "seoTitle": "SEO title",
  "seoDescription": "Meta description",
  "keywords": ["keyword1", "keyword2", ...],
  "category": "Reviews",
  "tags": ["tag1", "tag2", ...]
}`;
}

/**
 * Parse Claude's JSON response
 */
function parseClaudeResponse(response: string): Omit<GeneratedContent, 'schemaMarkup'> {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      title: parsed.title || 'Untitled',
      content: parsed.content || '',
      excerpt: parsed.excerpt || '',
      seoTitle: parsed.seoTitle || parsed.title,
      seoDescription: parsed.seoDescription || parsed.excerpt,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      category: parsed.category || 'AI Tools',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      featuredImage: parsed.featuredImage,
    };
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    throw new Error('Failed to parse AI-generated content');
  }
}

/**
 * Add internal links to tool pages
 */
function addInternalLinks(content: string, tools: Tool[]): string {
  let linkedContent = content;

  for (const tool of tools) {
    // Only link the first occurrence of each tool name
    const regex = new RegExp(`\\b(${tool.name})\\b(?![^<]*<\\/a>)`, 'i');
    linkedContent = linkedContent.replace(
      regex,
      `[$1](/tools/${tool.slug})`
    );
  }

  return linkedContent;
}

/**
 * Generate Schema.org markup for SEO
 */
function generateSchemaMarkup(
  content: Omit<GeneratedContent, 'schemaMarkup'>,
  tools: Tool[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.excerpt,
    keywords: content.keywords.join(', '),
    articleSection: content.category,
    author: {
      '@type': 'Organization',
      name: 'ToolForge AI',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToolForge AI',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai',
    },
    mentions: tools.map((tool) => ({
      '@type': 'SoftwareApplication',
      name: tool.name,
      applicationCategory: tool.category,
      offers: {
        '@type': 'Offer',
        price: tool.starting_price || '0',
        priceCurrency: 'USD',
      },
    })),
  };
}

/**
 * Generate comparison schema markup
 */
function generateComparisonSchema(
  content: Omit<GeneratedContent, 'schemaMarkup'>,
  tools: Tool[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComparisonArticle',
    headline: content.title,
    description: content.excerpt,
    author: {
      '@type': 'Organization',
      name: 'ToolForge AI',
    },
    itemListElement: tools.map((tool, index) => ({
      '@type': 'SoftwareApplication',
      position: index + 1,
      name: tool.name,
      description: tool.description,
      applicationCategory: tool.category,
      offers: {
        '@type': 'Offer',
        price: tool.starting_price || '0',
        priceCurrency: 'USD',
      },
    })),
  };
}

/**
 * Generate review schema markup
 */
function generateReviewSchema(
  content: Omit<GeneratedContent, 'schemaMarkup'>,
  tool: Tool
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      applicationCategory: tool.category,
      offers: {
        '@type': 'Offer',
        price: tool.starting_price || '0',
        priceCurrency: 'USD',
      },
    },
    author: {
      '@type': 'Organization',
      name: 'ToolForge AI',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: tool.rating || 4.5,
      bestRating: 5,
    },
    reviewBody: stripHtml(content.content),
  };
}

/**
 * Fetch trending tools from database
 */
async function fetchTrendingTools(limit: number = 5): Promise<Tool[]> {
  const { data: tools, error } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('clicks', { ascending: false })
    .order('views', { ascending: false })
    .limit(limit);

  if (error || !tools) {
    console.error('Error fetching trending tools:', error);
    return [];
  }

  return tools as Tool[];
}

/**
 * Save generated content to database
 */
export async function saveGeneratedBlogPost(
  content: GeneratedContent,
  status: 'draft' | 'published' = 'published'
): Promise<string> {
  const slug = slugify(content.title);
  const readTime = calculateReadTime(content.content);

  const postData = {
    slug,
    title: content.title,
    content: content.content,
    excerpt: content.excerpt,
    author: 'ToolForge AI',
    category: content.category,
    tags: content.tags,
    seo_title: content.seoTitle,
    seo_description: content.seoDescription,
    keywords: content.keywords,
    read_time: readTime,
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
  };

  // Check if slug already exists
  const { data: existing } = await supabaseAdmin
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    // Update existing post
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .update(postData)
      .eq('id', existing.id);

    if (error) throw error;

    console.log(`✅ Updated existing blog post: ${slug}`);
    return existing.id;
  } else {
    // Insert new post
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([postData])
      .select('id')
      .single();

    if (error) throw error;

    console.log(`✅ Created new blog post: ${slug}`);
    return data.id;
  }
}

/**
 * Pick a random topic for blog post generation
 */
export function selectRandomTopic(): string {
  const topics = [
    'best AI tools for content creation in 2026',
    'top AI productivity tools for remote teams',
    'AI tools revolutionizing digital marketing',
    'best AI writing assistants compared',
    'AI image generation tools for designers',
    'AI coding assistants that boost developer productivity',
    'AI video editing tools for content creators',
    'best AI chatbots for customer service',
    'AI tools for data analysis and visualization',
    'AI-powered project management tools',
    'best AI tools for social media management',
    'AI tools transforming e-commerce',
    'top AI research tools for students and academics',
    'AI music generation tools for creators',
    'best AI tools for email marketing',
  ];

  return topics[Math.floor(Math.random() * topics.length)];
}
