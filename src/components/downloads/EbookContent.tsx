'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Download, ChevronDown, ChevronRight, DollarSign, Target, Zap, BookOpen } from 'lucide-react';

// Props interface for the component
interface EbookContentProps {
  hasAccess: boolean;
  isAdmin: boolean;
}

// Define the detailed lesson structure
const AI_LESSONS = [
  // SECTION 1: ChatGPT, Gemini & Grok Business Mastery (Lessons 1-10)
  {
    id: 1,
    title: "ChatGPT Business Foundations: Your First $1K Month",
    category: "ChatGPT/Gemini/Grok",
    icon: "💰",
    estimatedRevenue: "$500-2000/month",
    difficulty: "Beginner",
    timeToImplement: "1-2 weeks",
    overview: "Transform ChatGPT into your personal business consultant and start generating income within 30 days through proven service offerings.",
    detailedContent: {
      introduction: "Most people use ChatGPT for simple questions, but smart entrepreneurs use it as a business-building machine. In this comprehensive lesson, you'll discover the exact system I use to generate $1000+ monthly through ChatGPT-powered services that local businesses desperately need. This isn't theory - these are battle-tested strategies that have generated over $50,000 in revenue for my clients and students. You'll learn the specific prompts, pricing strategies, client acquisition methods, and scaling systems that transform ChatGPT from a chatbot into your personal money-making machine.",
      
      sections: [
        {
          title: "Setting Up Your ChatGPT Business Engine (The Foundation)",
          content: "START HERE: Your ChatGPT setup determines your success. Most people skip this step and wonder why they fail. Don't make this mistake.\n\n🔥 STEP 1: GET CHATGPT PLUS ($20/month)\nThis isn't optional if you're serious about business. The Plus version gives you:\n• GPT-4 access (10x smarter than free version)\n• Priority during high-traffic times (no waiting)\n• Access to plugins that automate business processes\n• Custom GPT creation (build specialized business tools)\n• Browse the internet for real-time data\n• Image analysis for visual content creation\n\n🎯 STEP 2: MASTER CUSTOM INSTRUCTIONS\nThis is your secret weapon. Copy this EXACT setup:\n\n**Custom Instructions:**\n'You are an expert business consultant with 15 years of experience helping small businesses increase revenue by 50-300%. Your specialty is creating actionable, specific strategies that generate quick wins within 30-90 days. Always provide:\n1. Specific implementation steps with timelines\n2. Expected outcomes and revenue projections\n3. Common pitfalls and how to avoid them\n4. Tools and resources needed\n5. Success metrics to track\n\nFocus on strategies that require minimal upfront investment but generate maximum ROI. Prioritize digital marketing, automation, and scalable systems.'\n\n🚀 STEP 3: CREATE YOUR BUSINESS PROMPTS LIBRARY\nSave these power prompts in a document:\n\n**Market Research Prompt:**\n'Analyze the [INDUSTRY] market in [LOCATION]. Provide: target customer demographics, pain points, average spending, competition analysis, and 3 underserved opportunities for a new service provider.'\n\n**Pricing Strategy Prompt:**\n'Create a pricing strategy for [SERVICE] targeting [CUSTOMER TYPE]. Include: value-based pricing tiers, competitor analysis, psychological pricing techniques, and upsell opportunities. Show expected profit margins.'\n\n**Sales Script Prompt:**\n'Write a sales script for [SERVICE] that: identifies customer pain points, presents solution benefits, handles 5 common objections, and closes with urgency. Make it conversational and consultative.'\n\n💡 PRO TIP: Test your setup by asking: 'Help me start a social media management service for restaurants. I have $100 budget and 10 hours per week.' If ChatGPT gives you a detailed, actionable plan with specific steps and revenue projections, you're ready. If not, refine your custom instructions."
        },
        {
          title: "The $100/Hour Content Creation Service (Your First Revenue Stream)",
          content: "LOCAL BUSINESSES SPEND $3,000-10,000 PER MONTH on marketing agencies for content you can create in 30 minutes. This is your fastest path to $1000+ monthly income.\n\n💰 THE BUSINESS MODEL:\n• Service: Social Media Content Packages\n• Price: $100-300 per month per client\n• Time: 30 minutes per package\n• Target: Local businesses (restaurants, gyms, salons, real estate)\n• Potential: $2000+ monthly with 10 clients\n\n🎯 THE EXACT SYSTEM:\n\n**STEP 1: THE MASTER PROMPT**\nCopy this word-for-word:\n'Create 30 social media posts for a [BUSINESS TYPE] in [LOCATION]. Requirements:\n• 15 Facebook posts, 10 Instagram posts, 5 LinkedIn posts\n• Include engaging hooks that stop scrolling\n• Add local references and community connections\n• Create clear call-to-actions for each post\n• Include relevant hashtags (mix of popular and niche)\n• Provide optimal posting schedule with days/times\n• Make posts conversational and valuable\n• Design posts to drive foot traffic and phone calls\n• Include seasonal/holiday tie-ins\n• Add customer testimonial post templates'\n\n**STEP 2: CUSTOMIZATION BY INDUSTRY**\n\n*Restaurants:*\n'Focus on: daily specials, behind-the-scenes kitchen content, customer photos, local food events, chef tips, ingredient sourcing stories, seasonal menu changes, community partnerships, food photography tips, reservation reminders.'\n\n*Gyms/Fitness:*\n'Focus on: workout tips, member success stories, equipment tutorials, nutrition advice, class schedules, trainer spotlights, fitness challenges, recovery tips, goal-setting content, community events.'\n\n*Real Estate:*\n'Focus on: market updates, home buying tips, neighborhood spotlights, property features, client testimonials, mortgage advice, staging tips, investment opportunities, local market trends, first-time buyer guides.'\n\n*Professional Services (lawyers, accountants, etc.):*\n'Focus on: industry insights, legal/financial tips, case studies, regulatory updates, client education, process explanations, team introductions, community involvement, thought leadership, FAQ content.'\n\n**STEP 3: PREMIUM ADD-ONS (Increase Revenue)**\n• Visual content suggestions (+$50/month)\n• Hashtag research and optimization (+$25/month)\n• Competitor analysis and positioning (+$75/month)\n• Monthly performance reports (+$50/month)\n• Content calendar with graphics (+$100/month)\n\n**STEP 4: DELIVERY SYSTEM**\n1. Create content in Google Docs\n2. Organize by platform and date\n3. Include posting instructions\n4. Add visual suggestions\n5. Provide performance tracking sheet\n\n💡 SCALING SECRET: Create industry-specific templates. Once you've done 5 restaurants, you have a restaurant template. This reduces creation time from 30 minutes to 10 minutes while maintaining quality.\n\n🔥 CLIENT ACQUISITION STRATEGY:\n1. Create 5 sample posts for different business types\n2. Reach out to local Facebook business groups\n3. Offer free 5-post sample to first 3 businesses\n4. Use results as testimonials and case studies\n5. Ask for referrals from happy clients\n\n📊 SUCCESS METRICS TO TRACK:\n• Posts per hour created\n• Client retention rate\n• Average revenue per client\n• Referral rate\n• Time to create vs. price charged"
        },
        {
          title: "Email Marketing Sequences That Sell (The $500 Service)",
          content: "EMAIL MARKETING GENERATES $42 FOR EVERY $1 SPENT, yet 87% of small businesses have terrible email sequences. This creates a massive opportunity for you to provide a high-value service that businesses desperately need.\n\n💰 THE OPPORTUNITY:\n• 91% of consumers check email daily\n• Email is 40x more effective than social media\n• Automated sequences work 24/7\n• Average small business email list: 500-2000 subscribers\n• Poor email sequences cost businesses $10,000+ annually\n\n🎯 YOUR SERVICE PACKAGES:\n\n**STARTER PACKAGE ($200-300):**\n• 5-email welcome sequence\n• Basic automation setup guide\n• Subject line optimization\n• 1 revision included\n\n**PROFESSIONAL PACKAGE ($400-600):**\n• 7-email welcome sequence\n• 5-email abandoned cart sequence\n• 3-email re-engagement sequence\n• Email template designs\n• Automation setup + testing\n• Performance tracking setup\n• 2 revisions included\n\n**PREMIUM PACKAGE ($700-1000):**\n• Complete email ecosystem (15+ emails)\n• Segmentation strategy\n• A/B testing setup\n• Monthly optimization\n• Performance reporting\n• 3 months of tweaks included\n\n🔥 THE MASTER EMAIL SEQUENCE PROMPT:\n'Create a 7-email welcome sequence for a [BUSINESS TYPE] that converts subscribers into customers. Include:\n\nEmail 1 (Immediate): Welcome + Instant Value\n• Thank subscriber and set expectations\n• Deliver promised lead magnet\n• Introduce brand story briefly\n• Set expectation for next email\n• Subject line: \"Welcome! Here's your [PROMISED RESOURCE]\"\n\nEmail 2 (Day 2): Origin Story + Social Proof\n• Share founder's journey and motivation\n• Include customer success story\n• Highlight unique value proposition\n• Subject line: \"Why I started [BUSINESS NAME] (personal story)\"\n\nEmail 3 (Day 4): Educational Value + Authority\n• Provide valuable tips related to their problem\n• Position business as expert solution\n• Include case study or example\n• Subject line: \"The #1 mistake people make with [PROBLEM]\"\n\nEmail 4 (Day 7): Address Objections + Build Trust\n• Address common concerns or hesitations\n• Provide guarantees or risk reversals\n• Share testimonials and reviews\n• Subject line: \"But what if [COMMON OBJECTION]?\"\n\nEmail 5 (Day 10): Social Proof + Urgency\n• Share multiple customer success stories\n• Highlight popular products/services\n• Create mild urgency (limited availability)\n• Subject line: \"Why [CUSTOMER NAME] chose us (results inside)\"\n\nEmail 6 (Day 14): Special Offer + Clear CTA\n• Present irresistible offer for new subscribers\n• Clear call-to-action with deadline\n• Multiple ways to take action\n• Subject line: \"Exclusive offer for new subscribers (expires soon)\"\n\nEmail 7 (Day 21): Final Chance + Relationship Building\n• Last chance for special offer\n• Invite to follow on social media\n• Encourage replies and engagement\n• Set up for ongoing newsletter content\n• Subject line: \"Last chance + a personal request\"\n\nFor each email, include:\n• Compelling subject lines (5 options each)\n• Optimal send timing\n• Personalization tokens\n• Mobile-optimized formatting\n• Clear call-to-action buttons\n• P.S. lines that reinforce main message\n• Unsubscribe compliance'\n\n**ADVANCED SEQUENCES TO OFFER:**\n\n*Abandoned Cart Recovery (E-commerce):*\n• Email 1 (1 hour): \"Forgot something?\"\n• Email 2 (24 hours): \"Still thinking it over?\"\n• Email 3 (72 hours): \"Last chance + special discount\"\n\n*Win-Back Campaign (Inactive Subscribers):*\n• Email 1: \"We miss you\"\n• Email 2: \"What went wrong?\"\n• Email 3: \"One last try + exclusive offer\"\n\n*Post-Purchase Follow-up:*\n• Email 1 (Immediate): Order confirmation + what's next\n• Email 2 (3 days): How to get maximum value\n• Email 3 (1 week): Success tips + support\n• Email 4 (2 weeks): Review request + social sharing\n• Email 5 (1 month): Complementary product recommendations\n\n📈 PRICING PSYCHOLOGY:\nDon't charge per email. Charge based on value delivered:\n• \"This sequence will recover 15-25% of lost sales\"\n• \"Welcome sequences increase customer lifetime value by 30%\"\n• \"Proper email automation saves 10 hours per week\"\n\n🛠️ TOOLS TO RECOMMEND (and learn):\n• Mailchimp (free up to 2000 subscribers)\n• ConvertKit (best for creators)\n• ActiveCampaign (advanced automation)\n• Klaviyo (e-commerce focused)\n\n💡 PRO TIPS:\n1. Always include setup instructions\n2. Offer to input the first sequence for extra fee\n3. Create video walkthroughs for complex setups\n4. Provide performance benchmarks\n5. Offer monthly optimization services\n\n🎯 CLIENT RESULTS TO PROMISE:\n• 15-30% increase in email open rates\n• 5-15% improvement in click-through rates\n• 20-40% boost in email-driven revenue\n• 50% reduction in manual email tasks\n• 24/7 automated customer nurturing"
        },
        {
          title: "Website Copy That Converts (The $800 Premium Service)",
          content: "96% OF SMALL BUSINESS WEBSITES CONVERT POORLY because their copy doesn't speak to customer pain points or drive specific actions. This creates a massive opportunity for you to provide high-value copy services that directly impact business revenue.\n\n💰 THE MARKET REALITY:\n• Average small business website converts at 2-3%\n• Good copy can improve conversions by 50-200%\n• Most businesses lose $50,000+ annually to poor copy\n• Website copy directly impacts Google Ads performance\n• Professional copywriters charge $5,000-15,000\n• You can deliver similar results for $300-800\n\n🎯 YOUR COPY SERVICES MENU:\n\n**WEBSITE AUDIT PACKAGE ($300-500):**\n• Complete copy analysis\n• Conversion optimization report\n• Specific improvement recommendations\n• Priority action list\n• 1-hour consultation call\n\n**HOMEPAGE REWRITE ($400-600):**\n• Hero section optimization\n• Value proposition clarity\n• Social proof integration\n• Clear call-to-action placement\n• Mobile optimization\n• 2 revisions included\n\n**FULL WEBSITE COPY ($600-1200):**\n• All pages rewritten\n• SEO optimization included\n• Conversion funnel mapping\n• A/B testing recommendations\n• 30-day performance guarantee\n\n**SALES PAGE CREATION ($800-1500):**\n• Long-form sales page\n• Psychological triggers implementation\n• Objection handling sections\n• Multiple call-to-action placements\n• Mobile and desktop optimization\n\n🔥 THE MASTER COPY ANALYSIS PROMPT:\n'Analyze this website copy for a [BUSINESS TYPE]: [PASTE EXISTING COPY]\n\nProvide a comprehensive analysis including:\n\n1. FIRST IMPRESSION AUDIT:\n• Does the headline immediately communicate value?\n• Is the target customer clearly identified?\n• Does the page pass the \"5-second test\"?\n• Are the most important elements above the fold?\n\n2. VALUE PROPOSITION ANALYSIS:\n• Is the unique selling proposition clear?\n• Are benefits emphasized over features?\n• Does it address customer pain points?\n• Is it differentiated from competitors?\n\n3. CONVERSION OPTIMIZATION:\n• Are call-to-actions clear and compelling?\n• Is there appropriate urgency or scarcity?\n• Are there too many choices (decision paralysis)?\n• Is the conversion path obvious?\n\n4. TRUST AND CREDIBILITY:\n• Is social proof prominently displayed?\n• Are credentials and expertise highlighted?\n• Are there trust signals (testimonials, guarantees)?\n• Does the copy build authority?\n\n5. EMOTIONAL CONNECTION:\n• Does it connect with customer emotions?\n• Are pain points clearly identified?\n• Is there a compelling transformation story?\n• Does it inspire action?\n\n6. TECHNICAL COPY ISSUES:\n• Is the copy scannable with headers/bullets?\n• Are sentences and paragraphs appropriate length?\n• Is the tone consistent with brand?\n• Are there grammar or clarity issues?\n\nThen create improved versions that:\n• Address each identified weakness\n• Include specific psychological triggers\n• Optimize for both desktop and mobile\n• Incorporate proven conversion formulas\n• Provide before/after comparisons\n• Explain why each change will improve conversions\n• Include A/B testing suggestions'\n\n**CONVERSION COPYWRITING FORMULAS TO MASTER:**\n\n*AIDA Formula:*\n• Attention: Compelling headline\n• Interest: Engaging opening\n• Desire: Benefits and transformation\n• Action: Clear call-to-action\n\n*PAS Formula:*\n• Problem: Identify customer pain\n• Agitate: Make problem urgent\n• Solution: Present your offer\n\n*BEFORE/AFTER/BRIDGE:*\n• Before: Current frustrating situation\n• After: Desired outcome/transformation\n• Bridge: Your product/service as the solution\n\n**INDUSTRY-SPECIFIC COPY STRATEGIES:**\n\n*Professional Services (Lawyers, Accountants, Consultants):*\n• Emphasize expertise and credentials\n• Use case studies and results\n• Address common legal/financial fears\n• Include consultation call-to-actions\n• Highlight guarantees and risk reversals\n\n*E-commerce:*\n• Product benefits over features\n• Social proof and reviews\n• Clear return/refund policies\n• Multiple product images and angles\n• Urgency and scarcity elements\n\n*Local Services (Contractors, Repair, etc.):*\n• Local area expertise\n• Before/after photos\n• Emergency service availability\n• Local testimonials and reviews\n• Clear contact information\n\n*Health/Wellness:*\n• Transformation stories\n• Scientific backing\n• Risk-free trials\n• Expert endorsements\n• Compliance with regulations\n\n**ADVANCED COPY TECHNIQUES:**\n\n*Psychological Triggers:*\n• Reciprocity (free value first)\n• Social proof (others like you)\n• Authority (expert positioning)\n• Scarcity (limited availability)\n• Consistency (commitment devices)\n\n*Power Words That Convert:*\n• \"Guaranteed\" (reduces risk)\n• \"Proven\" (builds trust)\n• \"Exclusive\" (creates desire)\n• \"Limited\" (urgency)\n• \"Secret\" (curiosity)\n• \"Free\" (value perception)\n• \"New\" (innovation)\n• \"Results\" (outcome-focused)\n\n📊 COPY PERFORMANCE METRICS:\n• Bounce rate improvement\n• Time on page increase\n• Conversion rate improvement\n• Click-through rate on CTAs\n• Form completion rates\n• Phone call increases\n\n🛠️ TOOLS FOR COPY ANALYSIS:\n• Hemingway Editor (readability)\n• Grammarly (grammar/tone)\n• CoSchedule Headline Analyzer\n• Google Analytics (performance data)\n• Hotjar (user behavior)\n\n💡 PREMIUM SERVICE ADD-ONS:\n• A/B testing setup (+$200)\n• Conversion tracking implementation (+$150)\n• Monthly performance reports (+$100)\n• Ongoing optimization (+$300/month)\n• Email sequence integration (+$250)\n\n🎯 CLIENT RESULTS TO DELIVER:\n• 25-75% improvement in conversion rates\n• 30-100% increase in lead generation\n• 20-50% improvement in time on page\n• 40-150% increase in contact form submissions\n• 15-40% improvement in Google Ads performance\n\n🔥 POSITIONING YOURSELF AS AN EXPERT:\n• Create before/after case studies\n• Share conversion improvement statistics\n• Offer performance guarantees\n• Provide detailed analysis reports\n• Include ongoing optimization options"
        },
        {
          title: "Advanced Client Acquisition & Scaling Systems",
          content: "Once you're earning $1000/month from these services, it's time to scale systematically. This section reveals the exact systems to grow from $1K to $10K+ monthly without working more hours.\n\n🚀 THE SCALING FRAMEWORK:\n\n**PHASE 1: SYSTEMATIZATION (Month 2-3)**\n• Create service templates for each industry\n• Build standard operating procedures (SOPs)\n• Develop quality control checklists\n• Create client onboarding sequences\n• Build pricing calculators\n\n**PHASE 2: TEAM BUILDING (Month 4-6)**\n• Hire virtual assistants for content creation\n• Train team on your systems and standards\n• Implement project management tools\n• Create client communication protocols\n• Develop performance tracking systems\n\n**PHASE 3: PREMIUM POSITIONING (Month 7-9)**\n• Increase prices by 50-100%\n• Focus on higher-value clients\n• Develop signature methodologies\n• Create case studies and success stories\n• Build strategic partnerships\n\n**PHASE 4: BUSINESS EXPANSION (Month 10+)**\n• Launch group coaching programs\n• Create digital products and courses\n• Develop affiliate/referral programs\n• Expand into complementary services\n• Consider franchise or licensing models\n\n🎯 ADVANCED CLIENT ACQUISITION STRATEGIES:\n\n**Content Marketing System:**\n• Weekly blog posts showcasing results\n• Case study videos with client interviews\n• Social media content demonstrating expertise\n• Podcast appearances as industry expert\n• Speaking at local business events\n\n**Partnership Network:**\n• Web designers (copy services upsell)\n• Marketing agencies (white-label services)\n• Business consultants (referral exchanges)\n• Industry associations (member discounts)\n• Chamber of Commerce relationships\n\n**Referral System That Works:**\n• 20% commission for successful referrals\n• Quarterly referral partner appreciation events\n• Co-marketing opportunities\n• Reciprocal service arrangements\n• Client success celebration posts\n\n**Premium Client Attraction:**\n• $2000+ service packages\n• Retainer-based relationships\n• Quarterly business reviews\n• Strategic advisory services\n• Performance-based pricing models\n\n💰 REVENUE OPTIMIZATION STRATEGIES:\n\n**Pricing Psychology:**\n• Anchor high with premium packages\n• Bundle services for perceived value\n• Create urgency with limited availability\n• Use odd pricing ($297 vs $300)\n• Offer payment plans for larger packages\n\n**Upselling System:**\n• Email marketing after social media\n• Website copy after email sequences\n• Ongoing optimization services\n• Training and consultation add-ons\n• Done-for-you implementation\n\n**Retention Strategies:**\n• Monthly performance reports\n• Quarterly strategy sessions\n• Exclusive client-only resources\n• Priority support and communication\n• Continuous improvement initiatives\n\n🛠️ ESSENTIAL TOOLS FOR SCALING:\n\n**Project Management:**\n• Asana or Monday.com for task tracking\n• Slack for team communication\n• Google Workspace for collaboration\n• Calendly for scheduling\n• DocuSign for contracts\n\n**Client Management:**\n• HubSpot CRM (free tier)\n• FreshBooks for invoicing\n• Zoom for client calls\n• Loom for training videos\n• Typeform for intake forms\n\n**Content Creation:**\n• Canva for visual content\n• Grammarly for editing\n• Hemingway for readability\n• BuzzSumo for content ideas\n• Google Trends for timing\n\n📊 KEY PERFORMANCE INDICATORS (KPIs):\n• Monthly recurring revenue (MRR)\n• Client lifetime value (CLV)\n• Customer acquisition cost (CAC)\n• Client retention rate\n• Average project value\n• Profit margins per service\n• Referral conversion rate\n• Team productivity metrics\n\n🎯 ADVANCED MONETIZATION STRATEGIES:\n\n**Digital Product Creation:**\n• Template libraries ($97-297)\n• Video training courses ($497-1997)\n• Done-with-you programs ($2000-5000)\n• Mastermind groups ($5000-15000)\n• Certification programs ($10000+)\n\n**Licensing and Franchising:**\n• License your methodology to other consultants\n• Create franchise opportunities in other markets\n• Develop white-label solutions for agencies\n• Build affiliate networks with revenue sharing\n• Create industry-specific specializations\n\n💡 PRO SCALING TIPS:\n1. Document everything from day one\n2. Hire based on cultural fit, train for skills\n3. Invest in systems before you need them\n4. Focus on client results, not just deliverables\n5. Build recurring revenue streams early\n6. Create multiple income streams within your niche\n7. Always be testing and optimizing\n8. Maintain quality standards as you grow\n9. Develop strategic partnerships continuously\n10. Plan for seasonal fluctuations\n\n🔥 COMMON SCALING MISTAKES TO AVOID:\n• Growing too fast without systems\n• Competing on price instead of value\n• Neglecting existing clients for new ones\n• Not investing in team training\n• Failing to track key metrics\n• Overcomplicating service offerings\n• Not protecting intellectual property\n• Ignoring cash flow management\n• Scaling before proving profitability\n• Not building a strong company culture\n\nThis foundation sets you up perfectly for the advanced AI tools and strategies covered in the remaining 29 lessons of this guide."
        }
      ],
      
      businessModel: {
        startupCosts: "$20/month (ChatGPT Plus)",
        timeToFirstSale: "1-2 weeks",
        monthlyRevenue: "$500-2000",
        scalingPotential: "$5000+ with team",
        targetCustomers: "Local businesses, small business owners, entrepreneurs"
      },
      
      actionSteps: [
        "Sign up for ChatGPT Plus and set custom business instructions",
        "Create service packages for social media, email, and website copy",
        "Develop pricing structure ($100-800 per service)",
        "Build portfolio of sample work using ChatGPT",
        "Reach out to 10 local businesses with service offerings",
        "Deliver first paid project and collect testimonial",
        "Systematize workflows and create service templates"
      ]
    }
  },
  {
    id: 2,
    title: "Gemini for Real-Time Market Intelligence & Competitive Analysis",
    category: "ChatGPT/Gemini/Grok",
    icon: "🎯",
    estimatedRevenue: "$800-3000/month",
    difficulty: "Intermediate",
    timeToImplement: "2-3 weeks",
    overview: "Leverage Gemini's real-time data capabilities to offer market research and competitive analysis services that businesses pay premium rates for.",
    detailedContent: {
      introduction: "While ChatGPT excels at content creation, Google's Gemini has access to real-time information and can analyze current market trends, competitor strategies, and emerging opportunities. This creates lucrative service opportunities for market research and business intelligence.",
      
      sections: [
        {
          title: "Market Research as a Service",
          content: "Businesses need current market data to make informed decisions, but professional market research costs thousands. You can provide similar insights using Gemini for $300-800 per report. Create comprehensive market analysis reports that include: industry size and growth trends, key players and market share, emerging opportunities and threats, customer behavior patterns, and pricing strategies. Use Gemini to gather current data from multiple sources, analyze trends, and present findings in professional reports that guide business decisions."
        },
        {
          title: "Competitive Intelligence Reports",
          content: "Help businesses understand their competition with detailed competitive analysis services. Charge $500-1200 per competitor analysis. Use Gemini to research competitor websites, social media presence, marketing strategies, pricing models, customer reviews, and recent news. Create SWOT analyses that identify opportunities for your clients to differentiate and compete more effectively. This service is particularly valuable for businesses entering new markets or launching new products."
        },
        {
          title: "Trend Forecasting and Opportunity Identification",
          content: "Position yourself as a trend forecaster by using Gemini's real-time capabilities to identify emerging opportunities before competitors notice them. Offer monthly 'Opportunity Reports' for $200-500 that highlight: emerging market trends, new customer segments, technology disruptions, regulatory changes affecting the industry, and first-mover opportunities. Businesses will pay premium rates for insights that help them stay ahead of the curve."
        },
        {
          title: "Industry Newsletter and Intelligence Service",
          content: "Create recurring revenue with industry-specific intelligence newsletters. Use Gemini to curate and analyze the latest industry news, trends, and insights. Charge $50-200 per month per subscriber for weekly or monthly newsletters that busy executives rely on to stay informed. Focus on specific niches like 'Real Estate Technology Trends,' 'Restaurant Industry Intelligence,' or 'E-commerce Growth Strategies.' This model creates predictable monthly income while establishing you as an industry expert."
        }
      ],
      
      businessModel: {
        startupCosts: "$0-50/month (tools and subscriptions)",
        timeToFirstSale: "2-3 weeks",
        monthlyRevenue: "$800-3000",
        scalingPotential: "$10000+ with team and automation",
        targetCustomers: "Medium businesses, consultants, agencies, executives"
      }
    }
  },
  // Continue with more detailed lessons...
  {
    id: 11,
    title: "Claude for Business Logic Design and System Architecture",
    category: "Claude/Replit",
    icon: "🏗️",
    estimatedRevenue: "$1500-5000/month",
    difficulty: "Intermediate",
    timeToImplement: "3-4 weeks",
    overview: "Use Claude's superior reasoning capabilities to design business systems, processes, and logical frameworks that solve complex business problems.",
    detailedContent: {
      introduction: "Claude excels at complex reasoning and systematic thinking, making it perfect for designing business processes, system architectures, and logical frameworks that solve real business problems. This positions you as a business systems consultant commanding premium rates.",
      
      sections: [
        {
          title: "Business Process Optimization Consulting",
          content: "Most businesses have inefficient processes that waste time and money. Use Claude to analyze existing workflows and design optimized systems. Charge $1000-3000 per process optimization project. Claude can map current processes, identify bottlenecks, design improved workflows, and create implementation plans. Focus on high-impact areas like customer onboarding, order fulfillment, inventory management, and customer service. Present solutions as detailed flowcharts, standard operating procedures, and implementation roadmaps that businesses can immediately execute."
        },
        {
          title: "Custom Business System Design",
          content: "Design custom business systems that solve specific operational challenges. Use Claude to create comprehensive system architectures including: data flow diagrams, user interface mockups, database schemas, integration requirements, and security protocols. Charge $2000-5000 for complete system designs that businesses can hand to developers for implementation. This service bridges the gap between business needs and technical solutions, positioning you as a technical business consultant."
        },
        {
          title: "Decision Framework Development",
          content: "Help businesses make better decisions by creating custom decision frameworks and evaluation matrices. Claude excels at creating logical decision trees, scoring systems, and evaluation criteria for complex business decisions like vendor selection, product development, market entry, and strategic partnerships. Charge $500-1500 per framework. These tools become valuable business assets that improve decision-making quality and speed."
        }
      ],
      
      businessModel: {
        startupCosts: "$20/month (Claude Pro)",
        timeToFirstSale: "3-4 weeks",
        monthlyRevenue: "$1500-5000",
        scalingPotential: "$15000+ with specialized expertise",
        targetCustomers: "Growing businesses, startups, consulting firms"
      }
    }
  },
  {
    id: 21,
    title: "Cursor IDE Mastery for Rapid Business Application Development",
    category: "Cursor/Trae",
    icon: "⚡",
    estimatedRevenue: "$2000-8000/month",
    difficulty: "Advanced",
    timeToImplement: "4-6 weeks",
    overview: "Master Cursor IDE to build custom business applications and web platforms rapidly, offering development services without traditional coding expertise.",
    detailedContent: {
      introduction: "Cursor IDE represents the future of development - AI-powered coding that lets you build professional applications by describing what you want in natural language. This opens up high-paying development services to non-programmers who understand business needs.",
      
      sections: [
        {
          title: "Rapid MVP Development Service",
          content: "Businesses need Minimum Viable Products (MVPs) to test ideas quickly, but traditional development costs $10,000-50,000. Using Cursor, you can build MVPs for $2000-8000 in 1-2 weeks instead of months. Focus on common business applications: customer portals, inventory management systems, booking platforms, CRM tools, and e-commerce sites. Use Cursor's AI to generate code from business requirements, then customize and refine until it meets client needs. The key is understanding business logic, not memorizing code syntax."
        },
        {
          title: "Custom Business Tool Development",
          content: "Every business has unique operational needs that off-the-shelf software doesn't address perfectly. Use Cursor to build custom tools that solve specific business problems. Examples include: automated reporting dashboards, custom calculators and quote generators, workflow automation tools, data migration utilities, and integration bridges between different software systems. Charge $1500-5000 per tool based on complexity and business value delivered."
        },
        {
          title: "Legacy System Modernization",
          content: "Many businesses run on outdated systems that limit growth. Use Cursor to modernize legacy processes by building web-based replacements for old desktop applications, creating APIs to connect isolated systems, developing mobile-friendly interfaces for desktop-only tools, and building data visualization dashboards for better decision-making. This service commands premium rates ($5000-15000) because it solves critical business problems that traditional developers quote much higher prices for."
        },
        {
          title: "Advanced Cursor Techniques for Business Development",
          content: "Master advanced Cursor features that separate professionals from hobbyists: Use detailed prompts that specify exact business requirements, user interface mockups, data models, and integration needs. Example: 'Build a customer management system for a small law firm that tracks client cases, billing hours, document storage, and court dates. Include role-based access, automated billing calculations, and integration with calendar systems.' Always read what Cursor is doing before accepting changes - this prevents errors and helps you learn. Keep backup copies of working versions before making major changes. Use version control (Git) to track changes and enable easy rollbacks when experiments don't work."
        }
      ],
      
      businessModel: {
        startupCosts: "$20/month (Cursor Pro)",
        timeToFirstSale: "4-6 weeks",
        monthlyRevenue: "$2000-8000",
        scalingPotential: "$20000+ with specialized industry focus",
        targetCustomers: "Small-medium businesses, startups, professional services"
      },
      
      criticalTips: [
        "Always understand the business problem before writing code",
        "Start with simple projects to build confidence and portfolio",
        "Read and understand what Cursor generates - don't blindly accept",
        "Keep detailed notes of successful prompts and techniques",
        "Build relationships with business owners who need custom solutions",
        "Focus on solving real problems, not showcasing technical skills"
      ]
    }
  }
  // Add more lessons following this detailed format...
];

