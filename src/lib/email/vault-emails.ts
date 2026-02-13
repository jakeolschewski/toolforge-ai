/**
 * Email Templates for Workflow Vault
 * Handles purchase confirmations, welcome emails, and notifications
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.WORKFLOW_NOTIFICATIONS_EMAIL || 'notifications@toolforge.ai';
const SUPPORT_EMAIL = process.env.WORKFLOW_SUPPORT_EMAIL || 'support@toolforge.ai';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge-ai.vercel.app';

/**
 * Send purchase confirmation email
 */
export async function sendPurchaseConfirmationEmail(
  userId: string,
  workflowId: string,
  purchaseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user and workflow details
    const { supabaseAdmin } = await import('@/lib/supabase');

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    const { data: workflow } = await supabaseAdmin
      .from('workflows')
      .select('name, slug, description')
      .eq('id', workflowId)
      .single();

    if (!user || !workflow) {
      return { success: false, error: 'User or workflow not found' };
    }

    const downloadUrl = `${APP_URL}/vault/my-vault?purchase=${purchaseId}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Your ${workflow.name} Workflow is Ready! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Confirmation</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .highlight { background: #f3f4f6; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✅ Purchase Confirmed!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your workflow is ready to download</p>
              </div>

              <div class="content">
                <p>Hi ${user.name || 'there'},</p>

                <p>Thank you for purchasing <strong>${workflow.name}</strong>! Your workflow package is ready and waiting for you.</p>

                <div class="highlight">
                  <h3 style="margin-top: 0;">📦 What's Included:</h3>
                  <ul>
                    <li>Complete SOP Guide (Step-by-step instructions)</li>
                    <li>10 Prompt Variants (Works with any AI tool)</li>
                    <li>Quality Control Checklist</li>
                    <li>Example Outputs & Templates</li>
                    <li>Privacy & Redaction Guide</li>
                    <li>Export Templates (Notion, ClickUp, Excel)</li>
                  </ul>
                </div>

                <p style="text-align: center;">
                  <a href="${downloadUrl}" class="button">Download Your Workflow →</a>
                </p>

                <h3>🎯 Quick Start Guide:</h3>
                <ol>
                  <li>Download all files from your vault</li>
                  <li>Read the SOP guide first (2-3 pages)</li>
                  <li>Choose a prompt variant that fits your needs</li>
                  <li>Follow the step-by-step instructions</li>
                  <li>Use the QC checklist to verify quality</li>
                </ol>

                <h3>⚠️ Important Reminder:</h3>
                <p style="font-size: 14px; color: #666;">
                  This workflow is for <strong>educational purposes only</strong>. Results may vary based on your specific situation.
                  Not legal, financial, medical, or professional advice. Always consult licensed professionals for specific guidance.
                </p>

                <h3>💡 Need Help?</h3>
                <p>
                  Questions? Issues? We're here to help!<br>
                  Email us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
                </p>

                <p>Happy workflow building!</p>
                <p>
                  <strong>The ToolForge AI Team</strong><br>
                  <a href="${APP_URL}">toolforge-ai.vercel.app</a>
                </p>
              </div>

              <div class="footer">
                <p>© ${new Date().getFullYear()} ToolForge AI. All rights reserved.</p>
                <p>
                  <a href="${APP_URL}/vault/my-vault">My Vault</a> |
                  <a href="${SUPPORT_EMAIL}">Support</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending purchase confirmation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send membership welcome email
 */
export async function sendMembershipWelcomeEmail(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase');

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const vaultUrl = `${APP_URL}/vault`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Welcome to Workflow Vault Membership! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to Membership</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .benefit { background: #f9fafb; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #10b981; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">🎉 Welcome to the Vault!</h1>
                <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">You now have unlimited access to all 50 workflows</p>
              </div>

              <div class="content">
                <p>Hi ${user.name || 'there'},</p>

                <p>Congratulations! Your Workflow Vault membership is now active. You have instant access to our complete library of 50 AI-powered workflows.</p>

                <h3>✨ Your Membership Benefits:</h3>

                <div class="benefit">
                  <strong>🔓 All 50 Workflows</strong><br>
                  Instant access to every workflow across all 9 business systems
                </div>

                <div class="benefit">
                  <strong>♾️ Unlimited Downloads</strong><br>
                  Download files as many times as you need, no limits
                </div>

                <div class="benefit">
                  <strong>🔄 Lifetime Updates</strong><br>
                  Get all workflow updates and improvements automatically
                </div>

                <div class="benefit">
                  <strong>⚡ Priority Support</strong><br>
                  Jump the queue with dedicated member support
                </div>

                <div class="benefit">
                  <strong>🎁 Early Access</strong><br>
                  Be first to try new workflows before public release
                </div>

                <p style="text-align: center; margin-top: 30px;">
                  <a href="${vaultUrl}" class="button">Explore Your Vault →</a>
                </p>

                <h3>🚀 Recommended Workflows to Start With:</h3>
                <ol>
                  <li><strong>Daily Chaos-to-Plan Converter</strong> - Get organized in minutes</li>
                  <li><strong>Email Response Optimizer</strong> - Save hours on inbox management</li>
                  <li><strong>Content Production OS</strong> - Create better content faster</li>
                  <li><strong>Decision Matrix</strong> - Make confident strategic choices</li>
                </ol>

                <h3>💡 Pro Tips:</h3>
                <ul>
                  <li>Start with one workflow and master it before moving to the next</li>
                  <li>Customize the prompts to fit your specific needs</li>
                  <li>Use the QC checklists to ensure quality outputs</li>
                  <li>Join our community to share wins and get feedback</li>
                </ul>

                <p>Questions? Reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>

                <p>Here's to your success!</p>
                <p>
                  <strong>The ToolForge AI Team</strong>
                </p>
              </div>

              <div class="footer">
                <p>Manage your membership in your <a href="${APP_URL}/membership/manage">account settings</a></p>
                <p>© ${new Date().getFullYear()} ToolForge AI. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error sending membership welcome:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send download ready notification
 */
export async function sendDownloadReadyEmail(
  email: string,
  workflowName: string,
  downloadUrl: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your ${workflowName} download is ready`,
    html: `
      <p>Your workflow files are ready to download:</p>
      <p><a href="${downloadUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Now</a></p>
      <p><small>This link expires in 1 hour for security.</small></p>
    `,
  });
}
