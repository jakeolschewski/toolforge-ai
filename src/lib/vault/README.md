# Workflow Vault Library

Comprehensive TypeScript types and constants for the ToolForge AI Workflow Vault system.

## Overview

The Workflow Vault is a premium marketplace for business workflows, templates, and automation systems organized using the **W.E.D.G.E. Framework**:

- **W**orkflows: Complete step-by-step processes
- **E**ngines: Automation systems and tools
- **D**ashboards: Tracking and analytics interfaces
- **G**enerators: Content and asset creation tools
- **E**nvironments: Complete working setups

## Quick Start

```typescript
import {
  Workflow,
  WorkflowFilters,
  WEDGECategory,
  BusinessSystem,
  PricingTier,
  WEDGE_CATEGORIES,
  BUSINESS_SYSTEMS,
  formatPrice,
} from '@/lib/vault';

// Use types
const workflow: Workflow = {
  id: '1',
  slug: 'sales-pipeline-workflow',
  title: 'Complete Sales Pipeline Workflow',
  description: 'End-to-end sales process automation',
  wedge_category: WEDGECategory.WORKFLOWS,
  business_system: BusinessSystem.SALES,
  pricing_tier: PricingTier.PRO,
  price: 4900, // $49.00 in cents
  // ... other fields
};

// Use constants
const categoryInfo = WEDGE_CATEGORIES.find(
  cat => cat.id === WEDGECategory.WORKFLOWS
);
console.log(categoryInfo?.description); // "Complete step-by-step processes..."

// Format prices
const formattedPrice = formatPrice(4900); // "$49.00"
```

## Type System

### Core Workflow Types

#### `Workflow`
Main workflow entity with comprehensive metadata.

```typescript
interface Workflow {
  id: string;
  slug: string;
  title: string;
  description: string;
  wedge_category: WEDGECategory;
  business_system: BusinessSystem;
  pricing_tier: PricingTier;
  price: number; // in cents
  is_free: boolean;
  features: string[];
  includes: string[];
  difficulty_level: DifficultyLevel;
  rating: number;
  review_count: number;
  purchase_count: number;
  // ... 50+ more fields
}
```

#### `WorkflowCategory`
Category groupings for workflows.

```typescript
interface WorkflowCategory {
  id: string;
  slug: string;
  name: string;
  wedge_category?: WEDGECategory;
  business_system?: BusinessSystem;
  workflow_count: number;
  // ...
}
```

### Purchase & Commerce Types

#### `WorkflowPurchase`
Purchase transaction records.

```typescript
interface WorkflowPurchase {
  id: string;
  workflow_id: string;
  user_id: string;
  amount: number; // in cents
  status: PurchaseStatus;
  stripe_payment_intent_id?: string;
  license_key?: string;
  // ...
}
```

#### `Membership`
Subscription membership records.

```typescript
interface Membership {
  id: string;
  user_id: string;
  tier: MembershipTier;
  status: MembershipStatus;
  billing_period: 'monthly' | 'annual';
  price: number; // in cents
  // ...
}
```

### Analytics Types

#### `WorkflowAnalytics`
Performance metrics for workflows.

```typescript
interface WorkflowAnalytics {
  workflow_id: string;
  total_views: number;
  total_purchases: number;
  total_revenue: number;
  conversion_rate: number;
  avg_rating: number;
  // ...
}
```

#### `RevenueAnalytics`
Revenue tracking and reporting.

```typescript
interface RevenueAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  total_revenue: number;
  workflow_revenue: number;
  membership_revenue: number;
  revenue_by_category: Record<string, number>;
  // ...
}
```

## Enums

### W.E.D.G.E. Categories

```typescript
enum WEDGECategory {
  WORKFLOWS = 'workflows',
  ENGINES = 'engines',
  DASHBOARDS = 'dashboards',
  GENERATORS = 'generators',
  ENVIRONMENTS = 'environments',
}
```

### Business Systems

```typescript
enum BusinessSystem {
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
```

### Pricing Tiers

```typescript
enum PricingTier {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}
```

### Membership Tiers

```typescript
enum MembershipTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
  LIFETIME = 'lifetime',
}
```

## Constants

### WEDGE_CATEGORIES

Array of W.E.D.G.E. category definitions with metadata.

```typescript
const WEDGE_CATEGORIES = [
  {
    id: WEDGECategory.WORKFLOWS,
    name: 'Workflows',
    description: 'Complete step-by-step processes...',
    icon: '🔄',
    color: '#3B82F6',
  },
  // ...
];
```

### BUSINESS_SYSTEMS

Array of business system definitions with metadata.

```typescript
const BUSINESS_SYSTEMS = [
  {
    id: BusinessSystem.SALES,
    name: 'Sales',
    description: 'Sales processes, pipelines...',
    icon: '💰',
    keywords: ['revenue', 'deals', 'prospects'],
  },
  // ...
];
```

### PRICING_TIERS

Pricing tier information and ranges.

```typescript
const PRICING_TIERS = [
  {
    id: PricingTier.FREE,
    name: 'Free',
    price_range: '$0',
    badge: 'Free',
  },
  // ...
];
```

### MEMBERSHIP_TIERS

Membership plan details and pricing.

