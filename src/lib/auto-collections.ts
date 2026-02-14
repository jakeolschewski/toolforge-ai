// Auto-Collections Generator
// Automatically creates curated collections from tool categories

import { supabaseAdmin } from '@/lib/supabase';

const MAX_COLLECTIONS_PER_RUN = 3;
const MIN_TOOLS_FOR_COLLECTION = 5;
const TOOLS_PER_COLLECTION = 10;

/**
 * Auto-generate collections for categories with enough published tools
 */
export async function generateAutoCollections(): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  // Get distinct categories with their tool counts
  const { data: tools, error } = await supabaseAdmin
    .from('tools')
    .select('id, name, slug, category, rating, clicks, views')
    .eq('status', 'published')
    .order('rating', { ascending: false });

  if (error || !tools) {
    console.error('Failed to fetch tools for collections:', error);
    return { created: 0, skipped: 0 };
  }

  // Group tools by category
  const categoryMap = new Map<string, typeof tools>();
  for (const tool of tools) {
    const cat = tool.category || 'productivity';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(tool);
  }

  // Process categories with enough tools
  for (const [category, categoryTools] of categoryMap) {
    if (created >= MAX_COLLECTIONS_PER_RUN) break;
    if (categoryTools.length < MIN_TOOLS_FOR_COLLECTION) {
      skipped++;
      continue;
    }

    const collectionSlug = `best-${category}-ai-tools`;

    // Check if collection already exists
    const { data: existing } = await supabaseAdmin
      .from('collections')
      .select('id')
      .eq('slug', collectionSlug)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    // Take top tools by rating
    const topTools = categoryTools.slice(0, TOOLS_PER_COLLECTION);
    const toolIds = topTools.map((t) => t.id);
    const toolNames = topTools.slice(0, 3).map((t) => t.name).join(', ');

    const collectionName = `Best ${capitalize(category)} AI Tools`;
    const description = `Curated collection of the best ${category} AI tools, featuring ${toolNames}, and more. Updated automatically based on ratings and popularity.`;

    const { error: insertError } = await supabaseAdmin
      .from('collections')
      .insert({
        slug: collectionSlug,
        name: collectionName,
        description,
        tool_ids: toolIds,
        keywords: [`best ${category} tools`, `${category} ai`, `top ${category} tools`, 'ai tools'],
        views: 0,
        order_index: 0,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error(`Failed to create collection ${collectionSlug}:`, insertError.message);
      continue;
    }

    console.log(`Created collection: ${collectionName} (${toolIds.length} tools)`);
    created++;
  }

  return { created, skipped };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
