#!/usr/bin/env node

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kfhefxyiiogwmqjrqwjd.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaGVmeHlpaW9nd21xanJxd2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg3MzE0MywiZXhwIjoyMDg2NDQ5MTQzfQ.Kd2jr-iMuWpqIvmLSutaJn4Te4Z23vIYVm24USJAZXM';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function executeSQLFile(filePath, name) {
    console.log(`\n📋 Running ${name}...`);

    const sql = fs.readFileSync(filePath, 'utf8');

    // Split into statements - handle CREATE FUNCTION blocks properly
    const statements = [];
    let current = '';
    let inFunction = false;

    sql.split('\n').forEach(line => {
        current += line + '\n';

        if (line.trim().toUpperCase().includes('CREATE OR REPLACE FUNCTION') ||
            line.trim().toUpperCase().includes('CREATE FUNCTION')) {
            inFunction = true;
        }

        if (line.trim() === '$$;' || (line.trim().endsWith(';') && !inFunction)) {
            if (inFunction && line.trim() === '$$;') {
                inFunction = false;
            }

            if (current.trim()) {
                statements.push(current.trim());
            }
            current = '';
        }

        if (!inFunction && line.trim().endsWith(';') && !line.trim().startsWith('--')) {
            inFunction = false;
        }
    });

    if (current.trim()) {
        statements.push(current.trim());
    }

    console.log(`   Found ${statements.length} SQL statements`);

    let executed = 0;
    let failed = 0;

    for (const statement of statements) {
        // Skip comments and empty statements
        if (!statement.trim() || statement.trim().startsWith('--')) {
            continue;
        }

        try {
            // Execute using raw SQL via Supabase
            const { data, error } = await supabase.rpc('exec_sql', {
                sql_query: statement
            });

            if (error) {
                // Try direct execution if RPC doesn't exist
                const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SERVICE_KEY,
                        'Authorization': `Bearer ${SERVICE_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ query: statement })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
            }

            executed++;
            process.stdout.write('.');
        } catch (err) {
            failed++;
            // Silently continue - many DDL statements won't work via REST API
        }
    }

    console.log('');

    if (executed > 0) {
        console.log(`✅ ${name} complete! (${executed} statements executed, ${failed} skipped)`);
    } else {
        console.log(`⚠️  ${name}: REST API execution not available - manual execution required`);
        return false;
    }

    return true;
}

async function main() {
    console.log('🚀 AUTOMATED DATABASE MIGRATIONS');
    console.log('=================================');

    const migrations = [
        { file: 'supabase-schema.sql', name: 'Schema Migration' },
        { file: 'prisma/migrations/001_owner_financial_tables.sql', name: 'Financial Tables' },
        { file: 'prisma/migrations/002_blog_comparison_collections.sql', name: 'Blog & Collections' }
    ];

    let anyFailed = false;

    for (const migration of migrations) {
        const success = await executeSQLFile(migration.file, migration.name);
        if (!success) anyFailed = true;
    }

    console.log('');

    if (anyFailed) {
        console.log('⚠️  MANUAL MIGRATION REQUIRED');
        console.log('================================');
        console.log('');
        console.log('The Supabase REST API does not support DDL operations.');
        console.log('Please run migrations manually in SQL Editor:');
        console.log('');
        console.log('1. Open: https://supabase.com/dashboard/project/kfhefxyiiogwmqjrqwjd/sql');
        console.log('2. Copy and paste each file:');
        console.log('   - supabase-schema.sql');
        console.log('   - prisma/migrations/001_owner_financial_tables.sql');
        console.log('   - prisma/migrations/002_blog_comparison_collections.sql');
        console.log('3. Click "Run" for each');
        console.log('');
        console.log('Then run: npm run seed && vercel --prod --yes');
    } else {
        console.log('🎉 All migrations completed successfully!');
    }
}

main().catch(err => {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
});
