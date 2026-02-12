# Admin Dashboard Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser / Client                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Login      │  │  Dashboard   │  │   Sidebar    │              │
│  │   Screen     │  │    Stats     │  │  Navigation  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Drafts     │  │    Tools     │  │   Reviews    │              │
│  │  Management  │  │  Management  │  │  Management  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐                                                    │
│  │  Analytics   │                                                    │
│  │  Dashboard   │                                                    │
│  └──────────────┘                                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                       Next.js App Router Layer                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────┐           │
│  │              Middleware (src/middleware.ts)           │           │
│  │          Password Authentication & Protection         │           │
│  └──────────────────────────────────────────────────────┘           │
│                                    │                                  │
│  ┌─────────────────────────────────────────────────────┐            │
│  │                   Admin Layout                       │            │
│  │          (src/app/admin/layout.tsx)                 │            │
│  │        - Session Management                          │            │
│  │        - Auth Check                                  │            │
│  └─────────────────────────────────────────────────────┘            │
│                                    │                                  │
│  ┌───────────────┬──────────────┬──────────────┬──────────────┐    │
│  │  Dashboard    │   Drafts     │    Tools     │   Reviews    │    │
│  │    Page       │    Page      │    Page      │    Page      │    │
│  └───────────────┴──────────────┴──────────────┴──────────────┘    │
│                                    │                                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                         API Routes Layer                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ /api/admin/  │  │ /api/admin/  │  │ /api/admin/  │              │
│  │    auth      │  │    tools     │  │   reviews    │              │
│  │              │  │              │  │              │              │
│  │  - POST      │  │  - GET       │  │  - GET       │              │
│  │    Login     │  │  - PATCH     │  │  - PATCH     │              │
│  │              │  │  - DELETE    │  │  - DELETE    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐                                                    │
│  │ /api/admin/  │                                                    │
│  │   approve    │                                                    │
│  │              │                                                    │
│  │  - GET       │                                                    │
│  │  - POST      │                                                    │
│  │  - DELETE    │                                                    │
│  └──────────────┘                                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Supabase Client
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                        Supabase Database                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │    tools     │  │   reviews    │  │   scraped    │              │
│  │    table     │  │    table     │  │   sources    │              │
│  │              │  │              │  │    table     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │ categories   │  │ click_logs   │                                 │
│  │    table     │  │    table     │                                 │
│  │              │  │              │                                 │
│  └──────────────┘  └──────────────┘                                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
AdminLayout (src/app/admin/layout.tsx)
│
├── Authentication Check
│   ├── Login Screen (if not authenticated)
│   └── Admin Content (if authenticated)
│
└── Admin Content
    │
    ├── Sidebar (src/components/admin/Sidebar.tsx)
    │   ├── Dashboard Link
    │   ├── Drafts Link
    │   ├── Tools Link
    │   ├── Reviews Link
    │   ├── Analytics Link
    │   └── Logout Button
    │
    └── Main Content Area
        │
        ├── Dashboard Page (src/app/admin/page.tsx)
        │   ├── StatsCard × 4
        │   ├── Quick Actions Card
        │   └── Recent Tools Card
        │
        ├── Drafts Page (src/app/admin/drafts/page.tsx)
        │   ├── Stats Cards × 3
        │   └── DraftsList Component
        │       ├── Bulk Actions Bar
        │       ├── Select All Checkbox
        │       └── Draft Cards (with approve/ignore)
        │
        ├── Tools Page (src/app/admin/tools/page.tsx)
        │   ├── Search & Filter Bar
        │   ├── Stats Cards × 4
        │   ├── Tool List View
        │   │   └── Tool Cards (with edit/delete/view)
        │   └── Tool Edit View
        │       └── ToolEditor Component
        │
        ├── Reviews Page (src/app/admin/reviews/page.tsx)
        │   ├── Search & Filter Bar
        │   ├── Stats Cards × 4
        │   ├── Review List View
        │   │   └── Review Cards (with edit/delete/publish)
        │   └── Review Edit View
        │       └── ReviewEditor Component
        │
        └── Analytics Page (src/app/admin/analytics/page.tsx)
            ├── Key Metrics Cards × 3
            ├── Top Tools by Views Card
            ├── Top Tools by Clicks Card
            ├── Category Distribution Card
            └── Recent Activity Card
```

## Data Flow

### Authentication Flow
```
1. User visits /admin
   ↓
2. AdminLayout checks sessionStorage for 'admin_authenticated'
   ↓
3. If not authenticated:
   - Show login form
   - User enters password
   - POST /api/admin/auth
   - Verify against ADMIN_PASSWORD env var
   - Store token in sessionStorage
   - Render admin content
   ↓
4. If authenticated:
   - Render admin content with sidebar
```

### Tool Approval Flow
```
1. User clicks "Approve" on draft
   ↓
2. POST /api/admin/approve
   - Include Authorization header
   - Send sourceId and autoGenerate flag
   ↓
