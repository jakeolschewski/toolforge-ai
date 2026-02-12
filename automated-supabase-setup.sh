#!/bin/bash

set -e

echo "🚀 FULLY AUTOMATED SUPABASE SETUP"
echo "===================================="
echo ""
echo "This will create your Supabase project via API!"
echo ""

# Step 1: Get Access Token
echo "📋 Step 1: Generate Access Token"
echo ""
echo "Opening Supabase token generation page..."
sleep 2
open "https://supabase.com/dashboard/account/tokens"
echo ""
echo "In the browser:"
echo "  1. Click 'Generate New Token'"
echo "  2. Name: 'ToolForge Setup'"
echo "  3. Click 'Generate token'"
echo "  4. COPY the token (you'll only see it once!)"
echo ""
read -p "Paste your access token here: " SUPABASE_TOKEN

# Step 2: Get Organization ID
echo ""
echo "📋 Step 2: Getting your organization ID..."
ORG_RESPONSE=$(curl -s https://api.supabase.com/v1/organizations \
  -H "Authorization: Bearer $SUPABASE_TOKEN")

ORG_ID=$(echo "$ORG_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ORG_ID" ]; then
    echo "❌ Failed to get organization ID. Response:"
    echo "$ORG_RESPONSE"
    exit 1
fi

ORG_NAME=$(echo "$ORG_RESPONSE" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Found organization: $ORG_NAME (ID: $ORG_ID)"

# Step 3: Generate secure database password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo ""
echo "📋 Step 3: Creating Supabase project..."
echo "   Name: toolforge-ai"
echo "   Region: us-east-1"
echo "   This will take 2-3 minutes..."
echo ""

# Create project
PROJECT_RESPONSE=$(curl -s -X POST https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer $SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"organization_id\": \"$ORG_ID\",
    \"name\": \"toolforge-ai\",
    \"region\": \"us-east-1\",
    \"db_pass\": \"$DB_PASSWORD\",
    \"plan\": \"free\"
  }")

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Failed to create project. Response:"
    echo "$PROJECT_RESPONSE"
    exit 1
fi

echo "✅ Project created! ID: $PROJECT_ID"
echo "   Waiting for provisioning (2-3 minutes)..."
echo ""

# Wait for project to be ready
for i in {1..60}; do
    STATUS=$(curl -s https://api.supabase.com/v1/projects/$PROJECT_ID \
        -H "Authorization: Bearer $SUPABASE_TOKEN" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

    if [ "$STATUS" = "ACTIVE_HEALTHY" ]; then
        echo "✅ Project is ready!"
        break
    fi

    echo -n "."
    sleep 3

    if [ $i -eq 60 ]; then
        echo ""
        echo "⚠️  Project is taking longer than expected. Check Supabase dashboard."
        echo "   Continuing anyway..."
    fi
done

echo ""
echo "📋 Step 4: Getting API credentials..."

# Get project details
PROJECT_DETAILS=$(curl -s https://api.supabase.com/v1/projects/$PROJECT_ID \
    -H "Authorization: Bearer $SUPABASE_TOKEN")

# Get API keys
API_KEYS=$(curl -s https://api.supabase.com/v1/projects/$PROJECT_ID/api-keys \
    -H "Authorization: Bearer $SUPABASE_TOKEN")

SUPABASE_URL=$(echo "$PROJECT_DETAILS" | grep -o '"endpoint":"[^"]*"' | cut -d'"' -f4)
ANON_KEY=$(echo "$API_KEYS" | grep -o '"anon":"[^"]*"' | cut -d'"' -f4)
SERVICE_KEY=$(echo "$API_KEYS" | grep -o '"service_role":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ] || [ -z "$SERVICE_KEY" ]; then
    echo "❌ Failed to get credentials"
    echo "Project Details: $PROJECT_DETAILS"
    echo "API Keys: $API_KEYS"
    exit 1
fi

echo "✅ Credentials retrieved!"
echo ""

# Step 5: Create .env.local
echo "📋 Step 5: Creating .env.local..."

cat > .env.local << ENV_FILE
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
ADMIN_PASSWORD=admin123
OWNER_PASSWORD=owner123
CRON_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
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

# Step 6: Run migrations
echo "📋 Step 6: Running database migrations..."
echo ""

# Install postgres client if needed for migrations
echo "Opening Supabase SQL Editor..."
sleep 1
open "https://supabase.com/dashboard/project/$PROJECT_ID/sql"

echo ""
echo "In the SQL Editor, run these 3 migrations (in order):"
echo ""
echo "  1. supabase-schema.sql"
echo "  2. prisma/migrations/001_owner_financial_tables.sql"
echo "  3. prisma/migrations/002_blog_comparison_collections.sql"
echo ""
echo "I'll open them in TextEdit for easy copying..."
sleep 2

open -a TextEdit supabase-schema.sql
sleep 1
echo "Migration 1/3 opened - Copy and paste into SQL Editor, click Run"
read -p "Press ENTER when migration 1 is complete..."

open -a TextEdit prisma/migrations/001_owner_financial_tables.sql
sleep 1
echo "Migration 2/3 opened - Copy and paste into SQL Editor, click Run"
read -p "Press ENTER when migration 2 is complete..."

open -a TextEdit prisma/migrations/002_blog_comparison_collections.sql
sleep 1
echo "Migration 3/3 opened - Copy and paste into SQL Editor, click Run"
read -p "Press ENTER when migration 3 is complete..."

echo ""
echo "✅ Migrations complete!"
echo ""

# Step 7: Seed database
echo "📋 Step 7: Seeding database with 91 AI tools..."
npm run seed

if [ $? -ne 0 ]; then
    echo "⚠️  Seeding encountered an issue. Check the output above."
else
    echo "✅ Database seeded successfully!"
fi

echo ""

# Step 8: Update Vercel environment variables
echo "📋 Step 8: Updating Vercel environment variables..."

echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --force > /dev/null 2>&1
echo "$ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --force > /dev/null 2>&1
echo "$SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --force > /dev/null 2>&1

echo "✅ Vercel environment variables updated!"
echo ""

# Step 9: Redeploy
echo "📋 Step 9: Redeploying to Vercel..."
vercel --prod --yes > /dev/null 2>&1

echo "✅ Deployment complete!"
echo ""

# Save credentials
cat > SUPABASE_CREDENTIALS.txt << CREDS
🎉 ToolForge AI - Supabase Setup Complete!
==========================================

Database Password: $DB_PASSWORD
Project ID: $PROJECT_ID
Project URL: $SUPABASE_URL

⚠️  SAVE THIS FILE SECURELY! ⚠️

Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID

Site Credentials:
- Admin: /admin (password: admin123)
- Owner: /owner (password: owner123)

⚠️  Change admin/owner passwords in Vercel before going live!

Your Site: https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app
CREDS

echo ""
echo "🎉 ================================================"
echo "   SETUP COMPLETE!"
echo "================================================"
echo ""
echo "✅ Supabase project created: toolforge-ai"
echo "✅ Database configured and seeded (91 tools)"
echo "✅ Vercel environment variables updated"
echo "✅ Site redeployed"
echo ""
echo "🌐 Your Site: https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"
echo ""
echo "📋 Credentials saved to: SUPABASE_CREDENTIALS.txt"
echo ""
echo "🚀 Next Steps:"
echo "   1. Visit your site and test all pages"
echo "   2. Change admin/owner passwords in Vercel settings"
echo "   3. Apply to affiliate programs (see AFFILIATE_PROGRAMS.md)"
echo "   4. Start creating content and making money!"
echo ""
