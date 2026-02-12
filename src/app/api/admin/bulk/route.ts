import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    const { action, ids, value } = await request.json();

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'publish':
        result = await supabase
          .from('tools')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'unpublish':
        result = await supabase
          .from('tools')
          .update({
            status: 'draft',
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'archive':
        result = await supabase
          .from('tools')
          .update({
            status: 'archived',
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'feature':
        result = await supabase
          .from('tools')
          .update({
            is_featured: true,
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'unfeature':
        result = await supabase
          .from('tools')
          .update({
            is_featured: false,
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'delete':
        // Delete related reviews first
        await supabase
          .from('reviews')
          .delete()
          .in('tool_id', ids);

        // Delete click logs
        await supabase
          .from('click_logs')
          .delete()
          .in('tool_id', ids);

        // Delete tools
        result = await supabase
          .from('tools')
          .delete()
          .in('id', ids);
        break;

      case 'change_category':
        if (!value) {
          return NextResponse.json(
            { success: false, error: 'Category value required' },
            { status: 400 }
          );
        }
        result = await supabase
          .from('tools')
          .update({
            category: value,
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'update_pricing':
        if (!value) {
          return NextResponse.json(
            { success: false, error: 'Pricing model value required' },
            { status: 400 }
          );
        }
        result = await supabase
          .from('tools')
          .update({
            pricing_model: value,
            updated_at: new Date().toISOString(),
          })
          .in('id', ids);
        break;

      case 'add_tag':
        if (!value) {
          return NextResponse.json(
            { success: false, error: 'Tag value required' },
            { status: 400 }
          );
        }

        // Fetch current tools
        const { data: tools } = await supabase
          .from('tools')
          .select('id, tags')
          .in('id', ids);

        if (!tools) {
          return NextResponse.json(
            { success: false, error: 'Tools not found' },
            { status: 404 }
          );
        }

        // Update each tool with new tag
        for (const tool of tools) {
          const tags = tool.tags || [];
          if (!tags.includes(value)) {
            tags.push(value);
            await supabase
              .from('tools')
              .update({
                tags,
                updated_at: new Date().toISOString(),
              })
              .eq('id', tool.id);
          }
        }

        result = { error: null };
        break;

      case 'remove_tag':
        if (!value) {
          return NextResponse.json(
            { success: false, error: 'Tag value required' },
            { status: 400 }
          );
        }

        // Fetch current tools
        const { data: toolsForRemoval } = await supabase
          .from('tools')
          .select('id, tags')
          .in('id', ids);

        if (!toolsForRemoval) {
          return NextResponse.json(
            { success: false, error: 'Tools not found' },
            { status: 404 }
          );
        }

        // Update each tool by removing tag
        for (const tool of toolsForRemoval) {
          const tags = (tool.tags || []).filter((t: string) => t !== value);
          await supabase
            .from('tools')
            .update({
              tags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', tool.id);
        }

        result = { error: null };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (result.error) {
      console.error('Bulk action error:', result.error);
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 500 }
      );
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      action: `bulk_${action}`,
      entity_type: 'tools',
      entity_ids: ids,
      metadata: { count: ids.length, value },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      affected: ids.length,
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
