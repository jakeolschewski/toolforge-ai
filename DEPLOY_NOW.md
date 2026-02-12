# 🚀 ToolForge AI - Deploy to Vercel NOW

## Step-by-Step Deployment Guide

**Time Required**: 15-20 minutes  
**Difficulty**: Easy (follow each step)

---

## Part 1: Set Up Supabase (10 minutes)

### 1.1 Create Supabase Account

1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if required

### 1.2 Create New Project

1. Click "+ New Project"
2. Fill in details:
   - **Name**: `toolforge-ai` (or any name you prefer)
   - **Database Password**: Generate strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan**: Free (good for 50,000 rows, unlimited API requests)

3. Click "Create new project"
4. **Wait 2-3 minutes** for database to provision (get coffee ☕)

### 1.3 Get Your Credentials

Once your project is ready:

1. Click on "Settings" (gear icon in left sidebar)
2. Click "API" under Settings
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (long string)
   
4. **IMPORTANT**: Copy these somewhere safe! You'll need them in a moment.

5. Click "Database" under Settings
6. Scroll to "Connection string" section
7. Select "URI" tab
8. Copy the connection string (you'll see: `postgresql://postgres:[YOUR-PASSWORD]@...`)
9. Note: Replace `[YOUR-PASSWORD]` with the password from step 1.2

### 1.4 Run Database Migration

1. Click "SQL Editor" in left sidebar
2. Click "+ New query"
3. **Option A - Copy from file**: 
   - Open `/Volumes/JarvisSSD/toolforge-ai/supabase-schema.sql`
   - Copy ALL contents
   - Paste into Supabase SQL Editor
   
4. Click "Run" (or press Cmd+Enter)
5. You should see: "Success. No rows returned"

6. **Verify it worked**:
   - Click "Table Editor" in left sidebar
   - You should see tables: `tools`, `reviews`, `categories`, etc.
   - Click on `categories` - you should see 10 categories!

### 1.5 Run Additional Migrations (Owner Dashboard, Blog, etc.)

**Migration 1: Owner Financial Tables**
1. In SQL Editor, create new query
2. Open `/Volumes/JarvisSSD/toolforge-ai/prisma/migrations/001_owner_financial_tables.sql`
3. Copy and paste contents
4. Click "Run"

**Migration 2: Blog, Comparisons, Collections**
1. In SQL Editor, create new query
2. Open `/Volumes/JarvisSSD/toolforge-ai/prisma/migrations/002_blog_comparison_collections.sql`
3. Copy and paste contents
4. Click "Run"

**Done!** Your database is ready. ✅

---

## Part 2: Initialize Git Repository (2 minutes)

Open terminal and run:

```bash
cd /Volumes/JarvisSSD/toolforge-ai

# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit - ToolForge AI"

# Optional: Push to GitHub (recommended for backups)
# 1. Create repo on GitHub: https://github.com/new
# 2. Run these commands (replace with your repo URL):
# git remote add origin https://github.com/yourusername/toolforge-ai.git
# git branch -M main
# git push -u origin main
```

---

## Part 3: Deploy to Vercel (5 minutes)

### 3.1 Login to Vercel CLI

```bash
vercel login
```

Follow the prompts (it will open browser for authentication)

### 3.2 Deploy

```bash
vercel
```

You'll be asked several questions:

**Q: Set up and deploy?**  
A: `Y` (yes)

**Q: Which scope?**  
A: Select your account (use arrow keys, press Enter)

**Q: Link to existing project?**  
A: `N` (no, this is new)

**Q: What's your project's name?**  
A: `toolforge-ai` (or press Enter to use default)

**Q: In which directory is your code located?**  
A: `./` (press Enter)

**Q: Want to override the settings?**  
A: `N` (no, Next.js detected automatically)

**Wait 2-3 minutes...**

You'll get output like:
```
✅  Production: https://toolforge-ai-xxxxx.vercel.app
```

**Copy this URL!** This is your live site.

### 3.3 Set Environment Variables

Now you need to add your Supabase credentials:

```bash
# Add Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL

# When prompted:
# - Value: [paste your Supabase Project URL]
# - Environments: Select all (Production, Preview, Development)

# Add Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# When prompted:
# - Value: [paste your Supabase anon key]
# - Environments: Select all

# Add Supabase Service Role Key
# (Find this in Supabase: Settings > API > service_role key)
vercel env add SUPABASE_SERVICE_ROLE_KEY

# When prompted:
# - Value: [paste your service_role key]
# - Environments: Select all

# Add Admin Password
vercel env add ADMIN_PASSWORD

# When prompted:
# - Value: [type a secure password for admin access]
# - Environments: Select all

# Add Owner Password (different from admin!)
vercel env add OWNER_PASSWORD

# When prompted:
# - Value: [type a DIFFERENT secure password for owner/financial access]
# - Environments: Select all

# Add Cron Secret (for securing cron jobs)
vercel env add CRON_SECRET

# When prompted:
# - Value: [type a random string, e.g., "cr0n_s3cr3t_xyz123"]
# - Environments: Select all

# Add Site URL
vercel env add NEXT_PUBLIC_SITE_URL

# When prompted:
# - Value: https://toolforge-ai-xxxxx.vercel.app (your Vercel URL from above)
# - Environments: Select all

# Add Site Name
vercel env add NEXT_PUBLIC_SITE_NAME

# When prompted:
# - Value: ToolForge AI
# - Environments: Select all
```

### 3.4 Redeploy with Environment Variables

```bash
vercel --prod
```

This redeploys with your environment variables. Wait 2-3 minutes.

---

## Part 4: Seed the Database (3 minutes)

Now let's add the 91+ AI tools to your database!

### Option A: Remote Seeding (Recommended)

```bash
# Create .env.local with your Supabase credentials
cat > .env.local << 'ENV_EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_PASSWORD=your_admin_password
OWNER_PASSWORD=your_owner_password
CRON_SECRET=your_cron_secret
NEXT_PUBLIC_SITE_URL=https://toolforge-ai-xxxxx.vercel.app
NEXT_PUBLIC_SITE_NAME=ToolForge AI
ENV_EOF

# Edit the file and replace with your actual values
nano .env.local
# (Press Ctrl+X, then Y, then Enter to save)

# Run seed script
npm run seed
```

You should see:
```
✅ Categories seeded successfully
✅ Tools seeded successfully (91 tools)
✅ Reviews seeded successfully (8 reviews)
🎉 Database seeding complete!
```

---

## Part 5: Set Up Cron Jobs (2 minutes)

Vercel cron jobs are already configured in `vercel.json`, but you need to enable them:

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Click your project: `toolforge-ai`
3. Click "Settings" tab
4. Click "Cron Jobs" in left sidebar
5. You should see 2 cron jobs:
   - **Daily Discovery** (runs at 2 AM UTC)
   - **Daily Publishing** (runs at 10 AM UTC)
6. Both should show as "Enabled" ✅

**Test the cron jobs manually:**

```bash
# Test discovery (finds new tools)
curl -X GET "https://your-site.vercel.app/api/cron/discover" \
  -H "Authorization: Bearer your_cron_secret"

# Test publishing (publishes drafts)
curl -X GET "https://your-site.vercel.app/api/cron/publish-drafts" \
  -H "Authorization: Bearer your_cron_secret"
```

---

## Part 6: Verify Everything Works (3 minutes)

### 6.1 Test Public Pages

Visit your site:
```
https://toolforge-ai-xxxxx.vercel.app
```

Check these pages:
- ✅ Homepage - should show tools
- ✅ /tools - should list all 91 tools
- ✅ /tools/chatgpt - should show ChatGPT details
- ✅ /category/writing - should show writing tools
- ✅ /blog - blog listing
- ✅ /compare - comparisons
- ✅ /collections - collections

### 6.2 Test Admin Panel

Visit:
```
https://toolforge-ai-xxxxx.vercel.app/admin
```

- Login with your ADMIN_PASSWORD
- You should see dashboard with stats
- Check:
  - ✅ Drafts page
  - ✅ Tools page (can edit tools)
  - ✅ Reviews page
  - ✅ Analytics page

### 6.3 Test Owner Dashboard

Visit:
```
https://toolforge-ai-xxxxx.vercel.app/owner
```

- Login with your OWNER_PASSWORD (different from admin!)
- You should see financial dashboard
- Check:
  - ✅ Revenue page
  - ✅ Payouts page
  - ✅ Expenses page

### 6.4 Test Legal Pages

- ✅ /privacy - Privacy Policy
- ✅ /terms - Terms of Service
- ✅ /cookies - Cookie Policy
- ✅ /contact - Contact Form

---

## Part 7: Custom Domain (Optional, 5 minutes)

### 7.1 Add Domain in Vercel

1. Go to Vercel dashboard
2. Click your project
3. Click "Settings" → "Domains"
4. Click "Add"
5. Enter your domain: `toolforge.ai` (or whatever you bought)
6. Click "Add"

### 7.2 Configure DNS

Vercel will show you DNS records to add. Go to your domain registrar (Namecheap, Cloudflare, etc.) and add:

**For apex domain (toolforge.ai):**
- Type: A
- Name: @
- Value: 76.76.21.21

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

**Wait 5-60 minutes** for DNS to propagate.

Then update your environment variable:
```bash
vercel env add NEXT_PUBLIC_SITE_URL
# Value: https://toolforge.ai
```

Redeploy:
```bash
vercel --prod
```

---

## Part 8: Final Checklist

- [ ] Supabase project created
- [ ] Database migrations run (3 files)
- [ ] Git repository initialized
- [ ] Deployed to Vercel
- [ ] Environment variables set (8 variables)
- [ ] Database seeded (91+ tools)
- [ ] Cron jobs enabled
- [ ] Admin panel accessible
- [ ] Owner dashboard accessible
- [ ] All pages loading correctly
- [ ] Custom domain configured (optional)

---

## 🎉 YOU'RE LIVE!

Your site is now:
- ✅ Deployed to Vercel
- ✅ Connected to Supabase
- ✅ Seeded with 91+ tools
- ✅ Fully automated (cron jobs running)
- ✅ Ready to make money!

---

## Next Steps (Business Operations)

### Week 1:
1. ✅ Apply to 10 affiliate programs (see AFFILIATE_PROGRAMS.md)
2. ✅ Write 3 blog posts
3. ✅ Create 2 comparisons
4. ✅ Customize legal pages with your info
5. ✅ Submit sitemap to Google Search Console

### Week 2-4:
1. ✅ Publish 10-15 blog posts
2. ✅ Build 5-10 comparisons
3. ✅ Curate 10+ collections
4. ✅ Update tools with affiliate links
5. ✅ Monitor admin for new scraped tools

### Month 2-3:
1. ✅ Get first affiliate commission!
2. ✅ Track revenue in owner dashboard
3. ✅ Log expenses for tax time
4. ✅ Scale to 200+ tools
5. ✅ Optimize top performers

---

## Troubleshooting

**Problem**: "Build failed"  
**Solution**: Check Vercel logs, usually missing environment variable

**Problem**: "Database connection error"  
**Solution**: Verify Supabase credentials in Vercel env vars

**Problem**: "Cron jobs not running"  
**Solution**: Check Authorization header has correct CRON_SECRET

**Problem**: "Admin login doesn't work"  
**Solution**: Verify ADMIN_PASSWORD env var is set in Vercel

**Problem**: "Tools not showing"  
**Solution**: Run seed script: `npm run seed`

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Docs**: See TROUBLESHOOTING.md
- **Business Guide**: See BUSINESS_OPERATIONS.md

---

**🎊 Congratulations! Your automated AI tools business is LIVE! 🎊**

Start applying to affiliate programs and watch the revenue roll in!
