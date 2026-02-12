# ToolForge AI - Troubleshooting Guide

Solutions to common issues you may encounter while running ToolForge AI.

## Table of Contents

- [Build and Deployment Errors](#build-and-deployment-errors)
- [Scraper Issues](#scraper-issues)
- [Database Problems](#database-problems)
- [Cron Job Failures](#cron-job-failures)
- [Performance Issues](#performance-issues)
- [API Errors](#api-errors)
- [Email Problems](#email-problems)
- [Authentication Issues](#authentication-issues)

---

## Build and Deployment Errors

### Error: "Module not found" during build

**Symptoms:**
```
Error: Cannot find module '@/lib/supabase'
```

**Causes:**
- Missing dependency
- Incorrect import path
- TypeScript path mapping issue

**Solutions:**

1. **Install missing dependencies:**
```bash
npm install
```

2. **Clear Next.js cache:**
```bash
rm -rf .next
npm run build
```

3. **Check tsconfig.json paths:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

4. **Verify file exists:**
```bash
ls -la src/lib/supabase.ts
```

---

### Error: "Environment variable not defined"

**Symptoms:**
```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Causes:**
- Missing .env.local file
- Wrong env variable name
- Not deployed to Vercel

**Solutions:**

**Local Development:**
```bash
# 1. Check .env.local exists
ls -la .env.local

# 2. If not, create from example
cp .env.example .env.local

# 3. Fill in values
nano .env.local
```

**Vercel Deployment:**
1. Go to Vercel Dashboard > Project > Settings > Environment Variables
2. Add all variables from .env.example
3. Redeploy

---

### Error: "Build exceeded maximum duration"

**Symptoms:**
```
Error: Build exceeded maximum duration of 600 seconds
```

**Causes:**
- Prisma generation slow
- Large dependencies
- Complex build process

**Solutions:**

1. **Remove unused dependencies:**
```bash
npm prune
```

2. **Optimize Prisma:**
```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate --no-engine"
  }
}
```

3. **Upgrade Vercel plan:**
- Hobby: 600s build time
- Pro: 900s build time

---

### Error: TypeScript compilation errors

**Symptoms:**
```
Type 'string | undefined' is not assignable to type 'string'
```

**Solutions:**

1. **Add type guards:**
```typescript
// Before
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// After
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) throw new Error('SUPABASE_URL not defined');
```

2. **Use non-null assertion (if you're sure):**
```typescript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
```

3. **Disable strict mode temporarily:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false
  }
}
```

⚠️ **Not recommended for production**

---

## Scraper Issues

### Issue: Scrapers returning 0 results

**Symptoms:**
- Email digest shows 0 tools scraped
- No errors in logs
- Cron job completes successfully

**Diagnosis:**

1. **Test scraper locally:**
```bash
npm run dev

# In another terminal
curl -X POST http://localhost:3000/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

2. **Check response:**
```json
{
  "success": true,
  "data": {
    "scraped": 0,  // ← Problem here
    "saved": 0
  }
}
```

**Causes & Solutions:**

#### Cause 1: Website HTML changed

**Check:**
```bash
# Visit source website
curl https://www.futurepedia.io/ | head -100
```

**Fix:**
Update selectors in scraper file:

```typescript
// /src/utils/scrapers/futurepedia.ts

// Old selector (broken)
const titleSelector = '.tool-card h3';

// New selector (fixed)
const titleSelector = '.card-title';  // Update based on current HTML
```

**How to find new selectors:**
1. Visit website in browser
2. Right-click element → Inspect
3. Note class name or structure
4. Update scraper file

#### Cause 2: Rate limiting or blocking

**Check logs for:**
```
Error: Request failed with status code 429
Error: Request failed with status code 403
```

**Fix:**

1. **Add delays:**
```typescript
// Add to scraper
await delay(2000);  // 2 second delay between requests
```

2. **Add user agent:**
```typescript
const response = await axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});
```

3. **Use proxy (advanced):**
```typescript
const response = await axios.get(url, {
  proxy: {
    host: 'proxy.example.com',
    port: 8080
  }
});
```

#### Cause 3: Timeout

**Check logs for:**
```
Error: timeout of 10000ms exceeded
```

**Fix:**
```typescript
// Increase timeout
const response = await axios.get(url, {
  timeout: 30000  // 30 seconds
});
```

---

### Issue: Scraper returns duplicate tools

**Symptoms:**
- Same tool discovered multiple times
- Different slugs for same tool

**Causes:**
- Deduplication logic not working
- Case sensitivity
- Special characters in names

**Fix:**

Update deduplication in `/src/utils/scrapers/index.ts`:

```typescript
function normalizeToolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')  // Remove special chars
    .trim();
}

function deduplicateResults(results: ScraperResult[]): ScraperResult[] {
  const seen = new Set<string>();
  const unique: ScraperResult[] = [];

  for (const result of results) {
    const normalized = normalizeToolName(result.tool_name);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(result);
    }
  }

  return unique;
}
```

---

### Issue: Invalid data being saved

**Symptoms:**
- Tools with missing fields
- Malformed descriptions
- Wrong categories

**Diagnosis:**

Check validation in `/src/utils/validation.ts`:

```typescript
const { valid, invalid } = validateScraperResults(results);
console.log('Invalid results:', invalid);
```

**Fix:**

1. **Strengthen validation:**
```typescript
export const scraperResultSchema = z.object({
  tool_name: z.string().min(2).max(100),
  tool_url: z.string().url(),
  description: z.string().min(20).max(500),  // Require min length
  category: z.string().min(1),
  // ...
});
```

2. **Add sanitization:**
```typescript
import { sanitizeText } from '@/utils/helpers';

const cleanedResult = {
  ...result,
  tool_name: sanitizeText(result.tool_name),
  description: sanitizeText(result.description)
};
```

---

## Database Problems

### Issue: "Too many connections"

**Symptoms:**
```
Error: remaining connection slots are reserved
```

**Causes:**
- Connection leak
- No connection pooling
- High traffic

**Solutions:**

1. **Use Supabase connection pooling:**
```typescript
// Update Supabase URL to use pooler
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  .replace('supabase.co', 'supabase.co:6543');
```

2. **Close connections:**
```typescript
// Not needed with Supabase client, but for raw Postgres:
const client = await pool.connect();
try {
  // Query
} finally {
  client.release();  // Always release
}
```

3. **Upgrade Supabase plan:**
- Free: 60 connections
- Pro: 400 connections

---

### Issue: Slow queries

**Symptoms:**
- Pages loading slowly
- Timeouts in API routes
- High database CPU

**Diagnosis:**

Check slow queries in Supabase:
```sql
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Solutions:**

1. **Add missing indexes:**
```sql
-- If filtering by category often
CREATE INDEX idx_tools_category_status ON tools(category, status);

-- If sorting by popularity
CREATE INDEX idx_tools_clicks_desc ON tools(clicks DESC);
```

2. **Optimize query:**
```typescript
// Before (slow - fetches all columns)
const tools = await supabase
  .from('tools')
  .select('*')
  .eq('status', 'published');

// After (fast - only needed columns)
const tools = await supabase
  .from('tools')
  .select('id, slug, name, tagline, logo_url, category, rating')
  .eq('status', 'published');
```

3. **Use pagination:**
```typescript
// Add limit and offset
const tools = await supabase
  .from('tools')
  .select('*')
  .eq('status', 'published')
  .range(0, 49)  // First 50 results
  .order('created_at', { ascending: false });
```

---

### Issue: Database out of space

**Symptoms:**
```
Error: disk quota exceeded
```

**Diagnosis:**
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('postgres')) as size;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solutions:**

