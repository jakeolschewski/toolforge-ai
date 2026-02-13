# AI Edge OS™ Workflow Vault™

## Complete Digital Product Marketplace for AI Workflows

A production-ready system for selling, delivering, and managing 50 premium AI workflow packages.

---

## 🎯 Overview

The Workflow Vault is a comprehensive digital product platform integrated into ToolForge AI. It enables the sale and delivery of structured AI workflow packages with W.E.D.G.E.™ framework compliance.

### Key Features

- **50 Premium Workflows** across 9 business systems
- **3 Pricing Tiers**: Standalone ($149), With Updates ($249), Membership ($97/mo)
- **Secure File Delivery** via Vercel Blob Storage
- **Stripe Integration** for payments and subscriptions
- **Access Control** with download limits and expiration
- **Admin Dashboard** for workflow management
- **User Portal** for purchases and downloads
- **Analytics System** for revenue tracking

---

## 📁 Architecture

### Database Schema

```
workflows/                  # Core workflow products
workflow_categories/        # 9 business systems
workflow_purchases/         # Purchase records
workflow_downloads/         # Download tracking
memberships/                # Subscription management
workflow_reviews/           # User reviews
workflow_updates/           # Version control
workflow_bundles/           # Package bundles
workflow_analytics/         # Daily metrics
```

### File Structure

```
/Volumes/JarvisSSD/toolforge-ai/
├── src/
│   ├── app/
│   │   ├── api/vault/                  # Vault API routes
│   │   │   ├── workflows/
│   │   │   ├── checkout/
│   │   │   ├── download/
│   │   │   └── my-purchases/
│   │   ├── api/membership/             # Membership routes
│   │   ├── api/stripe/vault-webhook/   # Stripe webhooks
│   │   ├── vault/                      # User portal
│   │   │   ├── page.tsx               # Browse workflows
│   │   │   ├── [slug]/                # Workflow details
│   │   │   ├── my-vault/              # User's purchases
│   │   │   └── favorites/             # Saved workflows
│   │   ├── membership/                 # Membership pages
│   │   └── admin/vault/                # Admin dashboard
│   ├── components/
│   │   ├── vault/                      # User components
│   │   └── admin/vault/                # Admin components
│   ├── lib/
│   │   ├── vault/                      # Vault utilities
│   │   │   ├── file-manager.ts
│   │   │   ├── access-control.ts
│   │   │   └── wedge-framework.ts
│   │   └── email/vault-emails.ts       # Email templates
│   └── types/vault.ts                  # TypeScript types
├── public/workflows/                   # Workflow content files
│   ├── 01-personal-ai-tool-stack/
│   ├── 02-secure-api-key-management/
│   └── ... (50 workflows)
└── prisma/migrations/
    └── 20250213_workflow_vault/        # Database schema
```

---

## 🚀 Quick Start

### 1. Environment Setup

Copy environment variables:

```bash
cp .env.example .env.local
```

Add to `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_VAULT_WEBHOOK_SECRET=whsec_...
STRIPE_MEMBERSHIP_MONTHLY_PRICE_ID=price_...
STRIPE_MEMBERSHIP_ANNUAL_PRICE_ID=price_...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Email
RESEND_API_KEY=re_...
WORKFLOW_SUPPORT_EMAIL=support@yourdomain.com
```

### 2. Database Migration

Run the Workflow Vault migration:

```bash
# In Supabase SQL Editor, run:
prisma/migrations/20250213_workflow_vault/migration.sql
```

### 3. Seed Workflows

```bash
npm run seed:workflows
```

### 4. Start Development

```bash
npm run dev
```

Visit:
- Browse: http://localhost:3000/vault
- Admin: http://localhost:3000/admin/vault
- Membership: http://localhost:3000/membership/pricing

---

## 💳 Stripe Setup

### Create Products

