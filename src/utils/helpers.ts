// Utility Helper Functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Alias for slugify (for compatibility)
 */
export function generateSlug(text: string): string {
  return slugify(text);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate SEO-friendly meta description
 */
export function generateMetaDescription(text: string, maxLength: number = 160): string {
  const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncate(cleaned, maxLength);
}

/**
 * Hash IP address for privacy
 */
export function hashIP(ip: string): string {
  // Simple hash for privacy (in production, use crypto)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random string
 */
export function randomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Delay execution (for rate limiting)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

/**
 * Verify cron secret
 */
export function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('CRON_SECRET not set - cron endpoints are unprotected!');
    return true; // Allow in development
  }

  return authHeader === `Bearer ${cronSecret}`;
}

/**
 * Generate affiliate link with tracking
 */
export function generateAffiliateLink(
  baseLink: string,
  toolSlug: string,
  source: string = 'toolforge'
): string {
  try {
    const url = new URL(baseLink);
    url.searchParams.set('ref', source);
    url.searchParams.set('utm_source', 'toolforge');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', toolSlug);
    return url.toString();
  } catch {
    return baseLink;
  }
}

/**
 * Strip HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Pluralize word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || singular + 's';
}

/**
 * Sanitize text for safe display
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Extract text from HTML
 */
export function extractTextFromHtml(html: string, maxLength?: number): string {
  const text = stripHtml(html);
  return maxLength ? truncate(text, maxLength) : text;
}

/**
 * Download image to local storage (returns URL)
 * For production, this would upload to cloud storage (S3, Cloudinary, etc.)
 */
export async function downloadImage(url: string, fileName?: string): Promise<string> {
  try {
    // In production, implement actual image downloading/uploading
    // For now, return the original URL
    console.log(`Image download requested: ${url}`);
    return url;
  } catch (error) {
    console.error('Image download failed:', error);
    return url; // Fallback to original URL
  }
}

/**
 * Generate unique filename from URL
 */
export function generateFileName(url: string, prefix: string = 'img'): string {
  const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
  const timestamp = Date.now();
  const random = randomString(8);
  return `${prefix}-${timestamp}-${random}.${ext}`;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract category from tags
 */
export function extractCategoryFromTags(tags: string[]): string {
  const categoryMap: Record<string, string> = {
    writing: 'writing',
    content: 'writing',
    text: 'writing',
    image: 'image',
    photo: 'image',
    art: 'image',
    design: 'design',
    graphic: 'design',
    video: 'video',
    film: 'video',
    code: 'code',
    programming: 'code',
    developer: 'code',
    chat: 'chat',
    chatbot: 'chat',
    assistant: 'chat',
    productivity: 'productivity',
    workflow: 'productivity',
    automation: 'productivity',
    marketing: 'marketing',
    seo: 'marketing',
    sales: 'marketing',
    audio: 'audio',
    music: 'audio',
    voice: 'audio',
    research: 'research',
    data: 'research',
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

/**
 * Parse pricing information from text
 */
export function parsePricingModel(text: string): {
  model: 'free' | 'freemium' | 'paid' | 'subscription';
  price?: string;
} {
  const lower = text.toLowerCase();

  if (lower.includes('free') && !lower.includes('free trial')) {
    if (lower.includes('freemium') || lower.includes('premium') || lower.includes('upgrade')) {
      return { model: 'freemium' };
    }
    return { model: 'free' };
  }

  if (lower.includes('subscription') || lower.includes('monthly') || lower.includes('annual')) {
    const priceMatch = text.match(/\$\d+(?:\.\d{2})?/);
    return {
      model: 'subscription',
      price: priceMatch ? priceMatch[0] : undefined,
    };
  }

  const priceMatch = text.match(/\$\d+(?:\.\d{2})?/);
  return {
    model: 'paid',
    price: priceMatch ? priceMatch[0] : undefined,
  };
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
  private lastCall: number = 0;
  private minInterval: number;

  constructor(callsPerMinute: number) {
    this.minInterval = 60000 / callsPerMinute; // Convert to milliseconds
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;

    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      await delay(waitTime);
    }

    this.lastCall = Date.now();
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const delayTime = initialDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delayTime}ms...`);
        await delay(delayTime);
      }
    }
  }

  throw lastError;
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
