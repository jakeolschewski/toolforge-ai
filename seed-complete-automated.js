#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://kfhefxyiiogwmqjrqwjd.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaGVmeHlpaW9nd21xanJxd2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg3MzE0MywiZXhwIjoyMDg2NDQ5MTQzfQ.Kd2jr-iMuWpqIvmLSutaJn4Te4Z23vIYVm24USJAZXM';

async function execSQLDirect(sql) {
    return new Promise((resolve) => {
        const req = https.request({
            hostname: SUPABASE_URL.replace('https://', ''),
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ 
                success: res.statusCode < 300,
                status: res.statusCode, 
                body 
            }));
        });
        req.on('error', (err) => resolve({ success: false, error: err.message }));
        req.write(JSON.stringify({ query: sql }));
        req.end();
    });
}

async function main() {
    console.log('🚀 AUTOMATED COMPLETE SEEDING');
    console.log('================================\n');

    // Read and execute seed SQL
    console.log('📋 Seeding tools from SQL file...');
    const seedSQL = fs.readFileSync('seed-tools-direct.sql', 'utf8');
    const result = await execSQLDirect(seedSQL);
    
    if (result.success) {
        console.log('✅ Tools seeded successfully via SQL!');
    } else {
        console.log('⚠️  SQL method failed, status:', result.status);
        console.log('   Response:', result.body.substring(0, 200));
    }

    console.log('\n✅ Automated seeding complete!');
}

main();
