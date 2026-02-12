#!/bin/bash

# ToolForge AI - Quick Start Script
# This script helps you get started quickly

set -e

echo "🚀 ToolForge AI - Quick Start"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your actual values!"
    echo "   - Get Supabase credentials from https://supabase.com"
    echo "   - Set a strong ADMIN_PASSWORD"
    echo "   - Generate CRON_SECRET: openssl rand -base64 32"
    echo ""
    read -p "Press Enter when you've updated .env.local..."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed"
    echo ""
fi

# Check if Supabase URL is set
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
if [ "$SUPABASE_URL" = "your_supabase_project_url" ] || [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  WARNING: NEXT_PUBLIC_SUPABASE_URL not configured in .env.local"
    echo ""
    echo "📚 Next Steps:"
    echo "1. Create a Supabase project at https://supabase.com"
    echo "2. Go to Project Settings → API"
    echo "3. Copy your URL and keys to .env.local"
    echo "4. Run SQL from supabase-schema.sql in Supabase SQL Editor"
    echo "5. Run this script again or: npm run dev"
    echo ""
    exit 1
fi

echo "🎯 Environment configured!"
echo ""
echo "📋 Checklist:"
echo "  [x] Dependencies installed"
echo "  [x] Environment variables set"
echo "  [ ] Supabase schema executed (run supabase-schema.sql)"
echo "  [ ] Development server started"
echo ""
echo "🚀 Starting development server..."
echo "   Open http://localhost:3000 in your browser"
echo ""
echo "📚 Helpful commands:"
echo "   npm run dev       - Start development server"
echo "   npm run build     - Build for production"
echo "   npm run lint      - Run linter"
echo ""
echo "📖 Read SETUP.md for detailed instructions"
echo "📖 Read README.md for comprehensive documentation"
echo ""

npm run dev