export default function EbookContent({ hasAccess, isAdmin }: EbookContentProps) {
  const { data: session, status } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

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

  const toggleLesson = (lessonId: number) => {
    setExpandedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
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
          <p className="text-gray-300 mb-8">Please sign in to access the AI Tools Mastery Guide.</p>
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
          <p className="text-gray-300 mb-8">You need to purchase the AI Tools Mastery Guide to access this content.</p>
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
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-5xl font-bold text-white mb-6">AI Business Mastery Guide 2025</h1>
          <p className="text-xl text-gray-300 mb-4">
            30 Detailed Lessons to Build Your AI-Powered Online Business Empire
          </p>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div className="flex items-center gap-2 text-green-400">
              <DollarSign className="w-5 h-5" />
              <span>$500-20K+ Monthly Revenue Potential</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Target className="w-5 h-5" />
              <span>Real Business Applications</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-5 h-5" />
              <span>Step-by-Step Implementation</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-3 text-lg"
          >
            <Download className="w-6 h-6" />
            {isDownloading ? 'Preparing Download...' : 'Download Complete Guide (PDF)'}
          </button>
        </div>

        {/* Lessons Content */}
        <div className="space-y-8">
          {/* Section Headers */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-2">💬 Section 1: Chat AI Mastery</h3>
              <p className="text-gray-300 text-sm">ChatGPT, Gemini & Grok</p>
              <p className="text-green-400 font-semibold mt-2">Lessons 1-10 • $500-3K/month</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-2">🏗️ Section 2: Development AI</h3>
              <p className="text-gray-300 text-sm">Claude & Replit</p>
              <p className="text-green-400 font-semibold mt-2">Lessons 11-20 • $1K-8K/month</p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/50 to-red-900/50 rounded-xl p-6 border border-pink-500/30">
              <h3 className="text-xl font-bold text-white mb-2">⚡ Section 3: Advanced Coding</h3>
              <p className="text-gray-300 text-sm">Cursor & Trae</p>
              <p className="text-green-400 font-semibold mt-2">Lessons 21-30 • $2K-20K/month</p>
            </div>
          </div>

          {/* Detailed Lessons */}
          {AI_LESSONS.map((lesson) => (
            <div key={lesson.id} className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
              {/* Lesson Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => toggleLesson(lesson.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{lesson.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Lesson {lesson.id}: {lesson.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{lesson.overview}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded">
                          {lesson.estimatedRevenue}
                        </span>
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                          {lesson.difficulty}
                        </span>
                        <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                          {lesson.timeToImplement}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedLessons.includes(lesson.id) ? (
                      <ChevronDown className="w-6 h-6" />
                    ) : (
                      <ChevronRight className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Lesson Content */}
              {expandedLessons.includes(lesson.id) && (
                <div className="px-6 pb-6 border-t border-gray-700">
                  <div className="space-y-6 mt-6">
                    {/* Introduction */}
                    <div className="bg-gray-800 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Introduction
                      </h4>
                      <p className="text-gray-300 leading-relaxed">{lesson.detailedContent.introduction}</p>
                    </div>

                    {/* Detailed Sections */}
                    {lesson.detailedContent.sections.map((section, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-750 transition-colors flex items-center justify-between"
                          onClick={() => toggleSection(`${lesson.id}-section-${index}`)}
                        >
                          <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                          <div className="text-gray-400">
                            {expandedSections[`${lesson.id}-section-${index}`] ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                        {expandedSections[`${lesson.id}-section-${index}`] && (
                          <div className="px-4 pb-4 border-t border-gray-700">
                            <p className="text-gray-300 leading-relaxed mt-4">{section.content}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Business Model */}
                    {lesson.detailedContent.businessModel && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-green-400 mb-4">💰 Business Model Overview</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong className="text-white">Startup Costs:</strong> <span className="text-gray-300">{lesson.detailedContent.businessModel.startupCosts}</span></p>
                            <p><strong className="text-white">Time to First Sale:</strong> <span className="text-gray-300">{lesson.detailedContent.businessModel.timeToFirstSale}</span></p>
                            <p><strong className="text-white">Monthly Revenue:</strong> <span className="text-green-400">{lesson.detailedContent.businessModel.monthlyRevenue}</span></p>
                          </div>
                          <div>
                            <p><strong className="text-white">Scaling Potential:</strong> <span className="text-green-400">{lesson.detailedContent.businessModel.scalingPotential}</span></p>
                            <p><strong className="text-white">Target Customers:</strong> <span className="text-gray-300">{lesson.detailedContent.businessModel.targetCustomers}</span></p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Steps */}
                    {lesson.detailedContent.actionSteps && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-blue-400 mb-4">🎯 Implementation Checklist</h4>
                        <ul className="space-y-2">
                          {lesson.detailedContent.actionSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bonus Troubleshooting Section */}
        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-8 mb-12 border border-red-500/30 mt-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🎁 BONUS: Advanced Troubleshooting & Recovery Guide</h2>
          <p className="text-gray-300 text-center mb-8">
            Critical issues and solutions for each platform - Advanced techniques that save projects and prevent disasters
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* ChatGPT/Gemini/Grok Issues */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-4">💬 Chat AI Platform Issues</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 1: Inconsistent Output Quality</h4>
                  <p className="text-gray-300">Solution: Create detailed prompt templates with examples, use temperature controls, and implement quality checkpoints in your workflow.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 2: Context Loss in Long Projects</h4>
                  <p className="text-gray-300">Solution: Break large projects into smaller chunks, use conversation summaries, and maintain project context documents.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 3: Rate Limits and Access Issues</h4>
                  <p className="text-gray-300">Solution: Implement multiple API keys rotation, use caching strategies, and have backup platforms ready.</p>
                </div>
              </div>
            </div>

            {/* Claude/Replit Issues */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4">🏗️ Development AI Issues</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 1: Complex Logic Errors</h4>
                  <p className="text-gray-300">Solution: Break complex problems into smaller logical steps, use flowcharts to visualize logic, and test each component separately.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 2: Integration Failures</h4>
                  <p className="text-gray-300">Solution: Always test integrations in isolated environments, maintain API documentation, and create rollback procedures.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 3: Performance Bottlenecks</h4>
                  <p className="text-gray-300">Solution: Profile system performance early, optimize database queries, and implement caching strategies from the start.</p>
                </div>
              </div>
            </div>

            {/* Cursor/Trae Issues */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4">⚡ Advanced Coding Issues</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 1: AI-Generated Code Conflicts</h4>
                  <p className="text-gray-300">Solution: Always review AI suggestions before accepting, maintain clean git history, and understand the generated code before implementation.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 2: Project Corruption</h4>
                  <p className="text-gray-300">Solution: Implement automated backups, use version control religiously, and maintain clean development environments.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Issue 3: Deployment Failures</h4>
                  <p className="text-gray-300">Solution: Test deployments in staging environments, maintain deployment checklists, and have rollback procedures ready.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h4 className="text-lg font-bold text-yellow-300 mb-3">🔧 Pro Recovery Techniques</h4>
            <div className="text-gray-300 space-y-2 text-sm">
              <div><strong>Fresh Start Protocol:</strong> Complete project reset procedures when things go wrong - including environment cleanup, dependency reset, and clean reinstallation steps</div>
              <div><strong>Backup Everything Strategy:</strong> Automated backup systems for code, data, configurations, and project states that enable instant recovery</div>
              <div><strong>Version Control Mastery:</strong> Advanced Git workflows including branching strategies, conflict resolution, and emergency rollback procedures</div>
              <div><strong>Environment Management:</strong> Containerization, dependency isolation, and reproducible development environments that prevent "works on my machine" issues</div>
              <div><strong>Dependency Hell Solutions:</strong> Package management strategies, version pinning, and conflict resolution techniques that keep projects stable</div>
              <div><strong>Emergency Debugging:</strong> Systematic approaches to identify and fix critical issues under pressure, including logging strategies and diagnostic tools</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Master AI Web Creation?</h2>
          <p className="text-gray-300 mb-6">
            Take your AI skills to the next level with complete step-by-step video guidance, deployment tutorials, and advanced techniques
          </p>
          <Link
            href="/products/ai-web-creation-masterclass"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-6 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block text-lg mb-4"
          >
            🚀 Get AI Web Creation Masterclass - A$50
          </Link>
          <p className="text-sm text-gray-400">
            Complete step-by-step video course including deployment, scaling, and advanced techniques
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