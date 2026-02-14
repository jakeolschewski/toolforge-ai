/**
 * W.E.D.G.E.™ Framework for Workflow Design
 *
 * Workflow - Define the desired outcome
 * Evidence - Specify what success looks like
 * Data Hygiene - Ensure privacy and compliance
 * Guardrails - Set boundaries and constraints
 * Export - Define output format and delivery
 */

export interface WEDGEWorkflow {
  // W - Workflow Outcome
  workflow: {
    name: string;
    objective: string;
    targetAudience: string;
    estimatedTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };

  // E - Evidence of Success
  evidence: {
    successCriteria: string[];
    qualityMetrics: string[];
    expectedOutcomes: string[];
  };

  // D - Data Hygiene
  dataHygiene: {
    sensitiveDataTypes: string[];
    redactionRequired: boolean;
    privacyGuidelines: string[];
    complianceNotes: string[];
  };

  // G - Guardrails
  guardrails: {
    limitations: string[];
    bestPractices: string[];
    commonMistakes: string[];
    warningFlags: string[];
  };

  // E - Export Format
  export: {
    primaryFormat: string;
    alternativeFormats: string[];
    deliveryMethod: string;
    integrations: string[];
  };
}

/**
 * Generate a W.E.D.G.E compliant workflow prompt
 */
export function generateWEDGEPrompt(
  workflow: WEDGEWorkflow,
  _promptVariant: number = 1
): string {
  const disclaimer = `
⚠️ EDUCATIONAL USE ONLY - NOT PROFESSIONAL ADVICE
This workflow is for educational purposes only. Results may vary.
Not legal, financial, medical, or professional advice. Consult licensed professionals for specific guidance.
`.trim();

  const prompt = `
# ${workflow.workflow.name}

## WORKFLOW OBJECTIVE (W)
${workflow.workflow.objective}

**Target Audience**: ${workflow.workflow.targetAudience}
**Estimated Time**: ${workflow.workflow.estimatedTime}
**Difficulty**: ${workflow.workflow.difficulty}

## SUCCESS EVIDENCE (E)
You'll know this workflow succeeded when:
${workflow.evidence.successCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Quality Metrics**:
${workflow.evidence.qualityMetrics.map(m => `- ${m}`).join('\n')}

## DATA HYGIENE (D)
**⚠️ PRIVACY CRITICAL**: Before using this workflow:
${workflow.dataHygiene.privacyGuidelines.map(g => `- ${g}`).join('\n')}

**Sensitive Data to Redact**:
${workflow.dataHygiene.sensitiveDataTypes.map(t => `- ${t}`).join('\n')}

## GUARDRAILS (G)
**Best Practices**:
${workflow.guardrails.bestPractices.map(p => `✓ ${p}`).join('\n')}

**Avoid These Mistakes**:
${workflow.guardrails.commonMistakes.map(m => `✗ ${m}`).join('\n')}

**Warning Flags**:
${workflow.guardrails.warningFlags.map(w => `🚩 ${w}`).join('\n')}

## EXPORT FORMAT (E)
**Primary Output**: ${workflow.export.primaryFormat}
**Alternative Formats**: ${workflow.export.alternativeFormats.join(', ')}
**Delivery**: ${workflow.export.deliveryMethod}

---

${disclaimer}
  `.trim();

  return prompt;
}

/**
 * Validate a workflow against W.E.D.G.E framework
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateWEDGECompliance(workflow: any): {
  isCompliant: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check Workflow section
  if (!workflow.workflow?.name) issues.push('Missing workflow name');
  if (!workflow.workflow?.objective) issues.push('Missing workflow objective');

  // Check Evidence section
  if (!workflow.evidence?.successCriteria?.length) {
    issues.push('Missing success criteria');
  }

  // Check Data Hygiene section
  if (workflow.dataHygiene?.redactionRequired && !workflow.dataHygiene?.privacyGuidelines?.length) {
    issues.push('Redaction required but no privacy guidelines provided');
  }

  // Check Guardrails section
  if (!workflow.guardrails?.bestPractices?.length) {
    issues.push('Missing best practices');
  }

  // Check Export section
  if (!workflow.export?.primaryFormat) {
    issues.push('Missing primary export format');
  }

  return {
    isCompliant: issues.length === 0,
    issues,
  };
}

/**
 * Generate 10 prompt variants for a workflow
 */
