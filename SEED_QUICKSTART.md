# ToolForge AI - Seed Data Quick Start

Get your ToolForge AI database populated with 91+ real AI tools and quality reviews in minutes.

## Prerequisites

1. **Supabase Project Setup**
   - Create a Supabase project at https://supabase.com
   - Run the database schema (`supabase-schema.sql` in SQL Editor)

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Run the Seeder

```bash
# Install dependencies (if not already done)
npm install

# Run the complete seed process
npm run seed
```

The seeder will:
1. ✅ Check environment configuration
2. ✅ Verify database connection
3. ✅ Seed 10 categories
4. ✅ Seed 91+ AI tools across all categories
5. ✅ Seed 8+ quality reviews for top tools
6. ✅ Update category tool counts

## What You Get

### 10 Categories
Writing, Image, Video, Code, Chat, Productivity, Marketing, Design, Audio, Research

### 91+ Real AI Tools
- **Writing (15):** ChatGPT, Claude, Jasper, Grammarly, QuillBot, etc.
- **Image (15):** Midjourney, DALL-E 3, Stable Diffusion, Leonardo.ai, etc.
- **Video (10):** Runway, Pika, Synthesia, HeyGen, Descript, etc.
- **Code (10):** GitHub Copilot, Cursor, Codeium, Tabnine, etc.
- **Chat (8):** Gemini, Perplexity, Character.AI, etc.
- **Productivity (10):** Motion, Otter.ai, Fireflies.ai, etc.
- **Marketing (8):** AdCreative.ai, Brand24, etc.
- **Design (8):** Uizard, Remove.bg, Canva AI, etc.
- **Audio (8):** ElevenLabs, Murf AI, Speechify, Suno, etc.
- **Research (8):** Consensus, Elicit, Scite, etc.

### 8+ Quality Reviews
Comprehensive, SEO-optimized reviews (800-1200 words each) for:
- ChatGPT
- Midjourney
- GitHub Copilot
- Jasper AI
- Runway
- Cursor
- ElevenLabs
- Perplexity AI

Each includes pros/cons, use cases, performance analysis, and verdict.

## Verify Your Data

```bash
# Start the dev server
npm run dev
```

Visit:
- **Homepage:** http://localhost:3000
- **Category Page:** http://localhost:3000/category/writing
- **Tool Page:** http://localhost:3000/tools/chatgpt
- **Review Page:** http://localhost:3000/reviews/chatgpt
- **Admin Dashboard:** http://localhost:3000/admin

## Customization

### Add More Tools
Edit `scripts/seed-tools.ts` and add to the `tools` array.

### Add More Reviews
Edit `scripts/seed-reviews.ts` and add to the `reviewTemplates` array.

### Run Individual Seeders
```bash
# Seed only tools
npm run seed:tools

# Seed only reviews
npm run seed:reviews
```

## Safety Features

- **Idempotent:** Safe to run multiple times (skips existing data)
- **Validation:** Checks environment and database connection
- **Confirmation:** Prompts before modifying existing data
- **Error Handling:** Continues on failures, reports status

## Common Issues

### Missing Environment Variables
```
❌ Missing required environment variables!
```
**Fix:** Create `.env.local` with your Supabase credentials

### Database Connection Failed
```
❌ Failed to connect to Supabase!
```
**Fix:**
1. Check your Supabase URL and keys
2. Ensure database schema is set up
3. Verify project is active

### Tool Not Found (Reviews)
```
⚠️  Tool not found: example-tool
```
**Fix:** Run `npm run seed:tools` first, then `npm run seed:reviews`

## Next Steps

1. **Customize Affiliate Links**
   - Update placeholder links in tool data
   - Format: `https://toolforge.ai/go/[slug]`

2. **Add Your Own Tools**
   - Use the seed scripts as templates
   - Add tools via admin dashboard or seed scripts

3. **Create More Reviews**
   - Follow the review template format
   - Use SEO best practices

4. **Deploy to Production**
   - See DEPLOYMENT.md for instructions
   - Update environment variables for production

## Production Ready

The seeded data is production-ready:
- ✅ Real tool information (verified 2026)
- ✅ Accurate pricing and features
- ✅ SEO-optimized content
- ✅ Professional reviews
- ✅ Proper categorization
- ✅ Rating and review counts

Just update affiliate links before launching!

## Need Help?

- **Full Documentation:** `scripts/README.md`
- **Troubleshooting:** TROUBLESHOOTING.md
- **Main README:** README.md

---

**Ready to seed your database? Run `npm run seed` now!**
