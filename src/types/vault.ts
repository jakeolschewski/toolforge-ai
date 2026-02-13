/**
 * Workflow Vault Type Definitions
 *
 * Comprehensive TypeScript types for the Workflow Vault system.
 * This includes workflows, purchases, memberships, analytics, and more.
 *
 * @module types/vault
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * W.E.D.G.E. Framework Categories
 * - Workflows: Complete step-by-step processes
 * - Engines: Automation systems and tools
 * - Dashboards: Tracking and analytics interfaces
 * - Generators: Content and asset creation tools
 * - Environments: Complete working setups
 */
export enum WEDGECategory {
  WORKFLOWS = 'workflows',
  ENGINES = 'engines',
  DASHBOARDS = 'dashboards',
  GENERATORS = 'generators',
  ENVIRONMENTS = 'environments',
}

/**
 * Business system categories for workflow organization
 */
export enum BusinessSystem {
  CRM = 'crm',
  SALES = 'sales',
  MARKETING = 'marketing',
  OPERATIONS = 'operations',
  FINANCE = 'finance',
  HR = 'hr',
  SUPPORT = 'support',
  PRODUCT = 'product',
  ANALYTICS = 'analytics',
  DEVELOPMENT = 'development',
  DESIGN = 'design',
  CONTENT = 'content',
}

/**
 * Workflow status states
 */
export enum WorkflowStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  COMING_SOON = 'coming_soon',
  UPDATED = 'updated',
}

/**
 * Pricing tier levels
 */
export enum PricingTier {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

/**
 * Membership subscription tiers
 */
export enum MembershipTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
  LIFETIME = 'lifetime',
}

/**
 * Membership status states
 */
export enum MembershipStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  PENDING = 'pending',
}

/**
 * File types for workflow downloads
 */
export enum FileType {
  PDF = 'pdf',
  DOCX = 'docx',
  XLSX = 'xlsx',
  PPTX = 'pptx',
  ZIP = 'zip',
  JSON = 'json',
  CSV = 'csv',
  MD = 'md',
  HTML = 'html',
  VIDEO = 'video',
  NOTION = 'notion',
  AIRTABLE = 'airtable',
  TEMPLATE = 'template',
}

/**
 * Purchase status states
 */
export enum PurchaseStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Review rating values
 */
export enum ReviewRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

/**
 * Workflow difficulty levels
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

/**
 * Update frequency for workflows
 */
export enum UpdateFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  AS_NEEDED = 'as_needed',
}

// ============================================================================
// CORE WORKFLOW TYPES
// ============================================================================

/**
 * Main Workflow entity
 * Represents a complete workflow/template in the vault
 */
export interface Workflow {
  /** Unique identifier */
  id: string;

  /** URL-friendly slug */
  slug: string;

  /** Workflow title */
  title: string;

  /** Short description (tagline) */
  tagline?: string;

  /** Full description (markdown supported) */
  description: string;

  /** Long-form content (markdown supported) */
  long_description?: string;

  /** W.E.D.G.E. category */
  wedge_category: WEDGECategory;

  /** Business system category */
  business_system: BusinessSystem;

  /** Additional subcategory */
  subcategory?: string;

  /** Pricing tier */
  pricing_tier: PricingTier;

  /** Price in cents (USD) */
  price: number;

  /** Original price (for showing discounts) */
  original_price?: number;

  /** Currency code (default: USD) */
  currency: string;

  /** Is this workflow free? */
  is_free: boolean;

  /** Featured/hero image URL */
  featured_image?: string;

  /** Thumbnail image URL */
  thumbnail_url?: string;

  /** Gallery images */
  gallery_images?: string[];

  /** Preview video URL */
  preview_video_url?: string;

  /** Demo URL or live preview */
  demo_url?: string;

  /** Tags for filtering and search */
  tags: string[];

  /** Related tool IDs */
  related_tools?: string[];

  /** Required tools/software */
  required_tools?: string[];

  /** Difficulty level */
  difficulty_level: DifficultyLevel;

  /** Estimated completion time (in minutes) */
  estimated_time?: number;

  /** Number of steps */
  step_count?: number;

  /** Key features list */
  features: string[];

  /** What's included in the package */
  includes: string[];

  /** Learning outcomes */
  outcomes?: string[];

  /** Target audience */
  target_audience?: string[];

  /** Prerequisites */
  prerequisites?: string[];

  /** Workflow status */
  status: WorkflowStatus;

  /** Is this featured on homepage? */
  is_featured: boolean;

  /** Is this a trending workflow? */
  is_trending: boolean;

  /** Is this a new release? */
  is_new: boolean;

  /** Is this a bestseller? */
  is_bestseller: boolean;

