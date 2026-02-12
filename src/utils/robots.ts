// Robots.txt Parser and Checker
// Ensures ethical scraping by respecting robots.txt directives

import axios from 'axios';

interface RobotsRules {
  allowed: string[];
  disallowed: string[];
  crawlDelay?: number;
}

const robotsCache = new Map<string, { rules: RobotsRules; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Parse robots.txt content for a specific user agent
 */
function parseRobotsTxt(content: string, userAgent: string = '*'): RobotsRules {
  const rules: RobotsRules = {
    allowed: [],
    disallowed: [],
  };

  const lines = content.split('\n');
  let isRelevantSection = false;
  let currentUserAgent = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue;

    // Check for User-agent directive
    if (trimmed.toLowerCase().startsWith('user-agent:')) {
      currentUserAgent = trimmed.substring(11).trim().toLowerCase();
      isRelevantSection =
        currentUserAgent === '*' ||
        currentUserAgent === userAgent.toLowerCase() ||
        currentUserAgent.includes('bot');
      continue;
    }

    if (!isRelevantSection) continue;

    // Parse Disallow directive
    if (trimmed.toLowerCase().startsWith('disallow:')) {
      const path = trimmed.substring(9).trim();
      if (path) {
        rules.disallowed.push(path);
      } else {
        // Empty disallow means allow all
        rules.allowed.push('/');
      }
    }

    // Parse Allow directive
    if (trimmed.toLowerCase().startsWith('allow:')) {
      const path = trimmed.substring(6).trim();
      if (path) {
        rules.allowed.push(path);
      }
    }

    // Parse Crawl-delay directive
    if (trimmed.toLowerCase().startsWith('crawl-delay:')) {
      const delay = parseInt(trimmed.substring(12).trim(), 10);
      if (!isNaN(delay)) {
        rules.crawlDelay = delay * 1000; // Convert to milliseconds
      }
    }
  }

  return rules;
}

/**
 * Check if a path is allowed by robots.txt rules
 */
function isPathAllowed(path: string, rules: RobotsRules): boolean {
  // If disallow is empty or only has "/", everything is allowed
  if (rules.disallowed.length === 0 || (rules.disallowed.length === 1 && rules.disallowed[0] === '/')) {
    return true;
  }

  // Check explicit allows first
  for (const allowed of rules.allowed) {
    if (path.startsWith(allowed)) {
      return true;
    }
  }

  // Check disallows
  for (const disallowed of rules.disallowed) {
    if (disallowed === '/') {
      // Entire site is disallowed
      return false;
    }

    // Check if path matches disallow pattern
    if (path.startsWith(disallowed)) {
      return false;
    }
  }

  // If no rules matched, allow by default
  return true;
}

/**
 * Fetch and parse robots.txt for a given domain
 */
async function fetchRobotsTxt(baseUrl: string, userAgent: string = 'ToolForgeBot'): Promise<RobotsRules> {
  try {
    const url = new URL('/robots.txt', baseUrl);
    const cacheKey = `${url.origin}-${userAgent}`;

    // Check cache first
    const cached = robotsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Using cached robots.txt for ${url.origin}`);
      return cached.rules;
    }

    console.log(`Fetching robots.txt from ${url.toString()}`);

    const response = await axios.get(url.toString(), {
      headers: {
        'User-Agent': userAgent,
      },
      timeout: 10000,
      validateStatus: (status) => status === 200 || status === 404,
    });

    let rules: RobotsRules;

    if (response.status === 404) {
      // No robots.txt means everything is allowed
      console.log(`No robots.txt found for ${url.origin}, assuming all allowed`);
      rules = {
        allowed: ['/'],
        disallowed: [],
      };
    } else {
      rules = parseRobotsTxt(response.data, userAgent);
    }

    // Cache the result
    robotsCache.set(cacheKey, {
      rules,
      timestamp: Date.now(),
    });

    return rules;
  } catch (error) {
    console.error(`Error fetching robots.txt from ${baseUrl}:`, error);
    // On error, be conservative and disallow
    return {
      allowed: [],
      disallowed: ['/'],
    };
  }
}

/**
 * Check if scraping is allowed for a specific URL
 *
 * @param url - The full URL to check
 * @param userAgent - The user agent to identify as (default: 'ToolForgeBot')
 * @returns true if scraping is allowed, false otherwise
 *
 * @example
 * const canScrape = await checkRobotsTxt('https://example.com/page', 'ToolForgeBot');
 * if (canScrape) {
 *   // Proceed with scraping
 * }
 */
export async function checkRobotsTxt(url: string, userAgent: string = 'ToolForgeBot'): Promise<boolean> {
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const path = urlObj.pathname;

    const rules = await fetchRobotsTxt(baseUrl, userAgent);
    const allowed = isPathAllowed(path, rules);

    if (!allowed) {
      console.warn(`Scraping disallowed by robots.txt: ${url}`);
    }

    return allowed;
  } catch (error) {
    console.error(`Error checking robots.txt for ${url}:`, error);
    // On error, be conservative and disallow
    return false;
  }
}

/**
 * Get the recommended crawl delay for a domain
 *
 * @param baseUrl - The base URL of the domain
 * @param userAgent - The user agent to check for (default: 'ToolForgeBot')
 * @returns The crawl delay in milliseconds, or undefined if not specified
 */
export async function getCrawlDelay(baseUrl: string, userAgent: string = 'ToolForgeBot'): Promise<number | undefined> {
  try {
    const rules = await fetchRobotsTxt(baseUrl, userAgent);
    return rules.crawlDelay;
  } catch (error) {
    console.error(`Error getting crawl delay for ${baseUrl}:`, error);
    return undefined;
  }
}

/**
 * Clear the robots.txt cache (useful for testing or manual refresh)
 */
export function clearRobotsCache(): void {
  robotsCache.clear();
  console.log('Robots.txt cache cleared');
}

/**
 * Check if a URL is scrapable with detailed information
 *
 * @param url - The URL to check
 * @param userAgent - The user agent to identify as
 * @returns Object with allowed status, crawl delay, and rules
 */
export async function getScrapingPermissions(
  url: string,
  userAgent: string = 'ToolForgeBot'
): Promise<{
  allowed: boolean;
  crawlDelay?: number;
  rules: RobotsRules;
  url: string;
}> {
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const path = urlObj.pathname;

    const rules = await fetchRobotsTxt(baseUrl, userAgent);
    const allowed = isPathAllowed(path, rules);

    return {
      allowed,
      crawlDelay: rules.crawlDelay,
      rules,
      url,
    };
  } catch (error) {
    console.error(`Error getting scraping permissions for ${url}:`, error);
    return {
      allowed: false,
      crawlDelay: undefined,
      rules: { allowed: [], disallowed: ['/'] },
      url,
    };
  }
}
