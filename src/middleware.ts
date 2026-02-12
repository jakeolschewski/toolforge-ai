// Enhanced middleware for performance, security, and admin protection

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Strict-Transport-Security (HSTS) - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: http:;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com;
    frame-ancestors 'self';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // Cache Control for static assets
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/images') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2)$/)
  ) {
    // Immutable static assets - cache for 1 year
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.startsWith('/api')) {
    // API routes - no cache by default (can be overridden in route)
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  } else {
    // Pages - cache for 1 hour with stale-while-revalidate
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  // Compression hint
  response.headers.set('Accept-Encoding', 'gzip, deflate, br');

  // Only apply admin auth to admin API routes
  if (pathname.startsWith('/api/admin')) {
    // Skip auth endpoint
    if (pathname === '/api/admin/auth') {
      return response;
    }

    // Check for admin password in environment
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      // No password set - allow in development mode
      if (process.env.NODE_ENV === 'development') {
        console.warn('ADMIN_PASSWORD not set - admin routes are unprotected');
        return response;
      }
      return NextResponse.json(
        { success: false, error: 'Admin authentication not configured' },
        { status: 500 }
      );
    }

    // Verify Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except those starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
