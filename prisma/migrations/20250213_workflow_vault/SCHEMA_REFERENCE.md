# Workflow Vault Schema Quick Reference

## Table Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `workflow_categories` | 9 business systems | Parent of workflows |
| `workflows` | Main product table | Has files, reviews, downloads |
| `workflow_files` | Actual workflow files | Belongs to workflow |
| `memberships` | User subscriptions | Belongs to user |
| `workflow_purchases` | One-time purchases | User + Workflow |
| `workflow_downloads` | Download tracking | User + Workflow + File |
| `workflow_reviews` | User reviews | User + Workflow |
| `workflow_updates` | Version history | Belongs to workflow |
| `workflow_bundles` | Workflow packages | References workflows array |
| `workflow_analytics` | Daily metrics | Per workflow, per day |
| `workflow_favorites` | User bookmarks | User + Workflow |

## Essential Fields Reference

### workflows
```sql
-- Identity
id UUID, slug TEXT, name TEXT, category_id UUID

-- W.E.D.G.E.™ Framework
wedge_score DECIMAL(3,2)           -- 0-10 overall score
workflow_complexity TEXT            -- beginner|intermediate|advanced|expert
efficiency_rating DECIMAL(3,2)      -- 0-10 efficiency score
digital_maturity TEXT               -- foundational|growing|mature|cutting-edge
growth_potential TEXT               -- low|moderate|high|exponential
excellence_tier TEXT                -- standard|premium|elite|legendary

-- Pricing
pricing_tier TEXT                   -- free|basic|pro|premium|enterprise
base_price DECIMAL(10,2)
member_price DECIMAL(10,2)
is_member_exclusive BOOLEAN
is_free BOOLEAN

-- Metrics
rating DECIMAL(3,2)                 -- Average rating
review_count INTEGER
download_count INTEGER
views INTEGER
conversion_rate DECIMAL(5,2)

-- Status
status TEXT                         -- draft|published|archived|coming_soon
is_featured BOOLEAN
is_trending BOOLEAN
is_new BOOLEAN
```

### memberships
```sql
-- Identity
id UUID, user_id UUID

-- Membership Type
tier TEXT                           -- free|basic|pro|premium|enterprise
status TEXT                         -- active|canceled|expired|trial|past_due

-- Billing
stripe_subscription_id TEXT
stripe_customer_id TEXT
price_monthly DECIMAL(10,2)
billing_cycle TEXT                  -- monthly|yearly|lifetime

-- Access
max_downloads INTEGER               -- NULL = unlimited
downloads_used INTEGER
features_access JSONB

-- Dates
current_period_start TIMESTAMPTZ
current_period_end TIMESTAMPTZ
expires_at TIMESTAMPTZ
```

### workflow_purchases
```sql
-- Identity
id UUID, user_id UUID, workflow_id UUID

-- Purchase
purchase_type TEXT                  -- one_time|bundle|membership_included
price_paid DECIMAL(10,2)
payment_status TEXT                 -- pending|completed|failed|refunded

-- License
license_key TEXT
license_type TEXT                   -- personal|team|commercial|enterprise
download_limit INTEGER
downloads_used INTEGER
expires_at TIMESTAMPTZ
```

### workflow_reviews
```sql
-- Identity
id UUID, user_id UUID, workflow_id UUID

-- Ratings
rating DECIMAL(3,2)                 -- Overall 0-5 stars

-- W.E.D.G.E.™ Detailed Ratings (all 0-5)
workflow_rating DECIMAL(3,2)        -- Structure quality
efficiency_rating DECIMAL(3,2)      -- Time/resource efficiency
ease_of_use_rating DECIMAL(3,2)    -- User-friendliness
value_rating DECIMAL(3,2)           -- Value for money/time

-- Verification
is_verified_purchase BOOLEAN
is_verified_user BOOLEAN

-- Moderation
status TEXT                         -- pending|approved|rejected|spam
```

## Common Queries

