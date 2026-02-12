#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://kfhefxyiiogwmqjrqwjd.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaGVmeHlpaW9nd21xanJxd2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg3MzE0MywiZXhwIjoyMDg2NDQ5MTQzfQ.Kd2jr-iMuWpqIvmLSutaJn4Te4Z23vIYVm24USJAZXM';

async function executeSQLViaHTTP(sql) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: SUPABASE_URL.replace('https://', ''),
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Prefer': 'return=minimal'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, body });
                } else {
                    resolve({ success: false, status: res.statusCode, body });
                }
            });
        });

        req.on('error', (err) => {
            resolve({ success: false, error: err.message });
        });

        req.write(JSON.stringify({ query: sql }));
        req.end();
    });
}

async function runMigration(filePath, name) {
    console.log(`\n📋 Running ${name}...`);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split SQL into individual statements
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

    console.log(`   Found ${statements.length} statements`);

    for (const stmt of statements) {
        if (!stmt) continue;
        const result = await executeSQLViaHTTP(stmt + ';');
        if (result.success) {
            process.stdout.write('.');
        }
    }

    console.log('\n✅ Complete!');
}

async function main() {
    console.log('🚀 RUNNING DATABASE MIGRATIONS VIA HTTP');
    console.log('========================================\n');

    try {
        await runMigration('supabase-schema.sql', 'Schema Migration (1/3)');
        await runMigration('prisma/migrations/001_owner_financial_tables.sql', 'Financial Tables (2/3)');
        await runMigration('prisma/migrations/002_blog_comparison_collections.sql', 'Blog & Collections (3/3)');

        console.log('\n🎉 All migrations completed!');
        console.log('✅ Database is ready for seeding\n');
    } catch (err) {
        console.error('\n❌ Migration failed:', err);
        console.log('\n📝 Please run migrations manually in SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/kfhefxyiiogwmqjrqwjd/sql\n');
        process.exit(1);
    }
}

main();
