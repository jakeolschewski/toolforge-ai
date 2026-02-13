// Auto-Comparisons Generator
// Automatically creates comparison articles for popular tool pairs

import { supabaseAdmin } from '@/lib/supabase';
import { generateToolComparison } from '@/lib/ai-content-generator';
import { slugify } from '@/utils/helpers';
import type { Tool } from '@/types';

const MAX_COMPARISONS_PER_RUN = 1;

/**
 * Auto-generate comparisons for popular tool pairs in the same category
 */
export async function generateAutoComparisons(): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  // Fetch popular published tools (clicks > 0) grouped by category
  const { data: tools, error } = await supabaseAdmin
    .from('tools')
    .select('id, name, slug, category, clicks, rating, description, features, pricing_model, starting_price, website_url')
    .eq('status', 'published')
    .gt('clicks', 0)
    .order('clicks', { ascending: false })
    .limit(50);

  if (error || !tools || tools.length < 2) {
    console.log('Not enough popular tools for comparisons');
    return { created: 0, skipped: 0 };
  }

  // Group by category
  const categoryMap = new Map<string, typeof tools>();
  for (const tool of tools) {
    const cat = tool.category || 'productivity';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(tool);
  }

  // Find pairs to compare (same category, both popular)
  for (const [category, categoryTools] of categoryMap) {
    if (created >= MAX_COMPARISONS_PER_RUN) break;
    if (categoryTools.length < 2) continue;

    // Take top 2 tools in this category
    const tool1 = categoryTools[0];
    const tool2 = categoryTools[1];

    // Generate comparison slug
    const comparisonSlug = slugify(`${tool1.name}-vs-${tool2.name}`);

    // Check if comparison already exists
    const { data: existing } = await supabaseAdmin
      .from('comparisons')
      .select('id')
      .eq('slug', comparisonSlug)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    // Also check reverse slug
    const reverseSlug = slugify(`${tool2.name}-vs-${tool1.name}`);
    const { data: existingReverse } = await supabaseAdmin
      .from('comparisons')
      .select('id')
      .eq('slug', reverseSlug)
      .maybeSingle();

    if (existingReverse) {
      skipped++;
      continue;
    }

    try {
      // Generate comparison content via Claude
      const content = await generateToolComparison([tool1.id, tool2.id]);

      // Save comparison to database
      const { error: insertError } = await supabaseAdmin
        .from('comparisons')
        .insert({
          slug: comparisonSlug,
          title: content.title,
          description: content.excerpt,
          tool_ids: [tool1.id, tool2.id],
          comparison_data: {
            verdict: content.content,
          },
          seo_title: content.seoTitle,
          seo_description: content.seoDescription,
          keywords: content.keywords,
          views: 0,
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`Failed to create comparison ${comparisonSlug}:`, insertError.message);
        continue;
      }

      console.log(`Created comparison: ${tool1.name} vs ${tool2.name}`);
      created++;
    } catch (err) {
      console.error(`Error generating comparison for ${tool1.name} vs ${tool2.name}:`, err);
      skipped++;
    }
  }

  return { created, skipped };
}
