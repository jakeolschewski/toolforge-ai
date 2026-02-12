# Enhanced Admin Dashboard Features

This document outlines all the advanced admin features that have been implemented in ToolForge AI.

## Overview

The admin dashboard now includes powerful bulk operations, import/export capabilities, batch review generation, and comprehensive system health monitoring.

## Features

### 1. Bulk Operations

**Location**: `/admin/tools` page

**Capabilities**:
- Select multiple tools using checkboxes (individual or select all)
- Bulk publish/unpublish tools
- Bulk feature/unfeature tools
- Bulk archive tools
- Bulk delete tools (with cascading delete of related data)
- Bulk category changes
- Bulk pricing model updates
- Bulk tag management (add/remove tags)

**Usage**:
1. Navigate to Tools page
2. Select tools using checkboxes
3. Use the bulk actions bar at the bottom of the page
4. Choose quick actions (publish, feature, etc.) or use the dropdown for advanced actions
5. Confirm the action
6. All selected tools will be updated in a single database transaction

**API Endpoint**: `/api/admin/bulk` (POST)

**Components**:
- `src/components/admin/BulkActions.tsx` - Bulk action toolbar

---

### 2. Import/Export System

#### Import Tools from CSV

**Location**: `/admin/import`

**Capabilities**:
- Upload CSV files with tool data
- Download template with correct format
- Field mapping interface
- Validation before import
- Preview data before confirming
- Duplicate detection
- Error handling with detailed messages
- Progress tracking

**CSV Format**:
```csv
Name,Description,Website URL,Category,Pricing Model,Starting Price,Features,Tags,Logo URL,Affiliate Link,Featured,Status
Example Tool,A powerful AI tool,https://example.com,AI Tools,freemium,$9.99/month,Feature1;Feature2,ai;productivity,https://logo.png,https://affiliate.com,false,published
```

**Validation**:
- Required fields: Name, Description, Website URL, Category
- URL format validation
- Pricing model validation (free, freemium, paid, subscription)
- Status validation (draft, published, archived)
- Duplicate URL detection

**API Endpoints**:
- `/api/admin/import` (POST) - Import data

**Components**:
- `src/components/admin/CSVImporter.tsx` - CSV upload and preview

#### Export Data to CSV

**Location**: `/admin/export`

**Capabilities**:
- Export tools to CSV
- Export reviews to CSV
- Export analytics to CSV
- Export click logs to CSV
- Filter by category, status, pricing, date range
- Custom field selection
- Multiple format options

**Filters Available**:
- Category
- Status (published, draft, archived)
- Pricing model
- Date range (from/to)
- Search query
- Author (for reviews)
- Minimum rating (for reviews)

**API Endpoint**: `/api/admin/export` (POST)

**Utilities**:
- `src/utils/csv.ts` - CSV parsing and generation
- `src/utils/import-validator.ts` - Import validation

---

### 3. Advanced Search & Filters

**Location**: `/admin/tools` page

**Capabilities**:
- Search by name or description
- Filter by category
- Filter by status (published, draft, archived)
- Filter by pricing model
- Filter by featured status
- Sort by various fields
- Real-time filtering

**Implementation**:
- Client-side filtering for instant results
- Combines multiple filters
- Case-insensitive search

---

### 4. Inline Editing (Quick Edit)

**Component**: `src/components/admin/InlineEdit.tsx`

**Capabilities**:
- Edit tool name inline
- Quick status dropdown
- Quick category change
- Click to edit, save/cancel buttons
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Auto-save on blur
- Visual feedback during saving

**Usage**:
```tsx
<InlineEdit
  value={tool.name}
  onSave={async (newValue) => {
    await updateTool(tool.id, { name: newValue });
  }}
/>
```

---

### 5. Batch Review Generator

**Location**: `/admin/batch-generate`

**Capabilities**:
- View all tools without reviews
- Select multiple tools
- Choose review template style:
  - Standard Review
  - Detailed Analysis
  - Quick Overview
  - Comparison Style
- Generate AI-powered reviews in bulk
- Reviews saved as drafts for manual review
- Progress tracking
- Error handling

**Templates**:
- **Standard**: Balanced review with pros, cons, and verdict
- **Detailed**: In-depth analysis with examples and use cases
- **Quick**: Short overview focusing on key features
- - **Comparison**: Review comparing to similar tools

**API Endpoints**:
- `/api/admin/tools-without-reviews` (GET) - Get tools without reviews
- `/api/admin/batch-generate-reviews` (POST) - Generate reviews

**Note**: The actual AI generation needs to be implemented using OpenAI API or similar.

---

### 6. System Health Dashboard

**Location**: `/admin/health`

