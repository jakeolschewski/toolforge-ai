-- Quick seed of top 20 AI tools directly via SQL
INSERT INTO tools (name, slug, description, website, category_slug, pricing_model, starting_price, affiliate_url, featured, status) VALUES
('ChatGPT', 'chatgpt', 'OpenAI''s conversational AI assistant', 'https://chat.openai.com', 'chat', 'Freemium', 20.00, 'https://chat.openai.com', true, 'published'),
('Midjourney', 'midjourney', 'AI art generator creating stunning images from text', 'https://www.midjourney.com', 'image', 'Paid', 10.00, 'https://www.midjourney.com', true, 'published'),
('GitHub Copilot', 'github-copilot', 'AI pair programmer that helps you write code faster', 'https://github.com/features/copilot', 'code', 'Paid', 10.00, 'https://github.com/features/copilot', true, 'published'),
('Jasper AI', 'jasper-ai', 'AI content platform for marketing teams', 'https://www.jasper.ai', 'writing', 'Paid', 49.00, 'https://www.jasper.ai', true, 'published'),
('Copy.ai', 'copyai', 'AI-powered copywriter for marketing content', 'https://www.copy.ai', 'writing', 'Freemium', 49.00, 'https://www.copy.ai', true, 'published'),
('DALL-E 3', 'dall-e-3', 'OpenAI''s advanced image generation model', 'https://openai.com/dall-e-3', 'image', 'Paid', 15.00, 'https://openai.com/dall-e-3', true, 'published'),
('Claude', 'claude', 'Anthropic''s helpful, harmless, and honest AI assistant', 'https://claude.ai', 'chat', 'Freemium', 20.00, 'https://claude.ai', true, 'published'),
('Runway', 'runway', 'AI-powered creative suite for video generation', 'https://runwayml.com', 'video', 'Freemium', 12.00, 'https://runwayml.com', true, 'published'),
('Synthesia', 'synthesia', 'Create AI videos from text in minutes', 'https://www.synthesia.io', 'video', 'Paid', 30.00, 'https://www.synthesia.io', true, 'published'),
('ElevenLabs', 'elevenlabs', 'AI voice generator with natural-sounding speech', 'https://elevenlabs.io', 'audio', 'Freemium', 5.00, 'https://elevenlabs.io', true, 'published'),
('Grammarly', 'grammarly', 'AI-powered writing assistant', 'https://www.grammarly.com', 'writing', 'Freemium', 12.00, 'https://www.grammarly.com', false, 'published'),
('Notion AI', 'notion-ai', 'AI features built into Notion workspace', 'https://www.notion.so/product/ai', 'productivity', 'Freemium', 10.00, 'https://www.notion.so/product/ai', false, 'published'),
('Canva AI', 'canva-ai', 'AI-powered design tools in Canva', 'https://www.canva.com/ai-image-generator', 'design', 'Freemium', 12.99, 'https://www.canva.com/ai-image-generator', false, 'published'),
('Perplexity AI', 'perplexity-ai', 'AI-powered answer engine', 'https://www.perplexity.ai', 'research', 'Freemium', 20.00, 'https://www.perplexity.ai', false, 'published'),
('Otter.ai', 'otter-ai', 'AI meeting note-taker and transcription', 'https://otter.ai', 'productivity', 'Freemium', 16.99, 'https://otter.ai', false, 'published'),
('Stable Diffusion', 'stable-diffusion', 'Open-source AI image generation', 'https://stability.ai', 'image', 'Free', 0.00, 'https://stability.ai', false, 'published'),
('Cursor', 'cursor', 'AI-first code editor', 'https://cursor.sh', 'code', 'Freemium', 20.00, 'https://cursor.sh', false, 'published'),
('HeyGen', 'heygen', 'Create AI avatar videos in minutes', 'https://www.heygen.com', 'video', 'Freemium', 30.00, 'https://www.heygen.com', false, 'published'),
('Murf AI', 'murf-ai', 'AI voice generator for professional voiceovers', 'https://murf.ai', 'audio', 'Freemium', 29.00, 'https://murf.ai', false, 'published'),
('Motion', 'motion', 'AI-powered calendar and project management', 'https://www.usemotion.com', 'productivity', 'Paid', 19.00, 'https://www.usemotion.com', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Update category counts
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'chat' AND status = 'published') WHERE slug = 'chat';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'writing' AND status = 'published') WHERE slug = 'writing';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'image' AND status = 'published') WHERE slug = 'image';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'video' AND status = 'published') WHERE slug = 'video';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'code' AND status = 'published') WHERE slug = 'code';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'audio' AND status = 'published') WHERE slug = 'audio';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'productivity' AND status = 'published') WHERE slug = 'productivity';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'design' AND status = 'published') WHERE slug = 'design';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'research' AND status = 'published') WHERE slug = 'research';
UPDATE categories SET tool_count = (SELECT COUNT(*) FROM tools WHERE category_slug = 'marketing' AND status = 'published') WHERE slug = 'marketing';
