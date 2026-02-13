/**
 * Workflow Vault Usage Examples
 *
 * Example code showing how to use the vault types, constants, and helpers.
 * This file is for documentation/reference purposes.
 *
 * @module lib/vault/examples
 */

import {
  // Types
  Workflow,
  WorkflowInput,
  WorkflowFilters,
  Membership,
  WorkflowPurchase,

  // Enums
  WEDGECategory,
  BusinessSystem,
  PricingTier,
  MembershipTier,
  DifficultyLevel,
  WorkflowStatus,
  PurchaseStatus,

  // Constants
  WEDGE_CATEGORIES,
  BUSINESS_SYSTEMS,
  PRICING_TIERS,
  MEMBERSHIP_TIERS,

  // Helpers
  isWorkflowFree,
  getWorkflowDisplayPrice,
  hasWorkflowAccess,
  formatEstimatedTime,
  getWorkflowBadge,
  sortWorkflows,
  filterWorkflows,
  isMembershipActive,
  formatPrice,
  calculateDiscountPercentage,
} from '@/lib/vault';

// ============================================================================
// EXAMPLE 1: Creating a New Workflow
// ============================================================================

export function exampleCreateWorkflow(): WorkflowInput {
  const newWorkflow: WorkflowInput = {
    title: 'Complete Sales Pipeline Automation',
    tagline: 'Automate your entire sales process from lead to close',
    description: 'A comprehensive workflow that automates your sales pipeline using modern tools and best practices.',
    long_description: `
      This workflow provides everything you need to build a world-class sales automation system.

      ## What You'll Get
      - Complete CRM setup guide
      - Email automation templates
      - Lead scoring system
      - Sales dashboard templates

      ## Requirements
      - HubSpot or Salesforce account
      - Zapier subscription
      - Basic understanding of sales processes
    `,

    // Categorization
    wedge_category: WEDGECategory.ENGINES,
    business_system: BusinessSystem.SALES,
    subcategory: 'Automation',

    // Pricing
    pricing_tier: PricingTier.PRO,
    price: 4900, // $49.00 in cents
    original_price: 7900, // $79.00 (showing discount)
    is_free: false,

    // Media
    featured_image: '/images/workflows/sales-pipeline.jpg',
    thumbnail_url: '/images/workflows/sales-pipeline-thumb.jpg',
    gallery_images: [
      '/images/workflows/sales-1.jpg',
      '/images/workflows/sales-2.jpg',
    ],
    preview_video_url: 'https://youtube.com/watch?v=example',
    demo_url: 'https://demo.example.com/sales-pipeline',

    // Metadata
    tags: ['sales', 'automation', 'crm', 'pipeline', 'lead-generation'],
    related_tools: ['hubspot', 'salesforce', 'zapier'],
    required_tools: ['HubSpot or Salesforce', 'Zapier'],

    difficulty_level: DifficultyLevel.INTERMEDIATE,
    estimated_time: 120, // 2 hours
    step_count: 15,

    features: [
      'Complete CRM integration',
      'Automated lead scoring',
      'Email sequence templates',
      'Sales dashboard setup',
      'Performance tracking',
    ],

    includes: [
      'PDF Setup Guide (50 pages)',
      'Video Tutorials (2 hours)',
      'Email Templates (20+)',
      'Dashboard Templates',
      'Notion Documentation',
      'Lifetime Updates',
    ],

    outcomes: [
      'Fully automated sales pipeline',
      '50% reduction in manual tasks',
      'Better lead qualification',
      'Improved conversion rates',
    ],

    target_audience: [
      'Sales teams',
      'Sales managers',
      'B2B companies',
      'SaaS businesses',
    ],

    prerequisites: [
      'Basic sales knowledge',
      'CRM access',
      'Zapier account',
    ],

    status: WorkflowStatus.PUBLISHED,
    is_featured: true,

    // SEO
    seo_title: 'Sales Pipeline Automation Workflow - Complete Setup Guide',
    seo_description: 'Automate your sales pipeline with this comprehensive workflow. Includes CRM setup, email automation, and lead scoring.',
    seo_keywords: ['sales automation', 'crm workflow', 'pipeline automation', 'sales process'],

    update_frequency: 'monthly' as any,
  };

  return newWorkflow;
}

// ============================================================================
// EXAMPLE 2: Filtering and Sorting Workflows
// ============================================================================

