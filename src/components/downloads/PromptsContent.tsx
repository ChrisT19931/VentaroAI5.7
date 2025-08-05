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
    setIsLoading(false);
  }, []);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('Please log in to download');
      return;
    }
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/downloads/ai-prompts-collection.pdf';
    link.download = 'AI-Prompts-Collection.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
    setTimeout(() => setIsDownloading(false), 2000);
  }

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
              
              {/* Business Planning Prompts */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  📋 Business Planning Prompts
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">1. Business Model Canvas Generator</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a comprehensive business model canvas for [BUSINESS IDEA]. Include: value propositions, customer segments, channels, customer relationships, revenue streams, key resources, key activities, key partnerships, and cost structure. Provide detailed explanations for each section with specific examples."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Perfect for validating and structuring your business idea.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">2. Market Research & Analysis</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Conduct comprehensive market research for [INDUSTRY/PRODUCT]. Analyze: market size and growth potential, target demographics, competitor landscape, pricing strategies, market trends, customer pain points, and opportunities. Include SWOT analysis and actionable insights."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Make data-driven business decisions with thorough market insights.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">3. Financial Projections & Budgeting</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create detailed financial projections for [BUSINESS TYPE] over 3 years. Include: revenue forecasts, expense breakdowns, cash flow analysis, break-even calculations, profit margins, and key financial ratios. Provide monthly projections for year 1 and quarterly for years 2-3."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Plan your financial future with accurate projections.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">4. Competitive Analysis Framework</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Analyze top 5 competitors in [INDUSTRY] for [BUSINESS/PRODUCT]. Compare: pricing strategies, product features, marketing approaches, customer reviews, strengths/weaknesses, market positioning, and identify gaps we can exploit. Create competitive advantage strategies."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Stay ahead of competition with strategic analysis.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">5. Risk Assessment & Mitigation</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Identify and assess potential risks for [BUSINESS TYPE]. Categorize risks: financial, operational, market, legal, technological, and reputational. For each risk, provide: probability assessment, potential impact, mitigation strategies, and contingency plans."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Protect your business with comprehensive risk planning.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">6. Strategic Planning & Goal Setting</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop a strategic plan for [BUSINESS/PROJECT] with SMART goals. Create: vision and mission statements, 1-year and 5-year objectives, key performance indicators (KPIs), milestone timelines, resource allocation, and quarterly review processes."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Turn your vision into actionable strategic plans.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">7. Funding Strategy & Investor Pitch</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a compelling investor pitch for [BUSINESS IDEA] seeking [FUNDING AMOUNT]. Include: problem statement, solution overview, market opportunity, business model, traction/validation, financial projections, funding requirements, use of funds, and exit strategy."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Secure funding with professional investor presentations.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">8. Operations & Process Optimization</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design efficient operational processes for [BUSINESS TYPE]. Map out: workflow diagrams, standard operating procedures (SOPs), quality control measures, performance metrics, automation opportunities, and continuous improvement strategies."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Streamline operations for maximum efficiency and quality.</p>
                  </div>
                </div>
              </div>

              {/* E-commerce Setup Prompts */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  🛒 E-commerce Setup Prompts
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">9. E-commerce Platform Selection</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Compare e-commerce platforms for [BUSINESS TYPE] selling [PRODUCT CATEGORY]. Evaluate: Shopify, WooCommerce, BigCommerce, Magento, and Squarespace. Consider: pricing, features, scalability, customization, payment options, SEO capabilities, and integration possibilities. Provide platform recommendation with justification."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Choose the perfect platform for your online store.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">10. Product Catalog & Inventory Setup</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a comprehensive product catalog structure for [PRODUCT TYPE] e-commerce store. Include: category hierarchy, product attributes, SKU system, inventory tracking, variant management, pricing tiers, bulk upload templates, and product data optimization for SEO."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Organize your products for maximum discoverability and sales.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">11. Payment Gateway Integration</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Set up secure payment processing for [E-COMMERCE STORE]. Compare: Stripe, PayPal, Square, and regional options. Include: transaction fees, security features, supported currencies, mobile optimization, recurring billing, fraud protection, and compliance requirements (PCI DSS)."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Secure and optimize your payment processing system.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">12. Shipping & Fulfillment Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop a shipping and fulfillment strategy for [PRODUCT TYPE] e-commerce business. Include: shipping zones and rates, carrier partnerships, packaging solutions, order processing workflow, tracking systems, return policies, and international shipping considerations."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Deliver products efficiently and cost-effectively.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">13. Customer Support System</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Implement a comprehensive customer support system for [E-COMMERCE BUSINESS]. Include: help desk software selection, FAQ creation, live chat setup, email templates, return/refund processes, escalation procedures, and customer satisfaction tracking."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Provide exceptional customer service that builds loyalty.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">14. Security & Compliance Framework</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Establish security and compliance measures for [E-COMMERCE PLATFORM]. Include: SSL certificates, data encryption, privacy policies, GDPR compliance, PCI DSS requirements, backup systems, fraud prevention, and security monitoring protocols."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Protect your business and customers with robust security.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">15. Analytics & Performance Tracking</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Set up comprehensive analytics for [E-COMMERCE STORE]. Implement: Google Analytics 4, conversion tracking, heat mapping, A/B testing tools, customer behavior analysis, sales reporting, and KPI dashboards. Define key metrics and reporting schedules."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Make data-driven decisions to optimize your store performance.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">16. Mobile Optimization & App Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Optimize [E-COMMERCE STORE] for mobile commerce. Include: responsive design principles, mobile checkout optimization, page speed improvements, progressive web app (PWA) implementation, mobile app development considerations, and mobile-specific marketing strategies."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Capture the growing mobile commerce market effectively.</p>
                  </div>
                </div>
              </div>

              {/* Marketing & Growth Prompts */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  📈 Marketing & Growth Prompts
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">17. Digital Marketing Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop a comprehensive digital marketing strategy for [BUSINESS/PRODUCT]. Include: target audience analysis, channel selection (SEO, PPC, social media, email), content marketing plan, budget allocation, campaign timelines, and KPI tracking. Focus on [BRAND AWARENESS/LEAD GENERATION/SALES CONVERSION]."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Build a cohesive digital presence that drives results.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">18. Content Marketing Calendar</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a 3-month content marketing calendar for [BUSINESS TYPE]. Include: blog posts, social media content, email campaigns, video content, and promotional materials. Align with business goals, seasonal trends, and audience interests. Specify posting frequency and content themes."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Stay consistent with strategic content planning.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">19. Social Media Growth Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a social media growth strategy for [PLATFORM] targeting [AUDIENCE]. Include: content pillars, posting schedule, engagement tactics, hashtag strategy, influencer partnerships, community building, and growth hacking techniques. Goal: increase followers by [X]% in [TIMEFRAME]."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Build an engaged social media community.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">20. Email Marketing Automation</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Set up email marketing automation for [BUSINESS TYPE]. Create: welcome series, abandoned cart recovery, post-purchase follow-up, re-engagement campaigns, and promotional sequences. Include subject lines, email copy, timing, and segmentation strategies."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Nurture leads and customers automatically.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">21. SEO Content Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop an SEO content strategy for [WEBSITE/BUSINESS]. Include: keyword research, content gaps analysis, topic clusters, content calendar, on-page optimization guidelines, link building strategy, and performance tracking. Target: [LOCAL/NATIONAL/GLOBAL] audience."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Dominate search results with strategic content.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">22. Conversion Rate Optimization</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Optimize conversion rates for [WEBSITE/LANDING PAGE]. Analyze: user journey, pain points, form optimization, CTA placement, page speed, mobile experience, and trust signals. Create A/B testing plan and provide specific improvement recommendations."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Turn more visitors into customers.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">23. Influencer Marketing Campaign</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Plan an influencer marketing campaign for [PRODUCT/SERVICE]. Include: influencer identification criteria, outreach strategy, collaboration types, content guidelines, contract terms, campaign timeline, and ROI measurement. Budget: [AMOUNT] targeting [AUDIENCE]."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Leverage influencer partnerships for authentic reach.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">24. Customer Retention Program</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a customer retention program for [BUSINESS TYPE]. Include: loyalty rewards system, personalized communication, exclusive offers, feedback collection, win-back campaigns, and customer success initiatives. Goal: increase retention rate by [X]%."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Keep customers coming back for more.</p>
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

              {/* Development & Deployment Prompts - Continued */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Web Application Architecture</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a scalable web application architecture for [PROJECT TYPE]. Include: frontend framework selection, backend API design, database schema planning, caching strategies, CDN implementation, load balancing considerations, and microservices vs monolithic architecture decisions. Focus on performance, scalability, and maintainability."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Build applications that scale with your business.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">API Development Guide</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a comprehensive API development guide for [API TYPE]. Include: RESTful design principles, authentication and authorization strategies, rate limiting implementation, error handling patterns, API documentation standards, versioning strategies, and testing methodologies. Focus on creating robust and developer-friendly APIs."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Build APIs that developers love to use.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Database Optimization Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop a database optimization strategy for [DATABASE TYPE] handling [DATA VOLUME]. Include: indexing strategies, query optimization techniques, connection pooling, caching layers, backup and recovery procedures, monitoring and alerting setup, and performance tuning recommendations. Focus on maximizing performance while ensuring data integrity."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Optimize database performance for maximum efficiency.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Cloud Infrastructure Design</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a cloud infrastructure for [APPLICATION TYPE] on [CLOUD PROVIDER]. Include: compute resource planning, storage solutions, networking configuration, auto-scaling policies, disaster recovery planning, cost optimization strategies, and security group configurations. Focus on reliability, scalability, and cost-effectiveness."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Build resilient cloud infrastructure that grows with you.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Security Implementation Plan</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a comprehensive security implementation plan for [APPLICATION TYPE]. Include: authentication and authorization systems, data encryption strategies, secure coding practices, vulnerability assessment procedures, penetration testing plans, compliance requirements, and incident response protocols. Focus on protecting user data and maintaining system integrity."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Secure your applications against modern threats.</p>
                  </div>
                </div>
              </div>

              {/* Development & Deployment Prompts */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  🚀 Development & Deployment Prompts
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">GitHub Repository Setup Guide</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a comprehensive GitHub repository setup guide for [PROJECT NAME]. Include: repository initialization, branch protection rules, workflow automation with GitHub Actions, pull request templates, issue templates, README structure, contributing guidelines, and security best practices. Focus on establishing a professional and efficient development workflow."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Set up a professional GitHub repository for your project.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Vercel Deployment Configuration</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a detailed Vercel deployment configuration for [PROJECT TYPE]. Include: environment variable setup (for Supabase, Stripe, Email, and site configuration), build optimization settings, domain configuration, webhook setup, post-deployment verification steps, and troubleshooting common deployment issues. Focus on achieving a smooth and reliable deployment process."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Deploy your application seamlessly with Vercel.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Full-Stack Project Environment Setup</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a comprehensive environment setup guide for a [TECH STACK] project. Include: local development environment configuration, required services (database, authentication, payment processing, email), environment variable management, local testing procedures, and production environment preparation. Focus on creating a consistent and reliable development experience across the team."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Set up your development environment correctly from the start.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">CI/CD Pipeline Configuration</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a CI/CD pipeline for [PROJECT TYPE] using [TOOLS/SERVICES]. Include: automated testing configuration, build process optimization, deployment strategies (blue-green, canary, etc.), rollback procedures, monitoring setup, and notification systems. Focus on creating a reliable and efficient pipeline that ensures code quality and minimizes deployment risks."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Automate your testing and deployment workflow.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Production Monitoring & Maintenance Plan</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop a comprehensive monitoring and maintenance plan for [APPLICATION TYPE] in production. Include: performance monitoring tools, error tracking systems, database monitoring, security scanning, backup strategies, update procedures, and incident response protocols. Focus on ensuring high availability, performance, and security for your application."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Keep your application running smoothly in production.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Containerization Strategy</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Create a containerization strategy for [APPLICATION TYPE] using Docker. Include: base image selection, multi-stage build optimization, environment configuration, volume management, networking setup, security hardening, and container orchestration recommendations. Focus on creating lightweight, secure, and reproducible containers that streamline development and deployment workflows."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Containerize your application for consistent deployment across environments.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Kubernetes Deployment Configuration</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a Kubernetes deployment configuration for [APPLICATION TYPE]. Include: namespace organization, deployment strategies, service definitions, ingress configuration, resource management (requests/limits), horizontal pod autoscaling, persistent storage setup, ConfigMaps and Secrets management, health checks, and pod disruption budgets. Focus on creating a resilient, scalable, and maintainable infrastructure."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Deploy and manage your containerized applications at scale.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">AI Application Security Framework</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Develop a comprehensive security framework for [AI APPLICATION TYPE]. Include: data protection measures, model security (against poisoning, inversion, and theft), prompt injection defenses, authentication and authorization controls, API security, monitoring for abnormal behavior, compliance requirements, and incident response procedures. Focus on addressing AI-specific vulnerabilities while maintaining standard application security best practices."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Secure your AI applications against emerging threats and vulnerabilities.</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Serverless Architecture Design</h3>
                    <div className="bg-gray-700 rounded p-4 mb-3">
                      <p className="text-gray-300 font-mono text-sm">
                        "Design a serverless architecture for [APPLICATION TYPE] using [CLOUD PROVIDER]. Include: function organization strategy, event-driven workflow design, API Gateway configuration, authentication integration, database access patterns, local development setup, monitoring approach, and cost optimization techniques. Focus on creating a scalable, maintainable solution that minimizes operational overhead."
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">Build scalable applications without managing infrastructure.</p>
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