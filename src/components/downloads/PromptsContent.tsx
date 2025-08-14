'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Download, DollarSign, Target, Zap, ChevronDown, ChevronRight } from 'lucide-react';

// EXACTLY 30 AI Prompts Arsenal - BIG MONEY Online Business Blueprint Prompts
const AI_PROMPTS_ARSENAL = [
  // Online Business Empire Builders (Prompts 1-10)
  {
    id: 1,
    title: "Million-Dollar Business Idea Transformer",
    category: "Business Empire Building",
    prompt: "I have this business idea: [YOUR BUSINESS IDEA]. Transform this into a complete million-dollar online business blueprint. Provide: 1) 5 different ways to monetize this idea online with specific revenue models ($10K-100K+ monthly potential), 2) Complete tech stack needed (platforms, tools, automation), 3) Customer acquisition system for 1000+ customers in 90 days, 4) Pricing strategy for maximum profit margins, 5) Content creation system to establish authority, 6) Partnership opportunities for explosive growth, 7) Step-by-step 12-month roadmap to $1M+ revenue. Make it specific to online implementation with exact action steps.",
    revenue: "$100K-1M+ annually per idea",
    useCase: "Transform any idea into a profitable online empire"
  },
  {
    id: 2,
    title: "E-Commerce Empire Generator",
    category: "Business Empire Building",
    prompt: "I want to create an e-commerce business around [PRODUCT NICHE/IDEA]. Build me a complete online empire strategy: 1) Product selection and sourcing strategy (dropshipping, private label, or manufacturing), 2) Store setup on best platform with conversion optimization, 3) Traffic generation system (paid ads, SEO, influencer marketing), 4) Customer retention and lifetime value maximization, 5) Inventory management and fulfillment automation, 6) International expansion plan, 7) Exit strategy for maximum valuation. Include specific tools, budgets, and timelines for $500K+ annual revenue.",
    revenue: "$500K-5M+ annually",
    useCase: "Build a scalable e-commerce empire from any product idea"
  },
  {
    id: 3,
    title: "Digital Product Cash Machine",
    category: "Business Empire Building", 
    prompt: "Turn my expertise in [YOUR SKILL/KNOWLEDGE AREA] into a digital product empire. Create: 1) 5 different digital products (courses, templates, software, memberships) with pricing tiers, 2) Automated sales funnel system for 24/7 revenue, 3) Content marketing strategy to build massive audience, 4) Launch sequence for maximum sales impact, 5) Affiliate program to scale through others, 6) Customer success system for retention and upsells, 7) Business model for $50K+ monthly recurring revenue. Include specific platforms, tools, and marketing strategies.",
    revenue: "$50K-500K+ monthly recurring",
    useCase: "Monetize your knowledge into automated income streams"
  },
  {
    id: 4,
    title: "Service Business Online Multiplier",
    category: "Business Empire Building",
    prompt: "I provide [SERVICE TYPE] and want to scale it into a massive online business. Design: 1) Service packaging into high-value offers ($5K-50K packages), 2) Online delivery system and client portal, 3) Team hiring and training system for delegation, 4) Lead generation system for 100+ qualified leads monthly, 5) Sales process and closing system, 6) Client success and retention programs, 7) Franchise or licensing model for expansion. Focus on systems that work without your direct involvement for $2M+ annual potential.",
    revenue: "$2M+ annually through systematization",
    useCase: "Scale service businesses into automated online empires"
  },
  {
    id: 5,
    title: "Subscription Empire Builder",
    category: "Business Empire Building",
    prompt: "Build a subscription business around [SUBSCRIPTION IDEA/NICHE]. Create complete blueprint: 1) Subscription model design with multiple tiers ($29-299/month), 2) Content creation and delivery system, 3) Member acquisition funnel and onboarding, 4) Retention strategies and churn reduction, 5) Community building and engagement system, 6) Upsell and cross-sell opportunities, 7) Scale plan to 10,000+ subscribers. Include technology stack, content calendar, and growth hacking strategies for $3M+ ARR potential.",
    revenue: "$3M+ annual recurring revenue",
    useCase: "Create predictable recurring revenue from any expertise"
  },
  {
    id: 6,
    title: "Affiliate Marketing Empire",
    category: "Business Empire Building",
    prompt: "Create an affiliate marketing empire in [NICHE] that generates $100K+ monthly. Build: 1) Authority website and content strategy, 2) Product selection and commission optimization, 3) Traffic generation system (SEO, paid ads, social media), 4) Email list building and nurturing system, 5) Conversion optimization and split testing, 6) Scaling strategy across multiple niches, 7) Team building for content and promotion. Include specific tools, budgets, and 12-month growth plan.",
    revenue: "$100K+ monthly in commissions",
    useCase: "Build massive affiliate income without creating products"
  },
  {
    id: 7,
    title: "Online Marketplace Creator",
    category: "Business Empire Building",
    prompt: "Launch an online marketplace connecting [BUYER TYPE] with [SELLER TYPE] in [INDUSTRY]. Design: 1) Platform architecture and user experience, 2) Revenue model (commissions, fees, subscriptions), 3) Seller recruitment and onboarding system, 4) Buyer acquisition and retention strategy, 5) Trust and safety systems, 6) Marketing and growth hacking plan, 7) Expansion strategy and competitive moats. Focus on creating a $100M+ valuation business with network effects.",
    revenue: "$100M+ valuation potential",
    useCase: "Create the next Uber/Airbnb in any industry"
  },
  {
    id: 8,
    title: "SaaS Business Blueprint",
    category: "Business Empire Building",
    prompt: "Build a SaaS business solving [PROBLEM] for [TARGET CUSTOMER]. Create: 1) Feature roadmap and MVP development plan, 2) Pricing strategy and customer acquisition cost analysis, 3) Sales and marketing funnel for B2B customers, 4) Customer success and retention system, 5) Product development and iteration process, 6) Team building and funding strategy, 7) Scale plan to $10M ARR. Include technical requirements, go-to-market strategy, and competitive analysis.",
    revenue: "$10M+ annual recurring revenue",
    useCase: "Build scalable software that solves real business problems"
  },
  {
    id: 9,
    title: "Content Creator Monetization Machine",
    category: "Business Empire Building",
    prompt: "Turn content creation in [NICHE] into a $500K+ annual business. Build: 1) Multi-platform content strategy (YouTube, TikTok, Instagram, LinkedIn), 2) Audience building system for 100K+ followers, 3) Multiple monetization streams (sponsorships, products, services, affiliates), 4) Content production and posting automation, 5) Brand partnerships and collaboration strategy, 6) Product creation and sales funnels, 7) Team building for content scaling. Include specific content types, posting schedules, and monetization timelines.",
    revenue: "$500K+ annually from content",
    useCase: "Build a media empire around your expertise or passion"
  },
  {
    id: 10,
    title: "Local Business Online Dominator",
    category: "Business Empire Building",
    prompt: "Take [LOCAL BUSINESS IDEA] and create an online empire that dominates multiple markets. Design: 1) Online service delivery system, 2) Local SEO and Google Ads mastery plan, 3) Multi-location expansion strategy, 4) Team hiring and management system, 5) Customer acquisition automation, 6) Service standardization and quality control, 7) Franchise or licensing model for rapid expansion. Focus on creating $10M+ revenue across multiple markets.",
    revenue: "$10M+ through market domination",
    useCase: "Scale local businesses into national online empires"
  },

  // High-Ticket Online Systems (Prompts 11-20)
  {
    id: 11,
    title: "High-Ticket Coaching Empire",
    category: "High-Ticket Systems",
    prompt: "Build a high-ticket coaching business around [YOUR EXPERTISE] selling $10K-100K programs. Create: 1) Signature methodology and program structure, 2) Authority building and thought leadership strategy, 3) High-ticket sales funnel and webinar system, 4) Client acquisition through speaking and partnerships, 5) Delivery system and client success process, 6) Team building for program delivery, 7) Scale plan to $5M+ annually. Include specific positioning, pricing, and sales strategies.",
    revenue: "$5M+ annually in coaching",
    useCase: "Create premium coaching programs that transform lives and bank accounts"
  },
  {
    id: 12,
    title: "Done-For-You Service Empire",
    category: "High-Ticket Systems",
    prompt: "Create a done-for-you service business in [SERVICE AREA] with $25K+ packages. Build: 1) Service packaging and delivery methodology, 2) Client acquisition system for enterprise customers, 3) Team building and project management system, 4) Quality control and client success processes, 5) Pricing strategy and contract negotiation, 6) Referral and partnership programs, 7) Scale plan to $10M+ revenue. Focus on high-value services that command premium pricing.",
    revenue: "$10M+ in service revenue",
    useCase: "Build premium service businesses that clients happily pay big money for"
  },
  {
    id: 13,
    title: "Online Event & Masterclass Empire",
    category: "High-Ticket Systems",
    prompt: "Create an online events business around [TOPIC/INDUSTRY] with $5K+ ticket prices. Design: 1) Event format and content strategy, 2) Speaker recruitment and partnership system, 3) Marketing and promotion plan for sold-out events, 4) High-ticket backend offers and upsells, 5) Virtual event technology and experience design, 6) Attendee success and networking facilitation, 7) Scale plan for multiple events and recurring revenue. Include sponsorship opportunities and premium tiers.",
    revenue: "$2M+ per event series",
    useCase: "Create exclusive high-value events that position you as an industry leader"
  },
  {
    id: 14,
    title: "Mastermind & Community Empire",
    category: "High-Ticket Systems", 
    prompt: "Launch a high-ticket mastermind in [NICHE] charging $15K-50K annually. Build: 1) Mastermind structure and curriculum design, 2) Member selection and application process, 3) Exclusive community and networking system, 4) Expert facilitation and guest speaker program, 5) Member success tracking and accountability, 6) Retreat and event planning, 7) Scale plan for multiple mastermind levels. Focus on creating transformational experiences that justify premium pricing.",
    revenue: "$3M+ in mastermind revenue",
    useCase: "Create exclusive communities where successful people pay premium to belong"
  },
  {
    id: 15,
    title: "Certification & Licensing Empire",
    category: "High-Ticket Systems",
    prompt: "Create a certification program in [FIELD] that others pay $10K+ to become licensed in. Design: 1) Certification curriculum and competency framework, 2) Training delivery system and materials, 3) Licensing and ongoing support model, 4) Quality control and accreditation process, 5) Marketing to potential licensees, 6) Revenue sharing and territory management, 7) Scale plan for global expansion. Include legal framework and intellectual property protection.",
    revenue: "$5M+ in licensing revenue",
    useCase: "Create systems others pay to learn and license from you"
  },
  {
    id: 16,
    title: "Premium Membership Site Empire",
    category: "High-Ticket Systems",
    prompt: "Build a premium membership site in [NICHE] charging $297-997/month. Create: 1) Membership tier structure and exclusive content, 2) Member acquisition funnel and retention strategy, 3) Community building and engagement system, 4) Expert interviews and exclusive access programs, 5) Tools, templates, and implementation resources, 6) Live coaching and Q&A sessions, 7) Scale plan to 1000+ premium members. Focus on delivering 10x value for premium pricing.",
    revenue: "$3M+ annual membership revenue",
    useCase: "Create exclusive membership experiences that members can't live without"
  },
  {
    id: 17,
    title: "High-Ticket Consulting Firm",
    category: "High-Ticket Systems",
    prompt: "Scale consulting in [SPECIALTY] into a firm billing $50K+ projects. Build: 1) Service methodology and intellectual property, 2) Enterprise client acquisition system, 3) Consultant hiring and training program, 4) Project management and delivery systems, 5) Pricing and proposal strategies, 6) Client success and case study development, 7) Scale plan to $20M+ revenue. Include partnership strategies and thought leadership positioning.",
    revenue: "$20M+ consulting revenue",
    useCase: "Build consulting firms that solve big problems for big money"
  },
  {
    id: 18,
    title: "Online Training Academy Empire",
    category: "High-Ticket Systems",
    prompt: "Create an online training academy in [INDUSTRY] with $5K-25K programs. Design: 1) Comprehensive curriculum and learning paths, 2) Instructor recruitment and training system, 3) Student acquisition and success tracking, 4) Certification and job placement programs, 5) Corporate training and B2B sales, 6) Technology platform and learning management, 7) Scale plan for multiple specialties. Focus on career transformation outcomes that justify premium pricing.",
    revenue: "$10M+ in training revenue",
    useCase: "Create educational programs that transform careers and command premium prices"
  },
  {
    id: 19,
    title: "Investment & Financial Services Empire",
    category: "High-Ticket Systems",
    prompt: "Build an online investment advisory business in [INVESTMENT NICHE] with $10K+ minimums. Create: 1) Investment methodology and track record development, 2) Client acquisition for high-net-worth individuals, 3) Portfolio management and reporting systems, 4) Compliance and regulatory framework, 5) Educational content and thought leadership, 6) Fee structure and wealth management services, 7) Scale plan to $100M+ assets under management. Include technology stack and team building.",
    revenue: "$5M+ in management fees",
    useCase: "Build wealth management businesses that grow with client success"
  },
  {
    id: 20,
    title: "Luxury Experience & Retreat Empire",
    category: "High-Ticket Systems",
    prompt: "Create luxury experiences and retreats in [NICHE] charging $10K-50K per person. Build: 1) Signature experience design and curriculum, 2) Venue selection and partnership strategy, 3) High-net-worth client acquisition, 4) Premium service delivery and logistics, 5) Transformation outcomes and success tracking, 6) Referral and repeat business systems, 7) Scale plan for multiple locations and experiences. Focus on creating life-changing experiences that justify luxury pricing.",
    revenue: "$5M+ in experience revenue",
    useCase: "Create transformational luxury experiences that wealthy people pay premium for"
  },

  // Digital Asset & Investment Systems (Prompts 21-30)
  {
    id: 21,
    title: "Digital Real Estate Empire",
    category: "Digital Assets",
    prompt: "Build a digital real estate portfolio of websites generating $100K+ monthly. Create: 1) Website acquisition and valuation criteria, 2) Traffic and revenue optimization strategies, 3) Content creation and SEO systems, 4) Monetization optimization (ads, affiliates, products), 5) Team building for content and management, 6) Portfolio diversification and risk management, 7) Exit strategies for maximum returns. Include specific niches, tools, and scaling methods.",
    revenue: "$100K+ monthly passive income",
    useCase: "Build portfolios of income-generating websites like real estate"
  },
  {
    id: 22,
    title: "App & Software Portfolio Empire",
    category: "Digital Assets",
    prompt: "Create a portfolio of mobile apps and software tools generating $200K+ monthly. Build: 1) App idea validation and market research system, 2) Development team and project management, 3) App store optimization and user acquisition, 4) Monetization strategies (freemium, subscriptions, ads), 5) User retention and lifetime value optimization, 6) Portfolio expansion and diversification, 7) Exit strategies and acquisition opportunities. Focus on solving real problems with scalable solutions.",
    revenue: "$200K+ monthly app revenue",
    useCase: "Build software portfolios that generate recurring revenue streams"
  },
  {
    id: 23,
    title: "YouTube Channel Network Empire",
    category: "Digital Assets",
    prompt: "Build a network of YouTube channels in [NICHE] generating $500K+ annually. Create: 1) Channel topic research and content strategy, 2) Content creation team and workflow systems, 3) YouTube SEO and algorithm optimization, 4) Monetization through ads, sponsorships, and products, 5) Audience building and engagement strategies, 6) Multi-channel network expansion, 7) Brand partnerships and licensing deals. Include automation tools and scaling methods.",
    revenue: "$500K+ annual YouTube income",
    useCase: "Create media empires across multiple profitable YouTube channels"
  },
  {
    id: 24,
    title: "E-Book & Publishing Empire",
    category: "Digital Assets",
    prompt: "Build a publishing empire with e-books and digital publications generating $300K+ annually. Design: 1) Market research and profitable niche identification, 2) Content creation and ghostwriting systems, 3) Publishing platform optimization (Amazon, etc.), 4) Marketing and promotional strategies, 5) Series development and reader retention, 6) International market expansion, 7) Licensing and adaptation opportunities. Include automation tools and team building strategies.",
    revenue: "$300K+ annual publishing income",
    useCase: "Create publishing businesses that generate royalties while you sleep"
  },
  {
    id: 25,
    title: "Stock Photography & Digital Assets Empire",
    category: "Digital Assets",
    prompt: "Build a digital assets business selling stock photos, videos, and graphics for $200K+ annually. Create: 1) Content creation and curation strategy, 2) Multiple platform distribution system, 3) SEO and discoverability optimization, 4) Licensing and pricing strategies, 5) Creator network and partnership program, 6) Automated upload and management systems, 7) Premium collection and exclusive licensing. Focus on high-demand niches and trending content.",
    revenue: "$200K+ annual licensing income",
    useCase: "Create digital asset portfolios that generate ongoing royalties"
  },
  {
    id: 26,
    title: "Online Course Platform Empire",
    category: "Digital Assets",
    prompt: "Build an online course platform hosting other creators' courses, taking 20-50% revenue share. Design: 1) Platform development and user experience, 2) Creator recruitment and onboarding system, 3) Student acquisition and retention strategies, 4) Course quality control and curation, 5) Marketing and promotional tools for creators, 6) Payment processing and revenue sharing, 7) Scale plan to 10,000+ courses. Focus on becoming the go-to platform in specific niches.",
    revenue: "$10M+ platform revenue",
    useCase: "Create platforms that profit from other people's expertise"
  },
  {
    id: 27,
    title: "Dropshipping Automation Empire",
    category: "Digital Assets",
    prompt: "Build automated dropshipping stores generating $500K+ annually with minimal daily involvement. Create: 1) Product research and supplier vetting system, 2) Store setup and conversion optimization, 3) Advertising automation and scaling strategies, 4) Customer service and fulfillment automation, 5) Inventory management and supplier relationships, 6) Multi-store expansion and diversification, 7) Exit strategies and business sale preparation. Include tools, team building, and hands-off management.",
    revenue: "$500K+ annual dropshipping income",
    useCase: "Create automated e-commerce businesses that run themselves"
  },
  {
    id: 28,
    title: "Affiliate Website Network Empire",
    category: "Digital Assets",
    prompt: "Build a network of affiliate websites generating $300K+ monthly in commissions. Design: 1) Niche research and competition analysis, 2) Content creation and SEO strategies, 3) Affiliate program selection and optimization, 4) Traffic generation and conversion optimization, 5) Website portfolio management and automation, 6) Team building for content and maintenance, 7) Scaling strategies and exit planning. Focus on evergreen niches with high commission potential.",
    revenue: "$300K+ monthly affiliate income",
    useCase: "Create affiliate empires that generate massive commissions"
  },
  {
    id: 29,
    title: "Digital Product Marketplace Empire",
    category: "Digital Assets",
    prompt: "Create a marketplace for digital products (templates, tools, courses) taking 30% commission. Build: 1) Platform architecture and seller onboarding, 2) Product curation and quality standards, 3) Buyer acquisition and retention system, 4) Search and discovery optimization, 5) Payment processing and seller payouts, 6) Marketing tools and promotional features, 7) Scale plan to $100M GMV. Focus on underserved creator niches with high demand.",
    revenue: "$30M+ annual commission revenue",
    useCase: "Build marketplaces that profit from digital product transactions"
  },
  {
    id: 30,
    title: "Investment & Trading System Empire",
    category: "Digital Assets",
    prompt: "Create investment and trading education business with $50K+ programs and managed accounts. Build: 1) Proven trading methodology and track record, 2) Educational program development and delivery, 3) High-ticket client acquisition system, 4) Managed account services and fee structure, 5) Community building and ongoing support, 6) Compliance and regulatory requirements, 7) Scale plan to $20M+ AUM. Include risk management and performance tracking systems.",
    revenue: "$20M+ assets under management",
    useCase: "Build investment education and management businesses for serious wealth creation"
  }
];

