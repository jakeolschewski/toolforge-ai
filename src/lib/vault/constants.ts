/**
 * Workflow Vault Constants
 *
 * Business systems, W.E.D.G.E. categories, pricing tiers, file types,
 * and other constant values for the Workflow Vault system.
 *
 * @module lib/vault/constants
 */

import {
  WEDGECategory,
  BusinessSystem,
  PricingTier,
  MembershipTier,
  FileType,
  DifficultyLevel,
  UpdateFrequency,
} from '@/types/vault';

// ============================================================================
// W.E.D.G.E. CATEGORIES
// ============================================================================

/**
 * W.E.D.G.E. Framework Category Definitions
 *
 * W.E.D.G.E. is a comprehensive framework for organizing business workflows:
 * - Workflows: Complete step-by-step processes
 * - Engines: Automation systems and tools
 * - Dashboards: Tracking and analytics interfaces
 * - Generators: Content and asset creation tools
 * - Environments: Complete working setups
 */
export const WEDGE_CATEGORIES = [
  {
    id: WEDGECategory.WORKFLOWS,
    name: 'Workflows',
    slug: 'workflows',
    description: 'Complete step-by-step processes and standard operating procedures',
    icon: '🔄',
    color: '#3B82F6', // blue-500
    examples: ['Onboarding Process', 'Sales Pipeline', 'Content Creation Workflow'],
  },
  {
    id: WEDGECategory.ENGINES,
    name: 'Engines',
    slug: 'engines',
    description: 'Automation systems, tools, and recurring processes',
    icon: '⚙️',
    color: '#8B5CF6', // violet-500
    examples: ['Email Automation Engine', 'Lead Scoring Engine', 'Report Generator'],
  },
  {
    id: WEDGECategory.DASHBOARDS,
    name: 'Dashboards',
    slug: 'dashboards',
    description: 'Tracking interfaces, analytics views, and monitoring systems',
    icon: '📊',
    color: '#10B981', // green-500
    examples: ['Sales Dashboard', 'Marketing Analytics', 'Project Tracker'],
  },
  {
    id: WEDGECategory.GENERATORS,
    name: 'Generators',
    slug: 'generators',
    description: 'Content creation tools and asset generation systems',
    icon: '✨',
    color: '#F59E0B', // amber-500
    examples: ['Blog Post Generator', 'Social Media Templates', 'Email Campaigns'],
  },
  {
    id: WEDGECategory.ENVIRONMENTS,
    name: 'Environments',
    slug: 'environments',
    description: 'Complete working setups and integrated ecosystems',
    icon: '🏗️',
    color: '#EF4444', // red-500
    examples: ['Complete CRM Setup', 'Marketing Stack', 'Development Environment'],
  },
] as const;

// ============================================================================
// BUSINESS SYSTEMS
// ============================================================================

/**
 * Business System Categories
 * Organized by business function and department
 */
export const BUSINESS_SYSTEMS = [
  {
    id: BusinessSystem.CRM,
    name: 'CRM',
    slug: 'crm',
    description: 'Customer relationship management systems and processes',
    icon: '👥',
    color: '#3B82F6',
    keywords: ['customers', 'contacts', 'relationships', 'pipeline'],
  },
  {
    id: BusinessSystem.SALES,
    name: 'Sales',
    slug: 'sales',
    description: 'Sales processes, pipelines, and revenue generation',
    icon: '💰',
    color: '#10B981',
    keywords: ['revenue', 'deals', 'prospects', 'quotes', 'proposals'],
  },
  {
    id: BusinessSystem.MARKETING,
    name: 'Marketing',
    slug: 'marketing',
    description: 'Marketing campaigns, lead generation, and brand management',
    icon: '📢',
    color: '#F59E0B',
    keywords: ['campaigns', 'leads', 'content', 'advertising', 'brand'],
  },
  {
    id: BusinessSystem.OPERATIONS,
    name: 'Operations',
    slug: 'operations',
    description: 'Business operations, processes, and efficiency',
    icon: '⚡',
    color: '#8B5CF6',
    keywords: ['processes', 'efficiency', 'automation', 'optimization'],
  },
  {
    id: BusinessSystem.FINANCE,
    name: 'Finance',
    slug: 'finance',
    description: 'Financial management, accounting, and reporting',
    icon: '💵',
    color: '#EF4444',
    keywords: ['accounting', 'budgets', 'expenses', 'revenue', 'forecasting'],
  },
  {
    id: BusinessSystem.HR,
    name: 'HR',
    slug: 'hr',
    description: 'Human resources, recruitment, and team management',
    icon: '🤝',
    color: '#EC4899',
    keywords: ['hiring', 'onboarding', 'performance', 'culture', 'benefits'],
  },
  {
    id: BusinessSystem.SUPPORT,
    name: 'Support',
    slug: 'support',
    description: 'Customer support, ticketing, and service',
    icon: '🎧',
    color: '#14B8A6',
    keywords: ['tickets', 'helpdesk', 'service', 'customers', 'issues'],
  },
  {
    id: BusinessSystem.PRODUCT,
    name: 'Product',
    slug: 'product',
    description: 'Product management, development, and roadmaps',
    icon: '🚀',
    color: '#6366F1',
    keywords: ['features', 'roadmap', 'development', 'launches', 'feedback'],
  },
  {
    id: BusinessSystem.ANALYTICS,
    name: 'Analytics',
    slug: 'analytics',
    description: 'Data analysis, reporting, and insights',
    icon: '📈',
    color: '#06B6D4',
    keywords: ['data', 'metrics', 'reporting', 'insights', 'KPIs'],
  },
  {
    id: BusinessSystem.DEVELOPMENT,
    name: 'Development',
    slug: 'development',
    description: 'Software development and engineering processes',
    icon: '💻',
    color: '#84CC16',
    keywords: ['code', 'engineering', 'deployment', 'testing', 'DevOps'],
  },
  {
    id: BusinessSystem.DESIGN,
    name: 'Design',
    slug: 'design',
    description: 'Design systems, creative processes, and brand assets',
    icon: '🎨',
    color: '#F97316',
    keywords: ['UI', 'UX', 'creative', 'brand', 'graphics'],
  },
  {
    id: BusinessSystem.CONTENT,
    name: 'Content',
    slug: 'content',
    description: 'Content creation, management, and publishing',
    icon: '✍️',
    color: '#A855F7',
    keywords: ['writing', 'publishing', 'blog', 'social', 'media'],
  },
] as const;

