// Product Hunt AI Tools Scraper

import axios from 'axios';
import * as cheerio from 'cheerio';
import type { ScraperResult } from '@/types';
import { delay, extractDomain, sanitizeText, isValidUrl } from '@/utils/helpers';

const PRODUCT_HUNT_BASE = 'https://www.producthunt.com';

/**
 * Scrape Product Hunt AI category
 * Product Hunt has different sections for AI tools
 */
export async function scrapeProductHunt(): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  try {
    // Try multiple AI-related sections
    const sections = [
      '/topics/artificial-intelligence',
      '/topics/ai',
      '/topics/machine-learning',
    ];

    for (const section of sections) {
      try {
        const sectionResults = await scrapeProductHuntSection(section);
        results.push(...sectionResults);
        await delay(2000); // Be respectful with rate limiting
      } catch (error) {
        console.error(`Failed to scrape Product Hunt section ${section}:`, error);
      }
    }

    // Deduplicate by tool name
    const seen = new Set<string>();
    const deduped = results.filter((tool) => {
      const key = tool.tool_name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return deduped;
  } catch (error) {
    console.error('Product Hunt scrape error:', error);
    return results;
  }
}

/**
 * Scrape a specific Product Hunt section/topic
 */
async function scrapeProductHuntSection(section: string): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  try {
    const url = `${PRODUCT_HUNT_BASE}${section}`;
    console.log(`Scraping Product Hunt: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // Product Hunt structure varies, try multiple selectors
    const productSelectors = [
      '[data-test="post-item"]',
      '.styles_item__Fn_XX',
      '[class*="post-item"]',
      'article[class*="Post"]',
    ];

    let productsFound = false;

    for (const selector of productSelectors) {
      const products = $(selector);

      if (products.length > 0) {
        console.log(`Found ${products.length} products with selector: ${selector}`);
        productsFound = true;

        products.slice(0, 10).each((_, element) => {
          const $el = $(element);

          // Try to extract product information
          const name = extractProductName($el, $);
          const description = extractProductDescription($el, $);
          const link = extractProductLink($el, $);
          const tagline = extractProductTagline($el, $);

          if (name) {
            results.push({
              tool_name: sanitizeText(name),
              tool_url: link,
              description: sanitizeText(description || tagline || ''),
              category: 'productivity', // Will be categorized later
            });
          }
        });

        break; // Found products, no need to try other selectors
      }
    }

    if (!productsFound) {
      console.warn(`No products found on ${url}. Page structure may have changed.`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`HTTP Error scraping Product Hunt section:`, error.response?.status);
    } else {
      console.error(`Error scraping Product Hunt section:`, error);
    }
  }

  return results;
}

/**
 * Extract product name from element
 */
function extractProductName($el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string {
  // Try multiple selectors for product name
  const nameSelectors = [
    '[data-test="post-name"]',
    'h3',
    'h2',
    'a[class*="bold"]',
    '[class*="name"]',
  ];

  for (const selector of nameSelectors) {
    const text = $el.find(selector).first().text().trim();
    if (text && text.length > 0 && text.length < 200) {
      return text;
    }
  }

  return '';
}

/**
 * Extract product description
 */
function extractProductDescription($el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string {
  const descSelectors = [
    '[data-test="post-description"]',
    'p',
    '[class*="description"]',
    '[class*="tagline"]',
  ];

  for (const selector of descSelectors) {
    const text = $el.find(selector).first().text().trim();
    if (text && text.length > 10) {
      return text;
    }
  }

  return '';
}

/**
 * Extract product tagline
 */
function extractProductTagline($el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string {
  const taglineSelectors = [
    '[data-test="post-tagline"]',
    '[class*="tagline"]',
    'p:first-of-type',
  ];

  for (const selector of taglineSelectors) {
    const text = $el.find(selector).first().text().trim();
    if (text && text.length > 5) {
      return text;
    }
  }

  return '';
}

/**
 * Extract product link
 */
function extractProductLink($el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): string {
  // Try to find the main link
  const linkSelectors = ['a[href*="/posts/"]', 'a'];

  for (const selector of linkSelectors) {
    const href = $el.find(selector).first().attr('href');
    if (href) {
      // Convert relative URLs to absolute
      if (href.startsWith('/')) {
        return `${PRODUCT_HUNT_BASE}${href}`;
      }
      if (isValidUrl(href)) {
        return href;
      }
    }
  }

  return '';
}

/**
 * Scrape individual product page for more details
 * This is optional and should be rate-limited
 */
export async function scrapeProductDetails(productUrl: string): Promise<Partial<ScraperResult>> {
  try {
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Extract more detailed information
    const website = $('a[data-test="post-website-link"]').attr('href') || '';
    const description = $('[data-test="post-description"]').text().trim();
    const tags = $('[data-test="post-topic"]')
      .map((_, el) => $(el).text().trim())
      .get();

    return {
      tool_url: website,
      description: description,
      category: determineCategory(tags),
    };
  } catch (error) {
    console.error('Error scraping product details:', error);
    return {};
  }
}

/**
 * Determine category from tags
 */
function determineCategory(tags: string[]): string {
  const categoryMap: Record<string, string> = {
    'artificial intelligence': 'productivity',
    ai: 'productivity',
    writing: 'writing',
    design: 'design',
    video: 'video',
    image: 'image',
    code: 'code',
    developer: 'code',
    marketing: 'marketing',
    productivity: 'productivity',
    analytics: 'research',
  };

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lower.includes(key)) {
        return value;
      }
    }
  }

  return 'productivity';
}