// Props interface for the component
interface PromptsContentProps {
  hasAccess: boolean;
  isAdmin: boolean;
}

export default function PromptsContent({ hasAccess, isAdmin }: PromptsContentProps) {
  const { data: session } = useSession();
  const [expandedPrompts, setExpandedPrompts] = useState<Set<number>>(new Set());
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  const togglePrompt = (promptId: number) => {
    const newExpanded = new Set(expandedPrompts);
    if (newExpanded.has(promptId)) {
      newExpanded.delete(promptId);
    } else {
      newExpanded.add(promptId);
    }
    setExpandedPrompts(newExpanded);
  };

  const copyPrompt = async (prompt: string, promptId: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(promptId);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const categories = Array.from(new Set(AI_PROMPTS_ARSENAL.map(prompt => prompt.category)));

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Required</h1>
          <p className="text-gray-300 mb-8">Please sign in to access the AI Prompts Arsenal.</p>
          <div className="space-x-4">
            <Link 
              href="/signin" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Required</h1>
          <p className="text-gray-300 mb-8">You need to purchase the AI Prompts Arsenal to access this content.</p>
          <div className="space-x-4">
            <Link 
              href="/products" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View Products
            </Link>
            <Link 
              href="/my-account" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              💰 30x AI Prompts Arsenal
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Transform ANY business idea into a million-dollar online empire with these BIG MONEY prompts
            </p>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 mb-8 border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 How These Prompts Work</h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Feed ChatGPT your business idea + these prompts = Complete blueprint to build a profitable online empire. 
                Each prompt is designed to extract maximum value and create actionable strategies for BIG MONEY online businesses.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-12 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">💎 What's Included</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">BIG MONEY Business Blueprints</h4>
                    <p className="text-gray-300 text-sm">Turn any idea into $100K-$1M+ online businesses with complete implementation strategies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">High-Ticket System Builders</h4>
                    <p className="text-gray-300 text-sm">Create premium offers, coaching programs, and services that command $10K-$100K+ prices</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Digital Asset Empires</h4>
                    <p className="text-gray-300 text-sm">Build portfolios of income-generating digital assets for massive passive income</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Download className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Copy-Paste Ready Prompts</h4>
                    <p className="text-gray-300 text-sm">Just insert your business idea and get complete online empire strategies instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perfect For */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 mb-12 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">🎯 Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-white font-bold mb-2">Ambitious Entrepreneurs</h4>
                <p className="text-gray-300 text-sm">Who want to build million-dollar online empires from any business idea</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="text-white font-bold mb-2">High-Ticket Creators</h4>
                <p className="text-gray-300 text-sm">Who want to command premium prices for their expertise and services</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h4 className="text-white font-bold mb-2">Digital Asset Builders</h4>
                <p className="text-gray-300 text-sm">Who want to create passive income through digital properties and investments</p>
              </div>
            </div>
          </div>

          {/* Prompts by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
                {category} ({AI_PROMPTS_ARSENAL.filter(p => p.category === category).length} Prompts)
              </h2>
              
              <div className="space-y-4">
                {AI_PROMPTS_ARSENAL.filter(prompt => prompt.category === category).map((prompt) => (
                  <div key={prompt.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => togglePrompt(prompt.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                              #{prompt.id}
                            </span>
                            <h3 className="text-lg font-bold text-white">{prompt.title}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-green-400 font-semibold">💰 {prompt.revenue}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-blue-400">{prompt.useCase}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {expandedPrompts.has(prompt.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {expandedPrompts.has(prompt.id) && (
                      <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2">🎯 Complete Prompt:</h4>
                          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-300 leading-relaxed">
                            {prompt.prompt}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            <strong className="text-green-400">Revenue Potential:</strong> {prompt.revenue}
                          </div>
                          <button
                            onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              copiedPrompt === prompt.id
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {copiedPrompt === prompt.id ? '✅ Copied!' : '📋 Copy Prompt'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Call to Action */}
          <div className="text-center mt-16 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-8 border border-green-500/30">
            <h2 className="text-3xl font-bold text-white mb-4">🚀 Ready to Build Your Online Empire?</h2>
            <p className="text-xl text-gray-300 mb-6">
              Use these prompts with ChatGPT to transform any business idea into a million-dollar online business blueprint
            </p>
            <div className="text-sm text-gray-400">
              <p>💡 Pro Tip: Replace [YOUR BUSINESS IDEA] with your actual idea and watch ChatGPT create your complete business plan</p>
            </div>
          </div>

          {/* Back to My Account */}
          <div className="text-center mt-8">
            <Link href="/my-account" className="text-gray-400 hover:text-gray-300 transition-colors">
              ← Back to My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}