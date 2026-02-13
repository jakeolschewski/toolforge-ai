/**
 * Workflow Vault Helper Functions
 *
 * Utility functions for working with workflows, memberships, and vault data.
 *
 * @module lib/vault/helpers
 */

import {
  Workflow,
  WorkflowAnalytics,
  Membership,
  MembershipTier,
  PricingTier,
  WEDGECategory,
  BusinessSystem,
  WorkflowStatus,
  DifficultyLevel,
} from '@/types/vault';
import {
  WEDGE_CATEGORY_MAP,
  BUSINESS_SYSTEM_MAP,
  PRICING_TIER_MAP,
  MEMBERSHIP_TIER_MAP,
  formatPrice,
  calculateDiscountPercentage,
} from './constants';

// ============================================================================
// WORKFLOW HELPERS
// ============================================================================

/**
 * Check if a workflow is available for free
 */
export function isWorkflowFree(workflow: Workflow): boolean {
  return workflow.is_free || workflow.price === 0 || workflow.pricing_tier === PricingTier.FREE;
}

/**
 * Get the display price for a workflow
 */
export function getWorkflowDisplayPrice(workflow: Workflow): string {
  if (isWorkflowFree(workflow)) {
    return 'Free';
  }
  return formatPrice(workflow.price, workflow.currency);
}

/**
 * Calculate savings if original price exists
 */
export function getWorkflowSavings(workflow: Workflow): {
  amount: number;
  percentage: number;
  displayAmount: string;
} | null {
  if (!workflow.original_price || workflow.original_price <= workflow.price) {
    return null;
  }

  const amount = workflow.original_price - workflow.price;
  const percentage = calculateDiscountPercentage(workflow.original_price, workflow.price);

  return {
    amount,
    percentage,
    displayAmount: formatPrice(amount, workflow.currency),
  };
}

/**
 * Check if workflow is on sale
 */
export function isWorkflowOnSale(workflow: Workflow): boolean {
  return !!workflow.original_price && workflow.original_price > workflow.price;
}

/**
 * Get workflow category metadata
 */
export function getWorkflowCategoryInfo(workflow: Workflow) {
  return {
    wedge: WEDGE_CATEGORY_MAP[workflow.wedge_category],
    system: BUSINESS_SYSTEM_MAP[workflow.business_system],
  };
}

/**
 * Check if user has access to workflow
 */