1. **Delete old data:**
```sql
-- Delete old ignored sources
DELETE FROM scraped_sources
WHERE status = 'ignored'
  AND created_at < NOW() - INTERVAL '30 days';

-- Delete old click logs
DELETE FROM click_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Vacuum to reclaim space
VACUUM FULL;
```

2. **Compress click logs:**
```sql
-- Create summary table
CREATE TABLE daily_click_stats (
  date DATE,
  tool_id UUID,
  clicks INTEGER,
  PRIMARY KEY (date, tool_id)
);

-- Aggregate old data
INSERT INTO daily_click_stats
SELECT
  DATE(created_at),
  tool_id,
  COUNT(*)
FROM click_logs
WHERE created_at < NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), tool_id;

-- Delete raw logs
DELETE FROM click_logs
WHERE created_at < NOW() - INTERVAL '30 days';
```

3. **Upgrade Supabase plan:**
- Free: 500MB
- Pro: 8GB

---

## Cron Job Failures

### Issue: Cron job timing out

**Symptoms:**
```
Error: Function execution exceeded timeout of 60 seconds
```

**Causes:**
- Too many scrapers running
- Slow network requests
- Large data processing

**Solutions:**

1. **Reduce scrapers per job:**
```typescript
// In /src/utils/scrapers/index.ts
const scraperSources: ScraperSource[] = [
  { name: 'Futurepedia', scrape: scrapeFuturepedia, enabled: true },
  // Temporarily disable others
  { name: 'ThereIsAnAIForThat', scrape: scrapeThereIsAnAIForThat, enabled: false },
];
```

