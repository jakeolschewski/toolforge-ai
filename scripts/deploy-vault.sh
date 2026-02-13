#!/bin/bash

# Workflow Vault Deployment Script
# Automates the deployment of the complete Workflow Vault system

set -e  # Exit on error

echo "🚀 Starting Workflow Vault Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from project root${NC}"
    exit 1
fi

echo "📋 Pre-Deployment Checklist"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Function to check environment variable
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}✗${NC} $1 not set"
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 configured"
        return 0
    fi
}

# Check critical environment variables
echo ""
echo "Checking environment variables..."
ENV_OK=true

check_env "STRIPE_SECRET_KEY" || ENV_OK=false
check_env "STRIPE_PUBLISHABLE_KEY" || ENV_OK=false
check_env "STRIPE_VAULT_WEBHOOK_SECRET" || ENV_OK=false
check_env "BLOB_READ_WRITE_TOKEN" || ENV_OK=false
check_env "RESEND_API_KEY" || ENV_OK=false
check_env "NEXT_PUBLIC_APP_URL" || ENV_OK=false

if [ "$ENV_OK" = false ]; then
    echo ""
    echo -e "${RED}Missing required environment variables!${NC}"
    echo "See WORKFLOW_VAULT_ENV.md for setup instructions"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All environment variables configured${NC}"

# Check database connection
echo ""
echo "Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}✗ DATABASE_URL not set${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Database connection configured${NC}"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --silent

# Run TypeScript type check
echo ""
echo "🔍 Running type check..."
npm run type-check || {
    echo -e "${RED}Type check failed!${NC}"
    exit 1
}
echo -e "${GREEN}✓ Type check passed${NC}"

# Run linting
echo ""
echo "🧹 Running linter..."
npm run lint || {
    echo -e "${YELLOW}⚠️  Linting warnings detected${NC}"
}

# Build the application
echo ""
echo "🏗️  Building application..."
npm run build || {
    echo -e "${RED}Build failed!${NC}"
    exit 1
}
echo -e "${GREEN}✓ Build successful${NC}"

# Run database migration
echo ""
echo "📊 Checking database schema..."
read -p "Run database migration? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migration..."
    # Apply migration via Supabase
    # Note: You'll need to run this manually in Supabase SQL Editor
    echo -e "${YELLOW}⚠️  Manual step required:${NC}"
    echo "   1. Go to Supabase SQL Editor"
    echo "   2. Run: prisma/migrations/20250213_workflow_vault/migration.sql"
    echo ""
    read -p "Press enter when migration is complete..."
fi

# Test Stripe webhook endpoint
echo ""
echo "🔗 Testing Stripe webhook..."
WEBHOOK_URL="${NEXT_PUBLIC_APP_URL}/api/stripe/vault-webhook"
echo "Webhook URL: $WEBHOOK_URL"

# Verify Stripe webhooks are configured
echo -e "${YELLOW}⚠️  Manual verification required:${NC}"
echo "   1. Go to Stripe Dashboard → Developers → Webhooks"
echo "   2. Verify endpoint: $WEBHOOK_URL"
echo "   3. Confirm events are configured"
echo ""
read -p "Press enter when verified..."

# Upload workflow files (if in production)
echo ""
read -p "Upload workflow files to Vercel Blob? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Uploading workflow files..."
    npm run upload:workflows || {
        echo -e "${YELLOW}⚠️  Upload failed or not configured${NC}"
    }
fi

# Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
read -p "Deploy to production? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod || {
        echo -e "${RED}Deployment failed!${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Deployed to production${NC}"
else
    echo "Deployment skipped"
fi

# Post-deployment verification
echo ""
echo "✅ Post-Deployment Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test endpoints
echo ""
echo "Testing critical endpoints..."

# Test health check
curl -s "${NEXT_PUBLIC_APP_URL}/api/health" > /dev/null && \
    echo -e "${GREEN}✓${NC} Health check passed" || \
    echo -e "${RED}✗${NC} Health check failed"

# Test vault API
curl -s "${NEXT_PUBLIC_APP_URL}/api/vault/workflows?limit=1" > /dev/null && \
    echo -e "${GREEN}✓${NC} Vault API responding" || \
    echo -e "${RED}✗${NC} Vault API failed"

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Your Workflow Vault is live at:"
echo "   ${NEXT_PUBLIC_APP_URL}/vault"
echo ""
echo "👤 Admin Dashboard:"
echo "   ${NEXT_PUBLIC_APP_URL}/admin/vault"
echo ""
echo "💳 Membership Pricing:"
echo "   ${NEXT_PUBLIC_APP_URL}/membership/pricing"
echo ""
echo "📊 Analytics:"
echo "   ${NEXT_PUBLIC_APP_URL}/admin/vault/analytics"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Test a complete purchase flow"
echo "2. Verify webhook delivery in Stripe Dashboard"
echo "3. Check email delivery"
echo "4. Monitor analytics for 24 hours"
echo "5. Announce the launch! 🚀"
echo ""
echo -e "${GREEN}Happy selling!${NC}"
