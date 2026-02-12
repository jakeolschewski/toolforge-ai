// There's An AI For That Scraper

import axios from 'axios';
import * as cheerio from 'cheerio';
import type { ScraperResult } from '@/types';
import { delay, retryWithBackoff, sanitizeText, RateLimiter } from '@/utils/helpers';

const rateLimiter = new RateLimiter(30); // 30 calls per minute

export async function scrapeThereIsAnAIForThat(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  try {
    console.log('Starting There\'s An AI For That scrape...');

    // Try API first
    try {
      const apiResults = await scrapeAPI();
      if (apiResults.length > 0) {
        results.push(...apiResults);
        console.log(`API scrape successful: ${apiResults.length} tools`);
      } else {
        throw new Error('API returned no results');
      }
    } catch (error) {
      console.error('API scrape failed, falling back to web scraping:', error);
      const webResults = await scrapeWebFallback();
      results.push(...webResults);
      console.log(`Web scrape successful: ${webResults.length} tools`);
    }

    console.log(`There's An AI For That scrape complete: ${results.length} tools found`);
  } catch (error) {
    console.error('There\'s An AI For That scrape error:', error);
  }

  return results;
}

/**
 * Try to scrape from API endpoints
 */
async function scrapeAPI(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  // Possible API endpoints to try
  const apiUrls = [
    'https://theresanaiforthat.com/api/tools',
    'https://theresanaiforthat.com/api/ai',
    'https://api.theresanaiforthat.com/tools',
  ];

  for (const apiUrl of apiUrls) {
    try {
      await rateLimiter.wait();

      const response = await retryWithBackoff(
        () =>
          axios.get(apiUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; ToolForgeBot/1.0)',
              Accept: 'application/json',
            },
            timeout: 10000,
          }),
        2,
        2000
      );

      if (response.data) {
        // Try different response structures
        const tools =
          response.data.tools ||
          response.data.data ||
          response.data.items ||
          (Array.isArray(response.data) ? response.data : []);

        if (Array.isArray(tools) && tools.length > 0) {
          for (const tool of tools.slice(0, 15)) {
            await rateLimiter.wait();

            results.push({
              tool_name: sanitizeText(tool.name || tool.title || ''),
              tool_url: tool.url || tool.website || tool.link || '',
              description: sanitizeText(tool.description || tool.desc || '').substring(0, 500),
              category: mapCategory(tool.category || tool.type || ''),
              logo_url: tool.logo || tool.image || tool.icon || '',
              pricing_model: normalizePricing(tool.pricing_type || tool.pricing || ''),
            });
          }

          // Successfully got results
          return results;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`API ${apiUrl} failed with status:`, error.response?.status);
      }
      continue; // Try next URL
    }
  }

  return results;
}

/**
 * Normalize pricing information
 */
function normalizePricing(pricing: string): 'free' | 'freemium' | 'paid' | 'subscription' | undefined {
  if (!pricing) return undefined;

  const lower = pricing.toLowerCase();

  if (lower.includes('free')) {
    return lower.includes('freemium') || lower.includes('premium') ? 'freemium' : 'free';
  }
  if (lower.includes('subscription') || lower.includes('monthly')) return 'subscription';
  if (lower.includes('paid')) return 'paid';

  return undefined;
}

async function scrapeWebFallback(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  try {
    await rateLimiter.wait();

    const response = await retryWithBackoff(
      () =>
        axios.get('https://theresanaiforthat.com', {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 15000,
        }),
      2,
      2000
    );

    const $ = cheerio.load(response.data);

    // Try multiple selectors
    const selectors = [
      '.ai-tool-item',
      '[class*="tool"]',
      '[class*="card"]',
      'article',
      '[data-testid*="tool"]',
    ];

    let toolsFound = false;

    for (const selector of selectors) {
      const elements = $(selector);

      if (elements.length > 0) {
        console.log(`Found ${elements.length} elements with selector: ${selector}`);

        elements.slice(0, 15).each((_, element) => {
          const $el = $(element);

          // Extract with multiple fallbacks
          const name =
            $el.find('.tool-title').text().trim() ||
            $el.find('.tool-name').text().trim() ||
            $el.find('h3').text().trim() ||
            $el.find('h2').text().trim() ||
            $el.find('a').first().text().trim();

          const url =
            $el.find('a[href*="http"]').first().attr('href') ||
            $el.find('a').first().attr('href');

          const description =
            $el.find('.tool-desc').text().trim() ||
            $el.find('.tool-description').text().trim() ||
            $el.find('p').first().text().trim() ||
            $el.find('[class*="desc"]').text().trim();

          const category =
            $el.find('.category').text().trim() ||
            $el.find('[class*="category"]').text().trim();

          const logo =
            $el.find('img').first().attr('src') ||
            $el.find('[class*="logo"] img').attr('src');

          if (name && name.length > 0 && name.length < 200) {
            results.push({
              tool_name: sanitizeText(name),
              tool_url: url
                ? url.startsWith('http')
                  ? url
                  : `https://theresanaiforthat.com${url}`
                : '',
              description: sanitizeText(description).substring(0, 500),
              category: mapCategory(category),
              logo_url: logo && logo.startsWith('http') ? logo : '',
            });
            toolsFound = true;
          }
        });

        if (toolsFound) break;
      }
    }

    if (!toolsFound) {
      console.warn('No tools found on There\'s An AI For That. Page structure may have changed.');
    }
  } catch (error) {
    console.error('Web fallback scrape error:', error);
  }

  return results;
}

function mapCategory(category: string): string {
  const mapping: Record<string, string> = {
    'writing': 'writing',
    'content': 'writing',
    'image': 'image',
    'art': 'image',
    'video': 'video',
    'coding': 'code',
    'developer': 'code',
    'chatbot': 'chat',
    'assistant': 'chat',
    'marketing': 'marketing',
    'seo': 'marketing',
    'design': 'design',
    'audio': 'audio',
    'music': 'audio',
  };

  const lower = category?.toLowerCase() || '';

  for (const [key, value] of Object.entries(mapping)) {
    if (lower.includes(key)) {
      return value;
    }
  }

  return 'productivity';
}
