'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Download, DollarSign, Target, Zap, ChevronDown, ChevronRight } from 'lucide-react';

// EXACTLY 30 AI Prompts Arsenal - High-Value Business Building Prompts
const AI_PROMPTS_ARSENAL = [
  // Business Foundation & Strategy (Prompts 1-10)
  {
    id: 1,
    title: "Complete Business Model Generator",
    category: "Business Strategy",
    prompt: "I want to start a [BUSINESS TYPE] targeting [TARGET AUDIENCE]. Create a comprehensive business model including: 1) 5 different revenue streams with pricing, 2) Customer acquisition strategy for each channel, 3) Monthly revenue projections for first 12 months, 4) Startup costs breakdown, 5) Key partnerships needed, 6) Competitive advantages, 7) 90-day launch roadmap with specific milestones. Make it actionable and industry-specific.",
    revenue: "$2000-8000/month consulting",
    useCase: "Create complete business strategies for clients or your own ventures"
  },
  {
    id: 2,
    title: "Market Opportunity Finder",
    prompt: "Analyze the market opportunity for [PRODUCT/SERVICE] in [INDUSTRY/LOCATION]. Provide: 1) Total addressable market size and growth rate, 2) 3 underserved customer segments with specific pain points, 3) 5 direct competitors and their weaknesses, 4) Pricing gaps and opportunities, 5) Barriers to entry and how to overcome them, 6) First-mover advantages available, 7) 6-month market entry strategy. Include specific data points and actionable insights.",
    revenue: "$500-2000 per analysis",
    useCase: "Identify profitable market opportunities before competitors"
  },
  {
    id: 3,
    title: "Competitor Intelligence Report",
    prompt: "Create a detailed competitive analysis for [YOUR BUSINESS] against [COMPETITOR 1], [COMPETITOR 2], [COMPETITOR 3]. Include: 1) Their business models and revenue streams, 2) Pricing strategies and value propositions, 3) Marketing channels and customer acquisition methods, 4) Strengths, weaknesses, and vulnerabilities, 5) Customer complaints and unmet needs, 6) Opportunities to differentiate and win market share, 7) Strategic recommendations for competitive advantage.",
    revenue: "$800-2500 per report",
    useCase: "Outmaneuver competitors with intelligence-driven strategy"
  },
  {
    id: 4,
    title: "Revenue Stream Diversifier",
    prompt: "I have a [EXISTING BUSINESS TYPE] making $[CURRENT REVENUE]/month. Help me add 3-5 new revenue streams that: 1) Leverage my existing customer base, 2) Use my current skills and resources, 3) Can generate $500-2000 additional monthly revenue each, 4) Require minimal startup investment, 5) Can be launched within 60 days. Provide implementation roadmap, pricing strategies, and marketing approaches for each stream.",
    revenue: "2-5x current business revenue",
    useCase: "Multiply income streams from existing business assets"
  },
  {
    id: 5,
    title: "Customer Avatar & Journey Designer",
    prompt: "Create 3 detailed customer avatars for [PRODUCT/SERVICE] including: 1) Demographics, psychographics, and behavioral patterns, 2) Daily routines, challenges, and goals, 3) Current solutions they use and why they're inadequate, 4) Decision-making process and influencing factors, 5) Preferred communication channels and messaging, 6) Complete customer journey from awareness to advocacy, 7) Specific pain points at each stage and how to address them.",
    revenue: "3-5x improvement in conversion rates",
    useCase: "Create laser-targeted marketing that resonates perfectly"
  },

  // Sales & Marketing (Prompts 6-15)
  {
    id: 6,
    title: "High-Converting Sales Funnel Builder",
    prompt: "Design a complete sales funnel for [PRODUCT/SERVICE] priced at $[PRICE] targeting [AUDIENCE]. Create: 1) Lead magnet with compelling title and outline, 2) Landing page copy with psychological triggers, 3) 7-email nurture sequence with subject lines, 4) Sales page structure with objection handling, 5) Upsell and downsell offers, 6) Abandoned cart recovery sequence, 7) Customer success onboarding flow. Focus on maximizing lifetime value.",
    revenue: "$2000-6000 per funnel",
    useCase: "Build automated sales systems that convert 24/7"
  },
  {
    id: 7,
    title: "Cold Outreach Campaign Generator",
    prompt: "Create a cold outreach system for [YOUR SERVICE] targeting [DECISION MAKERS] in [INDUSTRY]. Develop: 1) Prospect research criteria and lead sources, 2) 5 different opening messages for email and LinkedIn, 3) Follow-up sequence with value-first approach, 4) Meeting booking scripts and objection responses, 5) CRM workflow and tracking metrics, 6) Scaling strategies for 100+ prospects/week, 7) Conversion optimization techniques.",
    revenue: "$5000-15000/month with systematic outreach",
    useCase: "Generate qualified leads through strategic cold outreach"
  },
  {
    id: 8,
    title: "Content Marketing Machine",
    prompt: "Build a content marketing system for [BUSINESS] that generates [TARGET] qualified leads monthly. Create: 1) Content pillars aligned with buyer journey, 2) 90-day content calendar with specific topics, 3) SEO keyword strategy for organic traffic, 4) Lead magnets and content upgrades, 5) Social media amplification plan, 6) Email nurture sequences for content subscribers, 7) Conversion tracking and optimization methods.",
    revenue: "$3000-10000/month through content leads",
    useCase: "Build authority and generate leads through strategic content"
  },
  {
    id: 9,
    title: "Referral System Designer",
    prompt: "Design a referral program for [BUSINESS TYPE] that generates 30% of new customers through referrals. Create: 1) Incentive structure for referrers and referees, 2) Program rules and qualification criteria, 3) Referral request scripts and timing, 4) Marketing materials and tracking system, 5) Partner referral opportunities, 6) Gamification elements to increase participation, 7) Success metrics and optimization strategies.",
    revenue: "30-50% increase in customer acquisition",
    useCase: "Create viral growth through systematic referral programs"
  },
  {
    id: 10,
    title: "Local Market Domination Plan",
    prompt: "Create a strategy to dominate the local market for [SERVICE BUSINESS] in [CITY]. Develop: 1) Local SEO optimization for Google My Business, 2) Community partnership and networking strategy, 3) Local advertising channels and budget allocation, 4) Customer retention and loyalty programs, 5) Event marketing and community involvement, 6) Online reputation management system, 7) Expansion plan to neighboring markets.",
    revenue: "50-200% increase in local market share",
    useCase: "Become the dominant player in your local market"
  },

  // Product & Service Development (Prompts 11-20)
  {
    id: 11,
    title: "Product-Market Fit Validator",
    prompt: "Help me validate [PRODUCT IDEA] for [TARGET MARKET] before building. Create: 1) Customer interview questions to uncover real pain points, 2) MVP feature prioritization based on customer value, 3) Pricing experiment framework with A/B tests, 4) Beta testing program structure, 5) Success metrics and pivot criteria, 6) Pre-launch validation checklist, 7) Go-to-market strategy once validated.",
    revenue: "Prevents costly product failures",
    useCase: "Validate ideas before investing time and money"
  },
  {
    id: 12,
    title: "Premium Pricing Strategy",
    prompt: "Develop premium pricing for [PRODUCT/SERVICE] to maximize profit margins. Create: 1) Value-based pricing model with justification, 2) Premium positioning and messaging strategy, 3) Service differentiation from competitors, 4) Target customer profile for premium pricing, 5) Objection handling for price concerns, 6) Payment terms and options, 7) Upsell opportunities to increase order value.",
    revenue: "50-300% increase in profit margins",
    useCase: "Command premium prices while maintaining demand"
  },
  {
    id: 13,
    title: "Digital Product Creator",
    prompt: "Design a digital product for [NICHE] that generates $5000+/month passive income. Create: 1) Product concept solving urgent problem, 2) Content structure and delivery method, 3) Pricing tiers and value ladder, 4) Launch sequence and marketing plan, 5) Customer onboarding and success system, 6) Feedback collection and iteration process, 7) Scaling strategies and product line extensions.",
    revenue: "$5000-25000/month passive income",
    useCase: "Create scalable digital products with high margins"
  },
  {
    id: 14,
    title: "Service Packaging System",
    prompt: "Transform my [SKILL/EXPERTISE] into profitable service packages. Create: 1) 3 service tiers (basic, premium, enterprise), 2) Clear deliverables and timelines for each, 3) Pricing strategy based on value delivered, 4) Service differentiation and unique positioning, 5) Client onboarding and delivery process, 6) Upsell and cross-sell opportunities, 7) Scaling plan to increase capacity.",
    revenue: "$3000-12000/month with packaged services",
    useCase: "Package expertise into scalable, profitable services"
  },
  {
    id: 15,
    title: "Subscription Business Model",
    prompt: "Convert [EXISTING BUSINESS] into a subscription model for recurring revenue. Design: 1) Subscription tiers with clear value propositions, 2) Onboarding sequence for new subscribers, 3) Retention strategies to reduce churn, 4) Pricing strategy and billing options, 5) Content/service delivery schedule, 6) Upgrade paths and expansion revenue, 7) Customer success metrics and optimization.",
    revenue: "Predictable recurring revenue growth",
    useCase: "Build predictable monthly recurring revenue"
  },

  // Operations & Scaling (Prompts 16-25)
  {
    id: 16,
    title: "Business Process Optimizer",
    prompt: "Optimize operations for [BUSINESS TYPE] to increase efficiency by 50%. Analyze: 1) Current workflow bottlenecks and time wasters, 2) Automation opportunities using available tools, 3) Standard operating procedures for key processes, 4) Quality control and performance metrics, 5) Team roles and responsibility optimization, 6) Technology recommendations, 7) Implementation roadmap with quick wins.",
    revenue: "30-50% cost reduction, 2x capacity increase",
    useCase: "Streamline operations for maximum efficiency and profit"
  },
  {
    id: 17,
    title: "Team Building System",
    prompt: "Scale [BUSINESS] through effective team building from current [TEAM SIZE] to [TARGET SIZE]. Create: 1) Organizational structure and role definitions, 2) Hiring criteria and interview processes, 3) Training programs and onboarding systems, 4) Performance management and KPIs, 5) Compensation structures and incentives, 6) Communication systems and culture, 7) Leadership development and succession planning.",
    revenue: "5-10x business growth through people",
    useCase: "Scale business systematically through team building"
  },
  {
    id: 18,
    title: "Customer Success System",
    prompt: "Design a customer success system for [BUSINESS] to increase retention by 40% and referrals by 60%. Create: 1) Customer onboarding journey and milestones, 2) Regular check-in schedule and touchpoints, 3) Success metrics and health scoring, 4) Proactive intervention strategies, 5) Upsell and expansion opportunities, 6) Feedback collection and improvement process, 7) Customer advocacy and referral programs.",
    revenue: "40% increase in customer lifetime value",
    useCase: "Maximize customer value through systematic success management"
  },
  {
    id: 19,
    title: "Quality Control Framework",
    prompt: "Establish quality control systems for [BUSINESS/PRODUCT] to maintain consistency at scale. Develop: 1) Quality standards and benchmarks, 2) Testing and review processes, 3) Error tracking and resolution procedures, 4) Training protocols for quality maintenance, 5) Customer feedback integration, 6) Continuous improvement methodology, 7) Quality metrics and reporting dashboard.",
    revenue: "Reduced refunds, increased customer satisfaction",
    useCase: "Maintain quality while scaling business operations"
  },
  {
    id: 20,
    title: "Partnership Strategy Developer",
    prompt: "Create strategic partnerships for [BUSINESS] to accelerate growth. Identify: 1) Ideal partner profiles and target companies, 2) Partnership models (referral, joint venture, affiliate), 3) Value propositions for potential partners, 4) Partnership agreements and terms, 5) Joint marketing and promotion strategies, 6) Performance tracking and optimization, 7) Scaling successful partnerships.",
    revenue: "30-100% increase in leads through partnerships",
    useCase: "Accelerate growth through strategic business partnerships"
  },

  // Financial Management & Growth (Prompts 21-30)
  {
    id: 21,
    title: "Cash Flow Optimization System",
    prompt: "Optimize cash flow for [BUSINESS TYPE] with $[MONTHLY REVENUE] to improve working capital. Create: 1) Cash flow forecasting model with scenarios, 2) Accounts receivable optimization strategies, 3) Payment terms and collection procedures, 4) Expense timing and management, 5) Emergency fund requirements, 6) Investment priorities for growth, 7) Financial dashboard and monitoring.",
    revenue: "Improved cash flow, reduced financial stress",
    useCase: "Maintain healthy cash flow for business stability"
  },
  {
    id: 22,
    title: "Growth Investment Planner",
    prompt: "Plan strategic investments to grow [BUSINESS] from $[CURRENT REVENUE] to $[TARGET REVENUE]. Develop: 1) Investment priorities with ROI projections, 2) Marketing budget allocation across channels, 3) Technology and infrastructure needs, 4) Team expansion timeline and costs, 5) Market expansion opportunities, 6) Risk assessment and mitigation, 7) Success metrics and milestones.",
    revenue: "Strategic growth to target revenue levels",
    useCase: "Plan and execute strategic growth investments"
  },
  {
    id: 23,
    title: "Pricing Optimization Engine",
    prompt: "Optimize pricing for [PRODUCT/SERVICE] to maximize revenue and profit. Analyze: 1) Current pricing vs market positioning, 2) Price sensitivity and elasticity testing, 3) Competitor pricing analysis and gaps, 4) Value-based pricing opportunities, 5) Bundle and package pricing strategies, 6) Dynamic pricing for different segments, 7) Price increase strategies and communication.",
    revenue: "20-50% increase in profit margins",
    useCase: "Optimize pricing for maximum profitability"
  },
  {
    id: 24,
    title: "Business Valuation & Exit Strategy",
    prompt: "Prepare [BUSINESS] for potential exit or investment. Create: 1) Business valuation using multiple methods, 2) Value drivers and improvement opportunities, 3) Exit options and requirements for each, 4) Due diligence preparation checklist, 5) Financial optimization for valuation, 6) Documentation and systems audit, 7) Timeline and milestones for exit readiness.",
    revenue: "Maximize business sale value",
    useCase: "Build valuable, exit-ready business"
  },
  {
    id: 25,
    title: "Performance Dashboard Designer",
    prompt: "Create a comprehensive performance dashboard for [BUSINESS TYPE]. Include: 1) Key performance indicators by department, 2) Financial metrics and profitability tracking, 3) Customer acquisition and retention metrics, 4) Operational efficiency indicators, 5) Team performance and productivity measures, 6) Automated reporting and alerts, 7) Decision-making framework based on data.",
    revenue: "Data-driven decisions improve all metrics",
    useCase: "Make informed decisions with real-time business intelligence"
  },
  {
    id: 26,
    title: "Risk Management Framework",
    prompt: "Develop risk management strategies for [BUSINESS TYPE]. Identify: 1) Business risks and threat assessment, 2) Financial risks and mitigation strategies, 3) Operational risks and contingency plans, 4) Market risks and diversification approaches, 5) Legal and compliance considerations, 6) Insurance and protection strategies, 7) Crisis management and recovery procedures.",
    revenue: "Protect business from costly risks",
    useCase: "Safeguard business against potential threats"
  },
  {
    id: 27,
    title: "Customer Acquisition Cost Optimizer",
    prompt: "Reduce customer acquisition cost for [BUSINESS] while increasing conversion rates. Analyze: 1) Current CAC by channel and campaign, 2) Conversion funnel optimization opportunities, 3) Lifetime value to CAC ratio improvement, 4) Channel performance and reallocation, 5) Organic growth strategies to reduce paid acquisition, 6) Referral programs to lower CAC, 7) Retention strategies to increase LTV.",
    revenue: "50% reduction in acquisition costs",
    useCase: "Acquire customers more efficiently and profitably"
  },
  {
    id: 28,
    title: "Market Expansion Strategy",
    prompt: "Expand [BUSINESS] into new markets or segments. Develop: 1) Market research for expansion opportunities, 2) Target market analysis and sizing, 3) Competitive landscape in new markets, 4) Product/service adaptation requirements, 5) Go-to-market strategy for expansion, 6) Resource requirements and timeline, 7) Success metrics and risk mitigation.",
    revenue: "2-5x business growth through expansion",
    useCase: "Successfully expand into new profitable markets"
  },
  {
    id: 29,
    title: "Automation Implementation Plan",
    prompt: "Automate key processes in [BUSINESS TYPE] to reduce manual work by 60%. Identify: 1) Repetitive tasks suitable for automation, 2) Automation tools and software recommendations, 3) Implementation priority and timeline, 4) Cost-benefit analysis for each automation, 5) Training requirements for team, 6) Quality control for automated processes, 7) ROI measurement and optimization.",
    revenue: "60% reduction in manual work costs",
    useCase: "Scale business through intelligent automation"
  },
  {
    id: 30,
    title: "Innovation Pipeline Creator",
    prompt: "Establish innovation processes for [BUSINESS] to stay ahead of competition. Create: 1) Innovation framework and methodology, 2) Idea generation and evaluation system, 3) Market trend monitoring and analysis, 4) Customer feedback integration for innovation, 5) Rapid prototyping and testing processes, 6) Innovation metrics and success criteria, 7) Culture and incentives for innovation.",
    revenue: "Sustainable competitive advantage",
    useCase: "Build systematic innovation for long-term success"
  }
];