**Capabilities**:
- Database health monitoring
- API response time tracking
- Storage usage statistics
- Last scraper run status
- Record counts (tools, reviews, users)
- Error logging
- Auto-refresh capability
- Visual status indicators (healthy, warning, error)

**Health Checks**:
1. **Database**
   - Connection test
   - Response time measurement
   - Record counts

2. **API**
   - Endpoint availability
   - Response time measurement
   - Error rate tracking

3. **Storage**
   - Total records count
   - Usage by entity type
   - Capacity warnings

4. **Scraper Status**
   - Last run timestamp
   - Tools added count
   - Error messages

**API Endpoint**: `/api/admin/health` (GET)

**Status Levels**:
- **Healthy** (green): System operating normally
- **Warning** (yellow): Degraded performance or approaching limits
- **Error** (red): Critical issues requiring attention

---

## Navigation

All admin features are accessible from the admin sidebar:

1. **Dashboard** - Overview and stats
2. **Pending Drafts** - Review submitted tools
3. **Tools** - Manage all tools (with bulk operations)
4. **Reviews** - Manage reviews
5. **Batch Generate** - Generate reviews in bulk
6. **Analytics** - View traffic and engagement data
7. **Import Data** - Import tools from CSV
8. **Export Data** - Export data to CSV
9. **System Health** - Monitor system status

---

## Database Schema

### Audit Log Table

All bulk operations and imports are logged for auditing:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_ids TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API Authentication

All admin API endpoints require authentication:

```typescript
Authorization: Bearer <ADMIN_TOKEN>
```

The admin token is stored in `sessionStorage` after login and sent with every API request.

---

## Error Handling

### Import Errors
- Validation errors show row number and field
- Duplicate detection with existing record IDs
- Partial imports allowed (skip invalid rows)
- Error summary in response

### Bulk Operation Errors
- Transaction-based updates (all or nothing)
- Detailed error messages
- Rollback on failure
- Audit logging

### Export Errors
- Large datasets are paginated
- Timeout protection
- Format validation
- Fallback to original data on error

---

## Performance Considerations

1. **Bulk Operations**
   - Use database transactions
   - Batch updates in chunks
   - Limit concurrent operations

2. **Import/Export**
   - Stream large files
   - Limit file size (recommended < 10MB)
   - Pagination for large exports
   - Background processing for large imports

3. **Health Monitoring**
   - Cached results (15-second cache)
   - Async health checks
   - Timeout protection

---

## Security

1. **Authentication**
   - Admin token required for all operations
   - Token stored securely in sessionStorage
   - Automatic logout on token expiration

2. **Input Validation**
   - CSV data sanitized before import
   - XSS protection
   - SQL injection prevention
   - URL validation

3. **Audit Logging**
   - All bulk operations logged
   - Import/export tracked
   - User actions recorded

---

## Future Enhancements

Potential improvements for the admin dashboard:

1. **Scheduled Imports**
   - Automatic CSV imports from URLs
   - Recurring import schedules
   - Email notifications

2. **Advanced Analytics**
   - Custom report builder
   - Date range comparisons
   - Export scheduled reports

3. **Bulk Edit Interface**
   - Visual bulk editor
   - Multi-field updates
   - Preview before save

4. **API Integrations**
   - Import from external sources
   - Sync with third-party services
   - Webhook support

5. **Role-Based Access**
   - Multiple admin levels
   - Permission system
   - Action restrictions

---

## Troubleshooting

### Import Issues

**Problem**: CSV import fails with validation errors

**Solution**:
1. Download the CSV template
2. Ensure all required fields are present
3. Check data formats (especially URLs and pricing models)
4. Remove duplicate entries
5. Try importing in smaller batches

**Problem**: Duplicate detection not working

**Solution**:
1. Check website_url field for exact matches
2. Ensure URLs include protocol (https://)
3. Compare with existing tools manually

### Bulk Operations

**Problem**: Bulk operation times out

**Solution**:
1. Reduce batch size (select fewer items)
2. Check database connection
3. Review system health dashboard

**Problem**: Changes not reflected immediately

**Solution**:
1. Refresh the page
2. Clear browser cache
3. Check audit logs for operation status

### Export Issues

**Problem**: Export file is empty

**Solution**:
1. Check filter settings
2. Ensure tools exist matching filters
3. Try exporting without filters

**Problem**: Export takes too long

**Solution**:
1. Use date range filters to limit results
2. Export in smaller batches
3. Use field selection to reduce data size

---

## Support

For issues or questions about admin features:

1. Check this documentation
2. Review error messages in browser console
3. Check system health dashboard
4. Review audit logs for operation history

---

## Changelog

### Version 1.0 (Current)
- Initial release of enhanced admin features
- Bulk operations for tools
- CSV import/export
- Batch review generator
- System health monitoring
- Inline editing
- Advanced search and filters
