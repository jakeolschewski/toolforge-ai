# ToolForge AI - Monetization Infrastructure Guide

## Overview

This guide covers setting up and optimizing all revenue streams for ToolForge AI:
- **Affiliate commissions** (Primary revenue - $5k-30k+/month at scale)
- **Stripe membership** (Secondary - $500-2k/month)
- **Display ads** (Tertiary - $200-1k/month)

## 1. Affiliate Link Management

### Current Implementation

Affiliate links are stored in the database per tool:

```typescript
// In tools table
affiliate_link: string | null
```

### Setting Up Affiliate Links

**Option A: Direct Links (Simple)**
```sql
-- Update tool with direct affiliate link
UPDATE tools 
SET affiliate_link = 'https://partner.example.com/?ref=toolforge&utm_source=toolforge&utm_campaign=listing'
WHERE slug = 'chatgpt';
```

**Option B: Centralized Redirect (Recommended)**
```sql
-- Use your own redirect URLs
UPDATE tools 
SET affiliate_link = 'https://toolforge.ai/go/chatgpt'
WHERE slug = 'chatgpt';
```

Then create redirect API route:

```typescript
// src/app/go/[slug]/route.ts
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Track click
  await supabase.from('click_logs').insert({
    tool_id: toolId,
    referrer: request.headers.get('referer'),
    user_agent: request.headers.get('user-agent'),
  });

  // Redirect to affiliate link
  return NextResponse.redirect(affiliateLink);
}
```

### Affiliate Link Best Practices

1. **UTM Parameters** - Always add tracking:
   ```
   ?utm_source=toolforge&utm_medium=referral&utm_campaign=tool-listing
   ```

2. **Sub-IDs** - Use for detailed tracking:
   ```
   ?subid=tool-{tool_slug}_position-{position}_date-{date}
   ```

3. **Link Cloaking** - Use `/go/` redirects for:
   - Better click tracking
   - Link flexibility (change destination without updating DB)
   - Professional appearance

## 2. Click Tracking

### Already Implemented

Click tracking API route exists at `/src/app/api/track/click/route.ts`

### Usage

```typescript
// In ToolCard component
const handleCTAClick = async () => {
  await fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId: tool.id }),
  });
  
  window.open(tool.affiliate_link, '_blank');
};
```

### Analytics Dashboard

View click performance in `/admin/analytics`:
- Total clicks per tool
- Click-through rate (CTR)
- Conversion tracking (requires affiliate network integration)

## 3. Stripe Membership Setup

### Prerequisites

1. Create Stripe account: https://dashboard.stripe.com
2. Get API keys (Settings → API keys)
3. Add to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

### Create Products & Prices

```bash
# Using Stripe CLI
stripe products create \
  --name "ToolForge Pro" \
  --description "Premium AI tools database access"

stripe prices create \
  --product prod_xxx \
  --unit-amount 900 \
  --currency usd \
  --recurring interval=month
```

### Membership Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Basic tool listings, Limited filters |
| **Pro** | $9/mo | All tools, Advanced filters, Early access, Ad-free |
| **Premium** | $29/mo | Everything + API access, Custom reports, Priority support |

### Implementation Files to Create

