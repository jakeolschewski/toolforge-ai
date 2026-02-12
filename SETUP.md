# ToolForge AI - Quick Setup Guide

Follow these steps to get your ToolForge AI site running locally and deployed to production.

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
cd /Volumes/JarvisSSD/toolforge-ai
npm install
```

### 2. Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Wait for it to initialize (~2 minutes)
3. Go to Project Settings → API
4. Copy your project URL and anon key
5. Copy your service role key (keep this secret!)

### 3. Run Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Open `supabase-schema.sql` from this project
3. Copy all the SQL
4. Paste into Supabase SQL Editor
5. Click "Run"
6. Verify tables were created (check Table Editor)

### 4. Configure Environment

```bash
# Create local environment file
cp .env.example .env.local

# Edit .env.local with your values
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ADMIN_PASSWORD=choose_strong_password
CRON_SECRET=generate_random_string_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 🚀 Deploy to Vercel (10 Minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial ToolForge AI setup"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
CRON_SECRET
NEXT_PUBLIC_SITE_URL (use your Vercel URL or custom domain)
```

### 4. Deploy

- Click "Deploy"
- Wait for build to complete (~2-3 minutes)
- Visit your live site!

## 📊 Initial Data Seeding (Optional)

### Option 1: Manual Entry

1. Go to `/admin/dashboard`
2. Enter your admin password
3. Wait for scrapers to run (or trigger manually)
4. Approve tools one by one

### Option 2: Bulk Import

Create a simple script to seed initial tools:

```typescript
// scripts/seed-tools.ts
import { supabaseAdmin } from '@/lib/supabase';

const initialTools = [
  {
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'AI chatbot by OpenAI',
    category: 'chat',
    website_url: 'https://chat.openai.com',
    pricing_model: 'freemium',
    status: 'published',
  },
  // Add more...
];

async function seed() {
  for (const tool of initialTools) {
    await supabaseAdmin.from('tools').insert(tool);
  }
}

seed();
```

## 🔧 Cron Job Setup

The cron job is configured in `vercel.json` and runs automatically on Vercel.

To test locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run local cron simulation
curl http://localhost:3000/api/cron/discover \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 📈 Next Steps

1. ✅ Verify site is running
2. ✅ Check admin dashboard works
3. ✅ Run first scraper (manually trigger)
4. ✅ Approve 10-20 initial tools
5. ✅ Submit sitemap to Google Search Console
6. ✅ Apply to affiliate programs
7. ✅ Add affiliate links to popular tools
8. ✅ Share on social media
9. ✅ Monitor analytics

## 🐛 Common Issues

### Build fails on Vercel

- Check all environment variables are set
- Verify no TypeScript errors: `npm run build` locally
- Check Vercel build logs for specific errors

### Cron job not running

- Ensure `vercel.json` is in root directory
- Check cron schedule syntax
- View logs in Vercel Dashboard → Cron Jobs
- Verify `CRON_SECRET` environment variable is set

### Database connection errors

- Double-check Supabase URL and keys
- Verify RLS policies are set correctly
- Check if Supabase project is paused (free tier auto-pauses)

### Scrapers returning empty results

- Source websites may have changed HTML structure
- Check rate limiting/blocking
- Add delays between requests
- Update selectors in scraper files

## 💡 Pro Tips

1. **Start small**: Approve 30-50 tools manually before relying on automation
2. **Monitor quality**: Check generated reviews regularly for first few weeks
3. **SEO takes time**: Expect 2-3 months before significant organic traffic
4. **Diversify traffic**: Share on Twitter, Reddit, Product Hunt
5. **Build email list**: Add newsletter signup for recurring visitors
6. **A/B test CTAs**: Optimize affiliate link conversion rates

## 📞 Support

- GitHub Issues: [Your repo issues URL]
- Email: support@toolforge.ai (if applicable)
- Docs: See README.md

---

Happy building! 🚀
