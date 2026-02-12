# SEO Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] Set `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Verify all environment variables are set in production
- [ ] Test build locally: `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Fix any ESLint warnings

### Dependencies
- [x] Install `@vercel/og` package (v0.6.8)
- [ ] Run `npm install` on production server
- [ ] Verify all packages installed correctly
- [ ] Check for security vulnerabilities: `npm audit`

### Testing Local Routes
- [ ] Test sitemap: `http://localhost:3000/sitemap.xml`
- [ ] Test robots.txt: `http://localhost:3000/robots.txt`
- [ ] Test RSS feed: `http://localhost:3000/rss.xml`
- [ ] Test OG image: `http://localhost:3000/api/og?title=Test`

### Page Testing
- [ ] Test homepage loads correctly
- [ ] Test tool detail pages show structured data
- [ ] Test category pages load correctly
- [ ] Test share buttons work on all pages
- [ ] Verify no console errors

### Code Quality
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Check responsive design

## Deployment Steps

### 1. Deploy to Production
- [ ] Push code to repository
- [ ] Deploy to Vercel/hosting platform
- [ ] Wait for deployment to complete
- [ ] Verify deployment succeeded
- [ ] Check deployment logs for errors

### 2. Verify Production URLs
- [ ] Visit: `https://toolforge.ai/sitemap.xml`
- [ ] Visit: `https://toolforge.ai/robots.txt`
- [ ] Visit: `https://toolforge.ai/rss.xml`
- [ ] Visit: `https://toolforge.ai/api/og?title=Test`
- [ ] All URLs should load correctly

### 3. Test Functionality
- [ ] Homepage loads and shows Organization schema
- [ ] Tool pages load with Product schema
- [ ] Category pages load with ItemList schema
- [ ] Share buttons work on all pages
- [ ] OG images generate correctly
- [ ] No 404 or 500 errors

## Post-Deployment Checklist

### Search Engine Submission

#### Google Search Console
- [ ] Add property for `https://toolforge.ai`
- [ ] Verify ownership (DNS, HTML file, or meta tag)
- [ ] Submit sitemap: `https://toolforge.ai/sitemap.xml`
- [ ] Request indexing for homepage
- [ ] Set up email alerts for issues

#### Bing Webmaster Tools
- [ ] Add site: `https://toolforge.ai`
- [ ] Verify ownership
- [ ] Submit sitemap: `https://toolforge.ai/sitemap.xml`
- [ ] Request indexing for homepage
- [ ] Enable crawl rate optimization

### Validation Testing