  /** Average rating (1-5) */
  rating: number;

  /** Number of reviews */
  review_count: number;

  /** Number of purchases */
  purchase_count: number;

  /** Number of downloads */
  download_count: number;

  /** Number of views */
  view_count: number;

  /** Number of favorites/saves */
  favorite_count: number;

  /** Creator/author ID */
  author_id: string;

  /** Creator/author name */
  author_name?: string;

  /** Creator/author avatar */
  author_avatar?: string;

  /** SEO title */
  seo_title?: string;

  /** SEO meta description */
  seo_description?: string;

  /** SEO keywords */
  seo_keywords?: string[];

  /** Open Graph image */
  og_image?: string;

  /** Last update version */
  version?: string;

  /** Update frequency */
  update_frequency?: UpdateFrequency;

  /** Changelog entries */
  changelog?: WorkflowChangelogEntry[];

  /** FAQ entries */
  faq?: WorkflowFAQEntry[];

  /** Testimonials */
  testimonials?: WorkflowTestimonial[];

  /** Affiliate commission percentage */
  affiliate_commission?: number;

  /** Custom metadata */
  metadata?: Record<string, any>;

  /** Timestamps */
  created_at: string;
  updated_at: string;
  published_at?: string;
  last_downloaded_at?: string;
}

/**
 * Workflow changelog entry
 */
export interface WorkflowChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  is_major?: boolean;
}

/**
 * Workflow FAQ entry
 */
export interface WorkflowFAQEntry {
  question: string;
  answer: string;
  order?: number;
}

/**
 * Workflow testimonial
 */
export interface WorkflowTestimonial {
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
  date?: string;
}

/**
 * Workflow category grouping
 */
export interface WorkflowCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  wedge_category?: WEDGECategory;
  business_system?: BusinessSystem;
  workflow_count: number;
  order_index: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PURCHASE & DOWNLOAD TYPES
// ============================================================================

/**
 * Workflow purchase record
 */
export interface WorkflowPurchase {
  id: string;
  workflow_id: string;
  user_id: string;
  user_email: string;

  /** Purchase amount in cents */
  amount: number;
  currency: string;

  /** Purchase status */
  status: PurchaseStatus;

  /** Payment method */
  payment_method?: string;

  /** Stripe payment intent ID */
  stripe_payment_intent_id?: string;

  /** Stripe customer ID */
  stripe_customer_id?: string;

  /** Transaction/order ID */
  transaction_id?: string;

  /** License key */
  license_key?: string;

  /** Number of allowed downloads */
  download_limit?: number;

  /** Number of times downloaded */
  downloads_used: number;

  /** Coupon code used */
  coupon_code?: string;

  /** Discount amount */
  discount_amount?: number;

  /** Referral source */
  referral_source?: string;

  /** Affiliate ID (if purchased via affiliate) */
  affiliate_id?: string;

  /** Invoice URL */
  invoice_url?: string;

  /** Receipt URL */
  receipt_url?: string;

  /** Purchase notes */
  notes?: string;

  /** Refund details */
  refund_reason?: string;
  refunded_at?: string;
  refund_amount?: number;

  /** Timestamps */
  purchased_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Workflow download record
 */
export interface WorkflowDownload {
  id: string;
  workflow_id: string;
  purchase_id?: string;
  user_id: string;

  /** File type downloaded */
  file_type: FileType;

  /** File size in bytes */
  file_size?: number;

  /** Download URL (temporary signed URL) */
  download_url?: string;

  /** Download expiry timestamp */
  expires_at?: string;

  /** IP address hash */
  ip_hash?: string;

  /** User agent */
  user_agent?: string;

  /** Download completed successfully */
  is_completed: boolean;

  /** Timestamps */
  downloaded_at: string;
  created_at: string;
}

// ============================================================================
// MEMBERSHIP TYPES
// ============================================================================

/**
 * Membership subscription
 */
export interface Membership {
  id: string;
  user_id: string;

  /** Membership tier */
  tier: MembershipTier;

  /** Subscription status */
  status: MembershipStatus;

  /** Monthly or annual billing */
  billing_period: 'monthly' | 'annual';

  /** Price in cents */
  price: number;
  currency: string;

  /** Stripe subscription ID */
  stripe_subscription_id?: string;

  /** Stripe customer ID */
  stripe_customer_id?: string;

  /** Payment method details */
  payment_method_id?: string;
  payment_method_brand?: string;
  payment_method_last4?: string;

  /** Trial period */
  trial_start?: string;
  trial_end?: string;
  is_trial: boolean;

  /** Billing dates */
  current_period_start: string;
  current_period_end: string;

  /** Cancellation details */
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  cancellation_reason?: string;

