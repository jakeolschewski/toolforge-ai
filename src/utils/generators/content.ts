// Content Generator - Template-based with optional AI enhancement

import type { Tool, Review } from '@/types';
import { calculateReadTime, slugify } from '@/utils/helpers';

/**
 * Generate review content using templates
 * This is the realistic "zero-maintenance" approach
 */
export function generateTemplateReview(tool: Tool): Partial<Review> {
  const title = generateReviewTitle(tool);
  const content = generateReviewContent(tool);
  const pros = generatePros(tool);
  const cons = generateCons(tool);
  const verdict = generateVerdict(tool);

  return {
    title,
    content,
    pros_html: prosToHtml(pros),
    cons_html: consToHtml(cons),
    verdict,
    rating: estimateRating(tool),
    author: 'ToolForge Team',
    status: 'draft',
    seo_title: `${tool.name} Review 2026 - Is It Worth It?`,
    seo_description: `Comprehensive review of ${tool.name}: features, pricing, pros & cons. Find out if this ${tool.category} tool is right for you.`,
    keywords: generateKeywords(tool),
    read_time: calculateReadTime(content),
  };
}

function generateReviewTitle(tool: Tool): string {
  const templates = [
    `${tool.name} Review: ${tool.tagline || 'Complete Analysis'}`,
    `${tool.name} - Full Review & Analysis 2026`,
    `Is ${tool.name} Worth It? Honest Review`,
    `${tool.name} Review: Features, Pricing & More`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateReviewContent(tool: Tool): string {
  const intro = `
# ${tool.name} Review

${tool.description}

In this comprehensive review, we'll dive deep into ${tool.name}, exploring its features, pricing, and whether it's the right ${tool.category} tool for your needs.

## What is ${tool.name}?

${tool.name} is ${tool.tagline || `a powerful ${tool.category} tool`} that has been gaining attention in the AI tools space. ${tool.long_description || tool.description}

## Key Features

${tool.features.length > 0
  ? tool.features.map(f => `- ${f}`).join('\n')
  : generateDefaultFeatures(tool.category)}

## Pricing

${tool.name} offers a ${tool.pricing_model} pricing model${tool.starting_price ? `, starting at ${tool.starting_price}` : ''}.

${getPricingDescription(tool.pricing_model)}

## Who Should Use ${tool.name}?

${generateTargetAudience(tool.category)}

## Final Thoughts

${tool.name} is a ${getRatingText(estimateRating(tool))} ${tool.category} tool that offers ${tool.features.length > 0 ? 'a robust feature set' : 'valuable functionality'} for its users.

${generateConclusion(tool)}
`;

  return intro.trim();
}

function generatePros(tool: Tool): string[] {
  const categoryPros: Record<string, string[]> = {
    writing: ['Excellent content generation', 'Time-saving features', 'Multiple content types supported'],
    image: ['High-quality outputs', 'Fast generation speed', 'Creative control options'],
    video: ['Professional results', 'Easy to use interface', 'Quick rendering'],
    code: ['Accurate code suggestions', 'Multiple language support', 'Helpful documentation'],
    chat: ['Natural conversations', 'Quick responses', 'Helpful and accurate'],
    productivity: ['Boosts efficiency', 'User-friendly interface', 'Integrates well with existing tools'],
    marketing: ['Effective campaigns', 'Data-driven insights', 'Easy automation'],
    design: ['Professional designs', 'Intuitive controls', 'Fast workflow'],
    audio: ['High-quality audio', 'Fast processing', 'Multiple format support'],
    research: ['Comprehensive data', 'Accurate results', 'Time-saving features'],
  };

  const pros = categoryPros[tool.category] || categoryPros['productivity'];

  // Add pricing pro if applicable
  if (tool.pricing_model === 'free' || tool.pricing_model === 'freemium') {
    pros.unshift('Free tier available');
  }

  return pros.slice(0, 5);
}

function generateCons(tool: Tool): string[] {
  const genericCons = [
    'Learning curve for new users',
    'May require subscription for full features',
    'Could benefit from more tutorials',
  ];

  if (tool.pricing_model === 'paid') {
    genericCons.push('No free tier available');
  }

  return genericCons.slice(0, 3);
}

function generateVerdict(tool: Tool): string {
  const rating = estimateRating(tool);

  if (rating >= 4.5) {
    return `${tool.name} is an outstanding ${tool.category} tool that delivers exceptional value. Highly recommended for anyone serious about ${getCategoryGoal(tool.category)}.`;
  } else if (rating >= 4.0) {
    return `${tool.name} is a solid choice for ${tool.category} needs. It offers good value and reliable performance, making it worth considering.`;
  } else if (rating >= 3.5) {
    return `${tool.name} is a decent ${tool.category} tool with room for improvement. It's worth trying if it fits your specific requirements.`;
  } else {
    return `${tool.name} shows promise but may need further development. Consider trying it and seeing if it meets your needs.`;
  }
}

function estimateRating(tool: Tool): number {
  let rating = 4.0; // Base rating

  // Adjust based on pricing
  if (tool.pricing_model === 'free') rating += 0.3;
  if (tool.pricing_model === 'freemium') rating += 0.2;

  // Adjust based on features
  if (tool.features.length > 5) rating += 0.2;
  if (tool.features.length > 10) rating += 0.1;

  // Adjust if featured
  if (tool.is_featured) rating += 0.2;

  // Cap at 5.0
  return Math.min(5.0, Math.round(rating * 10) / 10);
}

function prosToHtml(pros: string[]): string {
  return `<ul class="pros-list">\n${pros.map(p => `  <li>${p}</li>`).join('\n')}\n</ul>`;
}

function consToHtml(cons: string[]): string {
  return `<ul class="cons-list">\n${cons.map(c => `  <li>${c}</li>`).join('\n')}\n</ul>`;
}

function generateKeywords(tool: Tool): string[] {
  const base = [
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} review`,
    `${tool.name.toLowerCase()} pricing`,
    tool.category,
    `best ${tool.category} tools`,
    `ai ${tool.category}`,
  ];

  tool.tags.forEach(tag => base.push(tag.toLowerCase()));

  return Array.from(new Set(base));
}

function generateDefaultFeatures(category: string): string {
  const features: Record<string, string[]> = {
    writing: ['AI-powered content generation', 'Multiple content formats', 'SEO optimization', 'Plagiarism checking'],
    image: ['High-resolution outputs', 'Multiple art styles', 'Batch generation', 'Custom training options'],
    video: ['AI video generation', 'Scene editing', 'Voice synthesis', 'Export in multiple formats'],
    code: ['Code completion', 'Bug detection', 'Refactoring suggestions', 'Multi-language support'],
    chat: ['Natural language understanding', '24/7 availability', 'Context retention', 'Multi-turn conversations'],
    productivity: ['Workflow automation', 'Task management', 'Team collaboration', 'Integrations'],
    marketing: ['Campaign creation', 'A/B testing', 'Analytics dashboard', 'Email automation'],
    design: ['Template library', 'Custom branding', 'Collaboration tools', 'Export options'],
    audio: ['Voice cloning', 'Music generation', 'Audio enhancement', 'Format conversion'],
    research: ['Data analysis', 'Report generation', 'Citation management', 'Collaboration features'],
  };

  return (features[category] || features['productivity']).map(f => `- ${f}`).join('\n');
}

function getPricingDescription(model: string): string {
  const descriptions: Record<string, string> = {
    free: 'This tool is completely free to use, making it accessible to everyone.',
    freemium: 'The freemium model allows you to start for free with the option to upgrade for premium features.',
    paid: 'This is a paid tool that requires a subscription or one-time purchase.',
    subscription: 'Access is provided through a monthly or annual subscription plan.',
  };

  return descriptions[model] || descriptions['freemium'];
}

function generateTargetAudience(category: string): string {
  const audiences: Record<string, string> = {
    writing: 'content creators, bloggers, marketers, and anyone who needs to produce written content regularly',
    image: 'designers, artists, marketers, and content creators looking to generate visual content quickly',
    video: 'video creators, marketers, educators, and businesses needing video content',
    code: 'developers, programmers, and software engineers looking to accelerate their coding workflow',
    chat: 'businesses, customer support teams, and individuals seeking AI conversation capabilities',
    productivity: 'professionals, teams, and anyone looking to optimize their workflow and save time',
    marketing: 'marketers, agencies, small businesses, and e-commerce operators',
    design: 'designers, creative professionals, and teams needing design tools',
    audio: 'podcasters, musicians, content creators, and audio professionals',
    research: 'researchers, analysts, students, and professionals conducting in-depth studies',
  };

  return `This tool is ideal for ${audiences[category] || audiences['productivity']}.`;
}

function generateConclusion(tool: Tool): string {
  return `Whether ${tool.name} is right for you depends on your specific ${tool.category} needs and budget. ${
    tool.pricing_model === 'free' || tool.pricing_model === 'freemium'
      ? 'With a free tier available, it\'s worth trying out to see if it fits your workflow.'
      : 'Consider whether the features justify the investment for your use case.'
  }`;
}

function getRatingText(rating: number): string {
  if (rating >= 4.5) return 'excellent';
  if (rating >= 4.0) return 'very good';
  if (rating >= 3.5) return 'good';
  if (rating >= 3.0) return 'decent';
  return 'basic';
}

function getCategoryGoal(category: string): string {
  const goals: Record<string, string> = {
    writing: 'content creation',
    image: 'visual content generation',
    video: 'video production',
    code: 'development work',
    chat: 'conversational AI',
    productivity: 'maximizing efficiency',
    marketing: 'digital marketing',
    design: 'creative design work',
    audio: 'audio production',
    research: 'research and analysis',
  };

  return goals[category] || 'this category';
}

/**
 * Optional: Enhanced content with AI (requires OpenAI API key)
 * This function would call GPT-4 for higher quality content
 */
export async function generateAIEnhancedReview(tool: Tool): Promise<Partial<Review>> {
  // Only use if OPENAI_API_KEY is set
  if (!process.env.OPENAI_API_KEY) {
    return generateTemplateReview(tool);
  }

  try {
    // This would make an OpenAI API call
    // For now, fall back to template
    console.log('AI enhancement would be called here for:', tool.name);
    return generateTemplateReview(tool);
  } catch (error) {
    console.error('AI generation failed, using template:', error);
    return generateTemplateReview(tool);
  }
}
