# Workflow Vault Environment Variables

## Required Environment Variables

Add these to your `.env.local` file and Vercel environment variables:

### Stripe Configuration (for Payments)

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...               # Your Stripe publishable key

# Stripe Product/Price IDs
STRIPE_VAULT_WEBHOOK_SECRET=whsec_...            # Webhook secret for vault purchases
STRIPE_MEMBERSHIP_MONTHLY_PRICE_ID=price_...     # Monthly membership price ID
STRIPE_MEMBERSHIP_ANNUAL_PRICE_ID=price_...      # Annual membership price ID

# Test Mode (set to 'true' during development)
STRIPE_TEST_MODE=true
```

### File Storage (Vercel Blob)

```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...        # From Vercel dashboard
```

### Email Service (for Purchase Confirmations)

```bash
# Resend API (recommended)
RESEND_API_KEY=re_...

# Email addresses
WORKFLOW_SUPPORT_EMAIL=support@yourdomain.com
WORKFLOW_NOTIFICATIONS_EMAIL=notifications@yourdomain.com
```

### Application URLs

```bash
# Your deployed URLs
NEXT_PUBLIC_APP_URL=https://toolforge-ai.vercel.app
NEXT_PUBLIC_VAULT_URL=https://toolforge-ai.vercel.app/vault
```

### Feature Flags

```bash
# Enable/disable features
ENABLE_MEMBERSHIP_SUBSCRIPTIONS=true
ENABLE_WORKFLOW_BUNDLES=true
ENABLE_AFFILIATE_TRACKING=false
```

---

## Stripe Setup Guide

### 1. Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete business verification
3. Navigate to Developers → API keys
4. Copy your secret and publishable keys

### 2. Create Products & Prices

#### Workflow Products (Dynamic - created per workflow)
- Products are created dynamically via API when workflows are added
- Pricing tiers: $149 (standalone) and $249 (with updates)

#### Membership Subscriptions (Manual setup required)

**Monthly Membership:**
1. Go to Stripe Dashboard → Products
2. Create new product: "Workflow Vault Membership (Monthly)"
3. Set recurring price: $97/month
4. Copy the price ID (starts with `price_...`)
5. Add to `STRIPE_MEMBERSHIP_MONTHLY_PRICE_ID`

**Annual Membership:**
1. Create new product: "Workflow Vault Membership (Annual)"
2. Set recurring price: $997/year ($83/month equivalent)
3. Copy the price ID
4. Add to `STRIPE_MEMBERSHIP_ANNUAL_PRICE_ID`

### 3. Setup Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://your-domain.vercel.app/api/stripe/vault-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret
6. Add to `STRIPE_VAULT_WEBHOOK_SECRET`

---

## Vercel Blob Storage Setup

### 1. Enable Blob Storage
1. Go to Vercel Dashboard → Storage
2. Create new Blob Store
3. Name it: "workflow-vault-files"
4. Copy the read/write token
5. Add to `BLOB_READ_WRITE_TOKEN`

### 2. File Size Limits
- Free tier: 500MB total storage
- Pro tier: 100GB total storage
- Max file size: 500MB per file

### 3. File Organization
Files are organized as:
```
/workflows/{workflow-id}/
  sop_pdf/SOP.pdf
  prompts_txt/Prompts.txt
  qc_checklist/QC-Checklist.pdf
  examples/
    example-1.pdf
    example-2.docx
  redaction_guide/Redaction-Guide.txt
  export_templates/
    template-notion.json
    template-excel.xlsx