  /** Access benefits */
  workflows_included: string[];
  download_limit?: number;
  has_priority_support: boolean;
  has_early_access: boolean;

  /** Timestamps */
  created_at: string;
  updated_at: string;
  started_at?: string;
  ended_at?: string;
}

/**
 * Membership plan details
 */
export interface MembershipPlan {
  id: string;
  tier: MembershipTier;
  name: string;
  description: string;

  /** Pricing */
  monthly_price: number;
  annual_price: number;
  annual_savings: number;
  currency: string;

  /** Features */
  features: string[];
  workflows_included: number | 'unlimited';
  downloads_per_month: number | 'unlimited';
  priority_support: boolean;
  early_access: boolean;
  custom_requests: boolean;

  /** Trial details */
  trial_days?: number;

  /** Stripe product/price IDs */
  stripe_monthly_price_id?: string;
  stripe_annual_price_id?: string;

  /** Display settings */
  is_popular: boolean;
  is_featured: boolean;
  badge?: string;
  order_index: number;

  /** Status */
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

// ============================================================================
// REVIEW & RATING TYPES
// ============================================================================

/**
 * Workflow review
 */
export interface WorkflowReview {
  id: string;
  workflow_id: string;
  user_id: string;
  purchase_id?: string;

  /** Review content */
  title?: string;
  content: string;

  /** Rating (1-5 stars) */
  rating: ReviewRating;

  /** Verified purchase */
  is_verified_purchase: boolean;

  /** Review status */
  status: 'pending' | 'approved' | 'rejected' | 'flagged';

  /** Helpful votes */
  helpful_count: number;
  not_helpful_count: number;

  /** Author details */
  author_name?: string;
  author_avatar?: string;
  author_verified?: boolean;

  /** Response from creator */
  creator_response?: string;
  creator_responded_at?: string;

  /** Moderation */
  flagged_reason?: string;
  moderated_by?: string;
  moderated_at?: string;

  /** Timestamps */
  created_at: string;
  updated_at: string;
  published_at?: string;
}

/**
 * Review vote (helpful/not helpful)
 */
export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

// ============================================================================
// UPDATE & VERSION TYPES
// ============================================================================

/**
 * Workflow update/version
 */
export interface WorkflowUpdate {
  id: string;
  workflow_id: string;

  /** Version information */
  version: string;
  version_code: number;

  /** Update details */
  title: string;
  description: string;
  changelog: string[];

  /** Update type */
  is_major_update: boolean;
  is_breaking_change: boolean;

  /** File information */
  file_urls: Record<FileType, string>;
  file_sizes: Record<FileType, number>;

  /** Notification sent to users */
  notification_sent: boolean;
  notification_sent_at?: string;

  /** Timestamps */
  released_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BUNDLE TYPES
// ============================================================================

/**
 * Workflow bundle/package
 */
export interface WorkflowBundle {
  id: string;
  slug: string;

  /** Bundle details */
  name: string;
  description: string;
  tagline?: string;

  /** Included workflows */
  workflow_ids: string[];

  /** Pricing */
  price: number;
  original_price: number;
  savings_percentage: number;
  currency: string;

  /** Bundle type */
  bundle_type: 'themed' | 'system' | 'complete' | 'seasonal';

  /** Display */
  featured_image?: string;
  badge?: string;

  /** Stats */
  purchase_count: number;
  rating: number;
  review_count: number;

  /** Status */
  status: WorkflowStatus;
  is_featured: boolean;
  is_limited_time: boolean;
  expires_at?: string;

  /** SEO */
  seo_title?: string;
  seo_description?: string;

  /** Timestamps */
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Workflow analytics metrics
 */
export interface WorkflowAnalytics {
  workflow_id: string;

  /** Performance metrics */
  total_views: number;
  unique_views: number;
  total_downloads: number;
  total_purchases: number;
  total_revenue: number;

  /** Engagement metrics */
  avg_time_on_page: number;
  bounce_rate: number;
  conversion_rate: number;

  /** Time-based metrics */
  views_last_7_days: number;
  views_last_30_days: number;
  purchases_last_7_days: number;
  purchases_last_30_days: number;
  revenue_last_7_days: number;
  revenue_last_30_days: number;

  /** Quality metrics */
  avg_rating: number;
  total_reviews: number;
  completion_rate?: number;
  satisfaction_score?: number;

  /** Ranking */
  popularity_rank?: number;
  revenue_rank?: number;
  rating_rank?: number;

  /** Last updated */
  last_calculated_at: string;
}

/**
 * User engagement analytics
 */
export interface UserEngagementAnalytics {
  user_id: string;

