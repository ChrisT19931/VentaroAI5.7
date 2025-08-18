import LessonMenu from '../LessonMenu';

export default function VisualAITools() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-6">Lesson 8: Visual AI Tools</h1>
      
      {/* Learning Objectives */}
      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-300 mb-3">🎯 Learning Objectives</h3>
        <p className="text-green-100 mb-3">By the end of this comprehensive lesson, you will:</p>
        <ul className="list-disc ml-6 text-green-200 space-y-1">
          <li>Master the top visual AI tools for image generation, editing, and design automation</li>
          <li>Create professional-quality visuals without traditional design skills</li>
          <li>Build scalable visual content systems for businesses and clients</li>
          <li>Understand licensing, commercial use, and legal considerations</li>
          <li>Develop profitable visual AI services and products</li>
        </ul>
      </div>

      {/* Pro Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Master prompt crafting for visual AI. Specific, descriptive prompts with style references produce dramatically better results than generic requests. The difference between amateur and professional results is in the prompt quality.</p>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">📋 Executive Summary</h2>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">Visual AI tools are revolutionizing creative industries by democratizing high-quality design and image creation. This lesson covers the essential tools and techniques for generating professional visuals without traditional design skills.</p>
          
          <p className="text-gray-300 mb-4">We'll explore everything from basic image generation to advanced design automation, video creation, and brand consistency systems. You'll learn the exact workflows used by successful design agencies and content creators who've built six-figure businesses using visual AI.</p>
          
          <p className="text-gray-300">Most importantly, you'll understand how to monetize these capabilities through services, products, and automated systems that generate revenue while you sleep.</p>
        </div>
      </div>

      {/* The Visual AI Landscape */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">🎨 The Visual AI Landscape</h2>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">The visual AI market is exploding with new tools and capabilities. Here's your complete guide to the ecosystem:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">🖼️ Image Generation Titans</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Midjourney:</strong> Best for artistic, creative images</p>
                    <p className="text-blue-200 text-xs">Pricing: $10-60/month | Best for: Marketing, art, concepts</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>DALL-E 3:</strong> Best for realistic, precise images</p>
                    <p className="text-blue-200 text-xs">Pricing: $20/month | Best for: Product shots, portraits</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Stable Diffusion:</strong> Open source, customizable</p>
                    <p className="text-blue-200 text-xs">Pricing: Free-$50/month | Best for: Custom models, bulk</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">✏️ Design & Editing Tools</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Canva AI:</strong> Templates + AI generation</p>
                    <p className="text-green-200 text-xs">Pricing: $15/month | Best for: Social media, presentations</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Adobe Firefly:</strong> Professional editing suite</p>
                    <p className="text-green-200 text-xs">Pricing: $23/month | Best for: Professional design</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Figma AI:</strong> UI/UX design automation</p>
                    <p className="text-green-200 text-xs">Pricing: $15/month | Best for: Web/app design</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h3 className="text-purple-300 font-semibold mb-2">🎬 Video & Animation</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-purple-200 text-sm"><strong>Runway ML:</strong> AI video generation & editing</p>
                    <p className="text-purple-200 text-xs">Pricing: $12-76/month | Best for: Video content</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-purple-200 text-sm"><strong>Luma AI:</strong> 3D capture and generation</p>
                    <p className="text-purple-200 text-xs">Pricing: Free-$30/month | Best for: 3D models</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-purple-200 text-sm"><strong>D-ID:</strong> AI avatar and talking heads</p>
                    <p className="text-purple-200 text-xs">Pricing: $6-300/month | Best for: Video avatars</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h3 className="text-orange-300 font-semibold mb-2">🏢 Business & Marketing</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-200 text-sm"><strong>Looka:</strong> AI logo and brand design</p>
                    <p className="text-orange-200 text-xs">Pricing: $20-96/month | Best for: Branding</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-200 text-sm"><strong>Brandmark:</strong> Complete brand packages</p>
                    <p className="text-orange-200 text-xs">Pricing: $25-175/month | Best for: Brand identity</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-200 text-sm"><strong>AdCreative.ai:</strong> Ad creative generation</p>
                    <p className="text-orange-200 text-xs">Pricing: $21-141/month | Best for: Ad campaigns</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">🔧 Specialized Tools</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-red-200 text-sm"><strong>Remove.bg:</strong> Background removal</p>
                    <p className="text-red-200 text-xs">Pricing: Free-$99/month | Best for: Product photos</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-red-200 text-sm"><strong>Upscale.media:</strong> Image enhancement</p>
                    <p className="text-red-200 text-xs">Pricing: Free-$39/month | Best for: Image quality</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-red-200 text-sm"><strong>Photoleap:</strong> Mobile AI photo editing</p>
                    <p className="text-red-200 text-xs">Pricing: $8/month | Best for: Mobile workflows</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">💰 Cost Comparison</h3>
                <div className="space-y-1">
                  <p className="text-yellow-200 text-sm">Budget Tier: $0-50/month</p>
                  <p className="text-yellow-200 text-sm">Professional: $50-200/month</p>
                  <p className="text-yellow-200 text-sm">Enterprise: $200-1000/month</p>
                  <p className="text-yellow-200 text-xs mt-2">ROI: Most users see 5-20x return on investment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Class: Image Generation Techniques */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">🎨 Master Class: Image Generation Techniques</h2>
        
        {/* Prompt Engineering for Visuals */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-3">The VISUAL Framework for Perfect Prompts</h3>
          <p className="text-gray-300 mb-4">Use this framework to create consistently excellent visual prompts:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">V - Vision (Main Subject)</h4>
                <p className="text-blue-200 text-sm mb-2">Clearly describe the primary subject:</p>
                <div className="bg-black/30 rounded p-2">
                  <code className="text-green-300 text-xs">
                    "A professional businesswoman in her 30s, confident posture, wearing a navy blazer..."
                  </code>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h4 className="text-green-300 font-semibold mb-2">I - Imagery (Style & Mood)</h4>
                <p className="text-green-200 text-sm mb-2">Define the artistic style:</p>
                <div className="bg-black/30 rounded p-2">
                  <code className="text-green-300 text-xs">
                    "...corporate headshot style, professional photography, clean and modern aesthetic..."
                  </code>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">S - Setting (Environment)</h4>
                <p className="text-purple-200 text-sm mb-2">Describe the background/location:</p>
                <div className="bg-black/30 rounded p-2">
                  <code className="text-green-300 text-xs">
                    "...in a modern office environment, glass windows with city view, soft natural lighting..."
                  </code>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h4 className="text-orange-300 font-semibold mb-2">U - Utility (Technical Specs)</h4>
                <p className="text-orange-200 text-sm mb-2">Specify technical requirements:</p>
                <div className="bg-black/30 rounded p-2">
                  <code className="text-green-300 text-xs">
                    "...shot with 85mm lens, shallow depth of field, high resolution, 4K quality..."
                  </code>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h4 className="text-red-300 font-semibold mb-2">A - Aesthetics (Colors & Composition)</h4>
                <p className="text-red-200 text-sm mb-2">Define visual elements:</p>
                <div className="bg-black/30 rounded p-2">
                  <code className="text-green-300 text-xs">
                    "...color palette of navy, white, and gold accents, rule of thirds composition..."
                  </code>
                </div>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">L - Limitations (What to Avoid)</h4>
                <p className="text-yellow-200 text-sm mb-2">Specify exclusions:</p>
                <div className="bg-black/30 rounded p-2">
                  <code className="text-green-300 text-xs">
                    "...avoid casual clothing, cluttered backgrounds, harsh shadows, oversaturation"
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Prompting Techniques */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🎯 Style Reference Mastery</h3>
            <p className="text-gray-300 mb-3">Use these proven style references for consistent, professional results:</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">📸 Photography Styles</h4>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• "Corporate headshot style"</li>
                  <li>• "Editorial fashion photography"</li>
                  <li>• "Product photography, white background"</li>
                  <li>• "Lifestyle photography, candid"</li>
                  <li>• "Architectural photography, clean lines"</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h4 className="text-green-300 font-semibold mb-2">🎨 Artistic Styles</h4>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• "Minimalist design aesthetic"</li>
                  <li>• "Vintage poster art style"</li>
                  <li>• "Modern flat design illustration"</li>
                  <li>• "Watercolor painting technique"</li>
                  <li>• "Vector art, clean and simple"</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🏢 Business Styles</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• "Corporate annual report style"</li>
                  <li>• "Tech startup aesthetic"</li>
                  <li>• "Financial services professional"</li>
                  <li>• "Healthcare industry standard"</li>
                  <li>• "E-commerce product style"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🔧 Advanced Techniques</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                  <h4 className="text-orange-300 font-semibold mb-2">🎭 Aspect Ratio Optimization</h4>
                  <ul className="text-orange-200 space-y-1 text-sm">
                    <li>• Instagram posts: --ar 1:1</li>
                    <li>• Instagram stories: --ar 9:16</li>
                    <li>• LinkedIn banners: --ar 4:1</li>
                    <li>• Website headers: --ar 3:1</li>
                    <li>• Print materials: --ar 8.5:11</li>
                  </ul>
                </div>
                
                <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                  <h4 className="text-red-300 font-semibold mb-2">⚡ Quality Enhancers</h4>
                  <ul className="text-red-200 space-y-1 text-sm">
                    <li>• Add "professional photography"</li>
                    <li>• Include "high resolution, 4K"</li>
                    <li>• Specify "award-winning"</li>
                    <li>• Use "studio lighting"</li>
                    <li>• Add "sharp focus, detailed"</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-teal-900/20 border border-teal-500/30 rounded p-4">
                  <h4 className="text-teal-300 font-semibold mb-2">🎨 Color Psychology</h4>
                  <ul className="text-teal-200 space-y-1 text-sm">
                    <li>• Blue: Trust, professionalism</li>
                    <li>• Green: Growth, sustainability</li>
                    <li>• Red: Energy, urgency</li>
                    <li>• Purple: Luxury, creativity</li>
                    <li>• Orange: Enthusiasm, warmth</li>
                  </ul>
                </div>
                
                <div className="bg-pink-900/20 border border-pink-500/30 rounded p-4">
                  <h4 className="text-pink-300 font-semibold mb-2">🚫 Common Mistakes</h4>
                  <ul className="text-pink-200 space-y-1 text-sm">
                    <li>• Too many conflicting styles</li>
                    <li>• Vague or generic descriptions</li>
                    <li>• Ignoring composition rules</li>
                    <li>• Inconsistent brand elements</li>
                    <li>• Not specifying image purpose</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Applications & Workflows */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">💼 Business Applications & Workflows</h2>
        
        <div className="space-y-6">
          {/* Social Media Automation */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 rounded-full p-2">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Social Media Content Factory</h3>
              <div className="bg-blue-900/30 border border-blue-500/30 rounded px-3 py-1">
                <span className="text-blue-300 text-sm font-semibold">90% time savings</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">🔄 Automated Workflow</h4>
                  <ol className="text-blue-200 space-y-1 text-sm list-decimal ml-4">
                    <li>Content calendar planning (ChatGPT)</li>
                    <li>Image generation (Midjourney/DALL-E)</li>
                    <li>Text overlay addition (Canva AI)</li>
                    <li>Brand consistency check</li>
                    <li>Multi-platform sizing</li>
                    <li>Automated scheduling</li>
                  </ol>
                </div>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                  <h4 className="text-green-300 font-semibold mb-2">📊 Results Achieved</h4>
                  <ul className="text-green-200 space-y-1 text-sm">
                    <li>• 50 posts created per hour</li>
                    <li>• Consistent brand aesthetic</li>
                    <li>• 300% increase in engagement</li>
                    <li>• 90% reduction in design time</li>
                    <li>• $5K+ monthly client revenue</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-black/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">💡 Sample Workflow Prompt:</h4>
                <code className="text-green-300 text-sm block whitespace-pre-wrap">
{`Create a series of 10 Instagram posts for a fitness brand:

Subject: Motivational fitness content
Style: Clean, modern, energetic
Colors: Navy blue, bright orange, white
Format: Square (1:1), high resolution
Include: Inspiring quotes, workout tips
Avoid: Stock photo look, cluttered design

For each image:
1. Motivational quote overlay
2. Fitness-related background
3. Brand colors prominent
4. Professional typography
5. Call-to-action space`}
                </code>
              </div>
            </div>
          </div>

          {/* E-commerce Product Photography */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 rounded-full p-2">
                <span className="text-white text-xl">🛍️</span>
              </div>
              <h3 className="text-xl font-semibold text-white">E-commerce Product Photography</h3>
              <div className="bg-green-900/30 border border-green-500/30 rounded px-3 py-1">
                <span className="text-green-300 text-sm font-semibold">$500-2000 per client</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">📸 Product Shots</h4>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• White background isolation</li>
                  <li>• Multiple angle views</li>
                  <li>• Detail close-ups</li>
                  <li>• Size comparison shots</li>
                  <li>• Packaging mockups</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h4 className="text-green-300 font-semibold mb-2">🎨 Lifestyle Images</h4>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• Products in use scenarios</li>
                  <li>• Lifestyle environment shots</li>
                  <li>• User interaction images</li>
                  <li>• Seasonal variations</li>
                  <li>• Brand story visuals</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🔧 Technical Specs</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• High resolution (300 DPI)</li>
                  <li>• Multiple format outputs</li>
                  <li>• Consistent lighting</li>
                  <li>• Color accuracy</li>
                  <li>• Platform optimization</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Brand Identity Systems */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 rounded-full p-2">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Complete Brand Identity Systems</h3>
              <div className="bg-purple-900/30 border border-purple-500/30 rounded px-3 py-1">
                <span className="text-purple-300 text-sm font-semibold">$2000-10K packages</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                  <h4 className="text-orange-300 font-semibold mb-2">🏢 Brand Package Includes</h4>
                  <ul className="text-orange-200 space-y-1 text-sm">
                    <li>• Logo design and variations</li>
                    <li>• Color palette and guidelines</li>
                    <li>• Typography system</li>
                    <li>• Business card designs</li>
                    <li>• Letterhead and stationery</li>
                    <li>• Social media templates</li>
                    <li>• Brand guideline document</li>
                  </ul>
                </div>
                
                <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                  <h4 className="text-red-300 font-semibold mb-2">⚡ Delivery Timeline</h4>
                  <ul className="text-red-200 space-y-1 text-sm">
                    <li>• Day 1-2: Brand discovery and strategy</li>
                    <li>• Day 3-5: Logo concepts and refinement</li>
                    <li>• Day 6-8: Color and typography system</li>
                    <li>• Day 9-12: Application designs</li>
                    <li>• Day 13-14: Guidelines and delivery</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-black/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🎨 Brand Logo Prompt Template:</h4>
                <code className="text-green-300 text-sm block whitespace-pre-wrap">
{`Design a professional logo for [COMPANY NAME]:

Industry: [SPECIFIC INDUSTRY]
Style: Modern, clean, professional
Colors: [PRIMARY COLORS]
Mood: Trustworthy, innovative, approachable
Elements: [SPECIFIC SYMBOLS/CONCEPTS]

Requirements:
- Scalable vector design
- Works in color and black/white
- Readable at small sizes
- Timeless, not trendy
- Unique and memorable

Avoid:
- Overly complex details
- Dated design trends
- Generic stock symbols
- Hard to read fonts`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video & Animation AI */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">🎬 Video & Animation AI</h2>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">Video AI is the next frontier, offering incredible opportunities for content creators and businesses:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">🎥 Video Generation Tools</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Runway ML:</strong> Text-to-video, video editing</p>
                    <p className="text-blue-200 text-xs">Best for: Short clips, effects, style transfer</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Pika Labs:</strong> Video generation from prompts</p>
                    <p className="text-blue-200 text-xs">Best for: Creative videos, animations</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Stable Video:</strong> Image-to-video conversion</p>
                    <p className="text-blue-200 text-xs">Best for: Product demos, motion graphics</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">🎭 Avatar & Talking Heads</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>D-ID:</strong> AI presenters and avatars</p>
                    <p className="text-green-200 text-xs">Best for: Training videos, presentations</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Synthesia:</strong> Professional AI videos</p>
                    <p className="text-green-200 text-xs">Best for: Corporate communications</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>HeyGen:</strong> Multilingual AI avatars</p>
                    <p className="text-green-200 text-xs">Best for: Global content, translations</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h3 className="text-purple-300 font-semibold mb-2">💼 Business Applications</h3>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• Product demonstration videos</li>
                  <li>• Training and educational content</li>
                  <li>• Social media marketing videos</li>
                  <li>• Explainer and how-to videos</li>
                  <li>• Personalized video messages</li>
                  <li>• Multilingual content creation</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h3 className="text-orange-300 font-semibold mb-2">🎨 Creative Workflows</h3>
                <ol className="text-orange-200 space-y-1 text-sm list-decimal ml-4">
                  <li>Script writing (ChatGPT)</li>
                  <li>Storyboard creation (Midjourney)</li>
                  <li>Video generation (Runway ML)</li>
                  <li>Voice synthesis (ElevenLabs)</li>
                  <li>Final editing (CapCut/Premiere)</li>
                  <li>Platform optimization</li>
                </ol>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">📈 Revenue Opportunities</h3>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• Video creation services: $500-5K/project</li>
                  <li>• Training video production: $1K-10K</li>
                  <li>• Social media content: $200-1K/month</li>
                  <li>• Explainer videos: $1K-15K each</li>
                  <li>• Personalized video campaigns: $2K-20K</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">⚠️ Current Limitations</h3>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li>• Limited video length (5-10 seconds)</li>
                  <li>• Inconsistent quality across clips</li>
                  <li>• High computational costs</li>
                  <li>• Limited character consistency</li>
                  <li>• Requires post-processing skills</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Commercial Considerations */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">⚖️ Legal & Commercial Considerations</h2>
        <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6">
          <p className="text-gray-300 mb-4">Understanding the legal landscape is crucial for commercial success:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">✅ Commercial Rights by Platform</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Midjourney:</strong> Full commercial rights</p>
                    <p className="text-green-200 text-xs">Can sell, license, and use commercially</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>DALL-E 3:</strong> Commercial use allowed</p>
                    <p className="text-green-200 text-xs">No attribution required for paid accounts</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Stable Diffusion:</strong> Open source license</p>
                    <p className="text-green-200 text-xs">Full commercial freedom</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">📋 Best Practices</h3>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• Always read platform terms of service</li>
                  <li>• Keep records of generation prompts</li>
                  <li>• Avoid copyrighted character references</li>
                  <li>• Don't use real people's likenesses</li>
                  <li>• Respect trademark protections</li>
                  <li>• Consider image insurance for high-value uses</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h3 className="text-purple-300 font-semibold mb-2">🔒 Client Protection</h3>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• Include AI disclosure in contracts</li>
                  <li>• Provide indemnification clauses</li>
                  <li>• Offer revision guarantees</li>
                  <li>• Maintain generation documentation</li>
                  <li>• Use reputable AI platforms only</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h3 className="text-orange-300 font-semibold mb-2">⚠️ Potential Issues</h3>
                <ul className="text-orange-200 space-y-1 text-sm">
                  <li>• Copyright infringement claims</li>
                  <li>• Trademark violations</li>
                  <li>• Privacy and likeness rights</li>
                  <li>• Platform policy changes</li>
                  <li>• Client expectations management</li>
                  <li>• Quality consistency challenges</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">🚫 Avoid These Risks</h3>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• Using celebrity names/faces</li>
                  <li>• Copying existing artwork styles exactly</li>
                  <li>• Creating misleading or false images</li>
                  <li>• Violating platform community guidelines</li>
                  <li>• Selling without proper licensing</li>
                  <li>• Ignoring client usage restrictions</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">📄 Contract Templates</h3>
                <p className="text-yellow-200 text-sm mb-2">Include these clauses in client contracts:</p>
                <ul className="text-yellow-200 space-y-1 text-xs">
                  <li>• "Images generated using AI technology"</li>
                  <li>• "Client assumes responsibility for usage"</li>
                  <li>• "Revisions available within 30 days"</li>
                  <li>• "Commercial rights transfer upon payment"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monetization Strategies */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">💰 Monetization Strategies</h2>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">Turn your visual AI skills into profitable revenue streams:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">🎨 Service-Based Models</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Custom Design Services</strong></p>
                    <p className="text-green-200 text-xs">$50-500 per image | $500-5K per project</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Brand Identity Packages</strong></p>
                    <p className="text-green-200 text-xs">$1K-10K per complete brand system</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Social Media Management</strong></p>
                    <p className="text-green-200 text-xs">$500-3K monthly per client</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-green-200 text-sm"><strong>Product Photography</strong></p>
                    <p className="text-green-200 text-xs">$10-100 per product image</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">📦 Product-Based Models</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Stock Image Libraries</strong></p>
                    <p className="text-blue-200 text-xs">$1-50 per download, recurring revenue</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Template Collections</strong></p>
                    <p className="text-blue-200 text-xs">$10-100 per template pack</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Print-on-Demand Products</strong></p>
                    <p className="text-blue-200 text-xs">$5-50 profit per item sold</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-blue-200 text-sm"><strong>Digital Art NFTs</strong></p>
                    <p className="text-blue-200 text-xs">$10-10K+ per unique piece</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h3 className="text-purple-300 font-semibold mb-2">🎓 Education & Training</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-purple-200 text-sm"><strong>Online Courses</strong></p>
                    <p className="text-purple-200 text-xs">$50-500 per student</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-purple-200 text-sm"><strong>Workshop Training</strong></p>
                    <p className="text-purple-200 text-xs">$100-1K per attendee</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-purple-200 text-sm"><strong>Consultation Services</strong></p>
                    <p className="text-purple-200 text-xs">$100-500 per hour</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h3 className="text-orange-300 font-semibold mb-2">🤖 Automation & SaaS</h3>
                <div className="space-y-2">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-200 text-sm"><strong>Automated Design Tools</strong></p>
                    <p className="text-orange-200 text-xs">$20-200 monthly subscriptions</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-200 text-sm"><strong>API Services</strong></p>
                    <p className="text-orange-200 text-xs">$0.01-1.00 per API call</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-orange-200 text-sm"><strong>White-Label Solutions</strong></p>
                    <p className="text-orange-200 text-xs">$500-5K monthly licensing</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">📈 Scaling Strategies</h3>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• Start with high-margin services</li>
                  <li>• Build portfolio and testimonials</li>
                  <li>• Create standardized packages</li>
                  <li>• Develop team and processes</li>
                  <li>• Expand into related services</li>
                  <li>• Build recurring revenue streams</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">💡 Success Tips</h3>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li>• Specialize in specific industries</li>
                  <li>• Maintain consistent quality standards</li>
                  <li>• Invest in ongoing AI tool training</li>
                  <li>• Build strong client relationships</li>
                  <li>• Stay updated with new tools</li>
                  <li>• Focus on client results, not tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Expansion Prompts */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">🚀 AI Expansion Prompts</h3>
        <p className="text-purple-100 text-sm mb-4">Use these prompts to master visual AI for your specific needs:</p>
        
        <div className="space-y-4">
          <div className="bg-black/30 rounded p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Visual Brand Strategy:</h4>
            <code className="text-green-300 text-sm block">
              "Create a comprehensive visual brand strategy for [YOUR BUSINESS TYPE] targeting [YOUR AUDIENCE]. Include: 1) Visual style guidelines 2) Color psychology recommendations 3) Image types and compositions 4) Platform-specific adaptations 5) Content calendar with visual themes. Make it specific to [YOUR INDUSTRY] and competitive landscape."
            </code>
          </div>
          
          <div className="bg-black/30 rounded p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Service Package Development:</h4>
            <code className="text-green-300 text-sm block">
              "Design profitable visual AI service packages for [YOUR TARGET MARKET]. Include: 1) Service tiers with specific deliverables 2) Pricing strategies and profit margins 3) Workflow automation opportunities 4) Client onboarding process 5) Quality control systems. Focus on scalable, high-margin services."
            </code>
          </div>
          
          <div className="bg-black/30 rounded p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Technical Optimization:</h4>
            <code className="text-green-300 text-sm block">
              "Optimize my visual AI workflow for [SPECIFIC USE CASE]. Analyze: 1) Current tool selection and alternatives 2) Prompt optimization techniques 3) Quality control processes 4) Cost reduction strategies 5) Automation opportunities. Provide specific recommendations for improving efficiency and output quality."
            </code>
          </div>
        </div>
      </div>

      {/* Action Items & Homework */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-300 mb-3">📝 Action Items & Homework</h3>
        <p className="text-yellow-100 mb-4">Complete these assignments to master visual AI tools:</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-yellow-300 font-semibold mb-2">This Week:</h4>
            <ul className="text-yellow-200 space-y-1 text-sm">
              <li>□ Sign up for 3 visual AI tools</li>
              <li>□ Create 20 images using the VISUAL framework</li>
              <li>□ Build a style reference library</li>
              <li>□ Design your first brand package</li>
              <li>□ Research legal requirements in your area</li>
            </ul>
          </div>
          <div>
            <h4 className="text-yellow-300 font-semibold mb-2">Next 30 Days:</h4>
            <ul className="text-yellow-200 space-y-1 text-sm">
              <li>□ Launch your first visual AI service</li>
              <li>□ Create a portfolio of 50+ images</li>
              <li>□ Develop 3 standardized packages</li>
              <li>□ Get your first paying client</li>
              <li>□ Build automated workflows</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-3">🎯 Key Takeaways</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-green-300 font-semibold mb-2">Mastery Principles:</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Prompt quality determines visual output quality</li>
              <li>• Consistency builds brand recognition and trust</li>
              <li>• Specialization commands higher prices</li>
              <li>• Automation enables scaling and profitability</li>
              <li>• Legal compliance protects your business</li>
            </ul>
          </div>
          <div>
            <h4 className="text-blue-300 font-semibold mb-2">Success Metrics:</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Images generated per hour</li>
              <li>• Client satisfaction scores</li>
              <li>• Revenue per project/client</li>
              <li>• Time saved vs traditional methods</li>
              <li>• Portfolio growth and diversity</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">📚 Next Steps</h3>
        <p className="text-gray-300 mb-4">You now have the complete toolkit for visual AI mastery. Ready to explore more specialized AI applications?</p>
        <p className="text-gray-300">Continue to <strong>Lesson 9: "AI for E-commerce"</strong> to learn how to apply your visual AI skills specifically to e-commerce businesses, including product photography, conversion optimization, and automated marketing visuals.</p>
        
        <div className="flex gap-4 mt-6">
          <a href="/downloads/ebook/ai-for-ecommerce" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">Next Lesson →</a>
        </div>
      </div>
    </div>
  );
}