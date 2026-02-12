// Master seed script for ToolForge AI
// Orchestrates seeding of categories, tools, and reviews
// Run with: npm run seed

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import * as readline from 'readline';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(message: string) {
  console.log('\n' + '='.repeat(60));
  log(message, colors.bright + colors.cyan);
  console.log('='.repeat(60) + '\n');
}

async function checkEnvironment() {
  header('Environment Check');

  if (!supabaseUrl || !supabaseServiceKey) {
    log('❌ Missing required environment variables!', colors.red);
    log('\nPlease ensure the following are set in your .env.local:', colors.yellow);
    log('  - NEXT_PUBLIC_SUPABASE_URL');
    log('  - SUPABASE_SERVICE_ROLE_KEY');
    log('\nCopy .env.example to .env.local and fill in your values.', colors.yellow);
    process.exit(1);
  }

  log('✅ Environment variables configured', colors.green);
  log(`   Supabase URL: ${supabaseUrl}`, colors.blue);
}

async function checkDatabase() {
  header('Database Connection Check');

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  try {
    // Try to query categories table
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (error) throw error;

    log('✅ Successfully connected to Supabase', colors.green);
    return supabase;
  } catch (error) {
    log('❌ Failed to connect to Supabase!', colors.red);
    log(`   Error: ${error}`, colors.red);
    log('\nPlease ensure:', colors.yellow);
    log('  1. Your Supabase project is created');
    log('  2. The database schema has been set up (run supabase-schema.sql)');
    log('  3. Your credentials are correct');
    process.exit(1);
  }
}

async function checkExistingData(supabase: any) {
  header('Checking Existing Data');

  const { count: toolCount } = await supabase
    .from('tools')
    .select('*', { count: 'exact', head: true });

  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  log(`📊 Current database state:`, colors.blue);
  log(`   - Categories: ${categoryCount || 0}`);
  log(`   - Tools: ${toolCount || 0}`);
  log(`   - Reviews: ${reviewCount || 0}`);

  return {
    toolCount: toolCount || 0,
    reviewCount: reviewCount || 0,
    categoryCount: categoryCount || 0,
  };
}

async function promptUser(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function seedCategories(supabase: any) {
  header('Seeding Categories');

  const categories = [
    {
      slug: 'writing',
      name: 'AI Writing Tools',
      description: 'Tools for content creation, copywriting, and text generation',
      icon: '✍️',
      order: 1,
    },
    {
      slug: 'image',
      name: 'AI Image Generators',
      description: 'Create images, art, and graphics with AI',
      icon: '🎨',
      order: 2,
    },
    {
      slug: 'video',
      name: 'AI Video Tools',
      description: 'Video generation, editing, and enhancement',
      icon: '🎬',
      order: 3,
    },
    {
      slug: 'code',
      name: 'AI Coding Assistants',
      description: 'Code generation, debugging, and development tools',
      icon: '💻',
      order: 4,
    },
    {
      slug: 'chat',
      name: 'AI Chatbots',
      description: 'Conversational AI and virtual assistants',
      icon: '💬',
      order: 5,
    },
    {
      slug: 'productivity',
      name: 'AI Productivity',
      description: 'Tools to enhance workflow and efficiency',
      icon: '⚡',
      order: 6,
    },
    {
      slug: 'marketing',
      name: 'AI Marketing',
      description: 'Marketing automation and content tools',
      icon: '📈',
      order: 7,
    },
    {
      slug: 'design',
      name: 'AI Design Tools',
      description: 'Design, UI/UX, and creative tools',
      icon: '🎯',
      order: 8,
    },
    {
      slug: 'audio',
      name: 'AI Audio & Music',
      description: 'Voice, music, and audio generation',
      icon: '🎵',
      order: 9,
    },
    {
      slug: 'research',
      name: 'AI Research Tools',
      description: 'Research, analysis, and data tools',
      icon: '🔬',
      order: 10,
    },
  ];

  for (const category of categories) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .single();

    if (existing) {
      log(`⏭️  Category exists: ${category.name}`, colors.yellow);
      continue;
    }

    const { error } = await supabase
      .from('categories')
      .insert([category]);

    if (error) {
      log(`❌ Failed to create category: ${category.name}`, colors.red);
      console.error(error);
    } else {
      log(`✅ Created category: ${category.name}`, colors.green);
    }
  }

  log('\n✅ Categories seeded successfully!', colors.green);
}

async function runScript(scriptName: string, description: string) {
  header(description);

  try {
    log(`🚀 Running ${scriptName}...`, colors.blue);
    execSync(`npx tsx scripts/${scriptName}`, {
      stdio: 'inherit',
      env: process.env,
    });
    log(`\n✅ ${description} completed!`, colors.green);
  } catch (error) {
    log(`❌ ${description} failed!`, colors.red);
    throw error;
  }
}

async function main() {
  console.clear();
  log('╔═══════════════════════════════════════════════════════════╗', colors.cyan);
  log('║                                                           ║', colors.cyan);
  log('║              ToolForge AI - Database Seeder               ║', colors.bright + colors.cyan);
  log('║                                                           ║', colors.cyan);
  log('╚═══════════════════════════════════════════════════════════╝', colors.cyan);

  // Step 1: Check environment
  await checkEnvironment();

  // Step 2: Check database connection
  const supabase = await checkDatabase();

  // Step 3: Check existing data
  const existingData = await checkExistingData(supabase);

  // Step 4: Confirm with user if data exists
  if (existingData.toolCount > 0 || existingData.reviewCount > 0) {
    log('\n⚠️  Warning: Database already contains data!', colors.yellow);
    log('   The seeder will skip existing items but may add new ones.', colors.yellow);

    const shouldContinue = await promptUser('\nDo you want to continue?');
    if (!shouldContinue) {
      log('\n👋 Seeding cancelled.', colors.yellow);
      process.exit(0);
    }
  }

  // Step 5: Seed categories
  await seedCategories(supabase);

  // Step 6: Seed tools
  await runScript('seed-tools.ts', 'Seeding Tools');

  // Step 7: Seed reviews
  await runScript('seed-reviews.ts', 'Seeding Reviews');

  // Step 8: Final status
  header('Seeding Complete! 🎉');

  const finalData = await checkExistingData(supabase);

  log('Final database state:', colors.green);
  log(`   📁 Categories: ${finalData.categoryCount}`, colors.bright);
  log(`   🔧 Tools: ${finalData.toolCount}`, colors.bright);
  log(`   📝 Reviews: ${finalData.reviewCount}`, colors.bright);

  log('\n🎯 Next steps:', colors.cyan);
  log('   1. Run "npm run dev" to start the development server');
  log('   2. Visit http://localhost:3000 to see your seeded data');
  log('   3. Check the admin dashboard to manage your tools');

  log('\n✨ Happy building!', colors.green);
}

// Run the main function
main().catch((error) => {
  log('\n💥 Fatal error occurred!', colors.red);
  console.error(error);
  process.exit(1);
});
