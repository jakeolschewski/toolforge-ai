import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'prisma/migrations/20250213_workflow_vault/migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute via raw SQL if possible, otherwise return instructions
    console.log('Attempting to execute migration...');

    // Split into statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .map(s => s + ';');

    console.log(`Executing ${statements.length} SQL statements...`);

    return NextResponse.json({
      success: false,
      message: 'Manual migration required',
      instructions: {
        step1: 'Go to Supabase SQL Editor',
        url: 'https://kfhefxyiiogwmqjrqwjd.supabase.co/project/kfhefxyiiogwmqjrqwjd/sql/new',
        step2: 'Copy the migration SQL',
        file: '/Volumes/JarvisSSD/toolforge-ai/prisma/migrations/20250213_workflow_vault/migration.sql',
        step3: 'Paste and click Run',
        statements: statements.length,
        note: 'The Supabase API does not support direct SQL execution. Please use the SQL Editor.'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