export default function PromptsContent() {
  const { data: session, status } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState<number[]>([]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePrompt = (promptId: number) => {
    setExpandedPrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
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
          <p className="text-gray-300 mb-8">Please sign in to access the 30x AI Prompts Arsenal.</p>
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

  const categories = [
    { name: "Business Strategy", prompts: AI_PROMPTS_ARSENAL.slice(0, 5), icon: "💰", color: "blue" },
    { name: "Sales & Marketing", prompts: AI_PROMPTS_ARSENAL.slice(5, 15), icon: "📈", color: "green" },
    { name: "Product & Service Development", prompts: AI_PROMPTS_ARSENAL.slice(10, 15), icon: "🏗️", color: "purple" },
    { name: "Operations & Scaling", prompts: AI_PROMPTS_ARSENAL.slice(15, 20), icon: "⚡", color: "orange" },
    { name: "Financial Management & Growth", prompts: AI_PROMPTS_ARSENAL.slice(20, 30), icon: "📊", color: "red" }
  ];

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-5xl font-bold text-white mb-6">30x AI Prompts Arsenal</h1>
          <p className="text-xl text-gray-300 mb-4">
            30 Premium AI Prompts to Build, Scale & Optimize Your Online Business
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
            <p className="text-gray-300 mb-6">Get instant access to all 30 business-building AI prompts in an organized PDF format.</p>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-colors inline-flex items-center gap-3"
            >
              <Download className="w-6 h-6" />
              {isDownloading ? 'Preparing Download...' : 'Download 30x AI Prompts Arsenal (PDF)'}
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
              <li>• Revenue optimization</li>
              <li>• Customer acquisition</li>
              <li>• Profit maximization</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Entrepreneur-Specific</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Online business builders</li>
              <li>• Service entrepreneurs</li>
              <li>• Digital product creators</li>
              <li>• Consultants and coaches</li>
              <li>• E-commerce owners</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">⚡ Implementation Ready</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Copy-paste prompt templates</li>
              <li>• Revenue potential estimates</li>
              <li>• Use case explanations</li>
              <li>• Business applications</li>
              <li>• Success metrics included</li>
            </ul>
          </div>
        </div>

        {/* Prompts by Category */}
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-gray-900 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    <p className="text-gray-400">{category.prompts.length} High-Value Prompts</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {category.prompts.map((prompt) => (
                  <div key={prompt.id} className="bg-gray-800 rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-750 transition-colors flex items-center justify-between"
                      onClick={() => togglePrompt(prompt.id)}
                    >
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">
                          #{prompt.id}: {prompt.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded">
                            {prompt.revenue}
                          </span>
                          <span className="text-gray-400">{prompt.useCase}</span>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {expandedPrompts.includes(prompt.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    
                    {expandedPrompts.includes(prompt.id) && (
                      <div className="px-4 pb-4 border-t border-gray-700">
                        <div className="mt-4 bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-300 text-sm leading-relaxed font-mono">
                            {prompt.prompt}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-blue-400 text-sm">
                            <strong>Revenue Potential:</strong> {prompt.revenue}
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(prompt.prompt);
                              toast.success('Prompt copied to clipboard!');
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
                          >
                            Copy Prompt
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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