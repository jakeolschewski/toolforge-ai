// Owner Authentication API

import { NextRequest, NextResponse } from 'next/server';
import { isValidOwnerPassword } from '@/lib/owner-auth';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Verify owner password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (isValidOwnerPassword(password)) {
      console.log('[OWNER AUTH] Successful authentication at', new Date().toISOString());

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Authentication successful',
        data: { role: 'owner' },
      });
    }

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