export function hasWorkflowAccess(
  workflow: Workflow,
  userPurchases: string[],
  membership?: Membership | null
): boolean {
  // Free workflows are always accessible
  if (isWorkflowFree(workflow)) {
    return true;
  }

  // Check if user has purchased this workflow
  if (userPurchases.includes(workflow.id)) {
    return true;
  }

  // Check if user has active membership that includes this workflow
  if (membership?.status === 'active') {
    // Pro and Premium members get all workflows
    if (
      membership.tier === MembershipTier.PRO ||
      membership.tier === MembershipTier.PREMIUM ||
      membership.tier === MembershipTier.LIFETIME
    ) {
      return true;
    }

    // Basic members get access to workflows in their list
    if (
      membership.tier === MembershipTier.BASIC &&
      membership.workflows_included.includes(workflow.id)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Get estimated completion time display
 */
export function formatEstimatedTime(minutes?: number): string {
  if (!minutes) return 'Unknown';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Get difficulty level color
 */
export function getDifficultyColor(level: DifficultyLevel): string {
  switch (level) {
    case DifficultyLevel.BEGINNER:
      return '#10B981'; // green
    case DifficultyLevel.INTERMEDIATE:
      return '#3B82F6'; // blue
    case DifficultyLevel.ADVANCED:
      return '#F59E0B'; // amber
    case DifficultyLevel.EXPERT:
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
}

/**
 * Generate workflow slug from title
 */
export function generateWorkflowSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if workflow is new (published within last 30 days)
 */
export function isWorkflowNew(workflow: Workflow): boolean {
  if (!workflow.published_at) return false;

  const publishedDate = new Date(workflow.published_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return publishedDate > thirtyDaysAgo;
}

/**
 * Calculate conversion rate from analytics
 */
export function calculateConversionRate(
  views: number,
  purchases: number
): number {
  if (views === 0) return 0;
  return (purchases / views) * 100;
}

/**
 * Get workflow badge text
 */
export function getWorkflowBadge(workflow: Workflow): string | null {
  if (workflow.is_bestseller) return 'Bestseller';
  if (workflow.is_trending) return 'Trending';
  if (workflow.is_new || isWorkflowNew(workflow)) return 'New';
  if (isWorkflowFree(workflow)) return 'Free';
  if (isWorkflowOnSale(workflow)) return 'Sale';
  return null;
}

/**
 * Sort workflows by various criteria
 */
export function sortWorkflows(
  workflows: Workflow[],
  sortBy: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'name'
): Workflow[] {
  const sorted = [...workflows];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at).getTime();
        const dateB = new Date(b.published_at || b.created_at).getTime();
        return dateB - dateA;
      });

    case 'popular':
      return sorted.sort((a, b) => b.purchase_count - a.purchase_count);

    case 'rating':
      return sorted.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.review_count - a.review_count;
      });

    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
}

/**
 * Filter workflows by criteria
 */
export function filterWorkflows(
  workflows: Workflow[],
  filters: {
    search?: string;
    wedge_category?: WEDGECategory | WEDGECategory[];
    business_system?: BusinessSystem | BusinessSystem[];
    pricing_tier?: PricingTier | PricingTier[];
    is_free?: boolean;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    difficulty_level?: DifficultyLevel | DifficultyLevel[];
    tags?: string[];
    is_featured?: boolean;
  }
): Workflow[] {
  let filtered = [...workflows];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.title.toLowerCase().includes(searchLower) ||
        w.description.toLowerCase().includes(searchLower) ||
        w.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Category filter
  if (filters.wedge_category) {
    const categories = Array.isArray(filters.wedge_category)
      ? filters.wedge_category
      : [filters.wedge_category];
    filtered = filtered.filter((w) => categories.includes(w.wedge_category));
  }

  // System filter
  if (filters.business_system) {
    const systems = Array.isArray(filters.business_system)
      ? filters.business_system
      : [filters.business_system];
    filtered = filtered.filter((w) => systems.includes(w.business_system));
  }

  // Pricing tier filter
  if (filters.pricing_tier) {
    const tiers = Array.isArray(filters.pricing_tier)
      ? filters.pricing_tier
      : [filters.pricing_tier];
    filtered = filtered.filter((w) => tiers.includes(w.pricing_tier));
  }

  // Free filter
  if (filters.is_free !== undefined) {
    filtered = filtered.filter((w) => isWorkflowFree(w) === filters.is_free);
  }

  // Price range filter
  if (filters.min_price !== undefined) {
    filtered = filtered.filter((w) => w.price >= filters.min_price!);
  }
  if (filters.max_price !== undefined) {
    filtered = filtered.filter((w) => w.price <= filters.max_price!);
  }

  // Rating filter
  if (filters.min_rating !== undefined) {
    filtered = filtered.filter((w) => w.rating >= filters.min_rating!);
  }

  // Difficulty filter
  if (filters.difficulty_level) {
    const levels = Array.isArray(filters.difficulty_level)
      ? filters.difficulty_level
      : [filters.difficulty_level];
    filtered = filtered.filter((w) => levels.includes(w.difficulty_level));
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((w) =>
      filters.tags!.some((tag) => w.tags.includes(tag))
    );
  }

  // Featured filter
  if (filters.is_featured !== undefined) {
    filtered = filtered.filter((w) => w.is_featured === filters.is_featured);
  }

  return filtered;
}

// ============================================================================
// MEMBERSHIP HELPERS
// ============================================================================

/**
 * Check if membership is active
 */
export function isMembershipActive(membership: Membership): boolean {
  return membership.status === 'active' || membership.status === 'trialing';
}

/**
 * Get membership display name
 */
export function getMembershipDisplayName(membership: Membership): string {
  const tierInfo = MEMBERSHIP_TIER_MAP[membership.tier];
  return tierInfo?.name || membership.tier;
}

/**
 * Get membership price display
 */
export function getMembershipPriceDisplay(membership: Membership): string {
  const price = formatPrice(membership.price, membership.currency);
  const period = membership.billing_period === 'monthly' ? '/month' : '/year';
  return `${price}${period}`;
}

/**
 * Check if membership allows unlimited workflows
 */
export function hasUnlimitedWorkflows(membership: Membership): boolean {
  return (
    membership.tier === MembershipTier.PRO ||
    membership.tier === MembershipTier.PREMIUM ||
    membership.tier === MembershipTier.LIFETIME
  );
}

/**
 * Calculate days until membership renewal
 */
export function getDaysUntilRenewal(membership: Membership): number {
  const endDate = new Date(membership.current_period_end);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if membership is in trial period
 */
export function isInTrialPeriod(membership: Membership): boolean {
  if (!membership.is_trial || !membership.trial_end) {
    return false;
  }
  return new Date(membership.trial_end) > new Date();
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

/**
 * Calculate revenue per download
 */
export function calculateRevenuePerDownload(
  totalRevenue: number,
  totalDownloads: number
): number {
  if (totalDownloads === 0) return 0;
  return totalRevenue / totalDownloads;
}

/**
 * Calculate average order value
 */
export function calculateAverageOrderValue(
  totalRevenue: number,
  totalOrders: number
): number {
  if (totalOrders === 0) return 0;
  return totalRevenue / totalOrders;
}

/**
 * Format analytics metrics for display
 */
export function formatAnalyticsMetric(
  value: number,
  type: 'currency' | 'percentage' | 'number'
): string {
  switch (type) {
    case 'currency':
      return formatPrice(value);
    case 'percentage':
      return `${value.toFixed(2)}%`;
    case 'number':
      return value.toLocaleString();
    default:
      return value.toString();
  }
}

/**
 * Get growth trend indicator
 */
export function getGrowthTrend(current: number, previous: number): 'up' | 'down' | 'flat' {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'flat';
}

/**
 * Calculate growth percentage
 */
export function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate workflow title
 */
export function isValidWorkflowTitle(title: string): boolean {
  return title.length >= 3 && title.length <= 200;
}

/**
 * Validate workflow price
 */
export function isValidWorkflowPrice(price: number, tier: PricingTier): boolean {
  if (tier === PricingTier.FREE) return price === 0;
  if (tier === PricingTier.STARTER) return price >= 500 && price <= 2900;
  if (tier === PricingTier.PRO) return price >= 3000 && price <= 9900;
  if (tier === PricingTier.PREMIUM) return price >= 10000 && price <= 29900;
  if (tier === PricingTier.ENTERPRISE) return price >= 30000;
  return false;
}

/**
 * Validate workflow slug uniqueness
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

// ============================================================================
// SEARCH & RECOMMENDATION HELPERS
// ============================================================================

/**
 * Calculate similarity score between two workflows
 */
export function calculateWorkflowSimilarity(
  workflow1: Workflow,
  workflow2: Workflow
): number {
  let score = 0;

  // Same W.E.D.G.E. category
  if (workflow1.wedge_category === workflow2.wedge_category) score += 3;

  // Same business system
  if (workflow1.business_system === workflow2.business_system) score += 3;

  // Similar pricing tier
  if (workflow1.pricing_tier === workflow2.pricing_tier) score += 1;

  // Similar difficulty
  if (workflow1.difficulty_level === workflow2.difficulty_level) score += 1;

  // Overlapping tags
  const commonTags = workflow1.tags.filter((tag) => workflow2.tags.includes(tag));
  score += commonTags.length * 0.5;

  return score;
}

/**
 * Get recommended workflows based on current workflow
 */
export function getRecommendedWorkflows(
  currentWorkflow: Workflow,
  allWorkflows: Workflow[],
  limit: number = 5
): Workflow[] {
  return allWorkflows
    .filter((w) => w.id !== currentWorkflow.id && w.status === WorkflowStatus.PUBLISHED)
    .map((w) => ({
      workflow: w,
      score: calculateWorkflowSimilarity(currentWorkflow, w),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.workflow);
}

/**
 * Get trending workflows
 */
export function getTrendingWorkflows(
  workflows: Workflow[],
  analytics: Map<string, WorkflowAnalytics>,
  limit: number = 10
): Workflow[] {
  return workflows
    .filter((w) => w.status === WorkflowStatus.PUBLISHED)
    .map((workflow) => {
      const stats = analytics.get(workflow.id);
      const trendingScore =
        (stats?.purchases_last_7_days || 0) * 3 +
        (stats?.views_last_7_days || 0) * 0.1 +
        workflow.rating * 10;

      return { workflow, trendingScore };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
    .map((item) => item.workflow);
}

// ============================================================================
// EXPORT ALL HELPERS
// ============================================================================

export {
  isWorkflowFree,
  getWorkflowDisplayPrice,
  getWorkflowSavings,
  isWorkflowOnSale,
  getWorkflowCategoryInfo,
  hasWorkflowAccess,
  formatEstimatedTime,
  getDifficultyColor,
  generateWorkflowSlug,
  isWorkflowNew,
  calculateConversionRate,
  getWorkflowBadge,
  sortWorkflows,
  filterWorkflows,
  isMembershipActive,
  getMembershipDisplayName,
  getMembershipPriceDisplay,
  hasUnlimitedWorkflows,
  getDaysUntilRenewal,
  isInTrialPeriod,
  calculateRevenuePerDownload,
  calculateAverageOrderValue,
  formatAnalyticsMetric,
  getGrowthTrend,
  calculateGrowthPercentage,
  isValidWorkflowTitle,
  isValidWorkflowPrice,
  isValidSlug,
  calculateWorkflowSimilarity,
  getRecommendedWorkflows,
  getTrendingWorkflows,
};
