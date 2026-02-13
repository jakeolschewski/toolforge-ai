# Workflow Vault Deployment Guide

## Pre-Deployment Checklist

Before deploying the Workflow Vault schema, ensure you have:

- [ ] Database backup completed
- [ ] Supabase project or PostgreSQL instance ready
- [ ] Service role key / admin credentials available
- [ ] Reviewed migration.sql for compatibility
- [ ] Tested on development/staging environment
- [ ] Stripe account set up (for payments)
- [ ] File storage configured

## Deployment Steps

### Step 1: Backup Current Database

```bash
# PostgreSQL
pg_dump -U postgres -d your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# Supabase (via CLI)
supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Review Migration File

```bash
# Check the migration file
cat migration.sql | less

# Count SQL statements
grep -c "CREATE TABLE" migration.sql
# Should output: 11

grep -c "CREATE INDEX" migration.sql
# Should output: 50+

grep -c "CREATE POLICY" migration.sql
# Should output: 20+
```

### Step 3: Run Migration

#### Option A: Direct PostgreSQL

```bash
# Run migration
psql -U postgres -d your_database -f migration.sql

# Check for errors
echo $?
# 0 = success, non-zero = error
```

#### Option B: Supabase SQL Editor

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy contents of `migration.sql`
5. Click "Run"
6. Wait for completion (may take 30-60 seconds)

#### Option C: Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Step 4: Validate Migration

```bash
# Run validation script
psql -U postgres -d your_database -f validate.sql

# Or via Supabase
supabase db execute -f validate.sql
```

**Expected Output:**
- ✅ All 11 tables created successfully
- ✅ All 9 business systems seeded
- ✅ 50+ indexes created
- ✅ 20+ triggers active
- ✅ 4+ functions created
- ✅ 2 views created
- ✅ 20+ RLS policies active

### Step 5: Verify Seed Data

```sql
-- Check categories were seeded
SELECT count(*) FROM workflow_categories;
-- Expected: 9

-- List all categories
SELECT order_index, icon, name FROM workflow_categories ORDER BY order_index;
```

Expected categories:
1. 🎯 Client Acquisition System
2. 🚀 Client Onboarding System
3. ⚡ Project Delivery System
4. 💬 Client Communication System
5. 💰 Invoicing & Payment System
6. 📢 Content Marketing System
7. 📊 Analytics & Reporting System
8. ⚙️ Operations & Admin System
9. 📈 Growth & Scaling System

### Step 6: Test Core Functionality

```sql
-- Test 1: Create a test workflow
INSERT INTO workflows (
  slug,
  category_id,
  name,
  description,
  pricing_tier,
  base_price,
  is_free,
  status
)
SELECT
  'test-workflow-deployment',
  id,
  'Test Deployment Workflow',
  'Testing workflow creation',
  'free',
  0.00,
  true,
  'published'
FROM workflow_categories
LIMIT 1
RETURNING id, slug, name;

-- Test 2: Verify category count incremented
SELECT workflow_count FROM workflow_categories LIMIT 1;
-- Should be 1 (or more if you have existing workflows)

-- Test 3: Create test user (if not exists)
INSERT INTO users (email, name, role)
VALUES ('deploy-test@example.com', 'Deploy Test User', 'user')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Test 4: Record a download
INSERT INTO workflow_downloads (
  user_id,
  workflow_id,
  download_type
)
SELECT
  u.id,
  w.id,
  'free'
FROM users u, workflows w
WHERE u.email = 'deploy-test@example.com'
  AND w.slug = 'test-workflow-deployment'
LIMIT 1;

-- Test 5: Verify download count incremented
SELECT download_count
FROM workflows
WHERE slug = 'test-workflow-deployment';
-- Should be 1

-- Cleanup test data
DELETE FROM workflows WHERE slug = 'test-workflow-deployment';
DELETE FROM users WHERE email = 'deploy-test@example.com';
```

### Step 7: Configure File Storage

#### Supabase Storage

```bash
# Create storage bucket via Supabase Dashboard or CLI
supabase storage create workflow-files
```

**Bucket Configuration:**
- Name: `workflow-files`
- Public: No (use signed URLs)
- File size limit: 50 MB (adjust as needed)
- Allowed MIME types: application/json, application/pdf, text/*, etc.

**Storage Policies:**

```sql
-- Allow authenticated users to read files they have access to
CREATE POLICY "Users can download purchased workflows"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'workflow-files'
  AND (
    -- Free workflows
    EXISTS (
      SELECT 1 FROM workflows w
      WHERE w.id::text = (storage.foldername(name))[1]
        AND w.is_free = true
    )
    OR
    -- Purchased workflows
    EXISTS (
      SELECT 1 FROM workflow_purchases wp
      WHERE wp.workflow_id::text = (storage.foldername(name))[1]
        AND wp.user_id = auth.uid()
        AND wp.payment_status = 'completed'
    )
    OR
    -- Member access
    EXISTS (
      SELECT 1 FROM memberships m
      WHERE m.user_id = auth.uid()
        AND m.status = 'active'
    )
  )
);

