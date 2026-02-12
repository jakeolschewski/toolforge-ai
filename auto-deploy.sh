#!/bin/bash

echo "🚀 ToolForge AI - Fully Automated Deployment"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check Vercel login
echo -e "${BLUE}📋 Step 1: Vercel Authentication${NC}"
if vercel whoami > /dev/null 2>&1; then
    VERCEL_USER=$(vercel whoami 2>&1 | tail -1)
    echo -e "${GREEN}✅ Logged in as: $VERCEL_USER${NC}"
else
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo "Opening browser for authentication..."
    vercel login
    echo ""
fi

# Step 2: Deploy to Vercel
echo ""
echo -e "${BLUE}📋 Step 2: Deploying to Vercel${NC}"
echo "This will take 2-3 minutes..."
echo ""

DEPLOYMENT_OUTPUT=$(vercel --prod --yes 2>&1)
DEPLOYMENT_URL=$(echo "$DEPLOYMENT_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "$DEPLOYMENT_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Deployed to: $DEPLOYMENT_URL${NC}"
echo ""

# Step 3: Supabase Setup
echo -e "${BLUE}📋 Step 3: Supabase Setup${NC}"
echo ""
echo "Opening Supabase in your browser..."
sleep 2
open "https://supabase.com/dashboard/projects"

echo ""
echo "Please complete these steps in Supabase:"
echo "1. Click '+ New Project'"
echo "2. Name: toolforge-ai"
echo "3. Generate & save database password"
echo "4. Region: Choose closest to you"
echo "5. Click 'Create new project'"
echo "6. Wait 2-3 minutes for provisioning"
echo ""
read -p "Press ENTER when your Supabase project is ready..."

echo ""
echo "Now let's get your credentials:"
echo "In Supabase: Settings → API"
echo ""

read -p "Enter your Supabase Project URL: " SUPABASE_URL
read -p "Enter your Supabase anon public key: " SUPABASE_ANON_KEY  
read -p "Enter your Supabase service_role key: " SUPABASE_SERVICE_KEY

# Step 4: Set passwords
echo ""
echo -e "${BLUE}📋 Step 4: Set Passwords${NC}"
read -s -p "Set Admin Password (for /admin): " ADMIN_PASSWORD
echo ""
read -s -p "Set Owner Password (for /owner financial dashboard): " OWNER_PASSWORD
echo ""

# Generate cron secret
CRON_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Step 5: Set environment variables in Vercel
echo ""
echo -e "${BLUE}📋 Step 5: Configuring Vercel Environment Variables${NC}"

echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production > /dev/null 2>&1
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production > /dev/null 2>&1
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production > /dev/null 2>&1
echo "$ADMIN_PASSWORD" | vercel env add ADMIN_PASSWORD production > /dev/null 2>&1
echo "$OWNER_PASSWORD" | vercel env add OWNER_PASSWORD production > /dev/null 2>&1
echo "$CRON_SECRET" | vercel env add CRON_SECRET production > /dev/null 2>&1
echo "$DEPLOYMENT_URL" | vercel env add NEXT_PUBLIC_SITE_URL production > /dev/null 2>&1
echo "ToolForge AI" | vercel env add NEXT_PUBLIC_SITE_NAME production > /dev/null 2>&1

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Step 6: Run database migration
echo ""
echo -e "${BLUE}📋 Step 6: Database Migration${NC}"
echo "Opening Supabase SQL Editor..."
sleep 1
open "https://supabase.com/dashboard/project/_/sql"

echo ""
echo "In the SQL Editor:"
echo "1. Click '+ New query'"
echo "2. Copy ALL contents from: supabase-schema.sql"
echo "3. Paste into the editor"
echo "4. Click 'Run' (or Cmd+Enter)"
echo ""
read -p "Press ENTER when migration is complete..."

# Additional migrations
echo "Running additional migrations..."
echo "1. Copy from: prisma/migrations/001_owner_financial_tables.sql"
read -p "Press ENTER when done..."

echo "2. Copy from: prisma/migrations/002_blog_comparison_collections.sql"  
read -p "Press ENTER when done..."

echo -e "${GREEN}✅ Database migrations complete${NC}"

# Step 7: Create .env.local
echo ""
echo -e "${BLUE}📋 Step 7: Creating Local Environment File${NC}"

cat > .env.local << ENV_EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Admin & Owner
ADMIN_PASSWORD=$ADMIN_PASSWORD
OWNER_PASSWORD=$OWNER_PASSWORD

# Cron
CRON_SECRET=$CRON_SECRET

# Site
NEXT_PUBLIC_SITE_URL=$DEPLOYMENT_URL
NEXT_PUBLIC_SITE_NAME=ToolForge AI
ENV_EOF

echo -e "${GREEN}✅ .env.local created${NC}"

# Step 8: Seed database
echo ""
echo -e "${BLUE}📋 Step 8: Seeding Database with 91+ AI Tools${NC}"
npm run seed

echo -e "${GREEN}✅ Database seeded!${NC}"

# Step 9: Redeploy with environment variables
echo ""
echo -e "${BLUE}📋 Step 9: Final Deployment with All Settings${NC}"
vercel --prod --yes > /dev/null 2>&1

echo -e "${GREEN}✅ Final deployment complete!${NC}"

# Final summary
echo ""
echo "🎉 ================================================"
echo "   DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""
echo -e "${GREEN}Your Site:${NC}     $DEPLOYMENT_URL"
echo -e "${GREEN}Admin:${NC}         $DEPLOYMENT_URL/admin"
echo -e "${GREEN}Owner:${NC}         $DEPLOYMENT_URL/owner"
echo ""
echo -e "${BLUE}Credentials:${NC}"
echo "  Admin Password: $ADMIN_PASSWORD"
echo "  Owner Password: $OWNER_PASSWORD"
echo ""
echo -e "${YELLOW}⚠️  Save these passwords securely!${NC}"
echo ""
echo "Next steps:"
echo "1. Visit your site and explore"
echo "2. Apply to affiliate programs (see AFFILIATE_PROGRAMS.md)"
echo "3. Write your first blog post"
echo "4. Start making money!"
echo ""
echo "Documentation: 🚀_START_HERE.md"
echo ""
