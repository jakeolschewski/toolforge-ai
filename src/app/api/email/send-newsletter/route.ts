import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

// Verify cron secret
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

// Get top tools of the week
async function getTopToolsOfWeek(limit: number = 5) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const { data: tools, error } = await supabaseAdmin
      .from('Tool')
      .select('id, name, slug, tagline, description, logoUrl, rating, category, pricingModel, affiliateLink, websiteUrl')
      .eq('status', 'published')
      .gte('createdAt', oneWeekAgo.toISOString())
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top tools:', error);
      return [];
    }

    return tools || [];
  } catch (error) {
    console.error('Error in getTopToolsOfWeek:', error);
    return [];
  }
}

// Get latest blog posts
async function getLatestBlogPosts(limit: number = 3) {
  try {
    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image, category, published_at')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error('Error in getLatestBlogPosts:', error);
    return [];
  }
}

// Generate newsletter HTML
function generateNewsletterHTML(tools: any[], posts: any[]) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai';
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const toolsHTML = tools.map((tool, index) => `
    <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <div style="display: flex; gap: 16px; align-items: start;">
        ${tool.logoUrl ? `
          <img src="${tool.logoUrl}" alt="${tool.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" />
        ` : `
          <div style="width: 60px; height: 60px; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">
            ${index + 1}
          </div>
        `}
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1f2937;">
            <a href="${appUrl}/tools/${tool.slug}${tool.affiliateLink ? `?ref=newsletter` : ''}" style="color: #667eea; text-decoration: none;">
              ${tool.name}
            </a>
          </h3>
          ${tool.tagline ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-style: italic;">${tool.tagline}</p>` : ''}
          <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">${tool.description}</p>
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            ${tool.category ? `<span style="background: #f3f4f6; padding: 4px 12px; border-radius: 6px; font-size: 12px; color: #6b7280;">${tool.category}</span>` : ''}
            ${tool.pricingModel ? `<span style="background: #fef3c7; padding: 4px 12px; border-radius: 6px; font-size: 12px; color: #92400e;">${tool.pricingModel}</span>` : ''}
            ${tool.rating ? `<span style="color: #fbbf24; font-size: 14px;">⭐ ${tool.rating.toFixed(1)}</span>` : ''}
          </div>
          <div style="margin-top: 12px;">
            <a href="${tool.affiliateLink || tool.websiteUrl}?ref=newsletter" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
              Try ${tool.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  const postsHTML = posts.length > 0 ? `
    <div style="margin-top: 40px;">
      <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Latest from Our Blog</h2>
      ${posts.map(post => `
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          ${post.featured_image ? `
            <img src="${post.featured_image}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;" />
          ` : ''}
          <div style="background: #f3f4f6; display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; color: #6b7280; margin-bottom: 8px;">
            ${post.category}
          </div>
          <h3 style="margin: 8px 0; font-size: 18px; color: #1f2937;">
            <a href="${appUrl}/blog/${post.slug}?ref=newsletter" style="color: #667eea; text-decoration: none;">
              ${post.title}
            </a>
          </h3>
          ${post.excerpt ? `<p style="margin: 8px 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">${post.excerpt}</p>` : ''}
          <a href="${appUrl}/blog/${post.slug}?ref=newsletter" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 600;">
            Read More →
          </a>
        </div>
      `).join('')}
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ToolForge AI Weekly Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700;">ToolForge AI</h1>
      <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Weekly AI Tool Roundup</p>
      <p style="margin: 5px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">${currentDate}</p>
    </div>

    <!-- Content -->
    <div style="background: #ffffff; padding: 30px 20px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 0;">
        Hey there! 👋
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Here are the top ${tools.length} AI tools that caught our attention this week. These tools are trending, innovative, and worth checking out!
      </p>

      <h2 style="color: #1f2937; font-size: 24px; margin: 30px 0 20px 0;">Top Tools This Week</h2>

      ${toolsHTML}

      ${postsHTML}

      <!-- CTA Section -->
      <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; margin-top: 40px; text-align: center;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px;">Discover More AI Tools</h3>
        <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
          Browse our complete directory of 1,000+ AI tools
        </p>
        <a href="${appUrl}/tools?ref=newsletter" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Explore All Tools
        </a>
      </div>

      <!-- Social -->
      <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Follow us for daily AI updates</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <a href="https://twitter.com/toolforgeai" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 600;">Twitter</a>
          <span style="color: #d1d5db;">•</span>
          <a href="https://linkedin.com/company/toolforgeai" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 600;">LinkedIn</a>
          <span style="color: #d1d5db;">•</span>
          <a href="${appUrl}/blog" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 600;">Blog</a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 30px 20px; text-align: center; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
        You're receiving this because you subscribed to ToolForge AI
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        <a href="${appUrl}/unsubscribe?email={{email}}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> |
        <a href="${appUrl}/preferences?email={{email}}" style="color: #667eea; text-decoration: none;">Email Preferences</a> |
        <a href="${appUrl}/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
      </p>
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} ToolForge AI. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate plain text version
function generateNewsletterText(tools: any[], posts: any[]) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai';
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const toolsText = tools.map((tool, index) => `
${index + 1}. ${tool.name}
${tool.tagline || ''}

${tool.description}

Category: ${tool.category} | Pricing: ${tool.pricingModel}${tool.rating ? ` | Rating: ${tool.rating.toFixed(1)}⭐` : ''}

Try it now: ${tool.affiliateLink || tool.websiteUrl}?ref=newsletter
Learn more: ${appUrl}/tools/${tool.slug}

---
  `).join('\n');

  const postsText = posts.length > 0 ? `

LATEST FROM OUR BLOG
===================

${posts.map(post => `
${post.title}
${post.excerpt || ''}

Read more: ${appUrl}/blog/${post.slug}?ref=newsletter

---
  `).join('\n')}
  ` : '';

  return `
TOOLFORGE AI - WEEKLY ROUNDUP
${currentDate}

Hey there! 👋

Here are the top ${tools.length} AI tools that caught our attention this week. These tools are trending, innovative, and worth checking out!

TOP TOOLS THIS WEEK
==================

${toolsText}

${postsText}

DISCOVER MORE
=============

Browse our complete directory of 1,000+ AI tools:
${appUrl}/tools?ref=newsletter

---

Follow us:
Twitter: https://twitter.com/toolforgeai
LinkedIn: https://linkedin.com/company/toolforgeai
Blog: ${appUrl}/blog

You're receiving this because you subscribed to ToolForge AI.
Unsubscribe: ${appUrl}/unsubscribe?email={{email}}
Privacy Policy: ${appUrl}/privacy

© ${new Date().getFullYear()} ToolForge AI. All rights reserved.
  `;
}

// Send newsletter to all active subscribers
async function sendNewsletterToSubscribers(
  subject: string,
  htmlContent: string,
  textContent: string
) {
  try {
    // Get all active subscribers
    const { data: subscribers, error } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, email')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching subscribers:', error);
      return { sent: 0, failed: 0, total: 0 };
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return { sent: 0, failed: 0, total: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send in batches of 50 to avoid rate limits
    const batchSize = 50;
    const batches = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const sendPromises = batch.map(async (subscriber) => {
        const personalizedHTML = htmlContent.replace(/{{email}}/g, encodeURIComponent(subscriber.email));
        const personalizedText = textContent.replace(/{{email}}/g, encodeURIComponent(subscriber.email));

        const success = await sendEmail({
          to: subscriber.email,
          subject,
          html: personalizedHTML,
          text: personalizedText,
        });

        return success;
      });

      const results = await Promise.allSettled(sendPromises);

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          sentCount++;
        } else {
          failedCount++;
        }
      });

      // Wait 1 second between batches to respect rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Create newsletter send record
    await supabaseAdmin.from('newsletter_sends').insert({
      subject,
      content_html: htmlContent,
      content_text: textContent,
      recipients_count: subscribers.length,
      sent_count: sentCount,
      failed_count: failedCount,
      status: 'sent',
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return {
      sent: sentCount,
      failed: failedCount,
      total: subscribers.length,
    };

  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('📧 Starting newsletter send...');

    // Get data
    const [tools, posts] = await Promise.all([
      getTopToolsOfWeek(5),
      getLatestBlogPosts(3),
    ]);

    if (tools.length === 0) {
      console.log('No tools found for newsletter');
      return NextResponse.json({
        message: 'No content available for newsletter',
        sent: 0,
      });
    }

    // Generate newsletter content
    const subject = `🚀 This Week's Top ${tools.length} AI Tools - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
    const htmlContent = generateNewsletterHTML(tools, posts);
    const textContent = generateNewsletterText(tools, posts);

    // Send to all subscribers
    const result = await sendNewsletterToSubscribers(subject, htmlContent, textContent);

    console.log(`✅ Newsletter sent: ${result.sent}/${result.total} successful`);

    return NextResponse.json({
      message: 'Newsletter sent successfully',
      ...result,
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
