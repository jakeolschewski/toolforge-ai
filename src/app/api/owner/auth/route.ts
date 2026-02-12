// Owner Authentication API

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Verify owner password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const ownerPassword = process.env.OWNER_PASSWORD;

    if (!ownerPassword) {
      // If no owner password is set, deny access
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Owner password not configured' },
        { status: 403 }
      );
    }

    if (password === ownerPassword) {
      // Log the authentication attempt
      console.log('[OWNER AUTH] Successful authentication at', new Date().toISOString());

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Authentication successful',
      });
    }

    // Log failed attempt
    console.warn('[OWNER AUTH] Failed authentication attempt at', new Date().toISOString());

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[OWNER AUTH] Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}
