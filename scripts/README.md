# ToolForge AI - Database Seeding Scripts

This directory contains scripts to populate your ToolForge AI database with real AI tools and quality reviews.

## Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run the complete seeding process
npm run seed
```

That's it! The seeder will:
1. Check your environment configuration
2. Verify database connection
3. Seed categories (10 categories)
4. Seed tools (91+ real AI tools)
5. Seed reviews (8+ quality reviews for top tools)
6. Update category counts

## What Gets Seeded

### Categories (10)
- Writing Tools
- Image Generators
- Video Tools
- Coding Assistants
- Chatbots
- Productivity Tools
- Marketing Tools
- Design Tools
- Audio & Music Tools
- Research Tools

### Tools (91+)
Real AI tools across all categories including:

**Writing (15 tools):**
- ChatGPT, Claude, Jasper AI, Copy.ai, Writesonic, Grammarly, QuillBot, and more

**Image Generation (15 tools):**
- Midjourney, DALL-E 3, Stable Diffusion, Leonardo.ai, Ideogram, and more

**Video (10 tools):**
- Runway, Pika, Synthesia, HeyGen, Descript, and more

**Code (10 tools):**
- GitHub Copilot, Cursor, Codeium, Tabnine, and more

**Chat (8 tools):**
- Gemini, Perplexity, Character.AI, Pi, and more

**Productivity (10 tools):**
- Motion, Otter.ai, Fireflies.ai, Superhuman, and more

**Marketing (8 tools):**
- AdCreative.ai, Brand24, and more

**Design (8 tools):**
- Uizard, Galileo AI, Remove.bg, Canva AI, and more

**Audio (8 tools):**
- ElevenLabs, Murf AI, Speechify, Suno, and more

**Research (8 tools):**
- Consensus, Elicit, Scite, Semantic Scholar, and more

### Reviews (8+)
Comprehensive, SEO-optimized reviews for top tools:
- ChatGPT
- Midjourney
- GitHub Copilot
- Jasper AI
- Runway
- Cursor
- ElevenLabs
- Perplexity AI

Each review includes:
- Detailed analysis (800-1200 words)
- Pros and cons
- Use cases and applications
- Performance evaluation
- Final verdict
- SEO metadata
- Estimated read time

## Script Details

### `run-seed.ts` (Master Script)
The main orchestrator that runs all seeding steps.

**Features:**
- Environment validation
- Database connection check
- Existing data detection
- User confirmation prompts
- Progress reporting
- Error handling

**Usage:**
```bash
npm run seed
```

### `seed-tools.ts`
Populates the database with 91+ real AI tools.

**Features:**
- Real tool data (names, descriptions, features)
- Actual affiliate link patterns
- Realistic pricing information
- Proper categorization
- Logo URLs (using brandfetch CDN)
- Tags and features
- Ratings and review counts
- Skips existing tools (idempotent)

**Usage:**
```bash
npm run seed:tools
```

### `seed-reviews.ts`
Creates quality reviews for top tools.

**Features:**
- Comprehensive review content
- SEO optimization
- Pros/cons analysis
- Calculated read time
- Published status
- Keywords and metadata
- Skips existing reviews (idempotent)

**Usage:**
```bash
npm run seed:reviews
```

## Requirements

### Environment Variables
Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Schema
Ensure you've run the database schema first:

1. Go to your Supabase project
2. Open SQL Editor
3. Run the contents of `supabase-schema.sql`

## Safety Features

### Idempotent Operations
All seed scripts check for existing data before inserting:
- Won't duplicate tools with the same slug
- Won't create duplicate reviews for the same tool
- Won't overwrite existing categories

### User Confirmation
The master script prompts for confirmation if existing data is detected:
```
⚠️  Warning: Database already contains data!
   The seeder will skip existing items but may add new ones.

