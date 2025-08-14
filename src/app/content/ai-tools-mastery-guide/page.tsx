'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Lock, CheckCircle, Star, Zap } from 'lucide-react';
import Link from 'next/link';

// 30 AI Tools Mastery Lessons - Structured for Online Business Building
const AI_LESSONS = [
  // SECTION 1: ChatGPT, Gemini & Grok Fundamentals (Lessons 1-10)
  {
    id: 1,
    title: "ChatGPT Business Foundations",
    category: "ChatGPT/Gemini/Grok",
    content: "Master ChatGPT for business idea generation, market research, and content creation. Learn the fundamental prompt structures that generate profitable business concepts and validate market opportunities.",
    keyPoints: ["Business idea generation", "Market validation prompts", "Content strategy", "Competitive analysis"],
    practicalTip: "Use role-based prompts like 'Act as a business consultant' for more professional outputs."
  },
  {
    id: 2,
    title: "Gemini for Real-Time Market Intelligence",
    category: "ChatGPT/Gemini/Grok",
    content: "Leverage Gemini's real-time capabilities to track market trends, analyze competitors, and identify emerging opportunities in your niche before others do.",
    keyPoints: ["Real-time trend analysis", "Competitor monitoring", "Opportunity identification", "Market timing"],
    practicalTip: "Ask Gemini to compare current trends vs historical data for better insights."
  },
  {
    id: 3,
    title: "Grok for Social Media Intelligence",
    category: "ChatGPT/Gemini/Grok",
    content: "Use Grok's X/Twitter integration to understand viral content patterns, track social sentiment, and create content that resonates with your target audience.",
    keyPoints: ["Viral content analysis", "Social sentiment tracking", "Audience insights", "Content optimization"],
    practicalTip: "Use Grok to analyze successful posts in your niche and identify winning patterns."
  },
  {
    id: 4,
    title: "Advanced Prompt Engineering for Business",
    category: "ChatGPT/Gemini/Grok",
    content: "Master advanced prompting techniques across all three platforms to generate high-converting sales copy, marketing campaigns, and business strategies.",
    keyPoints: ["Sales copy generation", "Marketing campaigns", "Business strategy", "Conversion optimization"],
    practicalTip: "Chain prompts together - use output from one as input for the next for complex tasks."
  },
  {
    id: 5,
    title: "Content Creation Workflows",
    category: "ChatGPT/Gemini/Grok",
    content: "Build efficient content creation systems using all three AI tools to produce blogs, social media posts, email campaigns, and video scripts at scale.",
    keyPoints: ["Content calendars", "Multi-platform content", "Email sequences", "Video scripts"],
    practicalTip: "Create content templates that work across all platforms for consistency."
  },
  {
    id: 6,
    title: "Customer Research & Persona Development",
    category: "ChatGPT/Gemini/Grok",
    content: "Use AI to research your ideal customers, create detailed buyer personas, and understand pain points that your business can solve profitably.",
    keyPoints: ["Customer research", "Buyer personas", "Pain point analysis", "Solution mapping"],
    practicalTip: "Use specific demographic and psychographic details in your research prompts."
  },
  {
    id: 7,
    title: "Product Development with AI",
    category: "ChatGPT/Gemini/Grok",
    content: "Leverage AI to brainstorm digital products, validate concepts, create product roadmaps, and develop unique selling propositions that stand out.",
    keyPoints: ["Product brainstorming", "Concept validation", "USP development", "Feature planning"],
    practicalTip: "Test multiple product concepts with AI before investing time in development."
  },
  {
    id: 8,
    title: "Marketing Strategy Development",
    category: "ChatGPT/Gemini/Grok",
    content: "Create comprehensive marketing strategies using AI to identify the best channels, messaging, and tactics for your specific business and audience.",
    keyPoints: ["Channel selection", "Message crafting", "Campaign planning", "Budget allocation"],
    practicalTip: "Ask AI to create multiple strategy variations and test different approaches."
  },
  {
    id: 9,
    title: "Sales Funnel Optimization",
    category: "ChatGPT/Gemini/Grok",
    content: "Design and optimize sales funnels using AI to improve conversion rates, reduce customer acquisition costs, and maximize lifetime value.",
    keyPoints: ["Funnel design", "Conversion optimization", "A/B testing ideas", "Customer journey mapping"],
    practicalTip: "Use AI to analyze each funnel step and identify specific improvement opportunities."
  },
  {
    id: 10,
    title: "Business Automation Strategies",
    category: "ChatGPT/Gemini/Grok",
    content: "Learn how to use AI tools to automate repetitive business tasks, create systems, and scale your operations without hiring additional staff.",
    keyPoints: ["Task automation", "System creation", "Workflow optimization", "Scaling strategies"],
    practicalTip: "Start with one automated process and gradually expand to avoid overwhelming yourself."
  },

  // SECTION 2: Claude & Replit for Development (Lessons 11-20)
  {
    id: 11,
    title: "Claude for Business Logic Design",
    category: "Claude/Replit",
    content: "Use Claude's advanced reasoning to design complex business logic, create detailed project specifications, and plan technical implementations for your online business.",
    keyPoints: ["Business logic design", "Technical specifications", "Implementation planning", "Architecture decisions"],
    practicalTip: "Feed Claude your business requirements and ask for multiple implementation approaches."
  },
  {
    id: 12,
    title: "Replit Environment Setup",
    category: "Claude/Replit",
    content: "Master Replit's development environment to quickly prototype business applications, test ideas, and deploy functional prototypes without local setup.",
    keyPoints: ["Environment configuration", "Quick prototyping", "Deployment basics", "Collaboration features"],
    practicalTip: "Use Replit templates to jumpstart common business application types."
  },
  {
    id: 13,
    title: "Claude + Replit: Database Design",
    category: "Claude/Replit",
    content: "Combine Claude's planning capabilities with Replit's execution to design and implement databases that support your business operations and scale with growth.",
    keyPoints: ["Database schema design", "Relationship modeling", "Performance optimization", "Scalability planning"],
    practicalTip: "Ask Claude to explain database decisions in business terms, not just technical ones."
  },
  {
    id: 14,
    title: "User Authentication Systems",
    category: "Claude/Replit",
    content: "Build secure user authentication and authorization systems using Claude for security planning and Replit for rapid implementation and testing.",
    keyPoints: ["Security architecture", "User management", "Permission systems", "Data protection"],
    practicalTip: "Always implement security from the start - it's harder to add later."
  },
  {
    id: 15,
    title: "Payment Integration Mastery",
    category: "Claude/Replit",
    content: "Integrate payment systems like Stripe using Claude for planning and Replit for testing, ensuring your business can accept payments securely and efficiently.",
    keyPoints: ["Payment gateway setup", "Transaction security", "Subscription handling", "Refund automation"],
    practicalTip: "Test payment flows thoroughly in sandbox mode before going live."
  },
  {
    id: 16,
    title: "API Development for Business",
    category: "Claude/Replit",
    content: "Create APIs that support your business operations, integrate with third-party services, and enable future expansion of your platform.",
    keyPoints: ["RESTful API design", "Third-party integrations", "Documentation", "Version management"],
    practicalTip: "Design APIs with future growth in mind - think about what you might need later."
  },
  {
    id: 17,
    title: "Email System Implementation",
    category: "Claude/Replit",
    content: "Build comprehensive email systems for user notifications, marketing campaigns, and automated sequences using Claude for strategy and Replit for execution.",
    keyPoints: ["Email automation", "Template systems", "Delivery optimization", "Analytics tracking"],
    practicalTip: "Set up email tracking from day one to understand what resonates with your audience."
  },
  {
    id: 18,
    title: "Admin Dashboard Creation",
    category: "Claude/Replit",
    content: "Develop powerful admin interfaces that give you complete control over your business operations, user management, and performance monitoring.",
    keyPoints: ["Dashboard design", "User management", "Analytics display", "System monitoring"],
    practicalTip: "Build admin features incrementally based on your actual management needs."
  },
  {
    id: 19,
    title: "Performance Optimization",
    category: "Claude/Replit",
    content: "Optimize your applications for speed, reliability, and scalability using Claude for analysis and Replit for testing performance improvements.",
    keyPoints: ["Speed optimization", "Resource management", "Caching strategies", "Monitoring setup"],
    practicalTip: "Measure performance before and after optimizations to validate improvements."
  },
  {
    id: 20,
    title: "Deployment & Scaling Strategies",
    category: "Claude/Replit",
    content: "Learn deployment best practices and scaling strategies to handle growth, ensure uptime, and maintain performance as your business expands.",
    keyPoints: ["Deployment automation", "Scaling strategies", "Monitoring systems", "Backup procedures"],
    practicalTip: "Plan for scale early - it's easier to build scalable systems than to retrofit them."
  },

  // SECTION 3: Cursor & Trae for Advanced Development (Lessons 21-30)
  {
    id: 21,
    title: "Cursor IDE Mastery for Business Development",
    category: "Cursor/Trae",
    content: "Master Cursor's AI-powered IDE to accelerate business application development with intelligent code completion, refactoring, and debugging assistance.",
    keyPoints: ["AI-powered coding", "Intelligent completion", "Code refactoring", "Debug assistance"],
    practicalTip: "Use detailed prompts in Cursor - the more context you provide, the better the AI assistance."
  },
  {
    id: 22,
    title: "Trae Integration for Project Management",
    category: "Cursor/Trae",
    content: "Integrate Trae's project management capabilities with Cursor to streamline development workflows, track progress, and manage complex business projects.",
    keyPoints: ["Project workflow", "Progress tracking", "Task management", "Team coordination"],
    practicalTip: "Read what Trae is doing before it executes - you can stop unwanted changes and learn coding patterns."
  },
  {
    id: 23,
    title: "Advanced Prompt Engineering for Development",
    category: "Cursor/Trae",
    content: "Master advanced prompting techniques specifically for development tasks. Learn how detailed, context-rich prompts lead to better code generation and fewer bugs.",
    keyPoints: ["Development-specific prompts", "Context provision", "Code quality control", "Bug prevention"],
    practicalTip: "The more detailed your prompts, the better the output - include requirements, constraints, and examples."
  },
  {
    id: 24,
    title: "Real-time Code Collaboration",
    category: "Cursor/Trae",
    content: "Use Cursor and Trae together for real-time code collaboration, review processes, and maintaining code quality across team members and AI assistants.",
    keyPoints: ["Code collaboration", "Review processes", "Quality assurance", "Team workflows"],
    practicalTip: "Always review AI-generated code before committing - learn from the patterns to improve your skills."
  },
  {
    id: 25,
    title: "Complex Feature Development",
    category: "Cursor/Trae",
    content: "Tackle complex business features using the combined power of Cursor and Trae, breaking down large requirements into manageable, AI-assisted development tasks.",
    keyPoints: ["Feature breakdown", "Complex implementations", "Integration planning", "Testing strategies"],
    practicalTip: "Break complex features into smaller, specific tasks that AI can handle more effectively."
  },
  {
    id: 26,
    title: "Code Quality & Testing Automation",
    category: "Cursor/Trae",
    content: "Implement automated testing, code quality checks, and continuous integration using AI assistance to ensure your business applications remain reliable and maintainable.",
    keyPoints: ["Automated testing", "Quality assurance", "CI/CD pipelines", "Code maintenance"],
    practicalTip: "Set up quality checks early - it's much harder to add them to existing codebases."
  },
  {
    id: 27,
    title: "Advanced Database Operations",
    category: "Cursor/Trae",
    content: "Handle complex database operations, migrations, and optimizations using AI assistance to ensure your business data remains secure, fast, and accessible.",
    keyPoints: ["Database migrations", "Query optimization", "Data security", "Performance tuning"],
    practicalTip: "Always backup your database before running AI-generated migration scripts."
  },
  {
    id: 28,
    title: "Security Implementation & Auditing",
    category: "Cursor/Trae",
    content: "Use AI tools to implement robust security measures, conduct security audits, and protect your business applications from common vulnerabilities.",
    keyPoints: ["Security implementation", "Vulnerability scanning", "Audit procedures", "Protection strategies"],
    practicalTip: "Security is ongoing - regularly audit your applications as they grow and change."
  },
  {
    id: 29,
    title: "Advanced Deployment & DevOps",
    category: "Cursor/Trae",
    content: "Master advanced deployment strategies, DevOps practices, and infrastructure management using AI assistance to ensure reliable, scalable business operations.",
    keyPoints: ["Advanced deployment", "DevOps automation", "Infrastructure management", "Monitoring systems"],
    practicalTip: "Document your deployment processes - you'll need to reference them when scaling or troubleshooting."
  },
  {
    id: 30,
    title: "Business Platform Scaling & Optimization",
    category: "Cursor/Trae",
    content: "Scale your business platform using advanced AI assistance, optimization techniques, and architectural improvements to handle growth and maintain performance.",
    keyPoints: ["Platform scaling", "Architecture optimization", "Performance monitoring", "Growth planning"],
    practicalTip: "Plan for 10x growth - build systems that can scale beyond your current needs."
  }
];

