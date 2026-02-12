// AI-Powered Tool Categorization
// Uses simple keyword-based AI to categorize tools automatically

import type { ScraperResult } from '@/types';

interface CategoryKeywords {
  category: string;
  keywords: string[];
  weight: number;
}

const CATEGORY_DEFINITIONS: CategoryKeywords[] = [
  {
    category: 'writing',
    keywords: [
      'write', 'writing', 'content', 'text', 'article', 'blog', 'copy', 'copywriting',
      'editor', 'grammar', 'spell', 'paraphrase', 'summarize', 'email', 'letter',
      'document', 'word', 'essay', 'story', 'novel', 'script', 'caption'
    ],
    weight: 1.0,
  },
  {
    category: 'image',
    keywords: [
      'image', 'photo', 'picture', 'visual', 'graphic', 'illustration', 'art',
      'generate', 'create', 'edit', 'enhance', 'upscale', 'avatar', 'logo',
      'design', 'canvas', 'draw', 'paint', 'sketch', 'render', 'midjourney', 'dalle'
    ],
    weight: 1.0,
  },
  {
    category: 'video',
    keywords: [
      'video', 'film', 'movie', 'animation', 'motion', 'clip', 'footage',
      'editing', 'edit', 'generate', 'create', 'produce', 'render', 'effects',
      'subtitle', 'caption', 'transcribe', 'youtube', 'tiktok', 'reel'
    ],
    weight: 1.0,
  },
  {
    category: 'code',
    keywords: [
      'code', 'coding', 'programming', 'developer', 'development', 'software',
      'github', 'git', 'api', 'debug', 'test', 'compile', 'function', 'algorithm',
      'script', 'python', 'javascript', 'react', 'node', 'copilot', 'codebase'
    ],
    weight: 1.0,
  },
  {
    category: 'chat',
    keywords: [
      'chat', 'chatbot', 'conversation', 'assistant', 'bot', 'messaging',
      'talk', 'speak', 'ask', 'answer', 'question', 'support', 'customer',
      'gpt', 'claude', 'gemini', 'bard', 'dialogue', 'conversational'
    ],
    weight: 1.0,
  },
  {
    category: 'audio',
    keywords: [
      'audio', 'sound', 'music', 'voice', 'speech', 'podcast', 'song',
      'generate', 'create', 'edit', 'enhance', 'transcribe', 'text-to-speech',
      'tts', 'voice-over', 'narrator', 'singer', 'melody', 'beat', 'track'
    ],
    weight: 1.0,
  },
  {
    category: 'productivity',
    keywords: [
      'productivity', 'workflow', 'automation', 'organize', 'schedule',
      'task', 'project', 'management', 'calendar', 'note', 'reminder',
      'efficiency', 'optimize', 'streamline', 'assistant', 'tool', 'utility'
    ],
    weight: 0.8,
  },
  {
    category: 'marketing',
    keywords: [
      'marketing', 'seo', 'social', 'ads', 'advertising', 'campaign',
      'analytics', 'growth', 'traffic', 'conversion', 'landing', 'email',
      'newsletter', 'promotion', 'brand', 'audience', 'engagement', 'reach'
    ],
    weight: 1.0,
  },
  {
    category: 'design',
    keywords: [
      'design', 'designer', 'ui', 'ux', 'interface', 'layout', 'template',
      'theme', 'style', 'color', 'typography', 'font', 'mockup', 'prototype',
      'figma', 'sketch', 'adobe', 'creative', 'brand', 'identity'
    ],
    weight: 1.0,
  },
  {
    category: 'research',
    keywords: [
      'research', 'data', 'analyze', 'analysis', 'insight', 'report',
      'statistics', 'metrics', 'dashboard', 'visualization', 'chart',
      'graph', 'study', 'survey', 'intelligence', 'knowledge', 'learn'
    ],
    weight: 0.9,
  },
];

/**
 * Calculate category score based on keyword matching
 */
function calculateCategoryScore(text: string, categoryDef: CategoryKeywords): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  let matchCount = 0;

  for (const keyword of categoryDef.keywords) {
    // Check for exact word match (not substring)
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = lowerText.match(regex);

    if (matches) {
      matchCount += matches.length;
      // Higher weight for exact matches in tool name vs description
      if (lowerText.includes(keyword)) {
        score += categoryDef.weight * matches.length;
      }
    }
  }

  return score;
}

/**
 * Categorize a tool using AI-powered keyword analysis
 *
 * @param tool - The scraped tool data
 * @returns The best matching category
 */
export function categorizeTool(tool: ScraperResult): string {
  // Combine name and description for analysis
  const analysisText = `${tool.tool_name} ${tool.description || ''}`;

  // If the tool already has a category that matches our definitions, validate it
  if (tool.category) {
    const validCategories = CATEGORY_DEFINITIONS.map(d => d.category);
    if (validCategories.includes(tool.category.toLowerCase())) {
      return tool.category.toLowerCase();
    }
  }

  // Calculate scores for each category
  const scores = CATEGORY_DEFINITIONS.map(categoryDef => ({
    category: categoryDef.category,
    score: calculateCategoryScore(analysisText, categoryDef),
  }));

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  // Return the highest scoring category, or 'productivity' as default
  if (scores[0].score > 0) {
    return scores[0].category;
  }

  return 'productivity'; // Default fallback
}

/**
 * Batch categorize multiple tools
 *
 * @param tools - Array of scraped tools
 * @returns Array of tools with updated categories
 */
export function categorizeTools(tools: ScraperResult[]): ScraperResult[] {
  return tools.map(tool => ({
    ...tool,
    category: categorizeTool(tool),
  }));
}

/**
 * Get category suggestions with confidence scores
 *
 * @param tool - The scraped tool data
 * @param topN - Number of top suggestions to return (default: 3)
 * @returns Array of category suggestions with confidence scores
 */
export function getCategorySuggestions(
  tool: ScraperResult,
  topN: number = 3
): Array<{ category: string; confidence: number }> {
  const analysisText = `${tool.tool_name} ${tool.description || ''}`;

  // Calculate scores for each category
  const scores = CATEGORY_DEFINITIONS.map(categoryDef => ({
    category: categoryDef.category,
    score: calculateCategoryScore(analysisText, categoryDef),
  }));

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  // Calculate total score for normalization
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  // Return top N with confidence scores
  return scores.slice(0, topN).map(s => ({
    category: s.category,
    confidence: totalScore > 0 ? s.score / totalScore : 0,
  }));
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return CATEGORY_DEFINITIONS.map(d => d.category);
}

/**
 * Validate if a category is valid
 */
export function isValidCategory(category: string): boolean {
  const validCategories = CATEGORY_DEFINITIONS.map(d => d.category);
  return validCategories.includes(category.toLowerCase());
}
