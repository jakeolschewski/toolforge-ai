import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

interface SubscribeRequest {
  email: string;
  source?: string;
  variant?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hash IP address for privacy
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

// Get client IP address
function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return null;
}

// Send welcome email to new subscriber
async function sendWelcomeEmail(email: string): Promise<boolean> {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center; }
    .content { background: #ffffff; padding: 30px 20px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
    .feature { display: flex; align-items: start; gap: 12px; margin: 15px 0; }
    .feature-icon { background: #f3f4f6; border-radius: 8px; padding: 8px; min-width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
    .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">Welcome to ToolForge AI!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">You're now part of an exclusive community</p>
    </div>

    <div class="content">
      <h2 style="color: #667eea; margin-top: 0;">Thanks for subscribing! 🎉</h2>

      <p>You've just joined 10,000+ AI enthusiasts who are staying ahead of the curve with our weekly newsletter.</p>

      <div class="divider"></div>

      <h3 style="color: #1f2937;">Here's what you'll receive:</h3>

      <div class="feature">
        <div class="feature-icon">✨</div>
        <div>
          <strong>Weekly AI Tool Roundups</strong>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Discover the latest and most innovative AI tools before they go mainstream</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">💰</div>
        <div>
          <strong>Exclusive Deals & Discounts</strong>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Get access to special offers, up to 50% off premium AI tools</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">🚀</div>
        <div>
          <strong>Expert Tips & Tutorials</strong>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Learn how to maximize your productivity with AI-powered workflows</p>
        </div>
      </div>

      <div class="feature">
        <div class="feature-icon">🎯</div>
        <div>
          <strong>Early Access</strong>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Be the first to know about new tool launches and beta programs</p>
        </div>
      </div>

      <div class="divider"></div>

      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/tools" class="btn">Explore AI Tools</a>
      </p>

      <p style="color: #6b7280; font-size: 14px;">
        Your first newsletter will arrive next week. In the meantime, check out our latest tool reviews and comparisons!
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
        You're receiving this because you subscribed to ToolForge AI
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> |
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Welcome to ToolForge AI!

Thanks for subscribing! You've just joined 10,000+ AI enthusiasts who are staying ahead of the curve with our weekly newsletter.

Here's what you'll receive:

✨ Weekly AI Tool Roundups
Discover the latest and most innovative AI tools before they go mainstream

💰 Exclusive Deals & Discounts
Get access to special offers, up to 50% off premium AI tools

🚀 Expert Tips & Tutorials
Learn how to maximize your productivity with AI-powered workflows

🎯 Early Access
Be the first to know about new tool launches and beta programs

Your first newsletter will arrive next week. In the meantime, check out our latest tool reviews and comparisons at ${process.env.NEXT_PUBLIC_APP_URL}/tools

---
Unsubscribe: ${unsubscribeUrl}
Privacy Policy: ${process.env.NEXT_PUBLIC_APP_URL}/privacy
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to ToolForge AI - You're All Set!",
    html,
    text,
  });
}

// Integrate with Mailchimp (if configured)
async function syncToMailchimp(email: string, source: string): Promise<boolean> {
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpListId = process.env.MAILCHIMP_LIST_ID;
  const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!mailchimpApiKey || !mailchimpListId || !mailchimpServerPrefix) {
    console.log('Mailchimp not configured, skipping sync');
    return false;
  }

  try {
    const response = await fetch(
      `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${mailchimpApiKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: [source],
          merge_fields: {
            SOURCE: source,
          },
        }),
      }
    );

    if (response.ok) {
      console.log('✅ Synced to Mailchimp:', email);
      return true;
    } else {
      const error = await response.json();
      console.error('Mailchimp sync error:', error);
      return false;
    }
  } catch (error) {
    console.error('Mailchimp sync failed:', error);
    return false;
  }
}

// Integrate with ConvertKit (if configured)
async function syncToConvertKit(email: string, source: string): Promise<boolean> {
  const convertKitApiKey = process.env.CONVERTKIT_API_KEY;
  const convertKitFormId = process.env.CONVERTKIT_FORM_ID;

  if (!convertKitApiKey || !convertKitFormId) {
    console.log('ConvertKit not configured, skipping sync');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: convertKitApiKey,
          email,
          tags: [source],
        }),
      }
    );

    if (response.ok) {
      console.log('✅ Synced to ConvertKit:', email);
      return true;
    } else {
      const error = await response.json();
      console.error('ConvertKit sync error:', error);
      return false;
    }
  } catch (error) {
    console.error('ConvertKit sync failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, source = 'unknown', variant } = body;

    // Validate email
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Get client information
    const clientIP = getClientIP(request);
    const ipHash = clientIP ? hashIP(clientIP) : null;
    const userAgent = request.headers.get('user-agent');
    const referrer = request.headers.get('referer');

    // Check if email already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, status')
      .eq('email', normalizedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // If already subscribed
    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { message: 'You are already subscribed!' },
          { status: 200 }
        );
      } else if (existing.status === 'unsubscribed') {
        // Reactivate subscription
        const { error: updateError } = await supabaseAdmin
          .from('email_subscribers')
          .update({
            status: 'active',
            source,
            variant,
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Reactivation error:', updateError);
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        await sendWelcomeEmail(normalizedEmail);

        return NextResponse.json({
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
    }

    // Create new subscriber
    const { error: insertError } = await supabaseAdmin
      .from('email_subscribers')
      .insert({
        email: normalizedEmail,
        status: 'active',
        source,
        variant,
        ip_hash: ipHash,
        user_agent: userAgent,
        referrer,
        confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // Send welcome email
    const emailSent = await sendWelcomeEmail(normalizedEmail);

    if (!emailSent) {
      console.warn('Failed to send welcome email to:', normalizedEmail);
    }

    // Sync to third-party services (non-blocking)
    Promise.all([
      syncToMailchimp(normalizedEmail, source),
      syncToConvertKit(normalizedEmail, source),
    ]).catch((error) => {
      console.error('Third-party sync error:', error);
    });

    // Log analytics event
    if (process.env.NODE_ENV === 'production') {
      console.log('📧 New subscriber:', {
        email: normalizedEmail,
        source,
        variant,
      });
    }

    return NextResponse.json({
      message: 'Successfully subscribed! Check your email for a welcome message.',
      success: true,
    });

  } catch (error) {
    console.error('Subscribe endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
