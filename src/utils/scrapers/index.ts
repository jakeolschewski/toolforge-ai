// Unified Scraper Interface

import type { ScraperResult } from '@/types';
import { scrapeFuturepedia } from './futurepedia';
import { scrapeThereIsAnAIForThat } from './thereisanaiforthat';
import { scrapeProductHunt } from './producthunt';
import { validateScraperResults } from '@/utils/validation';

export interface ScraperSource {
  name: string;
  scrape: () => Promise<ScraperResult[]>;
  enabled: boolean;
  priority: number; // Higher priority runs first
}

export const scraperSources: ScraperSource[] = [
  {
    name: 'Futurepedia',
    scrape: scrapeFuturepedia,
    enabled: true,
    priority: 3,
  },
  {
    name: 'There\'s An AI For That',
    scrape: scrapeThereIsAnAIForThat,
    enabled: true,
    priority: 2,
  },
  {
    name: 'Product Hunt',
    scrape: scrapeProductHunt,
    enabled: true,
    priority: 1,
  },
];

export interface ScraperRunResult {
  source: string;
  success: boolean;
  count: number;
  error?: string;
  duration: number;
}

export async function runAllScrapers(): Promise<{
  results: ScraperResult[];
  summary: ScraperRunResult[];
}> {
  const allResults: ScraperResult[] = [];
  const summary: ScraperRunResult[] = [];

  // Sort by priority (highest first)
  const sortedSources = [...scraperSources].sort((a, b) => b.priority - a.priority);

  for (const source of sortedSources) {
    if (!source.enabled) {
      console.log(`⏭️  Skipping disabled scraper: ${source.name}`);
      continue;
    }

    const startTime = Date.now();
    console.log(`🚀 Running scraper: ${source.name}`);

    try {
      const results = await source.scrape();
      const duration = Date.now() - startTime;

      console.log(`✅ ${source.name} completed: ${results.length} tools in ${duration}ms`);

      // Validate results
      const { valid, invalid } = validateScraperResults(results);

      if (invalid.length > 0) {
        console.warn(`⚠️  ${source.name}: ${invalid.length} invalid results filtered out`);
      }

      allResults.push(...valid);

      summary.push({
        source: source.name,
        success: true,
        count: valid.length,
        duration,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`❌ Scraper ${source.name} failed:`, errorMessage);

      summary.push({
        source: source.name,
        success: false,
        count: 0,
        error: errorMessage,
        duration,
      });
    }
  }

  return { results: allResults, summary };
}

export function deduplicateResults(results: ScraperResult[]): ScraperResult[] {
  const seen = new Map<string, ScraperResult>();

  for (const result of results) {
    const key = result.tool_name.toLowerCase().trim().replace(/\s+/g, ' ');

    if (!seen.has(key)) {
      seen.set(key, result);
    } else {
      // Keep the one with more information
      const existing = seen.get(key)!;
      const existingScore = getResultScore(existing);
      const newScore = getResultScore(result);

      if (newScore > existingScore) {
        seen.set(key, result);
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Score a result based on how much information it has
 */
function getResultScore(result: ScraperResult): number {
  let score = 0;

  if (result.tool_url) score += 3;
  if (result.description && result.description.length > 50) score += 2;
  if (result.category) score += 1;
  if (result.logo_url) score += 1;
  if (result.pricing_model) score += 1;

  return score;
}

/**
 * Run a specific scraper by name
 */
export async function runScraper(sourceName: string): Promise<ScraperResult[]> {
  const source = scraperSources.find((s) => s.name === sourceName);

  if (!source) {
    throw new Error(`Scraper not found: ${sourceName}`);
  }

  if (!source.enabled) {
    throw new Error(`Scraper is disabled: ${sourceName}`);
  }

  console.log(`Running scraper: ${source.name}`);
  return await source.scrape();
}

/**
 * Get scraper statistics
 */
export function getScraperStats() {
  return {
    total: scraperSources.length,
    enabled: scraperSources.filter((s) => s.enabled).length,
    disabled: scraperSources.filter((s) => !s.enabled).length,
    sources: scraperSources.map((s) => ({
      name: s.name,
      enabled: s.enabled,
      priority: s.priority,
    })),
  };
}
