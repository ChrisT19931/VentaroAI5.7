'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Copy, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// 30 Professional AI Prompts for Making Money Online
const AI_PROMPTS = [
  {
    id: 1,
    category: "Business Ideas",
    title: "Business Idea Generator",
    prompt: "Generate 5 unique business ideas for [INDUSTRY] that can be started with less than $1000 and have the potential to generate $10k+ monthly revenue within 12 months. For each idea, provide: 1) Business concept, 2) Target market, 3) Revenue model, 4) Initial steps to get started, 5) Potential challenges and solutions.",
    variables: ["INDUSTRY"],
    use_case: "Entrepreneurship & Startup Ideas"
  },
  {
    id: 2,
    category: "Content Creation",
    title: "Social Media Content Calendar",
    prompt: "Create a 30-day social media content calendar for [BUSINESS_TYPE] targeting [TARGET_AUDIENCE]. Include: 1) Daily post ideas with captions, 2) Hashtag suggestions, 3) Best posting times, 4) Content mix (educational, promotional, entertaining), 5) Engagement strategies for each post type.",
    variables: ["BUSINESS_TYPE", "TARGET_AUDIENCE"],
    use_case: "Social Media Marketing"
  },
  {
    id: 3,
    category: "Sales & Marketing",
    title: "High-Converting Sales Copy",
    prompt: "Write compelling sales copy for [PRODUCT/SERVICE] that addresses the pain points of [TARGET_CUSTOMER]. Structure it as: 1) Attention-grabbing headline, 2) Problem identification, 3) Solution presentation, 4) Benefits and features, 5) Social proof elements, 6) Strong call-to-action with urgency.",
    variables: ["PRODUCT/SERVICE", "TARGET_CUSTOMER"],
    use_case: "Sales Copywriting"
  },
  {
    id: 4,
    category: "Email Marketing",
    title: "Email Sequence Builder",
    prompt: "Create a 7-email welcome sequence for [BUSINESS] targeting new subscribers interested in [TOPIC]. Each email should: 1) Have a compelling subject line, 2) Provide value while building trust, 3) Include a soft sell or call-to-action, 4) Maintain consistent brand voice, 5) Lead to a final conversion goal.",
    variables: ["BUSINESS", "TOPIC"],
    use_case: "Email Marketing Automation"
  },
  {
    id: 5,
    category: "Product Development",
    title: "Digital Product Creator",
    prompt: "Design a comprehensive digital product around [EXPERTISE_AREA] that can be sold for $97-$497. Include: 1) Product concept and positioning, 2) Target audience analysis, 3) Content outline with modules/chapters, 4) Bonus materials to increase value, 5) Launch strategy and pricing justification.",
    variables: ["EXPERTISE_AREA"],
    use_case: "Digital Product Creation"
  },
  {
    id: 6,
    category: "SEO & Content",
    title: "SEO Content Strategy",
    prompt: "Develop an SEO content strategy for [WEBSITE/BUSINESS] in the [NICHE] space. Provide: 1) 20 high-value keyword targets, 2) Content pillars and topic clusters, 3) Content calendar for 3 months, 4) Internal linking strategy, 5) Competitor analysis insights.",
    variables: ["WEBSITE/BUSINESS", "NICHE"],
    use_case: "Search Engine Optimization"
  },
  {
    id: 7,
    category: "Lead Generation",
    title: "Lead Magnet Creator",
    prompt: "Design a high-converting lead magnet for [TARGET_AUDIENCE] in the [INDUSTRY] sector. Include: 1) Lead magnet concept and format, 2) Title and compelling description, 3) Content outline with key value points, 4) Landing page copy structure, 5) Follow-up email sequence strategy.",
    variables: ["TARGET_AUDIENCE", "INDUSTRY"],
    use_case: "Lead Generation & List Building"
  },
  {
    id: 8,
    category: "Course Creation",
    title: "Online Course Outline",
    prompt: "Create a comprehensive online course structure for teaching [SKILL/TOPIC] to [TARGET_STUDENT]. Include: 1) Course title and positioning, 2) Learning objectives and outcomes, 3) Module breakdown with lessons, 4) Practical exercises and assignments, 5) Pricing strategy and launch plan.",
    variables: ["SKILL/TOPIC", "TARGET_STUDENT"],
    use_case: "Online Education & Course Creation"
  },
  {
    id: 9,
    category: "Client Acquisition",
    title: "Cold Outreach Template",
    prompt: "Write a personalized cold outreach sequence for [SERVICE_TYPE] targeting [PROSPECT_TYPE]. Create 3 follow-up emails that: 1) Grab attention with personalized opening, 2) Clearly state value proposition, 3) Include social proof or case studies, 4) Have clear call-to-action, 5) Handle common objections.",
    variables: ["SERVICE_TYPE", "PROSPECT_TYPE"],
    use_case: "Client Acquisition & Sales"
  },
  {
    id: 10,
    category: "Affiliate Marketing",
    title: "Affiliate Product Review",
    prompt: "Write an honest, comprehensive review of [PRODUCT_NAME] for affiliate marketing purposes. Include: 1) Product overview and key features, 2) Honest pros and cons analysis, 3) Personal experience or case study, 4) Comparison with alternatives, 5) Clear recommendation with affiliate disclosure.",
    variables: ["PRODUCT_NAME"],
    use_case: "Affiliate Marketing & Product Reviews"
  },
  {
    id: 11,
    category: "YouTube Marketing",
    title: "YouTube Video Script",
    prompt: "Create a engaging YouTube video script about [TOPIC] for [TARGET_AUDIENCE]. Structure it as: 1) Hook within first 15 seconds, 2) Clear value proposition, 3) Main content with storytelling elements, 4) Call-to-action for engagement, 5) Subscribe and next video teasers.",
    variables: ["TOPIC", "TARGET_AUDIENCE"],
    use_case: "YouTube Content Creation"
  },
  {
    id: 12,
    category: "E-commerce",
    title: "Product Description Writer",
    prompt: "Write compelling product descriptions for [PRODUCT_TYPE] targeting [CUSTOMER_PERSONA]. Include: 1) Attention-grabbing headline, 2) Key features and benefits, 3) Problem-solution narrative, 4) Technical specifications, 5) Trust signals and urgency elements.",
    variables: ["PRODUCT_TYPE", "CUSTOMER_PERSONA"],
    use_case: "E-commerce & Product Marketing"
  },
  {
    id: 13,
    category: "Freelancing",
    title: "Freelance Proposal Template",
    prompt: "Create a winning freelance proposal for [PROJECT_TYPE] work. Include: 1) Personalized greeting and project understanding, 2) Relevant experience and portfolio samples, 3) Clear project approach and timeline, 4) Transparent pricing structure, 5) Next steps and communication plan.",
    variables: ["PROJECT_TYPE"],
    use_case: "Freelancing & Service Business"
  },
  {
    id: 14,
    category: "Webinar Marketing",
    title: "Webinar Sales Script",
    prompt: "Develop a high-converting webinar script for selling [PRODUCT/SERVICE] to [TARGET_AUDIENCE]. Structure it as: 1) Compelling introduction and credibility, 2) Problem agitation and story, 3) Solution presentation with demos, 4) Objection handling, 5) Limited-time offer with urgency.",
    variables: ["PRODUCT/SERVICE", "TARGET_AUDIENCE"],
    use_case: "Webinar Marketing & Sales"
  },
  {
    id: 15,
    category: "Coaching Business",
    title: "Coaching Program Outline",
    prompt: "Design a comprehensive coaching program for [COACHING_NICHE] targeting [CLIENT_TYPE]. Include: 1) Program structure and duration, 2) Session topics and learning outcomes, 3) Tools and resources provided, 4) Pricing tiers and payment options, 5) Client onboarding process.",
    variables: ["COACHING_NICHE", "CLIENT_TYPE"],
    use_case: "Coaching & Consulting Business"
  },
  {
    id: 16,
    category: "Podcast Marketing",
    title: "Podcast Episode Planner",
    prompt: "Plan a compelling podcast episode about [EPISODE_TOPIC] for [LISTENER_PERSONA]. Include: 1) Episode title and description, 2) Detailed outline with talking points, 3) Guest questions (if applicable), 4) Sponsor integration opportunities, 5) Call-to-action and engagement hooks.",
    variables: ["EPISODE_TOPIC", "LISTENER_PERSONA"],
    use_case: "Podcast Content & Marketing"
  },
  {
    id: 17,
    category: "SaaS Marketing",
    title: "SaaS Landing Page Copy",
    prompt: "Write high-converting landing page copy for [SAAS_PRODUCT] targeting [USER_SEGMENT]. Include: 1) Compelling headline and subheading, 2) Problem-solution narrative, 3) Feature benefits and use cases, 4) Social proof and testimonials, 5) Clear pricing and CTA strategy.",
    variables: ["SAAS_PRODUCT", "USER_SEGMENT"],
    use_case: "SaaS Marketing & Conversion"
  },
  {
    id: 18,
    category: "Influencer Marketing",
    title: "Influencer Campaign Strategy",
    prompt: "Develop an influencer marketing campaign for [BRAND/PRODUCT] in the [INDUSTRY] space. Include: 1) Influencer selection criteria and outreach, 2) Campaign objectives and KPIs, 3) Content guidelines and brand messaging, 4) Compensation structure and contracts, 5) Performance tracking and optimization.",
    variables: ["BRAND/PRODUCT", "INDUSTRY"],
    use_case: "Influencer Marketing & Brand Partnerships"
  },
  {
    id: 19,
    category: "Membership Site",
    title: "Membership Site Content Plan",
    prompt: "Create a content strategy for a membership site focused on [EXPERTISE_AREA] for [MEMBER_TYPE]. Include: 1) Membership tiers and pricing, 2) Monthly content calendar, 3) Exclusive resources and tools, 4) Community engagement strategies, 5) Retention and upgrade tactics.",
    variables: ["EXPERTISE_AREA", "MEMBER_TYPE"],
    use_case: "Membership Sites & Recurring Revenue"
  },
  {
    id: 20,
    category: "Local Business",
    title: "Local SEO Strategy",
    prompt: "Develop a local SEO strategy for [BUSINESS_TYPE] in [LOCATION]. Include: 1) Google My Business optimization, 2) Local keyword research and targeting, 3) Citation building and NAP consistency, 4) Review generation and management, 5) Local content marketing plan.",
    variables: ["BUSINESS_TYPE", "LOCATION"],
    use_case: "Local Business Marketing"
  },
  {
    id: 21,
    category: "Dropshipping",
    title: "Dropshipping Product Research",
    prompt: "Analyze the potential of [PRODUCT_CATEGORY] for dropshipping success. Provide: 1) Market demand and competition analysis, 2) Supplier research and evaluation, 3) Profit margin calculations, 4) Marketing strategy recommendations, 5) Risk assessment and mitigation strategies.",
    variables: ["PRODUCT_CATEGORY"],
    use_case: "Dropshipping & E-commerce"
  },
  {
    id: 22,
    category: "Content Marketing",
    title: "Blog Content Series",
    prompt: "Plan a 10-part blog series about [TOPIC] for [TARGET_READER]. Include: 1) Series overview and learning path, 2) Individual post titles and outlines, 3) SEO keyword strategy for each post, 4) Internal linking opportunities, 5) Lead magnets and conversion points.",
    variables: ["TOPIC", "TARGET_READER"],
    use_case: "Content Marketing & Blogging"
  },
  {
    id: 23,
    category: "Amazon FBA",
    title: "Amazon Product Listing",
    prompt: "Optimize an Amazon product listing for [PRODUCT] targeting [CUSTOMER_TYPE]. Include: 1) Keyword-rich title and bullet points, 2) Compelling product description, 3) Backend search terms strategy, 4) Image and video recommendations, 5) PPC campaign structure.",
    variables: ["PRODUCT", "CUSTOMER_TYPE"],
    use_case: "Amazon FBA & Product Optimization"
  },
  {
    id: 24,
    category: "Facebook Ads",
    title: "Facebook Ad Campaign",
    prompt: "Create a Facebook advertising campaign for [PRODUCT/SERVICE] targeting [AUDIENCE_DEMOGRAPHIC]. Include: 1) Campaign objectives and structure, 2) Audience targeting and lookalikes, 3) Ad creative concepts and copy, 4) Budget allocation and bidding strategy, 5) Conversion tracking setup.",
    variables: ["PRODUCT/SERVICE", "AUDIENCE_DEMOGRAPHIC"],
    use_case: "Facebook Advertising & Paid Social"
  },
  {
    id: 25,
    category: "LinkedIn Marketing",
    title: "LinkedIn Content Strategy",
    prompt: "Develop a LinkedIn content strategy for [PROFESSIONAL_ROLE] in [INDUSTRY]. Include: 1) Content pillars and themes, 2) Post types and formats, 3) Networking and engagement tactics, 4) Thought leadership positioning, 5) Lead generation through content.",
    variables: ["PROFESSIONAL_ROLE", "INDUSTRY"],
    use_case: "LinkedIn Marketing & Professional Networking"
  },
  {
    id: 26,
    category: "Print on Demand",
    title: "POD Design Strategy",
    prompt: "Create a print-on-demand business plan for [NICHE_MARKET] targeting [CUSTOMER_PERSONA]. Include: 1) Design concepts and themes, 2) Product selection and pricing, 3) Platform comparison and selection, 4) Marketing and promotion strategies, 5) Scaling and automation tactics.",
    variables: ["NICHE_MARKET", "CUSTOMER_PERSONA"],
    use_case: "Print on Demand & Creative Business"
  },
  {
    id: 27,
    category: "App Marketing",
    title: "Mobile App Launch Plan",
    prompt: "Develop a comprehensive launch strategy for [APP_TYPE] targeting [USER_DEMOGRAPHIC]. Include: 1) Pre-launch marketing timeline, 2) App store optimization (ASO), 3) Influencer and PR outreach, 4) User acquisition campaigns, 5) Post-launch growth strategies.",
    variables: ["APP_TYPE", "USER_DEMOGRAPHIC"],
    use_case: "Mobile App Marketing & Launch"
  },
  {
    id: 28,
    category: "Cryptocurrency",
    title: "Crypto Content Strategy",
    prompt: "Create educational content about [CRYPTO_TOPIC] for [AUDIENCE_LEVEL]. Include: 1) Content structure from basics to advanced, 2) Risk disclaimers and compliance, 3) Visual aids and examples, 4) Community engagement strategies, 5) Monetization through education.",
    variables: ["CRYPTO_TOPIC", "AUDIENCE_LEVEL"],
    use_case: "Cryptocurrency Education & Content"
  },
  {
    id: 29,
    category: "Real Estate",
    title: "Real Estate Marketing Plan",
    prompt: "Develop a digital marketing strategy for [PROPERTY_TYPE] real estate in [MARKET_AREA]. Include: 1) Target buyer persona analysis, 2) Multi-channel marketing approach, 3) Virtual tour and content strategy, 4) Lead nurturing sequences, 5) Market positioning and pricing strategy.",
    variables: ["PROPERTY_TYPE", "MARKET_AREA"],
    use_case: "Real Estate Marketing & Sales"
  },
  {
    id: 30,
    category: "Consulting",
    title: "Consulting Business Model",
    prompt: "Design a profitable consulting business around [EXPERTISE_AREA] for [TARGET_CLIENT]. Include: 1) Service packaging and pricing, 2) Client acquisition strategies, 3) Delivery methodology and processes, 4) Scaling through digital products, 5) Authority building and thought leadership.",
    variables: ["EXPERTISE_AREA", "TARGET_CLIENT"],
    use_case: "Consulting & Expert Services"
  }
];