// ============================================================================
// PRICING TIERS
// ============================================================================

/**
 * Pricing Tier Definitions
 */
export const PRICING_TIERS = [
  {
    id: PricingTier.FREE,
    name: 'Free',
    slug: 'free',
    description: 'Free workflows and templates',
    price_range: '$0',
    badge: 'Free',
    badge_color: '#10B981', // green
  },
  {
    id: PricingTier.STARTER,
    name: 'Starter',
    slug: 'starter',
    description: 'Basic workflows for individuals',
    price_range: '$5 - $29',
    badge: 'Starter',
    badge_color: '#3B82F6', // blue
  },
  {
    id: PricingTier.PRO,
    name: 'Pro',
    slug: 'pro',
    description: 'Professional workflows for teams',
    price_range: '$30 - $99',
    badge: 'Pro',
    badge_color: '#8B5CF6', // violet
  },
  {
    id: PricingTier.PREMIUM,
    name: 'Premium',
    slug: 'premium',
    description: 'Advanced workflows with premium features',
    price_range: '$100 - $299',
    badge: 'Premium',
    badge_color: '#F59E0B', // amber
  },
  {
    id: PricingTier.ENTERPRISE,
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Enterprise-grade complete systems',
    price_range: '$300+',
    badge: 'Enterprise',
    badge_color: '#EF4444', // red
  },
] as const;

// ============================================================================
// MEMBERSHIP TIERS
// ============================================================================

/**
 * Membership Tier Definitions
 */
