# Workflow Vault - Quick Start Guide

## ⚡ Get Up and Running in 5 Minutes

This is the **fastest path** to deploying the Workflow Vault schema.

---

## Step 1: Backup (30 seconds)

```bash
# PostgreSQL
pg_dump -U postgres -d your_database > backup.sql

# Or Supabase
supabase db dump -f backup.sql
```

---

## Step 2: Run Migration (60 seconds)

### Option A: PostgreSQL Direct
```bash
psql -U postgres -d your_database -f migration.sql
```

### Option B: Supabase Dashboard
1. Open Supabase SQL Editor
2. Copy/paste contents of `migration.sql`
3. Click "Run"

### Option C: Supabase CLI
```bash
supabase db push
```

---

## Step 3: Validate (30 seconds)

```bash
psql -U postgres -d your_database -f validate.sql
```

**Look for:**
- ✅ All 11 tables created successfully
- ✅ All 9 business systems seeded

---

## Step 4: Test It Works (60 seconds)

```sql
-- Check categories
SELECT order_index, icon, name FROM workflow_categories ORDER BY order_index;

-- Create test workflow
INSERT INTO workflows (slug, category_id, name, description, pricing_tier, status)
SELECT 'test-quickstart', id, 'Test Workflow', 'Quick test', 'free', 'published'
FROM workflow_categories LIMIT 1
RETURNING id, slug, name;

-- Verify it worked
SELECT id, slug, name, status, download_count FROM workflows WHERE slug = 'test-quickstart';
```

Expected output:
```
id                                   | slug           | name          | status    | download_count
-------------------------------------|----------------|---------------|-----------|---------------
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | test-quickstart| Test Workflow | published | 0
```

---

## Step 5: Verify Triggers Work (60 seconds)

```sql
-- Create test user
INSERT INTO users (email, name, role)
VALUES ('test@quickstart.test', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Record a download
INSERT INTO workflow_downloads (user_id, workflow_id, download_type)
SELECT
  u.id,
  w.id,
  'free'
FROM users u, workflows w
WHERE u.email = 'test@quickstart.test'
  AND w.slug = 'test-quickstart'
LIMIT 1;

-- Check download count incremented (should be 1)
SELECT download_count FROM workflows WHERE slug = 'test-quickstart';
```

**Expected**: `download_count` should be `1`

---

## Step 6: Cleanup Test Data (30 seconds)

```sql
DELETE FROM workflows WHERE slug = 'test-quickstart';
DELETE FROM users WHERE email = 'test@quickstart.test';
```

---

## ✅ You're Done!

If all steps completed successfully:

1. ✅ Schema is deployed
2. ✅ 9 business systems are seeded
3. ✅ Triggers are working
4. ✅ Ready for production use

---

## 🎯 What You Just Created

### 11 Database Tables
1. `workflow_categories` - 9 business systems
2. `workflows` - Main products
3. `workflow_files` - File storage
4. `memberships` - Subscriptions
5. `workflow_purchases` - Purchases
6. `workflow_downloads` - Downloads
7. `workflow_reviews` - Reviews
8. `workflow_updates` - Versions
9. `workflow_bundles` - Bundles
10. `workflow_analytics` - Analytics
11. `workflow_favorites` - Favorites

### 9 Business Systems (Pre-Seeded)
1. 🎯 Client Acquisition
2. 🚀 Client Onboarding
3. ⚡ Project Delivery
4. 💬 Client Communication
5. 💰 Invoicing & Payments
6. 📢 Content Marketing
7. 📊 Analytics & Reporting
8. ⚙️ Operations & Admin
9. 📈 Growth & Scaling

### Automatic Features
- ✅ 50+ performance indexes
- ✅ 20+ Row Level Security policies
- ✅ 20+ auto-update triggers
- ✅ 4 custom functions
- ✅ 2 helper views

---

## 📋 Next Steps

### Immediate (Today)
1. **Set up file storage**
   ```bash
   # Create Supabase storage bucket
   supabase storage create workflow-files
   ```

2. **Add environment variables**
   ```env
   DATABASE_URL=postgresql://...
   STRIPE_SECRET_KEY=sk_...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

### This Week
1. **Create API endpoints**
   - `/api/workflows` (list)
   - `/api/workflows/[slug]` (details)
   - `/api/workflows/[slug]/download` (download)

2. **Build frontend pages**
   - Workflow listing page
   - Workflow detail page
   - Category browser
   - User dashboard

### This Month
1. **Add your first workflows**
2. **Set up Stripe billing**
3. **Create membership tiers**
4. **Launch beta**

---

## 🆘 Something Went Wrong?

### Migration Failed
```bash
# Restore from backup
psql -U postgres -d your_database < backup.sql

# Check error message
# Fix issue
# Try again
```

### Validation Failed
- Check `validate.sql` output for specific errors
- See `DEPLOYMENT.md` "Troubleshooting" section
- Review `README.md` for common issues

### Need More Details?
- **Full documentation**: See `INDEX.md`
- **Schema reference**: See `SCHEMA_REFERENCE.md`
- **Deployment guide**: See `DEPLOYMENT.md`

---

## 🎉 Success Checklist

- [ ] Migration ran without errors
- [ ] Validation shows 11 tables
- [ ] 9 categories seeded correctly
- [ ] Test workflow created
- [ ] Download counter incremented
- [ ] Category counter updated
- [ ] Test data cleaned up

**All checked?** You're ready to build your Workflow Vault!

---

## 💡 Pro Tips

1. **Keep validate.sql handy** - Run it anytime to check schema health
2. **Use the views** - `workflow_stats` and `active_memberships` save you complex joins
3. **Let triggers work** - Download counts and ratings update automatically
4. **Trust RLS** - Row Level Security handles access control
5. **Cache categories** - They rarely change, perfect for caching

---

## 🚀 One Command Deploy (Advanced)

For experienced users:

```bash
# Backup + Migrate + Validate in one command
pg_dump -U postgres -d your_db > backup_$(date +%Y%m%d).sql && \
psql -U postgres -d your_db -f migration.sql && \
psql -U postgres -d your_db -f validate.sql
```

---

## 📚 Learn More

| Document | Purpose | Time |
|----------|---------|------|
| `QUICKSTART.md` | This guide | 5 min |
| `INDEX.md` | Navigation | 2 min |
| `README.md` | Overview | 15 min |
| `SCHEMA_REFERENCE.md` | Developer ref | 10 min |
| `DEPLOYMENT.md` | Production | 30 min |
| `migration.sql` | The schema | - |
| `validate.sql` | Testing | - |

---

**Status**: ✅ Ready to Deploy
**Time to Deploy**: 5 minutes
**Difficulty**: Easy
**Version**: 1.0.0

---

*Let's build something amazing with Workflow Vault!* 🚀
