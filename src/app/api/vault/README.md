# Workflow Vault API Routes

Production-ready API routes for the Workflow Vault system.

## 📁 Structure

```
vault/
├── workflows/
│   ├── route.ts              # GET: List workflows, POST: Create workflow
│   └── [slug]/
│       └── route.ts          # GET/PATCH/DELETE: Single workflow
├── categories/
│   └── route.ts              # GET: List categories
├── checkout/
│   └── route.ts              # POST: Create Stripe checkout
├── verify/
│   └── route.ts              # POST: Verify purchase access
├── download/
│   └── route.ts              # POST: Generate token, GET: Download file
├── my-purchases/
│   └── route.ts              # GET: User's purchases
└── favorites/
    └── route.ts              # GET/POST/DELETE: Manage favorites
```

## 🚀 Quick Examples

### List Workflows
```typescript
GET /api/vault/workflows?featured=true&limit=10
```

### Get Single Workflow
```typescript
GET /api/vault/workflows/[slug]
```

### Check Access
```typescript
POST /api/vault/verify
Body: { workflow_id: "uuid" }
Headers: { Authorization: "Bearer <token>" }
```

### Download Workflow
```typescript
POST /api/vault/download
Body: { workflow_id: "uuid" }
Headers: { Authorization: "Bearer <token>" }
```

### Add to Favorites
```typescript
POST /api/vault/favorites
Body: { workflow_id: "uuid" }
Headers: { Authorization: "Bearer <token>" }
```

## 🔑 Authentication

Required for:
- `/checkout` (POST)
- `/verify` (POST)
- `/download` (POST)
- `/my-purchases` (GET)
- `/favorites` (GET, POST, DELETE)
- `/workflows` (POST) - Admin only
- `/workflows/[slug]` (PATCH, DELETE) - Admin only

Not required for:
- `/workflows` (GET)
- `/workflows/[slug]` (GET)
- `/categories` (GET)
- `/download/<token>` (GET)

## 📚 Full Documentation

See [WORKFLOW_VAULT_API.md](../../../../WORKFLOW_VAULT_API.md) for complete documentation.

## 🔧 Development

All routes use:
- Edge runtime
- Supabase for database
- TypeScript types from `/src/types`
- Standardized response format

Response format:
```typescript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```