export default function AIPromptsArsenalContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/signin?callbackUrl=/content/ai-prompts-arsenal');
        return;
      }

      if (!session?.user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        if (session.user.roles?.includes('admin') || session.user.email === 'chris.t@ventarosales.com') {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has purchased the product
        const userProducts = session.user.entitlements || [];
        const hasProduct = userProducts.includes('ai-prompts-arsenal-2025') || 
                          userProducts.includes('prompts') ||
                          userProducts.includes('arsenal');

        setHasAccess(hasProduct);
        
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [session, status, router]);

  const copyToClipboard = async (text: string, promptId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
            <p className="text-gray-300 mb-8">
              This content is only available to users who have purchased the AI Prompts Arsenal.
            </p>
            <div className="space-y-4">
              <Link 
                href="/products"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Purchase AI Prompts Arsenal
              </Link>
              <div>
                <Link 
                  href="/my-account"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Back to My Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/my-account"
            className="text-blue-400 hover:text-blue-300 transition-colors mb-4 inline-block"
          >
            ← Back to My Account
          </Link>
          <h1 className="text-4xl font-bold mb-2">AI Prompts Arsenal 2025</h1>
          <p className="text-gray-300 mb-4">30 Professional Money-Making AI Prompts</p>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-blue-200 text-sm">
              💡 <strong>How to use:</strong> Copy any prompt below, replace the [VARIABLES] with your specific details, and paste into ChatGPT, Claude, or any AI tool.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {AI_PROMPTS.map((prompt) => (
            <div key={prompt.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {prompt.category}
                  </span>
                  <h3 className="text-xl font-semibold">{prompt.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{prompt.use_case}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {copiedPrompt === prompt.id ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Prompt:</h4>
                <p className="text-gray-100 leading-relaxed">{prompt.prompt}</p>
              </div>
              
              {prompt.variables && prompt.variables.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Variables to customize:</h4>
                  <div className="flex flex-wrap gap-2">
                    {prompt.variables.map((variable: string, index: number) => (
                      <span key={index} className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-sm">
                        [{variable}]
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-900/30 border border-green-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-3">🚀 Start Making Money Today!</h3>
          <p className="text-green-200 mb-4">
            You now have access to 30 professional AI prompts designed to help you generate income online. 
            Each prompt is crafted to save you hours of work and deliver professional results.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-300 mb-2">💰 Revenue Opportunities:</h4>
              <ul className="text-green-200 space-y-1">
                <li>• Create and sell digital products</li>
                <li>• Launch profitable marketing campaigns</li>
                <li>• Build automated sales funnels</li>
                <li>• Generate high-converting content</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-300 mb-2">⚡ Quick Start Tips:</h4>
              <ul className="text-green-200 space-y-1">
                <li>• Start with Business Ideas prompts</li>
                <li>• Use Sales & Marketing for quick wins</li>
                <li>• Combine multiple prompts for best results</li>
                <li>• Customize variables for your niche</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 