### Get Published Workflows by Category
```sql
SELECT w.*, wc.name as category_name, wc.icon
FROM workflows w
JOIN workflow_categories wc ON wc.id = w.category_id
WHERE wc.slug = $1
  AND w.status = 'published'
ORDER BY w.wedge_score DESC, w.rating DESC
LIMIT 20;
```

### Check User Access Rights
```sql
SELECT
  w.id,
  w.name,
  w.is_free,
  EXISTS(
    SELECT 1 FROM workflow_purchases wp
    WHERE wp.workflow_id = w.id
      AND wp.user_id = $1
      AND wp.payment_status = 'completed'
      AND (wp.expires_at IS NULL OR wp.expires_at > NOW())
  ) as has_purchased,
  EXISTS(
    SELECT 1 FROM memberships m
    WHERE m.user_id = $1
      AND m.status = 'active'
      AND (m.expires_at IS NULL OR m.expires_at > NOW())
  ) as has_membership,
  CASE
    WHEN w.is_free THEN true
    WHEN EXISTS(SELECT 1 FROM workflow_purchases WHERE ...) THEN true
    WHEN EXISTS(SELECT 1 FROM memberships WHERE ...) THEN true
    ELSE false
  END as can_download
FROM workflows w
WHERE w.id = $2;
```

### Get User Dashboard Stats
```sql
SELECT
  (SELECT COUNT(*) FROM workflow_downloads WHERE user_id = $1) as total_downloads,
  (SELECT COUNT(*) FROM workflow_favorites WHERE user_id = $1) as total_favorites,
  (SELECT COUNT(*) FROM workflow_purchases WHERE user_id = $1 AND payment_status = 'completed') as total_purchases,
  (SELECT tier FROM memberships WHERE user_id = $1 AND status = 'active' LIMIT 1) as membership_tier,
  (SELECT SUM(price_paid) FROM workflow_purchases WHERE user_id = $1 AND payment_status = 'completed') as total_spent;
```

### Get Trending Workflows
```sql
SELECT w.*, COUNT(DISTINCT wd.id) as recent_downloads
FROM workflows w
LEFT JOIN workflow_downloads wd ON wd.workflow_id = w.id
  AND wd.downloaded_at > NOW() - INTERVAL '7 days'
WHERE w.status = 'published'
GROUP BY w.id
ORDER BY recent_downloads DESC, w.rating DESC
LIMIT 10;
```

### Get Category Dashboard
```sql
SELECT
  wc.*,
  COUNT(w.id) as workflow_count,
  AVG(w.rating) as avg_rating,
  SUM(w.download_count) as total_downloads,
  COUNT(DISTINCT wr.id) as total_reviews
FROM workflow_categories wc
LEFT JOIN workflows w ON w.category_id = wc.id AND w.status = 'published'
LEFT JOIN workflow_reviews wr ON wr.workflow_id = w.id AND wr.status = 'approved'
WHERE wc.is_active = true
GROUP BY wc.id
ORDER BY wc.order_index;
```

### Record Workflow Download
```sql
-- First, check access rights
-- Then insert download record
INSERT INTO workflow_downloads (
  user_id,
  workflow_id,
  file_id,
  download_type,
  purchase_id,
  membership_id,
  ip_hash,
  user_agent,
  referrer,
  file_name,
  file_size_bytes
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
);

-- Download count automatically increments via trigger
```

### Get User Purchase History
```sql
SELECT
  wp.*,
  w.name as workflow_name,
  w.slug as workflow_slug,
  w.thumbnail_url,
  wp.download_limit - wp.downloads_used as downloads_remaining
FROM workflow_purchases wp
JOIN workflows w ON w.id = wp.workflow_id
WHERE wp.user_id = $1
  AND wp.payment_status = 'completed'
ORDER BY wp.purchased_at DESC;
```

