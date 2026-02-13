// Weekly Affiliate Link Health Check Cron Job
// Validates affiliate links still work and alerts admin about broken ones
// Schedule: 0 3 * * 0 (3am every Sunday)

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyCronSecret } from '@/utils/helpers';
import { sendEmail } from '@/lib/email';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_TOOLS_PER_RUN = 50;
const REQUEST_TIMEOUT = 5000; // 5 seconds

interface LinkCheckResult {
  toolId: string;
  toolName: string;
  url: string;
  status: 'healthy' | 'broken' | 'timeout';
  statusCode?: number;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const results: LinkCheckResult[] = [];

  try {
    console.log('Starting affiliate link health check...');

    // Fetch tools with affiliate links
    const { data: tools, error } = await supabaseAdmin
      .from('tools')
      .select('id, name, affiliate_link')
      .eq('status', 'published')
      .not('affiliate_link', 'is', null)
      .limit(MAX_TOOLS_PER_RUN);

    if (error || !tools) {
      throw new Error(`Failed to fetch tools: ${error?.message}`);
    }

    console.log(`Checking ${tools.length} affiliate links...`);

    for (const tool of tools) {
      if (!tool.affiliate_link) continue;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(tool.affiliate_link, {
          method: 'HEAD',
          signal: controller.signal,
          redirect: 'follow',
        });

        clearTimeout(timeoutId);

        results.push({
          toolId: tool.id,
          toolName: tool.name,
          url: tool.affiliate_link,
          status: response.ok ? 'healthy' : 'broken',
          statusCode: response.status,
        });
      } catch (err) {
        const isTimeout = err instanceof Error && err.name === 'AbortError';
        results.push({
          toolId: tool.id,
          toolName: tool.name,
          url: tool.affiliate_link,
          status: isTimeout ? 'timeout' : 'broken',
        });
      }
    }

    const healthy = results.filter(r => r.status === 'healthy').length;
    const broken = results.filter(r => r.status === 'broken').length;
    const timeout = results.filter(r => r.status === 'timeout').length;

    console.log(`Link check complete: ${healthy} healthy, ${broken} broken, ${timeout} timeout`);

    // Send summary email to admin if there are broken links
    if (broken > 0 || timeout > 0) {
      const brokenLinks = results.filter(r => r.status !== 'healthy');
      await sendAffiliateSummaryEmail(healthy, broken, timeout, brokenLinks);
    }

    const duration = Date.now() - startTime;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        checked: results.length,
        healthy,
        broken,
        timeout,
        duration,
        brokenLinks: results.filter(r => r.status !== 'healthy'),
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Affiliate check failed';
    console.error('Affiliate check cron error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: errorMessage, data: { duration } },
      { status: 500 }
    );
  }
}

async function sendAffiliateSummaryEmail(
  healthy: number,
  broken: number,
  timeout: number,
  brokenLinks: LinkCheckResult[]
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const brokenListHtml = brokenLinks
    .map(l => `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${l.toolName}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${l.status}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;word-break:break-all;font-size:12px;">${l.url}</td></tr>`)
    .join('');

  await sendEmail({
    to: adminEmail,
    subject: `ToolForge AI - Affiliate Link Report: ${broken + timeout} issues found`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#dc2626;">Affiliate Link Health Report</h2>
        <p>Healthy: <strong style="color:#16a34a;">${healthy}</strong> | Broken: <strong style="color:#dc2626;">${broken}</strong> | Timeout: <strong style="color:#f59e0b;">${timeout}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead><tr style="background:#f3f4f6;"><th style="padding:8px;text-align:left;">Tool</th><th style="padding:8px;text-align:left;">Status</th><th style="padding:8px;text-align:left;">URL</th></tr></thead>
          <tbody>${brokenListHtml}</tbody>
        </table>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
