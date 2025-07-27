const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Create a document
const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  info: {
    Title: 'AI Tools Mastery Guide 2025',
    Author: 'AI Tools Mastery',
  }
});

// Pipe its output somewhere, like to a file
const outputPath = path.join(__dirname, 'ai-tools-mastery-guide-2025.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Define content for 30 lessons
const lessons = [
  {
    title: 'The AI Revolution in 2025',
    content: [
      'The artificial intelligence landscape has evolved dramatically, creating unprecedented opportunities for entrepreneurs, freelancers, and business owners.',
      'Key Statistics:',
      '• AI market size: $1.8 trillion by 2025',
      '• 85% of businesses now use AI tools',
      '• Average AI user income increase: 40-60%',
      '• New AI jobs created: 12 million globally',
      'Quick Action Step: Sign up for a free ChatGPT account to begin exploring AI capabilities.'
    ]
  },
  {
    title: 'Understanding AI Tool Categories',
    content: [
      'AI tools can be categorized into several key types, each serving different purposes in your money-making journey.',
      'Text Generation: ChatGPT, Claude, Gemini',
      'Image Creation: Midjourney, DALL-E, Stable Diffusion',
      'Video Production: Runway, Synthesia, Descript',
      'Audio Tools: ElevenLabs, Descript, Murf.ai',
      'Coding Assistants: GitHub Copilot, Replit, CodeWhisperer',
      'Quick Action Step: Identify which category aligns with your skills and interests.'
    ]
  },
  {
    title: 'ChatGPT: Your AI Business Partner',
    content: [
      'ChatGPT is the most versatile AI tool for entrepreneurs, capable of transforming your business operations.',
      'Key Business Applications:',
      '• Content creation (blogs, social media, emails)',
      '• Customer service automation',
      '• Market research and analysis',
      '• Product ideation and validation',
      '• Business plan development',
      'Quick Action Step: Create 5 specific prompts for your business needs.'
    ]
  },
  {
    title: 'Claude: Advanced Reasoning AI',
    content: [
      'Claude excels at nuanced reasoning, document analysis, and maintaining context over long conversations.',
      'Business Advantages:',
      '• Superior document understanding',
      '• Longer context window (up to 200,000 tokens)',
      '• More nuanced responses',
      '• Better at following complex instructions',
      '• Excellent for research and analysis',
      'Quick Action Step: Upload a business document to Claude for analysis.'
    ]
  },
  {
    title: 'Google Gemini: Multimodal Intelligence',
    content: [
      'Google Gemini combines text, image, and code understanding in a powerful multimodal AI system.',
      'Key Capabilities:',
      '• Analyze images and extract insights',
      '• Process charts and graphs',
      '• Generate code from visual references',
      '• Integrate with Google ecosystem',
      '• Perform complex reasoning tasks',
      'Quick Action Step: Use Gemini to analyze a competitor\'s website or product image.'
    ]
  },
  {
    title: 'Midjourney: Visual Content Creation',
    content: [
      'Midjourney generates stunning images from text descriptions, revolutionizing visual content creation.',
      'Business Applications:',
      '• Product visualization',
      '• Marketing materials',
      '• Social media content',
      '• Website imagery',
      '• Brand identity development',
      'Quick Action Step: Create three product concept images for your business.'
    ]
  },
  {
    title: 'DALL-E: OpenAI\'s Image Generator',
    content: [
      'DALL-E creates realistic images and art from natural language descriptions with exceptional detail control.',
      'Key Features:',
      '• Outpainting and inpainting capabilities',
      '• Higher resolution outputs',
      '• More accurate text rendering',
      '• Better prompt following',
      '• Seamless integration with ChatGPT',
      'Quick Action Step: Generate a logo concept or product mockup using DALL-E.'
    ]
  },
  {
    title: 'Runway: AI Video Production',
    content: [
      'Runway is transforming video creation with AI-powered tools that simplify complex production tasks.',
      'Creator Applications:',
      '• Text-to-video generation',
      '• Video editing and enhancement',
      '• Motion tracking and effects',
      '• Background removal',
      '• Style transfer between videos',
      'Quick Action Step: Create a 10-second product teaser using Runway.'
    ]
  },
  {
    title: 'ElevenLabs: Voice AI Revolution',
    content: [
      'ElevenLabs provides ultra-realistic voice synthesis for content creators and businesses.',
      'Money-Making Applications:',
      '• Audiobook production',
      '• Podcast creation',
      '• Video narration',
      '• IVR and customer service systems',
      '• Multilingual content without translation costs',
      'Quick Action Step: Convert one of your written pieces into audio content.'
    ]
  },
  {
    title: 'GitHub Copilot: Coding Accelerator',
    content: [
      'GitHub Copilot transforms coding productivity by suggesting code completions and entire functions.',
      'Developer Benefits:',
      '• 55% faster coding speed',
      '• Reduced debugging time',
      '• Learning new languages more quickly',
      '• Automating repetitive tasks',
      '• Solving complex problems with AI assistance',
      'Quick Action Step: Use Copilot to build a simple web component or automation script.'
    ]
  },
  {
    title: 'Building an AI Blog Empire',
    content: [
      'Create a profitable blog business using AI tools to streamline content creation and optimization.',
      '5-Step Process:',
      '1. Niche selection and keyword research with ChatGPT',
      '2. Content planning and outline creation',
      '3. First draft generation with AI',
      '4. Human editing and enhancement',
      '5. SEO optimization and publishing',
      'Quick Action Step: Create your first AI-assisted blog post following this process.'
    ]
  },
  {
    title: 'AI Freelancing: Service Offerings',
    content: [
      'Leverage AI tools to offer high-value freelance services with reduced time investment.',
      'Profitable Service Ideas:',
      '• AI-assisted copywriting',
      '• Custom prompt engineering',
      '• AI image and design services',
      '• Content repurposing (blog to video/audio)',
      '• AI strategy consulting',
      'Quick Action Step: Create a service package and pricing for one AI-powered offering.'
    ]
  },
  {
    title: 'E-commerce Product Research',
    content: [
      'Use AI to identify profitable product opportunities and validate market demand.',
      'Research Framework:',
      '1. Trend analysis with ChatGPT',
      '2. Competitor research using Claude',
      '3. Product visualization with Midjourney',
      '4. Customer persona development',
      '5. Pricing strategy optimization',
      'Quick Action Step: Research one product category using this AI framework.'
    ]
  },
  {
    title: 'AI-Powered Marketing Campaigns',
    content: [
      'Create comprehensive marketing campaigns with AI assistance for superior results.',
      'Campaign Elements:',
      '• Audience targeting and segmentation',
      '• Multi-channel content creation',
      '• Ad copy generation and testing',
      '• Visual asset development',
      '• Performance analysis and optimization',
      'Quick Action Step: Develop a mini-campaign for one product or service.'
    ]
  },
  {
    title: 'Digital Product Creation',
    content: [
      'Develop and sell digital products with AI assistance to generate passive income.',
      'Profitable Product Types:',
      '• E-books and guides',
      '• Online courses',
      '• Templates and frameworks',
      '• Software tools and plugins',
      '• Membership sites with AI-generated content',
      'Quick Action Step: Outline your first digital product concept.'
    ]
  },
  {
    title: 'AI Prompt Engineering',
    content: [
      'Master the art of prompt engineering to achieve superior results from AI tools.',
      'Advanced Techniques:',
      '• Role-based prompting',
      '• Chain-of-thought reasoning',
      '• Few-shot learning examples',
      '• System message optimization',
      '• Output format control',
      'Quick Action Step: Rewrite one of your existing prompts using these techniques.'
    ]
  },
  {
    title: 'Social Media Content Automation',
    content: [
      'Create engaging social media content at scale using AI tools and automation.',
      'Workflow Components:',
      '1. Content calendar planning with ChatGPT',
      '2. Text content generation for multiple platforms',
      '3. Image creation with Midjourney or DALL-E',
      '4. Video content with Runway',
      '5. Scheduling and analytics',
      'Quick Action Step: Create a week\'s worth of content for one platform.'
    ]
  },
  {
    title: 'AI-Enhanced Customer Service',
    content: [
      'Implement AI solutions to improve customer service while reducing operational costs.',
      'Implementation Strategies:',
      '• Chatbot development and training',
      '• FAQ automation',
      '• Customer email response assistance',
      '• Sentiment analysis for feedback',
      '• Personalized recommendation systems',
      'Quick Action Step: Create a simple customer service chatbot flow.'
    ]
  },
  {
    title: 'Podcast Production with AI',
    content: [
      'Streamline podcast creation using AI tools for content, editing, and distribution.',
      'Production Workflow:',
      '1. Topic research and outline creation',
      '2. Script generation with ChatGPT',
      '3. Voice synthesis with ElevenLabs',
      '4. Audio editing with Descript',
      '5. Show notes and promotional content creation',
      'Quick Action Step: Create a 5-minute podcast episode using this workflow.'
    ]
  },
  {
    title: 'YouTube Channel Optimization',
    content: [
      'Build and grow a YouTube channel with AI assistance for content creation and optimization.',
      'Channel Growth Strategy:',
      '• Keyword research and topic selection',
      '• Script writing and storyboarding',
      '• Thumbnail creation with Midjourney',
      '• Video editing assistance',
      '• SEO optimization for titles and descriptions',
      'Quick Action Step: Create one YouTube video outline using AI tools.'
    ]
  },
  {
    title: 'AI for Email Marketing',
    content: [
      'Enhance email marketing campaigns with AI-powered content, segmentation, and optimization.',
      'Implementation Areas:',
      '• Subject line generation and testing',
      '• Personalized email content creation',
      '• Audience segmentation strategies',
      '• A/B testing analysis',
      '• Automated sequence development',
      'Quick Action Step: Write one email sequence for your business using AI.'
    ]
  },
  {
    title: 'Virtual Assistant Business',
    content: [
      'Start or scale a virtual assistant business by leveraging AI to multiply your productivity.',
      'Service Enhancement:',
      '• Task automation with AI',
      '• Content creation services',
      '• Research and data analysis',
      '• Client communication management',
      '• Project management assistance',
      'Quick Action Step: Identify three VA tasks you can enhance with AI.'
    ]
  },
  {
    title: 'AI for E-commerce Copywriting',
    content: [
      'Create high-converting product descriptions, landing pages, and marketing copy for e-commerce.',
      'Application Areas:',
      '• Product description generation',
      '• Category page optimization',
      '• Email marketing sequences',
      '• Ad copy creation',
      '• Landing page content',
      'Quick Action Step: Rewrite one product description using AI assistance.'
    ]
  },
  {
    title: 'Online Course Creation',
    content: [
      'Develop comprehensive online courses with AI assistance for content and structure.',
      'Development Process:',
      '1. Market research and topic selection',
      '2. Curriculum planning and outlining',
      '3. Content creation for modules',
      '4. Visual aid development',
      '5. Quiz and assessment creation',
      'Quick Action Step: Outline one module for your first online course.'
    ]
  },
  {
    title: 'AI for Sales Copywriting',
    content: [
      'Create persuasive sales copy that converts using AI-powered frameworks and techniques.',
      'Copy Elements:',
      '• Attention-grabbing headlines',
      '• Problem-agitation-solution frameworks',
      '• Feature-benefit connections',
      '• Social proof integration',
      '• Compelling calls to action',
      'Quick Action Step: Write one sales page section using AI assistance.'
    ]
  },
  {
    title: 'Consulting Business Expansion',
    content: [
      'Scale your consulting business by integrating AI tools into your service offerings.',
      'Implementation Strategies:',
      '• Client research automation',
      '• Proposal generation',
      '• Service delivery enhancement',
      '• Follow-up and nurturing systems',
      '• Knowledge base development',
      'Quick Action Step: Create one AI-enhanced consulting deliverable.'
    ]
  },
  {
    title: 'AI Tool Combination Strategies',
    content: [
      'Maximize results by strategically combining multiple AI tools into powerful workflows.',
      'Powerful Combinations:',
      '• ChatGPT + Midjourney for content marketing',
      '• Claude + ElevenLabs for research podcasts',
      '• Gemini + GitHub Copilot for app development',
      '• DALL-E + Runway for video marketing',
      '• Multiple LLMs for research triangulation',
      'Quick Action Step: Design one multi-tool workflow for your business.'
    ]
  },
  {
    title: 'Building Multiple Income Streams',
    content: [
      'Develop a diversified income portfolio using AI tools to manage multiple revenue channels.',
      'Income Diversification:',
      '• Active service businesses',
      '• Digital product sales',
      '• Affiliate marketing',
      '• Content monetization',
      '• Subscription models',
      'Quick Action Step: Map out three potential income streams for your business.'
    ]
  },
  {
    title: 'Action Plan and Next Steps',
    content: [
      '30-Day Quick Start Plan:',
      '1. Select your primary AI tools',
      '2. Complete basic training',
      '3. Implement one money-making strategy',
      '4. Track results and optimize',
      '5. Scale successful approaches',
      '',
      '90-Day Growth Plan:',
      '• Expand to 2-3 income streams',
      '• Develop systems and automation',
      '• Build team if necessary',
      '',
      'One-Year Vision:',
      '• Establish multiple stable income sources',
      '• Create leveraged, scalable systems',
      '• Stay current with AI advancements',
      '',
      'Quick Action Step: Schedule your implementation plan for the next 30 days.'
    ]
  }
];

// Add cover page
doc.fontSize(30).text('AI Tools Mastery Guide 2025', {
  align: 'center'
});

doc.moveDown();
doc.fontSize(20).text('30 Simple Lessons - 1 Page Each', {
  align: 'center'
});

// Add each lesson on a new page
lessons.forEach((lesson, index) => {
  // Add a new page for each lesson (except the first one which follows the cover)
  if (index > 0) {
    doc.addPage();
  } else {
    doc.addPage();
  }

  // Add lesson number and title
  doc.fontSize(16).fillColor('#1a0dab').text(`Lesson ${index + 1}: ${lesson.title}`, {
    align: 'left'
  });

  doc.moveDown();

  // Add lesson content
  doc.fontSize(12).fillColor('#333');
  lesson.content.forEach(paragraph => {
    doc.text(paragraph);
    doc.moveDown();
  });
});

// Finalize the PDF and end the stream
doc.end();

console.log(`PDF created at: ${outputPath}`);