// Zod Validation Schemas for ToolForge AI

import { z } from 'zod';

// Scraper Result Validation
export const scraperResultSchema = z.object({
  tool_name: z.string().min(1, 'Tool name is required').max(200),
  tool_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  category: z.string().optional(),
  logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  pricing_model: z
    .enum(['free', 'freemium', 'paid', 'subscription'])
    .optional(),
  starting_price: z.string().max(50).optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

export type ValidatedScraperResult = z.infer<typeof scraperResultSchema>;

// Tool Creation/Update Validation
export const toolSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  tagline: z.string().max(300).optional(),
  description: z.string().min(10).max(1000),
  long_description: z.string().max(5000).optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  website_url: z.string().url(),
  affiliate_link: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
  screenshot_url: z.string().url().optional().or(z.literal('')),
  pricing_model: z.enum(['free', 'freemium', 'paid', 'subscription']),
  starting_price: z.string().max(50).optional(),
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  is_sponsored: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type ValidatedTool = z.infer<typeof toolSchema>;

// Review Validation
export const reviewSchema = z.object({
  tool_id: z.string().uuid(),
  title: z.string().min(10).max(300),
  content: z.string().min(100),
  pros_html: z.string().optional(),
  cons_html: z.string().optional(),
  verdict: z.string().max(1000).optional(),
  rating: z.number().min(1).max(5).optional(),
  author: z.string().min(1).max(100),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seo_title: z.string().max(70).optional(),
  seo_description: z.string().max(160).optional(),
  keywords: z.array(z.string()).default([]),
});

export type ValidatedReview = z.infer<typeof reviewSchema>;

// Scraped Source Validation
export const scrapedSourceSchema = z.object({
  source_url: z.string().min(1),
  tool_name: z.string().min(1).max(200),
  tool_url: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  category: z.string().optional(),
  raw_data: z.string().optional(),
  status: z.enum(['pending', 'processed', 'ignored']).default('pending'),
});

export type ValidatedScrapedSource = z.infer<typeof scrapedSourceSchema>;

// Email Notification Validation
export const emailNotificationSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  text: z.string().optional(),
  html: z.string().optional(),
});

export type ValidatedEmailNotification = z.infer<typeof emailNotificationSchema>;

// Helper Functions
export function validateScraperResult(data: unknown): ValidatedScraperResult {
  return scraperResultSchema.parse(data);
}

export function validateTool(data: unknown): ValidatedTool {
  return toolSchema.parse(data);
}

export function validateReview(data: unknown): ValidatedReview {
  return reviewSchema.parse(data);
}

export function validateScrapedSource(data: unknown): ValidatedScrapedSource {
  return scrapedSourceSchema.parse(data);
}

export function validateEmailNotification(data: unknown): ValidatedEmailNotification {
  return emailNotificationSchema.parse(data);
}

// Safe validation (returns null on error instead of throwing)
export function safeValidateScraperResult(data: unknown): ValidatedScraperResult | null {
  const result = scraperResultSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function safeValidateTool(data: unknown): ValidatedTool | null {
  const result = toolSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function safeValidateReview(data: unknown): ValidatedReview | null {
  const result = reviewSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function safeValidateScrapedSource(data: unknown): ValidatedScrapedSource | null {
  const result = scrapedSourceSchema.safeParse(data);
  return result.success ? result.data : null;
}

// Batch validation for scraped results
export function validateScraperResults(data: unknown[]): {
  valid: ValidatedScraperResult[];
  invalid: Array<{ data: unknown; error: string }>;
} {
  const valid: ValidatedScraperResult[] = [];
  const invalid: Array<{ data: unknown; error: string }> = [];

  for (const item of data) {
    const result = scraperResultSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({
        data: item,
        error: result.error.message,
      });
    }
  }

  return { valid, invalid };
}
