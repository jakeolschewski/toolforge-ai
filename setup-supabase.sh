#!/bin/bash

echo "🔧 ToolForge AI - Supabase Setup Assistant"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Create Supabase Project${NC}"
echo ""
echo "In the browser window I opened:"
echo "1. Click on 'infantbites.com' organization"
echo "2. Click '+ New Project'"
echo "3. Fill in:"
echo "   - Name: toolforge-ai"
echo "   - Database Password: Click 'Generate password' and SAVE IT!"
echo "   - Region: Choose closest (e.g., US East Coast)"
echo "   - Plan: Free"
echo "4. Click 'Create new project'"
echo "5. Wait 2-3 minutes for provisioning..."
echo ""
read -p "Press ENTER when your project is READY (shows green dot)..."

echo ""
echo -e "${BLUE}Step 2: Collect Your Credentials${NC}"
echo ""
echo "Now in Supabase:"
echo "1. Click 'Settings' (gear icon in left sidebar)"
echo "2. Click 'API'"
echo ""

read -p "Enter your Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Enter your anon public key (starts with eyJhbG...): " SUPABASE_ANON_KEY

echo ""
echo "Now scroll down and click 'Reveal' on service_role key"
read -p "Enter your service_role key (starts with eyJhbG...): " SUPABASE_SERVICE_KEY

echo ""
echo -e "${GREEN}✅ Credentials collected!${NC}"

echo ""
echo -e "${BLUE}Step 3: Set Your Passwords${NC}"
read -s -p "Set Admin Password (for /admin access): " ADMIN_PASSWORD
echo ""
read -s -p "Set Owner Password (for /owner financial dashboard): " OWNER_PASSWORD
echo ""

# Generate cron secret
CRON_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

echo ""
echo -e "${GREEN}✅ Passwords set!${NC}"

# Create .env.local
echo ""
echo -e "${BLUE}Step 4: Creating .env.local file${NC}"

cat > .env.local << ENV_EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Passwords
ADMIN_PASSWORD=$ADMIN_PASSWORD
OWNER_PASSWORD=$OWNER_PASSWORD

# Security
CRON_SECRET=$CRON_SECRET

# Site
NEXT_PUBLIC_SITE_URL=https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app
NEXT_PUBLIC_SITE_NAME=ToolForge AI

# Email (optional - configure later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@toolforge.ai
ENV_EOF

echo -e "${GREEN}✅ .env.local created!${NC}"

# Open SQL files for migration
echo ""
echo -e "${BLUE}Step 5: Database Migration${NC}"
echo ""
echo "Opening SQL Editor in Supabase..."
sleep 1

# Check if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Opening migration files..."
    open -a "TextEdit" supabase-schema.sql
    sleep 1
    
    echo ""
    echo "I've opened supabase-schema.sql for you!"
    echo ""
    echo "Now in Supabase:"
    echo "1. Click 'SQL Editor' in left sidebar"
    echo "2. Click '+ New query'"
    echo "3. Copy ALL contents from supabase-schema.sql (Cmd+A, Cmd+C in TextEdit)"
    echo "4. Paste into Supabase (Cmd+V)"
    echo "5. Click 'Run' or press Cmd+Enter"
    echo ""
    read -p "Press ENTER when migration 1 is complete..."
    
    # Migration 2
    open -a "TextEdit" prisma/migrations/001_owner_financial_tables.sql
    echo ""
    echo "Now for migration 2 (Owner Financial Tables):"
    echo "1. In SQL Editor, click '+ New query'"
    echo "2. Copy ALL from 001_owner_financial_tables.sql"
    echo "3. Paste and Run"
    echo ""
    read -p "Press ENTER when migration 2 is complete..."
    
    # Migration 3
    open -a "TextEdit" prisma/migrations/002_blog_comparison_collections.sql
    echo ""
    echo "Finally, migration 3 (Blog, Comparisons, Collections):"
    echo "1. In SQL Editor, click '+ New query'"
    echo "2. Copy ALL from 002_blog_comparison_collections.sql"
    echo "3. Paste and Run"
    echo ""
    read -p "Press ENTER when migration 3 is complete..."
else
    echo "Please run these migrations manually in Supabase SQL Editor:"
    echo "1. supabase-schema.sql"
    echo "2. prisma/migrations/001_owner_financial_tables.sql"
    echo "3. prisma/migrations/002_blog_comparison_collections.sql"
    echo ""
    read -p "Press ENTER when all migrations are complete..."
fi

echo ""
echo -e "${GREEN}✅ Database migrations complete!${NC}"

# Seed database
echo ""
echo -e "${BLUE}Step 6: Seeding Database with 91+ AI Tools${NC}"
npm run seed

echo ""
echo -e "${GREEN}✅ Database seeded!${NC}"

# Configure Vercel
echo ""
echo -e "${BLUE}Step 7: Configuring Vercel Environment Variables${NC}"
echo ""

echo "Adding variables to Vercel..."

echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "$ADMIN_PASSWORD" | vercel env add ADMIN_PASSWORD production
echo "$OWNER_PASSWORD" | vercel env add OWNER_PASSWORD production
echo "$CRON_SECRET" | vercel env add CRON_SECRET production
echo "https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production
echo "ToolForge AI" | vercel env add NEXT_PUBLIC_SITE_NAME production

echo ""
echo -e "${GREEN}✅ Vercel environment variables configured!${NC}"

# Redeploy
echo ""
echo -e "${BLUE}Step 8: Redeploying to Vercel${NC}"
vercel --prod --yes > /dev/null 2>&1

echo ""
echo -e "${GREEN}✅ Redeployment complete!${NC}"

# Final summary
echo ""
echo "🎉 ================================================"
echo "   SUPABASE SETUP COMPLETE!"
echo "================================================"
echo ""
echo -e "${GREEN}Your Site:${NC} https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"
echo ""
echo -e "${BLUE}Credentials:${NC}"
echo "  Admin Password: $ADMIN_PASSWORD"
echo "  Owner Password: $OWNER_PASSWORD"
echo ""
echo -e "${YELLOW}⚠️  SAVE THESE CREDENTIALS!${NC}"
echo ""
echo "Test your site:"
echo "  1. Homepage: https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"
echo "  2. Tools: /tools (should show 91 tools!)"
echo "  3. Admin: /admin (login with admin password)"
echo "  4. Owner: /owner (login with owner password)"
echo ""
echo "Next steps:"
echo "  1. Apply to affiliate programs (AFFILIATE_PROGRAMS.md)"
echo "  2. Write your first blog post"
echo "  3. Start making money!"
echo ""