#### Structured Data
- [ ] Test homepage: [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test tool page: Paste URL and verify Product schema
- [ ] Test category page: Verify ItemList schema
- [ ] Fix any validation errors
- [ ] Test with [Schema.org Validator](https://validator.schema.org/)

#### Open Graph
- [ ] Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
  - [ ] Enter homepage URL
  - [ ] Enter sample tool URL
  - [ ] Verify images load correctly
  - [ ] Check title and description
  - [ ] Click "Scrape Again" to refresh cache

- [ ] Test with [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)
  - [ ] Test homepage
  - [ ] Test tool page
  - [ ] Verify preview looks professional

#### Twitter Cards
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
  - [ ] Test homepage
  - [ ] Test tool page
  - [ ] Verify card type is "summary_large_image"
  - [ ] Check image displays correctly

### Performance Testing

#### PageSpeed Insights
- [ ] Test homepage: [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Test tool page
- [ ] Test category page
- [ ] All scores should be > 80 (green)
- [ ] Core Web Vitals should pass

#### Lighthouse
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Performance score > 90
- [ ] Accessibility score > 95
- [ ] Best Practices score > 90
- [ ] SEO score = 100
- [ ] Fix any failing audits

### Monitoring Setup

#### Google Analytics 4
- [ ] Create GA4 property
- [ ] Install tracking code (if not already installed)
- [ ] Set up goals/conversions
- [ ] Test event tracking
- [ ] Verify data collection

#### Google Search Console
- [ ] Set up performance monitoring
- [ ] Enable email alerts
- [ ] Add team members
- [ ] Set up URL inspection
- [ ] Configure crawl rate

### Social Media Testing

#### Real Sharing Tests
- [ ] Share homepage on Twitter
- [ ] Share tool page on LinkedIn
- [ ] Share category page on Facebook
- [ ] Verify all previews look correct
- [ ] Verify all images load
- [ ] Check all links work

#### Analytics Event Tracking
- [ ] Click Twitter share button
- [ ] Click LinkedIn share button
- [ ] Click Facebook share button
- [ ] Click copy link button
- [ ] Verify events tracked in GA4

### RSS Feed Validation

#### Feed Validation
- [ ] Test with [W3C Feed Validator](https://validator.w3.org/feed/)
- [ ] Fix any validation errors
- [ ] Test feed in RSS reader (Feedly, etc.)
- [ ] Verify all tools display correctly
- [ ] Check images load in feed readers

#### Feed Submission
- [ ] Submit to Feedly
- [ ] Submit to Google News (if eligible)
- [ ] Add to website footer
- [ ] Promote on social media

## Week 1 Monitoring

### Daily Checks (Days 1-7)
- [ ] Day 1: Check Google Search Console for indexing
- [ ] Day 2: Monitor sitemap processing
- [ ] Day 3: Check for crawl errors
- [ ] Day 4: Review indexed pages count
- [ ] Day 5: Check OG image generation
- [ ] Day 6: Review social sharing metrics
- [ ] Day 7: First weekly performance review

### Weekly Checks
- [ ] Review indexed pages count
- [ ] Check for crawl errors
- [ ] Review search performance data
- [ ] Check Core Web Vitals
- [ ] Review social sharing metrics
- [ ] Check RSS feed subscribers

## Month 1 Checklist

### Analytics Review
- [ ] Review organic traffic growth
- [ ] Check keyword rankings
- [ ] Analyze click-through rates
- [ ] Review social referral traffic
- [ ] Check bounce rates
- [ ] Analyze time on page

### Technical Review
- [ ] Check for new crawl errors
- [ ] Review page load times
- [ ] Check Core Web Vitals
- [ ] Verify all structured data valid
- [ ] Test OG images still working
- [ ] Review sitemap coverage

### Content Optimization
- [ ] Identify low-performing pages
- [ ] Optimize meta descriptions
- [ ] Update underperforming titles
- [ ] Add internal links
- [ ] Create new content
- [ ] Update existing content

### Backlink Building
- [ ] Submit to AI tool directories
- [ ] Reach out to industry blogs
- [ ] Guest posting opportunities
- [ ] Partner with complementary sites
- [ ] Create shareable content

## Troubleshooting Guide

### Sitemap Issues
**Problem:** Sitemap not showing in Google Search Console
- [ ] Verify sitemap URL is correct
- [ ] Check robots.txt has sitemap reference
- [ ] Re-submit sitemap in Search Console
- [ ] Wait 24-48 hours for processing

### Structured Data Errors
**Problem:** Validation errors in Rich Results Test
- [ ] Copy error message
- [ ] Check JSON-LD syntax
- [ ] Verify all required fields present
- [ ] Test with Schema.org validator
- [ ] Fix and re-deploy

### OG Image Issues
**Problem:** OG images not displaying
- [ ] Test `/api/og` directly in browser
- [ ] Check Edge runtime logs
- [ ] Verify `@vercel/og` installed
- [ ] Clear Facebook/Twitter cache
- [ ] Re-scrape URL

### Share Button Issues
**Problem:** Share buttons not working
- [ ] Check browser console for errors
- [ ] Verify client component loaded
- [ ] Test URL encoding
- [ ] Check network tab for failed requests
- [ ] Test on different browsers

## Success Metrics Dashboard

Create a tracking sheet with these metrics:

### Week 1
- [ ] Indexed pages: ____ / expected
- [ ] Crawl errors: ____
- [ ] Avg. page load: ____ seconds
- [ ] Organic traffic: ____
- [ ] Social shares: ____

### Month 1
- [ ] Indexed pages: ____ / expected
- [ ] Total keywords ranking: ____
- [ ] Avg. position: ____
- [ ] Organic traffic growth: ____%
- [ ] CTR: ____%
- [ ] Social shares: ____
- [ ] Backlinks: ____

### Quarter 1
- [ ] Total indexed pages: ____
- [ ] Keywords in top 10: ____
- [ ] Organic traffic growth: ____%
- [ ] Conversion rate: ____%
- [ ] Social engagement: ____%
- [ ] Domain authority: ____

## Quick Reference

### Important URLs
```
Production Site:     https://toolforge.ai
Sitemap:            https://toolforge.ai/sitemap.xml
Robots:             https://toolforge.ai/robots.txt
RSS Feed:           https://toolforge.ai/rss.xml
OG Image Test:      https://toolforge.ai/api/og?title=Test
```

### Validation Tools
```
Google Rich Results:     https://search.google.com/test/rich-results
Facebook Debugger:       https://developers.facebook.com/tools/debug/
Twitter Validator:       https://cards-dev.twitter.com/validator
Schema Validator:        https://validator.schema.org/
Feed Validator:          https://validator.w3.org/feed/
PageSpeed Insights:      https://pagespeed.web.dev/
```

### Support Resources
```
Documentation:           /SEO_IMPLEMENTATION.md
Quick Reference:         /SEO_QUICK_REFERENCE.md
Summary:                /SEO_SUMMARY.md
This Checklist:         /SEO_DEPLOYMENT_CHECKLIST.md
```

## Notes

- Use this checklist for every deployment
- Check off items as you complete them
- Document any issues encountered
- Share results with team
- Update checklist based on learnings

## Sign-off

**Deployment Date:** _______________

**Deployed By:** _______________

**Verified By:** _______________

**All Checks Passed:** [ ] Yes / [ ] No

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

**Last Updated:** 2026-02-11
**Version:** 1.0.0