  /** Activity metrics */
  total_workflows_viewed: number;
  total_workflows_purchased: number;
  total_workflows_downloaded: number;
  total_workflows_favorited: number;

  /** Spending metrics */
  total_spent: number;
  avg_purchase_value: number;
  lifetime_value: number;

  /** Engagement metrics */
  days_active: number;
  last_active_at: string;
  first_purchase_at?: string;
  last_purchase_at?: string;

  /** Preferences */
  favorite_categories: string[];
  favorite_systems: string[];

  /** Timestamps */
  last_calculated_at: string;
}

/**
 * Revenue analytics
 */
export interface RevenueAnalytics {
  /** Time period */
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;

  /** Revenue metrics */
  total_revenue: number;
  workflow_revenue: number;
  membership_revenue: number;
  bundle_revenue: number;

  /** Transaction metrics */
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  refunded_transactions: number;

  /** Average metrics */
  avg_transaction_value: number;
  avg_revenue_per_user: number;

  /** Growth metrics */
  revenue_growth_percentage: number;
  transaction_growth_percentage: number;

  /** Breakdown */
  revenue_by_category: Record<string, number>;
  revenue_by_tier: Record<string, number>;
  top_workflows: Array<{ workflow_id: string; revenue: number }>;

  /** Timestamps */
  calculated_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface VaultApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    request_id?: string;
    [key: string]: any;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedVaultResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  meta?: {
    timestamp: string;
    request_id?: string;
    [key: string]: any;
  };
}

/**
 * Workflow list filters
 */
export interface WorkflowFilters {
  /** Search query */
  search?: string;

  /** Category filters */
  wedge_category?: WEDGECategory | WEDGECategory[];
  business_system?: BusinessSystem | BusinessSystem[];

  /** Pricing filters */
  pricing_tier?: PricingTier | PricingTier[];
  is_free?: boolean;
  min_price?: number;
  max_price?: number;

  /** Quality filters */
  min_rating?: number;
  min_reviews?: number;

  /** Feature filters */
  tags?: string[];
  difficulty_level?: DifficultyLevel | DifficultyLevel[];
  required_tools?: string[];

  /** Status filters */
  status?: WorkflowStatus | WorkflowStatus[];
  is_featured?: boolean;
  is_trending?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;

  /** Sorting */
  sort_by?: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'name';

  /** Pagination */
  page?: number;
  limit?: number;
}

/**
 * Workflow creation/update input
 */
export interface WorkflowInput {
  title: string;
  tagline?: string;
  description: string;
  long_description?: string;
  wedge_category: WEDGECategory;
  business_system: BusinessSystem;
  subcategory?: string;
  pricing_tier: PricingTier;
  price: number;
  original_price?: number;
  is_free: boolean;
  featured_image?: string;
  thumbnail_url?: string;
  gallery_images?: string[];
  preview_video_url?: string;
  demo_url?: string;
  tags: string[];
  related_tools?: string[];
  required_tools?: string[];
  difficulty_level: DifficultyLevel;
  estimated_time?: number;
  step_count?: number;
  features: string[];
  includes: string[];
  outcomes?: string[];
  target_audience?: string[];
  prerequisites?: string[];
  status: WorkflowStatus;
  is_featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  update_frequency?: UpdateFrequency;
  metadata?: Record<string, any>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Workflow with related data
 */
export interface WorkflowWithRelations extends Workflow {
  category?: WorkflowCategory;
  reviews?: WorkflowReview[];
  related_workflows?: Workflow[];
  analytics?: WorkflowAnalytics;
  latest_update?: WorkflowUpdate;
}

/**
 * User's workflow library item
 */
export interface UserWorkflowLibrary {
  id: string;
  user_id: string;
  workflow_id: string;
  workflow?: Workflow;
  purchase_id?: string;
  is_favorited: boolean;
  access_type: 'purchased' | 'membership' | 'free';
  download_count: number;
  last_accessed_at?: string;
  added_at: string;
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
  total_workflows: number;
  total_purchases: number;
  total_revenue: number;
  avg_rating: number;
  total_reviews: number;
  total_downloads: number;
  workflows_by_category: Record<WEDGECategory, number>;
  workflows_by_system: Record<BusinessSystem, number>;
  workflows_by_tier: Record<PricingTier, number>;
}

/**
 * Download package metadata
 */
export interface DownloadPackage {
  workflow_id: string;
  files: Array<{
    type: FileType;
    url: string;
    size: number;
    name: string;
    expires_at: string;
  }>;
  readme?: string;
  license?: string;
  support_url?: string;
  documentation_url?: string;
}

// ============================================================================
// NOTE: All types are already exported via interface/type declarations above
// No need for additional export statements - TypeScript auto-exports them
// ============================================================================
