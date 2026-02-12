# Admin Dashboard Documentation

Complete admin dashboard for managing ToolForge AI content, tools, reviews, and analytics.

## Features

### 1. Dashboard (Home)
- **Stats Overview**: Total tools, pending drafts, views, clicks
- **Quick Actions**: Direct links to review drafts, manage tools, and view analytics
- **Recent Tools**: List of recently published tools with performance metrics
- **Location**: `/admin`

### 2. Pending Drafts Management
- **Review Scraped Tools**: View all tools scraped from external sources
- **Bulk Operations**: Select and approve multiple drafts at once
- **Actions**:
  - Approve (automatically publishes tool and generates review)
  - Ignore (marks as ignored, removes from pending list)
- **Stats**: Pending, processed, and ignored counts
- **Location**: `/admin/drafts`

### 3. Tools Management
- **View All Tools**: List all tools (published, draft, archived)
- **Search & Filter**: Search by name/description, filter by status
- **Actions**:
  - Edit: Comprehensive form to update all tool details
  - Delete: Remove tool from database
  - View: Open tool page in new tab
- **Stats**: Total, published, drafts, archived counts
- **Location**: `/admin/tools`

### 4. Reviews Management
- **View All Reviews**: List all reviews (published, draft, archived)
- **Search & Filter**: Search by title/content, filter by status
- **Actions**:
  - Edit: Update review content, pros, cons, verdict, SEO fields
  - Publish: Change status from draft to published
  - Delete: Remove review from database
- **Stats**: Total, published, drafts, views
- **Location**: `/admin/reviews`

### 5. Analytics Dashboard
- **Key Metrics**: Total views, clicks, average CTR
- **Top Tools by Views**: Ranking of most viewed tools
- **Top Tools by Clicks**: Ranking of tools with most outbound clicks
- **Category Distribution**: Tools grouped by category
- **Recent Activity**: Tools published in last 30 days
- **Location**: `/admin/analytics`

## Authentication

### Password Protection
The admin dashboard is protected by a simple password authentication system.

1. **Set Password**: Add to environment variables
   ```bash
   ADMIN_PASSWORD=your_secure_password_here
   ```

2. **Login**: Navigate to `/admin` and enter the password

3. **Session**: Password is stored in `sessionStorage` and persists until browser tab is closed

4. **Logout**: Click "Logout" in sidebar to clear session

### API Authentication
All admin API routes are protected by middleware that checks the `Authorization` header:

```javascript
headers: {
  'Authorization': `Bearer ${ADMIN_PASSWORD}`
}
```

## API Routes

### Tools Management
- `GET /api/admin/tools` - List all tools
- `GET /api/admin/tools?status=published` - Filter by status
- `PATCH /api/admin/tools/[id]` - Update tool
- `DELETE /api/admin/tools/[id]` - Delete tool

### Reviews Management
- `GET /api/admin/reviews` - List all reviews
- `GET /api/admin/reviews?status=draft` - Filter by status
- `PATCH /api/admin/reviews/[id]` - Update review
- `DELETE /api/admin/reviews/[id]` - Delete review

### Drafts Management
- `GET /api/admin/approve` - Get pending scraped sources
- `POST /api/admin/approve` - Approve and publish tool
- `DELETE /api/admin/approve?id=[id]` - Ignore scraped source

### Authentication
- `POST /api/admin/auth` - Verify admin password

## Components

### Admin-Specific Components
Located in `/src/components/admin/`:

1. **StatsCard.tsx** - Displays metrics with optional trend indicators
2. **Sidebar.tsx** - Navigation sidebar with logout
3. **DraftsList.tsx** - List of pending drafts with bulk actions
4. **ToolEditor.tsx** - Comprehensive form for editing tools
5. **ReviewEditor.tsx** - Rich editor for review content

### Shared UI Components
The admin dashboard uses shared components from `/src/components/ui/`:
- Button
- Card (with Header, Title, Content, Footer)
- Badge

## Security

