'use client';
import { useState } from 'react';

const lessons = [
  { slug: 'the-ai-revolution-in-2025', title: 'Lesson 1: The AI Revolution in 2025' },
  { slug: 'ai-as-your-money-making-tool', title: 'Lesson 2: AI as Your Money-Making Tool' },
  { slug: 'success-stories-and-case-studies', title: 'Lesson 3: Success Stories and Case Studies' },
  { slug: 'chatgpt-4-mastery', title: 'Lesson 4: ChatGPT-4 Mastery' },
  { slug: 'claude-3-5-sonnet-for-business', title: 'Lesson 5: Claude 3.5 Sonnet for Business' },
  { slug: 'google-gemini-pro', title: 'Lesson 6: Google Gemini Pro' },
  { slug: 'grok-for-real-time-data', title: 'Lesson 7: Grok for Real-Time Data' },
  { slug: 'visual-ai-tools', title: 'Lesson 8: Visual AI Tools' },
  { slug: 'blog-writing-with-ai', title: 'Lesson 9: Blog Writing with AI' },
  { slug: 'ai-for-ecommerce', title: 'Lesson 10: AI for E-commerce' },
  { slug: 'youtube-script-generation', title: 'Lesson 11: YouTube Script Generation' },
  { slug: 'email-marketing-sequences', title: 'Lesson 12: Email Marketing Sequences' },
  { slug: 'freelance-writing-services', title: 'Lesson 13: Freelance Writing Services' },
  { slug: 'social-media-management', title: 'Lesson 14: Social Media Management' },
  { slug: 'virtual-assistant-services', title: 'Lesson 15: Virtual Assistant Services' },
  { slug: 'content-strategy-consulting', title: 'Lesson 16: Content Strategy Consulting' },
  { slug: 'ai-generated-product-descriptions', title: 'Lesson 17: AI-Generated Product Descriptions' },
  { slug: 'automated-customer-service', title: 'Lesson 18: Automated Customer Service' },
  { slug: 'inventory-management-with-ai', title: 'Lesson 19: Inventory Management with AI' },
  { slug: 'personalized-marketing-campaigns', title: 'Lesson 20: Personalized Marketing Campaigns' },
  { slug: 'ai-powered-trading-and-investments', title: 'Lesson 21: AI-Powered Trading and Investments' },
  { slug: 'creating-and-selling-ai-tools', title: 'Lesson 22: Creating and Selling AI Tools' },
  { slug: 'building-ai-enhanced-saas-products', title: 'Lesson 23: Building AI-Enhanced SaaS Products' },
  { slug: 'affiliate-marketing-with-ai', title: 'Lesson 24: Affiliate Marketing with AI' },
  { slug: 'online-course-creation', title: 'Lesson 25: Online Course Creation' },
  { slug: 'automation-workflows', title: 'Lesson 26: Automation Workflows' },
  { slug: 'team-building-with-ai', title: 'Lesson 27: Team Building with AI' },
  { slug: 'performance-tracking-and-analytics', title: 'Lesson 28: Performance Tracking and Analytics' },
  { slug: 'building-multiple-income-streams', title: 'Lesson 29: Building Multiple Income Streams' },
  { slug: 'future-proofing-your-skills', title: 'Lesson 30: Future-Proofing Your Skills' }
];

export default function LessonMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary w-full flex items-center justify-between"
      >
        <span>📚 Jump to Any Lesson</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 glass-card max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="grid gap-2">
              {lessons.map((lesson, index) => (
                <a
                  key={lesson.slug}
                  href={`/downloads/ebook/${lesson.slug}`}
                  className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-200 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-sm font-medium">{lesson.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}