export function generatePromptVariants(
  workflow: WEDGEWorkflow,
  baseTask: string
): string[] {
  const variants: string[] = [];

  // Variant 1: Basic starter
  variants.push(`${baseTask} - Start with [describe your situation]. Provide step-by-step guidance following best practices for ${workflow.workflow.objective}.`);

  // Variant 2: Detailed with context
  variants.push(`I need to ${baseTask}. My context: [industry], [experience level], [specific challenge]. Guide me through the process with W.E.D.G.E framework principles.`);

  // Variant 3: Quick version
  variants.push(`Quick ${baseTask}: Give me the essential steps only, focusing on ${workflow.workflow.objective}. Skip the explanations.`);

  // Variant 4: Comprehensive
  variants.push(`Comprehensive ${baseTask} including: setup, execution, quality checks, common pitfalls, and optimization tips. Target outcome: ${workflow.workflow.objective}.`);

  // Variant 5: Troubleshooting focus
  variants.push(`${baseTask} but I'm stuck at [specific step]. Help me troubleshoot and continue. Current status: [describe]. Expected result: ${workflow.workflow.objective}.`);

  // Variant 6: Team/collaborative
  variants.push(`Team workflow for ${baseTask}: Create a collaborative approach for [number] people. Include role assignments and coordination steps.`);

  // Variant 7: Scaled/advanced
  variants.push(`Advanced ${baseTask} for scaling: I've mastered basics, now optimize for [volume/complexity]. Focus on automation and efficiency gains.`);

  // Variant 8: Template generation
  variants.push(`Generate a reusable template for ${baseTask}. Include placeholders for [variables], standard procedures, and customization options.`);

  // Variant 9: Audit/review
  variants.push(`Audit my existing ${baseTask} process: [paste current approach]. Identify gaps, suggest improvements, ensure compliance with best practices.`);

  // Variant 10: Integration focused
  variants.push(`${baseTask} integrated with [tool/platform]. Provide connection steps, data flow mapping, and automation opportunities.`);

  return variants;
}

/**
 * Business Systems taxonomy
 */
export const BUSINESS_SYSTEMS = [
  {
    id: 'workspace-setup',
    name: 'AI Workspace Setup',
    description: 'Foundation tools and security configuration',
    icon: 'Settings',
    color: '#3B82F6',
  },
  {
    id: 'clarity-decision',
    name: 'Clarity & Decision Engine',
    description: 'Strategic thinking and prioritization',
    icon: 'Brain',
    color: '#8B5CF6',
  },
  {
    id: 'inbox-writing',
    name: 'Inbox & Writing Engine',
    description: 'Communication and content optimization',
    icon: 'Mail',
    color: '#EC4899',
  },
  {
    id: 'research-verification',
    name: 'Research Compression + Verification',
    description: 'Information gathering and fact-checking',
    icon: 'Search',
    color: '#F59E0B',
  },
  {
    id: 'content-production',
    name: 'Content Production OS',
    description: 'Full-scale content creation workflows',
    icon: 'FileText',
    color: '#10B981',
  },
  {
    id: 'visual-assets',
    name: 'Visual Asset System',
    description: 'Image and design workflows',
    icon: 'Image',
    color: '#06B6D4',
  },
  {
    id: 'automation-bridge',
    name: 'Automation Bridge',
    description: 'No-code integration and automation',
    icon: 'Zap',
    color: '#F97316',
  },
  {
    id: 'opportunity-leverage',
    name: 'Opportunity Leverage',
    description: 'Business development and monetization',
    icon: 'TrendingUp',
    color: '#14B8A6',
  },
  {
    id: 'sustain-update',
    name: 'Sustain & Update Engine',
    description: 'Maintenance and continuous improvement',
    icon: 'RefreshCw',
    color: '#6366F1',
  },
] as const;

/**
 * Get business system by ID
 */
export function getBusinessSystem(id: string) {
  return BUSINESS_SYSTEMS.find(s => s.id === id);
}
