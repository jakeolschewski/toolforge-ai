# Workflow Vault API - Quick Start Guide

Fast reference for the 10 Workflow Vault API routes.

## 🎯 Quick Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/vault/workflows` | GET | No | List all workflows |
| `/api/vault/workflows` | POST | Admin | Create workflow |
| `/api/vault/workflows/[slug]` | GET | No | Get single workflow |
| `/api/vault/workflows/[slug]` | PATCH | Admin | Update workflow |
| `/api/vault/workflows/[slug]` | DELETE | Admin | Delete workflow |
| `/api/vault/categories` | GET | No | List categories |
| `/api/vault/checkout` | POST | Yes | Create checkout |
| `/api/vault/verify` | POST | Yes | Verify access |
| `/api/vault/download` | POST | Yes | Generate download token |
| `/api/vault/download/<token>` | GET | No | Download file |
| `/api/vault/my-purchases` | GET | Yes | User's purchases |
| `/api/vault/favorites` | GET | Yes | User's favorites |
| `/api/vault/favorites` | POST | Yes | Add favorite |
| `/api/vault/favorites` | DELETE | Yes | Remove favorite |
| `/api/membership/subscribe` | POST | Yes | Subscribe |
| `/api/membership/status` | GET | Yes | Membership status |
| `/api/membership/status` | DELETE | Yes | Cancel membership |

## 📋 Common Use Cases

### 1. Browse Workflows
```typescript
// Fetch featured workflows
const response = await fetch('/api/vault/workflows?featured=true&limit=6');
const { data } = await response.json();
const workflows = data.data;
```

### 2. Search Workflows
```typescript
// Search by keyword
const response = await fetch('/api/vault/workflows?search=crm&sortBy=popular');
const { data } = await response.json();
```

### 3. Filter by Category
```typescript
// Get workflows by category
const response = await fetch('/api/vault/workflows?category=workflows&pricingType=free');
const { data } = await response.json();
```

### 4. Check User Access
```typescript
// Verify if user can access a workflow
const response = await fetch('/api/vault/verify', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ workflow_id: workflowId })
});

const { data } = await response.json();
if (data.has_access) {
  // Show download button
}
```

### 5. Download Workflow
```typescript
// Step 1: Generate secure download token
const tokenResponse = await fetch('/api/vault/download', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ workflow_id: workflowId })
});

const { data } = await tokenResponse.json();

// Step 2: Use the download URL
window.location.href = data.download_url;
```

### 6. Purchase Workflow
```typescript
// Create checkout session
const response = await fetch('/api/vault/checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ workflow_id: workflowId })
});

const { data } = await response.json();

// Redirect to Stripe checkout
window.location.href = data.checkout_url;
```

### 7. Manage Favorites
```typescript
// Add to favorites
await fetch('/api/vault/favorites', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ workflow_id: workflowId })
});

// Remove from favorites
await fetch(`/api/vault/favorites?workflow_id=${workflowId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get all favorites
const response = await fetch('/api/vault/favorites', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();
```

### 8. User's Purchase History
```typescript
// Get all purchases
const response = await fetch('/api/vault/my-purchases', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data } = await response.json();
const purchases = data.purchases;
```

### 9. Subscribe to Membership
```typescript
// Subscribe to monthly plan
const response = await fetch('/api/membership/subscribe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ plan: 'monthly' })
});

const { data } = await response.json();
window.location.href = data.checkout_url;
```

### 10. Check Membership Status
```typescript
// Get membership details
const response = await fetch('/api/membership/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data } = await response.json();

if (data.has_membership && data.status === 'active') {
  // Show members-only content
}
```

## 🔑 Authentication

Get the auth token from Supabase:

```typescript
import { supabase } from '@/lib/supabase';

// Get current session
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Use in API calls
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## 📊 Response Format

All endpoints return:

```typescript
// Success
{
  success: true,
  data: any,
  message?: string
}

// Error
{
  success: false,
  error: string
}
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad request / validation error
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Not found
- `500` - Server error

## 🗂️ File Locations

```
/Volumes/JarvisSSD/toolforge-ai/
├── src/
│   ├── app/api/
│   │   ├── vault/
│   │   │   ├── workflows/route.ts
│   │   │   ├── workflows/[slug]/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── checkout/route.ts
│   │   │   ├── verify/route.ts
│   │   │   ├── download/route.ts
│   │   │   ├── my-purchases/route.ts
│   │   │   └── favorites/route.ts
│   │   └── membership/
│   │       ├── subscribe/route.ts
│   │       └── status/route.ts
│   └── types/
│       ├── index.ts
│       └── vault.ts
├── prisma/migrations/
│   └── 003_workflow_vault_system.sql
└── WORKFLOW_VAULT_API.md (full docs)
```

## ✅ Setup Checklist

1. ✅ API routes created (all 10 routes)
2. ✅ TypeScript types defined
3. ✅ Database schema created
4. ⬜ Run database migration
5. ⬜ Configure environment variables
6. ⬜ Implement Stripe integration (optional)
7. ⬜ Test API endpoints
8. ⬜ Build frontend UI

## 🔧 Next Steps

1. **Apply database migration:**
   ```bash
   psql -h your-db -U postgres -d your-db -f prisma/migrations/003_workflow_vault_system.sql
   ```

2. **Set environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY` (optional)

3. **Test the API:**
   - Start dev server: `npm run dev`
   - Test in browser or Postman
   - Check responses match expected format

4. **Build frontend:**
   - Create workflow listing page
   - Create workflow detail page
   - Add checkout flow
   - Implement download functionality
   - Build user dashboard

## 📚 Full Documentation

See [WORKFLOW_VAULT_API.md](./WORKFLOW_VAULT_API.md) for complete API documentation.
