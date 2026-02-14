// Robots.txt Route

import { NextResponse } from 'next/server';

export async function GET() {
  // Resolve at request time, not module-load time
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolforge.ai';
  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin routes
User-agent: *
Disallow: /admin/
Disallow: /api/admin/

# Crawl delay for considerate bots
User-agent: *
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Host preference
Host: ${SITE_URL}
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
