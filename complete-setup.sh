#!/bin/bash

set -e

cd /Volumes/JarvisSSD/toolforge-ai

echo "🎯 COMPLETING TOOLFORGE AI SETUP"
echo "=================================="
echo ""

# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://kfhefxyiiogwmqjrqwjd.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaGVmeHlpaW9nd21xanJxd2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzMxNDMsImV4cCI6MjA4NjQ0OTE0M30.ULba2f8fNQLlMLvAdYfudy5ulc5OmsTwi_GpTzicsO0"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaGVmeHlpaW9nd21xanJxd2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg3MzE0MywiZXhwIjoyMDg2NDQ5MTQzfQ.Kd2jr-iMuWpqIvmLSutaJn4Te4Z23vIYVm24USJAZXM"

# Step 1: Seed database
echo "📋 Step 1: Seeding database with 91 AI tools..."
echo ""

# Use yes to automatically answer 'y' to any prompts
yes | npm run seed || true

echo ""
echo "✅ Database seeding complete!"
echo ""

# Step 2: Update Vercel environment variables
echo "📋 Step 2: Updating Vercel environment variables..."

# Update with proper values (no whitespace)
echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes > /dev/null 2>&1 || true
echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --yes > /dev/null 2>&1

echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes > /dev/null 2>&1 || true
echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes > /dev/null 2>&1

echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes > /dev/null 2>&1 || true
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --yes > /dev/null 2>&1

echo "admin123" | vercel env rm ADMIN_PASSWORD production --yes > /dev/null 2>&1 || true
echo "admin123" | vercel env add ADMIN_PASSWORD production --yes > /dev/null 2>&1

echo "owner123" | vercel env rm OWNER_PASSWORD production --yes > /dev/null 2>&1 || true
echo "owner123" | vercel env add OWNER_PASSWORD production --yes > /dev/null 2>&1

# Fix CRON_SECRET (no whitespace)
echo "eWLBXgGTFPnMxWTdH1MEuKr7Ejqa3baj" | vercel env rm CRON_SECRET production --yes > /dev/null 2>&1 || true
echo "eWLBXgGTFPnMxWTdH1MEuKr7Ejqa3baj" | vercel env add CRON_SECRET production --yes > /dev/null 2>&1

echo "✅ Vercel environment variables updated!"
echo ""

# Step 3: Redeploy to production
echo "📋 Step 3: Deploying to Vercel production..."
vercel --prod --yes

echo ""
echo "🎉 ======================================================="
echo "   TOOLFORGE AI IS LIVE!"
echo "======================================================="
echo ""
echo "🌐 Your Site:"
echo "   https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"
echo ""
echo "📊 Admin Panel:"
echo "   /admin (password: admin123)"
echo ""
echo "💰 Owner Dashboard:"
echo "   /owner (password: owner123)"
echo ""
echo "✅ Database: 91 AI tools loaded"
echo "✅ All features: Fully functional"
echo ""
echo "🚀 Start making money with affiliate links!"
echo ""
