// Middleware for protecting admin routes

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to admin API routes
  if (pathname.startsWith('/api/admin')) {
    // Skip auth endpoint
    if (pathname === '/api/admin/auth') {
      return NextResponse.next();
    }

    // Check for admin password in environment
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      // No password set - allow in development mode
      console.warn('ADMIN_PASSWORD not set - admin routes are unprotected');
      return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
