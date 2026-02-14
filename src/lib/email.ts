// Email Service using Nodemailer

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

interface DiscoverySummary {
  scraped: number;
  saved: number;
  duplicates: number;
  errors: number;
  duration: number;
}

interface ApprovalReminder {
  pendingCount: number;
  oldestPendingDate?: string;
}

let transporter: Transporter | null = null;

// Initialize email transporter
function getTransporter(): Transporter {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const emailHost = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10);

  if (!emailUser || !emailPass) {
    console.warn('Email credentials not configured. Emails will not be sent.');
    // Return a dummy transporter for development
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendMail: async (options: any) => {
        console.log('📧 [DEV MODE] Email would be sent:', {
          to: options.to,
          subject: options.subject,
        });
        return { messageId: 'dev-mode-' + Date.now() };
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporter;
}

// Generic email sending function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.EMAIL_USER || 'noreply@toolforge.ai';

    await transport.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    });

    console.log('✅ Email sent successfully:', options.subject);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Daily discovery digest email
export async function sendDiscoveryDigest(summary: DiscoverySummary): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured. Skipping discovery digest.');
    return false;
  }

  const subject = `ToolForge AI - Daily Discovery: ${summary.saved} New Tools Found`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
    .stat-card { background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
    .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { font-size: 14px; color: #6b7280; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Daily Discovery Report</h1>
      <p>Your automated tool discovery ran successfully</p>
    </div>
    <div class="content">
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">${summary.saved}</div>
          <div class="stat-label">New Tools Saved</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${summary.scraped}</div>
          <div class="stat-label">Total Scraped</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${summary.duplicates}</div>
          <div class="stat-label">Duplicates Filtered</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${summary.errors}</div>
          <div class="stat-label">Errors</div>
        </div>
      </div>

      <p><strong>Duration:</strong> ${(summary.duration / 1000).toFixed(2)} seconds</p>

      ${summary.saved > 0 ? `
        <p>🎉 Great news! ${summary.saved} new tool${summary.saved === 1 ? '' : 's'} ${summary.saved === 1 ? 'was' : 'were'} discovered and saved to your database.</p>
        <p>These tools are waiting for your review in the admin dashboard.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai'}/admin/dashboard" class="btn">Review New Tools</a>
      ` : `
        <p>No new tools were found in this run. The scrapers will continue monitoring for new additions.</p>
      `}

      ${summary.errors > 0 ? `
        <p style="color: #dc2626;">⚠️ ${summary.errors} error${summary.errors === 1 ? '' : 's'} occurred during scraping. Please check the logs for details.</p>
      ` : ''}
    </div>
    <div class="footer">
      <p>ToolForge AI - Automated Tool Discovery</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
ToolForge AI - Daily Discovery Report

New Tools Saved: ${summary.saved}
Total Scraped: ${summary.scraped}
Duplicates Filtered: ${summary.duplicates}
Errors: ${summary.errors}
Duration: ${(summary.duration / 1000).toFixed(2)} seconds

${summary.saved > 0
  ? `${summary.saved} new tool${summary.saved === 1 ? '' : 's'} ${summary.saved === 1 ? 'was' : 'were'} discovered and saved.`
  : 'No new tools were found in this run.'
}

${summary.errors > 0 ? `⚠️ ${summary.errors} error${summary.errors === 1 ? '' : 's'} occurred during scraping.` : ''}

View admin dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai'}/admin/dashboard
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

// Approval reminder email
export async function sendApprovalReminder(data: ApprovalReminder): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured. Skipping approval reminder.');
    return false;
  }

  const subject = `ToolForge AI - ${data.pendingCount} Tools Awaiting Approval`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    .btn { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Approval Reminder</h1>
      <p>You have pending tools waiting for review</p>
    </div>
    <div class="content">
      <div class="highlight">
        <h2 style="margin-top: 0;">${data.pendingCount} Tool${data.pendingCount === 1 ? '' : 's'} Awaiting Approval</h2>
        ${data.oldestPendingDate ? `<p>Oldest pending tool: ${new Date(data.oldestPendingDate).toLocaleDateString()}</p>` : ''}
      </div>

      <p>These discovered tools are waiting for your review and approval before they can be published to the site.</p>

      <p>Review and approve tools to:</p>
      <ul>
        <li>Keep your content fresh and up-to-date</li>
        <li>Maintain SEO rankings with new content</li>
        <li>Provide value to your users</li>
      </ul>

      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai'}/admin/dashboard" class="btn">Review Pending Tools</a>
    </div>
    <div class="footer">
      <p>ToolForge AI - Content Management</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
ToolForge AI - Approval Reminder

${data.pendingCount} tool${data.pendingCount === 1 ? '' : 's'} awaiting approval
${data.oldestPendingDate ? `Oldest pending: ${new Date(data.oldestPendingDate).toLocaleDateString()}` : ''}

Review and approve tools to keep your content fresh and maintain SEO rankings.

View pending tools: ${process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai'}/admin/dashboard
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

// Error notification email
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendErrorNotification(errorMessage: string, context?: any): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;

  const subject = 'ToolForge AI - Error Alert';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .error { background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; font-family: monospace; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Error Alert</h1>
      <p>An error occurred in your ToolForge AI automation</p>
    </div>
    <div class="content">
      <div class="error">
        <strong>Error:</strong><br>
        ${errorMessage}
      </div>
      ${context ? `
        <h3>Context:</h3>
        <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(context, null, 2)}</pre>
      ` : ''}
      <p>Please check your logs for more details.</p>
    </div>
    <div class="footer">
      <p>ToolForge AI - Error Monitoring</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  });
}

// Test email configuration
export async function sendTestEmail(to: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: 'ToolForge AI - Email Configuration Test',
    html: `
      <h1>✅ Email Configuration Successful</h1>
      <p>Your ToolForge AI email system is properly configured and working!</p>
      <p>You will now receive:</p>
      <ul>
        <li>Daily discovery digests</li>
        <li>Approval reminders</li>
        <li>Error notifications</li>
      </ul>
    `,
  });
}
