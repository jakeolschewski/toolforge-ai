// Advanced Search Library with Fuzzy Matching

import type { Tool } from '@/types';

// Calculate Levenshtein distance for fuzzy matching
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Calculate similarity score (0-1, higher is better)
export function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

// Check if query matches string with fuzzy logic
export function fuzzyMatch(query: string, target: string, threshold = 0.6): boolean {
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();

  // Exact substring match
  if (targetLower.includes(queryLower)) return true;

  // Word boundary match
  const words = targetLower.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(queryLower)) return true;
    if (calculateSimilarity(queryLower, word) >= threshold) return true;
  }

  // Overall similarity
  return calculateSimilarity(queryLower, targetLower) >= threshold;
}

// Search score interface
export interface SearchScore {
  score: number;
  relevance: {
    nameMatch: number;
    descriptionMatch: number;
    taglineMatch: number;
    featureMatch: number;
    tagMatch: number;
  };
}

// Calculate search relevance score for a tool
export function calculateSearchScore(tool: Tool, query: string): SearchScore {
  const queryLower = query.toLowerCase();
  const weights = {
    name: 5,
    tagline: 3,
    description: 2,
    features: 1.5,
    tags: 1,
  };

  // Name matching (highest priority)
  const nameMatch = fuzzyMatch(query, tool.name, 0.5)
    ? calculateSimilarity(queryLower, tool.name.toLowerCase())
    : 0;

  // Tagline matching
  const taglineMatch = tool.tagline && fuzzyMatch(query, tool.tagline, 0.6)
    ? calculateSimilarity(queryLower, tool.tagline.toLowerCase())
    : 0;

  // Description matching
  const descriptionMatch = fuzzyMatch(query, tool.description, 0.7)
    ? calculateSimilarity(queryLower, tool.description.toLowerCase()) * 0.8
    : 0;

  // Features matching
  let featureMatch = 0;
  if (tool.features && tool.features.length > 0) {
    const matchingFeatures = tool.features.filter(f => fuzzyMatch(query, f, 0.7));
    featureMatch = matchingFeatures.length > 0
      ? (matchingFeatures.length / tool.features.length) * 0.7
      : 0;
  }

  // Tags matching
  let tagMatch = 0;
  if (tool.tags && tool.tags.length > 0) {
    const matchingTags = tool.tags.filter(t => fuzzyMatch(query, t, 0.6));
    tagMatch = matchingTags.length > 0
      ? (matchingTags.length / tool.tags.length) * 0.8
      : 0;
  }

  // Calculate weighted score
  const score =
    nameMatch * weights.name +
    taglineMatch * weights.tagline +
    descriptionMatch * weights.description +
    featureMatch * weights.features +
    tagMatch * weights.tags;

  return {
    score,
    relevance: {
      nameMatch,
      taglineMatch,
      descriptionMatch,
      featureMatch,
      tagMatch,
    },
  };
}

// Search and rank tools
export function searchTools(tools: Tool[], query: string, minScore = 0.1): Tool[] {
  if (!query || query.trim().length === 0) {
    return tools;
  }

  const scoredTools = tools
    .map(tool => ({
      tool,
      searchScore: calculateSearchScore(tool, query),
    }))
    .filter(item => item.searchScore.score > minScore)
    .sort((a, b) => b.searchScore.score - a.searchScore.score);

  return scoredTools.map(item => item.tool);
}

// Generate search suggestions based on partial query
export function generateSuggestions(
  tools: Tool[],
  query: string,
  limit = 5
): string[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  // Add matching tool names
  tools.forEach(tool => {
    if (tool.name.toLowerCase().includes(queryLower)) {
      suggestions.add(tool.name);
    }
  });

  // Add matching tags
  tools.forEach(tool => {
    if (tool.tags) {
      tool.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    }
  });

  // Add matching categories
  tools.forEach(tool => {
    if (tool.category.toLowerCase().includes(queryLower)) {
      suggestions.add(tool.category);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}

// Simple in-memory cache for search results
interface CacheEntry {
  results: Tool[];
  timestamp: number;
}

class SearchCache {
  private cache = new Map<string, CacheEntry>();
  private maxAge = 5 * 60 * 1000; // 5 minutes
  private maxSize = 100;

  get(key: string): Tool[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.results;
  }

  set(key: string, results: Tool[]): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      results,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const searchCache = new SearchCache();

// Create cache key from search parameters
export function createCacheKey(params: {
  query?: string;
  category?: string;
  pricing?: string;
  sortBy?: string;
}): string {
  return JSON.stringify(params);
}
