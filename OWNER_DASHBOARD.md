# Owner Financial Dashboard

A comprehensive financial management system for ToolForge AI, providing secure access to revenue analytics, payout tracking, and expense management.

## Features

### 1. Main Dashboard (`/owner`)
- **Financial Summary Cards**: Total revenue, expenses, net profit, and pending payouts
- **Revenue Trends Chart**: 12-month visual representation of revenue by source
- **Top Earning Tools**: Top 5 tools with conversion rates and earnings
- **Recent Payouts**: Latest payout status and amounts
- **Quick Export**: One-click CSV export for accounting

### 2. Revenue Analytics (`/owner/revenue`)
- Revenue breakdown by source (affiliates, memberships, ads, sponsorships)
- Click-to-conversion tracking
- Top performing tools with detailed metrics
- Conversion rate analysis
- Monthly revenue trends visualization

### 3. Payout Management (`/owner/payouts`)
- Track all affiliate and network payouts
- Filter by network, status, and date
- Mark payouts as received with one click
- Add new payouts manually
- Edit and delete payout records
- Status tracking: Pending, Received, Failed

### 4. Expense Tracking (`/owner/expenses`)
- Comprehensive expense logging
- Category-based organization
- Tax-deductible expense tracking
- Recurring expense management
- Receipt URL storage
- Monthly/yearly expense reports
- Vendor and invoice tracking

## Setup Instructions

### 1. Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# The migration file is located at:
prisma/migrations/001_owner_financial_tables.sql
```

This creates:
- `payouts` table
- `expenses` table
- `revenue_logs` table
- `owner_audit_logs` table
- Database views for analytics
- Triggers for automatic timestamp updates

### 2. Environment Variables

Add to your `.env.local` file:

```env
# Owner password (MUST be different from ADMIN_PASSWORD)
OWNER_PASSWORD=your_secure_owner_password_here
```

**Security Note**: The owner password should be different from the admin password to provide separation of concerns.

### 3. Access the Dashboard

1. Navigate to `/owner` in your browser
2. Enter the owner password
3. Session authentication is stored locally

## API Routes

All API routes require Bearer token authentication using the owner password.

### Revenue API
- `GET /api/owner/revenue?view=summary` - Financial summary
- `GET /api/owner/revenue?view=by-tool` - Revenue by tool
- `GET /api/owner/revenue?view=trends` - Monthly trends
- `GET /api/owner/revenue?view=by-source` - Revenue by source

### Payouts API
- `GET /api/owner/payouts` - List all payouts
- `POST /api/owner/payouts` - Create new payout
- `PATCH /api/owner/payouts` - Update payout
- `DELETE /api/owner/payouts?id={id}` - Delete payout

### Expenses API
- `GET /api/owner/expenses` - List expenses
- `GET /api/owner/expenses?view=categories` - Category summary
- `POST /api/owner/expenses` - Create expense
- `PATCH /api/owner/expenses` - Update expense
- `DELETE /api/owner/expenses?id={id}` - Delete expense

### Export API
- `GET /api/owner/export?type=payouts&format=csv` - Export payouts
- `GET /api/owner/export?type=expenses&format=csv` - Export expenses
- `GET /api/owner/export?type=revenue&format=csv` - Export revenue
- `GET /api/owner/export?type=profit-loss&format=csv` - Export P&L statement

## Security Features

### Authentication
- Separate password from admin dashboard
- Session-based authentication
- Bearer token required for all API calls
- No default credentials

### Audit Logging
All financial actions are logged in `owner_audit_logs`:
- Create, update, delete operations
- IP address tracking
- User agent logging
- Old and new data snapshots

### Data Protection
- Server-side validation
- SQL injection prevention via Supabase
- XSS protection in forms
- HTTPS required in production

## Usage Guide

### Adding a Payout

1. Go to `/owner/payouts`
2. Click "Add Payout"
3. Fill in:
   - Network (required): e.g., "Impact", "ShareASale"
   - Tool Name (optional)
   - Amount (required)
   - Payment Method (optional)
   - Due Date (optional)
   - Notes (optional)
4. Click "Add Payout"

### Marking Payout as Received

1. Find the pending payout in the list
2. Click "Mark Received" button
3. The status will update to "Received" with today's date

### Adding an Expense

1. Go to `/owner/expenses`
2. Click "Add Expense"
3. Fill in required fields:
   - Category
   - Description
   - Amount
   - Expense Date
4. Optional fields:
   - Subcategory
   - Vendor
   - Invoice Number
   - Payment Method
   - Receipt URL
   - Tax deductible checkbox
   - Recurring expense settings
5. Click "Add Expense"

### Exporting Data for Taxes

1. Go to main dashboard (`/owner`)
2. Click "Export" button
3. Choose export type:
   - **Payouts**: All payout records
   - **Expenses**: Tax-deductible expenses
   - **Revenue**: Detailed revenue logs
   - **P&L Statement**: Monthly profit/loss breakdown
4. CSV file downloads automatically
5. Import into Excel, QuickBooks, or tax software

### Filtering and Searching

#### Payouts
- Filter by status: All, Pending, Received, Failed
- Filter by network
- Search by network or tool name

#### Expenses
- Filter by category
- Filter by year
- Search by description, vendor, or category

## Components

### Financial Summary Component
Location: `src/components/owner/FinancialSummary.tsx`
- Displays 4 key metric cards
- Responsive grid layout
- Color-coded by financial health

### Revenue Chart Component
Location: `src/components/owner/RevenueChart.tsx`
- 12-month horizontal bar chart
- Stacked by revenue source
- Interactive tooltips
- Color-coded legend

### Payouts List Component
Location: `src/components/owner/PayoutsList.tsx`
- Sortable table view
- Inline editing
- Quick actions (mark received, edit, delete)
- Status badges

### Expense Form Component
Location: `src/components/owner/ExpenseForm.tsx`
- Modal form
- Category dropdown
- Tax deductible toggle
- Recurring expense support
- Receipt URL field

## Database Schema

### Payouts Table
```sql
- id (UUID, primary key)
- network (string, required)
- tool_id (UUID, nullable)
- tool_name (string, nullable)
- amount (decimal, required)
- currency (string, default: USD)
- status (enum: pending, received, failed)
- payment_method (string)
- transaction_id (string)
- reference_number (string)
- payment_date (date)
- due_date (date)
- received_date (date)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Expenses Table
```sql
- id (UUID, primary key)
- category (string, required)
- subcategory (string)
- description (text, required)
- amount (decimal, required)
- currency (string, default: USD)
- expense_date (date, required)
- payment_method (string)
- vendor (string)
- invoice_number (string)
- is_recurring (boolean, default: false)
- recurrence_period (enum: monthly, yearly, quarterly)
- is_tax_deductible (boolean, default: true)
- tax_category (string)
- receipt_url (text)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Revenue Logs Table
```sql
- id (UUID, primary key)
- source (enum: affiliate, membership, ads, sponsorship, other)
- tool_id (UUID, nullable)
- tool_name (string)
- network (string)
- amount (decimal, required)
- currency (string, default: USD)
- commission_rate (decimal, percentage)
- clicks (integer, default: 0)
- conversions (integer, default: 0)
- conversion_date (date)
- payout_id (UUID, nullable)
- metadata (JSONB)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## Troubleshooting

