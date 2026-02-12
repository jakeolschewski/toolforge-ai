// RSS Feed Route

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Tool } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai';
const SITE_NAME = 'ToolForge AI';

export async function GET() {
  // Fetch latest 50 published tools
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  const toolsData = (tools || []) as Tool[];

  // Build RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME} - AI Tools Directory</title>
    <description>Discover the best AI tools for your needs. Comprehensive reviews, pricing info, and honest comparisons.</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
${toolsData
  .map(
    (tool) => `
    <item>
      <title>${escapeXml(tool.name)} - ${escapeXml(tool.tagline || 'AI Tool')}</title>
      <description>${escapeXml(tool.description)}</description>
      <link>${SITE_URL}/tools/${tool.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/tools/${tool.slug}</guid>
      <pubDate>${new Date(tool.published_at || tool.created_at).toUTCString()}</pubDate>
      <category>${escapeXml(tool.category)}</category>
      ${tool.screenshot_url ? `<enclosure url="${escapeXml(tool.screenshot_url)}" type="image/jpeg"/>` : ''}
      <content:encoded><![CDATA[
        <h2>${escapeXml(tool.name)}</h2>
        ${tool.tagline ? `<p><strong>${escapeXml(tool.tagline)}</strong></p>` : ''}
        <p>${escapeXml(tool.description)}</p>
        ${tool.features.length > 0 ? `
        <h3>Key Features:</h3>
        <ul>
          ${tool.features.map((f) => `<li>${escapeXml(f)}</li>`).join('\n          ')}
        </ul>
        ` : ''}
        <p><strong>Pricing:</strong> ${escapeXml(formatPricing(tool))}</p>
        <p><a href="${SITE_URL}/tools/${tool.slug}">Read full review →</a></p>
      ]]></content:encoded>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatPricing(tool: Tool): string {
  const model = tool.pricing_model.charAt(0).toUpperCase() + tool.pricing_model.slice(1);
  if (tool.starting_price) {
    return `${model} - starting at ${tool.starting_price}`;
  }
  return model;
}