-- Allow service role to upload/manage files
CREATE POLICY "Service role can manage all files"
ON storage.objects FOR ALL
USING (bucket_id = 'workflow-files');
```

### Step 8: Set Up Stripe Integration

```bash
# Install Stripe CLI (for webhook testing)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local (development)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Required Environment Variables:**

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product/Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PREMIUM=price_...
```

**Webhook Events to Handle:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `checkout.session.completed`

### Step 9: Create API Endpoints

Create these API routes in your Next.js app:

```
/api/workflows
  GET  - List workflows (with filters)
  POST - Create workflow (admin)

/api/workflows/[slug]
  GET    - Get workflow details
  PUT    - Update workflow (admin)
  DELETE - Delete workflow (admin)

/api/workflows/[slug]/download
  POST - Download workflow file (requires auth/access)

/api/memberships
  GET  - Get user's membership
  POST - Create/upgrade membership (Stripe)

/api/purchases
  GET  - List user's purchases
  POST - Purchase workflow (Stripe)

/api/reviews
  GET  - List reviews for workflow
  POST - Submit review

/api/analytics/track
  POST - Track workflow view/click

/api/webhooks/stripe
  POST - Handle Stripe webhooks
```

### Step 10: Update Prisma Schema (Optional)

If you're using Prisma ORM, update your `schema.prisma`:

```prisma
// Add to prisma/schema.prisma

model WorkflowCategory {
  id              String     @id @default(uuid())
  slug            String     @unique
  name            String
  description     String?
  icon            String?
  color           String?
  orderIndex      Int        @default(0) @map("order_index")
  workflowCount   Int        @default(0) @map("workflow_count")
  totalDownloads  Int        @default(0) @map("total_downloads")
  isActive        Boolean    @default(true) @map("is_active")
  metadata        Json       @default("{}")
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")

  workflows       Workflow[]

  @@map("workflow_categories")
}

model Workflow {
  id                  String    @id @default(uuid())
  slug                String    @unique
  categoryId          String    @map("category_id")
  name                String
  tagline             String?
  description         String
  longDescription     String?   @map("long_description")

  // W.E.D.G.E.™ Framework
  wedgeScore          Decimal?  @default(0) @map("wedge_score") @db.Decimal(3, 2)
  workflowComplexity  String    @default("beginner") @map("workflow_complexity")
  efficiencyRating    Decimal?  @default(0) @map("efficiency_rating") @db.Decimal(3, 2)
  digitalMaturity     String    @default("foundational") @map("digital_maturity")
  growthPotential     String    @default("moderate") @map("growth_potential")
  excellenceTier      String    @default("standard") @map("excellence_tier")

  // Pricing
  pricingTier         String    @default("free") @map("pricing_tier")
  basePrice           Decimal   @default(0) @map("base_price") @db.Decimal(10, 2)
  memberPrice         Decimal?  @map("member_price") @db.Decimal(10, 2)
  isMemberExclusive   Boolean   @default(false) @map("is_member_exclusive")
  isFree              Boolean   @default(true) @map("is_free")

  // Media
  thumbnailUrl        String?   @map("thumbnail_url")
  previewImageUrl     String?   @map("preview_image_url")
  videoUrl            String?   @map("video_url")
  demoUrl             String?   @map("demo_url")

  // Content
  features            Json      @default("[]")
  requirements        Json      @default("[]")
  includes            Json      @default("[]")
  tags                String[]  @default([])

  // Metrics
  version             String    @default("1.0.0")
  fileSizeMb          Decimal?  @map("file_size_mb") @db.Decimal(10, 2)
  estimatedTimeMinutes Int?     @map("estimated_time_minutes")
  roiMultiplier       Decimal?  @map("roi_multiplier") @db.Decimal(5, 2)

  // Social Proof
  rating              Decimal   @default(0) @db.Decimal(3, 2)
  reviewCount         Int       @default(0) @map("review_count")
  downloadCount       Int       @default(0) @map("download_count")
  favoriteCount       Int       @default(0) @map("favorite_count")

  // SEO
  seoTitle            String?   @map("seo_title")
  seoDescription      String?   @map("seo_description")
  keywords            String[]  @default([])

  // Status
  status              String    @default("draft")
  isFeatured          Boolean   @default(false) @map("is_featured")
  isTrending          Boolean   @default(false) @map("is_trending")
  isNew               Boolean   @default(true) @map("is_new")

  // Tracking
  views               Int       @default(0)
  clicks              Int       @default(0)
  conversionRate      Decimal?  @default(0) @map("conversion_rate") @db.Decimal(5, 2)

  // Timestamps
  publishedAt         DateTime? @map("published_at")
  featuredAt          DateTime? @map("featured_at")
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")

  // Relations
  category            WorkflowCategory @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  files               WorkflowFile[]
  purchases           WorkflowPurchase[]
  downloads           WorkflowDownload[]
  reviews             WorkflowReview[]
  updates             WorkflowUpdate[]
  analytics           WorkflowAnalytic[]
  favorites           WorkflowFavorite[]

  @@index([categoryId])
  @@index([slug])
  @@index([status])
  @@index([pricingTier])
  @@index([isFeatured])
  @@index([rating])
  @@map("workflows")
}

