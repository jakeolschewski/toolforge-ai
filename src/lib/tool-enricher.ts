// AI Tool Enricher
// Uses Claude to enhance sparse tool data with richer descriptions, features, and tags

import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from './supabase';
import type { Tool } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Check if a tool needs enrichment (sparse data)
 */
export function needsEnrichment(tool: Tool): boolean {
  const shortDescription = !tool.description || tool.description.length < 100;
  const emptyFeatures = !tool.features || tool.features.length === 0;
  const fewTags = !tool.tags || tool.tags.length < 2;

  return shortDescription || emptyFeatures || fewTags;
}

/**
 * Enrich a tool with AI-generated content.
 * Only fills in missing/sparse fields — does NOT overwrite existing rich data.
 */
export async function enrichTool(tool: Tool): Promise<Partial<Tool>> {
  const prompt = `You are a concise AI tools expert. Given this AI tool, provide enriched metadata.

Tool Name: ${tool.name}
Current Description: ${tool.description || 'none'}
Category: ${tool.category}
Website: ${tool.website_url || 'unknown'}
Current Tags: ${(tool.tags || []).join(', ') || 'none'}
Current Features: ${(tool.features || []).join(', ') || 'none'}

Return ONLY valid JSON (no markdown, no explanation) with these fields:
{
  "description": "Enhanced description, 200-400 characters, compelling and informative",
  "long_description": "2-3 paragraph detailed description of what this tool does and why it's useful",
  "features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "tagline": "One-liner tagline for the tool"
}

Requirements:
- description: 200-400 chars, factual, SEO-friendly
- long_description: 2-3 paragraphs, informative
- features: 5-8 specific features
- tags: 3-5 relevant lowercase tags
- tagline: catchy one-liner`;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse the JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response');
  }

  const enriched = JSON.parse(jsonMatch[0]);

  // Build update — only fill sparse fields, don't overwrite existing rich data
  const updates: Partial<Tool> = {};

  if ((!tool.description || tool.description.length < 100) && enriched.description) {
    updates.description = enriched.description;
  }

  if (!tool.long_description && enriched.long_description) {
    updates.long_description = enriched.long_description;
  }

  if ((!tool.features || tool.features.length === 0) && Array.isArray(enriched.features)) {
    updates.features = enriched.features;
  }

  if ((!tool.tags || tool.tags.length < 2) && Array.isArray(enriched.tags)) {
    updates.tags = enriched.tags;
  }

  if (!tool.tagline && enriched.tagline) {
    updates.tagline = enriched.tagline;
  }

  return updates;
}

/**
 * Enrich a tool and save updates to the database
 */
export async function enrichAndSaveTool(tool: Tool): Promise<{ updated: boolean; fields: string[] }> {
  const updates = await enrichTool(tool);
  const updatedFields = Object.keys(updates);

  if (updatedFields.length === 0) {
    return { updated: false, fields: [] };
  }

  const { error } = await supabaseAdmin
    .from('tools')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tool.id);

  if (error) {
    throw new Error(`Failed to update tool ${tool.name}: ${error.message}`);
  }

  return { updated: true, fields: updatedFields };
}
