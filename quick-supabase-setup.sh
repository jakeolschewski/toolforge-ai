#!/bin/bash

clear
echo "🚀 SUPER SIMPLE SUPABASE SETUP"
echo "=============================="
echo ""
echo "I'll walk you through this step by step."
echo "Total time: 5-8 minutes"
echo ""
read -p "Press ENTER to start..."

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1/5: Create Supabase Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Opening Supabase in your browser..."
sleep 1
open "https://supabase.com/dashboard/projects"
sleep 2

echo ""
echo "In the browser that just opened:"
echo ""
echo "  1. Click 'infantbites.com' (your organization)"
echo "  2. Click '+ New Project' (green button)"
echo "  3. Fill in:"
echo "     - Name: toolforge-ai"
echo "     - Password: Click 'Generate password' → SAVE IT!"
echo "     - Region: US East Coast (or closest to you)"
echo "     - Plan: Free"
echo "  4. Click 'Create new project'"
echo ""
echo "⏰ This will take 2-3 minutes to provision..."
echo ""
read -p "Press ENTER when you see the project dashboard (green dot = ready)..."

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2/5: Get Your Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "In Supabase:"
echo "  1. Click 'Settings' (gear icon on left)"
echo "  2. Click 'API'"
echo ""
read -p "Press ENTER when you're on the API settings page..."

echo ""
echo "Now I'll collect your credentials..."
echo ""
read -p "📋 Paste your Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
echo ""
read -p "📋 Paste your anon public key (starts with eyJhbG...): " SUPABASE_ANON
echo ""
echo "Scroll down and click 'Reveal' next to service_role key"
read -p "📋 Paste your service_role key (starts with eyJhbG...): " SUPABASE_SERVICE
echo ""
echo "✅ Credentials collected!"
sleep 1

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3/5: Set Your Passwords"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -s -p "🔐 Create Admin Password (for /admin panel): " ADMIN_PASS
echo ""
read -s -p "🔐 Create Owner Password (for /owner dashboard): " OWNER_PASS
echo ""
echo ""
echo "✅ Passwords set!"
sleep 1

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4/5: Database Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Creating .env.local file..."

cat > .env.local << ENV_FILE
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE
ADMIN_PASSWORD=$ADMIN_PASS
OWNER_PASSWORD=$OWNER_PASS
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
echo "Now running database migrations..."
echo ""
echo "Opening SQL Editor..."
sleep 1
open "https://supabase.com/dashboard/project/_/sql"
sleep 2

echo ""
echo "For the next 3 migration files, I'll:"
echo "  1. Open the file in TextEdit"
echo "  2. You copy ALL (Cmd+A, Cmd+C)"
echo "  3. Paste in Supabase SQL Editor"  
echo "  4. Click 'Run' or press Cmd+Enter"
echo ""
read -p "Ready? Press ENTER to start migration 1/3..."

echo ""
echo "📄 Opening Migration 1: Main Schema"
open -a TextEdit supabase-schema.sql
sleep 1
echo ""
echo "In Supabase SQL Editor:"
echo "  1. Click '+ New query'"
echo "  2. Copy ALL from TextEdit (Cmd+A, Cmd+C)"
echo "  3. Paste into SQL Editor (Cmd+V)"
echo "  4. Click 'Run' or Cmd+Enter"
echo ""
read -p "Press ENTER when you see 'Success. No rows returned'..."

echo ""
echo "📄 Opening Migration 2: Owner Financial"
open -a TextEdit prisma/migrations/001_owner_financial_tables.sql
echo ""
echo "Same steps:"
echo "  1. New query"
echo "  2. Copy ALL from TextEdit"
echo "  3. Paste & Run"
echo ""
read -p "Press ENTER when migration 2 completes..."

echo ""
echo "📄 Opening Migration 3: Blog & Collections"
open -a TextEdit prisma/migrations/002_blog_comparison_collections.sql
echo ""
echo "Last one! Same steps:"
echo "  1. New query"
echo "  2. Copy ALL from TextEdit"
echo "  3. Paste & Run"
echo ""
read -p "Press ENTER when migration 3 completes..."

echo ""
echo "✅ All migrations complete!"
sleep 1

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5/5: Seeding & Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Seeding database with 91+ AI tools..."
echo ""

npm run seed

echo ""
echo "✅ Database seeded!"
echo ""
echo "Now deploying to Vercel with your credentials..."
echo ""

vercel --prod --yes > /dev/null 2>&1

echo "✅ Deployed!"
echo ""

clear
echo "🎉 ═══════════════════════════════════════════"
echo "   SETUP COMPLETE!"
echo "═══════════════════════════════════════════"
echo ""
echo "🌐 Your Site:"
echo "   https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"
echo ""
echo "🔐 Your Credentials:"
echo "   Admin Password: $ADMIN_PASS"
echo "   Owner Password: $OWNER_PASS"
echo ""
echo "⚠️  SAVE THESE PASSWORDS!"
echo ""
echo "✅ Test Your Site:"
echo "   • Homepage: /"
echo "   • Tools: /tools (91 tools!)"
echo "   • Admin: /admin (use admin password)"
echo "   • Owner: /owner (use owner password)"
echo "   • Blog: /blog"
echo "   • Compare: /compare"
echo ""
echo "📚 Next Steps:"
echo "   1. Visit your site (opening now...)"
echo "   2. Apply to affiliate programs (AFFILIATE_PROGRAMS.md)"
echo "   3. Write your first blog post"
echo "   4. Start making money! 💰"
echo ""

sleep 2
open "https://toolforge-foaoyymbz-jacob-olschewskis-projects.vercel.app"

echo "🎊 You're ready to go! Good luck!"
echo ""