2. **Split into multiple cron jobs:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/discover-futurepedia",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/discover-thereisanai",
      "schedule": "0 3 * * *"
    }
  ]
}
```

3. **Upgrade Vercel plan:**
```json
// vercel.json (Vercel Pro required)
{
  "functions": {
    "api/cron/discover/route.ts": {
      "maxDuration": 300  // 5 minutes
    }
  }
}
```

---

### Issue: Cron job not running at all

**Symptoms:**
- No email digest
- No new tools discovered
- Vercel dashboard shows no executions

**Diagnosis:**

1. **Check vercel.json:**
```bash
cat vercel.json
```

Should have:
```json
{
  "crons": [
    {
      "path": "/api/cron/discover",
      "schedule": "0 2 * * *"
    }
  ]
}
```

2. **Check Vercel Dashboard:**
- Project > Cron Jobs tab
- Should show scheduled jobs

**Solutions:**

1. **Redeploy:**
```bash
# Vercel CLI
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

2. **Verify cron syntax:**
```
0 2 * * *  = Daily at 2 AM UTC
0 */6 * * * = Every 6 hours
0 0 * * 0  = Weekly on Sunday
```

3. **Test manually:**
```bash
curl -X POST https://yourdomain.com/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

### Issue: Cron returns 401 Unauthorized

**Symptoms:**
```json
{
  "error": "Unauthorized"
}
```

**Causes:**
- CRON_SECRET not set
- Wrong secret in Vercel config
- Missing Authorization header

**Solutions:**

1. **Check environment variable:**
```bash
# Vercel CLI
vercel env ls

# Should show CRON_SECRET
```

2. **Set if missing:**
```bash
# Generate secret
openssl rand -base64 32

# Add to Vercel
vercel env add CRON_SECRET
# Paste secret
```

3. **Verify header format:**
```bash
# Correct
curl -H "Authorization: Bearer your-secret-here"

# Wrong
curl -H "Authorization: your-secret-here"  # Missing "Bearer"
```

---

## Performance Issues

### Issue: Slow page load times

**Symptoms:**
- Pages take 3+ seconds to load
- High Time to First Byte (TTFB)
- Poor Lighthouse scores

**Diagnosis:**

Run Lighthouse audit:
```bash
# Install
npm install -g lighthouse

