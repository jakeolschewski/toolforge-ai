# Workflow Vault Database Migration

## Overview

This migration creates the complete database schema for the **AI Edge OS™ Workflow Vault™** - a comprehensive marketplace for digital workflow products organized into 9 core business systems.

## Migration Details

- **Migration ID**: `20250213_workflow_vault`
- **Date**: February 13, 2025
- **Purpose**: Full schema for workflow marketplace with membership system
- **Tables Created**: 11 core tables + 2 views
- **Framework**: W.E.D.G.E.™ (Workflow Engine for Digital Growth & Excellence)

## Tables Created

### 1. `workflow_categories` (9 Business Systems)
The foundation of AI Edge OS™ - 9 core business systems:
- Client Acquisition System
- Client Onboarding System
- Project Delivery System
- Client Communication System
- Invoicing & Payment System
- Content Marketing System
- Analytics & Reporting System
- Operations & Admin System
- Growth & Scaling System

**Key Fields**:
- `slug`, `name`, `description`
- `icon`, `color`, `order_index`
- `workflow_count`, `total_downloads`
- `is_active`, `metadata`

### 2. `workflows` (Main Product Table)
The core table for workflow products.

**Key Features**:
- W.E.D.G.E.™ Framework integration:
  - `wedge_score` (0-10 overall rating)
  - `workflow_complexity` (beginner → expert)
  - `efficiency_rating`, `digital_maturity`
  - `growth_potential`, `excellence_tier`
- Flexible pricing tiers (free, basic, pro, premium, enterprise)
- Rich media support (thumbnails, previews, videos, demos)
- JSONB fields for features, requirements, includes
- Social proof metrics (ratings, reviews, downloads, favorites)
- SEO optimization fields
- Status management (draft, published, archived, coming_soon)

### 3. `workflow_files`
Stores actual workflow files and assets.

**Features**:
- Multiple file types (Make.com, n8n, Zapier, JSON, PDF, etc.)
- Version tracking
- Primary file designation
- Access control per file
- Download tracking

### 4. `memberships`
Subscription management for premium members.

**Capabilities**:
- Multiple tiers (free, basic, pro, premium, enterprise)
- Trial period support
- Stripe integration
- Download limits and tracking
- Feature access control (JSONB)
- Automatic expiration handling

### 5. `workflow_purchases`
Individual workflow purchases (one-time payments).

**Features**:
- Multiple purchase types (one_time, bundle, membership_included)
- License key generation
- License types (personal, team, commercial, enterprise)
- Download limits per purchase
- Refund tracking
- Stripe payment integration

### 6. `workflow_downloads`
Comprehensive download tracking and analytics.

**Tracks**:
- User downloads (authenticated and anonymous)
- Download type (free, purchased, membership, trial)
- IP hash, user agent, referrer
- Country code for geo-analytics
- File metadata

### 7. `workflow_reviews`
User reviews with W.E.D.G.E.™ ratings.

**Features**:
- Overall rating + detailed W.E.D.G.E.™ breakdowns
- Verified purchase badges
- Helpful/not helpful voting
- Moderation workflow
- User and moderator tracking

### 8. `workflow_updates`
Version history and changelog tracking.

**Tracks**:
- Version numbers and history
- Changelog with JSONB structure
- File changes (added, modified, removed)
- Release notes
- Major vs. minor updates

### 9. `workflow_bundles`
Curated collections of workflows.

**Features**:
- Multiple workflows per bundle
- Dynamic pricing (original vs. bundle price)
- Automatic savings calculation
- Time-limited bundles (valid_from/valid_until)
- Bundle-specific SEO
- Purchase and rating tracking

### 10. `workflow_analytics`
Daily aggregated analytics per workflow.

**Metrics**:
- Views, unique visitors, clicks, downloads
- Purchases, revenue, refunds
- Social engagement (favorites, shares, reviews)
- Performance metrics (conversion rate, revenue per view)
- Traffic sources and country distribution (JSONB)

### 11. `workflow_favorites`
User bookmarks and favorites.

**Features**:
- Personal notes
- Custom tags
- Quick access for users
- Analytics for trending workflows

## Views Created

### `active_memberships`
Consolidated view of active memberships with user details and status calculation.

### `workflow_stats`
Comprehensive statistics per workflow including:
- Category information
- Review and rating aggregates
- Total purchases and revenue
- Favorite and download counts

## Automatic Features

### Triggers

1. **Auto-update timestamps**: All tables have automatic `updated_at` triggers
2. **Download counter**: Increments `workflows.download_count` on each download
3. **Rating calculation**: Auto-calculates average rating and review count
4. **Category counts**: Maintains accurate `workflow_count` per category

### Indexes

- **Performance**: 50+ indexes for fast queries
- **Full-text search**: GIN indexes on arrays (tags, features, keywords)
- **Uniqueness**: Unique constraints on critical combinations
- **Analytics**: Date-based indexes for time-series queries

### Row Level Security (RLS)

Complete RLS policies for:
- Public access to published content
- User-specific data (purchases, downloads, favorites, reviews)
- Membership-based access control for premium workflows
- Service role full access for admin operations

## W.E.D.G.E.™ Framework

The schema fully integrates the **Workflow Engine for Digital Growth & Excellence**:

- **W**orkflow Complexity: beginner → expert levels
- **E**fficiency Rating: Time/resource optimization scores
- **D**igital Maturity: foundational → cutting-edge classification
- **G**rowth Potential: low → exponential business impact
- **E**xcellence Tier: standard → legendary quality levels

## Security Features

1. **RLS Policies**: Row-level security on all tables
2. **Access Control**: Membership and purchase-based file access
3. **License Enforcement**: Download limits and expiration tracking
4. **Payment Verification**: Stripe integration for secure payments
5. **Moderation**: Review approval workflow

