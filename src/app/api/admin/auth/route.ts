// Admin Authentication API

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Verify admin password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      // If no admin password is set, allow all access (development mode)
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'No admin password configured',
      });
    }

    if (password === adminPassword) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Authentication successful',
      });
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}