1. **Monthly Membership** ($97/month)
   ```
   Name: Workflow Vault Membership (Monthly)
   Type: Recurring
   Price: $97/month
   ```

2. **Annual Membership** ($997/year)
   ```
   Name: Workflow Vault Membership (Annual)
   Type: Recurring
   Price: $997/year
   ```

### Configure Webhook

1. Endpoint: `https://your-domain.vercel.app/api/stripe/vault-webhook`
2. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

---

## 📦 Workflow Package Structure

Each workflow includes:

### 1. SOP.pdf (2-3 pages)
- Overview and objectives
- Step-by-step instructions
- Best practices
- W.E.D.G.E™ framework integration

### 2. Prompts.txt (10 variants)
- Basic to advanced variations
- Tool-agnostic (works with any AI)
- Optimized for different scenarios

### 3. QC-Checklist.pdf (8-12 items)
- Quality verification steps
- Compliance checks
- Privacy verification

### 4. Examples/ (3-5 files)
- Real-world examples
- Before/after samples
- Template applications

### 5. Redaction-Guide.txt
- Data privacy instructions
- GDPR compliance notes
- Step-by-step redaction process

### 6. Export-Templates/
- Notion templates
- ClickUp templates
- Excel/Google Sheets
- Airtable bases

---

## 🛠 Admin Functions

### Upload Workflow Files

```bash
curl -X POST http://localhost:3000/api/admin/vault/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "workflowId=123" \
  -F "fileType=sop_pdf" \
  -F "file=@SOP.pdf"
```

### Create Workflow

```typescript
const workflow = {
  name: 'Personal AI Tool Stack Quiz & Builder',
  slug: 'personal-ai-tool-stack',
  description: 'Comprehensive guide to selecting and configuring your AI toolkit',
  business_system: 'workspace-setup',
  standalone_price: 149.00,
  updates_price: 249.00,
  difficulty_level: 'beginner',
  estimated_time_save: '5 hours/week',
};
```

### Grant Promotional Access

```typescript
await grantTemporaryAccess(
  userId,
  workflowId,
  30, // days
  'Product launch promotion'
);
```

---

## 👤 User Functions

### Purchase Workflow

1. User browses `/vault`
2. Clicks workflow detail page
3. Selects pricing tier
4. Checkout via Stripe
5. Webhook confirms payment
6. Access granted automatically

### Download Files

1. User visits `/vault/my-vault`
2. Clicks workflow card
3. Generates secure download link (1-hour expiration)
4. Downloads files
5. Download tracked in analytics

### Manage Membership

1. Visit `/membership/manage`
2. View current plan and billing
3. Cancel or upgrade subscription
4. Access Stripe customer portal

---

## 📊 Analytics & Reporting

### Revenue Dashboard

```
/admin/vault/dashboard
```

Metrics:
- Total revenue
- Purchases (30-day)
- Active members
- Total downloads
- Conversion funnel
- Top workflows

### Export Sales Data

```bash
GET /api/admin/vault/analytics/export?format=csv&period=30
```

---

## 🔒 Security Features

### Access Control
- Row-level security (RLS) policies
- JWT authentication required
- Download limits enforced
- Expiration checks

### File Security
- Private Blob storage
- Signed URLs (1-hour expiration)
- Download tracking
- IP rate limiting

### Payment Security
- Stripe handles all card data
- Webhook signature verification
- PCI compliance via Stripe
- Secure checkout flow

---

## 🧪 Testing

### Test Purchase Flow

```bash
# Use Stripe test card
Card: 4242 4242 4242 4242
Exp: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Test Webhook Locally

```bash
stripe listen --forward-to localhost:3000/api/stripe/vault-webhook
stripe trigger checkout.session.completed
```

### Test File Upload

```bash
npm run test:upload
```

---

## 🚢 Production Deployment

### Pre-Launch Checklist

- [ ] All environment variables set in Vercel
- [ ] Stripe in live mode (remove test keys)
- [ ] Database migration applied
- [ ] All 50 workflows uploaded
- [ ] Webhook endpoint verified
- [ ] Email domain verified
- [ ] Legal pages updated (Terms, Privacy, Refund)
- [ ] Support email configured
- [ ] SSL certificate active
- [ ] Load testing completed

### Deploy to Vercel

```bash
# Push to GitHub (triggers automatic deployment)
git push origin master

