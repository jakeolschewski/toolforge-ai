# ToolForge AI - Automation System

Complete automation system for discovering, reviewing, and publishing AI tools with zero maintenance.

## Overview

This automation system consists of:

1. **3 Production Scrapers** - Futurepedia, There's An AI For That, Product Hunt
2. **2 Cron Jobs** - Daily discovery and auto-publishing
3. **Email Notifications** - Daily digests and approval reminders
4. **Template-Based Content** - No AI API costs
5. **Smart Deduplication** - Filters duplicate tools automatically

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Daily Cron Jobs                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Discovery (2 AM)              2. Publishing (10 AM) │
│     ├─ Run scrapers                  ├─ Publish drafts  │
│     ├─ Validate results              ├─ Generate reviews│
│     ├─ Deduplicate                   ├─ Send reminders  │
│     ├─ Save to database              └─ Update sitemap  │
│     └─ Send email digest                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
CRON_SECRET=$(openssl rand -base64 32)

# Recommended (for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com

# Optional
AUTO_PUBLISH_DAYS=7
SCRAPER_RATE_LIMIT=30
```

### 2. Deploy to Vercel

The `vercel.json` file is pre-configured with cron schedules:

```json
{
  "crons": [
    {
      "path": "/api/cron/discover",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/publish-drafts",
      "schedule": "0 10 * * *"
    }
  ]
}
```

**Cron Schedule:**
- Discovery: 2 AM UTC daily
- Publishing: 10 AM UTC daily

### 3. Configure Vercel Cron Secret

In Vercel dashboard:
1. Go to Settings > Environment Variables
2. Add `CRON_SECRET` with your generated secret
3. Redeploy the app

## Components

### Scrapers (`/src/utils/scrapers/`)

#### 1. Futurepedia (`futurepedia.ts`)
- Scrapes from RSS feed and web fallback
- Extracts: name, URL, description, category, pricing
- Rate limited: 800ms between requests

#### 2. There's An AI For That (`thereisanaiforthat.ts`)
- Tries API first, falls back to web scraping
- Multiple selector strategies
- Rate limited: 30 requests/minute

#### 3. Product Hunt (`producthunt.ts`)
- Scrapes AI-related topics
- Extracts product details
- Handles multiple HTML structures

**Features:**
- ✅ Automatic retry with exponential backoff
- ✅ Multiple selector fallbacks
- ✅ Rate limiting protection
- ✅ Comprehensive error handling
- ✅ Validation and sanitization

### Cron Jobs (`/src/app/api/cron/`)

#### 1. Discovery (`/api/cron/discover`)

Runs daily to find new AI tools.

**Process:**
1. Run all enabled scrapers in priority order
2. Validate scraped data with Zod schemas
3. Deduplicate by name and URL
4. Save to `scraped_sources` table
5. Send email digest with summary

**Manual Trigger:**
```bash
curl -X POST http://localhost:3000/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scraped": 45,
    "saved": 12,
    "duplicates": 33,
    "errors": 0,
    "duration": 23456,
    "message": "Discovered 12 new tools in 23.46s"
  }
}
```

#### 2. Auto-Publish (`/api/cron/publish-drafts`)

Runs daily to publish content and generate reviews.

**Process:**
1. Auto-publish approved draft tools
2. Generate reviews for tools without reviews (5 per run)
3. Send approval reminder if pending items exist
4. Update sitemap (if implemented)

**Manual Trigger:**
```bash
curl -X POST http://localhost:3000/api/cron/publish-drafts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Email Notifications (`/src/lib/email.ts`)

#### Daily Discovery Digest
Sent after each discovery run with:
- Number of new tools found
- Total scraped vs. saved
- Duplicates filtered
- Errors encountered
- Link to admin dashboard

#### Approval Reminders
Sent when pending items need review:
- Count of pending tools
- Age of oldest pending item
- Direct link to approve

#### Error Notifications
Sent when errors occur in cron jobs:
- Error message and context
- Current state of operation
- Debugging information

### Content Generation (`/src/utils/generators/`)

#### Template-Based Reviews
Generates reviews without AI API costs:
- SEO-optimized titles and descriptions
- Category-specific pros/cons
- Smart rating estimation
- Reading time calculation
- Keyword generation

**Example Output:**
```markdown
# ChatGPT Review

ChatGPT is a powerful chat tool that has been gaining attention...

## Key Features
- Natural language understanding
- 24/7 availability
- Context retention
- Multi-turn conversations

## Pricing
ChatGPT offers a freemium pricing model...

## Pros
- Excellent content generation
- Time-saving features
- Free tier available

## Cons
- Learning curve for new users
- May require subscription for full features
```

### Validation (`/src/utils/validation.ts`)

Zod schemas for:
- Scraped results
- Tools
- Reviews
- Email notifications

**Features:**
- Type-safe validation
- Automatic sanitization
- Batch validation
- Error reporting

