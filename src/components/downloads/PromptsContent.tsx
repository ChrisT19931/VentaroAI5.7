'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'react-hot-toast';

interface PromptsContentProps {
  hasAccess?: boolean;
  isAdmin?: boolean;
}

export default function PromptsContent({ hasAccess = false, isAdmin = false }: PromptsContentProps) {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Just set loading to false after component mounts
    setIsLoading(false);
  }, []);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('Please log in to download');
      return;
    }

    setIsDownloading(true);
    
    // Create download link
    const link = document.createElement('a');
    link.href = '/downloads/ai-prompts-collection.pdf';
    link.download = 'AI-Prompts-Collection.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started!');
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-4">AI Prompts Collection 2025</h1>
            <p className="text-gray-300 mb-8">
              Access our premium collection of AI prompts for maximum productivity and income.
            </p>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm mb-2">🔒 Access Required</p>
              <p className="text-gray-300 text-sm">Please log in or purchase to access this content</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/products/2" 
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Purchase
              </Link>
            </div>
            
            <div className="text-sm text-gray-400 mt-6">
              <Link href="/my-account" className="text-emerald-400 hover:text-emerald-300">
                ← Back to My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-4">AI Prompts Collection 2025</h1>
          <p className="text-xl text-gray-300">
            Premium AI prompts for content creation, business automation, and income generation
          </p>
        </div>

        {/* AI Prompts Collection */}
        <div className="space-y-8">
          
          {/* Content Creation Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              📝 Content Creation Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Blog Post Generator</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Write a comprehensive 1500-word blog post about [TOPIC]. Include an engaging introduction, 5 main sections with subheadings, actionable tips, and a compelling conclusion with a call-to-action. Target audience: [AUDIENCE]. Tone: [PROFESSIONAL/CASUAL/FRIENDLY]. Include relevant statistics and examples."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Replace [TOPIC] and [AUDIENCE] with your specific needs.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Social Media Content</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create 10 engaging social media posts for [PLATFORM] about [TOPIC]. Each post should be [CHARACTER LIMIT] characters or less, include relevant hashtags, and encourage engagement. Vary the post types: questions, tips, behind-the-scenes, user-generated content prompts, and educational content."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Customize for Instagram, LinkedIn, Twitter, or Facebook.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Email Marketing Sequence</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create a 5-email welcome sequence for new subscribers to [BUSINESS TYPE]. Email 1: Welcome and set expectations. Email 2: Share your story/mission. Email 3: Provide valuable free resource. Email 4: Social proof and testimonials. Email 5: Soft pitch for [PRODUCT/SERVICE]. Each email should be 200-300 words with compelling subject lines."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Perfect for building relationships with new subscribers.</p>
              </div>
            </div>
          </div>

          {/* Business Automation Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              💼 Business Automation Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Customer Service Responses</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Generate professional customer service responses for common inquiries about [PRODUCT/SERVICE]. Include responses for: order status, refund requests, technical support, billing questions, and general complaints. Each response should be empathetic, solution-focused, and maintain brand voice. Tone: [FRIENDLY/PROFESSIONAL]."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Streamline your customer support workflow.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Market Research Analysis</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Analyze the market for [PRODUCT/SERVICE] in [LOCATION/DEMOGRAPHIC]. Provide insights on: target audience demographics, competitor analysis, pricing strategies, market size, growth opportunities, and potential challenges. Include actionable recommendations for market entry or expansion."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Get comprehensive market insights quickly.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Business Plan Generator</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create a comprehensive business plan for [BUSINESS IDEA]. Include: executive summary, market analysis, target audience, competitive landscape, marketing strategy, operational plan, financial projections for 3 years, and risk assessment. Format as a professional document suitable for investors or loan applications."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Professional business plans in minutes.</p>
              </div>
            </div>
          </div>

          {/* Creative & Design Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              🎨 Creative & Design Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Brand Story Creation</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Craft a compelling brand story for [COMPANY NAME] that operates in [INDUSTRY]. Include: the founder's journey, problem being solved, mission and values, unique approach, customer impact stories, and future vision. Make it emotional, authentic, and memorable. Length: 500-800 words."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Build emotional connections with your audience.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Product Descriptions</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Write compelling product descriptions for [PRODUCT NAME]. Include: key features and benefits, target audience, use cases, technical specifications (if applicable), what makes it unique, customer pain points it solves, and a strong call-to-action. Optimize for both SEO and conversions. Length: 150-300 words."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Convert browsers into buyers with persuasive copy.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Creative Campaign Ideas</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Generate 10 creative marketing campaign ideas for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include campaigns for different channels: social media, email, content marketing, influencer partnerships, and experiential marketing. Each idea should include concept, execution strategy, expected outcomes, and budget considerations."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Fresh marketing ideas to stand out from competitors.</p>
              </div>
            </div>
          </div>

          {/* SEO & Analytics Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              📊 SEO & Analytics Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">SEO Content Optimization</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Optimize this content for SEO targeting the keyword '[PRIMARY KEYWORD]'. Provide: optimized title tag, meta description, H1-H6 structure, keyword placement suggestions, internal linking opportunities, and related keywords to include. Ensure content remains natural and valuable to readers while improving search rankings."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Boost your search engine rankings effectively.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Keyword Research Strategy</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Develop a comprehensive keyword strategy for [BUSINESS/WEBSITE] in [INDUSTRY]. Identify: primary keywords, long-tail variations, competitor keywords, local SEO opportunities, and content gaps. Organize keywords by search intent (informational, commercial, transactional) and difficulty level."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Find profitable keywords your competitors miss.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Performance Analysis Report</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Analyze the performance data for [WEBSITE/CAMPAIGN] and create a comprehensive report. Include: traffic analysis, conversion rates, user behavior insights, top-performing content, areas for improvement, and actionable recommendations. Present findings in executive summary format with clear next steps."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Turn data into actionable business insights.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Local SEO Optimization</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create a local SEO strategy for [BUSINESS NAME] in [CITY/REGION]. Include: Google My Business optimization, local keyword targeting, citation building strategy, review management plan, and local content creation ideas. Focus on improving visibility for '[SERVICE] near me' searches."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Dominate local search results in your area.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Competitor SEO Analysis</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Conduct a comprehensive SEO analysis of [COMPETITOR WEBSITE]. Analyze: their top-ranking keywords, content strategy, backlink profile, technical SEO implementation, and identify opportunities where we can outrank them. Provide actionable recommendations to gain competitive advantage."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Outrank your competition with strategic insights.</p>
              </div>
            </div>
          </div>

          {/* Sales & Conversion Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              💰 Sales & Conversion Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Sales Page Copy</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Write a high-converting sales page for [PRODUCT/SERVICE] targeting [TARGET AUDIENCE]. Include: attention-grabbing headline, problem identification, solution presentation, benefits vs features, social proof, objection handling, urgency/scarcity elements, and multiple call-to-action buttons. Use proven copywriting formulas like AIDA or PAS."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Convert visitors into paying customers.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Lead Magnet Creation</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Design a compelling lead magnet for [INDUSTRY/NICHE] that attracts [TARGET AUDIENCE]. Suggest: content format (ebook, checklist, template, etc.), title, key points to cover, opt-in page copy, and follow-up email sequence. Ensure it provides immediate value and positions you as an expert."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Build your email list with irresistible offers.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Objection Handling Scripts</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create objection handling scripts for [PRODUCT/SERVICE] sales conversations. Address common objections: price concerns, timing issues, competitor comparisons, trust/credibility questions, and feature limitations. Provide empathetic responses that acknowledge concerns while reinforcing value proposition."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Turn objections into sales opportunities.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Upsell & Cross-sell Sequences</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Develop upsell and cross-sell strategies for customers who purchased [MAIN PRODUCT]. Create: complementary product recommendations, bundle offers, upgrade paths, timing strategies, and persuasive copy for each offer. Focus on adding value while increasing average order value."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Maximize revenue from existing customers.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Testimonial Collection Strategy</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create a systematic approach to collect powerful testimonials for [BUSINESS/PRODUCT]. Include: timing for requests, email templates, interview questions, video testimonial scripts, incentive strategies, and ways to showcase testimonials across marketing channels for maximum impact."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Build trust with authentic customer stories.</p>
              </div>
            </div>
          </div>

          {/* E-commerce & Product Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              🛒 E-commerce & Product Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Product Launch Strategy</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Plan a comprehensive product launch for [PRODUCT NAME] in [MARKET/INDUSTRY]. Include: pre-launch buzz creation, launch day activities, post-launch follow-up, influencer outreach strategy, PR approach, social media campaign, email marketing sequence, and success metrics to track."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Launch products with maximum impact and sales.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Amazon Product Listing</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Optimize an Amazon product listing for [PRODUCT]. Create: compelling title with keywords, bullet points highlighting key benefits, detailed product description, backend search terms, and A+ content suggestions. Focus on conversion optimization and Amazon's algorithm requirements."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Rank higher and sell more on Amazon.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Inventory Management System</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Design an inventory management system for [BUSINESS TYPE] selling [PRODUCT CATEGORY]. Include: stock level monitoring, reorder point calculations, seasonal demand forecasting, supplier management, cost optimization strategies, and automated alerts for low stock situations."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Never run out of stock or overstock again.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Customer Retention Program</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Develop a customer retention program for [E-COMMERCE BUSINESS]. Include: loyalty point system, VIP customer tiers, exclusive offers, birthday/anniversary campaigns, win-back sequences for inactive customers, and referral incentives. Focus on increasing lifetime value and repeat purchases."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Keep customers coming back for more.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Pricing Strategy Analysis</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Analyze and optimize pricing strategy for [PRODUCT/SERVICE] in [MARKET]. Consider: competitor pricing, value perception, psychological pricing tactics, bundle pricing options, discount strategies, and price testing methodologies. Provide recommendations to maximize profitability while remaining competitive."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Price your products for maximum profit.</p>
              </div>
            </div>
          </div>

          {/* Personal Branding & Networking Prompts */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              👤 Personal Branding & Networking Prompts
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">LinkedIn Profile Optimization</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Optimize a LinkedIn profile for [PROFESSION/INDUSTRY]. Create: compelling headline, professional summary, experience descriptions with achievements, skills section optimization, and content strategy. Focus on attracting [TARGET AUDIENCE] and positioning as a thought leader in [EXPERTISE AREA]."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Build a powerful professional presence online.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Networking Email Templates</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create networking email templates for [INDUSTRY/PROFESSION]. Include: cold outreach to industry leaders, follow-up after events, collaboration proposals, mentorship requests, and thank you messages. Each template should be personalized, value-focused, and include clear next steps."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Build meaningful professional relationships.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Thought Leadership Content</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Develop thought leadership content strategy for [EXPERTISE AREA]. Create: industry trend analysis, opinion pieces on current events, case studies, how-to guides, and prediction articles. Include content calendar, distribution strategy, and engagement tactics to build authority and influence."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Establish yourself as an industry expert.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Speaking Engagement Pitch</h3>
                <div className="bg-gray-700 rounded p-4 mb-3">
                  <p className="text-gray-300 font-mono text-sm">
                    "Create a compelling speaker pitch for [TOPIC/EXPERTISE] targeting [EVENT TYPE/AUDIENCE]. Include: speaker bio, talk description, key takeaways for audience, unique angle/perspective, previous speaking experience, and testimonials. Make it easy for event organizers to say yes."
                  </p>
                </div>
                <p className="text-gray-400 text-sm">Land speaking opportunities to boost your brand.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                 <h3 className="text-lg font-semibold text-green-400 mb-3">Personal Brand Story</h3>
                 <div className="bg-gray-700 rounded p-4 mb-3">
                   <p className="text-gray-300 font-mono text-sm">
                     "Craft a compelling personal brand story for [PROFESSIONAL BACKGROUND]. Include: origin story, key challenges overcome, unique skills/perspective, values and mission, notable achievements, and future vision. Make it authentic, memorable, and aligned with career goals."
                   </p>
                 </div>
                 <p className="text-gray-400 text-sm">Tell your story in a way that opens doors.</p>
               </div>

               <div className="bg-gray-800 rounded-lg p-6">
                 <h3 className="text-lg font-semibold text-green-400 mb-3">Media Kit Creation</h3>
                 <div className="bg-gray-700 rounded p-4 mb-3">
                   <p className="text-gray-300 font-mono text-sm">
                     "Create a comprehensive media kit for [PERSONAL BRAND/BUSINESS]. Include: professional bio (short and long versions), high-resolution photos, brand colors and fonts, key statistics and achievements, press coverage, speaking topics, contact information, and brand guidelines. Format for easy sharing with media and partners."
                   </p>
                 </div>
                 <p className="text-gray-400 text-sm">Professional media kit for press and partnerships.</p>
               </div>
             </div>
           </div>


        </div>

        {/* Usage Tips */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use These Prompts</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Choose Your Category</h3>
                <p className="text-gray-300">Select prompts based on your current project or business need.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Customize for Your Brand</h3>
                <p className="text-gray-300">Adapt the prompts with your specific brand voice and requirements.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Generate & Refine</h3>
                <p className="text-gray-300">Use with your favorite AI tool and refine the output as needed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex gap-4 justify-center">
            <Link 
              href="/my-account" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Back to Account
            </Link>
            <Link 
              href="/downloads" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View All Downloads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}