Do you want to continue? (y/n):
```

### Error Handling
- Validates environment variables before starting
- Tests database connection
- Continues on individual item failures
- Reports success/failure counts
- Clear error messages

## Customization

### Adding More Tools
Edit `seed-tools.ts` and add tools to the `tools` array:

```typescript
{
  slug: 'your-tool',
  name: 'Your Tool Name',
  tagline: 'Short tagline',
  description: 'Detailed description...',
  category: 'writing', // or image, video, etc.
  website_url: 'https://example.com',
  affiliate_link: 'https://toolforge.ai/go/your-tool',
  logo_url: 'https://cdn.brandfetch.io/example.com/w/400/h/400',
  pricing_model: 'freemium', // free, freemium, paid
  starting_price: '$10/month',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  tags: ['tag1', 'tag2', 'tag3'],
  rating: 4.5,
  review_count: 1000,
  is_featured: false,
  status: 'published',
  published_at: new Date().toISOString(),
}
```

### Adding More Reviews
Edit `seed-reviews.ts` and add reviews to the `reviewTemplates` array:

```typescript
{
  toolSlug: 'your-tool', // Must match a tool slug
  title: 'Your Tool Review 2026: Complete Analysis',
  content: 'Full review content in markdown...',
  prosHtml: '<ul><li>Pro 1</li><li>Pro 2</li></ul>',
  consHtml: '<ul><li>Con 1</li><li>Con 2</li></ul>',
  verdict: 'Final verdict paragraph...',
  rating: 4.5,
}
```

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists
- Check variable names match exactly
- Restart your terminal/IDE after creating `.env.local`

### "Failed to connect to Supabase"
- Verify your Supabase URL and keys are correct
- Check if your Supabase project is active
- Ensure database schema has been set up

### "Tool not found" in review seeding
- The tool slug in the review must match an existing tool
- Run `seed:tools` before `seed:reviews`
- Check for typos in the toolSlug field

### Partial Seeding
If seeding stops mid-way:
- The script is idempotent - just run it again
- Already-seeded items will be skipped
- Only missing items will be added

## Output Example

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              ToolForge AI - Database Seeder               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

============================================================
Environment Check
============================================================

✅ Environment variables configured
   Supabase URL: https://your-project.supabase.co

============================================================
Database Connection Check
============================================================

✅ Successfully connected to Supabase

============================================================
Checking Existing Data
============================================================

📊 Current database state:
   - Categories: 10
   - Tools: 0
   - Reviews: 0

============================================================
Seeding Categories
============================================================

✅ Created category: AI Writing Tools
✅ Created category: AI Image Generators
...

============================================================
Seeding Tools
============================================================

✅ Seeded: ChatGPT (writing)
✅ Seeded: Midjourney (image)
...

✅ Seeding complete!
   - Success: 91 tools
   - Errors: 0 tools
   - Total: 91 tools

============================================================
Seeding Reviews
============================================================

✅ Created review: ChatGPT Review 2026: Is OpenAI's AI Worth It?
...

✅ Review seeding complete!
   - Success: 8 reviews
   - Errors: 0 reviews
   - Total: 8 reviews

============================================================
Seeding Complete! 🎉
============================================================

Final database state:
   📁 Categories: 10
   🔧 Tools: 91
   📝 Reviews: 8

🎯 Next steps:
   1. Run "npm run dev" to start the development server
   2. Visit http://localhost:3000 to see your seeded data
   3. Check the admin dashboard to manage your tools

✨ Happy building!
```

## Next Steps After Seeding

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **View Your Data:**
   - Homepage: http://localhost:3000
   - Category pages: http://localhost:3000/category/writing
   - Tool pages: http://localhost:3000/tools/chatgpt
   - Review pages: http://localhost:3000/reviews/chatgpt

3. **Admin Dashboard:**
   - Access at: http://localhost:3000/admin
   - Manage tools, reviews, and content

4. **Customize:**
   - Update affiliate links with your actual links
   - Add more tools for your niche
   - Create more reviews
   - Adjust pricing and features

## Production Deployment

Before deploying to production:

1. **Update Affiliate Links:**
   - Replace placeholder affiliate links with real ones
   - Test link tracking

2. **Review Content:**
   - Verify all tool information is accurate
   - Update pricing if needed
   - Check logos load correctly

3. **SEO Check:**
   - Ensure reviews have proper meta tags
   - Verify sitemap generation
   - Test structured data

4. **Analytics:**
   - Set up click tracking
   - Configure analytics
   - Test conversion tracking

## Support

For issues or questions:
1. Check the main README.md
2. Review TROUBLESHOOTING.md
3. Check Supabase logs
4. Verify environment variables

## License

Part of ToolForge AI - See main LICENSE file.
