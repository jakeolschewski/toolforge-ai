-- ============================================================================
-- SEED: All 50 Workflow Vault Products
-- ============================================================================
-- Inserts all 50 AI Edge OS Workflow Vault products into vault_workflows.
-- Categories referenced by slug subquery from vault_categories.
-- Pricing: Beginner $149, Intermediate $199, Advanced $249, Free = $0
-- ============================================================================

-- --------------------------------------------------------------------------
-- SYSTEM 1: AI Workspace Setup (Workflows 1-6)
-- --------------------------------------------------------------------------

INSERT INTO vault_workflows (
  slug, title, tagline, description, long_description,
  category_id, pricing_type, price, is_free,
  file_url, file_type, tags, difficulty_level, estimated_time,
  features, use_cases, author, version, status,
  is_featured, is_new, published_at
) VALUES

-- Workflow 01: Personal AI Tool Stack Quiz & Builder
(
  '01-personal-ai-tool-stack-quiz-builder',
  'Personal AI Tool Stack Quiz & Builder',
  'Discover your perfect AI toolkit in under 90 minutes',
  'Systematically identify, evaluate, and assemble optimal AI tool combinations tailored to your needs, budget, and technical skill level.',
  'The Personal AI Tool Stack Quiz & Builder provides a structured W.E.D.G.E. framework approach to discovering and assembling your ideal AI toolkit. Through a 10-question self-assessment quiz, personalized recommendations, and a step-by-step setup process, you will build a custom AI stack that matches your workflow needs, budget constraints, and technical comfort level. Includes privacy-first evaluation criteria and a quarterly review process.',
  (SELECT id FROM vault_categories WHERE slug = 'ai-workspace-setup'),
  'free', 0, TRUE,
  '/workflows/01-personal-ai-tool-stack-quiz-builder', 'zip',
  ARRAY['ai-tools', 'tool-selection', 'workspace-setup', 'quiz', 'productivity'],
  'beginner', 90,
  '["10-question self-assessment quiz", "Personalized tool recommendations", "Budget-aware suggestions", "Privacy-first evaluation criteria", "Quarterly review template"]'::jsonb,
  '["Individual professionals building their first AI stack", "Teams standardizing on AI tools", "Budget-conscious users seeking free alternatives"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  TRUE, TRUE, NOW()
),

