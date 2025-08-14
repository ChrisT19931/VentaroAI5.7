'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Download, DollarSign, Target, Zap, ChevronDown, ChevronRight } from 'lucide-react';

// Business-focused AI prompts for online business building
const BUSINESS_PROMPTS = [
  {
    category: "Business Model & Strategy",
    icon: "💰",
    description: "Prompts to develop profitable business models and strategies",
    prompts: [
      {
        title: "Complete Business Model Generator",
        prompt: "I want to start a [BUSINESS TYPE] targeting [TARGET AUDIENCE]. Create a comprehensive business model including: 1) Revenue streams and pricing strategy, 2) Customer acquisition channels, 3) Key partnerships and resources needed, 4) Cost structure and break-even analysis, 5) Competitive advantages and differentiation, 6) 90-day launch plan with specific milestones, 7) Potential monthly revenue projections for months 1-12. Make it actionable and specific to my industry.",
        useCase: "Develop complete business strategies for any industry",
        revenue: "$2000-5000/month consulting"
      },
      {
        title: "Market Opportunity Analyzer",
        prompt: "Analyze the market opportunity for [PRODUCT/SERVICE] in [LOCATION/INDUSTRY]. Provide: 1) Market size and growth trends, 2) Target customer segments and their pain points, 3) Competitive landscape and gaps, 4) Entry barriers and required resources, 5) Pricing strategies used by competitors, 6) Customer acquisition cost estimates, 7) Revenue potential and timeline to profitability. Include specific data points and actionable insights.",
        useCase: "Market research for new business opportunities",
        revenue: "$500-1500 per analysis"
      },
      {
        title: "Competitor Intelligence Report",
        prompt: "Create a detailed competitor analysis for [YOUR BUSINESS] against [COMPETITOR 1], [COMPETITOR 2], [COMPETITOR 3]. Include: 1) Their business models and revenue streams, 2) Pricing strategies and value propositions, 3) Marketing channels and messaging, 4) Strengths, weaknesses, and vulnerabilities, 5) Customer reviews and pain points, 6) Opportunities to differentiate and compete, 7) Recommended strategies to capture market share. Make it actionable for immediate implementation.",
        useCase: "Competitive intelligence for business strategy",
        revenue: "$800-2000 per report"
      }
    ]
  },
  {
    category: "Sales & Lead Generation",
    icon: "📈",
    description: "High-converting sales systems and lead generation strategies",
    prompts: [
      {
        title: "High-Converting Sales Funnel Builder",
        prompt: "Design a complete sales funnel for [PRODUCT/SERVICE] targeting [AUDIENCE]. Create: 1) Lead magnet ideas with titles and descriptions, 2) Landing page copy with headlines and CTAs, 3) Email sequence (7 emails) with subject lines and content, 4) Sales page structure with objection handling, 5) Upsell and cross-sell opportunities, 6) Follow-up sequences for non-buyers, 7) Metrics to track and optimize. Focus on psychology-driven copy that converts.",
        useCase: "Build complete sales funnels for any business",
        revenue: "$1500-4000 per funnel"
      },
      {
        title: "Cold Outreach Campaign Generator",
        prompt: "Create a cold outreach campaign for [YOUR SERVICE] targeting [TARGET AUDIENCE]. Develop: 1) Prospect research criteria and sources, 2) Initial contact messages (email and LinkedIn), 3) Follow-up sequence (5 touches) with different angles, 4) Value-first approach with free resources, 5) Meeting booking scripts and objection handling, 6) CRM tracking system and metrics, 7) Scaling strategies for volume outreach. Make messages personal and value-driven.",
        useCase: "Generate qualified leads through cold outreach",
        revenue: "$3000-8000/month with systematic outreach"
      },
      {
        title: "Referral System Designer",
        prompt: "Design a referral program for [BUSINESS TYPE] that generates consistent new customers. Create: 1) Referral incentive structure (for referrer and referee), 2) Program rules and qualification criteria, 3) Marketing materials and referral request scripts, 4) Tracking system and reward fulfillment process, 5) Launch strategy and promotion plan, 6) Partner referral opportunities, 7) Metrics to measure program success. Focus on systems that create viral growth.",
        useCase: "Build referral programs that generate passive leads",
        revenue: "20-40% increase in customer acquisition"
      }
    ]
  },
  {
    category: "Product Development & Pricing",
    icon: "🏗️",
    description: "Create and price products that customers actually want to buy",
    prompts: [
      {
        title: "Product-Market Fit Validator",
        prompt: "Help me validate product-market fit for [PRODUCT IDEA] targeting [CUSTOMER SEGMENT]. Create: 1) Customer interview questions to uncover real pain points, 2) MVP feature list prioritized by customer value, 3) Pricing experiment framework with different tiers, 4) Beta testing program structure and metrics, 5) Customer feedback collection and analysis system, 6) Pivot criteria and alternative directions, 7) Go-to-market strategy once validated. Focus on proving demand before building.",
        useCase: "Validate business ideas before investing time/money",
        revenue: "Prevents failed launches, ensures profitable products"
      },
      {
        title: "Premium Pricing Strategy Generator",
        prompt: "Develop a premium pricing strategy for [PRODUCT/SERVICE] in [INDUSTRY]. Create: 1) Value-based pricing model with justification, 2) Premium positioning and messaging, 3) Service/product differentiation from competitors, 4) Premium customer profile and targeting, 5) Objection handling for price concerns, 6) Payment options and terms, 7) Upsell opportunities to increase average order value. Focus on maximizing profit margins while maintaining demand.",
        useCase: "Price products for maximum profitability",
        revenue: "30-100% increase in profit margins"
      },
      {
        title: "Digital Product Creator",
        prompt: "Design a digital product for [NICHE] that solves [SPECIFIC PROBLEM]. Develop: 1) Product concept and unique value proposition, 2) Content outline and delivery format, 3) Pricing strategy and sales funnel, 4) Marketing launch plan and channels, 5) Customer onboarding and success system, 6) Feedback collection and iteration process, 7) Scaling opportunities and product line extensions. Create something people will pay premium prices for.",
        useCase: "Create high-margin digital products and courses",
        revenue: "$5000-20000/month with successful digital products"
      }
    ]
  },
  {
    category: "Marketing & Customer Acquisition",
    icon: "🎯",
    description: "Marketing systems that attract and convert ideal customers",
    prompts: [
      {
        title: "Customer Avatar & Journey Mapper",
        prompt: "Create a detailed customer avatar and journey map for [BUSINESS]. Develop: 1) Demographics, psychographics, and behavioral patterns, 2) Pain points, desires, and motivations, 3) Current solutions they're using and why they're inadequate, 4) Customer journey from awareness to purchase to advocacy, 5) Touchpoints and decision-making criteria at each stage, 6) Messaging and content strategy for each stage, 7) Conversion optimization opportunities. Make it specific enough to guide all marketing decisions.",
        useCase: "Create laser-focused marketing that resonates",
        revenue: "2-5x improvement in conversion rates"
      },
      {
        title: "Content Marketing System Builder",
        prompt: "Design a content marketing system for [BUSINESS] that generates qualified leads. Create: 1) Content pillars aligned with customer journey, 2) Content calendar with topics, formats, and distribution schedule, 3) SEO keyword strategy for organic traffic, 4) Lead magnets and content upgrades, 5) Email nurture sequences for content subscribers, 6) Social media amplification strategy, 7) Content repurposing system for maximum reach. Focus on content that drives business results, not just engagement.",
        useCase: "Build authority and generate leads through content",
        revenue: "$2000-8000/month through content-driven leads"
      },
      {
        title: "Local Business Domination Plan",
        prompt: "Create a local market domination strategy for [LOCAL BUSINESS TYPE] in [CITY]. Develop: 1) Local SEO optimization plan for Google My Business and local search, 2) Community partnership and networking strategy, 3) Local advertising channels and budget allocation, 4) Customer retention and loyalty programs, 5) Referral systems leveraging local relationships, 6) Event marketing and community involvement, 7) Online reputation management system. Focus on becoming the go-to business in your area.",
        useCase: "Dominate local markets for service businesses",
        revenue: "50-200% increase in local market share"
      }
    ]
  },
  {
    category: "Operations & Scaling",
    icon: "⚡",
    description: "Systems and processes to scale your business efficiently",
    prompts: [
      {
        title: "Business Process Optimizer",
        prompt: "Optimize the operations of [BUSINESS TYPE] to increase efficiency and profitability. Analyze: 1) Current workflow bottlenecks and inefficiencies, 2) Automation opportunities using available tools, 3) Standard operating procedures for key processes, 4) Quality control and performance metrics, 5) Team roles and responsibility optimization, 6) Technology stack recommendations, 7) Cost reduction opportunities without sacrificing quality. Create systems that run without constant oversight.",
        useCase: "Streamline operations for maximum efficiency",
        revenue: "20-50% cost reduction, 30-100% capacity increase"
      },
      {
        title: "Team Building & Management System",
        prompt: "Design a team building and management system for scaling [BUSINESS TYPE]. Create: 1) Organizational structure and role definitions, 2) Hiring criteria and interview processes, 3) Training programs and onboarding systems, 4) Performance management and review processes, 5) Compensation structures and incentive programs, 6) Communication systems and meeting cadences, 7) Culture development and retention strategies. Build a team that executes your vision consistently.",
        useCase: "Scale business through effective team building",
        revenue: "Enables 5-10x business growth through people"
      },
      {
        title: "Revenue Stream Diversifier",
        prompt: "Identify and develop multiple revenue streams for [EXISTING BUSINESS]. Create: 1) Analysis of current customer base and their additional needs, 2) Complementary products/services that align with core business, 3) Passive income opportunities using existing assets, 4) Partnership and affiliate revenue possibilities, 5) Subscription or recurring revenue models, 6) Premium service tiers and upsells, 7) Implementation timeline and resource requirements. Focus on streams that leverage existing strengths.",
        useCase: "Create multiple income streams from one business",
        revenue: "2-5x total business revenue through diversification"
      }
    ]
  },
  {
    category: "Financial Management & Growth",
    icon: "📊",
    description: "Financial strategies for sustainable business growth",
    prompts: [
      {
        title: "Cash Flow Optimization System",
        prompt: "Design a cash flow optimization system for [BUSINESS TYPE]. Create: 1) Cash flow forecasting model with monthly projections, 2) Accounts receivable management and collection procedures, 3) Inventory optimization strategies, 4) Payment terms and pricing adjustments for better cash flow, 5) Emergency fund requirements and management, 6) Investment priorities for growth, 7) Financial KPIs and monitoring systems. Ensure consistent positive cash flow for growth.",
        useCase: "Maintain healthy cash flow for business stability",
        revenue: "Prevents cash flow crises, enables strategic investments"
      },
      {
        title: "Investment & Growth Strategy Planner",
        prompt: "Create an investment and growth strategy for [BUSINESS] with [CURRENT REVENUE] looking to reach [TARGET REVENUE]. Develop: 1) Growth investment priorities and ROI projections, 2) Marketing budget allocation across channels, 3) Technology and infrastructure investments, 4) Team expansion plan and hiring timeline, 5) Market expansion opportunities and requirements, 6) Risk management and contingency planning, 7) Milestone tracking and adjustment criteria. Create a roadmap for sustainable growth.",
        useCase: "Plan strategic growth investments for maximum ROI",
        revenue: "2-10x revenue growth through strategic planning"
      },
      {
        title: "Business Valuation & Exit Strategy",
        prompt: "Develop a business valuation and exit strategy for [BUSINESS TYPE]. Create: 1) Current business valuation using multiple methods, 2) Value drivers and improvement opportunities, 3) Exit options (sale, merger, IPO, etc.) and requirements, 4) Business optimization plan to maximize value, 5) Documentation and systems needed for due diligence, 6) Timeline and milestones for exit preparation, 7) Tax optimization strategies for exit. Build a business that's valuable to buyers.",
        useCase: "Build and exit businesses for maximum value",
        revenue: "Maximize business sale value, often 3-10x annual revenue"
      }
    ]
  }
];