### Current Implementation
- Simple password-based authentication
- Password stored in environment variable
- Session managed via `sessionStorage`
- Middleware protection for API routes
- Authorization header verification

### Recommended Improvements for Production
1. **Use NextAuth.js** with proper session management
2. **Add role-based access control** (admin, editor, viewer)
3. **Implement rate limiting** for API routes
4. **Add audit logging** for all admin actions
5. **Use secure cookies** instead of sessionStorage
6. **Add two-factor authentication** (2FA)
7. **Implement CSRF protection**

## Development

### Running Locally
```bash
# Set admin password
echo "ADMIN_PASSWORD=admin123" >> .env.local

# Start development server
npm run dev

# Navigate to admin dashboard
open http://localhost:3000/admin
```

### Adding New Admin Pages
1. Create page in `/src/app/admin/[page-name]/page.tsx`
2. Add route to Sidebar component
3. Create necessary API routes in `/src/app/api/admin/`
4. Add authentication checks to API routes

### Testing
```bash
# Test admin authentication
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# Test tools API (with auth)
curl http://localhost:3000/api/admin/tools \
  -H "Authorization: Bearer admin123"
```

## File Structure

```
/src/app/admin/
├── layout.tsx           # Admin layout with auth
├── page.tsx             # Dashboard home
├── drafts/
│   └── page.tsx         # Pending drafts management
├── tools/
│   └── page.tsx         # Tools management
├── reviews/
│   └── page.tsx         # Reviews management
└── analytics/
    └── page.tsx         # Analytics dashboard

/src/components/admin/
├── StatsCard.tsx        # Stats display component
├── Sidebar.tsx          # Navigation sidebar
├── DraftsList.tsx       # Drafts list with bulk actions
├── ToolEditor.tsx       # Tool editing form
└── ReviewEditor.tsx     # Review editing form

/src/app/api/admin/
├── auth/
│   └── route.ts         # Authentication endpoint
├── tools/
│   ├── route.ts         # List/create tools
│   └── [id]/
│       └── route.ts     # Update/delete tool
├── reviews/
│   ├── route.ts         # List/create reviews
│   └── [id]/
│       └── route.ts     # Update/delete review
└── approve/
    └── route.ts         # Manage scraped sources

/src/middleware.ts       # API route protection
```

## Environment Variables

Required environment variables for admin dashboard:

```bash
# Admin password (required)
ADMIN_PASSWORD=your_secure_password

# Supabase (required for data access)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### Can't Login
1. Check `ADMIN_PASSWORD` is set in `.env.local`
2. Restart development server after changing env variables
3. Clear browser cache and sessionStorage
4. Check browser console for errors

### API Returns 401 Unauthorized
1. Verify admin token is stored in sessionStorage
2. Check Authorization header is included in requests
3. Ensure middleware is not blocking legitimate requests
4. Verify password matches between client and server

### Data Not Loading
1. Check Supabase connection and credentials
2. Verify database tables exist and have correct schema
3. Check browser console for API errors
4. Ensure Supabase RLS policies allow admin access

### Components Not Rendering
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Check for TypeScript errors: `npm run build`
4. Verify all imports are correct

## Future Enhancements

### Planned Features
- [ ] Real-time notifications for new scraped tools
- [ ] Batch editing for multiple tools
- [ ] Content calendar for scheduled publishing
- [ ] Advanced analytics with charts (Chart.js or Recharts)
- [ ] Export data to CSV/JSON
- [ ] Tool comparison view
- [ ] SEO optimization suggestions
- [ ] Image upload and management
- [ ] Automated content generation improvements
- [ ] User activity logging and audit trail

### Integration Opportunities
- Google Analytics integration
- Stripe revenue tracking
- Email notifications for admin actions
- Slack/Discord webhooks for new tools
- GitHub Actions for automated deployments

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in browser console
3. Check Supabase logs for database errors
4. Review Next.js server logs for API issues

## License

This admin dashboard is part of the ToolForge AI project and follows the same license as the main application.
