# ToolForge AI - Environment Variables Setup

## ✅ Environment Variables Successfully Added to Vercel

All environment variables have been added to Vercel Production. Most have placeholder values that need to be updated with your actual credentials.

---

## 📋 Complete Environment Variables List

### ✅ Core Infrastructure (Already Configured)
| Variable | Status | Notes |
|----------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configured | `https://kfhefxyiiogwmqjrqwjd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configured | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configured | Supabase service role (admin) key |
| `DATABASE_URL` | ✅ Configured | PostgreSQL connection string |
| `ADMIN_PASSWORD` | ✅ Configured | Admin dashboard password |
| `OWNER_PASSWORD` | ✅ Configured | Owner dashboard password |
| `CRON_SECRET` | ✅ Configured | Secret for cron job authentication |
| `NEXT_PUBLIC_SITE_URL` | ✅ Configured | Your site URL |
| `NEXT_PUBLIC_SITE_NAME` | ✅ Configured | ToolForge AI |

---

### 🔴 Google AdSense (Requires Your AdSense Account)
| Variable | Current Value | Action Required |
|----------|---------------|-----------------|
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | `ca-pub-0000000000000000` | ⚠️ **Replace with your AdSense Publisher ID** |
| `NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT` | `1234567890` | ⚠️ **Replace with actual sidebar ad unit ID** |
| `NEXT_PUBLIC_ADSENSE_CONTENT_SLOT` | `2345678901` | ⚠️ **Replace with actual in-content ad unit ID** |
| `NEXT_PUBLIC_ADSENSE_HEADER_SLOT` | `3456789012` | ⚠️ **Replace with actual header ad unit ID** |
| `NEXT_PUBLIC_ADSENSE_FOOTER_SLOT` | `4567890123` | ⚠️ **Replace with actual footer ad unit ID** |
| `NEXT_PUBLIC_ADSENSE_FEED_SLOT` | `5678901234` | ⚠️ **Replace with actual feed/between-posts ad unit ID** |

**How to Get AdSense IDs:**
1. Go to https://www.google.com/adsense
2. Create/login to your AdSense account
3. Create ad units for each position (sidebar, in-content, header, footer, feed)
4. Copy the ad unit IDs and update the Vercel environment variables

**Update Command:**
```bash
vercel env rm NEXT_PUBLIC_GOOGLE_ADSENSE_ID production
vercel env add NEXT_PUBLIC_GOOGLE_ADSENSE_ID production
# Enter your actual ca-pub-XXXXXXXXXXXXXXXX ID

vercel env rm NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT production
vercel env add NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT production
# Enter your actual ad slot ID
```

---

### 🔴 NextAuth / OAuth Authentication (Requires Setup)
| Variable | Current Value | Action Required |
|----------|---------------|-----------------|
| `NEXTAUTH_SECRET` | ✅ Auto-generated | Already configured with secure random value |
| `NEXTAUTH_URL` | `https://toolforge-ai.vercel.app` | ✅ Update if using custom domain |
| `GOOGLE_CLIENT_ID` | `your-google-client-id.apps.googleusercontent.com` | ⚠️ **Replace with Google OAuth Client ID** |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-placeholder-secret` | ⚠️ **Replace with Google OAuth Client Secret** |
| `GITHUB_ID` | `github-oauth-app-id` | ⚠️ **Replace with GitHub OAuth App ID** |
| `GITHUB_SECRET` | `github-oauth-app-secret` | ⚠️ **Replace with GitHub OAuth App Secret** |

**How to Setup Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://toolforge-ai.vercel.app/api/auth/callback/google`
4. Copy Client ID and Client Secret
5. Update Vercel env vars

**How to Setup GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set Homepage URL: `https://toolforge-ai.vercel.app`
4. Set Authorization callback URL: `https://toolforge-ai.vercel.app/api/auth/callback/github`
5. Copy Client ID and generate Client Secret
6. Update Vercel env vars

---

### 🔴 AI Content Generation (Requires Anthropic Account)
| Variable | Current Value | Action Required |
|----------|---------------|-----------------|
| `ANTHROPIC_API_KEY` | `sk-ant-placeholder-your-api-key-here` | ⚠️ **Replace with your Anthropic API key** |