export default function PromptsContent() {
  const { data: session, status } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Required</h1>
          <p className="text-gray-300 mb-8">Please sign in to access the AI Business Prompts Arsenal.</p>
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

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-5xl font-bold text-white mb-6">AI Business Prompts Arsenal</h1>
          <p className="text-xl text-gray-300 mb-4">
            100+ Premium AI Prompts to Build, Scale & Optimize Your Online Business
          </p>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div className="flex items-center gap-2 text-green-400">
              <DollarSign className="w-5 h-5" />
              <span>Revenue-Generating Prompts</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Target className="w-5 h-5" />
              <span>Business-Focused Only</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-5 h-5" />
              <span>Copy-Paste Ready</span>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 mb-12 border border-purple-500/30">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Download Your Complete Arsenal</h2>
            <p className="text-gray-300 mb-6">Get instant access to all 100+ business-building AI prompts in an organized PDF format.</p>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-colors inline-flex items-center gap-3"
            >
              <Download className="w-6 h-6" />
              {isDownloading ? 'Preparing Download...' : 'Download Complete Arsenal (PDF)'}
            </button>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">💰 Revenue-Focused</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Business model development</li>
              <li>• Sales funnel creation</li>
              <li>• Pricing strategy optimization</li>
              <li>• Revenue stream diversification</li>
              <li>• Customer acquisition systems</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Entrepreneur-Specific</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Online business builders</li>
              <li>• Service-based entrepreneurs</li>
              <li>• Digital product creators</li>
              <li>• Consultants and coaches</li>
              <li>• E-commerce business owners</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">⚡ Implementation Ready</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Copy-paste prompt templates</li>
              <li>• Revenue potential estimates</li>
              <li>• Use case explanations</li>
              <li>• Implementation guidance</li>
              <li>• Business application examples</li>
            </ul>
          </div>
        </div>

        {/* Prompt Categories */}
        <div className="space-y-6">
          {BUSINESS_PROMPTS.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
              {/* Category Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => toggleCategory(category.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{category.category}</h3>
                      <p className="text-gray-400">{category.description}</p>
                      <div className="text-sm text-green-400 mt-1">
                        {category.prompts.length} High-Value Prompts
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedCategories.includes(category.category) ? (
                      <ChevronDown className="w-6 h-6" />
                    ) : (
                      <ChevronRight className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Category Content */}
              {expandedCategories.includes(category.category) && (
                <div className="px-6 pb-6 border-t border-gray-700">
                  <div className="space-y-6 mt-6">
                    {category.prompts.map((prompt, promptIndex) => (
                      <div key={promptIndex} className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-bold text-white">{prompt.title}</h4>
                          <div className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                            {prompt.revenue}
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4 mb-4">
                          <p className="text-gray-300 text-sm leading-relaxed font-mono">
                            {prompt.prompt}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-blue-400">
                            <strong>Use Case:</strong> {prompt.useCase}
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(prompt.prompt);
                              toast.success('Prompt copied to clipboard!');
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            Copy Prompt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your AI Business Empire?</h2>
          <p className="text-gray-300 mb-6">
            Combine these prompts with step-by-step implementation guidance in our complete masterclass
          </p>
          <Link
            href="/products/ai-web-creation-masterclass"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-6 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block text-lg mb-4"
          >
            🚀 Get AI Web Creation Masterclass - A$50
          </Link>
          <p className="text-sm text-gray-400">
            Learn to implement these prompts into profitable web platforms and automated business systems
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/my-account" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to My Account
          </Link>
        </div>
      </div>
    </div>
  );
}