```

---

## Email Setup (Resend)

### 1. Create Resend Account
1. Go to https://resend.com
2. Create account and verify email
3. Add and verify your domain (or use resend.dev for testing)

### 2. Create API Key
1. Go to API Keys
2. Create new key with send permissions
3. Copy key (starts with `re_...`)
4. Add to `RESEND_API_KEY`

### 3. Configure Email Templates
Email templates are in:
- `/src/lib/email/templates/purchase-confirmation.tsx`
- `/src/lib/email/templates/membership-welcome.tsx`
- `/src/lib/email/templates/download-ready.tsx`

---

## Testing Checklist

### Before Going Live:

- [ ] Test Stripe checkout flow (use test mode)
- [ ] Verify webhook handling (use Stripe CLI for local testing)
- [ ] Test file uploads and downloads
- [ ] Confirm email delivery
- [ ] Test membership subscription flow
- [ ] Verify access control (purchased vs non-purchased)
- [ ] Test download limits
- [ ] Check analytics tracking
- [ ] Verify refund handling
- [ ] Test on mobile devices

### Local Testing Commands:

```bash
# Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/vault-webhook

# Upload test file
curl -X POST http://localhost:3000/api/admin/vault/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "workflowId=123" \
  -F "fileType=sop_pdf"
```

---

## Pricing Strategy

### Recommended Pricing:

**Individual Workflows:**
- Standalone: $149 (one-time, lifetime access)
- With Updates: $249 (one-time + 1 year of updates)

**Membership:**
- Monthly: $97/month (all workflows + updates)
- Annual: $997/year (save $167 vs monthly)

**Bundles:**
- System Bundle (6-9 workflows): 30% off individual prices
- Complete Vault (all 50): $2,997 (vs $7,450 individual)

### Value Calculation:
- Each workflow saves 5-10 hours/week
- At $50/hour = $250-500/week value
- ROI: Workflows pay for themselves in 1-2 uses

---

## Security Considerations

### File Access:
- All files stored with `private` access in Vercel Blob
- Signed URLs generated on-demand with 1-hour expiration
- Download tracking prevents abuse
- User authentication required for all downloads

### Payment Security:
- Never store credit card information
- All payments processed through Stripe
- PCI compliance handled by Stripe
- Webhook signature verification required

### Data Privacy:
- GDPR compliant (data export/deletion APIs available)
- No sensitive data in logs
- Redaction guidelines included in every workflow
- Privacy-first design

---

## Monitoring & Analytics

### Key Metrics to Track:
1. **Revenue**: Daily/monthly sales
2. **Conversion Rate**: Visitors → Purchases
3. **Average Order Value**: Per transaction
4. **Customer Lifetime Value**: Total per customer
5. **Download Activity**: Usage patterns
6. **Churn Rate**: Membership cancellations
7. **Support Tickets**: Quality indicators

### Tools:
- Stripe Dashboard (revenue, refunds)
- Vercel Analytics (traffic, performance)
- Supabase Dashboard (database queries)
- Custom `/admin/vault/analytics` dashboard

---

## Support & Troubleshooting

### Common Issues:

**"Payment failed"**
- Check Stripe API keys are correct
- Verify webhook endpoint is accessible
- Check Stripe account is activated

**"File not found"**
- Verify Blob storage token is set
- Check file was uploaded successfully
- Confirm file path format matches

**"Access denied"**
- Verify user purchased the workflow
- Check purchase status is 'completed'
- Confirm access hasn't expired

### Getting Help:
- Stripe: https://support.stripe.com
- Vercel: https://vercel.com/support
- Resend: https://resend.com/docs

---

## Production Deployment

### Pre-launch Checklist:

- [ ] All environment variables set in Vercel
- [ ] Stripe set to live mode (remove test keys)
- [ ] Domain verified for email
- [ ] Webhook endpoints tested
- [ ] SSL certificate active
- [ ] Legal pages updated (Terms, Privacy, Refund Policy)
- [ ] Support email configured
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place
- [ ] Load testing completed

### Going Live:
1. Switch Stripe from test to live mode
2. Update webhook endpoints
3. Deploy to production
4. Test complete purchase flow
5. Monitor for 24 hours
6. Announce launch!

---

**Generated for AI Edge OS™ Workflow Vault™**
