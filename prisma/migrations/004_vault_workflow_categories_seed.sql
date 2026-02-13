-- ============================================================================
-- SEED: 9 AI Edge OS System Categories
-- ============================================================================
-- These replace the initial W.E.D.G.E. sample categories with the 9 actual
-- product systems that organize the 50 Workflow Vault products.
-- ============================================================================

INSERT INTO vault_categories (slug, name, description, icon, color, order_index, is_featured)
VALUES
  (
    'ai-workspace-setup',
    'AI Workspace Setup',
    'Foundation workflows for building your secure, optimized AI workspace from scratch. Covers tool selection, API security, data privacy, integrations, and custom dashboards.',
    '🏗️',
    '#3B82F6',
    1,
    TRUE
  ),
  (
    'clarity-decision-engine',
    'Clarity & Decision Engine',
    'Transform chaos into clarity with structured planning, prioritization matrices, risk assessment, goal mapping, brainstorming, and feedback analysis workflows.',
    '🎯',
    '#8B5CF6',
    2,
    TRUE
  ),
  (
    'inbox-writing-engine',
    'Inbox & Writing Engine',
    'Master professional communication with email optimization, tone-adaptive rewriting, document summarization, bio writing, meeting prep, and proposal drafting workflows.',
    '✍️',
    '#10B981',
    3,
    TRUE
  ),
  (
    'research-compression',
    'Research Compression + Verification',
    'Compress hours of research into minutes with competitor analysis, market research, citation verification, trend monitoring, and data synthesis workflows.',
    '🔬',
    '#F59E0B',
    4,
    TRUE
  ),
  (
    'content-production-os',
    'Content Production OS',
    'End-to-end content creation system covering blog posts, social media, newsletters, video scripts, repurposing, and SEO optimization workflows.',
    '📢',
    '#EF4444',
    5,
    TRUE
  ),
  (
    'visual-asset-system',
    'Visual Asset System',
    'Create professional visual assets with AI image generation, brand kits, presentation design, infographics, and thumbnail creation workflows.',
    '🎨',
    '#EC4899',
    6,
    TRUE
  ),
  (
    'automation-bridge',
    'Automation Bridge',
    'Connect and automate your tools with no-code workflow builders, CRM automation, data pipeline design, notification systems, and reporting dashboards.',
    '⚡',
    '#14B8A6',
    7,
    TRUE
  ),
  (
    'opportunity-leverage',
    'Opportunity Leverage',
    'Identify and capture opportunities with lead generation, partnership evaluation, pitch deck creation, pricing strategy, and competitive positioning workflows.',
    '💰',
    '#22C55E',
    8,
    TRUE
  ),
  (
    'sustain-update-engine',
    'Sustain & Update Engine',
    'Maintain and improve your systems with workflow audits, tool updates, performance reviews, knowledge base management, and community feedback integration.',
    '🔄',
    '#06B6D4',
    9,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index,
  is_featured = EXCLUDED.is_featured;

-- ============================================================================
-- COMPLETE
-- ============================================================================
