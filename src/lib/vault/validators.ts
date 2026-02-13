/**
 * Workflow Vault Validators
 *
 * Validation utilities for workflow data, purchases, and user input.
 *
 * @module lib/vault/validators
 */

import {
  Workflow,
  WorkflowInput,
  WorkflowPurchase,
  Membership,
  WorkflowReview,
  PricingTier,
  DifficultyLevel,
  WEDGECategory,
  BusinessSystem,
} from '@/types/vault';
import { SEO_CONFIG, REVIEW_LIMITS } from './constants';

// ============================================================================
// WORKFLOW VALIDATION
// ============================================================================

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate workflow input data
 */
export function validateWorkflowInput(input: Partial<WorkflowInput>): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!input.title || input.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (input.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (input.title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  // Description validation
  if (!input.description || input.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (input.description.length < 20) {
    errors.push('Description must be at least 20 characters');
  } else if (input.description.length > 5000) {
    errors.push('Description must not exceed 5000 characters');
  }

  // Category validation
  if (!input.wedge_category) {
    errors.push('W.E.D.G.E. category is required');
  } else if (!Object.values(WEDGECategory).includes(input.wedge_category)) {
    errors.push('Invalid W.E.D.G.E. category');
  }

  // Business system validation
  if (!input.business_system) {
    errors.push('Business system is required');
  } else if (!Object.values(BusinessSystem).includes(input.business_system)) {
    errors.push('Invalid business system');
  }

  // Pricing validation
  if (input.pricing_tier === undefined) {
    errors.push('Pricing tier is required');
  } else if (!Object.values(PricingTier).includes(input.pricing_tier)) {
    errors.push('Invalid pricing tier');
  }

  if (input.price === undefined || input.price === null) {
    errors.push('Price is required');
  } else if (input.price < 0) {
    errors.push('Price cannot be negative');
  } else if (input.pricing_tier === PricingTier.FREE && input.price !== 0) {
    errors.push('Free tier workflows must have price of 0');
  } else if (input.pricing_tier === PricingTier.STARTER && (input.price < 500 || input.price > 2900)) {
    errors.push('Starter tier price must be between $5.00 and $29.00');
  } else if (input.pricing_tier === PricingTier.PRO && (input.price < 3000 || input.price > 9900)) {
    errors.push('Pro tier price must be between $30.00 and $99.00');
  } else if (input.pricing_tier === PricingTier.PREMIUM && (input.price < 10000 || input.price > 29900)) {
    errors.push('Premium tier price must be between $100.00 and $299.00');
  } else if (input.pricing_tier === PricingTier.ENTERPRISE && input.price < 30000) {
    errors.push('Enterprise tier price must be at least $300.00');
  }

  // Original price validation
  if (input.original_price !== undefined && input.original_price < input.price!) {
    errors.push('Original price must be greater than current price');
  }

  // Difficulty validation
  if (input.difficulty_level && !Object.values(DifficultyLevel).includes(input.difficulty_level)) {
    errors.push('Invalid difficulty level');
  }

  // Features validation
  if (!input.features || input.features.length === 0) {
    errors.push('At least one feature is required');
  } else if (input.features.length > 20) {
    errors.push('Maximum 20 features allowed');
  }

  // Includes validation
  if (!input.includes || input.includes.length === 0) {
    errors.push('At least one included item is required');
  } else if (input.includes.length > 30) {
    errors.push('Maximum 30 included items allowed');
  }

  // Tags validation
  if (!input.tags || input.tags.length === 0) {
    errors.push('At least one tag is required');
  } else if (input.tags.length > 20) {
    errors.push('Maximum 20 tags allowed');
  } else if (input.tags.some(tag => tag.length > 50)) {
    errors.push('Tags must not exceed 50 characters');
  }

  // SEO validation
  if (input.seo_title && input.seo_title.length > SEO_CONFIG.title_max_length) {
    errors.push(`SEO title must not exceed ${SEO_CONFIG.title_max_length} characters`);
  }

  if (input.seo_description && input.seo_description.length > SEO_CONFIG.description_max_length) {
    errors.push(`SEO description must not exceed ${SEO_CONFIG.description_max_length} characters`);
  }

  if (input.seo_keywords && input.seo_keywords.length > SEO_CONFIG.keywords_max_count) {
    errors.push(`Maximum ${SEO_CONFIG.keywords_max_count} SEO keywords allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate workflow slug
 */
export function validateSlug(slug: string): ValidationResult {
  const errors: string[] = [];

  if (!slug || slug.trim().length === 0) {
    errors.push('Slug is required');
  } else if (slug.length < 3) {
    errors.push('Slug must be at least 3 characters');
  } else if (slug.length > SEO_CONFIG.slug_max_length) {
    errors.push(`Slug must not exceed ${SEO_CONFIG.slug_max_length} characters`);
  }

  // Slug format validation
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (slug && !slugRegex.test(slug)) {
    errors.push('Slug must be lowercase alphanumeric with hyphens only');
  }

  // Reserved slugs
  const reservedSlugs = ['admin', 'api', 'auth', 'dashboard', 'new', 'edit', 'delete'];
  if (reservedSlugs.includes(slug)) {
    errors.push('This slug is reserved and cannot be used');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// REVIEW VALIDATION
// ============================================================================

/**
 * Validate workflow review
 */
export function validateReview(review: Partial<WorkflowReview>): ValidationResult {
  const errors: string[] = [];

  // Content validation
  if (!review.content || review.content.trim().length === 0) {
    errors.push('Review content is required');
  } else if (review.content.length < REVIEW_LIMITS.min_length) {
    errors.push(`Review must be at least ${REVIEW_LIMITS.min_length} characters`);
  } else if (review.content.length > REVIEW_LIMITS.max_length) {
    errors.push(`Review must not exceed ${REVIEW_LIMITS.max_length} characters`);
  }

  // Title validation
  if (review.title && review.title.length > REVIEW_LIMITS.title_max_length) {
    errors.push(`Review title must not exceed ${REVIEW_LIMITS.title_max_length} characters`);
  }

  // Rating validation
  if (review.rating === undefined || review.rating === null) {
    errors.push('Rating is required');
  } else if (review.rating < 1 || review.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// URL VALIDATION
// ============================================================================

/**
 * Validate URL format
 */
export function validateUrl(url: string, fieldName: string = 'URL'): ValidationResult {
  const errors: string[] = [];

  if (!url || url.trim().length === 0) {
    return { valid: true, errors: [] }; // URLs are usually optional
  }

  try {
    const urlObj = new URL(url);

    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push(`${fieldName} must use HTTP or HTTPS protocol`);
    }

    // Check for valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      errors.push(`${fieldName} must have a valid hostname`);
    }
  } catch {
    errors.push(`${fieldName} is not a valid URL`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string, fieldName: string = 'Image URL'): ValidationResult {
  const urlValidation = validateUrl(url, fieldName);

  if (!urlValidation.valid) {
    return urlValidation;
  }

  const errors: string[] = [];

  // Check file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasValidExtension = validExtensions.some(ext =>
    url.toLowerCase().endsWith(ext)
  );

  if (!hasValidExtension && url.trim().length > 0) {
    errors.push(`${fieldName} must be a valid image file (${validExtensions.join(', ')})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// PRICE VALIDATION
// ============================================================================

/**
 * Validate price value
 */
export function validatePrice(
  price: number,
  tier: PricingTier,
  currency: string = 'USD'
): ValidationResult {
  const errors: string[] = [];

  if (price === undefined || price === null) {
    errors.push('Price is required');
    return { valid: false, errors };
  }

  if (price < 0) {
    errors.push('Price cannot be negative');
  }

  if (!Number.isInteger(price)) {
    errors.push('Price must be in cents (whole number)');
  }

  // Tier-specific validation
  if (tier === PricingTier.FREE && price !== 0) {
    errors.push('Free tier must have price of 0');
  } else if (tier === PricingTier.STARTER && (price < 500 || price > 2900)) {
    errors.push('Starter tier price must be between $5.00 and $29.00');
  } else if (tier === PricingTier.PRO && (price < 3000 || price > 9900)) {
    errors.push('Pro tier price must be between $30.00 and $99.00');
  } else if (tier === PricingTier.PREMIUM && (price < 10000 || price > 29900)) {
    errors.push('Premium tier price must be between $100.00 and $299.00');
  } else if (tier === PricingTier.ENTERPRISE && price < 30000) {
    errors.push('Enterprise tier price must be at least $300.00');
  }

  // Currency validation
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  if (!validCurrencies.includes(currency)) {
    errors.push(`Currency must be one of: ${validCurrencies.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
    return { valid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  if (email.length > 254) {
    errors.push('Email must not exceed 254 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// LICENSE KEY VALIDATION
// ============================================================================

/**
 * Validate license key format
 */
export function validateLicenseKey(key: string): ValidationResult {
  const errors: string[] = [];

  if (!key || key.trim().length === 0) {
    errors.push('License key is required');
    return { valid: false, errors };
  }

  // Format: XXXX-XXXX-XXXX-XXXX (4 segments of 4 characters)
  const licenseRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (!licenseRegex.test(key)) {
    errors.push('Invalid license key format (expected: XXXX-XXXX-XXXX-XXXX)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// PURCHASE VALIDATION
// ============================================================================

/**
 * Validate purchase data
 */
export function validatePurchase(purchase: Partial<WorkflowPurchase>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!purchase.workflow_id) {
    errors.push('Workflow ID is required');
  }

  if (!purchase.user_id) {
    errors.push('User ID is required');
  }

  if (!purchase.user_email) {
    errors.push('User email is required');
  } else {
    const emailValidation = validateEmail(purchase.user_email);
    if (!emailValidation.valid) {
      errors.push(...emailValidation.errors);
    }
  }

  if (purchase.amount === undefined || purchase.amount === null) {
    errors.push('Amount is required');
  } else if (purchase.amount < 0) {
    errors.push('Amount cannot be negative');
  }

  if (!purchase.currency) {
    errors.push('Currency is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// MEMBERSHIP VALIDATION
// ============================================================================

/**
 * Validate membership data
 */
export function validateMembership(membership: Partial<Membership>): ValidationResult {
  const errors: string[] = [];

  if (!membership.user_id) {
    errors.push('User ID is required');
  }

  if (!membership.tier) {
    errors.push('Membership tier is required');
  }

  if (!membership.status) {
    errors.push('Membership status is required');
  }

  if (!membership.billing_period) {
    errors.push('Billing period is required');
  } else if (!['monthly', 'annual'].includes(membership.billing_period)) {
    errors.push('Billing period must be "monthly" or "annual"');
  }

  if (membership.price === undefined || membership.price === null) {
    errors.push('Price is required');
  } else if (membership.price < 0) {
    errors.push('Price cannot be negative');
  }

  if (!membership.current_period_start) {
    errors.push('Current period start is required');
  }

  if (!membership.current_period_end) {
    errors.push('Current period end is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validate file size
 */
export function validateFileSize(
  sizeInBytes: number,
  maxSizeInBytes: number = 100 * 1024 * 1024 // 100MB default
): ValidationResult {
  const errors: string[] = [];

  if (sizeInBytes > maxSizeInBytes) {
    const maxSizeMB = Math.round(maxSizeInBytes / (1024 * 1024));
    const actualSizeMB = Math.round(sizeInBytes / (1024 * 1024));
    errors.push(`File size (${actualSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file type/extension
 */
export function validateFileType(
  filename: string,
  allowedExtensions: string[]
): ValidationResult {
  const errors: string[] = [];

  const extension = filename.toLowerCase().split('.').pop();

  if (!extension) {
    errors.push('File must have an extension');
  } else if (!allowedExtensions.includes(`.${extension}`)) {
    errors.push(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

/**
 * Validate multiple items and collect all errors
 */
export function batchValidate<T>(
  items: T[],
  validator: (item: T) => ValidationResult
): ValidationResult {
  const allErrors: string[] = [];

  items.forEach((item, index) => {
    const result = validator(item);
    if (!result.valid) {
      result.errors.forEach(error => {
        allErrors.push(`Item ${index + 1}: ${error}`);
      });
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

// ============================================================================
// All validators are already exported via 'export function' declarations above
// No need for additional export statements
// ============================================================================