export const MEMBERSHIP_TIERS = [
  {
    id: MembershipTier.FREE,
    name: 'Free',
    slug: 'free',
    description: 'Access to free workflows only',
    monthly_price: 0,
    annual_price: 0,
    workflows_limit: 'free_only',
    downloads_per_month: 5,
    features: [
      'Access to free workflows',
      '5 downloads per month',
      'Basic support',
      'Community access',
    ],
    badge: null,
    is_popular: false,
  },
  {
    id: MembershipTier.BASIC,
    name: 'Basic',
    slug: 'basic',
    description: 'Essential workflows and templates',
    monthly_price: 1900, // $19.00 in cents
    annual_price: 19000, // $190.00 in cents (save ~17%)
    workflows_limit: 10,
    downloads_per_month: 50,
    features: [
      'Access to 10+ workflows',
      '50 downloads per month',
      'Priority email support',
      'Early access to new releases',
      'Lifetime updates',
    ],
    badge: null,
    is_popular: false,
  },
  {
    id: MembershipTier.PRO,
    name: 'Pro',
    slug: 'pro',
    description: 'Full access to the workflow vault',
    monthly_price: 4900, // $49.00 in cents
    annual_price: 49000, // $490.00 in cents (save ~17%)
    workflows_limit: 'unlimited',
    downloads_per_month: 'unlimited',
    features: [
      'Unlimited workflow access',
      'Unlimited downloads',
      'Priority support',
      'Early access to new releases',
      'Exclusive templates',
      'Custom workflow requests (1/month)',
      'Private community access',
    ],
    badge: 'Most Popular',
    is_popular: true,
  },
  {
    id: MembershipTier.PREMIUM,
    name: 'Premium',
    slug: 'premium',
    description: 'VIP access with personalization',
    monthly_price: 9900, // $99.00 in cents
    annual_price: 99000, // $990.00 in cents (save ~17%)
    workflows_limit: 'unlimited',
    downloads_per_month: 'unlimited',
    features: [
      'Everything in Pro',
      '1-on-1 onboarding call',
      'Custom workflow creation (3/month)',
      'Priority feature requests',
      'White-label options',
      'VIP support (24hr response)',
      'Quarterly strategy sessions',
    ],
    badge: 'VIP',
    is_popular: false,
  },
  {
    id: MembershipTier.LIFETIME,
    name: 'Lifetime',
    slug: 'lifetime',
    description: 'One-time payment, lifetime access',
    monthly_price: 0,
    annual_price: 99900, // $999.00 in cents (one-time)
    workflows_limit: 'unlimited',
    downloads_per_month: 'unlimited',
    features: [
      'Lifetime access to all workflows',
      'Unlimited downloads forever',
      'All future updates included',
      'Priority support',
      'Early access to new releases',
      'Founding member badge',
      'Grandfather pricing on new tiers',
    ],
    badge: 'Best Value',
    is_popular: false,
  },
] as const;

// ============================================================================
// FILE TYPES
// ============================================================================

/**
 * Supported File Types and Extensions
 */
export const FILE_TYPES = [
  {
    id: FileType.PDF,
    name: 'PDF',
    extension: '.pdf',
    mime_type: 'application/pdf',
    icon: '📄',
    description: 'PDF document',
  },
  {
    id: FileType.DOCX,
    name: 'Word Document',
    extension: '.docx',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: '📝',
    description: 'Microsoft Word document',
  },
  {
    id: FileType.XLSX,
    name: 'Excel Spreadsheet',
    extension: '.xlsx',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: '📊',
    description: 'Microsoft Excel spreadsheet',
  },
  {
    id: FileType.PPTX,
    name: 'PowerPoint',
    extension: '.pptx',
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    icon: '📽️',
    description: 'Microsoft PowerPoint presentation',
  },
  {
    id: FileType.ZIP,
    name: 'ZIP Archive',
    extension: '.zip',
    mime_type: 'application/zip',
    icon: '🗜️',
    description: 'Compressed archive',
  },
  {
    id: FileType.JSON,
    name: 'JSON',
    extension: '.json',
    mime_type: 'application/json',
    icon: '📋',
    description: 'JSON data file',
  },
  {
    id: FileType.CSV,
    name: 'CSV',
    extension: '.csv',
    mime_type: 'text/csv',
    icon: '📊',
    description: 'Comma-separated values',
  },
  {
    id: FileType.MD,
    name: 'Markdown',
    extension: '.md',
    mime_type: 'text/markdown',
    icon: '📝',
    description: 'Markdown document',
  },
  {
    id: FileType.HTML,
    name: 'HTML',
    extension: '.html',
    mime_type: 'text/html',
    icon: '🌐',
    description: 'HTML document',
  },
  {
    id: FileType.VIDEO,
    name: 'Video',
    extension: '.mp4',
    mime_type: 'video/mp4',
    icon: '🎥',
    description: 'Video file',
  },
  {
    id: FileType.NOTION,
    name: 'Notion Template',
    extension: '.notion',
    mime_type: 'application/octet-stream',
    icon: '📓',
    description: 'Notion template link',
  },
  {
    id: FileType.AIRTABLE,
    name: 'Airtable Base',
    extension: '.airtable',
    mime_type: 'application/octet-stream',
    icon: '🗂️',
    description: 'Airtable base link',
  },
  {
    id: FileType.TEMPLATE,
    name: 'Template',
    extension: '.template',
    mime_type: 'application/octet-stream',
    icon: '📋',
    description: 'Generic template file',
  },
] as const;

// ============================================================================
// DIFFICULTY LEVELS
// ============================================================================

/**
 * Workflow Difficulty Levels
 */