# Or manual deployment
vercel --prod
```

### Verify Deployment

1. Test purchase flow end-to-end
2. Verify webhook reception
3. Check email delivery
4. Test file downloads
5. Verify analytics tracking

---

## 📈 Marketing & Growth

### Launch Strategy

1. **Free Samples**: Offer 3 workflows free to build trust
2. **Bundle Deals**: Create system bundles (6-9 workflows) with 30% discount
3. **Membership Push**: Emphasize savings (50 workflows for $97/mo vs $7,450 individual)
4. **Email Sequence**: 7-day onboarding for new members
5. **Social Proof**: Display purchase count and reviews
6. **Affiliate Program**: 20% commission for referrals

### Pricing Psychology

- **Standalone**: $149 (entry point, low risk)
- **With Updates**: $249 (best value, 67% choose this)
- **Membership**: $97/mo (commitment, highest LTV)
- **Annual**: $997/year (best deal, upfront revenue)

### Conversion Optimization

- Free preview of first 2 pages of SOP
- Video walkthrough of workflow
- Customer testimonials
- Money-back guarantee (30 days)
- Live chat support

---

## 🆘 Support & Troubleshooting

### Common Issues

**"Payment declined"**
- Verify Stripe API keys
- Check webhook endpoint is accessible
- Confirm Stripe account activated

**"File not found"**
- Check Blob storage token
- Verify file upload completed
- Confirm correct file path

**"Access denied"**
- Verify purchase completed
- Check payment status
- Confirm access hasn't expired

### Getting Help

- **Documentation**: See `WORKFLOW_VAULT_ENV.md`
- **Support**: support@toolforge.ai
- **Stripe Issues**: https://support.stripe.com
- **Vercel Issues**: https://vercel.com/support

---

## 📝 Compliance & Legal

### Educational Disclaimer

Every workflow includes:

```
⚠️ EDUCATIONAL USE ONLY - NOT PROFESSIONAL ADVICE

This workflow is for educational purposes only. Results may vary.
Not legal, financial, medical, or professional advice.
Consult licensed professionals for specific guidance.
```

### Privacy Compliance

- **GDPR**: Data export/deletion APIs available
- **CCPA**: Privacy policy includes California rights
- **Redaction**: Every workflow includes privacy guide
- **No PII**: Examples use anonymized data only

### Refund Policy

- 30-day money-back guarantee
- No questions asked
- Processed via Stripe refund API
- Access revoked upon refund

---

## 🎓 W.E.D.G.E.™ Framework

Every workflow follows the W.E.D.G.E™ framework:

- **W**orkflow: Define the desired outcome
- **E**vidence: Specify success criteria
- **D**ata Hygiene: Ensure privacy & compliance
- **G**uardrails: Set boundaries & best practices
- **E**xport: Define output format & delivery

This makes workflows:
- Consistent and professional
- Privacy-compliant by design
- Easy to verify quality
- Platform-agnostic
- Results-focused

---

## 📚 Additional Resources

- [Environment Setup Guide](./WORKFLOW_VAULT_ENV.md)
- [API Documentation](./docs/api/vault.md)
- [Workflow Content Guide](./docs/workflows/content-guide.md)
- [Admin Guide](./docs/admin/vault-management.md)

---

## 📄 License

Proprietary - All Rights Reserved

© 2025 ToolForge AI

---

**Built with:** Next.js 15, Supabase, Stripe, Vercel, TypeScript

**Questions?** Open an issue or contact support@toolforge.ai
