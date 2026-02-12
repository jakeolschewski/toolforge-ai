# Seed Data Verification Checklist

Use this checklist to verify your database seeding was successful.

## Pre-Seed Checklist

- [ ] Supabase project created
- [ ] Database schema applied (`supabase-schema.sql` run in SQL Editor)
- [ ] `.env.local` file created with correct credentials
- [ ] `npm install` completed successfully
- [ ] `tsx` package installed (check `node_modules/tsx` exists)

## Run Seeder

```bash
npm run seed
```

## Post-Seed Verification

### 1. Script Execution
- [ ] Script completed without fatal errors
- [ ] Saw "Seeding Complete! 🎉" message
- [ ] Final counts displayed:
  - [ ] Categories: 10
  - [ ] Tools: 91+
  - [ ] Reviews: 8+

### 2. Database Verification (Supabase Dashboard)

**Categories Table:**
- [ ] Navigate to Supabase > Table Editor > categories
- [ ] Verify 10 rows exist
- [ ] Check sample category has:
  - [ ] `slug` (e.g., 'writing')
  - [ ] `name` (e.g., 'AI Writing Tools')
  - [ ] `description` populated
  - [ ] `icon` set
  - [ ] `order` number
  - [ ] `tool_count` updated (should be > 0 for populated categories)

**Tools Table:**
- [ ] Navigate to Supabase > Table Editor > tools
- [ ] Verify 91+ rows exist
- [ ] Check sample tool (e.g., ChatGPT) has:
  - [ ] `id` (UUID)
  - [ ] `slug` (e.g., 'chatgpt')
  - [ ] `name` (e.g., 'ChatGPT')
  - [ ] `tagline` populated
  - [ ] `description` populated
  - [ ] `category` set (e.g., 'writing')
  - [ ] `website_url` valid URL
  - [ ] `affiliate_link` set
  - [ ] `logo_url` set
  - [ ] `pricing_model` (free/freemium/paid)
  - [ ] `starting_price` populated
  - [ ] `features` array has items
  - [ ] `tags` array has items
  - [ ] `rating` between 4.0-5.0
  - [ ] `review_count` > 0
  - [ ] `status` = 'published'
  - [ ] `published_at` set

**Reviews Table:**
- [ ] Navigate to Supabase > Table Editor > reviews
- [ ] Verify 8+ rows exist
- [ ] Check sample review (e.g., ChatGPT) has:
  - [ ] `id` (UUID)
  - [ ] `tool_id` (valid UUID linking to tool)
  - [ ] `title` populated
  - [ ] `content` is long (800-1200 words)
  - [ ] `pros_html` has HTML list
  - [ ] `cons_html` has HTML list
  - [ ] `verdict` paragraph
  - [ ] `rating` set
  - [ ] `author` = 'ToolForge Team'
  - [ ] `status` = 'published'
  - [ ] `seo_title` populated
  - [ ] `seo_description` populated
  - [ ] `keywords` array has items
  - [ ] `read_time` > 0
  - [ ] `published_at` set

### 3. Application Verification (Frontend)

**Start Dev Server:**
```bash
npm run dev
```

