# ToolForge AI - Maintenance Guide

Complete guide for maintaining and operating your ToolForge AI directory after deployment.

## Table of Contents

- [Daily Tasks (5 minutes)](#daily-tasks-5-minutes)
- [Weekly Tasks (30 minutes)](#weekly-tasks-30-minutes)
- [Monthly Tasks (1 hour)](#monthly-tasks-1-hour)
- [Monitoring Checklist](#monitoring-checklist)
- [Backup Procedures](#backup-procedures)
- [Performance Optimization](#performance-optimization)
- [Common Issues and Fixes](#common-issues-and-fixes)
- [Emergency Procedures](#emergency-procedures)

---

## Daily Tasks (5 minutes)

### 1. Check Cron Job Execution

**What:** Verify that both cron jobs ran successfully.

**How:**
```bash
# Log into Vercel Dashboard
# Navigate to: Project > Cron Jobs
# Check last execution time and status
```

**Expected Results:**
- Discovery job: Ran at 2:00 AM UTC
- Publish job: Ran at 10:00 AM UTC
- Both show "Success" status
- No error messages

**If Failed:**
- Check function logs in Vercel
- Verify CRON_SECRET is set correctly
- Test manually: `curl -X POST https://yourdomain.com/api/cron/discover -H "Authorization: Bearer YOUR_CRON_SECRET"`

### 2. Review Email Digest

**What:** Check your daily discovery digest email.

**Key Metrics:**
- Tools scraped: 30-50 expected
- New tools saved: 10-20 expected
- Duplicates: Normal (shows scrapers working)
- Errors: Should be 0 or minimal

**Action Items:**
- If errors > 5: Investigate which scraper is failing
- If saved < 5: May need to add more scrapers or sources
- If duplicates > 80%: Scrapers may need updated selectors

### 3. Approve Pending Tools (10-15 minutes)

**What:** Review and approve new discoveries.

**Steps:**
1. Visit `https://yourdomain.com/admin`
2. Enter admin password
3. Review 5-10 pending tools
4. Click "Approve" for quality tools
5. Click "Ignore" for spam/duplicates

**Quality Checklist:**
- [ ] Tool has clear description
- [ ] Website URL works
- [ ] Category is appropriate
- [ ] Name is not spammy
- [ ] Not a duplicate of existing tool

**Time Budget:** 30-60 seconds per tool

---

## Weekly Tasks (30 minutes)

### 1. Analytics Review (10 minutes)

**What:** Check site performance and traffic.

**Vercel Analytics:**
```
Dashboard > Analytics
```

**Key Metrics:**
- Page views: Track growth week-over-week
- Unique visitors: Growing 5-10% weekly is healthy
- Top pages: Which tools are most popular?
- Referrers: Where is traffic coming from?
- Devices: Mobile vs desktop ratio

**Action Items:**
- Share popular tools on social media
- Update popular tool reviews with fresh content
- Investigate high bounce rate pages

### 2. Affiliate Performance (5 minutes)

**What:** Check affiliate click-through rates.

**Database Query:**
```sql
-- Run in Supabase SQL Editor
SELECT
  t.name,
  t.views,
  t.clicks,
  ROUND((t.clicks::decimal / NULLIF(t.views, 0)) * 100, 2) as ctr_percentage
FROM tools t
WHERE t.views > 50
  AND t.affiliate_link IS NOT NULL
ORDER BY t.clicks DESC
LIMIT 20;
```

**Good CTR:** 3-7% is typical
**Excellent CTR:** 8%+ means strong conversion

**Action Items:**
- Add affiliate links to high-view tools without them
- Improve CTAs on low-CTR pages
- Update affiliate links if broken

### 3. Content Quality Check (10 minutes)

**What:** Review recently published content.

**Check:**
1. Visit 5 random tool pages
2. Verify review quality
3. Check for broken links
4. Test affiliate tracking

**Quality Checklist:**
- [ ] Review is coherent and helpful
- [ ] Pros/cons are relevant
- [ ] Rating seems appropriate
- [ ] Images load properly
- [ ] Affiliate link works
- [ ] Click tracking increments

**Fix Issues:**
- Edit reviews with poor quality
- Update broken links
- Regenerate reviews if needed

### 4. Database Health (5 minutes)

**What:** Monitor database usage and performance.

**Supabase Dashboard:**
```
Dashboard > Database > Usage
```

**Check:**
- Database size (free tier: 500MB limit)
- Connection count
- Query performance
- Error logs

**Thresholds:**
- Database size > 400MB: Time to upgrade or cleanup
- Connections > 50: May need connection pooling
- Slow queries > 1000ms: Need optimization

**Cleanup Old Data:**
```sql
-- Delete old ignored scraped sources (keep 30 days)
DELETE FROM scraped_sources
WHERE status = 'ignored'
  AND created_at < NOW() - INTERVAL '30 days';

-- Delete old click logs (keep 90 days for analytics)
DELETE FROM click_logs
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## Monthly Tasks (1 hour)

### 1. Comprehensive Analytics Review (15 minutes)

**What:** Deep dive into monthly performance.

**Metrics to Track:**

| Metric | Month 1 | Month 2 | Month 3 | Goal |
|--------|---------|---------|---------|------|
| Total Tools | | | | 500+ |
| Monthly Visitors | | | | 1,000+ |
| Affiliate Clicks | | | | 100+ |
| Revenue | | | | $100+ |

**Google Search Console:**
1. Check average position for keywords
2. Identify high-impression, low-CTR queries
3. Find new keyword opportunities
4. Track indexed pages

**Action Items:**
- Create content targeting high-impression keywords
- Improve meta descriptions for low-CTR pages
- Submit new pages to Google

### 2. SEO Audit (15 minutes)

**What:** Review and optimize SEO performance.

**Check:**

1. **Sitemap Status**
   ```bash
   # Verify sitemap is accessible
   curl https://yourdomain.com/sitemap.xml
   ```

2. **Robots.txt**
   ```bash
   curl https://yourdomain.com/robots.txt
   ```

3. **Meta Tags**
   - Visit 10 random tool pages
   - Check title, description, OG tags
   - Verify uniqueness

4. **Internal Linking**
   - Check category pages link to tools
   - Tools link to related tools (future enhancement)
   - Footer has important links

**SEO Tools:**
- Use Ahrefs/SEMrush for backlink audit
- Check with Screaming Frog for broken links
- Run Lighthouse audit on key pages

### 3. Scraper Maintenance (15 minutes)

**What:** Update and optimize scrapers.

**Test Each Scraper:**
```bash
# Manually trigger discovery
curl -X POST https://yourdomain.com/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Check response for errors
```

**If Scraper Failing:**
1. Visit source website manually
2. Check if HTML structure changed
3. Update selectors in scraper file
4. Test locally before deploying

**Files to Check:**
- `/src/utils/scrapers/futurepedia.ts`
- `/src/utils/scrapers/thereisanaiforthat.ts`
- `/src/utils/scrapers/producthunt.ts`

### 4. Content Template Updates (15 minutes)

**What:** Improve review generation quality.

**Review Templates:**
1. Read 10 recent auto-generated reviews
2. Identify common weak points
3. Update templates for better quality

**Files to Edit:**
- `/src/utils/generators/content.ts` - Main templates
- `/src/utils/generators/review.ts` - Review logic

**Common Improvements:**
- Add more varied intro sentences
- Expand pros/cons templates
- Improve verdict variety
- Add category-specific insights

---

## Monitoring Checklist

### Daily Monitoring

- [ ] Cron jobs executed successfully
- [ ] Email digest received and reviewed
- [ ] No error alerts received
- [ ] 5-10 tools approved

### Weekly Monitoring

- [ ] Analytics show healthy growth
- [ ] No broken affiliate links
- [ ] Database size under control
- [ ] No performance degradation

### Monthly Monitoring

- [ ] SEO rankings improving
- [ ] Revenue tracking on target
- [ ] Scrapers still working correctly
- [ ] Content quality maintained

---

## Backup Procedures

### Automatic Backups (Supabase)

**Supabase Free Tier:**
- Daily backups (7-day retention)
- Automatic, no action needed

**Supabase Pro:**
- Point-in-time recovery
- 30-day retention
- Upgrade recommended when revenue > $500/mo

### Manual Backups

**Weekly Database Export:**

```bash
# Using Supabase CLI
supabase db dump -f backup-$(date +%Y%m%d).sql

# Or via Supabase Dashboard:
# Settings > Database > Export
```

**What to Backup:**
- Tools table (most important)
- Reviews table
- Categories table
- Click logs (optional)

**Storage:**
- Local: External drive
- Cloud: Google Drive / Dropbox
- Version control: Separate repo for data backups

### Restore Procedure

```bash
# Restore from SQL dump
psql -h your-supabase-host -U postgres -f backup-20260211.sql

# Or via Supabase Dashboard:
# SQL Editor > Paste SQL > Run
```

---

## Performance Optimization

### Database Optimization

**1. Index Analysis**

```sql
-- Find missing indexes
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**2. Query Optimization**

Common slow queries to optimize:

```sql
-- Add composite index for category + status filtering
CREATE INDEX idx_tools_category_status ON tools(category, status);

-- Add index for popular tools query
CREATE INDEX idx_tools_clicks_views ON tools(clicks DESC, views DESC);
```

### Caching Strategy

**1. Enable Vercel Edge Caching**

Add to page components:
```typescript
export const revalidate = 3600; // Revalidate every hour
```

**2. Cache API Responses**

```typescript
// In API routes
export const runtime = 'edge';
export const revalidate = 1800; // 30 minutes
```

**3. Cache Database Queries**

Use React Cache (Next.js 15):
```typescript
import { cache } from 'react';

export const getTools = cache(async () => {
  // Database query
});
```

### Image Optimization

**1. Use Next.js Image Component**

```tsx
import Image from 'next/image';

<Image
  src={tool.logo_url}
  alt={tool.name}
  width={200}
  height={200}
  loading="lazy"
/>
```

**2. Optimize External Images**

Consider using image CDN:
- Cloudinary (free tier: 25GB)
- Imgix
- Vercel Image Optimization

---

## Common Issues and Fixes

### Issue 1: Cron Job Timing Out

**Symptoms:**
- Function exceeds 60-second limit
- Incomplete scraping results

**Solutions:**

1. **Reduce scraper count per run:**
```typescript
// In /src/utils/scrapers/index.ts
const enabledScrapers = scraperSources
  .filter(s => s.enabled)
  .slice(0, 2); // Only run 2 scrapers per job
```

2. **Increase timeout (Vercel Pro):**
```json
// vercel.json
{
  "functions": {
    "api/cron/discover/route.ts": {
      "maxDuration": 300
    }
  }
}
```

3. **Split into multiple cron jobs:**
- Run Futurepedia at 2 AM
- Run There's An AI For That at 3 AM
- Run Product Hunt at 4 AM

### Issue 2: Scrapers Returning No Results

**Symptoms:**
- Email digest shows 0 tools scraped
- No errors logged

**Diagnosis:**
```bash
# Test scraper locally
npm run dev
curl -X POST http://localhost:3000/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Common Causes:**

1. **Website HTML changed:**
   - Visit source website
   - Inspect element structure
   - Update selectors

2. **Rate limiting:**
   - Add delays between requests
   - Use residential proxy (if needed)

3. **CORS/blocking:**
   - Check user-agent headers
   - Add timeout handling

**Fix Example:**
```typescript
// Update selectors in scraper file
const titleSelector = '.new-title-class'; // Was '.old-title-class'
```

### Issue 3: Database Growing Too Fast

**Symptoms:**
- Supabase usage alert
- Approaching 500MB limit

**Solutions:**

1. **Delete old ignored sources:**
```sql
DELETE FROM scraped_sources
WHERE status = 'ignored'
  AND created_at < NOW() - INTERVAL '14 days';
```

2. **Compress click logs:**
```sql
-- Create aggregated stats table
CREATE TABLE daily_stats (
  date DATE,
  tool_id UUID,
  clicks INTEGER,
  views INTEGER
);

-- Aggregate old data
INSERT INTO daily_stats
SELECT
  DATE(created_at),
  tool_id,
  COUNT(*),
  0
FROM click_logs
WHERE created_at < NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), tool_id;

-- Delete old logs
DELETE FROM click_logs
WHERE created_at < NOW() - INTERVAL '30 days';
```

3. **Upgrade to Supabase Pro ($25/mo):**
   - 8GB database
   - Better performance
   - Point-in-time recovery

### Issue 4: Email Not Sending

**Symptoms:**
- No daily digest received
- Error in function logs

**Diagnosis:**
```bash
# Check environment variables
vercel env ls

# Test email configuration
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

**Solutions:**

1. **Gmail app password expired:**
   - Generate new app password at https://myaccount.google.com/apppasswords
   - Update `EMAIL_PASS` in Vercel

2. **SMTP blocked:**
   - Check firewall settings
   - Try port 465 (SSL) instead of 587 (TLS)

3. **Daily limit reached:**
   - Gmail free: 500 emails/day
   - Use SendGrid (100 emails/day free)

### Issue 5: Duplicate Tools Being Created

**Symptoms:**
- Same tool appears multiple times
- Different slugs for identical tools

**Solutions:**

1. **Improve deduplication logic:**
```typescript
// In /src/utils/scrapers/index.ts
function normalizeToolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}
```

2. **Add database constraint:**
```sql
-- Add unique constraint on normalized name
CREATE UNIQUE INDEX idx_tools_name_normalized
  ON tools(LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g')));
```

3. **Manual cleanup:**
```sql
-- Find duplicates
SELECT name, COUNT(*)
FROM tools
GROUP BY LOWER(name)
HAVING COUNT(*) > 1;

-- Delete duplicates (keep oldest)
DELETE FROM tools
WHERE id NOT IN (
  SELECT MIN(id)
  FROM tools
  GROUP BY LOWER(name)
);
```

---

## Emergency Procedures

### Site is Down

1. **Check Vercel Status:**
   - Visit https://www.vercel-status.com

2. **Check Recent Deployments:**
   - Vercel Dashboard > Deployments
   - Rollback if recent deploy broke site

3. **Check Database:**
   - Supabase Dashboard
   - Verify database is online

4. **Emergency Rollback:**
```bash
# Via Vercel CLI
vercel rollback

# Or via dashboard:
# Deployments > Previous > Promote to Production
```

### Data Loss / Corruption

1. **Stop all automation:**
```bash
# Comment out cron jobs in vercel.json temporarily
```

2. **Assess damage:**
```sql
SELECT COUNT(*) FROM tools;
SELECT COUNT(*) FROM reviews;
```

3. **Restore from backup:**
```bash
# From most recent backup
psql -h your-host -U postgres -f backup-latest.sql
```

4. **Verify restoration:**
- Check tool count
- Test site functionality
- Re-enable automation

### Security Breach

1. **Immediate Actions:**
   - Rotate all secrets (CRON_SECRET, ADMIN_PASSWORD)
   - Change Supabase service role key
   - Review access logs

2. **Investigate:**
   - Check Vercel logs for suspicious activity
   - Review database audit logs
   - Check for unauthorized data access

3. **Remediate:**
   - Update security headers
   - Add rate limiting
   - Enable 2FA on all accounts

4. **Communicate:**
   - Notify users if data exposed
   - Update privacy policy if needed

---

## Maintenance Calendar

### Weekly Schedule

**Monday:**
- Review weekend analytics
- Plan content for the week

**Wednesday:**
- Mid-week analytics check
- Approve pending tools

**Friday:**
- Weekly wrap-up
- Backup database
- Plan for next week

### Monthly Schedule

**First Week:**
- Comprehensive analytics review
- Scraper maintenance
- Content template updates

**Second Week:**
- SEO audit
- Competitor analysis

**Third Week:**
- Performance optimization
- Database cleanup

**Fourth Week:**
- Financial review
- Planning for next month

---

## Success Metrics

Track these KPIs monthly:

| Metric | Month 1 | Month 3 | Month 6 | Year 1 |
|--------|---------|---------|---------|--------|
| Tools Published | 100 | 300 | 600 | 1,200 |
| Monthly Visitors | 500 | 2,000 | 5,000 | 15,000 |
| Affiliate Clicks | 25 | 150 | 500 | 2,000 |
| Monthly Revenue | $0 | $100 | $500 | $2,000 |

**Healthy Growth:**
- Tools: +50-100/month
- Traffic: +20-30%/month
- Revenue: +50%/month (after month 3)

---

## When to Scale Up

### Signs You Need to Upgrade

1. **Database:**
   - Consistently near 500MB limit
   - Slow query performance
   - **Action:** Upgrade to Supabase Pro ($25/mo)

2. **Hosting:**
   - Function timeouts increasing
   - Need faster cron jobs
   - **Action:** Upgrade to Vercel Pro ($20/mo)

3. **Email:**
   - Hitting daily send limits
   - Need better deliverability
   - **Action:** Switch to SendGrid/Mailgun ($15/mo)

4. **Content:**
   - Manual approval taking too long
   - Need higher quality reviews
   - **Action:** Add OpenAI API ($20-50/mo)

### Total Cost at Scale

**Revenue < $500/mo:** Stay on free tier
**Revenue $500-2000/mo:** $60-80/mo infrastructure
**Revenue $2000+/mo:** Consider hiring VA for approvals

---

## Final Checklist

### Daily (5 min)
- [ ] Check cron jobs ran
- [ ] Review email digest
- [ ] Approve 5-10 tools

### Weekly (30 min)
- [ ] Review analytics
- [ ] Check affiliate performance
- [ ] Quality check content
- [ ] Monitor database health

### Monthly (1 hour)
- [ ] Deep analytics review
- [ ] SEO audit
- [ ] Scraper maintenance
- [ ] Template updates
- [ ] Backup database

---

**Last Updated:** 2026-02-11
**Maintainer:** ToolForge Team

Need help? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or join our Discord community.