# Run
lighthouse https://yourdomain.com --view
```

**Solutions:**

1. **Enable Edge caching:**
```typescript
// In page.tsx files
export const revalidate = 3600;  // Cache for 1 hour
```

2. **Optimize images:**
```tsx
// Use Next.js Image
import Image from 'next/image';

<Image
  src={tool.logo_url}
  alt={tool.name}
  width={200}
  height={200}
  loading="lazy"
  quality={75}  // Reduce quality
/>
```

3. **Reduce database queries:**
```typescript
// Before (2 queries)
const tools = await getTools();
const categories = await getCategories();

// After (1 query with join)
const data = await getToolsWithCategories();
```

4. **Use React Suspense:**
```tsx
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <ToolsList />
</Suspense>
```

---

### Issue: High memory usage

**Symptoms:**
```
Error: JavaScript heap out of memory
```

**Causes:**
- Large datasets in memory
- Memory leaks
- Recursive functions

**Solutions:**

1. **Process in chunks:**
```typescript
// Before
const allTools = await getAllTools();  // 10,000 tools
processTools(allTools);

// After
for (let offset = 0; offset < totalCount; offset += 100) {
  const tools = await getTools(offset, 100);
  await processTools(tools);
}
```

2. **Increase Node.js memory:**
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

3. **Fix memory leaks:**
```typescript
// Before (memory leak)
const cache = {};
function getCached(key) {
  if (!cache[key]) {
    cache[key] = fetchData(key);  // Cache grows forever
  }
  return cache[key];
}

// After (bounded cache)
import LRU from 'lru-cache';
const cache = new LRU({ max: 100 });
```

---

## API Errors

### Error: 500 Internal Server Error

**Diagnosis:**

1. **Check Vercel logs:**
```
Dashboard > Project > Functions > [Select function] > Logs
```

2. **Check for errors:**
```
Error: Cannot read property 'x' of undefined
Error: Unexpected token in JSON
```

**Common Causes & Fixes:**

#### Cause 1: Unhandled exception

```typescript
// Before
export async function GET(request: Request) {
  const data = await fetchData();
  return Response.json(data);  // Throws if fetchData fails
}

// After
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

#### Cause 2: Database error

```typescript
// Check Supabase connection
const { data, error } = await supabase
  .from('tools')
  .select('*');

if (error) {
  console.error('Supabase error:', error);
  return Response.json({ error: error.message }, { status: 500 });
}
```

#### Cause 3: Environment variable missing

```typescript
const apiKey = process.env.API_KEY;
if (!apiKey) {
  return Response.json(
    { error: 'API_KEY not configured' },
    { status: 500 }
  );
}
```

---

### Error: 429 Too Many Requests

**Symptoms:**
```json
{
  "error": "Too many requests"
}
```

**Causes:**
- Vercel rate limiting
- Supabase rate limiting
- External API rate limiting

**Solutions:**

1. **Add rate limiting:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')  // 10 requests per 10 seconds
});

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Continue...
}
```

2. **Implement caching:**
```typescript
const CACHE_TTL = 60 * 60;  // 1 hour
const cache = new Map();

