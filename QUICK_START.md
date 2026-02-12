# ToolForge AI - Quick Start Guide

## 5-Minute Setup

### 1. Clone and Install
```bash
git clone <your-repo>
cd toolforge-ai
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Required (from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Generate this
CRON_SECRET=$(openssl rand -base64 32)

# Optional but recommended
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Run Locally
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Test Automation
```bash
# Test discovery scraper
curl -X POST http://localhost:3000/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test auto-publish
curl -X POST http://localhost:3000/api/cron/publish-drafts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 5. Deploy to Vercel
```bash
vercel

# Set environment variables in Vercel dashboard
# Under Settings > Environment Variables
```

Done! Your automation runs daily at:
- 2 AM UTC: Tool discovery
- 10 AM UTC: Auto-publishing

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing Scrapers
```typescript
// In Node.js console or API route
import { runScraper } from '@/utils/scrapers';

// Test individual scraper
await runScraper('Futurepedia');
await runScraper('Product Hunt');

// Test all scrapers
import { runAllScrapers } from '@/utils/scrapers';
const { results, summary } = await runAllScrapers();
```

### Database Queries
```sql
-- Check pending discoveries
SELECT * FROM scraped_sources WHERE status = 'pending';

-- Recent tools
SELECT * FROM tools ORDER BY created_at DESC LIMIT 10;

-- Tools without reviews
SELECT t.* FROM tools t
LEFT JOIN reviews r ON t.id = r.tool_id
WHERE r.id IS NULL AND t.status = 'published';
```

### Email Testing
```bash
# Using curl
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com"}'
```

## File Structure

```
toolforge-ai/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── cron/
│   │           ├── discover/route.ts       # Daily discovery
│   │           └── publish-drafts/route.ts # Auto-publish
│   ├── lib/
│   │   ├── supabase.ts                     # DB client
│   │   └── email.ts                        # Email system
│   └── utils/
│       ├── scrapers/
│       │   ├── index.ts                    # Scraper manager
│       │   ├── futurepedia.ts              # Futurepedia
│       │   ├── thereisanaiforthat.ts       # TIAIFT
│       │   └── producthunt.ts              # Product Hunt
│       ├── generators/
│       │   ├── content.ts                  # Content templates
│       │   └── review.ts                   # Review generator
│       ├── validation.ts                   # Zod schemas
│       └── helpers.ts                      # Utilities
├── vercel.json                              # Cron config
├── .env.example                             # Env template
├── AUTOMATION.md                            # Full docs
└── QUICK_START.md                           # This file
```

## Troubleshooting

### "Scrapers return no results"
1. Check if websites changed structure
2. Look at console logs for errors
3. Test with longer timeout
4. Try alternate selectors

### "Emails not sending"
1. Verify EMAIL_USER and EMAIL_PASS
2. Use app-specific password (Gmail)
3. Check SMTP port not blocked
4. Test with sendTestEmail()

### "Cron not running on Vercel"
1. Verify CRON_SECRET is set in Vercel env vars
2. Check deployment succeeded
3. Ensure Vercel plan supports cron
4. View logs in Vercel dashboard

### "Out of memory"
1. Reduce items per scraper (10-15 max)
2. Add delays between operations
3. Process in smaller batches
4. Upgrade Vercel plan if needed

## Production Checklist

- [ ] Set all environment variables in Vercel
- [ ] Configure CRON_SECRET
- [ ] Set up email credentials
- [ ] Test both cron jobs manually
- [ ] Verify email delivery
- [ ] Check database writes
- [ ] Monitor first automated run
- [ ] Review logs for errors
- [ ] Set up uptime monitoring (optional)

## Monitoring

### View Logs
```bash
# Real-time
vercel logs --follow

# Specific function
vercel logs api/cron/discover
```

### Check Cron Status
Vercel Dashboard > Deployments > Functions > Cron

### Database Health
```sql
SELECT
  (SELECT COUNT(*) FROM tools) as tools,
  (SELECT COUNT(*) FROM reviews) as reviews,
  (SELECT COUNT(*) FROM scraped_sources WHERE status = 'pending') as pending;
```

## Customization

### Change Cron Schedule
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
1. Create file in `src/utils/scrapers/your-scraper.ts`
2. Export `scrapeSiteName()` function
3. Add to `scraperSources` in `index.ts`
4. Deploy

### Customize Email Templates
Edit `src/lib/email.ts` - modify HTML in email functions

### Modify Review Templates
Edit `src/utils/generators/content.ts` - update generation functions

## Resources

- [Full Documentation](./AUTOMATION.md)
- [Implementation Summary](./AUTOMATION_SUMMARY.md)
- [Vercel Cron Docs](https://vercel.com/docs/cron-jobs)
- [Supabase Docs](https://supabase.com/docs)
- [Zod Validation](https://zod.dev)

## Getting Help

1. Check logs in Vercel dashboard
2. Review email error notifications
3. Test components individually
4. Check database for expected data
5. Verify environment variables

## Success Metrics

After 1 week, you should see:
- 50-100 tools discovered
- 10-20 tools published
- 10-20 reviews generated
- Daily email digests
- 0 critical errors

## Next Steps

1. ✅ Complete setup (above)
2. Monitor first week
3. Review and approve tools
4. Customize templates
5. Add more scrapers (optional)
6. Set up analytics
7. Scale as needed

---

**Need more details?** See [AUTOMATION.md](./AUTOMATION.md) for comprehensive documentation.

**Ready to deploy?** Run `vercel` and set your environment variables!
