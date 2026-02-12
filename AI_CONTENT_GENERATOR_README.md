# AI Content Generation System

## Overview

This comprehensive AI-powered content generation system uses Claude AI (Anthropic's Claude Opus 4.6) to automatically generate high-quality, SEO-optimized blog posts and tool comparisons for ToolForge AI.

## Features

- **Automated Blog Post Generation**: Creates 1-2 blog posts daily about trending AI tools
- **Tool Comparison Articles**: Generates detailed comparison articles between similar tools
- **SEO Optimization**: Includes optimized titles, meta descriptions, keywords, and schema markup
- **Internal Linking**: Automatically adds links to tool pages within content
- **Affiliate Link Integration**: Seamlessly integrates affiliate links for monetization
- **Schema.org Markup**: Generates proper structured data for better search visibility
- **Smart Topic Selection**: Automatically selects trending topics and relevant tools

## System Components

### 1. AI Content Generator Library (`src/lib/ai-content-generator.ts`)

Core library that handles all AI content generation using Claude API.

#### Key Functions:

- **`generateBlogPost(options)`**: Generate a comprehensive blog post
- **`generateToolComparison(toolIds)`**: Create detailed tool comparison articles
- **`generateToolReview(tool)`**: Generate in-depth tool reviews
- **`saveGeneratedBlogPost(content, status)`**: Save generated content to database
- **`selectRandomTopic()`**: Pick a random trending topic

#### Features:

- Uses Claude Opus 4.6 model for highest quality content
- Generates 1500-2000 word articles
- Includes proper markdown formatting with H2/H3 headings
- Creates SEO-optimized titles and meta descriptions
- Generates 5-7 relevant keywords per article
- Adds Schema.org markup for SEO
- Automatically links to internal tool pages

### 2. Cron Job API Route (`src/app/api/cron/generate-content/route.ts`)

Automated daily content generation endpoint.

#### Schedule:

Runs daily at 2:00 PM UTC (configured in `vercel.json`)

#### Behavior:

- **70% chance**: Generates 1-2 blog posts about trending tools
- **30% chance**: Generates a tool comparison article
- Automatically publishes content (can be changed to draft)
- Includes error handling and notifications
- Rate-limited to avoid API overuse

#### Security:

Protected by `CRON_SECRET` environment variable (Bearer token authentication)

## Setup Instructions

### 1. Install Dependencies

The Anthropic SDK has already been installed:

```bash
npm install @anthropic-ai/sdk
```

### 2. Configure Environment Variables

Add your Anthropic API key to `.env.local`:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Get your API key:**
1. Sign up at https://console.anthropic.com/
2. Navigate to API Keys section
3. Create a new API key
4. Copy and paste into `.env.local`

### 3. Deploy to Vercel

The cron job is already configured in `vercel.json`:

```json
{
  "path": "/api/cron/generate-content",
  "schedule": "0 14 * * *"
}
```

This runs daily at 2:00 PM UTC.

**To change the schedule**, modify the cron expression:
- `0 14 * * *` - Daily at 2:00 PM UTC
- `0 */6 * * *` - Every 6 hours
- `0 10,14 * * *` - Twice daily at 10:00 AM and 2:00 PM UTC

### 4. Verify Setup

After deployment, test the endpoint manually:

```bash
curl -X POST https://your-site.vercel.app/api/cron/generate-content \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Usage

### Automatic Generation (via Cron)

Content is automatically generated daily. No manual intervention required.

### Manual Generation

Trigger content generation manually via API:

```bash
# Using curl
curl -X POST https://your-site.vercel.app/api/cron/generate-content \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Using JavaScript
fetch('/api/cron/generate-content', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.CRON_SECRET}`
  }
})
```

### Programmatic Generation

Use the library directly in your code:

```typescript
import { generateBlogPost, saveGeneratedBlogPost } from '@/lib/ai-content-generator';

// Generate a blog post about specific tools
const content = await generateBlogPost({
  topic: 'Best AI writing tools for 2026',
  keywords: ['AI writing', 'content creation', 'productivity'],
  category: 'Writing Tools',
  includeAffiliate: true,
});

// Save to database
const postId = await saveGeneratedBlogPost(content, 'published');
```

## Content Generation Examples

### Blog Post Topics

The system randomly selects from topics like:

- Best AI tools for content creation in 2026
- Top AI productivity tools for remote teams
- AI tools revolutionizing digital marketing
- Best AI writing assistants compared
- AI image generation tools for designers
- AI coding assistants that boost developer productivity
- AI video editing tools for content creators
- Best AI chatbots for customer service
- AI tools for data analysis and visualization

### Generated Content Structure

Each generated article includes:

1. **Introduction**: Engaging opener with context
2. **Main Content**: Detailed information about each tool
3. **Feature Highlights**: Key features and benefits
4. **Use Cases**: Practical applications
5. **Comparisons**: Tool-to-tool comparisons when relevant
6. **Conclusion**: Summary and call-to-action

### SEO Components

- **Title**: Catchy, keyword-rich (60 chars max)
- **SEO Title**: Search-optimized variant
- **Meta Description**: Compelling summary (150-160 chars)
- **Keywords**: 5-7 relevant keywords
- **Schema Markup**: Structured data for search engines
- **Internal Links**: Links to tool pages
- **Headings**: Proper H2/H3 structure

## Customization

### Adjust Content Length

In `src/lib/ai-content-generator.ts`, modify the prompt:

```typescript
// Change "1500-2000 words" to your preferred length
content: "Comprehensive article (2000-3000 words)"
```

### Change Generation Frequency

In `src/app/api/cron/generate-content/route.ts`:

```typescript
// Change from 1-2 posts to 2-3 posts
const postCount = Math.random() < 0.5 ? 2 : 3;
```

### Modify Topic Selection

Add/remove topics in `selectRandomTopic()` function:

```typescript
const topics = [
  'your custom topic here',
  'another topic',
  // ...
];
```

### Control Comparison Frequency

Adjust the probability in the cron job:

```typescript
// Change from 30% to 50% comparisons
const shouldGenerateComparison = Math.random() < 0.5;
```

## Affiliate Link Integration

The system automatically integrates affiliate links:

1. **Link Replacement**: Replaces tool website URLs with affiliate links
2. **UTM Parameters**: Adds tracking parameters to affiliate links
3. **Internal Links Preserved**: Keeps internal tool page links intact

### Affiliate Link Format

```
https://tool-website.com?ref=toolforge&utm_source=toolforge&utm_medium=blog&utm_campaign=tool-slug
```

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Retries with exponential backoff
- **Invalid Responses**: Validates Claude's JSON output
- **Database Errors**: Logs and continues processing
- **Email Notifications**: Sends alerts on critical failures

### Error Notifications

Failed generations trigger email notifications to admin (via existing email system).

## Monitoring

### Check Generation Status

View cron job logs in Vercel dashboard:
1. Go to your Vercel project
2. Navigate to "Logs"
3. Filter by `/api/cron/generate-content`

### Database Monitoring

Generated posts are saved to `blog_posts` table with status `published`.

Query recent posts:

```sql
SELECT id, title, created_at, views
FROM blog_posts
WHERE author = 'ToolForge AI'
ORDER BY created_at DESC
LIMIT 10;
```

## Cost Estimation

### Anthropic API Costs

Claude Opus 4.6 pricing (as of 2026):
- Input: ~$15 per million tokens
- Output: ~$75 per million tokens

**Estimated cost per article:**
- Average input: ~2,000 tokens (~$0.03)
- Average output: ~3,000 tokens (~$0.225)
- **Total per article: ~$0.255**

**Monthly costs (2 posts/day):**
- 60 posts/month × $0.255 = **~$15.30/month**

### ROI Considerations

With proper SEO and affiliate integration, each article can generate:
- Organic traffic: 100-500+ monthly visitors
- Affiliate conversions: 1-5% conversion rate
- Revenue per conversion: $10-50+

**Break-even**: 1-2 conversions per month covers API costs

## Best Practices

1. **Review Generated Content**: While high quality, always review before publishing
2. **Add Images**: Claude doesn't generate images - add manually or via image AI
3. **Update Topics**: Regularly refresh topic list for current trends
4. **Monitor Performance**: Track which topics/tools perform best
5. **A/B Test**: Try different content styles and formats
6. **Optimize Keywords**: Adjust based on search console data
7. **Internal Linking**: Ensure links point to correct tool pages
8. **Affiliate Compliance**: Follow FTC guidelines and disclose affiliate relationships

## Troubleshooting

### Issue: No content being generated

**Solutions:**
- Check `ANTHROPIC_API_KEY` is set correctly
- Verify cron job is running (check Vercel logs)
- Ensure `CRON_SECRET` matches in environment

### Issue: Poor quality content

**Solutions:**
- Update prompts in `ai-content-generator.ts`
- Increase `max_tokens` for longer responses
- Adjust `temperature` (lower = more focused, higher = more creative)

### Issue: Duplicate content

**Solutions:**
- System checks for existing slugs before saving
- Manually review generated posts
- Add more topic variety

### Issue: API rate limits

**Solutions:**
- Reduce generation frequency
- Add delays between API calls
- Upgrade Anthropic API plan

## Security

- **Cron Secret**: All cron endpoints protected by Bearer token
- **API Key**: Stored securely in environment variables
- **Input Validation**: Content validated before database insertion
- **SQL Injection**: Using Supabase parameterized queries

## Future Enhancements

Potential improvements:

1. **AI Image Generation**: Integrate DALL-E or Midjourney for featured images
2. **Multi-language Support**: Generate content in multiple languages
3. **Content Calendar**: Plan topics in advance
4. **A/B Testing**: Generate multiple versions and test performance
5. **Voice/Tone Customization**: Different writing styles per category
6. **Social Media Integration**: Auto-post to Twitter, LinkedIn
7. **Newsletter Integration**: Include in weekly newsletters
8. **Analytics Dashboard**: Track AI content performance metrics

## Support

For issues or questions:
- Check Vercel deployment logs
- Review Anthropic API status: https://status.anthropic.com/
- Check Supabase status: https://status.supabase.com/

## License

Part of ToolForge AI platform. All rights reserved.

---

**Last Updated**: February 12, 2026
**Version**: 1.0.0