## Data Relationships

```
workflow_categories
  └── workflows (many)
      ├── workflow_files (many)
      ├── workflow_purchases (many)
      ├── workflow_downloads (many)
      ├── workflow_reviews (many)
      ├── workflow_updates (many)
      ├── workflow_favorites (many)
      └── workflow_analytics (many - daily records)

users
  ├── memberships (one active)
  ├── workflow_purchases (many)
  ├── workflow_downloads (many)
  ├── workflow_reviews (many)
  └── workflow_favorites (many)

workflow_bundles
  └── workflows (many-to-many via array)
```

## Seed Data

The migration includes seed data for the **9 Core Business Systems**:

1. 🎯 Client Acquisition System (Blue)
2. 🚀 Client Onboarding System (Green)
3. ⚡ Project Delivery System (Orange)
4. 💬 Client Communication System (Purple)
5. 💰 Invoicing & Payment System (Cyan)
6. 📢 Content Marketing System (Pink)
7. 📊 Analytics & Reporting System (Teal)
8. ⚙️ Operations & Admin System (Indigo)
9. 📈 Growth & Scaling System (Red)

## Running the Migration

### Option 1: Direct SQL
```bash
psql -d your_database -f migration.sql
```

### Option 2: Supabase CLI
```bash
supabase db push
```

### Option 3: Via API
```bash
curl -X POST https://your-project.supabase.co/rest/v1/rpc/execute_migration \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sql": "..."}'
```

## Post-Migration Steps

1. **Configure Stripe Webhooks**
   - Set up webhook endpoints for subscription events
   - Handle `customer.subscription.created/updated/deleted`
   - Process `payment_intent.succeeded/failed`

2. **Set Up File Storage**
   - Create Supabase Storage bucket: `workflow-files`
   - Configure access policies
   - Set up CDN for file delivery

3. **Create API Endpoints**
   - `/api/workflows` - List and filter workflows
   - `/api/workflows/[slug]` - Workflow details
   - `/api/workflows/[slug]/download` - Secure download endpoint
   - `/api/memberships` - Subscription management
   - `/api/purchases` - Purchase handling

4. **Build Frontend Components**
   - Workflow card component
   - Category browser
   - Membership pricing page
   - Checkout flow
   - User dashboard

5. **Seed Initial Workflows**
   - Add your first workflow products
   - Create workflow files
   - Test download access control

6. **Configure Environment Variables**
   ```env
   STRIPE_SECRET_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_SITE_URL=https://...
   ```

## Example Queries

### Get all workflows in a category
```sql
SELECT w.*, wc.name as category_name
FROM workflows w
JOIN workflow_categories wc ON wc.id = w.category_id
WHERE wc.slug = 'client-acquisition'
  AND w.status = 'published'
ORDER BY w.wedge_score DESC, w.rating DESC;
```

### Check user access to a workflow
```sql
SELECT
  CASE
    WHEN w.is_free THEN 'free'
    WHEN EXISTS (
      SELECT 1 FROM workflow_purchases wp
      WHERE wp.workflow_id = w.id
        AND wp.user_id = 'user-uuid'
        AND wp.payment_status = 'completed'
    ) THEN 'purchased'
    WHEN EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = 'user-uuid'
        AND m.status = 'active'
        AND m.expires_at > NOW()
    ) THEN 'member'
    ELSE 'no_access'
  END as access_type
FROM workflows w
WHERE w.id = 'workflow-uuid';
```

### Get user's active membership
```sql
SELECT * FROM active_memberships
WHERE user_id = 'user-uuid'
LIMIT 1;
```

### Get top workflows by revenue
```sql
SELECT * FROM workflow_stats
WHERE status = 'published'
ORDER BY total_revenue DESC
LIMIT 10;
```

## Performance Considerations

- **Indexes**: All foreign keys and common query fields are indexed
- **JSONB**: Use JSONB for flexible metadata, indexed with GIN
- **Partitioning**: Consider partitioning `workflow_analytics` by date for large datasets
- **Caching**: Cache category lists and featured workflows
- **CDN**: Use CDN for workflow files and media assets

## Monitoring

Track these metrics:
- Daily active memberships
- Conversion rate (free → paid)
- Download completion rate
- Average revenue per user (ARPU)
- Top performing workflows
- Category distribution
- Review ratings and sentiment

## Rollback

To rollback this migration:

```sql
DROP VIEW IF EXISTS workflow_stats CASCADE;
DROP VIEW IF EXISTS active_memberships CASCADE;
DROP TABLE IF EXISTS workflow_favorites CASCADE;
DROP TABLE IF EXISTS workflow_analytics CASCADE;
DROP TABLE IF EXISTS workflow_bundles CASCADE;
DROP TABLE IF EXISTS workflow_updates CASCADE;
DROP TABLE IF EXISTS workflow_reviews CASCADE;
DROP TABLE IF EXISTS workflow_downloads CASCADE;
DROP TABLE IF EXISTS workflow_purchases CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS workflow_files CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS workflow_categories CASCADE;

DROP FUNCTION IF EXISTS update_category_workflow_count() CASCADE;
DROP FUNCTION IF EXISTS update_workflow_rating() CASCADE;
DROP FUNCTION IF EXISTS increment_workflow_download_count() CASCADE;
```

## Support

For issues or questions about this migration:
- Check the PROJECT_SUMMARY.md for system architecture
- Review RLS policies if access issues occur
- Verify Stripe webhook configuration for payment issues
- Check trigger logs for automatic counter updates

## License

Part of the ToolForge AI / AI Edge OS™ platform.

---

**Migration Status**: ✅ Ready for Production

**Last Updated**: February 13, 2025