export function exampleFilterWorkflows(allWorkflows: Workflow[]): Workflow[] {
  // Define filter criteria
  const filters: WorkflowFilters = {
    // Search
    search: 'sales',

    // Categories
    wedge_category: [WEDGECategory.WORKFLOWS, WEDGECategory.ENGINES],
    business_system: BusinessSystem.SALES,

    // Pricing
    pricing_tier: PricingTier.PRO,
    is_free: false,
    min_price: 1000, // $10
    max_price: 10000, // $100

    // Quality
    min_rating: 4.0,
    min_reviews: 5,

    // Features
    tags: ['automation', 'crm'],
    difficulty_level: DifficultyLevel.INTERMEDIATE,

    // Status
    status: WorkflowStatus.PUBLISHED,
    is_featured: true,

    // Sort and pagination
    sort_by: 'popular',
    page: 1,
    limit: 20,
  };

  // Apply filters using helper
  const filtered = filterWorkflows(allWorkflows, filters);

  // Sort results
  const sorted = sortWorkflows(filtered, 'popular');

  return sorted;
}

// ============================================================================
// EXAMPLE 3: Checking User Access
// ============================================================================

export function exampleCheckAccess(
  workflow: Workflow,
  userId: string,
  userPurchases: string[],
  membership?: Membership
): boolean {
  // Check if user has access to this workflow
  const hasAccess = hasWorkflowAccess(workflow, userPurchases, membership);

  if (hasAccess) {
    console.log('User has access!');
    return true;
  }

  // Show pricing if no access
  const price = getWorkflowDisplayPrice(workflow);
  const badge = getWorkflowBadge(workflow);

  console.log(`Purchase required: ${price}`);
  if (badge) console.log(`Badge: ${badge}`);

  return false;
}

// ============================================================================
// EXAMPLE 4: Displaying Workflow Information
// ============================================================================

export function exampleDisplayWorkflow(workflow: Workflow) {
  return {
    // Basic info
    title: workflow.title,
    description: workflow.description,

    // Categorization
    category: WEDGE_CATEGORIES.find(c => c.id === workflow.wedge_category)?.name,
    system: BUSINESS_SYSTEMS.find(s => s.id === workflow.business_system)?.name,

    // Pricing display
    price: getWorkflowDisplayPrice(workflow),
    isFree: isWorkflowFree(workflow),
    badge: getWorkflowBadge(workflow),

    // Metadata
    difficulty: workflow.difficulty_level,
    estimatedTime: formatEstimatedTime(workflow.estimated_time),

    // Stats
    rating: `${workflow.rating.toFixed(1)} ⭐`,
    reviews: `${workflow.review_count} reviews`,
    downloads: `${workflow.download_count.toLocaleString()} downloads`,

    // Features
    features: workflow.features,
    includes: workflow.includes,
  };
}

// ============================================================================
// EXAMPLE 5: Processing a Purchase
// ============================================================================

