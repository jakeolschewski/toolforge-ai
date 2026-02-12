#!/bin/bash

echo "🚀 ToolForge AI - Credential Setup Helper"
echo "=========================================="
echo ""

# Get Supabase URL
echo "📝 Step 1: Get your Supabase credentials"
echo ""
echo "In Supabase dashboard:"
echo "1. Click 'Settings' (gear icon)"
echo "2. Click 'API'"
echo "3. Copy your Project URL"
echo ""
read -p "Enter your Supabase Project URL: " SUPABASE_URL

echo ""
read -p "Enter your Supabase anon public key: " SUPABASE_ANON_KEY

echo ""
read -p "Enter your Supabase service_role key: " SUPABASE_SERVICE_ROLE_KEY

# Set passwords
echo ""
echo "📝 Step 2: Set your passwords"
echo ""
read -s -p "Enter Admin Password (for /admin access): " ADMIN_PASSWORD
echo ""
read -s -p "Enter Owner Password (for /owner financial dashboard): " OWNER_PASSWORD
echo ""

# Generate cron secret
CRON_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Create .env.local
cat > .env.local << ENV_EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Admin & Owner
ADMIN_PASSWORD=$ADMIN_PASSWORD
OWNER_PASSWORD=$OWNER_PASSWORD

# Cron Security
CRON_SECRET=$CRON_SECRET

# Site (will be updated after deployment)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=ToolForge AI

# Email (optional - configure later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@toolforge.ai
ENV_EOF

echo ""
echo "✅ Created .env.local file!"
echo ""
echo "📋 Your credentials have been saved."
echo ""
echo "🔑 Important - Save these for Vercel deployment:"
echo "   Admin Password: $ADMIN_PASSWORD"
echo "   Owner Password: $OWNER_PASSWORD"
echo "   Cron Secret: $CRON_SECRET"
echo ""
echo "Next: Run the database migration in Supabase"