**How to Get Anthropic API Key:**
1. Go to https://console.anthropic.com/
2. Create account or login
3. Go to API Keys section
4. Create new API key
5. Update Vercel env var

**Update Command:**
```bash
vercel env rm ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY production
# Enter your sk-ant-api01-XXXX key
```

---

### 🔴 Email Service (Requires Resend Account)
| Variable | Current Value | Action Required |
|----------|---------------|-----------------|
| `RESEND_API_KEY` | `re_placeholder_your_resend_api_key` | ⚠️ **Replace with your Resend API key** |
| `SMTP_HOST` | `smtp.resend.com` | ✅ Already configured |
| `SMTP_PORT` | `587` | ✅ Already configured |
| `SMTP_FROM` | `noreply@toolforge.ai` | ⚠️ **Update to your verified domain** |

**How to Setup Resend:**
1. Go to https://resend.com/
2. Create account
3. Verify your domain (or use resend's test domain for development)
4. Create API key
5. Update Vercel env vars

**Update Commands:**
```bash
vercel env rm RESEND_API_KEY production
vercel env add RESEND_API_KEY production
# Enter your re_XXXX key

vercel env rm SMTP_FROM production
vercel env add SMTP_FROM production
# Enter your verified email address (e.g., noreply@yourdomain.com)
```

---

## 🚀 Quick Setup Priority

### Priority 1 - Essential (Site Won't Work Without These)
1. ✅ Supabase credentials - **Already configured**
2. ✅ Database URL - **Already configured**

### Priority 2 - High Priority (For Full Functionality)
3. 🔴 **Anthropic API Key** - Required for AI content generation
4. 🔴 **Resend API Key** - Required for email capture
5. 🔴 **NextAuth OAuth** - Required for user login

### Priority 3 - Medium Priority (For Revenue)
6. 🔴 **Google AdSense** - Required for ad revenue
7. 🔴 **SMTP_FROM** - Update to your domain

---

## 📝 How to Update Environment Variables

### Option 1: Vercel CLI (Recommended)
```bash
# Remove old variable
vercel env rm VARIABLE_NAME production

# Add new variable
vercel env add VARIABLE_NAME production
# Then paste the value when prompted
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your `toolforge-ai` project
3. Go to Settings → Environment Variables
4. Click on variable to edit
5. Update value and save

### After Updating Variables
```bash
# Trigger new deployment to apply changes
vercel --prod
```

---

## 🔍 Verify Environment Variables

Check all current variables:
```bash
vercel env ls production
```

Pull variables to local file for review:
```bash
vercel env pull .env.production.local
```

---

## ⚠️ Important Notes

1. **NEXT_PUBLIC_* variables are visible to users** - Don't put secrets in them
2. **AdSense requires site approval** - Apply at https://www.google.com/adsense
3. **OAuth requires HTTPS** - Works on Vercel by default
4. **Email domain verification** - Required for production email sending
5. **API rate limits** - Check Anthropic pricing for API usage limits

---

## ✅ What's Already Working

Even without updating the placeholder values, your site will work with:
- ✅ 91 AI tools displayed
- ✅ Database fully functional
- ✅ Social sharing buttons (without tracking)
- ✅ Search and filtering
- ✅ All UI components
- ✅ Analytics tracking (without emails/OAuth/AI content)

---

## 🎯 Next Steps

1. **Get AdSense Approved** (can take 1-2 weeks)
   - Apply at https://www.google.com/adsense
   - Need traffic/content before approval

2. **Setup OAuth Providers**
   - Google OAuth (5 minutes)
   - GitHub OAuth (5 minutes)

3. **Get API Keys**
   - Anthropic API key (instant)
   - Resend API key (instant)

4. **Deploy Updates**
   ```bash
   vercel --prod
   ```

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs/environment-variables
- **Supabase Docs:** https://supabase.com/docs
- **NextAuth Docs:** https://next-auth.js.org/providers/google
- **Anthropic API:** https://docs.anthropic.com/
- **Resend Docs:** https://resend.com/docs
- **AdSense Help:** https://support.google.com/adsense

---

Generated: 2025-02-12
ToolForge AI - Complete Setup ✅