export function exampleProcessPurchase(
  workflowId: string,
  userId: string,
  userEmail: string,
  workflow: Workflow,
  stripePaymentIntentId: string
): WorkflowPurchase {
  const purchase: WorkflowPurchase = {
    id: `purchase_${Date.now()}`,
    workflow_id: workflowId,
    user_id: userId,
    user_email: userEmail,

    // Payment details
    amount: workflow.price,
    currency: workflow.currency,
    status: PurchaseStatus.COMPLETED,
    payment_method: 'card',

    // Stripe integration
    stripe_payment_intent_id: stripePaymentIntentId,
    stripe_customer_id: `cus_${userId}`,

    // Transaction info
    transaction_id: `txn_${Date.now()}`,
    license_key: generateLicenseKey(),

    // Download limits
    download_limit: 10,
    downloads_used: 0,

    // Timestamps
    purchased_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return purchase;
}

function generateLicenseKey(): string {
  // Simple license key generator
  const segments = 4;
  const segmentLength = 4;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  return Array(segments)
    .fill(null)
    .map(() => {
      return Array(segmentLength)
        .fill(null)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join('');
    })
    .join('-');
}

// ============================================================================
// EXAMPLE 6: Membership Management
// ============================================================================

export function exampleMembershipInfo(membership: Membership) {
  const tierInfo = MEMBERSHIP_TIERS.find(t => t.id === membership.tier);

  return {
    // Basic info
    tier: tierInfo?.name,
    isActive: isMembershipActive(membership),

    // Pricing
    price: formatPrice(membership.price, membership.currency),
    billingPeriod: membership.billing_period,

    // Access
    hasUnlimitedAccess:
      membership.tier === MembershipTier.PRO ||
      membership.tier === MembershipTier.PREMIUM ||
      membership.tier === MembershipTier.LIFETIME,

    workflowsIncluded: membership.workflows_included.length,

    // Subscription info
    currentPeriodEnd: new Date(membership.current_period_end).toLocaleDateString(),
    cancelAtPeriodEnd: membership.cancel_at_period_end,

    // Trial info
    isInTrial: membership.is_trial,
    trialEnds: membership.trial_end
      ? new Date(membership.trial_end).toLocaleDateString()
      : null,
  };
}

// ============================================================================
// EXAMPLE 7: Calculating Discounts and Savings
// ============================================================================

export function exampleCalculateDiscount(workflow: Workflow) {
  if (!workflow.original_price || workflow.original_price <= workflow.price) {
    return null;
  }

  const savings = workflow.original_price - workflow.price;
  const percentage = calculateDiscountPercentage(workflow.original_price, workflow.price);

  return {
    original: formatPrice(workflow.original_price),
    current: formatPrice(workflow.price),
    savings: formatPrice(savings),
    percentage: `${percentage}% OFF`,

    // Display message
    message: `Save ${formatPrice(savings)} (${percentage}% off)`,
  };
}

// ============================================================================
// EXAMPLE 8: Building Filter UI
// ============================================================================

export function exampleBuildFilterOptions() {
  return {
    // W.E.D.G.E. Categories
    categories: WEDGE_CATEGORIES.map(cat => ({
      value: cat.id,
      label: cat.name,
      description: cat.description,
      icon: cat.icon,
    })),

    // Business Systems
    systems: BUSINESS_SYSTEMS.map(sys => ({
      value: sys.id,
      label: sys.name,
      description: sys.description,
      icon: sys.icon,
    })),

    // Pricing Tiers
    pricingTiers: PRICING_TIERS.map(tier => ({
      value: tier.id,
      label: tier.name,
      priceRange: tier.price_range,
      badge: tier.badge,
    })),

    // Difficulty Levels
    difficultyLevels: [
      { value: DifficultyLevel.BEGINNER, label: 'Beginner', icon: '🌱' },
      { value: DifficultyLevel.INTERMEDIATE, label: 'Intermediate', icon: '🌿' },
      { value: DifficultyLevel.ADVANCED, label: 'Advanced', icon: '🌳' },
      { value: DifficultyLevel.EXPERT, label: 'Expert', icon: '🏔️' },
    ],

    // Sort Options
    sortOptions: [
      { value: 'newest', label: 'Newest First' },
      { value: 'popular', label: 'Most Popular' },
      { value: 'rating', label: 'Highest Rated' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'name', label: 'Name (A-Z)' },
    ],
  };
}

// ============================================================================
// EXAMPLE 9: Generating Workflow Stats
// ============================================================================

export function exampleGenerateStats(workflows: Workflow[]) {
  return {
    total: workflows.length,

    byCategory: WEDGE_CATEGORIES.map(cat => ({
      category: cat.name,
      count: workflows.filter(w => w.wedge_category === cat.id).length,
    })),

    bySystem: BUSINESS_SYSTEMS.map(sys => ({
      system: sys.name,
      count: workflows.filter(w => w.business_system === sys.id).length,
    })),

    byPricing: {
      free: workflows.filter(w => isWorkflowFree(w)).length,
      paid: workflows.filter(w => !isWorkflowFree(w)).length,
    },

    averageRating: (
      workflows.reduce((sum, w) => sum + w.rating, 0) / workflows.length
    ).toFixed(2),

    totalDownloads: workflows.reduce((sum, w) => sum + w.download_count, 0),
    totalRevenue: workflows.reduce((sum, w) => sum + (w.price * w.purchase_count), 0),
  };
}

// ============================================================================
// EXAMPLE 10: API Response Formatting
// ============================================================================

export function exampleApiResponse<T>(data: T, success: boolean = true) {
  return {
    success,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}`,
    },
  };
}

export function examplePaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      has_next: page * limit < total,
      has_prev: page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}`,
    },
  };
}
