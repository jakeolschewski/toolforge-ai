# Admin Dashboard - Quick Start Guide

Get started with the ToolForge AI admin dashboard in 5 minutes.

## Step 1: Set Admin Password

Add your admin password to `.env.local`:

```bash
echo "ADMIN_PASSWORD=your_secure_password_here" >> .env.local
```

**Important**: Choose a strong password with at least 12 characters, including uppercase, lowercase, numbers, and symbols.

## Step 2: Start Development Server

```bash
npm run dev
```

## Step 3: Access Admin Dashboard

Open your browser and navigate to:

```
http://localhost:3000/admin
```

## Step 4: Login

Enter the password you set in Step 1.

## Step 5: Explore the Dashboard

Once logged in, you'll see:

### Main Dashboard
- Overview stats (tools, drafts, views, clicks)
- Quick action cards
- Recently published tools

### Navigation Menu (Left Sidebar)
- **Dashboard** - Home page with overview
- **Pending Drafts** - Review and approve scraped tools
- **Tools** - Manage all tools (edit, delete, feature)
- **Reviews** - Manage reviews (edit, publish)
- **Analytics** - Performance metrics and insights

## Common Tasks

### Approve a Scraped Tool

1. Go to **Pending Drafts**
2. Review the tool information
3. Click **Approve** to publish (auto-generates review)
4. Or click **Ignore** to skip

### Edit a Tool

1. Go to **Tools**
2. Find the tool you want to edit
3. Click the **Edit** icon
4. Update the information
5. Click **Save Changes**

### Publish a Review

1. Go to **Reviews**
2. Find the draft review
3. Click **Publish**
4. Or click **Edit** to modify before publishing

### View Analytics

1. Go to **Analytics**
2. See top tools by views and clicks
3. Check category distribution
4. Review recent activity

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
3. **Rotate passwords regularly** (every 90 days)
4. **Limit access** - only share with trusted team members
5. **Monitor activity** - check analytics regularly for unusual patterns

## Troubleshooting

### Can't login?
- Check password in `.env.local` matches what you're typing
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache and try again

### Data not loading?
- Check Supabase credentials in `.env.local`
- Verify database tables exist
- Check browser console for errors

### API errors?
- Make sure you're logged in
- Check network tab in browser dev tools
- Verify middleware is not blocking requests

## Production Deployment

When deploying to production:

1. Set `ADMIN_PASSWORD` in your hosting platform's environment variables
2. Use a different password than development
3. Enable HTTPS (required for secure password transmission)
4. Consider adding rate limiting to prevent brute force attacks
5. Set up monitoring and alerts for admin actions

## Next Steps

- Read the full documentation: `ADMIN_DASHBOARD.md`
- Set up automated backups for your database
- Configure email notifications for new scraped tools
- Customize the dashboard to fit your workflow
- Consider implementing two-factor authentication

## Support

Need help? Check:
1. Full documentation in `ADMIN_DASHBOARD.md`
2. Browser console for JavaScript errors
3. Next.js server logs for API errors
4. Supabase dashboard for database issues

---

Happy managing! 🚀
