#!/bin/bash

echo "🚀 ToolForge AI - Deploy to Vercel"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please run ./setup-credentials.sh first"
    exit 1
fi

# Source environment variables
source .env.local

echo "📦 Step 1: Deploying to Vercel..."
echo ""

# Deploy to Vercel
vercel --yes

# Get the deployment URL
DEPLOYMENT_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*' | head -1)

echo ""
echo "✅ Deployed to Vercel!"
echo "🌐 Your site: $DEPLOYMENT_URL"
echo ""

echo "📝 Step 2: Setting environment variables in Vercel..."
echo ""

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$NEXT_PUBLIC_SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_ROLE_KEY"
vercel env add ADMIN_PASSWORD production <<< "$ADMIN_PASSWORD"
vercel env add OWNER_PASSWORD production <<< "$OWNER_PASSWORD"
vercel env add CRON_SECRET production <<< "$CRON_SECRET"
vercel env add NEXT_PUBLIC_SITE_URL production <<< "$DEPLOYMENT_URL"
vercel env add NEXT_PUBLIC_SITE_NAME production <<< "ToolForge AI"

echo ""
echo "✅ Environment variables set!"
echo ""
echo "🔄 Step 3: Redeploying with environment variables..."
echo ""

# Redeploy with environment variables
vercel --prod --yes

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📋 Your URLs:"
echo "   🏠 Homepage: $DEPLOYMENT_URL"
echo "   👤 Admin: $DEPLOYMENT_URL/admin"
echo "   💰 Owner Dashboard: $DEPLOYMENT_URL/owner"
echo ""
echo "Next steps:"
echo "1. Visit Supabase and run the database migration"
echo "2. Run: npm run seed (to add 91+ tools)"
echo "3. Visit your site and explore!"
echo ""