// ... Add remaining models
```

Then run:

```bash
npx prisma generate
```

### Step 11: Deploy to Production

#### Vercel Deployment

```bash
# Set environment variables in Vercel Dashboard
# or via CLI:
vercel env add STRIPE_SECRET_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... etc

# Deploy
vercel --prod
```

#### Environment Variable Checklist

```env
# Database
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Workflow Vault

# Optional
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

### Step 12: Post-Deployment Testing

```bash
# Test workflows API
curl https://your-domain.com/api/workflows

# Test specific workflow
curl https://your-domain.com/api/workflows/client-acquisition-starter

# Test categories
curl https://your-domain.com/api/categories
```

**Manual Testing:**
1. Visit homepage
2. Browse workflows by category
3. View workflow details page
4. Attempt download (should require auth for paid workflows)
5. Sign up for membership
6. Purchase individual workflow
7. Download purchased workflow
8. Submit review
9. Check analytics dashboard (admin)

### Step 13: Monitor & Optimize

**Set up monitoring for:**
- Database query performance
- API response times
- Stripe webhook delivery
- File download success rate
- Membership conversion rate

**Tools:**
- Vercel Analytics
- Sentry (error tracking)
- PostHog (product analytics)
- Stripe Dashboard (payment metrics)

## Rollback Procedure

If issues occur after deployment:

```bash
# 1. Restore from backup
psql -U postgres -d your_database < backup_YYYYMMDD_HHMMSS.sql

# 2. Or run rollback script
psql -U postgres -d your_database -f rollback.sql
```

**rollback.sql:**
```sql
-- Drop all workflow vault tables
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

-- Drop functions
DROP FUNCTION IF EXISTS update_category_workflow_count() CASCADE;
DROP FUNCTION IF EXISTS update_workflow_rating() CASCADE;
DROP FUNCTION IF EXISTS increment_workflow_download_count() CASCADE;
```

## Support & Troubleshooting

### Common Issues

**Issue: "relation already exists"**
- Some tables may already exist
- Check if partial migration ran
- Use `DROP TABLE IF EXISTS` before re-running

**Issue: "auth.uid() does not exist"**
- RLS policies require Supabase auth
- Use service role key for admin operations
- Ensure auth is properly configured

**Issue: "Triggers not firing"**
- Check trigger creation order
- Verify function exists before trigger
- Test with manual SQL

**Issue: "Download count not incrementing"**
- Check trigger on workflow_downloads
- Verify workflow_id matches
- Look for error logs

### Getting Help

- Review `README.md` in migration folder
- Check `SCHEMA_REFERENCE.md` for query examples
- Run `validate.sql` to diagnose issues
- Check Supabase logs for errors

## Success Criteria

Deployment is successful when:

- [ ] All 11 tables exist
- [ ] All 9 categories seeded
- [ ] 50+ indexes created
- [ ] 20+ triggers active
- [ ] RLS policies enabled
- [ ] Validation script passes
- [ ] Test workflow created successfully
- [ ] Download counter increments
- [ ] Category counter increments
- [ ] Views return data
- [ ] API endpoints respond
- [ ] File storage configured
- [ ] Stripe webhooks connected
- [ ] Frontend displays workflows
- [ ] Download flow works end-to-end

---

**Deployment Version**: 1.0
**Last Updated**: February 13, 2025
**Migration**: 20250213_workflow_vault
