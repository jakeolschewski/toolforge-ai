-- Complete seed of 91 AI tools across all categories
-- WRITING TOOLS (15 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('ChatGPT', 'chatgpt', 'OpenAI''s conversational AI assistant with GPT-4', 'https://chat.openai.com', 'chat', 'Freemium', 20.00, 'https://chat.openai.com', true, 'published'),
('Jasper AI', 'jasper-ai', 'AI content platform for marketing teams and copywriters', 'https://www.jasper.ai', 'writing', 'Paid', 49.00, 'https://www.jasper.ai', true, 'published'),
('Copy.ai', 'copyai', 'AI-powered copywriter for marketing content and social media', 'https://www.copy.ai', 'writing', 'Freemium', 49.00, 'https://www.copy.ai', true, 'published'),
('Writesonic', 'writesonic', 'AI writing assistant for articles, ads, and product descriptions', 'https://writesonic.com', 'writing', 'Freemium', 19.00, 'https://writesonic.com', false, 'published'),
('Rytr', 'rytr', 'Affordable AI writing assistant for content creators', 'https://rytr.me', 'writing', 'Freemium', 9.00, 'https://rytr.me', false, 'published'),
('QuillBot', 'quillbot', 'AI-powered paraphrasing and grammar checking tool', 'https://quillbot.com', 'writing', 'Freemium', 8.33, 'https://quillbot.com', false, 'published'),
('Grammarly', 'grammarly', 'AI-powered writing assistant with grammar and style suggestions', 'https://www.grammarly.com', 'writing', 'Freemium', 12.00, 'https://www.grammarly.com', false, 'published'),
('Wordtune', 'wordtune', 'AI writing companion that helps rewrite and rephrase', 'https://www.wordtune.com', 'writing', 'Freemium', 9.99, 'https://www.wordtune.com', false, 'published'),
('Notion AI', 'notion-ai', 'AI features built into Notion workspace for writing and brainstorming', 'https://www.notion.so/product/ai', 'writing', 'Freemium', 10.00, 'https://www.notion.so/product/ai', false, 'published'),
('Sudowrite', 'sudowrite', 'AI writing partner for fiction and creative writing', 'https://www.sudowrite.com', 'writing', 'Paid', 19.00, 'https://www.sudowrite.com', false, 'published'),
('Claude', 'claude', 'Anthropic''s helpful, harmless, and honest AI assistant', 'https://claude.ai', 'chat', 'Freemium', 20.00, 'https://claude.ai', true, 'published'),
('Anyword', 'anyword', 'AI copywriting platform with predictive performance scoring', 'https://anyword.com', 'writing', 'Paid', 49.00, 'https://anyword.com', false, 'published'),
('Simplified', 'simplified', 'All-in-one AI platform for writing, design, and video', 'https://simplified.com', 'writing', 'Freemium', 12.00, 'https://simplified.com', false, 'published'),
('Hypotenuse AI', 'hypotenuse-ai', 'AI content generator for ecommerce and marketing', 'https://www.hypotenuse.ai', 'writing', 'Paid', 29.00, 'https://www.hypotenuse.ai', false, 'published'),
('Frase', 'frase', 'AI content optimization and SEO writing assistant', 'https://www.frase.io', 'writing', 'Paid', 45.00, 'https://www.frase.io', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- IMAGE GENERATION TOOLS (15 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('Midjourney', 'midjourney', 'Leading AI art generator creating stunning images from text prompts', 'https://www.midjourney.com', 'image', 'Paid', 10.00, 'https://www.midjourney.com', true, 'published'),
('DALL-E 3', 'dall-e-3', 'OpenAI''s advanced image generation model with incredible detail', 'https://openai.com/dall-e-3', 'image', 'Paid', 15.00, 'https://openai.com/dall-e-3', true, 'published'),
('Stable Diffusion', 'stable-diffusion', 'Open-source AI image generation with full control', 'https://stability.ai', 'image', 'Free', 0.00, 'https://stability.ai', false, 'published'),
('Leonardo.Ai', 'leonardo-ai', 'AI art generator with consistent character creation', 'https://leonardo.ai', 'image', 'Freemium', 12.00, 'https://leonardo.ai', false, 'published'),
('Ideogram', 'ideogram', 'AI image generator with excellent text rendering', 'https://ideogram.ai', 'image', 'Freemium', 8.00, 'https://ideogram.ai', false, 'published'),
('Adobe Firefly', 'adobe-firefly', 'Adobe''s AI image generator built into Creative Cloud', 'https://www.adobe.com/products/firefly.html', 'image', 'Freemium', 4.99, 'https://www.adobe.com/products/firefly.html', false, 'published'),
('Canva AI', 'canva-ai', 'AI-powered design tools integrated into Canva', 'https://www.canva.com/ai-image-generator', 'design', 'Freemium', 12.99, 'https://www.canva.com/ai-image-generator', false, 'published'),
('Clipdrop', 'clipdrop', 'AI-powered image editing and generation tools', 'https://clipdrop.co', 'image', 'Freemium', 9.00, 'https://clipdrop.co', false, 'published'),
('Playground AI', 'playground-ai', 'Free AI image generator with advanced controls', 'https://playgroundai.com', 'image', 'Freemium', 15.00, 'https://playgroundai.com', false, 'published'),
('Photosonic', 'photosonic', 'AI art generator from Writesonic for marketing visuals', 'https://photosonic.writesonic.com', 'image', 'Freemium', 16.00, 'https://photosonic.writesonic.com', false, 'published'),
('BlueWillow', 'bluewillow', 'Free AI art generator similar to Midjourney', 'https://www.bluewillow.ai', 'image', 'Free', 0.00, 'https://www.bluewillow.ai', false, 'published'),
('Getimg.ai', 'getimg-ai', 'AI image generator with advanced editing features', 'https://getimg.ai', 'image', 'Freemium', 12.00, 'https://getimg.ai', false, 'published'),
('Craiyon', 'craiyon', 'Free AI image generator formerly known as DALL-E mini', 'https://www.craiyon.com', 'image', 'Freemium', 6.00, 'https://www.craiyon.com', false, 'published'),
('NightCafe', 'nightcafe', 'AI art generator with multiple algorithms and styles', 'https://creator.nightcafe.studio', 'image', 'Freemium', 9.99, 'https://creator.nightcafe.studio', false, 'published'),
('Artbreeder', 'artbreeder', 'Collaborative AI art platform for character creation', 'https://www.artbreeder.com', 'image', 'Freemium', 8.99, 'https://www.artbreeder.com', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- VIDEO TOOLS (10 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('Runway', 'runway', 'AI-powered creative suite for video generation and editing', 'https://runwayml.com', 'video', 'Freemium', 12.00, 'https://runwayml.com', true, 'published'),
('Pika', 'pika', 'Text-to-video AI generator with stunning results', 'https://pika.art', 'video', 'Freemium', 10.00, 'https://pika.art', false, 'published'),
('Synthesia', 'synthesia', 'Create AI videos with avatars from text in minutes', 'https://www.synthesia.io', 'video', 'Paid', 30.00, 'https://www.synthesia.io', true, 'published'),
('HeyGen', 'heygen', 'Create AI avatar videos with voice cloning', 'https://www.heygen.com', 'video', 'Freemium', 30.00, 'https://www.heygen.com', false, 'published'),
('Descript', 'descript', 'AI video editor with text-based editing and voice cloning', 'https://www.descript.com', 'video', 'Freemium', 12.00, 'https://www.descript.com', false, 'published'),
('Opus Clip', 'opus-clip', 'AI-powered video clipper for social media content', 'https://www.opus.pro', 'video', 'Freemium', 19.00, 'https://www.opus.pro', false, 'published'),
('Pictory', 'pictory', 'Turn articles and scripts into videos automatically', 'https://pictory.ai', 'video', 'Paid', 23.00, 'https://pictory.ai', false, 'published'),
('InVideo AI', 'invideo-ai', 'AI video generator from text prompts and scripts', 'https://invideo.io', 'video', 'Freemium', 25.00, 'https://invideo.io', false, 'published'),
('Fliki', 'fliki', 'Text-to-video AI with realistic AI voices', 'https://fliki.ai', 'video', 'Freemium', 28.00, 'https://fliki.ai', false, 'published'),
('Lumen5', 'lumen5', 'AI video creator for social media marketing', 'https://lumen5.com', 'video', 'Freemium', 29.00, 'https://lumen5.com', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- CODING TOOLS (10 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('GitHub Copilot', 'github-copilot', 'AI pair programmer that helps you write code faster', 'https://github.com/features/copilot', 'code', 'Paid', 10.00, 'https://github.com/features/copilot', true, 'published'),
('Cursor', 'cursor', 'AI-first code editor built for maximum productivity', 'https://cursor.sh', 'code', 'Freemium', 20.00, 'https://cursor.sh', false, 'published'),
('Codeium', 'codeium', 'Free AI code completion alternative to Copilot', 'https://codeium.com', 'code', 'Freemium', 0.00, 'https://codeium.com', false, 'published'),
('Tabnine', 'tabnine', 'AI code assistant with private deployment options', 'https://www.tabnine.com', 'code', 'Freemium', 12.00, 'https://www.tabnine.com', false, 'published'),
('Amazon CodeWhisperer', 'amazon-codewhisperer', 'AWS AI coding companion with security scanning', 'https://aws.amazon.com/codewhisperer', 'code', 'Freemium', 19.00, 'https://aws.amazon.com/codewhisperer', false, 'published'),
('Replit Ghostwriter', 'replit-ghostwriter', 'AI assistant built into Replit IDE', 'https://replit.com/ai', 'code', 'Paid', 10.00, 'https://replit.com/ai', false, 'published'),
('Sourcegraph Cody', 'sourcegraph-cody', 'AI coding assistant that knows your entire codebase', 'https://sourcegraph.com/cody', 'code', 'Freemium', 9.00, 'https://sourcegraph.com/cody', false, 'published'),
('Phind', 'phind', 'AI search engine for developers with code examples', 'https://www.phind.com', 'code', 'Free', 0.00, 'https://www.phind.com', false, 'published'),
('Blackbox AI', 'blackbox-ai', 'AI code search and autocomplete', 'https://www.blackbox.ai', 'code', 'Freemium', 4.99, 'https://www.blackbox.ai', false, 'published'),
('Aider', 'aider', 'AI pair programming in your terminal', 'https://aider.chat', 'code', 'Free', 0.00, 'https://aider.chat', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- CHATBOTS (7 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('Google Gemini', 'google-gemini', 'Google''s most capable AI model for multimodal tasks', 'https://gemini.google.com', 'chat', 'Freemium', 19.99, 'https://gemini.google.com', false, 'published'),
('Perplexity AI', 'perplexity-ai', 'AI-powered answer engine with source citations', 'https://www.perplexity.ai', 'research', 'Freemium', 20.00, 'https://www.perplexity.ai', false, 'published'),
('Poe', 'poe', 'Access multiple AI chatbots in one place', 'https://poe.com', 'chat', 'Freemium', 19.99, 'https://poe.com', false, 'published'),
('Character.AI', 'character-ai', 'Create and chat with AI characters', 'https://character.ai', 'chat', 'Freemium', 9.99, 'https://character.ai', false, 'published'),
('Pi', 'pi', 'Personal AI for conversations and life advice', 'https://pi.ai', 'chat', 'Free', 0.00, 'https://pi.ai', false, 'published'),
('You.com Chat', 'you-chat', 'AI search with citations and multimodal capabilities', 'https://you.com', 'chat', 'Freemium', 15.00, 'https://you.com', false, 'published'),
('HuggingChat', 'huggingchat', 'Open-source AI chatbot from Hugging Face', 'https://huggingface.co/chat', 'chat', 'Free', 0.00, 'https://huggingface.co/chat', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- PRODUCTIVITY TOOLS (10 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('Motion', 'motion', 'AI-powered calendar and project management', 'https://www.usemotion.com', 'productivity', 'Paid', 19.00, 'https://www.usemotion.com', false, 'published'),
('Otter.ai', 'otter-ai', 'AI meeting note-taker and transcription service', 'https://otter.ai', 'productivity', 'Freemium', 16.99, 'https://otter.ai', false, 'published'),
('Fireflies.ai', 'fireflies-ai', 'AI meeting assistant that records and transcribes', 'https://fireflies.ai', 'productivity', 'Freemium', 10.00, 'https://fireflies.ai', false, 'published'),
('Reclaim.ai', 'reclaim-ai', 'AI calendar scheduling for optimal time management', 'https://reclaim.ai', 'productivity', 'Freemium', 10.00, 'https://reclaim.ai', false, 'published'),
('Superhuman', 'superhuman', 'AI-powered email with blazing fast interface', 'https://superhuman.com', 'productivity', 'Paid', 30.00, 'https://superhuman.com', false, 'published'),
('Mem', 'mem', 'AI-powered workspace that remembers everything', 'https://mem.ai', 'productivity', 'Freemium', 14.99, 'https://mem.ai', false, 'published'),
('Clockwise', 'clockwise', 'AI calendar optimization for focused work time', 'https://www.getclockwise.com', 'productivity', 'Freemium', 11.50, 'https://www.getclockwise.com', false, 'published'),
('Reflect', 'reflect', 'AI-powered note-taking with networked thoughts', 'https://reflect.app', 'productivity', 'Paid', 10.00, 'https://reflect.app', false, 'published'),
('tl;dv', 'tldv', 'AI meeting recorder for Google Meet and Zoom', 'https://tldv.io', 'productivity', 'Freemium', 20.00, 'https://tldv.io', false, 'published'),
('Tactiq', 'tactiq', 'AI meeting transcription and summaries', 'https://tactiq.io', 'productivity', 'Freemium', 10.00, 'https://tactiq.io', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- MARKETING TOOLS (8 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('AdCreative.ai', 'adcreative-ai', 'AI-generated ad creatives for marketing campaigns', 'https://www.adcreative.ai', 'marketing', 'Paid', 29.00, 'https://www.adcreative.ai', false, 'published'),
('Brand24', 'brand24', 'AI-powered social media monitoring and analytics', 'https://brand24.com', 'marketing', 'Paid', 79.00, 'https://brand24.com', false, 'published'),
('Seventh Sense', 'seventh-sense', 'AI email delivery time optimization', 'https://www.theseventhsense.com', 'marketing', 'Paid', 80.00, 'https://www.theseventhsense.com', false, 'published'),
('Persado', 'persado', 'AI-generated marketing language for campaigns', 'https://www.persado.com', 'marketing', 'Enterprise', 0.00, 'https://www.persado.com', false, 'published'),
('Phrasee', 'phrasee', 'AI copywriting for email subject lines and CTAs', 'https://www.phrasee.co', 'marketing', 'Enterprise', 0.00, 'https://www.phrasee.co', false, 'published'),
('FullStory', 'fullstory', 'AI-powered digital experience analytics', 'https://www.fullstory.com', 'marketing', 'Paid', 0.00, 'https://www.fullstory.com', false, 'published'),
('Pattern89', 'pattern89', 'AI-powered social media ad optimization', 'https://www.pattern89.com', 'marketing', 'Paid', 0.00, 'https://www.pattern89.com', false, 'published'),
('MarketBrew', 'marketbrew', 'AI SEO software that models search engines', 'https://www.marketbrew.ai', 'marketing', 'Enterprise', 0.00, 'https://www.marketbrew.ai', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- DESIGN TOOLS (8 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('Uizard', 'uizard', 'AI-powered UI design tool from screenshots and wireframes', 'https://uizard.io', 'design', 'Freemium', 12.00, 'https://uizard.io', false, 'published'),
('Galileo AI', 'galileo-ai', 'AI interface design from text descriptions', 'https://www.usegalileo.ai', 'design', 'Free', 0.00, 'https://www.usegalileo.ai', false, 'published'),
('Designify', 'designify', 'AI-powered automatic background removal and enhancement', 'https://www.designify.com', 'design', 'Freemium', 7.99, 'https://www.designify.com', false, 'published'),
('Remove.bg', 'remove-bg', 'AI background removal tool', 'https://www.remove.bg', 'design', 'Freemium', 9.00, 'https://www.remove.bg', false, 'published'),
('Khroma', 'khroma', 'AI color palette generator for designers', 'https://www.khroma.co', 'design', 'Free', 0.00, 'https://www.khroma.co', false, 'published'),
('Fontjoy', 'fontjoy', 'AI font pairing generator', 'https://fontjoy.com', 'design', 'Free', 0.00, 'https://fontjoy.com', false, 'published'),
('Looka', 'looka', 'AI-powered logo and brand identity designer', 'https://looka.com', 'design', 'Paid', 20.00, 'https://looka.com', false, 'published'),
('AutoDraw', 'autodraw', 'AI drawing tool that guesses what you''re sketching', 'https://www.autodraw.com', 'design', 'Free', 0.00, 'https://www.autodraw.com', false, 'published')
ON CONFLICT (slug) DO NOTHING;

-- AUDIO & MUSIC TOOLS (8 tools)
INSERT INTO tools (name, slug, description, website_url, category, pricing_model, starting_price, affiliate_link, is_featured, status) VALUES
('ElevenLabs', 'elevenlabs', 'AI voice generator with natural-sounding speech synthesis', 'https://elevenlabs.io', 'audio', 'Freemium', 5.00, 'https://elevenlabs.io', true, 'published'),
('Murf AI', 'murf-ai', 'AI voice generator for professional voiceovers', 'https://murf.ai', 'audio', 'Freemium', 29.00, 'https://murf.ai', false, 'published'),
('Speechify', 'speechify', 'AI text-to-speech reader for articles and documents', 'https://speechify.com', 'audio', 'Freemium', 11.58, 'https://speechify.com', false, 'published'),
('Play.ht', 'play-ht', 'AI voice generator with ultra-realistic voices', 'https://play.ht', 'audio', 'Freemium', 31.20, 'https://play.ht', false, 'published'),
('Resemble AI', 'resemble-ai', 'AI voice cloning and text-to-speech platform', 'https://www.resemble.ai', 'audio', 'Paid', 0.03, 'https://www.resemble.ai', false, 'published'),
('Suno', 'suno', 'AI music generator that creates songs from text', 'https://suno.ai', 'audio', 'Freemium', 10.00, 'https://suno.ai', false, 'published'),
('AIVA', 'aiva', 'AI music composition for soundtracks and scores', 'https://www.aiva.ai', 'audio', 'Freemium', 15.00, 'https://www.aiva.ai', false, 'published'),
('Mubert', 'mubert', 'AI music generation for content creators', 'https://mubert.com', 'audio', 'Freemium', 14.00, 'https://mubert.com', false, 'published')
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