3. API Route:
   - Fetch scraped source from database
   - Create tool entry
   - Generate review (if autoGenerate=true)
   - Mark source as 'processed'
   - Return success
   ↓
4. Client:
   - Remove draft from UI
   - Show success toast
   - Update stats
```

### Tool Edit Flow
```
1. User clicks "Edit" icon on tool
   ↓
2. Show ToolEditor component with current data
   ↓
3. User modifies fields and clicks "Save"
   ↓
4. PATCH /api/admin/tools/[id]
   - Include Authorization header
   - Send updated tool data
   ↓
5. API Route:
   - Update tool in database
   - Set updated_at timestamp
   - Return updated tool
   ↓
6. Client:
   - Update tool in state
   - Close editor
   - Show success toast
```

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│            Security Layers                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 1: Client-Side Auth Check               │
│  ├── AdminLayout checks sessionStorage         │
│  └── Redirects to login if not authenticated   │
│                                                 │
│  Layer 2: Session Management                   │
│  ├── Token stored in sessionStorage            │
│  ├── Cleared on tab close                      │
│  └── Included in all API requests              │
│                                                 │
│  Layer 3: Middleware Protection                │
│  ├── Intercepts all /api/admin/* requests      │
│  ├── Verifies Authorization header             │
│  └── Returns 401 if invalid                    │
│                                                 │
│  Layer 4: API Route Verification               │
│  ├── Double-checks admin token                 │
│  ├── Validates request data                    │
│  └── Uses Supabase admin client                │
│                                                 │
│  Layer 5: Database Security                    │
│  ├── Supabase Row-Level Security (RLS)        │
│  ├── Service role key for admin operations    │
│  └── Encrypted connections                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Performance Optimization

### Server-Side Rendering (SSR)
- Dashboard page: Pre-renders stats on server
- Analytics page: Pre-fetches data on server
- Faster initial load, better SEO

### Client-Side Rendering (CSR)
- Drafts page: Interactive, frequent updates
- Tools page: Search/filter requires client state
- Reviews page: Rich text editing needs client-side

### Data Fetching Strategy
```
┌─────────────────────────────────────────────┐
│           Data Fetching Flow                │
├─────────────────────────────────────────────┤
│                                             │
│  Initial Load (SSR)                        │
│  ├── Fetch from Supabase on server        │
│  ├── Render HTML with data                │
│  └── Send to browser                       │
│                                             │
│  Updates (CSR)                             │
│  ├── User action triggers request          │
│  ├── Fetch from API route                 │
│  ├── Update React state                   │
│  └── Re-render component                  │
│                                             │
│  Optimization                              │
│  ├── Only fetch what's needed             │
│  ├── Paginate large datasets              │
│  ├── Cache static data                    │
│  └── Optimistic UI updates                │
│                                             │
└─────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Capacity
- Handles: 1-5 concurrent admin users
- Database: Thousands of tools/reviews
- Response time: < 500ms for most operations

### Future Scaling
- Add Redis for session management
- Implement database indexing
- Use CDN for static assets
- Add load balancing for API routes
- Implement query caching

## Monitoring & Logging

```
┌─────────────────────────────────────────────┐
│         Monitoring Points                   │
├─────────────────────────────────────────────┤
│                                             │
│  Application Level                         │
│  ├── API response times                    │
│  ├── Error rates by endpoint              │
│  ├── Database query performance           │
│  └── Admin action frequency               │
│                                             │
│  User Level                                │
│  ├── Login attempts                        │
│  ├── Failed authentication                │
│  ├── Session duration                     │
│  └── Actions per session                  │
│                                             │
│  System Level                              │
│  ├── Memory usage                          │
│  ├── CPU utilization                       │
│  ├── Network latency                       │
│  └── Database connections                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Deployment Architecture

```
Development                    Production
    ↓                             ↓
┌────────┐                   ┌────────┐
│ Local  │                   │ Vercel │
│ npm    │  →  Build  →      │ Deploy │
│ run    │                   │        │
│ dev    │                   └────────┘
└────────┘                        ↓
                            ┌──────────┐
                            │ Supabase │
                            │ Database │
                            └──────────┘
```

## Tech Stack Summary

| Layer        | Technology        | Purpose                    |
|--------------|-------------------|----------------------------|
| Framework    | Next.js 15        | App Router, SSR, API       |
| Language     | TypeScript        | Type safety                |
| Styling      | Tailwind CSS      | Utility-first CSS          |
| Database     | Supabase          | PostgreSQL, Auth, Storage  |
| Icons        | Lucide React      | Modern icon library        |
| Notifications| React Hot Toast   | User feedback              |
| State        | React Hooks       | Local component state      |
| Auth         | Custom            | Password-based             |

---

This architecture provides a solid foundation for the admin dashboard while remaining flexible for future enhancements and scaling needs.
