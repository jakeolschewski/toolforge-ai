// Quality Scorer for Scraped AI Tool Sources
// Scores scraped tools 0-100 and detects spam to enable auto-approval

import type { ScrapedSource } from '@/types';
import { isValidCategory } from '@/utils/ai-categorizer';

export const AUTO_APPROVE_THRESHOLD = parseInt(
  process.env.AUTO_APPROVE_THRESHOLD || '60',
  10
);

const SPAM_KEYWORDS = [
  'casino', 'gambling', 'poker', 'slot', 'betting',
  'xxx', 'porn', 'adult', 'nude', 'nsfw',
  'crack', 'keygen', 'torrent', 'warez', 'pirate',
  'viagra', 'cialis', 'pharmacy', 'weight loss miracle',
  'get rich quick', 'make money fast', 'earn $',
  'cryptocurrency scam', 'binary options',
];

const SPAM_DOMAINS = [
  'bit.ly', 'tinyurl.com', 'adf.ly', 'shorte.st',
  'clickbait.com', 'spamsite.com',
];

const REPUTABLE_TLDS = ['.com', '.io', '.ai', '.dev', '.co', '.org', '.net', '.app', '.tools', '.so'];

/**
 * Check if a scraped source is spam
 */
export function isSpam(source: ScrapedSource): boolean {
  const textToCheck = `${source.tool_name} ${source.description || ''} ${source.tool_url || ''}`.toLowerCase();

  // Check for spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (textToCheck.includes(keyword)) {
      return true;
    }
  }

  // Check for spam domains
  if (source.tool_url) {
    for (const domain of SPAM_DOMAINS) {
      if (source.tool_url.toLowerCase().includes(domain)) {
        return true;
      }
    }
  }

  // Check for excessive caps in name (more than 80% uppercase, length > 3)
  if (source.tool_name && source.tool_name.length > 3) {
    const upperCount = (source.tool_name.match(/[A-Z]/g) || []).length;
    const letterCount = (source.tool_name.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 0 && upperCount / letterCount > 0.8) {
      return true;
    }
  }

  return false;
}

/**
 * Score a scraped source from 0-100 for quality
 */
export function scoreScrapedSource(source: ScrapedSource): number {
  let score = 0;

  // --- Name quality (20 points) ---
  score += scoreNameQuality(source.tool_name);

  // --- URL quality (25 points) ---
  score += scoreUrlQuality(source.tool_url);

  // --- Description quality (25 points) ---
  score += scoreDescriptionQuality(source.description);

  // --- Category match (15 points) ---
  score += scoreCategoryMatch(source.category);

  // --- Completeness (15 points) ---
  score += scoreCompleteness(source);

  return Math.min(100, Math.max(0, Math.round(score)));
}

function scoreNameQuality(name: string | undefined): number {
  if (!name) return 0;
  let points = 0;

  // Length check: 2-50 chars is ideal
  if (name.length >= 2 && name.length <= 50) {
    points += 10;
  } else if (name.length > 50) {
    points += 5; // Still has a name, just long
  }

  // Not ALL CAPS
  const letterCount = (name.match(/[a-zA-Z]/g) || []).length;
  const upperCount = (name.match(/[A-Z]/g) || []).length;
  if (letterCount === 0 || upperCount / letterCount <= 0.8) {
    points += 5;
  }

  // No spam keywords in name
  const nameLower = name.toLowerCase();
  const hasSpamKeyword = SPAM_KEYWORDS.some(kw => nameLower.includes(kw));
  if (!hasSpamKeyword) {
    points += 5;
  }

  return points;
}

function scoreUrlQuality(url: string | undefined): number {
  if (!url) return 0;
  let points = 0;

  // Valid URL
  try {
    const parsed = new URL(url);

    // Is a valid parseable URL
    points += 8;

    // HTTPS
    if (parsed.protocol === 'https:') {
      points += 7;
    } else if (parsed.protocol === 'http:') {
      points += 3;
    }

    // Reputable TLD
    const hostname = parsed.hostname.toLowerCase();
    const hasReputableTld = REPUTABLE_TLDS.some(tld => hostname.endsWith(tld));
    if (hasReputableTld) {
      points += 5;
    }

    // Not a blacklisted domain
    const isBlacklisted = SPAM_DOMAINS.some(d => hostname.includes(d));
    if (!isBlacklisted) {
      points += 5;
    }
  } catch {
    // Invalid URL gets 0 points
  }

  return points;
}

function scoreDescriptionQuality(description: string | undefined): number {
  if (!description) return 0;
  let points = 0;

  // Length > 30 chars
  if (description.length > 30) {
    points += 10;
  } else if (description.length > 10) {
    points += 5;
  }

  // Contains actual sentences (has a period or comma — indicates prose)
  if (/[.!?]/.test(description)) {
    points += 5;
  }

  // Has multiple words (at least 5)
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount >= 5) {
    points += 5;
  }

  // No spam patterns
  const descLower = description.toLowerCase();
  const hasSpam = SPAM_KEYWORDS.some(kw => descLower.includes(kw));
  if (!hasSpam) {
    points += 5;
  }

  return points;
}

function scoreCategoryMatch(category: string | undefined): number {
  if (!category) return 0;

  // Maps to a valid known category
  if (isValidCategory(category)) {
    return 15;
  }

  // Has some category, just not one we recognize exactly
  if (category.length > 0) {
    return 7;
  }

  return 0;
}

function scoreCompleteness(source: ScrapedSource): number {
  let points = 0;
  let fieldsPopulated = 0;

  if (source.tool_name) fieldsPopulated++;
  if (source.tool_url) fieldsPopulated++;
  if (source.description) fieldsPopulated++;
  if (source.category) fieldsPopulated++;
  if (source.source_url) fieldsPopulated++;

  // 3+ fields = full points, 2 = partial
  if (fieldsPopulated >= 4) {
    points += 15;
  } else if (fieldsPopulated >= 3) {
    points += 10;
  } else if (fieldsPopulated >= 2) {
    points += 5;
  }

  return points;
}