export async function GET() {
  const cached = cache.get('tools');
  if (cached && cached.expires > Date.now()) {
    return Response.json(cached.data);
  }

  const data = await fetchTools();
  cache.set('tools', {
    data,
    expires: Date.now() + CACHE_TTL * 1000
  });

  return Response.json(data);
}
```

---

## Email Problems

### Issue: Emails not sending

**Symptoms:**
- No digest emails received
- No error emails
- sendEmail() returns success but no email

**Diagnosis:**

1. **Check email configuration:**
```bash
vercel env ls | grep EMAIL
```

Should show:
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASS
- ADMIN_EMAIL

2. **Test SMTP connection:**
```typescript
// Create test file: test-email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('SMTP Ready');
  }
});
```

**Common Fixes:**

#### Fix 1: Gmail app password expired

1. Go to https://myaccount.google.com/apppasswords
2. Generate new app password
3. Update EMAIL_PASS in Vercel
4. Redeploy

#### Fix 2: Wrong port

```env
# Try different ports
EMAIL_PORT=587  # TLS (recommended)
EMAIL_PORT=465  # SSL
EMAIL_PORT=25   # Unsecured (blocked by many providers)
```

#### Fix 3: 2FA not enabled

Gmail requires:
1. 2-factor authentication enabled
2. App-specific password (not regular password)

---

### Issue: Emails going to spam

**Symptoms:**
- Emails sent successfully
- Arrive in spam folder

**Solutions:**

1. **Add SPF record:**
```
# Add to DNS
TXT @ "v=spf1 include:_spf.google.com ~all"
```

2. **Use custom domain:**
```env
EMAIL_FROM=noreply@yourdomain.com  # Not @gmail.com
```

3. **Improve email content:**
```html
<!-- Avoid spam triggers -->
<!-- ❌ FREE, URGENT, CLICK HERE -->
<!-- ✅ Descriptive subject, plain text option -->
```

4. **Consider email service:**
- SendGrid: 100/day free
- Mailgun: 5,000/month free (first 3 months)
- Better deliverability than Gmail

---

## Authentication Issues

### Issue: Admin login not working

**Symptoms:**
- Correct password rejected
- Redirects to login after entering password
- "Invalid password" error

**Diagnosis:**

```typescript
// Check ADMIN_PASSWORD is set
console.log('Password set:', !!process.env.ADMIN_PASSWORD);

// Check password comparison
const inputPassword = 'test123';
const storedPassword = process.env.ADMIN_PASSWORD;
console.log('Match:', inputPassword === storedPassword);
```

**Fixes:**

1. **Check environment variable:**
```bash
vercel env ls

# Should show ADMIN_PASSWORD
```

2. **Reset password:**
```bash
# Generate new password
openssl rand -base64 16

# Set in Vercel
vercel env add ADMIN_PASSWORD production

# Redeploy
vercel --prod
```

3. **Clear cookies:**
- Browser DevTools > Application > Cookies
- Delete all cookies for your domain
- Try logging in again

---

## General Debugging Tips

### Enable Debug Logging

```typescript
// Add to api routes
const DEBUG = process.env.DEBUG === 'true';

if (DEBUG) {
  console.log('Request:', request);
  console.log('Headers:', request.headers);
  console.log('Body:', await request.json());
}
```

### Use Vercel Runtime Logs

```bash
# Real-time logs
vercel logs --follow

# Last 100 logs
vercel logs --limit 100

# Filter by function
vercel logs --grep "api/cron/discover"
```

### Database Query Logging

```typescript
// Enable Supabase query logging
const supabase = createClient(url, key, {
  auth: {
    debug: true  // Logs auth events
  }
});

// Log query results
const { data, error } = await supabase.from('tools').select('*');
console.log('Query result:', { data, error });
```

---

## Getting Help

### Before Asking for Help

**Gather Information:**

1. **Error message:** Exact text
2. **Stack trace:** Full error output
3. **Steps to reproduce:** What you did
4. **Environment:** Local or production
5. **Recent changes:** What you changed recently

### Where to Get Help

1. **GitHub Issues:**
   - Check existing issues
   - Create new issue with template

2. **Discord/Slack Communities:**
   - Next.js Discord
   - Vercel Discord
   - Supabase Discord

3. **Stack Overflow:**
   - Tag: next.js, vercel, supabase
   - Provide minimal reproducible example

4. **Official Documentation:**
   - Next.js: https://nextjs.org/docs
   - Vercel: https://vercel.com/docs
   - Supabase: https://supabase.com/docs

---

**Last Updated:** 2026-02-11

**Still having issues?** Check [MAINTENANCE.md](./MAINTENANCE.md) for ongoing maintenance tips or [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help.
