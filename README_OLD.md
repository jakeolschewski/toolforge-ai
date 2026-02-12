# ToolForge AI - Evergreen AI Tools Affiliate Site

A self-sustaining, automated AI tools directory and review platform built with Next.js 15, Vercel, and Supabase.

## 🚀 Features

- **Automated Tool Discovery**: Daily cron job scrapes AI tools from multiple sources
- **Template-Based Content Generation**: Generates quality reviews without manual writing
- **Admin Dashboard**: Simple approval workflow for discovered tools
- **SEO Optimized**: Server-side rendering, meta tags, sitemaps
- **Affiliate Tracking**: Click logging and conversion tracking
- **Zero-Maintenance Design**: Runs autonomously after initial setup

## 📋 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (serverless + cron jobs)
- **Analytics**: Vercel Analytics + Speed Insights

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Vercel account (free tier works)
- Domain name (optional but recommended)

### 2. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and keys
3. Run the SQL schema in Supabase SQL Editor:

```bash
# Copy the contents of supabase-schema.sql and run in Supabase SQL Editor
```

4. Create the increment function:

```sql
CREATE OR REPLACE FUNCTION increment_tool_clicks(tool_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tools
  SET clicks = clicks + 1
  WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql;
```

### 3. Local Development

1. Clone and install:

```bash
cd /Volumes/JarvisSSD/toolforge-ai
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

3. Fill in your environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_PASSWORD=your_secure_password

# Cron Secret (generate random string)
CRON_SECRET=your_random_secret_string

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run development server:

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Vercel Deployment

1. Push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. Import project to Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy

3. Configure Cron Jobs:
   - Vercel automatically picks up `vercel.json` cron config
   - Daily discovery runs at 4:00 AM UTC
   - Monitor in Vercel Dashboard → Cron Jobs

### 5. Custom Domain (Optional)

1. Add your domain in Vercel project settings
2. Update DNS records as instructed
3. Update `NEXT_PUBLIC_SITE_URL` to your domain

## 📊 Workflow

### Automated Daily Flow

1. **4:00 AM UTC**: Cron job runs `/api/cron/discover`
2. Scrapes tools from Futurepedia, There's An AI For That, etc.
3. Saves new tools to `scraped_sources` table as "pending"
4. Sends notification (optional)

### Manual Approval Flow

1. Visit `/admin/dashboard`
2. Enter admin password
3. Review pending tools
4. Click "Approve" to:
   - Create tool entry
   - Auto-generate review using templates
   - Publish immediately
5. Or click "Ignore" to skip

### Content Generation

- Uses **template-based generation** by default (zero cost)
- Optional: Set `OPENAI_API_KEY` for AI-enhanced content
- Generates: title, content, pros/cons, verdict, SEO metadata

## 🔧 Customization

### Add More Scrapers

Create new scraper in `src/utils/scrapers/`:

```typescript
// src/utils/scrapers/newsource.ts
export async function scrapeNewSource(): Promise<ScraperResult[]> {
  // Implementation
}
```

Add to `src/utils/scrapers/index.ts`:

```typescript
import { scrapeNewSource } from './newsource';

export const scraperSources: ScraperSource[] = [
  // ...existing
  {
    name: 'New Source',
    scrape: scrapeNewSource,
    enabled: true,
  },
];
```

### Modify Content Templates

Edit `src/utils/generators/content.ts` to customize:
- Review structure
- Pros/cons logic
- Rating algorithm
- SEO metadata

### Add Affiliate Networks

Update tools with affiliate links:

```typescript
// In admin dashboard or directly in database
affiliate_link: 'https://partner.example.com/aff?ref=toolforge'
```

## 📈 SEO & Traffic

### On-Page SEO

- ✅ Semantic HTML
- ✅ Meta tags (title, description, OG, Twitter)
- ✅ Structured data (TODO: add JSON-LD)
- ✅ Fast loading (SSR + Edge CDN)
- ✅ Mobile responsive

### Content Strategy

- Target long-tail keywords: "[tool name] review 2026"
- Category pages for topical authority
- Regular updates via automation
- Internal linking structure

### Submit Sitemap

```bash
# Generate sitemap (TODO: implement /api/sitemap)
# Submit to:
# - Google Search Console
# - Bing Webmaster Tools
```

## 💰 Monetization

### 1. Affiliate Commissions

- Sign up for affiliate programs:
  - Jasper.ai
  - Copy.ai
  - Writesonic
  - Leonardo.ai
  - Individual tool programs
- Add affiliate links to tools
- Track via `/api/track/click`

### 2. Sponsored Listings (Future)

- Mark tools as `is_sponsored: true`
- Charge monthly fee for featured placement
- Implement via Stripe subscriptions

### 3. Premium Membership (Optional)

- Create gated content
- Early access to new tools
- Advanced filtering
- Comparison tools

## 🔐 Security

- ✅ Environment variables for secrets
- ✅ CRON_SECRET protects cron endpoints
- ✅ Admin password for dashboard
- ✅ Supabase RLS policies
- ✅ Rate limiting (Vercel built-in)
- ⚠️ Upgrade to NextAuth for production admin

## 📝 Legal

### Required Pages

1. **Privacy Policy** - Use https://termly.io or https://freeprivacypolicy.com
2. **Terms of Service** - Same generators
3. **Affiliate Disclosure** - Required by FTC

Example disclosure:

> "We may earn a commission when you purchase through links on our site. This comes at no extra cost to you and helps us keep this resource free."

### LLC Formation (Recommended)

- Register single-member LLC in your state
- Get EIN from IRS
- Separate business and personal finances

## 📊 Analytics & Monitoring

### Built-in Tracking

- Tool views (automatic)
- Affiliate clicks (via `/api/track/click`)
- User behavior (Vercel Analytics)
- Performance (Speed Insights)

### Optional Enhancements

- Google Analytics 4
- Plausible (privacy-focused)
- Hotjar (heatmaps)
- Mixpanel (events)

## 🐛 Troubleshooting

### Cron job not running

- Check Vercel Dashboard → Cron Jobs
- Verify `vercel.json` is in root
- Check function logs for errors
- Ensure `CRON_SECRET` is set

### Scrapers failing

- Check rate limits (add delays)
- Verify source website hasn't changed structure
- Update selectors in scraper files
- Check network/firewall issues

### Database errors

- Verify Supabase connection
- Check RLS policies
- Ensure schema is up to date
- Monitor Supabase dashboard for errors

## 🚀 Next Steps

### Phase 1: Launch (Week 1-2)

- [x] Deploy to Vercel
- [ ] Configure domain
- [ ] Set up Supabase
- [ ] Run first manual scrape
- [ ] Approve 30-50 initial tools
- [ ] Submit sitemap to Google

### Phase 2: Content (Week 3-8)

- [ ] Approve 10-20 tools daily
- [ ] Reach 300+ tools
- [ ] Monitor SEO rankings
- [ ] A/B test CTAs

### Phase 3: Monetization (Month 3+)

- [ ] Apply to affiliate programs
- [ ] Add affiliate links
- [ ] Track conversions
- [ ] Optimize for revenue

### Phase 4: Automation (Month 6+)

- [ ] Reduce manual approval to weekly
- [ ] Add more scrapers
- [ ] Implement auto-publishing for high-confidence tools
- [ ] Build email newsletter

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT License - feel free to use for your own projects

## 🤝 Contributing

This is a personal/commercial project, but feedback is welcome!

---

Built with ❤️ for passive income and automation
