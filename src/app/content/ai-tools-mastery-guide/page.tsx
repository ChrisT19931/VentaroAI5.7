'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Lock, CheckCircle, Star, Zap } from 'lucide-react';
import Link from 'next/link';

// 30 AI Tools Mastery Lessons
const AI_LESSONS = [
  {
    id: 1,
    title: "ChatGPT Fundamentals",
    category: "Basics",
    content: "Master the basics of ChatGPT including prompt engineering, conversation flow, and getting the best results. Learn how to structure prompts for maximum effectiveness and avoid common mistakes that lead to poor outputs.",
    keyPoints: ["Prompt structure", "Context setting", "Response optimization", "Common pitfalls to avoid"],
    practicalTip: "Always provide context and be specific with your requests for better results."
  },
  {
    id: 2,
    title: "Claude AI Advanced Techniques",
    category: "Advanced",
    content: "Discover Claude's unique capabilities including document analysis, coding assistance, and creative writing. Learn how Claude differs from ChatGPT and when to use each tool for maximum productivity.",
    keyPoints: ["Document processing", "Code generation", "Creative tasks", "Comparative advantages"],
    practicalTip: "Use Claude for longer documents and complex reasoning tasks."
  },
  {
    id: 3,
    title: "Google Bard for Research",
    category: "Research",
    content: "Leverage Google Bard's real-time internet access for current information, fact-checking, and market research. Master techniques for getting accurate, up-to-date information for business decisions.",
    keyPoints: ["Real-time data", "Fact verification", "Market insights", "Current trends"],
    practicalTip: "Always verify important information from multiple sources."
  },
  {
    id: 4,
    title: "Midjourney Image Creation",
    category: "Visual",
    content: "Create stunning visuals with Midjourney for marketing, social media, and business presentations. Learn prompt crafting for specific styles, compositions, and commercial-quality images.",
    keyPoints: ["Prompt crafting", "Style parameters", "Commercial use", "Quality optimization"],
    practicalTip: "Use aspect ratios and style parameters to get exactly what you need."
  },
  {
    id: 5,
    title: "DALL-E 3 for Business Graphics",
    category: "Visual",
    content: "Master DALL-E 3 for creating professional graphics, logos, and marketing materials. Understand licensing, commercial use rights, and integration with business workflows.",
    keyPoints: ["Business graphics", "Logo design", "Marketing visuals", "Commercial rights"],
    practicalTip: "Be specific about colors, styles, and branding elements in your prompts."
  },
  {
    id: 6,
    title: "Stable Diffusion Customization",
    category: "Visual",
    content: "Set up and customize Stable Diffusion for your specific needs. Learn about models, LoRAs, and advanced settings for consistent, high-quality image generation.",
    keyPoints: ["Model selection", "Custom training", "Advanced settings", "Batch processing"],
    practicalTip: "Experiment with different models to find what works best for your use case."
  },
  {
    id: 7,
    title: "Canva AI Magic Design",
    category: "Design",
    content: "Combine Canva's design tools with AI features for rapid content creation. Master Magic Design, background removal, and AI-powered layout suggestions.",
    keyPoints: ["Magic Design", "AI backgrounds", "Layout automation", "Brand consistency"],
    practicalTip: "Use brand kits to maintain consistency across all AI-generated designs."
  },
  {
    id: 8,
    title: "Notion AI for Productivity",
    category: "Productivity",
    content: "Integrate Notion AI into your workflow for content creation, data analysis, and project management. Learn to automate routine tasks and enhance team collaboration.",
    keyPoints: ["Content automation", "Data insights", "Team collaboration", "Workflow optimization"],
    practicalTip: "Create templates with AI prompts for consistent content generation."
  },
  {
    id: 9,
    title: "Grammarly Business Writing",
    category: "Writing",
    content: "Enhance your business communication with Grammarly's AI features. Master tone detection, clarity suggestions, and professional writing optimization.",
    keyPoints: ["Professional tone", "Clarity improvement", "Grammar perfection", "Style consistency"],
    practicalTip: "Set specific goals for each document type to get targeted suggestions."
  },
  {
    id: 10,
    title: "Copy.ai for Marketing",
    category: "Marketing",
    content: "Generate high-converting marketing copy with Copy.ai. Learn templates for ads, emails, product descriptions, and social media content that drives results.",
    keyPoints: ["Ad copy", "Email marketing", "Product descriptions", "Social content"],
    practicalTip: "Always customize AI-generated copy to match your brand voice."
  },
  {
    id: 11,
    title: "Jasper AI Content Strategy",
    category: "Content",
    content: "Develop comprehensive content strategies using Jasper AI. Master long-form content creation, SEO optimization, and brand voice consistency.",
    keyPoints: ["Content planning", "SEO integration", "Brand voice", "Long-form writing"],
    practicalTip: "Use the brand voice feature to maintain consistency across all content."
  },
  {
    id: 12,
    title: "Writesonic Sales Copy",
    category: "Sales",
    content: "Create persuasive sales copy that converts with Writesonic. Learn frameworks for landing pages, sales letters, and product launches that drive revenue.",
    keyPoints: ["Sales frameworks", "Landing pages", "Product launches", "Conversion optimization"],
    practicalTip: "Test multiple variations of AI-generated copy to find what converts best."
  },
  {
    id: 13,
    title: "Synthesia Video Creation",
    category: "Video",
    content: "Produce professional videos without cameras using Synthesia. Master avatar selection, script writing, and video customization for business presentations.",
    keyPoints: ["Avatar selection", "Script optimization", "Video customization", "Professional presentation"],
    practicalTip: "Keep scripts conversational and break up long content into shorter segments."
  },
  {
    id: 14,
    title: "Murf AI Voiceovers",
    category: "Audio",
    content: "Create professional voiceovers for videos, podcasts, and presentations using Murf AI. Learn voice selection, pacing, and emotional tone control.",
    keyPoints: ["Voice selection", "Pacing control", "Emotional tone", "Audio quality"],
    practicalTip: "Add pauses and emphasis markers to make voiceovers sound more natural."
  },
  {
    id: 15,
    title: "Descript Audio Editing",
    category: "Audio",
    content: "Edit audio and video content like text with Descript's AI features. Master transcription, filler word removal, and voice cloning for content creation.",
    keyPoints: ["Text-based editing", "Filler removal", "Voice cloning", "Transcription accuracy"],
    practicalTip: "Use the overdub feature sparingly to maintain authenticity."
  },
  {
    id: 16,
    title: "Loom AI Summaries",
    category: "Communication",
    content: "Enhance video communication with Loom's AI features. Learn to create automatic summaries, action items, and searchable video libraries.",
    keyPoints: ["Video summaries", "Action items", "Search functionality", "Team communication"],
    practicalTip: "Enable AI summaries for all important meetings and presentations."
  },
  {
    id: 17,
    title: "Zapier AI Automation",
    category: "Automation",
    content: "Automate workflows with Zapier's AI capabilities. Connect different apps and services to create intelligent automation that saves time and reduces errors.",
    keyPoints: ["Workflow automation", "App integration", "Error reduction", "Time savings"],
    practicalTip: "Start with simple automations and gradually build more complex workflows."
  },
  {
    id: 18,
    title: "Make.com AI Scenarios",
    category: "Automation",
    content: "Build complex automation scenarios with Make.com's visual workflow builder. Master conditional logic, data transformation, and multi-step processes.",
    keyPoints: ["Visual workflows", "Conditional logic", "Data transformation", "Complex scenarios"],
    practicalTip: "Test scenarios with sample data before deploying to production."
  },
  {
    id: 19,
    title: "Calendly AI Scheduling",
    category: "Productivity",
    content: "Optimize meeting scheduling with Calendly's AI features. Learn smart scheduling, automatic time zone detection, and intelligent meeting preparation.",
    keyPoints: ["Smart scheduling", "Time zone handling", "Meeting prep", "Calendar optimization"],
    practicalTip: "Use routing forms to automatically direct different types of meetings."
  },
  {
    id: 20,
    title: "HubSpot AI Sales Tools",
    category: "Sales",
    content: "Leverage HubSpot's AI for sales automation, lead scoring, and customer insights. Master predictive analytics and automated follow-up sequences.",
    keyPoints: ["Lead scoring", "Sales automation", "Predictive analytics", "Customer insights"],
    practicalTip: "Regularly review and adjust AI recommendations based on actual results."
  },
  {
    id: 21,
    title: "Salesforce Einstein AI",
    category: "CRM",
    content: "Implement Salesforce Einstein for intelligent customer relationship management. Learn opportunity scoring, next best actions, and automated insights.",
    keyPoints: ["Opportunity scoring", "Next best actions", "Automated insights", "CRM optimization"],
    practicalTip: "Train the AI with high-quality historical data for better predictions."
  },
  {
    id: 22,
    title: "Monday.com AI Project Management",
    category: "Project Management",
    content: "Enhance project management with Monday.com's AI features. Master automated status updates, risk prediction, and resource optimization.",
    keyPoints: ["Status automation", "Risk prediction", "Resource optimization", "Team coordination"],
    practicalTip: "Set up automated notifications to keep everyone informed of project changes."
  },
  {
    id: 23,
    title: "Asana Intelligence",
    category: "Project Management",
    content: "Use Asana's AI capabilities to improve team productivity and project outcomes. Learn goal tracking, workload balancing, and intelligent recommendations.",
    keyPoints: ["Goal tracking", "Workload balancing", "Smart recommendations", "Team productivity"],
    practicalTip: "Use Asana Intelligence to identify bottlenecks before they become problems."
  },
  {
    id: 24,
    title: "Slack AI Workflow Builder",
    category: "Communication",
    content: "Automate team communication with Slack's AI-powered workflows. Create intelligent bots, automated responses, and smart notifications.",
    keyPoints: ["Workflow automation", "Intelligent bots", "Automated responses", "Smart notifications"],
    practicalTip: "Start with simple workflows and gradually add more sophisticated logic."
  },
  {
    id: 25,
    title: "Microsoft Copilot Integration",
    category: "Productivity",
    content: "Integrate Microsoft Copilot across Office 365 applications. Master AI assistance in Word, Excel, PowerPoint, and Outlook for maximum productivity.",
    keyPoints: ["Office integration", "Document creation", "Data analysis", "Email management"],
    practicalTip: "Use Copilot to draft initial content, then refine and personalize the output."
  },
  {
    id: 26,
    title: "Google Workspace AI",
    category: "Productivity",
    content: "Leverage AI features across Google Workspace applications. Learn smart compose, data insights, and automated meeting summaries.",
    keyPoints: ["Smart compose", "Data insights", "Meeting summaries", "Collaboration enhancement"],
    practicalTip: "Enable AI features gradually to help your team adapt to new workflows."
  },
  {
    id: 27,
    title: "Shopify AI for E-commerce",
    category: "E-commerce",
    content: "Optimize your online store with Shopify's AI tools. Master product recommendations, inventory management, and customer behavior analysis.",
    keyPoints: ["Product recommendations", "Inventory optimization", "Customer analysis", "Sales forecasting"],
    practicalTip: "Use AI insights to optimize your product mix and pricing strategy."
  },
  {
    id: 28,
    title: "Mailchimp AI Marketing",
    category: "Marketing",
    content: "Enhance email marketing with Mailchimp's AI features. Learn send time optimization, content suggestions, and audience segmentation.",
    keyPoints: ["Send time optimization", "Content suggestions", "Audience segmentation", "Campaign performance"],
    practicalTip: "Let AI optimize send times, but always test subject lines manually."
  },
  {
    id: 29,
    title: "Buffer AI Social Media",
    category: "Social Media",
    content: "Automate social media management with Buffer's AI tools. Master content scheduling, hashtag suggestions, and performance optimization.",
    keyPoints: ["Content scheduling", "Hashtag optimization", "Performance analysis", "Audience engagement"],
    practicalTip: "Use AI suggestions as a starting point, but maintain your authentic brand voice."
  },
  {
    id: 30,
    title: "AI Tools Integration Strategy",
    category: "Strategy",
    content: "Develop a comprehensive AI tools integration strategy for your business. Learn to evaluate tools, plan implementation, and measure ROI across your AI toolkit.",
    keyPoints: ["Tool evaluation", "Implementation planning", "ROI measurement", "Strategic integration"],
    practicalTip: "Start with one tool at a time and master it before adding more to your stack."
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
        </div>
      </div>
    </div>
  );
} 