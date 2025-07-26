'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import toast from 'react-hot-toast';

export default function PromptsContent() {
  const { user } = useSimpleAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const searchParams = useSearchParams();
  const guestEmail = searchParams.get('email');
  const orderToken = searchParams.get('token');
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const isAdmin = searchParams.get('admin') === 'true';

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Check if we have guest access parameters
        const hasGuestParams = sessionId && orderToken;
        
        // If no user and no guest params, redirect to login
        if (!user && !hasGuestParams) {
          router.push('/login?redirect=/downloads/prompts');
          return;
        }

        // Use the verify-vip-access API which handles both admin and user access
        const response = await fetch('/api/verify-vip-access', {
          credentials: 'include'
        });
        const data = await response.json();
        
        // Check if user has access to the prompts (product ID 2)
        let hasPromptsAccess = data.isAdmin || data.purchases?.some((purchase: any) => 
          purchase.id === '2' || purchase.id === 2 ||
          purchase.name?.toLowerCase().includes('prompts') ||
          purchase.name?.toLowerCase().includes('arsenal')
        );
        
        // If no user access but we have guest params, verify guest access
        if (!hasPromptsAccess && hasGuestParams) {
          try {
            const guestResponse = await fetch(`/api/verify-download?productType=prompts&session_id=${encodeURIComponent(sessionId!)}&token=${encodeURIComponent(orderToken!)}&order_id=${encodeURIComponent(orderId || '')}`);
            const guestData = await guestResponse.json();
            hasPromptsAccess = guestData.hasAccess;
          } catch (guestError) {
            console.error('Guest verification error:', guestError);
          }
        }
        
        setHasAccess(hasPromptsAccess);
        
        if (!hasPromptsAccess) {
          toast.error('You need to purchase the AI Prompts Arsenal to access this content.');
        }
      } catch (error) {
        console.error('Error verifying access:', error);
        toast.error('Error verifying access. Please try again.');
        setHasAccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [user, router, sessionId, orderToken, orderId]);

  // Progress bar functionality
  useEffect(() => {
    const updateProgressBar = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      const progressBar = document.getElementById('progressBar');
      if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
      }
    };

    window.addEventListener('scroll', updateProgressBar);
    return () => window.removeEventListener('scroll', updateProgressBar);
  }, [hasAccess]);

  const handleDownload = () => {
    if (!hasAccess) {
      toast.error('You need to purchase this product first!');
      return;
    }

    setIsDownloading(true);
    
    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = '/downloads/ai-prompts-collection.pdf';
    link.download = 'AI-Prompts-Collection-Ventaro.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success toast
    toast.success('Your download has started!');
    
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-8">
              You need to purchase the AI Prompts Arsenal to access this content.
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/products/2" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
              >
                Purchase for $10.00
              </Link>
              <Link href="/my-account" className="text-blue-400 hover:text-blue-300">
                ← Back to My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const promptCategories = [
    {
      title: "Part 1: Foundation & Business Ideation",
      prompts: [
        {
          title: "1. Niche Market Brainstorm",
          prompt: "Act as a business strategist. Generate 10 niche business ideas that combine my passion for [e.g., sustainable gardening] with my skill in [e.g., digital marketing]. For each idea, provide a target audience, a unique value proposition, and a potential monetization model."
        },
        {
          title: "2. Competitive Analysis",
          prompt: "I want to start an online business in the [e.g., gourmet coffee subscription] market. Act as a market research analyst. Provide a detailed report on the top 3 competitors, including their strengths, weaknesses, pricing strategies, and marketing channels."
        },
        {
          title: "3. Business Name Generation",
          prompt: "Generate 20 creative business names for my new online store that will sell [e.g., handmade ceramic mugs]. The names should be memorable, easy to spell, and reflect a brand identity that is [e.g., rustic, minimalist, and warm]. Suggest if a .com domain is likely available."
        },
        {
          title: "4. Mission and Vision Statement",
          prompt: "Help me write a compelling mission and vision statement for my [e.g., online fitness coaching business for busy parents]. My core values are [e.g., empowerment, accessibility, and results]. Make it inspiring and actionable."
        },
        {
          title: "5. Target Audience Definition",
          prompt: "Define my ideal customer for [BUSINESS TYPE]. Create a detailed customer persona including demographics, psychographics, pain points, goals, preferred communication channels, and buying behavior. Include 3 specific customer scenarios."
        }
      ]
    },
    {
      title: "Part 2: Content Creation & Marketing",
      prompts: [
        {
          title: "6. Blog Content Calendar",
          prompt: "Create a 3-month blog content calendar for my [BUSINESS TYPE] targeting [AUDIENCE]. Include 24 blog post titles, target keywords, content types (how-to, listicle, case study), and publishing schedule. Focus on [MAIN TOPIC/NICHE]."
        },
        {
          title: "7. Social Media Strategy",
          prompt: "Develop a comprehensive social media strategy for [PLATFORM] to promote my [BUSINESS/PRODUCT]. Include content pillars, posting frequency, hashtag strategy, engagement tactics, and 30 post ideas with captions."
        },
        {
          title: "8. Email Newsletter Template",
          prompt: "Create a weekly email newsletter template for [BUSINESS TYPE]. Include subject line formulas, content structure, call-to-actions, and 5 sample newsletters. Target audience: [AUDIENCE]. Goal: [OBJECTIVE]."
        },
        {
          title: "9. Video Content Scripts",
          prompt: "Write scripts for 10 short-form videos (60-90 seconds) about [TOPIC] for [PLATFORM]. Include hooks, main points, visual cues, and strong CTAs. Style: [EDUCATIONAL/ENTERTAINING/INSPIRATIONAL]. Target: [AUDIENCE]."
        },
        {
          title: "10. SEO Content Optimizer",
          prompt: "Optimize this content for SEO: [PASTE YOUR CONTENT]. Target keyword: [KEYWORD]. Improve title tags, meta descriptions, header structure, internal linking opportunities, and keyword density while maintaining readability."
        }
      ]
    },
    {
      title: "Part 3: Sales & Conversion",
      prompts: [
        {
          title: "11. Sales Page Creator",
          prompt: "Write a high-converting sales page for [PRODUCT/SERVICE]. Price: [PRICE]. Include: compelling headline, problem agitation, solution presentation, benefits vs features, social proof, objection handling, urgency, and multiple CTAs."
        },
        {
          title: "12. Email Sales Sequence",
          prompt: "Create a 7-email sales sequence for [PRODUCT/SERVICE]. Include: welcome email, value-driven content, social proof, objection handling, urgency, and final call. Target: [AUDIENCE]. Price: [PRICE]. Launch date: [DATE]."
        },
        {
          title: "13. Product Description Writer",
          prompt: "Write compelling product descriptions for [PRODUCT]. Include: attention-grabbing title, key benefits, features, specifications, use cases, and emotional triggers. Target customer: [CUSTOMER PROFILE]. Tone: [TONE]."
        },
        {
          title: "14. Objection Handler",
          prompt: "List 15 common objections for [PRODUCT/SERVICE] and provide compelling responses. Include emotional and logical arguments, social proof, risk reversal, and guarantee information. Price point: [PRICE]."
        },
        {
          title: "15. Upsell & Cross-sell Creator",
          prompt: "Create upsell and cross-sell offers for customers who bought [MAIN PRODUCT]. Include: complementary products, bundle offers, upgrade options, and persuasive copy for each. Target: increase average order value by [PERCENTAGE]."
        }
      ]
    },
    {
      title: "Part 4: Customer Service & Retention",
      prompts: [
        {
          title: "16. Customer Onboarding Sequence",
          prompt: "Design a customer onboarding sequence for [PRODUCT/SERVICE]. Include: welcome message, setup instructions, quick wins, resource links, and check-in schedule. Goal: reduce churn and increase satisfaction."
        },
        {
          title: "17. FAQ Generator",
          prompt: "Generate 20 frequently asked questions and detailed answers for [PRODUCT/SERVICE]. Cover: features, pricing, support, refunds, technical issues, and usage. Make answers helpful and conversion-focused."
        },
        {
          title: "18. Customer Feedback Survey",
          prompt: "Create a customer satisfaction survey for [BUSINESS]. Include: rating scales, open-ended questions, improvement suggestions, and referral requests. Keep it under 5 minutes. Goal: [SPECIFIC OBJECTIVE]."
        },
        {
          title: "19. Retention Email Campaign",
          prompt: "Design a customer retention email campaign for [BUSINESS TYPE]. Include: re-engagement emails, exclusive offers, loyalty rewards, and win-back sequences. Target: customers who haven't purchased in [TIME PERIOD]."
        },
        {
          title: "20. Review & Testimonial Requests",
          prompt: "Write email templates to request reviews and testimonials from satisfied customers. Include: timing suggestions, incentive offers, multiple platform options, and follow-up sequences. Make it easy and compelling."
        }
      ]
    },
    {
      title: "Part 5: Growth & Scaling",
      prompts: [
        {
          title: "21. Partnership Proposal",
          prompt: "Write a partnership proposal for [POTENTIAL PARTNER] in [INDUSTRY]. Include: mutual benefits, collaboration ideas, revenue sharing, marketing support, and next steps. My business: [BUSINESS DESCRIPTION]."
        },
        {
          title: "22. Influencer Outreach",
          prompt: "Create an influencer outreach campaign for [PRODUCT/SERVICE]. Include: influencer criteria, outreach templates, collaboration proposals, and campaign metrics. Budget: [BUDGET]. Target audience: [AUDIENCE]."
        },
        {
          title: "23. Affiliate Program Setup",
          prompt: "Design an affiliate program for [PRODUCT/SERVICE]. Include: commission structure, promotional materials, recruitment strategy, and program guidelines. Target: [NUMBER] affiliates generating [REVENUE] monthly."
        },
        {
          title: "24. Market Expansion Strategy",
          prompt: "Develop a strategy to expand [BUSINESS] into [NEW MARKET/DEMOGRAPHIC]. Include: market research, adaptation requirements, marketing approach, and risk assessment. Current success: [CURRENT METRICS]."
        },
        {
          title: "25. Automation Workflow",
          prompt: "Create automation workflows for [BUSINESS PROCESS] using [TOOLS/PLATFORMS]. Include: trigger events, action sequences, personalization elements, and success metrics. Goal: save [TIME] and improve [METRIC]."
        }
      ]
    },
    {
      title: "Part 6: Advanced Business Strategies",
      prompts: [
        {
          title: "26. Pricing Strategy Optimizer",
          prompt: "Analyze and optimize pricing for [PRODUCT/SERVICE]. Current price: [PRICE]. Include: competitor analysis, value-based pricing, psychological pricing, and testing strategies. Goal: maximize [REVENUE/PROFIT/MARKET SHARE]."
        },
        {
          title: "27. Crisis Management Plan",
          prompt: "Create a crisis management plan for [BUSINESS TYPE]. Include: potential scenarios, response protocols, communication templates, and recovery strategies. Focus on: [SPECIFIC RISKS/CONCERNS]."
        },
        {
          title: "28. Innovation Pipeline",
          prompt: "Develop an innovation pipeline for [BUSINESS]. Include: idea generation methods, evaluation criteria, development phases, and launch strategies. Focus areas: [PRODUCT/SERVICE/PROCESS] innovation."
        },
        {
          title: "29. Exit Strategy Planning",
          prompt: "Create an exit strategy plan for [BUSINESS]. Include: valuation methods, potential buyers, preparation timeline, and value optimization tactics. Current status: [BUSINESS METRICS]. Target timeline: [TIMEFRAME]."
        },
        {
          title: "30. Legacy Business Model",
          prompt: "Design a sustainable, legacy business model for [INDUSTRY]. Include: recurring revenue streams, scalability factors, competitive moats, and long-term vision. Values: [CORE VALUES]. Impact goal: [DESIRED IMPACT]."
        }
      ]
    }
  ];

  const [activeModule, setActiveModule] = useState<number | null>(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleModule = (moduleIndex: number) => {
    setActiveModule(activeModule === moduleIndex ? null : moduleIndex);
  };

  const selectLesson = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex);
  };

  const markLessonComplete = (lessonIndex: number) => {
    setCompletedLessons(prev => new Set(Array.from(prev).concat(lessonIndex)));
  };

  const getTotalLessons = () => {
    return promptCategories.reduce((total, category) => total + category.prompts.length, 0);
  };

  const getProgressPercentage = () => {
    return (completedLessons.size / getTotalLessons()) * 100;
  };

  const getCurrentPrompt = () => {
    let lessonCount = 0;
    for (const category of promptCategories) {
      for (const prompt of category.prompts) {
        if (lessonCount === currentLesson) {
          return { prompt, category };
        }
        lessonCount++;
      }
    }
    return { prompt: promptCategories[0].prompts[0], category: promptCategories[0] };
  };

  const { prompt: currentPromptData, category: currentCategory } = getCurrentPrompt();

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-color: #111827;
          --sidebar-bg: #1f2937;
          --content-bg: #111827;
          --card-bg: #1f2937;
          --border-color: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #9ca3af;
          --text-accent: #e5e7eb;
          --accent-primary: #4f46e5;
          --accent-secondary: #22d3ee;
          --success-color: #10b981;
          --font-primary: 'Inter', sans-serif;
          --font-mono: 'Fira Code', monospace;
        }

        .app-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-color);
          color: var(--text-primary);
          font-family: var(--font-primary);
        }

        .sidebar {
          width: 320px;
          background-color: var(--sidebar-bg);
          border-right: 1px solid var(--border-color);
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
          overflow-y: auto;
          max-height: 100vh;
        }

        .sidebar-backdrop {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 40;
        }
        
        .sidebar-backdrop.show {
          display: block;
        }

        .sidebar-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .progress-container {
          margin-top: 16px;
          margin-bottom: 24px;
        }

        .progress-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-inner {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .course-nav {
          flex-grow: 1;
          overflow-y: auto;
        }

        .module-group .module-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          cursor: pointer;
          border-top: 1px solid var(--border-color);
          margin-top: 16px;
        }

        .module-group:first-child .module-title {
          border-top: none;
          margin-top: 0;
        }

        .module-title h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-accent);
        }

        .module-title .toggle-icon {
          transition: transform 0.2s ease;
          color: var(--text-secondary);
        }

        .module-group.collapsed .toggle-icon {
          transform: rotate(-90deg);
        }

        .lesson-list {
          list-style: none;
          padding-left: 8px;
          overflow: hidden;
          max-height: 1000px;
          transition: max-height 0.5s ease-in-out, padding 0.3s ease-in-out;
        }

        .module-group.collapsed .lesson-list {
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
        }

        .lesson-list-item {
          position: relative;
        }

        .lesson-list-item:not(:first-child):before {
          content: '';
          position: absolute;
          left: 10px;
          top: -21px;
          height: 22px;
          border-left: 1px dashed var(--border-color);
        }

        .lesson-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 8px;
          border-radius: 6px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background-color 0.2s, color 0.2s;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .lesson-link:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .lesson-link.active {
          background: linear-gradient(90deg, rgba(79, 70, 229, 0.3), rgba(34, 211, 238, 0.05));
          color: var(--text-primary);
          font-weight: 500;
          border-left: 3px solid var(--accent-primary);
          padding-left: 5px;
        }

        .lesson-status {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          background-color: var(--sidebar-bg);
        }

        .lesson-list-item.completed .lesson-link {
          color: var(--success-color);
        }

        .lesson-link.active .lesson-status {
          color: var(--accent-primary);
        }

        .main-content {
          flex: 1;
          background-color: var(--content-bg);
          overflow-y: auto;
          max-height: 100vh;
        }

        .content-header {
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
          padding: 24px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          cursor: pointer;
          margin-right: 16px;
        }

        .lesson-content {
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        .prompt-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .prompt-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .prompt-box {
          background-color: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
          padding-right: 60px;
          position: relative;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-accent);
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .copy-button {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: var(--accent-primary);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .copy-button:hover {
          background-color: #3730a3;
        }

        .lesson-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .nav-button {
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .nav-button:hover {
          opacity: 0.9;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .download-section {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }

        .download-button {
          background-color: white;
          color: var(--accent-primary);
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .download-button:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }
          
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            width: 280px;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .main-content {
            width: 100%;
            margin-left: 0;
          }
          
          .lesson-content {
            padding: 16px;
          }
          
          .content-header {
            padding: 16px;
          }
          
          .prompt-card {
            padding: 16px;
          }
          
          .download-section {
            padding: 16px;
          }
        }
        
        @media (min-width: 769px) {
          .sidebar {
            position: relative;
            transform: translateX(0);
          }
          
          .sidebar.collapsed {
            transform: translateX(-100%);
          }
        }
      `}</style>
      
      <div className="app-layout">
        {/* Mobile Backdrop */}
        <div 
          className={`sidebar-backdrop ${isSidebarOpen ? 'show' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h1>AI Mastery Course</h1>
            <div className="progress-container">
              <div className="progress-label">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <nav className="course-nav">
            {promptCategories.map((category, categoryIndex) => {
              let lessonStartIndex = 0;
              for (let i = 0; i < categoryIndex; i++) {
                lessonStartIndex += promptCategories[i].prompts.length;
              }
              
              return (
                <div key={categoryIndex} className={`module-group ${activeModule !== categoryIndex ? 'collapsed' : ''}`}>
                  <div className="module-title" onClick={() => toggleModule(categoryIndex)}>
                    <h3>{category.title.replace('Part ', 'Phase ')}</h3>
                    <span className="toggle-icon">▼</span>
                  </div>
                  <ul className="lesson-list">
                    {category.prompts.map((prompt, promptIndex) => {
                      const globalLessonIndex = lessonStartIndex + promptIndex;
                      const isCompleted = completedLessons.has(globalLessonIndex);
                      const isActive = currentLesson === globalLessonIndex;
                      
                      return (
                        <li key={promptIndex} className={`lesson-list-item ${isCompleted ? 'completed' : ''}`}>
                          <div 
                            className={`lesson-link ${isActive ? 'active' : ''}`}
                            onClick={() => selectLesson(globalLessonIndex)}
                          >
                            <div className="lesson-status">
                              {isCompleted ? '✓' : isActive ? '▶' : '○'}
                            </div>
                            <span>{prompt.title}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-header">
            <button 
              className="mobile-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>The $1M+ Online Business Blueprint</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>30 AI prompts to build your profitable online business</p>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="download-button"
              >
                {isDownloading ? 'Downloading...' : '📥 Download PDF'}
              </button>
            </div>
          </div>

          <div className="lesson-content">
            <div className="download-section">
              <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '1.25rem' }}>Your Strategic Blueprint</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
                This is more than a list of prompts; it's a proven sequence for success. Work through each step and remain patient.
              </p>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="download-button"
              >
                {isDownloading ? 'Downloading...' : '📥 Download Complete Guide'}
              </button>
            </div>

            <div className="prompt-card">
              <h2 className="prompt-title">{currentPromptData.title}</h2>
              <div className="prompt-box">
                {currentPromptData.prompt.split(/\[([^\]]+)\]/).map((part, index) => 
                  index % 2 === 1 ? (
                    <span key={index} style={{ color: '#ef4444', fontWeight: 'bold' }}>[{part}]</span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(currentPromptData.prompt);
                    toast.success('Prompt copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="lesson-navigation">
              <button 
                className="nav-button"
                onClick={() => {
                  if (currentLesson > 0) {
                    selectLesson(currentLesson - 1);
                  }
                }}
                disabled={currentLesson === 0}
              >
                ← Previous
              </button>
              
              <button 
                className="nav-button"
                onClick={() => {
                  markLessonComplete(currentLesson);
                  if (currentLesson < getTotalLessons() - 1) {
                    selectLesson(currentLesson + 1);
                  } else {
                    toast.success('Congratulations! You\'ve completed all lessons!');
                  }
                }}
                disabled={currentLesson >= getTotalLessons() - 1 && completedLessons.has(currentLesson)}
              >
                {currentLesson >= getTotalLessons() - 1 ? 
                  (completedLessons.has(currentLesson) ? 'Course Complete! 🎉' : 'Complete Course 🎉') :
                  (completedLessons.has(currentLesson) ? 'Next →' : 'Complete & Next →')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}