## Usage

### Manual Operations

#### Test a Specific Scraper
```typescript
import { runScraper } from '@/utils/scrapers';

const results = await runScraper('Futurepedia');
console.log(results);
```

#### Generate Review for Tool
```typescript
import { generateReview } from '@/utils/generators/review';

const review = await generateReview(tool);
await supabaseAdmin.from('reviews').insert(review);
```

#### Send Test Email
```typescript
import { sendTestEmail } from '@/lib/email';

await sendTestEmail('admin@yourdomain.com');
```

### Monitoring

#### View Logs
```bash
# Vercel CLI
vercel logs --follow

# Specific function
vercel logs api/cron/discover
```

#### Check Cron Status
Vercel Dashboard > Deployments > Functions > Cron

#### Database Queries
```sql
-- Check pending sources
SELECT COUNT(*) FROM scraped_sources WHERE status = 'pending';

-- Recent tools
SELECT * FROM tools
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Tools without reviews
SELECT t.* FROM tools t
LEFT JOIN reviews r ON t.id = r.tool_id
WHERE r.id IS NULL AND t.status = 'published';
```

## Customization

### Adjust Discovery Schedule

Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/discover",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

### Add New Scraper

1. Create scraper file in `/src/utils/scrapers/`
2. Implement `scrape()` function returning `ScraperResult[]`
3. Add to `scraperSources` in `/src/utils/scrapers/index.ts`
4. Set priority and enable

### Customize Email Templates

Edit templates in `/src/lib/email.ts`:
- HTML structure
- Styling
- Content
- CTA buttons

### Modify Auto-Publish Logic

Edit `/src/app/api/cron/publish-drafts/route.ts`:
```typescript
const autoPublishDays = 7; // Change threshold
```

## Troubleshooting

### Scraper Returns No Results

**Check:**
1. Website structure hasn't changed (inspect selectors)
2. Rate limiting not blocking requests
3. Network connectivity
4. User-Agent header accepted

**Fix:**
```typescript
// Add more selector fallbacks
const selectors = [
  '.new-selector',
  '.old-selector',
  'article',
];
```

### Email Not Sending

**Check:**
1. Email credentials in environment variables
2. App-specific password (for Gmail)
3. SMTP ports not blocked
4. Email logs in console

**Test:**
```bash
curl -X POST http://localhost:3000/api/test-email
```

### Cron Job Not Running

**Check:**
1. Vercel cron is enabled for your plan
2. `CRON_SECRET` environment variable is set
3. Function timeout (max 60s on Hobby plan)
4. Deployment is successful

### High Error Rate

**Solutions:**
1. Increase retry attempts
2. Add more delay between requests
3. Implement circuit breaker
4. Fall back to alternate sources

## Performance

### Optimization Tips

1. **Limit scrapers per run**: Process 10-15 tools max per scraper
2. **Batch database operations**: Use transactions
3. **Cache results**: Store in Redis for frequently accessed data
4. **Async operations**: Run independent scrapers in parallel
5. **Monitor timeouts**: Stay under 60s for Hobby plan

### Expected Performance

| Operation | Time | Tools |
|-----------|------|-------|
| Single scraper | 10-20s | 10-15 |
| All scrapers | 30-45s | 30-45 |
| Review generation | 100ms | 1 |
| Email sending | 1-2s | 1 |

## Security

### Best Practices

1. **Never commit secrets**: Use environment variables
2. **Validate all inputs**: Use Zod schemas
3. **Sanitize scraped content**: Remove harmful HTML/JS
4. **Rate limit requests**: Respect source websites
5. **Secure cron endpoints**: Require CRON_SECRET

### CRON_SECRET Protection

All cron endpoints verify the secret:
```typescript
if (!verifyCronSecret(request)) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
```

## Cost Analysis

### Free Tier (Vercel Hobby + Supabase Free)

- ✅ 2 cron jobs (included)
- ✅ 100K function invocations/month
- ✅ 60s max duration
- ✅ Template-based content (no AI costs)
- ✅ Email via Gmail (free)

**Monthly cost: $0**

### Paid Tier (Optional)

If you need:
- More scrapers
- Longer timeouts
- AI-enhanced content
- More frequent runs

**Recommended:**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- OpenAI API: ~$10-20/month

**Total: ~$55-65/month**

## Roadmap

### Coming Soon

- [ ] AI-enhanced content generation (optional)
- [ ] Image scraping and optimization
- [ ] Webhook integrations (Discord, Slack)
- [ ] A/B testing for templates
- [ ] Analytics dashboard
- [ ] Automated backups
- [ ] Multi-language support
- [ ] RSS feed generation

### Contribute

Found a bug or want to add a feature? Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## Support

For issues or questions:
- Check logs in Vercel dashboard
- Review error emails
- Inspect database records
- Test manually with curl

## License

MIT License - Use freely in your projects
