# SEO Quick Reference Guide

## Quick Links

- **Sitemap:** https://toolforge.ai/sitemap.xml
- **Robots.txt:** https://toolforge.ai/robots.txt
- **RSS Feed:** https://toolforge.ai/rss.xml
- **OG Image Generator:** https://toolforge.ai/api/og?title=YourTitle

## Files Created

### Core SEO Utilities
```
/src/utils/seo.ts                          # SEO helper functions
/src/components/shared/JsonLd.tsx          # Structured data component
/src/components/shared/ShareButtons.tsx    # Social share buttons
```

### SEO Routes
```
/src/app/sitemap.ts                        # Dynamic sitemap
/src/app/robots.txt/route.ts               # Robots.txt
/src/app/rss.xml/route.ts                  # RSS feed
/src/app/api/og/route.tsx                  # OG image generation
```

### Updated Pages
```
/src/app/page.tsx                          # Homepage (Organization schema)
/src/app/tools/[slug]/page.tsx             # Tool pages (Product + Review schema)
/src/app/category/[slug]/page.tsx          # Category pages (ItemList schema)
```

## Common Tasks

### Add Structured Data to a Page

```tsx
import JsonLd from '@/components/shared/JsonLd';
import { generateProductSchema } from '@/utils/seo';

export default function Page() {
  const schema = generateProductSchema(tool);

  return (
    <>
      <JsonLd data={schema} />
      {/* Your content */}
    </>
  );
}
```

### Add Share Buttons

```tsx
import ShareButtons from '@/components/shared/ShareButtons';

<ShareButtons
  url="https://toolforge.ai/tools/chatgpt"
  title="ChatGPT - AI Chatbot"
  description="Powerful AI assistant for conversations"
/>
```

### Generate Meta Tags

```tsx
import { generateToolMetadata } from '@/utils/seo';

export async function generateMetadata({ params }) {
  const tool = await getTool(params.slug);
  return generateToolMetadata(tool, review);
}
```

### Generate OG Image URL

```tsx
import { generateOgImageUrl } from '@/utils/seo';

const ogImage = generateOgImageUrl({
  title: 'ChatGPT',
  category: 'Chat',
  rating: 4.8,
});
```

## Schema Types Available

### Organization Schema
```tsx
import { generateOrganizationSchema } from '@/utils/seo';
const schema = generateOrganizationSchema();
```

### Product Schema (Tools)
```tsx
import { generateProductSchema } from '@/utils/seo';
const schema = generateProductSchema(tool);
```

### Review Schema
```tsx
import { generateReviewSchema } from '@/utils/seo';
const schema = generateReviewSchema(tool, review);
```

### Breadcrumb Schema
```tsx
import { generateBreadcrumbSchema } from '@/utils/seo';
const schema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://toolforge.ai' },
  { name: 'Tools', url: 'https://toolforge.ai/tools' },
]);
```

### ItemList Schema (Categories)
```tsx
import { generateItemListSchema } from '@/utils/seo';
const schema = generateItemListSchema(tools, category, url);
```

## Testing Commands

### Test Sitemap
```bash
curl https://toolforge.ai/sitemap.xml | head -50
```

### Test Robots.txt
```bash
curl https://toolforge.ai/robots.txt
```

### Test RSS Feed
```bash
curl https://toolforge.ai/rss.xml | head -100
```

### Test OG Image
```bash
# In browser:
https://toolforge.ai/api/og?title=Test&category=Writing&rating=4.5
```

## Validation Tools

### Structured Data
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/

### Open Graph
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

### SEO General
- Google Search Console: https://search.google.com/search-console
- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse: Chrome DevTools > Lighthouse tab

## Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://toolforge.ai
```

## Social Share URLs

### Twitter
```
https://twitter.com/intent/tweet?url={url}&text={title}&via=toolforgeai
```

### LinkedIn
```
https://www.linkedin.com/sharing/share-offsite/?url={url}
```

### Facebook
```
https://www.facebook.com/sharer/sharer.php?u={url}
```

## Helper Functions

### Extract Keywords
```tsx
import { extractKeywords } from '@/utils/seo';
const keywords = extractKeywords(content, 10);
```

### Generate Canonical URL
```tsx
import { generateCanonicalUrl } from '@/utils/seo';
const canonical = generateCanonicalUrl('/tools/chatgpt');
```

### Generate Share URL
```tsx
import { generateShareUrl } from '@/utils/seo';
const twitterUrl = generateShareUrl('twitter', {
  url: 'https://toolforge.ai/tools/chatgpt',
  title: 'Check out ChatGPT',
  description: 'Amazing AI tool',
});
```

### Calculate Reading Time
```tsx
import { getReadingTime } from '@/utils/seo';
const minutes = getReadingTime(content);
```

## Troubleshooting

### OG Images not showing
1. Check `@vercel/og` is installed: `npm list @vercel/og`
2. Verify Edge runtime is supported
3. Test directly: `/api/og?title=Test`

### Structured data errors
1. Validate with Google Rich Results Test
2. Check console for JSON-LD errors
3. Verify all required fields are present

### Share buttons not working
1. Check URL encoding
2. Verify client component ('use client')
3. Test in different browsers

### Sitemap empty
1. Check Supabase connection
2. Verify published tools exist
3. Check console logs for errors

## Performance Tips

1. **Cache OG images** at CDN level
2. **Use ISR** for sitemap on large sites
3. **Optimize structured data** - only include necessary fields
4. **Lazy load** share buttons below fold
5. **Monitor** sitemap size (max 50k URLs per file)

## Monitoring Checklist

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor indexing status weekly
- [ ] Check for crawl errors monthly
- [ ] Validate structured data quarterly
- [ ] Test social sharing monthly
- [ ] Review Core Web Vitals monthly
- [ ] Update meta descriptions for low CTR pages

## Best Practices

1. **Unique titles** for every page
2. **Compelling descriptions** (150-160 characters)
3. **Relevant keywords** in titles, headings, content
4. **Fast page loads** (< 2 seconds)
5. **Mobile-first** design
6. **Internal linking** between related content
7. **Regular updates** to keep content fresh
8. **Quality backlinks** from reputable sources

## Next Steps

After implementation:
1. Submit sitemap to search engines
2. Set up Google Search Console
3. Set up Bing Webmaster Tools
4. Monitor indexing and performance
5. Optimize based on data
6. Build content strategy
7. Acquire quality backlinks
8. Monitor competitors

## Support Resources

- Full documentation: `/SEO_IMPLEMENTATION.md`
- Next.js SEO: https://nextjs.org/learn/seo
- Google Search Central: https://developers.google.com/search
- Schema.org: https://schema.org/

---

**Last Updated:** 2026-02-11
**Version:** 1.0.0