**1. Stripe Client** (`src/lib/stripe.ts`):
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});
```

**2. Checkout API** (`src/app/api/stripe/checkout/route.ts`):
```typescript
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { priceId } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
```

**3. Webhook Handler** (`src/app/api/stripe/webhook/route.ts`):
```typescript
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      // Create user subscription
      break;
    case 'customer.subscription.updated':
      // Update subscription status
      break;
    case 'customer.subscription.deleted':
      // Cancel subscription
      break;
  }

  return NextResponse.json({ received: true });
}
```

**4. Pricing Page** (`src/app/pricing/page.tsx`):
```typescript
export default function PricingPage() {
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose Your Plan
      </h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Free Tier */}
        {/* Pro Tier */}
        {/* Premium Tier */}
      </div>
    </div>
  );
}
```

### Protected Content

```typescript
// src/lib/auth.ts
export async function isPremiumUser(userId: string) {
  const { data } = await supabase
    .from('users')
    .select('subscription_status, subscription_plan')
    .eq('id', userId)
    .single();

  return data?.subscription_status === 'active' && 
         ['pro', 'premium'].includes(data?.subscription_plan);
}
```

## 4. Display Ads (Ezoic/AdSense)

### When to Enable

Wait until:
- **10,000+ monthly pageviews** (minimum for approval)
- **50+ published tools** (content requirement)
- **3+ months old domain** (age requirement)

### Recommended Networks

1. **Ezoic** (Best for affiliate sites)
   - Requires 10k monthly visitors
   - Auto-optimizes ad placement
   - Revenue: $8-15 RPM (per 1000 visitors)
   - Application: https://ezoic.com

2. **Google AdSense** (Easiest to start)
   - More flexible requirements
   - Revenue: $3-8 RPM
   - Application: https://adsense.google.com

3. **Mediavine** (Premium option)
   - Requires 50k monthly sessions
   - Revenue: $15-25 RPM
   - Application: https://mediavine.com

### Implementation

```typescript
// src/app/layout.tsx
export default function RootLayout() {
  return (
    <html>
      <head>
        {/* Ezoic Placeholder */}
        <div className="ezoic-ad" data-ad-location="top-of-page" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

## 5. Revenue Tracking

### Database Schema

```sql
-- Add revenue tracking table
CREATE TABLE affiliate_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id),
  month DATE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  commission_rate NUMERIC(5,2),
  affiliate_network TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Manual Revenue Entry

```sql
-- Log monthly revenue
INSERT INTO affiliate_revenue (tool_id, month, clicks, conversions, revenue, affiliate_network)
VALUES (
  (SELECT id FROM tools WHERE slug = 'jasper'),
  '2026-01-01',
  1245,
  47,
  1890.50,
  'Impact Radius'
);
```

### Revenue Dashboard

Create analytics view in `/admin/analytics`:

```typescript
// Calculate monthly revenue
const { data: monthlyRevenue } = await supabase
  .from('affiliate_revenue')
  .select('month, revenue')
  .gte('month', startDate)
  .lte('month', endDate)
  .order('month');

// Calculate by tool
const { data: topTools } = await supabase
  .from('affiliate_revenue')
  .select('tool_id, tools(name), SUM(revenue)')
  .gte('month', '2026-01-01')
  .group('tool_id')
  .order('sum', { ascending: false })
  .limit(10);
```

## 6. Affiliate Program Applications

### Application Template

```
Subject: Partnership Inquiry - ToolForge AI

Hello [Program Name] Team,

I run ToolForge AI (https://toolforge.ai), a curated directory of AI tools 
with honest reviews and comparisons. We publish daily content helping 
[target audience] discover the best AI solutions for their needs.

Current Stats:
- 200+ AI tools reviewed
- 15,000+ monthly visitors
- Growing 25% month-over-month
- Audience: Tech professionals, content creators, developers

We're interested in promoting [Tool Name] through:
- Dedicated review page
- Category features
- Comparison articles
- Newsletter mentions

Could you please provide details on your affiliate program?

Best regards,
[Your Name]
ToolForge AI
```

### Top Programs to Apply

See `AFFILIATE_PROGRAMS.md` for full list with:
- Commission rates
- Cookie duration
- Application links
- Best practices

## 7. Conversion Optimization

### A/B Testing Ideas

1. **CTA Button Text**
   - "Try [Tool] Free" vs "Get Started" vs "Visit Site"
   
2. **Button Placement**
   - Top of page vs bottom vs sticky sidebar
   
3. **Affiliate Disclosure**
   - Prominent vs subtle vs tooltip

4. **Review Format**
   - Pros/cons list vs narrative vs video

### Click-Through Rate Targets

| Placement | Good CTR | Excellent CTR |
|-----------|----------|---------------|
| Tool cards | 5-10% | 15%+ |
| Detail page CTA | 20-30% | 40%+ |
| Comparison tables | 15-20% | 30%+ |

### Increasing Conversions

1. **Trust Signals**
   - Real user ratings
   - Expert badges
   - Verified reviews

2. **Urgency**
   - "Limited time discount"
   - "Exclusive deal"
   - "Ends soon"

3. **Social Proof**
   - "10,000+ users trust this tool"
   - Testimonials
   - Case studies

## 8. Tax & Legal

### Revenue Reporting

**Quarterly Estimated Taxes (U.S.)**
```
Q1 (Jan-Mar): Due April 15
Q2 (Apr-Jun): Due June 15
Q3 (Jul-Sep): Due September 15
Q4 (Oct-Dec): Due January 15
```

### Deductible Expenses

- Domain registration ($10-35/year)
- Hosting (Vercel Pro if needed: $20/mo)
- LLC filing ($70-150/year)
- Software tools (analytics, email, etc.)
- Paid content/images
- Home office deduction (if applicable)

### Required Disclosures

**FTC Compliance** - Already in footer and `/disclaimer`:
```
"This website contains affiliate links. We may earn a commission 
when you purchase through our links at no extra cost to you."
```

**Per-Page Disclosure** - Add to tool pages:
```
"This review contains affiliate links. If you purchase after 
clicking, we may earn a commission."
```

## 9. Revenue Projections

### Conservative Estimates

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Tools | 200 | 400 | 800 |
| Monthly Visitors | 5,000 | 15,000 | 50,000 |
| Affiliate Revenue | $500 | $2,000 | $8,000 |
| Membership Revenue | $0 | $200 | $1,000 |
| Display Ads | $0 | $200 | $500 |
| **Total** | **$500** | **$2,400** | **$9,500** |

### Aggressive Estimates (with effort)

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Tools | 400 | 800 | 1,500 |
| Monthly Visitors | 15,000 | 40,000 | 150,000 |
| Affiliate Revenue | $2,000 | $8,000 | $30,000 |
| Membership Revenue | $200 | $1,000 | $3,000 |
| Display Ads | $0 | $500 | $2,000 |
| **Total** | **$2,200** | **$9,500** | **$35,000** |

## 10. Quick Start Checklist

- [ ] Set up click tracking on all tool cards
- [ ] Apply to 10+ affiliate programs
- [ ] Update tools with affiliate links
- [ ] Test click tracking in analytics
- [ ] Create Stripe account (if doing memberships)
- [ ] Set up revenue tracking spreadsheet
- [ ] Add affiliate disclosure to all pages
- [ ] Monitor first affiliate commission!

## Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Affiliate Networks**: See AFFILIATE_PROGRAMS.md
- **FTC Guidelines**: https://www.ftc.gov/legal-library/browse/advertising-marketing
- **Revenue Tracking Template**: [Create Google Sheet or Notion template]

---

**Next Steps**: 
1. Apply to affiliate programs (see AFFILIATE_PROGRAMS.md)
2. Implement click tracking
3. Set up Stripe (optional)
4. Monitor and optimize conversions