-- Workflow 02: Secure API Key Management
(
  '02-secure-api-key-management',
  'Secure API Key Management Workflow',
  'Protect your credentials with enterprise-grade security practices',
  'Create, store, rotate, and audit API keys and authentication credentials securely with a systematic lifecycle management approach.',
  'The Secure API Key Management Workflow provides a comprehensive W.E.D.G.E. framework for credential lifecycle management. From initial inventory through secure storage, rotation scheduling, access controls, monitoring, and incident response, this workflow ensures zero credentials stored in plain text. Includes compliance considerations for SOC 2, ISO 27001, GDPR, and HIPAA.',
  (SELECT id FROM vault_categories WHERE slug = 'ai-workspace-setup'),
  'premium', 14900, FALSE,
  '/workflows/02-secure-api-key-management', 'zip',
  ARRAY['security', 'api-keys', 'credentials', 'compliance', 'encryption'],
  'beginner', 75,
  '["Complete credential inventory system", "Secure storage setup guide", "Automated rotation scheduling", "Incident response playbook", "Compliance-ready audit procedures"]'::jsonb,
  '["Developers managing multiple API services", "Teams needing credential security policies", "Compliance-driven organizations"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 03: Data Redaction Basics for Beginners
(
  '03-data-redaction-basics',
  'Data Redaction Basics for Beginners',
  'Learn to protect sensitive information before sharing with AI',
  'Learn to identify and remove sensitive information before sharing with AI tools using manual and automated redaction techniques.',
  'The Data Redaction Basics workflow teaches essential privacy skills through the W.E.D.G.E. framework. Learn to identify PII, financial data, and other sensitive information types, then apply systematic redaction using both manual techniques and automated tools. Covers GDPR/CCPA compliance basics and industry-specific requirements for HIPAA and PCI DSS.',
  (SELECT id FROM vault_categories WHERE slug = 'ai-workspace-setup'),
  'free', 0, TRUE,
  '/workflows/03-data-redaction-basics', 'zip',
  ARRAY['privacy', 'redaction', 'pii', 'gdpr', 'data-protection'],
  'beginner', 45,
  '["PII identification framework", "Manual and automated redaction techniques", "GDPR/CCPA compliance basics", "Before/after redaction examples", "Industry-specific guidelines"]'::jsonb,
  '["Anyone sharing data with AI tools", "Privacy-conscious professionals", "Teams handling sensitive client data"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 04: Workspace Privacy Audit & Setup
(
  '04-workspace-privacy-audit-setup',
  'Workspace Privacy Audit & Setup',
  'Conduct a comprehensive privacy assessment of your digital workspace',
  'Conduct a comprehensive privacy assessment of your digital workspace and tools, then implement controls to protect your data.',
  'The Workspace Privacy Audit & Setup workflow provides a systematic W.E.D.G.E. approach to evaluating and securing your entire digital workspace. Map all tool data flows, review privacy policies, implement technical controls like VPNs and encryption, run audit simulations, and create a remediation roadmap. Covers compliance gap analysis for GDPR, CCPA, and other frameworks.',
  (SELECT id FROM vault_categories WHERE slug = 'ai-workspace-setup'),
  'premium', 14900, FALSE,
  '/workflows/04-workspace-privacy-audit-setup', 'zip',
  ARRAY['privacy', 'audit', 'workspace', 'compliance', 'data-flow'],
  'beginner', 180,
  '["Complete privacy inventory template", "Data flow mapping system", "Compliance gap analysis", "Privacy policy review framework", "Remediation roadmap builder"]'::jsonb,
  '["Remote workers securing home offices", "Teams auditing tool privacy", "Compliance officers assessing AI tool usage"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 05: Tool Integration Quickstart (No-Code)
(
  '05-tool-integration-quickstart-no-code',
  'Tool Integration Quickstart (No-Code)',
  'Connect your AI tools without writing a single line of code',
  'Connect AI tools without coding using automation platforms like Zapier and Make for seamless workflow integration.',
  'The Tool Integration Quickstart provides a no-code W.E.D.G.E. approach to connecting your AI tools. Select integration platforms, map data flows between tools, build automated workflows using visual connectors, test end-to-end, and implement error handling. Perfect for non-technical users who want powerful automation without writing code.',
  (SELECT id FROM vault_categories WHERE slug = 'ai-workspace-setup'),
  'premium', 14900, FALSE,
  '/workflows/05-tool-integration-quickstart-no-code', 'zip',
  ARRAY['integration', 'no-code', 'zapier', 'automation', 'connectors'],
  'beginner', 120,
  '["Platform selection guide", "Visual data flow mapper", "Common workflow patterns library", "Error handling templates", "Cost optimization strategies"]'::jsonb,
  '["Non-technical users automating workflows", "Small teams connecting AI tools", "Solopreneurs streamlining operations"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 06: Custom Dashboard Template Creator
(
  '06-custom-dashboard-template-creator',
  'Custom Dashboard Template Creator',
  'Build personalized dashboards to track your AI tool ROI',
  'Build personalized dashboards for tracking AI tool usage, outcomes, and return on investment across platforms.',
  'The Custom Dashboard Template Creator uses the W.E.D.G.E. framework to help you design and build actionable dashboards. Define key metrics, choose your platform (Notion, Airtable, Google Sheets), build layouts with placeholders, populate with sample data, and export securely. Includes KPI selection guidance and visualization best practices.',
  (SELECT id FROM vault_categories WHERE slug = 'ai-workspace-setup'),
  'premium', 14900, FALSE,
  '/workflows/06-custom-dashboard-template-creator', 'zip',
  ARRAY['dashboard', 'metrics', 'tracking', 'roi', 'visualization'],
  'beginner', 180,
  '["Dashboard design principles guide", "KPI selection framework", "Multi-platform templates", "Automated data collection setup", "Visualization best practices"]'::jsonb,
  '["Managers tracking team AI adoption", "Individuals measuring productivity gains", "Teams reporting on AI tool ROI"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 2: Clarity & Decision Engine (Workflows 7-12)
-- --------------------------------------------------------------------------

-- Workflow 07: Daily Chaos-to-Plan Converter
(
  '07-daily-chaos-to-plan-converter',
  'Daily Chaos-to-Plan Converter',
  'Transform overwhelming task lists into clear action plans in 15 minutes',
  'Transform overwhelming task lists into structured, prioritized action plans using AI-assisted categorization and time blocking.',
  'The Daily Chaos-to-Plan Converter applies the W.E.D.G.E. framework to your daily planning. Dump all tasks and ideas, let AI help categorize and prioritize them, convert chaos into actionable time-blocked plans, set reminders, and review at end of day. Includes energy-aware scheduling and break integration for sustainable productivity.',
  (SELECT id FROM vault_categories WHERE slug = 'clarity-decision-engine'),
  'free', 0, TRUE,
  '/workflows/07-daily-chaos-to-plan-converter', 'zip',
  ARRAY['planning', 'productivity', 'prioritization', 'time-management', 'daily-routine'],
  'intermediate', 20,
  '["Brain dump to structured list converter", "AI-assisted prioritization engine", "Time blocking integration", "Energy-aware task scheduling", "End-of-day review template"]'::jsonb,
  '["Overwhelmed professionals with too many tasks", "Remote workers managing their own schedules", "Anyone struggling with daily prioritization"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  TRUE, TRUE, NOW()
),

-- Workflow 08: Decision Matrix for Project Prioritization
(
  '08-decision-matrix-project-prioritization',
  'Decision Matrix for Project Prioritization',
  'Make data-driven project decisions with weighted scoring',
  'Systematically evaluate and prioritize projects using weighted criteria, scoring methodology, and AI-assisted analysis.',
  'The Decision Matrix workflow brings the W.E.D.G.E. framework to project prioritization. List projects and criteria (impact, effort, risk), score each systematically, calculate weighted priorities, select top candidates, and document rationale for stakeholder communication. Includes scenario comparison and team collaboration features.',
  (SELECT id FROM vault_categories WHERE slug = 'clarity-decision-engine'),
  'premium', 19900, FALSE,
  '/workflows/08-decision-matrix-project-prioritization', 'zip',
  ARRAY['decision-making', 'prioritization', 'project-management', 'matrix', 'scoring'],
  'intermediate', 60,
  '["Weighted criteria scoring system", "AI-assisted analysis engine", "Scenario comparison tools", "Stakeholder communication templates", "Historical decision tracking"]'::jsonb,
  '["Project managers selecting quarterly initiatives", "Startups deciding product priorities", "Teams resolving competing project demands"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 09: Risk Assessment & Mitigation Planner
(
  '09-risk-assessment-mitigation-planner',
  'Risk Assessment & Mitigation Planner',
  'Identify and neutralize project risks before they become problems',
  'Identify, assess, and plan mitigation strategies for project and business risks using structured probability and impact analysis.',
  'The Risk Assessment & Mitigation Planner applies W.E.D.G.E. principles to proactive risk management. Identify risks in any plan, assess likelihood and impact on a 5-point scale, brainstorm and evaluate mitigations, assign action owners, and establish ongoing monitoring. Includes worst-case scenario simulation and integration with decision matrices.',
  (SELECT id FROM vault_categories WHERE slug = 'clarity-decision-engine'),
  'premium', 19900, FALSE,
  '/workflows/09-risk-assessment-mitigation-planner', 'zip',
  ARRAY['risk-assessment', 'mitigation', 'planning', 'contingency', 'project-management'],
  'intermediate', 120,
  '["Risk identification framework", "Probability-impact scoring matrix", "Mitigation strategy generator", "Action assignment system", "Ongoing monitoring dashboard"]'::jsonb,
  '["Project managers planning new initiatives", "Business owners evaluating strategic moves", "Teams launching products or services"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 10: Goal Breakdown & Milestone Mapper
(
  '10-goal-breakdown-milestone-mapper',
  'Goal Breakdown & Milestone Mapper',
  'Decompose big goals into achievable milestones with clear timelines',
  'Decompose large goals into actionable milestones and tasks using reverse planning methodology and progress tracking.',
  'The Goal Breakdown & Milestone Mapper uses the W.E.D.G.E. framework for systematic goal decomposition. Define your big goal, break it into SMART sub-goals, map milestones with dates and dependencies, assign resources, and track progress. Includes roadmap visualization guidance and integration with daily planning workflows.',
  (SELECT id FROM vault_categories WHERE slug = 'clarity-decision-engine'),
  'premium', 19900, FALSE,
  '/workflows/10-goal-breakdown-milestone-mapper', 'zip',
  ARRAY['goals', 'milestones', 'planning', 'roadmap', 'decomposition'],
  'intermediate', 90,
  '["SMART goal refinement tool", "Reverse planning methodology", "Milestone dependency mapper", "Resource allocation framework", "Progress tracking templates"]'::jsonb,
  '["Entrepreneurs planning product launches", "Professionals setting career milestones", "Teams aligning on quarterly objectives"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 11: Brainstorm Session Simulator
(
  '11-brainstorm-session-simulator',
  'Brainstorm Session Simulator',
  'Generate and evaluate 20-50 ideas in a structured AI-facilitated session',
  'Use AI to facilitate structured brainstorming with proven frameworks like SCAMPER and Six Thinking Hats for idea generation and evaluation.',
  'The Brainstorm Session Simulator brings W.E.D.G.E. structure to creative ideation. Set topic and constraints, generate ideas prioritizing quantity, refine and group using proven frameworks (SCAMPER, Six Thinking Hats), evaluate feasibility, and select top candidates. Includes creative block-busting techniques and team collaboration prompts.',
  (SELECT id FROM vault_categories WHERE slug = 'clarity-decision-engine'),
  'premium', 19900, FALSE,
  '/workflows/11-brainstorm-session-simulator', 'zip',
  ARRAY['brainstorming', 'ideation', 'creativity', 'innovation', 'frameworks'],
  'intermediate', 60,
  '["Multiple brainstorming frameworks", "Quantity-first idea generation", "Idea clustering and grouping", "Feasibility evaluation matrix", "Creative block-busting techniques"]'::jsonb,
  '["Product teams generating feature ideas", "Marketing teams planning campaigns", "Solo founders exploring new directions"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 12: Feedback Loop Analyzer
(
  '12-feedback-loop-analyzer',
  'Feedback Loop Analyzer',
  'Turn scattered feedback into actionable insights and improvements',
  'Systematically collect, analyze, and act on feedback from multiple sources with sentiment analysis and pattern identification.',
  'The Feedback Loop Analyzer applies the W.E.D.G.E. framework to feedback management. Collect feedback data from multiple sources, analyze patterns using AI, identify improvement opportunities, plan targeted actions, and implement closed-loop follow-up. Includes sentiment quantification and long-term trend analysis capabilities.',
  (SELECT id FROM vault_categories WHERE slug = 'clarity-decision-engine'),
  'premium', 19900, FALSE,
  '/workflows/12-feedback-loop-analyzer', 'zip',
  ARRAY['feedback', 'analysis', 'sentiment', 'improvement', 'patterns'],
  'intermediate', 60,
  '["Multi-source feedback collection", "AI-powered pattern identification", "Sentiment analysis framework", "Action plan generator", "Closed-loop tracking system"]'::jsonb,
  '["Product managers analyzing user feedback", "Service providers improving client satisfaction", "Teams conducting retrospectives"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 3: Inbox & Writing Engine (Workflows 13-18)
-- --------------------------------------------------------------------------

-- Workflow 13: Email Response Optimizer
(
  '13-email-response-optimizer',
  'Email Response Optimizer',
  'Cut email response time by 50-70% with AI-optimized drafts',
  'Craft effective, professional email responses efficiently using AI-powered tone matching, key point extraction, and response optimization.',
  'The Email Response Optimizer uses the W.E.D.G.E. framework to transform your email workflow. Read and analyze incoming emails, identify key points and appropriate tone, draft optimized responses with clear calls-to-action, check for clarity and professionalism, and archive efficiently. Includes batch processing for high-volume inboxes.',
  (SELECT id FROM vault_categories WHERE slug = 'inbox-writing-engine'),
  'premium', 19900, FALSE,
  '/workflows/13-email-response-optimizer', 'zip',
  ARRAY['email', 'communication', 'productivity', 'writing', 'professional'],
  'intermediate', 30,
  '["Email categorization system", "Tone matching framework", "Response template library", "Follow-up scheduling", "Batch processing capability"]'::jsonb,
  '["Professionals drowning in email", "Customer service teams", "Managers handling high email volume"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  TRUE, TRUE, NOW()
),

-- Workflow 14: Tone-Adaptive Rewrite System
(
  '14-tone-adaptive-rewrite-system',
  'Tone-Adaptive Rewrite System',
  'Instantly adjust content tone for any audience or context',
  'Adjust content tone for different audiences and contexts using iterative AI-powered rewriting with side-by-side comparison.',
  'The Tone-Adaptive Rewrite System applies W.E.D.G.E. principles to communication adaptation. Input original text, specify target tone, iterate through rewrites, compare versions side-by-side, and finalize. Supports tone blending, cultural sensitivity checking, and batch processing for large content sets.',
  (SELECT id FROM vault_categories WHERE slug = 'inbox-writing-engine'),
  'premium', 19900, FALSE,
  '/workflows/14-tone-adaptive-rewrite-system', 'zip',
  ARRAY['tone', 'rewriting', 'communication', 'adaptation', 'content'],
  'intermediate', 15,
  '["Tone spectrum identification", "Audience analysis framework", "Iterative rewrite engine", "Side-by-side comparison", "Cultural sensitivity checker"]'::jsonb,
  '["Content creators adapting for multiple platforms", "Professionals switching between formal/informal", "Teams maintaining brand voice consistency"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 15: Document Summarizer & Editor
(
  '15-document-summarizer-editor',
  'Document Summarizer & Editor',
  'Summarize and polish documents in a fraction of the time',
  'Efficiently summarize and edit long documents using AI-assisted extraction, restructuring, and clarity optimization.',
  'The Document Summarizer & Editor uses the W.E.D.G.E. framework for efficient document processing. Upload or paste documents, generate targeted summaries (executive, key points, action items), edit for clarity and conciseness, verify accuracy against originals, and export polished versions. Includes multi-document synthesis and version control integration.',
  (SELECT id FROM vault_categories WHERE slug = 'inbox-writing-engine'),
  'premium', 19900, FALSE,
  '/workflows/15-document-summarizer-editor', 'zip',
  ARRAY['summarization', 'editing', 'documents', 'writing', 'productivity'],
  'intermediate', 30,
  '["Multiple summarization strategies", "Length-targeted output", "Multi-document synthesis", "Clarity optimization engine", "Version control integration"]'::jsonb,
  '["Executives reviewing lengthy reports", "Researchers processing multiple papers", "Teams creating executive summaries"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 16: Professional Bio & Profile Writer
(
  '16-professional-bio-profile-writer',
  'Professional Bio & Profile Writer',
  'Craft compelling bios and profiles that open doors',
  'Create polished professional bios and profiles for LinkedIn, websites, speaker pages, and proposals with AI-guided frameworks.',
  'The Professional Bio & Profile Writer leverages the W.E.D.G.E. framework to help you craft compelling professional narratives. Gather key achievements and credentials, select appropriate tone and format for each platform, generate multiple versions (short, medium, long), optimize for searchability, and maintain consistency across profiles.',
  (SELECT id FROM vault_categories WHERE slug = 'inbox-writing-engine'),
  'premium', 19900, FALSE,
  '/workflows/16-professional-bio-profile-writer', 'zip',
  ARRAY['bio', 'profile', 'linkedin', 'personal-branding', 'writing'],
  'intermediate', 45,
  '["Multi-platform bio templates", "Achievement highlighting framework", "Tone and format selector", "SEO optimization for profiles", "Consistency checker across platforms"]'::jsonb,
  '["Job seekers updating LinkedIn profiles", "Speakers creating event bios", "Professionals building personal brands"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 17: Meeting Notes to Action Items Converter
(
  '17-meeting-notes-to-action-items-converter',
  'Meeting Notes to Action Items Converter',
  'Never lose a meeting action item again',
  'Transform raw meeting notes into structured action items with owners, deadlines, and follow-up tracking using AI extraction.',
  'The Meeting Notes to Action Items Converter applies W.E.D.G.E. principles to post-meeting productivity. Paste raw notes, extract decisions and commitments, assign owners and deadlines, create follow-up tracking, and distribute summaries. Ensures nothing falls through the cracks between meetings.',
  (SELECT id FROM vault_categories WHERE slug = 'inbox-writing-engine'),
  'premium', 19900, FALSE,
  '/workflows/17-meeting-notes-to-action-items-converter', 'zip',
  ARRAY['meetings', 'action-items', 'productivity', 'notes', 'follow-up'],
  'intermediate', 15,
  '["Raw notes to structured extraction", "Action item identification engine", "Owner and deadline assignment", "Follow-up tracking system", "Summary distribution templates"]'::jsonb,
  '["Meeting facilitators", "Project managers tracking commitments", "Teams improving meeting accountability"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 18: Persuasive Copy Framework
(
  '18-persuasive-copy-framework',
  'Persuasive Copy Framework',
  'Write copy that converts using proven persuasion frameworks',
  'Create compelling persuasive copy using structured frameworks like AIDA, PAS, and storytelling techniques with AI assistance.',
  'The Persuasive Copy Framework uses the W.E.D.G.E. approach to teach and apply proven copywriting frameworks. Select the right framework for your goal (AIDA, PAS, Before-After-Bridge), generate draft copy, test variations, optimize for conversion, and adapt for different channels. Ethical persuasion principles built in throughout.',
  (SELECT id FROM vault_categories WHERE slug = 'inbox-writing-engine'),
  'premium', 19900, FALSE,
  '/workflows/18-persuasive-copy-framework', 'zip',
  ARRAY['copywriting', 'persuasion', 'marketing', 'conversion', 'frameworks'],
  'intermediate', 45,
  '["AIDA/PAS/BAB framework templates", "AI-assisted draft generation", "A/B variation testing", "Conversion optimization tips", "Ethical persuasion guidelines"]'::jsonb,
  '["Marketers writing landing pages", "Entrepreneurs crafting pitches", "Content creators improving engagement"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 4: Research Compression + Verification (Workflows 19-23)
-- --------------------------------------------------------------------------

-- Workflow 19: Topic Research Extractor
(
  '19-topic-research-extractor',
  'Topic Research Extractor',
  'Compress hours of research into structured, actionable briefs',
  'Extract and organize key insights from complex topics using AI-powered research compression and structured output frameworks.',
  'The Topic Research Extractor applies W.E.D.G.E. methodology to research efficiency. Define your research question, use AI to extract key findings from multiple sources, organize into structured briefs, verify critical claims, and export actionable summaries. Reduces research time by 60-80% while maintaining thoroughness.',
  (SELECT id FROM vault_categories WHERE slug = 'research-compression'),
  'premium', 19900, FALSE,
  '/workflows/19-topic-research-extractor', 'zip',
  ARRAY['research', 'extraction', 'analysis', 'briefs', 'knowledge'],
  'intermediate', 60,
  '["Multi-source research framework", "Key insight extraction engine", "Structured brief templates", "Claim verification checklist", "Time-saving research protocols"]'::jsonb,
  '["Researchers compressing literature reviews", "Analysts preparing market briefs", "Students tackling complex topics"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 20: Source Verification Checker
(
  '20-source-verification-checker',
  'Source Verification Checker',
  'Verify claims and sources before they become your problem',
  'Systematically verify the credibility and accuracy of sources, claims, and data before using them in your work.',
  'The Source Verification Checker brings W.E.D.G.E. rigor to information verification. Evaluate source credibility, cross-reference claims against multiple sources, check for bias and conflicts of interest, verify data accuracy, and document your verification trail. Essential for maintaining integrity in AI-assisted research.',
  (SELECT id FROM vault_categories WHERE slug = 'research-compression'),
  'premium', 19900, FALSE,
  '/workflows/20-source-verification-checker', 'zip',
  ARRAY['verification', 'fact-checking', 'credibility', 'sources', 'accuracy'],
  'intermediate', 30,
  '["Source credibility scoring system", "Cross-reference verification framework", "Bias detection checklist", "Data accuracy validation", "Verification trail documentation"]'::jsonb,
  '["Journalists verifying claims", "Researchers validating sources", "Content creators ensuring accuracy"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 21: Fact-Check & Citation Builder
(
  '21-fact-check-citation-builder',
  'Fact-Check & Citation Builder',
  'Build bulletproof citations and verify facts systematically',
  'Build properly formatted citations and systematically fact-check claims using structured verification workflows.',
  'The Fact-Check & Citation Builder applies W.E.D.G.E. standards to academic and professional rigor. Identify claims requiring verification, locate authoritative sources, build properly formatted citations (APA, MLA, Chicago), cross-verify facts, and create reusable reference libraries. Guards against AI hallucination in research.',
  (SELECT id FROM vault_categories WHERE slug = 'research-compression'),
  'premium', 19900, FALSE,
  '/workflows/21-fact-check-citation-builder', 'zip',
  ARRAY['citations', 'fact-checking', 'references', 'academic', 'verification'],
  'intermediate', 45,
  '["Multi-format citation generator", "Fact verification framework", "Source authority ranking", "AI hallucination detection", "Reference library builder"]'::jsonb,
  '["Academic researchers building bibliographies", "Content creators citing sources", "Professionals writing evidence-based reports"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 22: Brief Compiler for Reports
(
  '22-brief-compiler-for-reports',
  'Brief Compiler for Reports',
  'Compile professional briefs from scattered information sources',
  'Compile structured briefs and reports from multiple scattered information sources using AI-assisted organization and formatting.',
  'The Brief Compiler uses the W.E.D.G.E. framework to transform scattered information into polished briefs. Gather source materials, extract key points with AI assistance, organize into logical structure, format for your audience, and generate executive summaries. Includes templates for different brief types (research, competitive, strategic).',
  (SELECT id FROM vault_categories WHERE slug = 'research-compression'),
  'premium', 19900, FALSE,
  '/workflows/22-brief-compiler-for-reports', 'zip',
  ARRAY['briefs', 'reports', 'compilation', 'organization', 'formatting'],
  'intermediate', 60,
  '["Multi-source information gathering", "Key point extraction engine", "Logical structure templates", "Audience-aware formatting", "Executive summary generator"]'::jsonb,
  '["Analysts preparing client briefs", "Managers compiling team reports", "Consultants creating deliverables"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 23: Trend Analysis Synthesizer
(
  '23-trend-analysis-synthesizer',
  'Trend Analysis Synthesizer',
  'Spot emerging trends before your competitors do',
  'Synthesize trend data from multiple sources into actionable insights using pattern recognition and forward-looking analysis.',
  'The Trend Analysis Synthesizer applies W.E.D.G.E. methodology to trend intelligence. Identify relevant data sources, extract trend signals with AI, synthesize patterns across sources, project future implications, and create actionable trend reports. Includes industry-specific frameworks and competitive intelligence integration.',
  (SELECT id FROM vault_categories WHERE slug = 'research-compression'),
  'premium', 19900, FALSE,
  '/workflows/23-trend-analysis-synthesizer', 'zip',
  ARRAY['trends', 'analysis', 'synthesis', 'forecasting', 'intelligence'],
  'intermediate', 90,
  '["Multi-source trend monitoring", "AI-powered pattern recognition", "Cross-industry synthesis", "Future implication projector", "Actionable trend report templates"]'::jsonb,
  '["Strategists identifying market shifts", "Product teams tracking industry trends", "Executives making forward-looking decisions"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 5: Content Production OS (Workflows 24-29)
-- --------------------------------------------------------------------------

-- Workflow 24: Content Idea Generator
(
  '24-content-idea-generator',
  'Content Idea Generator',
  'Never run out of content ideas again',
  'Generate unlimited content ideas using structured brainstorming frameworks, audience analysis, and trend-aware ideation.',
  'The Content Idea Generator uses the W.E.D.G.E. framework to create a sustainable content pipeline. Analyze your audience and niche, apply proven ideation frameworks, generate ideas across formats (blog, video, social, podcast), evaluate and prioritize by impact, and build a content calendar. Includes seasonal and trending topic integration.',
  (SELECT id FROM vault_categories WHERE slug = 'content-production-os'),
  'premium', 19900, FALSE,
  '/workflows/24-content-idea-generator', 'zip',
  ARRAY['content', 'ideation', 'brainstorming', 'content-calendar', 'marketing'],
  'intermediate', 45,
  '["Audience-aware ideation engine", "Multi-format idea generation", "Content calendar builder", "Trend integration system", "Priority scoring matrix"]'::jsonb,
  '["Content marketers planning calendars", "Bloggers seeking fresh topics", "Social media managers filling queues"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  TRUE, TRUE, NOW()
),

-- Workflow 25: Draft-to-Polished Article System
(
  '25-draft-to-polished-article-system',
  'Draft-to-Polished Article System',
  'Transform rough drafts into publication-ready articles',
  'Transform rough drafts into polished, publication-ready articles using systematic editing, restructuring, and quality optimization.',
  'The Draft-to-Polished Article System applies W.E.D.G.E. standards to content refinement. Start with any rough draft, analyze structure and flow, iteratively edit for clarity and engagement, optimize for SEO, and produce publication-ready output. Includes readability scoring and multi-round editing protocols.',
  (SELECT id FROM vault_categories WHERE slug = 'content-production-os'),
  'premium', 19900, FALSE,
  '/workflows/25-draft-to-polished-article-system', 'zip',
  ARRAY['writing', 'editing', 'articles', 'publishing', 'content'],
  'intermediate', 60,
  '["Structure analysis engine", "Iterative editing workflow", "Readability optimization", "SEO integration", "Publication readiness checker"]'::jsonb,
  '["Bloggers polishing content", "Marketing teams refining articles", "Authors editing manuscripts"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 26: Repurpose Engine (Blog to Social)
(
  '26-repurpose-engine-blog-to-social',
  'Repurpose Engine (Blog to Social)',
  'Turn one piece of content into 10+ platform-specific assets',
  'Repurpose long-form content into platform-specific social media posts, threads, carousels, and short-form content.',
  'The Repurpose Engine uses the W.E.D.G.E. framework for maximum content leverage. Take any blog post or long-form content, extract key messages, adapt for each platform (Twitter/X, LinkedIn, Instagram, TikTok), optimize format and length, and schedule distribution. Multiply your content output 10x without creating from scratch.',
  (SELECT id FROM vault_categories WHERE slug = 'content-production-os'),
  'premium', 19900, FALSE,
  '/workflows/26-repurpose-engine-blog-to-social', 'zip',
  ARRAY['repurposing', 'social-media', 'content', 'distribution', 'multi-platform'],
  'intermediate', 30,
  '["Platform-specific adaptation", "Key message extraction", "Format optimization engine", "Visual suggestion framework", "Distribution scheduling guide"]'::jsonb,
  '["Content creators maximizing reach", "Marketers managing multiple platforms", "Solopreneurs stretching content budgets"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 27: SEO Keyword Integrator
(
  '27-seo-keyword-integrator',
  'SEO Keyword Integrator',
  'Weave SEO keywords naturally into any content',
  'Integrate SEO keywords naturally into existing content without sacrificing readability or quality.',
  'The SEO Keyword Integrator applies W.E.D.G.E. principles to search optimization. Research relevant keywords, analyze existing content for opportunities, naturally integrate primary and secondary keywords, optimize metadata and structure, and verify search-friendliness. Maintains content quality while boosting discoverability.',
  (SELECT id FROM vault_categories WHERE slug = 'content-production-os'),
  'premium', 19900, FALSE,
  '/workflows/27-seo-keyword-integrator', 'zip',
  ARRAY['seo', 'keywords', 'optimization', 'search', 'content'],
  'intermediate', 30,
  '["Keyword research framework", "Content gap analysis", "Natural integration techniques", "Metadata optimization", "Search-friendliness checker"]'::jsonb,
  '["Content writers optimizing for search", "Marketing teams improving organic traffic", "Bloggers boosting discoverability"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 28: Newsletter Assembly Workflow
(
  '28-newsletter-assembly-workflow',
  'Newsletter Assembly Workflow',
  'Assemble professional newsletters in half the time',
  'Assemble professional newsletters efficiently using content curation, formatting templates, and audience-targeted messaging.',
  'The Newsletter Assembly Workflow uses the W.E.D.G.E. framework for efficient newsletter production. Curate content from multiple sources, structure with proven templates, write engaging subject lines and intros, format for email deliverability, and optimize send timing. Includes A/B testing guidance and analytics integration.',
  (SELECT id FROM vault_categories WHERE slug = 'content-production-os'),
  'premium', 19900, FALSE,
  '/workflows/28-newsletter-assembly-workflow', 'zip',
  ARRAY['newsletter', 'email-marketing', 'curation', 'content', 'engagement'],
  'intermediate', 60,
  '["Content curation system", "Newsletter template library", "Subject line optimizer", "Email deliverability checklist", "Analytics integration guide"]'::jsonb,
  '["Newsletter creators seeking efficiency", "Marketers managing email campaigns", "Thought leaders building audiences"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 29: Video Script Creator
(
  '29-video-script-creator',
  'Video Script Creator',
  'Write engaging video scripts that keep viewers watching',
  'Create compelling video scripts with structured hooks, pacing, and calls-to-action for any platform or format.',
  'The Video Script Creator applies W.E.D.G.E. methodology to video content. Define your video goal and audience, structure with proven hook-body-CTA framework, write engaging scripts with pacing notes, add visual and audio cues, and optimize for platform-specific requirements (YouTube, TikTok, Reels). Includes teleprompter-ready formatting.',
  (SELECT id FROM vault_categories WHERE slug = 'content-production-os'),
  'premium', 19900, FALSE,
  '/workflows/29-video-script-creator', 'zip',
  ARRAY['video', 'scripts', 'content', 'youtube', 'storytelling'],
  'intermediate', 45,
  '["Hook-body-CTA framework", "Platform-specific templates", "Pacing and timing guides", "Visual/audio cue integration", "Teleprompter-ready formatting"]'::jsonb,
  '["YouTubers scripting videos", "Marketers creating video ads", "Educators producing course content"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 6: Visual Asset System (Workflows 30-34)
-- --------------------------------------------------------------------------

-- Workflow 30: Brand Style Guide Prompt Builder
(
  '30-brand-style-guide-prompt-builder',
  'Brand Style Guide Prompt Builder',
  'Create AI image prompts that match your brand perfectly',
  'Build reusable AI image generation prompts that consistently match your brand style, colors, and visual identity.',
  'The Brand Style Guide Prompt Builder uses the W.E.D.G.E. framework for visual brand consistency. Document your brand visual identity, translate it into AI prompt parameters, build reusable prompt templates, test for consistency across AI tools, and create a prompt library. Ensures every AI-generated image matches your brand.',
  (SELECT id FROM vault_categories WHERE slug = 'visual-asset-system'),
  'premium', 24900, FALSE,
  '/workflows/30-brand-style-guide-prompt-builder', 'zip',
  ARRAY['branding', 'ai-images', 'style-guide', 'prompts', 'visual-identity'],
  'advanced', 90,
  '["Visual identity documentation", "AI prompt parameter mapping", "Reusable prompt template library", "Cross-tool consistency testing", "Brand compliance checker"]'::jsonb,
  '["Brand managers maintaining visual consistency", "Designers using AI tools", "Marketing teams scaling visual content"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 31: Image Description Optimizer
(
  '31-image-description-optimizer',
  'Image Description Optimizer',
  'Write AI image prompts that produce exactly what you envision',
  'Optimize image descriptions and AI prompts for better, more predictable results across image generation platforms.',
  'The Image Description Optimizer applies W.E.D.G.E. principles to AI image generation. Learn prompt anatomy, build structured descriptions with style/mood/composition parameters, iterate based on results, build a personal prompt vocabulary, and create prompt recipes for recurring needs. Dramatically improves AI image output quality.',
  (SELECT id FROM vault_categories WHERE slug = 'visual-asset-system'),
  'premium', 24900, FALSE,
  '/workflows/31-image-description-optimizer', 'zip',
  ARRAY['image-generation', 'prompts', 'ai-art', 'optimization', 'descriptions'],
  'advanced', 45,
  '["Prompt anatomy breakdown", "Style/mood/composition parameters", "Iterative improvement framework", "Personal prompt vocabulary builder", "Prompt recipe library"]'::jsonb,
  '["Designers using AI image tools", "Content creators needing custom visuals", "Marketers generating campaign imagery"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 32: Infographic Outline Generator
(
  '32-infographic-outline-generator',
  'Infographic Outline Generator',
  'Plan stunning infographics with structured data visualization',
  'Generate structured infographic outlines with data hierarchy, visual flow, and design specifications for any topic.',
  'The Infographic Outline Generator uses the W.E.D.G.E. framework for visual data communication. Define your data story, organize information hierarchy, plan visual flow and layout, specify design elements, and create production-ready briefs for designers or AI tools. Includes data visualization best practices and accessibility considerations.',
  (SELECT id FROM vault_categories WHERE slug = 'visual-asset-system'),
  'premium', 24900, FALSE,
  '/workflows/32-infographic-outline-generator', 'zip',
  ARRAY['infographic', 'data-visualization', 'design', 'visual', 'layout'],
  'advanced', 60,
  '["Data story framework", "Information hierarchy planner", "Visual flow designer", "Design specification templates", "Accessibility compliance checker"]'::jsonb,
  '["Marketers creating data-driven content", "Designers planning infographic projects", "Educators visualizing complex topics"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 33: Licensing Check & Asset Tracker
(
  '33-licensing-check-asset-tracker',
  'Licensing Check & Asset Tracker',
  'Track and verify licenses for all your visual assets',
  'Track visual asset licenses, verify usage rights, and maintain compliance across all your AI-generated and sourced imagery.',
  'The Licensing Check & Asset Tracker applies W.E.D.G.E. rigor to visual asset management. Inventory all visual assets, document licensing terms, track usage rights and restrictions, set up expiration alerts, and maintain audit-ready records. Prevents costly licensing violations and ensures legal compliance for all visual content.',
  (SELECT id FROM vault_categories WHERE slug = 'visual-asset-system'),
  'premium', 24900, FALSE,
  '/workflows/33-licensing-check-asset-tracker', 'zip',
  ARRAY['licensing', 'assets', 'compliance', 'tracking', 'legal'],
  'advanced', 60,
  '["Visual asset inventory system", "License documentation framework", "Usage rights tracker", "Expiration alert setup", "Audit-ready record keeping"]'::jsonb,
  '["Marketing teams managing image libraries", "Agencies tracking client assets", "Publishers ensuring image compliance"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 34: Consistency Audit for Visuals
(
  '34-consistency-audit-for-visuals',
  'Consistency Audit for Visuals',
  'Ensure visual brand consistency across all channels',
  'Audit visual assets across all channels for brand consistency, quality standards, and style guide compliance.',
  'The Consistency Audit for Visuals uses the W.E.D.G.E. framework for visual quality assurance. Define brand visual standards, audit existing assets across all channels, identify inconsistencies, create remediation plans, and establish ongoing monitoring. Ensures every visual touchpoint reinforces your brand identity.',
  (SELECT id FROM vault_categories WHERE slug = 'visual-asset-system'),
  'premium', 24900, FALSE,
  '/workflows/34-consistency-audit-for-visuals', 'zip',
  ARRAY['brand-audit', 'visual-consistency', 'quality', 'branding', 'standards'],
  'advanced', 90,
  '["Visual standards definition", "Multi-channel audit framework", "Inconsistency detection system", "Remediation planning tools", "Ongoing monitoring dashboard"]'::jsonb,
  '["Brand managers auditing visual presence", "Design teams maintaining standards", "Marketing directors ensuring consistency"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 7: Automation Bridge (Workflows 35-39)
-- --------------------------------------------------------------------------

-- Workflow 35: Basic Zapier Recipe Builder
(
  '35-basic-zapier-recipe-builder',
  'Basic Zapier Recipe Builder',
  'Build powerful automations with step-by-step Zapier recipes',
  'Build effective Zapier automations from scratch using structured recipe templates and best practices.',
  'The Basic Zapier Recipe Builder applies the W.E.D.G.E. framework to no-code automation. Identify automation opportunities, select appropriate triggers and actions, build multi-step Zaps with filters and formatters, test thoroughly, and document for team reuse. Includes common recipe templates for popular use cases.',
  (SELECT id FROM vault_categories WHERE slug = 'automation-bridge'),
  'premium', 24900, FALSE,
  '/workflows/35-basic-zapier-recipe-builder', 'zip',
  ARRAY['zapier', 'automation', 'no-code', 'recipes', 'workflows'],
  'advanced', 60,
  '["Automation opportunity identifier", "Recipe template library", "Multi-step Zap builder", "Testing framework", "Team documentation system"]'::jsonb,
  '["Non-technical users building automations", "Teams automating repetitive tasks", "Solopreneurs streamlining operations"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 36: Error-Handling Automation Tester
(
  '36-error-handling-automation-tester',
  'Error-Handling Automation Tester',
  'Build bulletproof automations that handle failures gracefully',
  'Test and improve automation error handling with structured failure scenarios, fallback paths, and alert configurations.',
  'The Error-Handling Automation Tester uses W.E.D.G.E. methodology for automation resilience. Identify potential failure points, design error handling paths, create test scenarios, implement fallback mechanisms, and set up monitoring alerts. Transforms fragile automations into robust, self-healing systems.',
  (SELECT id FROM vault_categories WHERE slug = 'automation-bridge'),
  'premium', 24900, FALSE,
  '/workflows/36-error-handling-automation-tester', 'zip',
  ARRAY['error-handling', 'testing', 'automation', 'resilience', 'monitoring'],
  'advanced', 60,
  '["Failure point identification", "Error handling path designer", "Test scenario generator", "Fallback mechanism builder", "Alert configuration system"]'::jsonb,
  '["Automation engineers hardening workflows", "Teams reducing automation failures", "Developers building reliable integrations"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 37: Data Flow Mapping System
(
  '37-data-flow-mapping-system',
  'Data Flow Mapping System',
  'Visualize and optimize how data moves through your systems',
  'Map, visualize, and optimize data flows between tools and systems for better understanding and compliance.',
  'The Data Flow Mapping System applies W.E.D.G.E. principles to data architecture. Inventory all data sources and destinations, map transformation points, visualize flows with diagrams, identify bottlenecks and risks, and optimize for efficiency and compliance. Essential for GDPR data processing documentation.',
  (SELECT id FROM vault_categories WHERE slug = 'automation-bridge'),
  'premium', 24900, FALSE,
  '/workflows/37-data-flow-mapping-system', 'zip',
  ARRAY['data-flow', 'mapping', 'architecture', 'compliance', 'visualization'],
  'advanced', 90,
  '["Data source inventory system", "Flow visualization templates", "Transformation point mapper", "Bottleneck identifier", "Compliance documentation generator"]'::jsonb,
  '["Data engineers documenting pipelines", "Compliance officers mapping data flows", "Architects planning system integrations"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 38: Audit Log Setup Workflow
(
  '38-audit-log-setup-workflow',
  'Audit Log Setup Workflow',
  'Set up comprehensive audit logging for accountability and compliance',
  'Configure comprehensive audit logging across tools and automations for accountability, debugging, and compliance.',
  'The Audit Log Setup Workflow uses the W.E.D.G.E. framework for operational transparency. Define what to log, configure logging across tools, set retention policies, create log analysis procedures, and prepare for compliance audits. Builds the foundation for troubleshooting, security monitoring, and regulatory compliance.',
  (SELECT id FROM vault_categories WHERE slug = 'automation-bridge'),
  'premium', 24900, FALSE,
  '/workflows/38-audit-log-setup-workflow', 'zip',
  ARRAY['audit-logs', 'logging', 'compliance', 'monitoring', 'accountability'],
  'advanced', 90,
  '["Logging requirements framework", "Multi-tool configuration guide", "Retention policy builder", "Log analysis procedures", "Compliance audit preparation"]'::jsonb,
  '["Teams implementing audit trails", "Compliance-driven organizations", "Developers setting up system logging"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 39: Multi-Tool Chain Creator
(
  '39-multi-tool-chain-creator',
  'Multi-Tool Chain Creator',
  'Chain multiple AI tools into powerful automated pipelines',
  'Create sophisticated multi-tool automation chains that connect AI services, data sources, and output destinations.',
  'The Multi-Tool Chain Creator applies W.E.D.G.E. methodology to complex automation. Design tool chains with clear data flows, implement handoff protocols between tools, build error handling at each stage, test end-to-end, and document for maintenance. Creates powerful AI pipelines that multiply the capability of individual tools.',
  (SELECT id FROM vault_categories WHERE slug = 'automation-bridge'),
  'premium', 24900, FALSE,
  '/workflows/39-multi-tool-chain-creator', 'zip',
  ARRAY['automation', 'tool-chain', 'pipeline', 'integration', 'ai-tools'],
  'advanced', 120,
  '["Chain design framework", "Handoff protocol builder", "Stage-level error handling", "End-to-end testing guide", "Maintenance documentation system"]'::jsonb,
  '["Power users building AI pipelines", "Teams creating complex automations", "Developers connecting multiple AI services"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 8: Opportunity Leverage (Workflows 40-44)
-- --------------------------------------------------------------------------

-- Workflow 40: Service Packaging Template
(
  '40-service-packaging-template',
  'Service Packaging Template',
  'Package your services into irresistible, scalable offerings',
  'Package your services into structured, scalable offerings with clear deliverables, pricing tiers, and value propositions.',
  'The Service Packaging Template uses the W.E.D.G.E. framework for service design. Audit your current offerings, identify packageable components, create tiered service packages, define deliverables and timelines, and build compelling sales pages. Transforms ad-hoc services into scalable, systematized offerings.',
  (SELECT id FROM vault_categories WHERE slug = 'opportunity-leverage'),
  'premium', 24900, FALSE,
  '/workflows/40-service-packaging-template', 'zip',
  ARRAY['services', 'packaging', 'pricing', 'offerings', 'business'],
  'advanced', 90,
  '["Service audit framework", "Package tier designer", "Deliverable definition system", "Pricing strategy guide", "Sales page template"]'::jsonb,
  '["Consultants packaging expertise", "Agencies creating service tiers", "Freelancers scaling offerings"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  TRUE, TRUE, NOW()
),

-- Workflow 41: Capability Showcase Builder
(
  '41-capability-showcase-builder',
  'Capability Showcase Builder',
  'Showcase your capabilities in ways that win business',
  'Build compelling capability showcases, portfolios, and case studies that demonstrate your expertise and win business.',
  'The Capability Showcase Builder applies W.E.D.G.E. principles to professional positioning. Document your capabilities and achievements, create case studies from past work, build portfolio presentations, optimize for different audiences, and maintain a living showcase. Turns your experience into a powerful business development tool.',
  (SELECT id FROM vault_categories WHERE slug = 'opportunity-leverage'),
  'premium', 24900, FALSE,
  '/workflows/41-capability-showcase-builder', 'zip',
  ARRAY['portfolio', 'showcase', 'case-studies', 'business-development', 'capabilities'],
  'advanced', 120,
  '["Capability documentation system", "Case study builder", "Portfolio presentation templates", "Audience-specific optimization", "Living showcase maintenance"]'::jsonb,
  '["Consultants winning new clients", "Agencies showcasing work", "Professionals building credibility"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 42: Client Proposal Generator
(
  '42-client-proposal-generator',
  'Client Proposal Generator',
  'Generate winning proposals in a fraction of the time',
  'Generate professional client proposals with customizable sections, pricing tables, and persuasive positioning.',
  'The Client Proposal Generator uses the W.E.D.G.E. framework for efficient proposal creation. Gather client requirements, select appropriate proposal structure, generate tailored content with AI, customize pricing and deliverables, and produce polished, branded documents. Reduces proposal creation time by 70% while improving win rates.',
  (SELECT id FROM vault_categories WHERE slug = 'opportunity-leverage'),
  'premium', 24900, FALSE,
  '/workflows/42-client-proposal-generator', 'zip',
  ARRAY['proposals', 'clients', 'sales', 'business', 'documents'],
  'advanced', 60,
  '["Requirements gathering framework", "Proposal structure library", "AI-assisted content generation", "Pricing table builder", "Branded document templates"]'::jsonb,
  '["Consultants responding to RFPs", "Agencies pitching clients", "Freelancers submitting proposals"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 43: Ethical Upsell Script Writer
(
  '43-ethical-upsell-script-writer',
  'Ethical Upsell Script Writer',
  'Increase revenue with ethical, value-driven upsell conversations',
  'Create ethical upsell and cross-sell scripts that genuinely serve client needs while increasing revenue.',
  'The Ethical Upsell Script Writer applies W.E.D.G.E. ethics to revenue growth. Identify genuine upsell opportunities, write value-first scripts, incorporate objection handling, maintain trust and transparency, and track conversion rates. Builds revenue through authentic service rather than pressure tactics.',
  (SELECT id FROM vault_categories WHERE slug = 'opportunity-leverage'),
  'premium', 24900, FALSE,
  '/workflows/43-ethical-upsell-script-writer', 'zip',
  ARRAY['upselling', 'scripts', 'sales', 'ethics', 'revenue'],
  'advanced', 45,
  '["Opportunity identification framework", "Value-first script templates", "Objection handling library", "Trust-building techniques", "Conversion tracking system"]'::jsonb,
  '["Sales teams improving revenue ethically", "Account managers expanding relationships", "Service providers offering more value"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 44: Networking Outreach System
(
  '44-networking-outreach-system',
  'Networking Outreach System',
  'Build meaningful professional connections systematically',
  'Build and maintain professional relationships through systematic outreach, follow-up tracking, and relationship nurturing.',
  'The Networking Outreach System uses the W.E.D.G.E. framework for professional relationship building. Identify target connections, craft personalized outreach messages, manage follow-up sequences, track relationship status, and nurture connections over time. Turns networking from awkward cold outreach into systematic relationship building.',
  (SELECT id FROM vault_categories WHERE slug = 'opportunity-leverage'),
  'premium', 24900, FALSE,
  '/workflows/44-networking-outreach-system', 'zip',
  ARRAY['networking', 'outreach', 'relationships', 'professional', 'connections'],
  'advanced', 45,
  '["Target connection identifier", "Personalized message generator", "Follow-up sequence manager", "Relationship status tracker", "Long-term nurture system"]'::jsonb,
  '["Professionals expanding their network", "Entrepreneurs building partnerships", "Job seekers making connections"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- --------------------------------------------------------------------------
-- SYSTEM 9: Sustain & Update Engine (Workflows 45-50)
-- --------------------------------------------------------------------------

-- Workflow 45: Tool Evaluation Rubric Applicator
(
  '45-tool-evaluation-rubric-applicator',
  'Tool Evaluation Rubric Applicator',
  'Evaluate any tool objectively with a structured scoring rubric',
  'Apply structured evaluation rubrics to objectively assess new tools, updates, and alternatives for your workflow.',
  'The Tool Evaluation Rubric Applicator uses the W.E.D.G.E. framework for objective tool assessment. Define evaluation criteria, weight by importance, score tools consistently, compare alternatives side-by-side, and document decisions. Removes bias from tool selection and ensures you always use the best tools for your needs.',
  (SELECT id FROM vault_categories WHERE slug = 'sustain-update-engine'),
  'premium', 24900, FALSE,
  '/workflows/45-tool-evaluation-rubric-applicator', 'zip',
  ARRAY['evaluation', 'tools', 'rubric', 'assessment', 'comparison'],
  'advanced', 60,
  '["Customizable evaluation criteria", "Weighted scoring system", "Side-by-side comparison framework", "Decision documentation templates", "Historical evaluation tracking"]'::jsonb,
  '["Teams evaluating new software", "Managers approving tool purchases", "Individuals comparing alternatives"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 46: Monthly Workflow Refresh Checker
(
  '46-monthly-workflow-refresh-checker',
  'Monthly Workflow Refresh Checker',
  'Keep your workflows current and optimized every month',
  'Conduct monthly reviews of your workflows to identify optimization opportunities, outdated steps, and improvement areas.',
  'The Monthly Workflow Refresh Checker applies W.E.D.G.E. maintenance principles to continuous improvement. Audit each active workflow monthly, identify bottlenecks and outdated steps, incorporate new tools and techniques, measure efficiency improvements, and document changes. Prevents workflow decay and ensures ongoing optimization.',
  (SELECT id FROM vault_categories WHERE slug = 'sustain-update-engine'),
  'premium', 24900, FALSE,
  '/workflows/46-monthly-workflow-refresh-checker', 'zip',
  ARRAY['maintenance', 'optimization', 'review', 'improvement', 'workflows'],
  'advanced', 45,
  '["Monthly audit checklist", "Bottleneck identification system", "Optimization opportunity scanner", "Efficiency measurement tools", "Change documentation templates"]'::jsonb,
  '["Teams maintaining workflow quality", "Process owners ensuring currency", "Individuals optimizing their systems"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 47: Performance Metric Tracker
(
  '47-performance-metric-tracker',
  'Performance Metric Tracker',
  'Track the metrics that matter for continuous improvement',
  'Set up and maintain performance tracking dashboards for your workflows, tools, and business outcomes.',
  'The Performance Metric Tracker uses the W.E.D.G.E. framework for data-driven management. Define KPIs for each workflow and tool, set up tracking mechanisms, build reporting dashboards, establish review cadences, and use data to drive improvement decisions. Connects daily activities to measurable business outcomes.',
  (SELECT id FROM vault_categories WHERE slug = 'sustain-update-engine'),
  'premium', 24900, FALSE,
  '/workflows/47-performance-metric-tracker', 'zip',
  ARRAY['metrics', 'performance', 'tracking', 'kpis', 'dashboards'],
  'advanced', 90,
  '["KPI definition framework", "Tracking mechanism setup", "Dashboard builder templates", "Review cadence guide", "Data-driven decision making"]'::jsonb,
  '["Managers tracking team performance", "Individuals measuring personal productivity", "Teams setting and monitoring OKRs"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 48: Update Patch Applicator
(
  '48-update-patch-applicator',
  'Update Patch Applicator',
  'Safely apply updates without breaking your workflows',
  'Safely evaluate, test, and apply tool updates and workflow patches without disrupting existing operations.',
  'The Update Patch Applicator uses W.E.D.G.E. methodology for safe change management. Evaluate incoming updates, assess impact on existing workflows, test in sandbox environment, apply with rollback plans, and verify post-update functionality. Keeps your systems current while minimizing disruption risk.',
  (SELECT id FROM vault_categories WHERE slug = 'sustain-update-engine'),
  'premium', 24900, FALSE,
  '/workflows/48-update-patch-applicator', 'zip',
  ARRAY['updates', 'patches', 'change-management', 'testing', 'maintenance'],
  'advanced', 60,
  '["Update evaluation framework", "Impact assessment system", "Sandbox testing guide", "Rollback plan templates", "Post-update verification"]'::jsonb,
  '["System administrators managing updates", "Teams with critical workflow dependencies", "Anyone updating interconnected tools"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 49: Long-Term Goal Realignment
(
  '49-long-term-goal-realignment',
  'Long-Term Goal Realignment',
  'Realign your goals quarterly to stay on the right path',
  'Periodically reassess and realign long-term goals with current reality, market conditions, and evolving priorities.',
  'The Long-Term Goal Realignment workflow applies W.E.D.G.E. principles to strategic adaptation. Review original goals against current progress, assess market and priority shifts, identify necessary adjustments, update milestones and timelines, and communicate changes to stakeholders. Ensures your long-term vision stays achievable and relevant.',
  (SELECT id FROM vault_categories WHERE slug = 'sustain-update-engine'),
  'premium', 24900, FALSE,
  '/workflows/49-long-term-goal-realignment', 'zip',
  ARRAY['goals', 'realignment', 'strategy', 'planning', 'review'],
  'advanced', 90,
  '["Goal progress assessment", "Market shift analysis", "Priority adjustment framework", "Milestone recalibration tools", "Stakeholder communication templates"]'::jsonb,
  '["Executives realigning annual goals", "Teams adjusting quarterly objectives", "Individuals reviewing career plans"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
),

-- Workflow 50: Community Feedback Integrator
(
  '50-community-feedback-integrator',
  'Community Feedback Integrator',
  'Turn community feedback into product and service improvements',
  'Systematically collect, analyze, and integrate community feedback into your products, services, and workflows.',
  'The Community Feedback Integrator uses the W.E.D.G.E. framework for community-driven improvement. Set up feedback collection channels, aggregate and analyze responses, identify high-impact themes, create implementation plans, and close the feedback loop with your community. Builds loyalty through visible responsiveness.',
  (SELECT id FROM vault_categories WHERE slug = 'sustain-update-engine'),
  'premium', 24900, FALSE,
  '/workflows/50-community-feedback-integrator', 'zip',
  ARRAY['feedback', 'community', 'integration', 'improvement', 'engagement'],
  'advanced', 60,
  '["Feedback channel setup guide", "Response aggregation system", "Theme identification engine", "Implementation planning tools", "Feedback loop closure templates"]'::jsonb,
  '["Product managers gathering user feedback", "Community managers driving engagement", "Teams building customer-centric products"]'::jsonb,
  'ToolForge AI', '1.0.0', 'published',
  FALSE, TRUE, NOW()
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  category_id = EXCLUDED.category_id,
  pricing_type = EXCLUDED.pricing_type,
  price = EXCLUDED.price,
  is_free = EXCLUDED.is_free,
  file_url = EXCLUDED.file_url,
  file_type = EXCLUDED.file_type,
  tags = EXCLUDED.tags,
  difficulty_level = EXCLUDED.difficulty_level,
  estimated_time = EXCLUDED.estimated_time,
  features = EXCLUDED.features,
  use_cases = EXCLUDED.use_cases,
  author = EXCLUDED.author,
  version = EXCLUDED.version,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  is_new = EXCLUDED.is_new,
  published_at = EXCLUDED.published_at;

-- ============================================================================
-- UPDATE CATEGORY WORKFLOW COUNTS
-- ============================================================================

UPDATE vault_categories SET workflow_count = (
  SELECT COUNT(*) FROM vault_workflows w WHERE w.category_id = vault_categories.id
);

-- ============================================================================
-- COMPLETE
-- ============================================================================
