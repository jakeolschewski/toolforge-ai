#!/bin/bash

echo "🚀 ToolForge AI - Final Setup"
echo "=============================="
echo ""
echo "After creating your Supabase project, enter your 3 credentials:"
echo ""

read -p "Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Anon public key (eyJhbG...): " SUPABASE_ANON
read -p "Service role key (eyJhbG...): " SUPABASE_SERVICE

echo ""
echo "✅ Creating .env.local..."

cat > .env.local << ENV_FILE
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE
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
ENV_FILE

echo "✅ .env.local created!"
echo ""
echo "📋 Next: Run database migrations"
echo ""
echo "In Supabase SQL Editor, run these 3 files (in order):"
echo "  1. supabase-schema.sql (already open in TextEdit)"
echo "  2. prisma/migrations/001_owner_financial_tables.sql"
echo "  3. prisma/migrations/002_blog_comparison_collections.sql"
echo ""
read -p "Press ENTER when all 3 migrations are complete..."

echo ""
echo "🌱 Seeding database with 91 AI tools..."
npm run seed

echo ""
echo "📤 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "🎉 SETUP COMPLETE!"
echo ""
echo "Your site: https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"
echo ""
echo "Admin: /admin (password: admin123)"
echo "Owner: /owner (password: owner123)"
echo ""
echo "⚠️  Change these passwords in Vercel env vars before going live!"
echo ""
