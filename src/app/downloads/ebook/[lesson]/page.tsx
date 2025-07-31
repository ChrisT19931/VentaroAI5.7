import { notFound } from 'next/navigation';
import LessonClientWrapper from '@/components/downloads/LessonClientWrapper';

const lessons = [
  'the-ai-revolution-in-2025',
  'ai-as-your-money-making-tool',
  'success-stories-and-case-studies',
  'chatgpt-4-mastery',
  'claude-3-5-sonnet-for-business',
  'google-gemini-pro',
  'grok-for-real-time-data',
  'visual-ai-tools',
  'blog-writing-with-ai',
  'ai-for-ecommerce',
  'youtube-script-generation',
  'email-marketing-sequences',
  'freelance-writing-services',
  'social-media-management',
  'virtual-assistant-services',
  'content-strategy-consulting',
  'ai-generated-product-descriptions',
  'automated-customer-service',
  'inventory-management-with-ai',
  'personalized-marketing-campaigns',
  'ai-powered-trading-and-investments',
  'creating-and-selling-ai-tools',
  'building-ai-enhanced-saas-products',
  'affiliate-marketing-with-ai',
  'online-course-creation',
  'automation-workflows',
  'team-building-with-ai',
  'performance-tracking-and-analytics',
  'building-multiple-income-streams',
  'future-proofing-your-skills'
];

export default function LessonPage({ params }: { params: { lesson: string } }) {
  const { lesson } = params;
  if (!lessons.includes(lesson)) {
    notFound();
  }
  // Use the client component wrapper for dynamic import
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <LessonClientWrapper lessonName={lesson} />
      </div>
    </div>
  );
}