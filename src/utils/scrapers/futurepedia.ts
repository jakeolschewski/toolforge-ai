// Futurepedia RSS/API Scraper
// Respects robots.txt and implements proper rate limiting

import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import type { ScraperResult } from '@/types';
import { delay, extractDomain, retryWithBackoff, sanitizeText } from '@/utils/helpers';
import { checkRobotsTxt, getCrawlDelay } from '@/utils/robots';

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; ToolForgeBot/1.0)',
  },
});

export async function scrapeFuturepedia(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  try {
    console.log('Starting Futurepedia scrape...');

    // Check robots.txt before scraping
    const baseUrl = 'https://www.futurepedia.io';
    const canScrape = await checkRobotsTxt(baseUrl, 'ToolForgeBot');

    if (!canScrape) {
      console.warn('Futurepedia robots.txt disallows scraping. Skipping.');
      return results;
    }

    // Get recommended crawl delay
    const crawlDelay = await getCrawlDelay(baseUrl, 'ToolForgeBot');
    if (crawlDelay) {
      console.log(`Using crawl delay of ${crawlDelay}ms for Futurepedia`);
    }

    // Try RSS feed first
    try {
      const rssResults = await scrapeFuturepediaRSS();
      results.push(...rssResults);
    } catch (error) {
      console.error('Futurepedia RSS failed, trying web scrape:', error);
      // Fallback to web scraping
      const webResults = await scrapeFuturepediaWeb();
      results.push(...webResults);
    }

    console.log(`Futurepedia scrape complete: ${results.length} tools found`);
  } catch (error) {
    console.error('Futurepedia scrape error:', error);
  }

  return results;
}

async function scrapeFuturepediaRSS(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  // Futurepedia RSS feed URLs to try
  const feedUrls = [
    'https://www.futurepedia.io/rss',
    'https://www.futurepedia.io/feed',
    'https://www.futurepedia.io/rss.xml',
  ];

  for (const feedUrl of feedUrls) {
    try {
      const feed = await retryWithBackoff(
        () => rssParser.parseURL(feedUrl),
        2,
        2000
      );

      console.log(`Futurepedia RSS: Found ${feed.items.length} items`);

      for (const item of feed.items.slice(0, 15)) {
        if (!item.title) continue;

        // Extract tool info from RSS item
        const result: ScraperResult = {
          tool_name: sanitizeText(item.title),
          tool_url: item.link || '',
          description: sanitizeText(item.contentSnippet || item.content || '').substring(0, 500),
          category: extractCategoryFromContent(item.content || item.contentSnippet || ''),
        };

        // Extract additional metadata from content
        if (item.content) {
          const metadata = extractMetadataFromContent(item.content);
          if (metadata.pricing) result.pricing_model = metadata.pricing;
        }

        results.push(result);
        await delay(800); // Rate limiting
      }

      // Successfully scraped from this feed
      break;
    } catch (error) {
      console.error(`Failed to scrape feed ${feedUrl}:`, error);
      continue;
    }
  }

  return results;
}

async function scrapeFuturepediaWeb(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  try {
    const response = await retryWithBackoff(
      () =>
        axios.get('https://www.futurepedia.io', {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 15000,
        }),
      2,
      2000
    );

    const $ = cheerio.load(response.data);

    // Try multiple possible selectors (Futurepedia may use different classes)
    const selectors = [
      '.tool-card',
      '[class*="tool"]',
      '[class*="card"]',
      'article',
    ];

    let toolsFound = false;

    for (const selector of selectors) {
      const elements = $(selector);

      if (elements.length > 0) {
        console.log(`Found ${elements.length} elements with selector: ${selector}`);

        elements.slice(0, 15).each((_, element) => {
          const $el = $(element);

          // Extract information with multiple fallbacks
          const name =
            $el.find('.tool-name').text().trim() ||
            $el.find('h3').text().trim() ||
            $el.find('h2').text().trim() ||
            $el.find('a').first().text().trim();

          const url =
            $el.find('a').first().attr('href') ||
            $el.find('[class*="link"]').attr('href');

          const description =
            $el.find('.tool-description').text().trim() ||
            $el.find('p').first().text().trim() ||
            $el.find('[class*="desc"]').text().trim();

          const category =
            $el.find('.tool-category').text().trim() ||
            $el.find('[class*="category"]').text().trim();

          if (name && name.length > 0 && name.length < 200) {
            results.push({
              tool_name: sanitizeText(name),
              tool_url: url ? (url.startsWith('http') ? url : `https://www.futurepedia.io${url}`) : '',
              description: sanitizeText(description).substring(0, 500),
              category: category || 'productivity',
            });
            toolsFound = true;
          }
        });

        if (toolsFound) break;
      }
    }

    if (!toolsFound) {
      console.warn('No tools found on Futurepedia. Page structure may have changed.');
    }
  } catch (error) {
    console.error('Futurepedia web scrape error:', error);
  }

  return results;
}

/**
 * Extract metadata like pricing from content
 */
function extractMetadataFromContent(content: string): {
  pricing?: 'free' | 'freemium' | 'paid' | 'subscription';
  tags?: string[];
} {
  const result: { pricing?: any; tags?: string[] } = {};

  const lower = content.toLowerCase();

  if (lower.includes('free') && !lower.includes('free trial')) {
    result.pricing = lower.includes('freemium') || lower.includes('premium') ? 'freemium' : 'free';
  } else if (lower.includes('subscription') || lower.includes('monthly')) {
    result.pricing = 'subscription';
  } else if (lower.includes('paid') || lower.includes('$')) {
    result.pricing = 'paid';
  }

  return result;
}

function extractCategoryFromContent(content: string): string {
  const categories = [
    'writing',
    'image',
    'video',
    'code',
    'chat',
    'productivity',
    'marketing',
    'design',
    'audio',
    'research',
  ];

  const lowerContent = content.toLowerCase();

  for (const cat of categories) {
    if (lowerContent.includes(cat)) {
      return cat;
    }
  }

  return 'productivity';
}