### Get Workflow Details with Files
```sql
SELECT
  w.*,
  wc.name as category_name,
  wc.icon as category_icon,
  json_agg(
    json_build_object(
      'id', wf.id,
      'file_name', wf.file_name,
      'file_type', wf.file_type,
      'file_size_bytes', wf.file_size_bytes,
      'is_primary', wf.is_primary,
      'requires_membership', wf.requires_membership
    ) ORDER BY wf.is_primary DESC, wf.order_index
  ) as files
FROM workflows w
JOIN workflow_categories wc ON wc.id = w.category_id
LEFT JOIN workflow_files wf ON wf.workflow_id = w.id
WHERE w.slug = $1
  AND w.status = 'published'
GROUP BY w.id, wc.name, wc.icon;
```

### Get Featured Bundles
```sql
SELECT
  wb.*,
  array_length(wb.workflow_ids, 1) as workflow_count,
  wb.original_price - wb.bundle_price as savings
FROM workflow_bundles wb
WHERE wb.status = 'published'
  AND wb.is_featured = true
  AND (wb.valid_until IS NULL OR wb.valid_until > NOW())
ORDER BY wb.savings_percentage DESC
LIMIT 5;
```

## RLS Policy Patterns

### User-Specific Data Access
```sql
-- Pattern for user-owned records
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
```

### Public Published Content
```sql
-- Pattern for public content
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (status = 'published');
```

### Conditional Access (Purchase or Membership)
```sql
-- Pattern for conditional access
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (
    condition_1 OR condition_2 OR condition_3
  );
```

## Trigger Behavior

### Automatic Updates
- `updated_at` → Auto-updates on every UPDATE
- `workflows.download_count` → Increments on workflow_downloads INSERT
- `workflows.rating` → Recalculates on workflow_reviews INSERT/UPDATE/DELETE
- `workflow_categories.workflow_count` → Updates on workflows INSERT/UPDATE/DELETE

## Index Strategy

### Performance Indexes
- All foreign keys indexed
- Common query fields (status, tier, date ranges)
- Sorting fields (rating, download_count, created_at)

### Search Indexes
- GIN indexes on arrays (tags, features, keywords)
- GIN indexes on JSONB (metadata, features_access)

### Unique Constraints
- User can only review workflow once
- User can only favorite workflow once
- User can only have one active membership
- One analytics record per workflow per day

## Data Types Reference

### DECIMAL Precision
- Ratings: `DECIMAL(3,2)` → 0.00 to 9.99 (or 0-5 stars)
- Prices: `DECIMAL(10,2)` → Up to $99,999,999.99
- Percentages: `DECIMAL(5,2)` → 0.00% to 999.99%

### TEXT vs JSONB
- **TEXT**: Fixed enums (status, tier, type)
- **JSONB**: Flexible data (features, metadata, traffic_sources)
- **TEXT[]**: Simple lists (tags, keywords)

### TIMESTAMPTZ
- Always use TIMESTAMPTZ for timezone awareness
- Stored in UTC, displayed in user timezone
- Supports date math (NOW() - INTERVAL '7 days')

## Best Practices

1. **Always use parameterized queries** to prevent SQL injection
2. **Check RLS policies** match your security requirements
3. **Use transactions** for multi-table operations
4. **Index foreign keys** for JOIN performance
5. **Cache category lists** (rarely change)
6. **Validate membership** before file downloads
7. **Log all purchases** for audit trail
8. **Aggregate analytics** daily, not real-time
9. **Archive old data** from workflow_downloads periodically
10. **Monitor slow queries** and add indexes as needed

## Migration Checklist

- [ ] Run migration.sql
- [ ] Verify all tables created
- [ ] Check seed data (9 categories)
- [ ] Test RLS policies
- [ ] Verify triggers work
- [ ] Test foreign key constraints
- [ ] Validate indexes created
- [ ] Check views function correctly
- [ ] Test sample queries
- [ ] Set up Stripe webhooks
- [ ] Configure file storage
- [ ] Create API endpoints
- [ ] Build frontend components
- [ ] Seed initial workflows
- [ ] Test end-to-end flow

---

**Quick Reference Version**: 1.0
**Schema Version**: 20250213_workflow_vault
