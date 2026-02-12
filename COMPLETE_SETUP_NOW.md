# Complete ToolForge AI Setup - 5 Minutes

Your site is deployed but needs Supabase to work. Follow these exact steps:

## Step 1: Create Supabase Project (2 min)

In the browser window I just opened (https://supabase.com/dashboard/projects):

1. Click your **infantbites.com** organization
2. Click **"+ New Project"** (green button)
3. Fill in:
   - **Name**: `toolforge-ai`
   - **Database Password**: Click **"Generate password"** → **COPY AND SAVE IT!**
   - **Region**: US East (or closest to you)
   - **Plan**: Free
4. Click **"Create new project"**
5. **Wait 2-3 minutes** for the green dot (project is ready)

## Step 2: Get Your 3 Credentials (1 min)

Once the green dot appears:

1. Click **"Settings"** (gear icon on left sidebar)
2. Click **"API"**
3. You'll see these three values - COPY THEM:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbG...` (long string)
   - **service_role**: Click **"Reveal"** first, then copy the `eyJhbG...` string

## Step 3: Run One Command (2 min)

Copy this entire command and paste into your terminal.
**Replace the YOUR_XXX placeholders with your actual values:**

```bash
cd /Volumes/JarvisSSD/toolforge-ai && \
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_PASSWORD=admin123
OWNER_PASSWORD=owner123
CRON_SECRET=eWLBXgGTFPnMxWTdH1MEuKr7Ejqa3baj
NEXT_PUBLIC_SITE_URL=https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app
NEXT_PUBLIC_SITE_NAME=ToolForge AI
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@toolforge.ai
EOF
```

## Step 4: Run Database Migrations (1 min)

In Supabase:

1. Click **"SQL Editor"** in left sidebar
2. Click **"+ New query"**
3. Copy ALL from this file and paste: `/Volumes/JarvisSSD/toolforge-ai/supabase-schema.sql`
4. Click **"Run"** (or Cmd+Enter)
5. Should see: ✅ "Success. No rows returned"

**Repeat for these two files:**
- `/Volumes/JarvisSSD/toolforge-ai/prisma/migrations/001_owner_financial_tables.sql`
- `/Volumes/JarvisSSD/toolforge-ai/prisma/migrations/002_blog_comparison_collections.sql`

## Step 5: Seed & Deploy (1 min)

In terminal:

```bash
npm run seed && \
vercel --prod --yes
```

## Done! 🎉

Visit: https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app

- **Admin**: /admin (password: admin123)
- **Owner**: /owner (password: owner123)
- **Tools**: /tools (91 AI tools!)

**Change your passwords in Vercel environment variables before going live!**
