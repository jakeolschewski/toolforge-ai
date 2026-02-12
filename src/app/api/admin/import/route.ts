import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeTool, validateTool, sanitizeReview, validateReview } from '@/utils/import-validator';
import { generateSlug } from '@/utils/helpers';
import type { Tool, Review } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify admin token
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === process.env.ADMIN_TOKEN;
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, data } = await request.json();

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    if (type === 'tools') {
      return await importTools(data);
    } else if (type === 'reviews') {
      return await importReviews(data);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid import type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function importTools(data: Partial<Tool>[]) {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Get existing tools to check for duplicates
  const { data: existingTools } = await supabase
    .from('tools')
    .select('website_url, slug');

  const existingUrls = new Set(
    existingTools?.map((t) => t.website_url.toLowerCase()) || []
  );
  const existingSlugs = new Set(
    existingTools?.map((t) => t.slug.toLowerCase()) || []
  );

  for (let i = 0; i < data.length; i++) {
    const tool = sanitizeTool(data[i]);

    // Validate
    const validation = validateTool(tool);
    if (!validation.isValid) {
      errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
      skipped++;
      continue;
    }

    // Check for duplicates
    if (tool.website_url && existingUrls.has(tool.website_url.toLowerCase())) {
      errors.push(`Row ${i + 1}: Tool with URL ${tool.website_url} already exists`);
      skipped++;
      continue;
    }

    // Generate slug
    let slug = generateSlug(tool.name!);
    let slugAttempt = 1;

    while (existingSlugs.has(slug)) {
      slug = `${generateSlug(tool.name!)}-${slugAttempt}`;
      slugAttempt++;
    }

    existingSlugs.add(slug);

    // Insert tool
    const { error } = await supabase.from('tools').insert({
      slug,
      name: tool.name,
      description: tool.description,
      long_description: tool.long_description,
      website_url: tool.website_url,
      affiliate_link: tool.affiliate_link,
      logo_url: tool.logo_url,
      screenshot_url: tool.screenshot_url,
      category: tool.category,
      subcategory: tool.subcategory,
      pricing_model: tool.pricing_model || 'free',
      starting_price: tool.starting_price,
      features: tool.features || [],
      tags: tool.tags || [],
      is_featured: tool.is_featured || false,
      is_sponsored: tool.is_sponsored || false,
      status: tool.status || 'draft',
      rating: 0,
      review_count: 0,
      views: 0,
      clicks: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`Import error for row ${i + 1}:`, error);
      errors.push(`Row ${i + 1}: ${error.message}`);
      skipped++;
    } else {
      imported++;
      if (tool.website_url) {
        existingUrls.add(tool.website_url.toLowerCase());
      }
    }
  }

  // Log the import
  await supabase.from('audit_logs').insert({
    action: 'bulk_import',
    entity_type: 'tools',
    metadata: { imported, skipped, total: data.length },
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
  });
}

async function importReviews(data: Partial<Review>[]) {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Get existing reviews to check for duplicates
  const { data: existingReviews } = await supabase
    .from('reviews')
    .select('tool_id');

  const existingToolIds = new Set(
    existingReviews?.map((r) => r.tool_id) || []
  );

  for (let i = 0; i < data.length; i++) {
    const review = sanitizeReview(data[i]);

    // Validate
    const validation = validateReview(review);
    if (!validation.isValid) {
      errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
      skipped++;
      continue;
    }

    // Check if tool exists
    const { data: tool } = await supabase
      .from('tools')
      .select('id')
      .eq('id', review.tool_id)
      .single();

    if (!tool) {
      errors.push(`Row ${i + 1}: Tool ID ${review.tool_id} not found`);
      skipped++;
      continue;
    }

    // Check for duplicates
    if (existingToolIds.has(review.tool_id!)) {
      errors.push(`Row ${i + 1}: Review for tool ${review.tool_id} already exists`);
      skipped++;
      continue;
    }

    // Calculate read time
    const wordCount = review.content!.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Insert review
    const { error } = await supabase.from('reviews').insert({
      tool_id: review.tool_id,
      title: review.title,
      content: review.content,
      pros_html: review.pros_html,
      cons_html: review.cons_html,
      verdict: review.verdict,
      rating: review.rating || 0,
      author: review.author || 'Admin',
      status: review.status || 'draft',
      keywords: review.keywords || [],
      read_time: readTime,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`Import error for row ${i + 1}:`, error);
      errors.push(`Row ${i + 1}: ${error.message}`);
      skipped++;
    } else {
      imported++;
      existingToolIds.add(review.tool_id!);
    }
  }

  // Log the import
  await supabase.from('audit_logs').insert({
    action: 'bulk_import',
    entity_type: 'reviews',
    metadata: { imported, skipped, total: data.length },
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
  });
}