**Homepage (http://localhost:3000):**
- [ ] Page loads without errors
- [ ] Featured tools display
- [ ] Category cards show correct counts
- [ ] Tool cards have logos
- [ ] Tool ratings visible

**Category Page (http://localhost:3000/category/writing):**
- [ ] Writing category page loads
- [ ] Shows ~15 tools
- [ ] Tool cards display correctly
- [ ] Filters work (if implemented)
- [ ] Pagination works (if needed)

**Tool Page (http://localhost:3000/tools/chatgpt):**
- [ ] ChatGPT tool page loads
- [ ] Name, tagline display
- [ ] Description shows
- [ ] Features list displays
- [ ] Tags visible
- [ ] Pricing information shown
- [ ] Rating displayed
- [ ] "Visit Website" button works
- [ ] Related review link shows

**Review Page (http://localhost:3000/reviews/chatgpt):**
- [ ] ChatGPT review page loads
- [ ] Title displays
- [ ] Full review content shows
- [ ] Pros/cons lists display
- [ ] Verdict paragraph visible
- [ ] Rating shown
- [ ] Author displayed
- [ ] Read time shown
- [ ] Link back to tool works

**Search (if implemented):**
- [ ] Search for "ChatGPT" returns results
- [ ] Search for "image" returns image tools
- [ ] Search works across categories

**Admin Dashboard (http://localhost:3000/admin):**
- [ ] Can view all tools
- [ ] Can view all reviews
- [ ] Category counts correct
- [ ] Can edit a tool
- [ ] Can edit a review

### 4. Data Quality Checks

**Tool Data:**
- [ ] No Lorem Ipsum placeholder text
- [ ] All URLs are valid format (https://)
- [ ] Pricing follows consistent format
- [ ] Ratings are realistic (4.0-5.0)
- [ ] Features are actual features, not placeholders
- [ ] Tags are relevant
- [ ] Categories match category slugs

**Review Data:**
- [ ] Reviews are complete (no truncated content)
- [ ] Pros/cons are meaningful
- [ ] Verdicts are substantive
- [ ] SEO metadata present
- [ ] Keywords relevant to tool

**Cross-References:**
- [ ] All reviews link to existing tools
- [ ] Tool review counts match actual reviews
- [ ] Category tool counts match actual tools
- [ ] No orphaned data

### 5. SEO Verification

**Meta Tags:**
- [ ] Tool pages have meta titles
- [ ] Tool pages have meta descriptions
- [ ] Review pages have SEO titles
- [ ] Review pages have SEO descriptions

**Structured Data:**
- [ ] Tool pages have proper schema (if implemented)
- [ ] Review pages have review schema (if implemented)

**URLs:**
- [ ] Clean, SEO-friendly URLs
- [ ] No duplicate content
- [ ] Proper canonical tags

### 6. Performance Checks

**Load Times:**
- [ ] Homepage loads in < 2 seconds
- [ ] Category pages load in < 2 seconds
- [ ] Tool pages load in < 2 seconds
- [ ] Review pages load in < 2 seconds

**Images:**
- [ ] Tool logos load correctly
- [ ] No broken image links
- [ ] Images are appropriately sized

### 7. Mobile Verification (Optional)

- [ ] Responsive layout works
- [ ] Tool cards display correctly on mobile
- [ ] Navigation works on mobile
- [ ] Touch interactions work

## Common Issues & Fixes

### Issue: Categories show 0 tool count
**Fix:** Run the master seed script again - it updates counts at the end

### Issue: Review says "Tool not found"
**Fix:** Ensure tools are seeded before reviews (use `npm run seed`, not individual scripts)

### Issue: Logos don't load
**Check:** Network tab for 404s - brandfetch URLs should work, but some may be missing

### Issue: Affiliate links don't work
**Note:** Placeholder links are intentional - update with real affiliate URLs

### Issue: Duplicate tools
**Check:** Scripts are idempotent - duplicates shouldn't occur unless slug matches

## Final Verification Commands

**Count Tools:**
```sql
SELECT COUNT(*) FROM tools WHERE status = 'published';
-- Should return 91+
```

**Count by Category:**
```sql
SELECT category, COUNT(*)
FROM tools
WHERE status = 'published'
GROUP BY category
ORDER BY category;
-- Should show distribution across 10 categories
```

**Count Reviews:**
```sql
SELECT COUNT(*) FROM reviews WHERE status = 'published';
-- Should return 8+
```

**Featured Tools:**
```sql
SELECT COUNT(*) FROM tools WHERE is_featured = true;
-- Should return 15-20
```

## Success Criteria

✅ **All checks passed above**
✅ **No console errors in browser**
✅ **No 404s on tool/review pages**
✅ **All images load**
✅ **Content is meaningful (no placeholders)**
✅ **Data relationships intact**

## If Issues Found

1. **Review Script Output:**
   - Check for error messages
   - Note which items failed

2. **Check Logs:**
   - Browser console errors
   - Network tab for failed requests
   - Supabase logs

3. **Re-run Seeder:**
   - Safe to run multiple times
   - Will skip existing items
   - Adds missing items

4. **Manual Inspection:**
   - Use Supabase Table Editor
   - Verify data structure
   - Check relationships

## Post-Verification Next Steps

Once all checks pass:

1. **Customize Affiliate Links**
   - Update in database or seed scripts
   - Test click tracking

2. **Add More Content**
   - Create additional reviews
   - Add niche-specific tools
   - Expand categories if needed

3. **Deploy to Production**
   - Follow DEPLOYMENT.md
   - Run seeder on production database
   - Verify in production environment

---

**Date Verified:** _______________
**Verified By:** _______________
**Issues Found:** _______________
**All Checks Passed:** ☐ Yes ☐ No