```typescript
const MEMBERSHIP_TIERS = [
  {
    id: MembershipTier.PRO,
    name: 'Pro',
    monthly_price: 4900, // $49 in cents
    annual_price: 49000, // $490 in cents
    workflows_limit: 'unlimited',
    features: [...],
  },
  // ...
];
```

### FILE_TYPES

Supported file types for workflow downloads.

```typescript
const FILE_TYPES = [
  {
    id: FileType.PDF,
    name: 'PDF',
    extension: '.pdf',
    mime_type: 'application/pdf',
    icon: '📄',
  },
  // ...
];
```

## Utility Functions

### `formatPrice(cents, currency?)`

Format price from cents to display string.

```typescript
formatPrice(4900); // "$49.00"
formatPrice(4900, 'EUR'); // "€49.00"
```

### `calculateDiscountPercentage(original, current)`

Calculate discount percentage between two prices.

```typescript
calculateDiscountPercentage(9900, 4900); // 51
```

## Lookup Maps

Pre-computed lookup maps for O(1) access:

```typescript
import {
  WEDGE_CATEGORY_MAP,
  BUSINESS_SYSTEM_MAP,
  PRICING_TIER_MAP,
  MEMBERSHIP_TIER_MAP,
  FILE_TYPE_MAP,
} from '@/lib/vault/constants';

const category = WEDGE_CATEGORY_MAP[WEDGECategory.WORKFLOWS];
const system = BUSINESS_SYSTEM_MAP[BusinessSystem.SALES];
```

## Configuration Constants

### SEO_CONFIG

SEO-related limits and defaults.

```typescript
const SEO_CONFIG = {
  title_max_length: 60,
  description_max_length: 160,
  keywords_max_count: 10,
  slug_max_length: 100,
};
```

### DOWNLOAD_CONFIG

Download limits and expiry settings.

```typescript
const DOWNLOAD_CONFIG = {
  max_file_size: 100 * 1024 * 1024, // 100MB
  link_expiry_seconds: 24 * 60 * 60, // 24 hours
  max_concurrent_downloads: 3,
  rate_limit_per_hour: 50,
};
```

### PAGINATION_DEFAULTS

Default pagination settings.

```typescript
const PAGINATION_DEFAULTS = {
  default_page: 1,
  default_limit: 20,
  max_limit: 100,
};
```

## API Response Types

### `VaultApiResponse<T>`

Standard API response wrapper.

```typescript
interface VaultApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}
```

### `PaginatedVaultResponse<T>`

Paginated API response.

```typescript
interface PaginatedVaultResponse<T> {
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
}
```

## Example Usage

### Filtering Workflows

```typescript
import { WorkflowFilters, WEDGECategory, PricingTier } from '@/lib/vault';

const filters: WorkflowFilters = {
  search: 'sales pipeline',
  wedge_category: [WEDGECategory.WORKFLOWS, WEDGECategory.DASHBOARDS],
  pricing_tier: PricingTier.PRO,
  min_rating: 4.0,
  is_featured: true,
  sort_by: 'popular',
  page: 1,
  limit: 20,
};
```

### Creating a Workflow

```typescript
import { WorkflowInput, WEDGECategory, BusinessSystem } from '@/lib/vault';

const newWorkflow: WorkflowInput = {
  title: 'Sales Pipeline Automation',
  description: 'Automate your entire sales process',
  wedge_category: WEDGECategory.ENGINES,
  business_system: BusinessSystem.SALES,
  pricing_tier: PricingTier.PRO,
  price: 4900,
  is_free: false,
  difficulty_level: DifficultyLevel.INTERMEDIATE,
  features: ['CRM Integration', 'Email Automation', 'Lead Scoring'],
  includes: ['PDF Guide', 'Video Tutorial', 'Templates'],
  tags: ['sales', 'automation', 'crm'],
  status: WorkflowStatus.DRAFT,
};
```

### Processing Purchases

```typescript
import { WorkflowPurchase, PurchaseStatus } from '@/lib/vault';

const purchase: WorkflowPurchase = {
  id: 'purchase_123',
  workflow_id: 'workflow_456',
  user_id: 'user_789',
  user_email: 'customer@example.com',
  amount: 4900,
  currency: 'USD',
  status: PurchaseStatus.COMPLETED,
  stripe_payment_intent_id: 'pi_123',
  license_key: 'LICENSE-KEY-HERE',
  downloads_used: 0,
  purchased_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
```

## File Structure

```
src/
├── types/
│   ├── index.ts          # Re-exports vault types
│   └── vault.ts          # Main type definitions
└── lib/
    └── vault/
        ├── index.ts      # Main export point
        ├── constants.ts  # Constants and utilities
        └── README.md     # This file
```

## Best Practices

1. **Always use enums** instead of string literals for type safety
2. **Store prices in cents** to avoid floating-point issues
3. **Use the utility functions** for formatting and calculations
4. **Leverage lookup maps** for efficient data access
5. **Follow the W.E.D.G.E. framework** for consistent categorization
6. **Include comprehensive metadata** for SEO and discoverability

## TypeScript Strictness

All types are designed for strict TypeScript mode:

- No implicit `any`
- Required fields are enforced
- Optional fields are explicitly marked with `?`
- Enums provide type safety
- Discriminated unions for state management

## License

Copyright 2026 ToolForge AI. All rights reserved.
