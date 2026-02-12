// Import Validation Utilities

import type { Tool, Review } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImportValidationResult extends ValidationResult {
  validItems: number;
  invalidItems: number;
  duplicates: string[];
}

/**
 * Validate URL format
 */
function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate tool data
 */
export function validateTool(tool: Partial<Tool>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!tool.name || tool.name.trim() === '') {
    errors.push('Name is required');
  } else if (tool.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (tool.name.length > 200) {
    errors.push('Name must be less than 200 characters');
  }

  if (!tool.description || tool.description.trim() === '') {
    errors.push('Description is required');
  } else if (tool.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  } else if (tool.description.length > 2000) {
    warnings.push('Description is very long (over 2000 characters)');
  }

  if (!tool.website_url || tool.website_url.trim() === '') {
    errors.push('Website URL is required');
  } else if (!isValidURL(tool.website_url)) {
    errors.push('Website URL is invalid');
  }

  if (!tool.category || tool.category.trim() === '') {
    errors.push('Category is required');
  }

  // Optional fields validation
  if (tool.affiliate_link && !isValidURL(tool.affiliate_link)) {
    errors.push('Affiliate link is invalid');
  }

  if (tool.logo_url && !isValidURL(tool.logo_url)) {
    errors.push('Logo URL is invalid');
  }

  if (tool.screenshot_url && !isValidURL(tool.screenshot_url)) {
    errors.push('Screenshot URL is invalid');
  }

  // Pricing model validation
  const validPricingModels = ['free', 'freemium', 'paid', 'subscription'];
  if (tool.pricing_model && !validPricingModels.includes(tool.pricing_model)) {
    errors.push(`Pricing model must be one of: ${validPricingModels.join(', ')}`);
  }

  // Status validation
  const validStatuses = ['draft', 'published', 'archived'];
  if (tool.status && !validStatuses.includes(tool.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Arrays validation
  if (tool.features && !Array.isArray(tool.features)) {
    errors.push('Features must be an array');
  } else if (tool.features && tool.features.length === 0) {
    warnings.push('No features provided');
  }

  if (tool.tags && !Array.isArray(tool.tags)) {
    errors.push('Tags must be an array');
  } else if (tool.tags && tool.tags.length === 0) {
    warnings.push('No tags provided');
  }

  // Rating validation
  if (tool.rating !== undefined) {
    if (typeof tool.rating !== 'number') {
      errors.push('Rating must be a number');
    } else if (tool.rating < 0 || tool.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate review data
 */
export function validateReview(review: Partial<Review>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!review.tool_id || review.tool_id.trim() === '') {
    errors.push('Tool ID is required');
  }

  if (!review.title || review.title.trim() === '') {
    errors.push('Title is required');
  } else if (review.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  } else if (review.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!review.content || review.content.trim() === '') {
    errors.push('Content is required');
  } else if (review.content.length < 100) {
    warnings.push('Content is short (less than 100 characters)');
  }

  // Author validation
  if (!review.author || review.author.trim() === '') {
    warnings.push('No author specified');
  }

  // Rating validation
  if (review.rating !== undefined) {
    if (typeof review.rating !== 'number') {
      errors.push('Rating must be a number');
    } else if (review.rating < 0 || review.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }
  }

  // Status validation
  const validStatuses = ['draft', 'published', 'archived'];
  if (review.status && !validStatuses.includes(review.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Keywords validation
  if (review.keywords && !Array.isArray(review.keywords)) {
    errors.push('Keywords must be an array');
  } else if (review.keywords && review.keywords.length === 0) {
    warnings.push('No keywords provided (recommended for SEO)');
  }

  // SEO validation
  if (!review.seo_title || review.seo_title.trim() === '') {
    warnings.push('SEO title not set');
  } else if (review.seo_title.length > 60) {
    warnings.push('SEO title is longer than recommended (60 characters)');
  }

  if (!review.seo_description || review.seo_description.trim() === '') {
    warnings.push('SEO description not set');
  } else if (review.seo_description.length > 160) {
    warnings.push('SEO description is longer than recommended (160 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate batch of tools for import
 */
export function validateToolsImport(
  tools: Partial<Tool>[],
  existingTools?: Tool[]
): ImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const duplicates: string[] = [];
  let validItems = 0;
  let invalidItems = 0;

  // Check for duplicates in import
  const seenNames = new Set<string>();
  const seenUrls = new Set<string>();

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const rowNum = i + 2; // +2 for header and 0-index

    // Validate individual tool
    const validation = validateTool(tool);

    if (validation.isValid) {
      validItems++;
    } else {
      invalidItems++;
      errors.push(`Row ${rowNum}: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      warnings.push(`Row ${rowNum}: ${validation.warnings.join(', ')}`);
    }

    // Check for duplicates within import
    if (tool.name) {
      const nameLower = tool.name.toLowerCase();
      if (seenNames.has(nameLower)) {
        duplicates.push(`Row ${rowNum}: Duplicate name "${tool.name}"`);
      }
      seenNames.add(nameLower);
    }

    if (tool.website_url) {
      const urlLower = tool.website_url.toLowerCase();
      if (seenUrls.has(urlLower)) {
        duplicates.push(`Row ${rowNum}: Duplicate URL "${tool.website_url}"`);
      }
      seenUrls.add(urlLower);
    }

    // Check against existing tools
    if (existingTools && tool.website_url) {
      const exists = existingTools.find(
        (t) => t.website_url.toLowerCase() === tool.website_url!.toLowerCase()
      );
      if (exists) {
        duplicates.push(
          `Row ${rowNum}: Tool with URL "${tool.website_url}" already exists (ID: ${exists.id})`
        );
      }
    }
  }

  return {
    isValid: invalidItems === 0 && duplicates.length === 0,
    errors,
    warnings,
    validItems,
    invalidItems,
    duplicates,
  };
}

/**
 * Validate batch of reviews for import
 */
export function validateReviewsImport(
  reviews: Partial<Review>[],
  existingReviews?: Review[]
): ImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const duplicates: string[] = [];
  let validItems = 0;
  let invalidItems = 0;

  // Check for duplicates in import
  const seenToolIds = new Set<string>();

  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const rowNum = i + 2; // +2 for header and 0-index

    // Validate individual review
    const validation = validateReview(review);

    if (validation.isValid) {
      validItems++;
    } else {
      invalidItems++;
      errors.push(`Row ${rowNum}: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      warnings.push(`Row ${rowNum}: ${validation.warnings.join(', ')}`);
    }

    // Check for duplicates within import
    if (review.tool_id) {
      if (seenToolIds.has(review.tool_id)) {
        duplicates.push(
          `Row ${rowNum}: Multiple reviews for same tool ID "${review.tool_id}"`
        );
      }
      seenToolIds.add(review.tool_id);
    }

    // Check against existing reviews
    if (existingReviews && review.tool_id) {
      const exists = existingReviews.find((r) => r.tool_id === review.tool_id);
      if (exists) {
        duplicates.push(
          `Row ${rowNum}: Review for tool ID "${review.tool_id}" already exists (Review ID: ${exists.id})`
        );
      }
    }
  }

  return {
    isValid: invalidItems === 0 && duplicates.length === 0,
    errors,
    warnings,
    validItems,
    invalidItems,
    duplicates,
  };
}

/**
 * Sanitize tool data before import
 */
export function sanitizeTool(tool: Partial<Tool>): Partial<Tool> {
  return {
    ...tool,
    name: tool.name?.trim(),
    description: tool.description?.trim(),
    website_url: tool.website_url?.trim(),
    affiliate_link: tool.affiliate_link?.trim() || undefined,
    logo_url: tool.logo_url?.trim() || undefined,
    screenshot_url: tool.screenshot_url?.trim() || undefined,
    category: tool.category?.trim(),
    starting_price: tool.starting_price?.trim() || undefined,
    features: tool.features?.map((f) => f.trim()).filter(Boolean) || [],
    tags: tool.tags?.map((t) => t.trim()).filter(Boolean) || [],
    status: tool.status || 'draft',
    is_featured: tool.is_featured || false,
    is_sponsored: tool.is_sponsored || false,
    rating: tool.rating || 0,
    review_count: tool.review_count || 0,
    views: tool.views || 0,
    clicks: tool.clicks || 0,
  };
}

/**
 * Sanitize review data before import
 */
export function sanitizeReview(review: Partial<Review>): Partial<Review> {
  return {
    ...review,
    tool_id: review.tool_id?.trim(),
    title: review.title?.trim(),
    content: review.content?.trim(),
    author: review.author?.trim() || 'Admin',
    verdict: review.verdict?.trim() || undefined,
    keywords: review.keywords?.map((k) => k.trim()).filter(Boolean) || [],
    status: review.status || 'draft',
    rating: review.rating || 0,
    views: review.views || 0,
  };
}