export default function AIToolsMasteryGuideContent() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/signin?callbackUrl=/content/ai-tools-mastery-guide');
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
        const hasProduct = userProducts.includes('ai-tools-mastery-guide-2025') || 
                          userProducts.includes('ebook') ||
                          userProducts.includes('mastery');

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

  const toggleLesson = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
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
              This content is only available to users who have purchased the AI Tools Mastery Guide.
            </p>
            <div className="space-y-4">
              <Link 
                href="/products"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
              >
                Purchase AI Tools Mastery Guide
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
          <h1 className="text-4xl font-bold mb-2">AI Tools Mastery Guide 2025</h1>
          <p className="text-gray-300 mb-4">30 Comprehensive Lessons on AI Tools for Business</p>
          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 mb-6">
            <p className="text-purple-200 text-sm">
              📚 <strong>Complete Guide:</strong> Master 30 essential AI tools to transform your business productivity and profitability.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {AI_LESSONS.map((lesson) => (
            <div key={lesson.id} className="bg-gray-800 rounded-lg border border-gray-700">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => toggleLesson(lesson.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white font-bold">
                      {lesson.id}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{lesson.title}</h3>
                      <span className="inline-block bg-gray-600 text-white px-2 py-1 rounded text-sm mt-1">
                        {lesson.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedLesson === lesson.id ? '−' : '+'}
                  </div>
                </div>
              </div>
              
              {expandedLesson === lesson.id && (
                <div className="px-6 pb-6 border-t border-gray-700">
                  <div className="pt-4">
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Lesson Content:</h4>
                      <p className="text-gray-100 leading-relaxed">{lesson.content}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Key Points:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {lesson.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-200 text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <h4 className="text-sm font-medium text-yellow-300">Pro Tip:</h4>
                      </div>
                      <p className="text-yellow-200 text-sm">{lesson.practicalTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-900/30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-400 mb-3">🎯 Maximize Your AI Investment</h3>
          <p className="text-blue-200 mb-4">
            You now have access to comprehensive training on 30 essential AI tools. Each lesson is designed to help you implement these tools effectively in your business.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">🚀 Business Benefits:</h4>
              <ul className="text-blue-200 space-y-1">
                <li>• Increase productivity by 300%+</li>
                <li>• Reduce operational costs significantly</li>
                <li>• Automate repetitive tasks</li>
                <li>• Improve decision-making with AI insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">💡 Implementation Tips:</h4>
              <ul className="text-blue-200 space-y-1">
                <li>• Start with 1-2 tools and master them</li>
                <li>• Focus on your biggest pain points first</li>
                <li>• Train your team gradually</li>
                <li>• Measure ROI for each tool implemented</li>
              </ul>
            </div>
          </div>

          {/* Bonus Troubleshooting Section */}
          <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-8 mb-12 border border-red-500/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">🎁 BONUS: Advanced Troubleshooting Guide</h2>
            <p className="text-gray-300 text-center mb-8">
              3 Critical Issues & Solutions for Each Platform - Advanced techniques most people never learn
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* ChatGPT/Gemini/Grok Issues */}
              <div className="bg-gray-800/40 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">ChatGPT/Gemini/Grok Issues</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Context Loss in Long Conversations</div>
                    <div className="text-gray-300">Solution: Break conversations into focused sessions, use system prompts, create conversation templates for complex tasks.</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Inconsistent Output Quality</div>
                    <div className="text-gray-300">Solution: Use temperature settings, create prompt libraries, implement output validation checks.</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Rate Limiting & API Errors</div>
                    <div className="text-gray-300">Solution: Implement retry logic, use exponential backoff, create fallback systems between platforms.</div>
                  </div>
                </div>
              </div>

              {/* Claude/Replit Issues */}
              <div className="bg-gray-800/40 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Claude/Replit Issues</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Project Corruption & Lost Work</div>
                    <div className="text-gray-300">Solution: Regular Git commits, automated backups, version control best practices, project forking strategies.</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Environment Limitations & Timeouts</div>
                    <div className="text-gray-300">Solution: Resource optimization, process management, splitting large tasks, using external services.</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Deployment Failures & Configuration</div>
                    <div className="text-gray-300">Solution: Environment variables management, dependency handling, staging environments, rollback procedures.</div>
                  </div>
                </div>
              </div>

              {/* Cursor/Trae Issues */}
              <div className="bg-gray-800/40 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Cursor/Trae Issues</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-red-400 font-semibold">Issue: AI Making Unwanted Code Changes</div>
                    <div className="text-gray-300">Solution: Granular permissions, change review workflows, backup strategies, incremental commits.</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Project State Corruption</div>
                    <div className="text-gray-300">Solution: Clean project resets, dependency management, environment isolation, fresh start procedures.</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold">Issue: Performance Degradation & Memory</div>
                    <div className="text-gray-300">Solution: Resource monitoring, cleanup procedures, optimization techniques, system maintenance.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
              <h4 className="text-lg font-bold text-yellow-300 mb-3">🔧 Pro Recovery Techniques</h4>
              <div className="text-gray-300 space-y-2 text-sm">
                <div><strong>Fresh Start Protocol:</strong> How to cleanly reset any project when things go wrong</div>
                <div><strong>Backup Everything:</strong> Automated backup strategies that save hours of rework</div>
                <div><strong>Version Control Mastery:</strong> Git workflows that prevent data loss and enable easy rollbacks</div>
                <div><strong>Environment Management:</strong> Keeping development environments clean and reproducible</div>
                <div><strong>Dependency Hell Solutions:</strong> Resolving conflicts and managing package versions</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">
              Ready to master AI web creation with full deployment guidance?
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
        </div>
      </div>
    </div>
  );
} 