export const DIFFICULTY_LEVELS = [
  {
    id: DifficultyLevel.BEGINNER,
    name: 'Beginner',
    slug: 'beginner',
    description: 'No prior experience required',
    icon: '🌱',
    color: '#10B981', // green
    estimated_time_range: '15-30 minutes',
  },
  {
    id: DifficultyLevel.INTERMEDIATE,
    name: 'Intermediate',
    slug: 'intermediate',
    description: 'Some experience recommended',
    icon: '🌿',
    color: '#3B82F6', // blue
    estimated_time_range: '30-60 minutes',
  },
  {
    id: DifficultyLevel.ADVANCED,
    name: 'Advanced',
    slug: 'advanced',
    description: 'Solid understanding required',
    icon: '🌳',
    color: '#F59E0B', // amber
    estimated_time_range: '1-2 hours',
  },
  {
    id: DifficultyLevel.EXPERT,
    name: 'Expert',
    slug: 'expert',
    description: 'Advanced knowledge required',
    icon: '🏔️',
    color: '#EF4444', // red
    estimated_time_range: '2+ hours',
  },
] as const;

// ============================================================================
// UPDATE FREQUENCIES
// ============================================================================

/**
 * Workflow Update Frequencies
 */
export const UPDATE_FREQUENCIES = [
  {
    id: UpdateFrequency.WEEKLY,
    name: 'Weekly',
    slug: 'weekly',
    description: 'Updated every week',
    interval_days: 7,
  },
  {
    id: UpdateFrequency.MONTHLY,
    name: 'Monthly',
    slug: 'monthly',
    description: 'Updated every month',
    interval_days: 30,
  },
  {
    id: UpdateFrequency.QUARTERLY,
    name: 'Quarterly',
    slug: 'quarterly',
    description: 'Updated every quarter',
    interval_days: 90,
  },
  {
    id: UpdateFrequency.YEARLY,
    name: 'Yearly',
    slug: 'yearly',
    description: 'Updated annually',
    interval_days: 365,
  },
  {
    id: UpdateFrequency.AS_NEEDED,
    name: 'As Needed',
    slug: 'as-needed',
    description: 'Updated when necessary',
    interval_days: null,
  },
] as const;

// ============================================================================
// CURRENCY & FORMATTING
// ============================================================================

/**
 * Default currency settings
 */
export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  decimal_places: 2,
} as const;

/**
 * Format price in cents to display string
 */
export function formatPrice(cents: number, currency: string = CURRENCY.code): string {
  const dollars = cents / 100;

  if (currency === 'USD') {
    return `$${dollars.toFixed(2)}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(original: number, current: number): number {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
}

// ============================================================================
// RATING & REVIEWS
// ============================================================================

/**
 * Rating configurations
 */
export const RATING_CONFIG = {
  min: 1,
  max: 5,
  default: 0,
  step: 0.5,
} as const;

/**
 * Review length limits
 */
export const REVIEW_LIMITS = {
  min_length: 10,
  max_length: 5000,
  title_max_length: 100,
} as const;

// ============================================================================
// DOWNLOAD LIMITS
// ============================================================================

/**
 * Download configurations
 */
export const DOWNLOAD_CONFIG = {
  /** Maximum file size in bytes (100MB) */
  max_file_size: 100 * 1024 * 1024,

  /** Link expiry time in seconds (24 hours) */
  link_expiry_seconds: 24 * 60 * 60,

  /** Maximum concurrent downloads per user */
  max_concurrent_downloads: 3,

  /** Rate limit per user per hour */
  rate_limit_per_hour: 50,
} as const;

// ============================================================================
// SEO & META
// ============================================================================

/**
 * SEO configurations
 */
export const SEO_CONFIG = {
  title_max_length: 60,
  description_max_length: 160,
  keywords_max_count: 10,
  slug_max_length: 100,
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  default_page: 1,
  default_limit: 20,
  max_limit: 100,
} as const;

// ============================================================================
// LOOKUP MAPS (for quick access)
// ============================================================================

/**
 * Get WEDGE category by ID
 */
export const WEDGE_CATEGORY_MAP = Object.fromEntries(
  WEDGE_CATEGORIES.map((cat) => [cat.id, cat])
);

/**
 * Get business system by ID
 */
export const BUSINESS_SYSTEM_MAP = Object.fromEntries(
  BUSINESS_SYSTEMS.map((sys) => [sys.id, sys])
);

/**
 * Get pricing tier by ID
 */
export const PRICING_TIER_MAP = Object.fromEntries(
  PRICING_TIERS.map((tier) => [tier.id, tier])
);

/**
 * Get membership tier by ID
 */
export const MEMBERSHIP_TIER_MAP = Object.fromEntries(
  MEMBERSHIP_TIERS.map((tier) => [tier.id, tier])
);

/**
 * Get file type by ID
 */
export const FILE_TYPE_MAP = Object.fromEntries(
  FILE_TYPES.map((type) => [type.id, type])
);

/**
 * Get difficulty level by ID
 */
export const DIFFICULTY_LEVEL_MAP = Object.fromEntries(
  DIFFICULTY_LEVELS.map((level) => [level.id, level])
);