### Cannot Login
- Verify `OWNER_PASSWORD` is set in `.env.local`
- Restart Next.js dev server after adding env variable
- Clear browser session storage and try again

### API Returns Unauthorized
- Check that owner password is correct
- Verify token is being sent in Authorization header
- Check browser console for error messages

### Data Not Showing
- Verify database tables were created successfully
- Check Supabase logs for errors
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly

### Export Not Working
- Verify owner authentication is active
- Check browser console for errors
- Ensure API route has correct permissions

## Best Practices

### Financial Record Keeping
1. **Log expenses immediately** - Don't wait until tax time
2. **Save receipts** - Upload receipt URLs for all expenses
3. **Mark payouts received** - Update status when payment clears
4. **Monthly exports** - Download data monthly for backup
5. **Categorize accurately** - Use consistent categories for reporting

### Tax Preparation
1. Export expenses for the tax year
2. Filter by "tax deductible" checkbox
3. Group by category for Schedule C
4. Keep CSV exports with tax records
5. Cross-reference with bank statements

### Revenue Tracking
1. Review conversion rates monthly
2. Identify top-performing tools
3. Track commission rate changes
4. Monitor payment cycles by network
5. Set up recurring expense reminders

## Future Enhancements

Potential additions:
- [ ] Automated payout reminders via email
- [ ] Integration with Stripe for automatic revenue import
- [ ] Budget forecasting based on trends
- [ ] Multi-currency support
- [ ] Custom category creation
- [ ] Bulk import from CSV
- [ ] Calendar view for expenses
- [ ] Tax form generation (1099, Schedule C)
- [ ] Revenue forecasting with ML
- [ ] Mobile app for expense logging

## Support

For issues or questions about the owner dashboard:
1. Check this documentation
2. Review database migrations
3. Check Supabase logs
4. Verify environment variables
5. Clear cache and restart dev server

---

**Remember**: Keep your owner password secure and different from your admin password. This dashboard contains sensitive financial information.
