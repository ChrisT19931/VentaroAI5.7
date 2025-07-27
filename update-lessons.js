const fs = require('fs');
const path = require('path');

const lessonsDir = '/Users/ventaro/Downloads/h/DigitalStore/src/components/downloads/lessons';

const lessonData = [
  {
    file: 'success-stories-and-case-studies.tsx',
    title: 'Lesson 3: Success Stories and Case Studies',
    tip: 'Study successful AI implementations in your industry first - then adapt their strategies to your unique situation.',
    brief: 'Real success stories provide the blueprint for your AI journey. This lesson analyzes proven case studies across industries to extract actionable patterns you can replicate.',
    keyPoints: [
      '<strong>Pattern Recognition:</strong> Identify common success factors across different AI implementations',
      '<strong>Industry Adaptation:</strong> How to modify successful strategies for your specific market',
      '<strong>ROI Metrics:</strong> Understand what success looks like and how to measure it',
      '<strong>Timeline Expectations:</strong> Realistic timeframes for seeing results from AI initiatives',
      '<strong>Risk Mitigation:</strong> Learn from others\' mistakes to avoid common pitfalls'
    ],
    prompt: '"Analyze 10 successful AI case studies in [MY INDUSTRY] and create a step-by-step implementation guide for someone with [MY RESOURCES] and [MY GOALS]. Include potential obstacles, success metrics, and a detailed action plan."',
    caseStudy: 'Tech startup founder Mike increased his company\'s valuation by 300% in 18 months by implementing AI across customer service, marketing, and product development, following patterns from successful SaaS companies.',
    prev: 'ai-as-your-money-making-tool',
    next: 'chatgpt-4-mastery'
  },
  {
    file: 'chatgpt-4-mastery.tsx',
    title: 'Lesson 4: ChatGPT-4 Mastery',
    tip: 'Master prompt engineering - the difference between basic and expert ChatGPT users is in the quality of their prompts.',
    brief: 'ChatGPT-4 is your Swiss Army knife for AI tasks. This lesson transforms you from a casual user into a prompt engineering expert who can extract maximum value from every interaction.',
    keyPoints: [
      '<strong>Advanced Prompting:</strong> Chain-of-thought, role-playing, and context-setting techniques',
      '<strong>Custom GPTs:</strong> Create specialized AI assistants for your specific needs',
      '<strong>API Integration:</strong> Automate ChatGPT into your workflows and applications',
      '<strong>Cost Optimization:</strong> Maximize output while minimizing token usage',
      '<strong>Quality Control:</strong> Techniques for consistent, high-quality outputs'
    ],
    prompt: '"Create a comprehensive ChatGPT-4 mastery plan for [MY PROFESSION]. Include 20 advanced prompts, 5 custom GPT ideas, automation opportunities, and a practice schedule to become expert-level in 30 days."',
    caseStudy: 'Marketing consultant Lisa built a $15K/month business using ChatGPT-4 to create personalized marketing strategies for small businesses, completing work that used to take weeks in just hours.',
    prev: 'success-stories-and-case-studies',
    next: 'claude-3-5-sonnet-for-business'
  }
];

function updateLessonFile(lessonInfo) {
  const filePath = path.join(lessonsDir, lessonInfo.file);
  
  const content = `import LessonMenu from '../LessonMenu';

export default function ${lessonInfo.file.replace('.tsx', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">${lessonInfo.title}</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">${lessonInfo.tip}</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">${lessonInfo.brief}</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          ${lessonInfo.keyPoints.map(point => `<li>${point}</li>`).join('\n          ')}
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>${lessonInfo.prompt}</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Copy this prompt and customize the bracketed sections for personalized insights.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">${lessonInfo.caseStudy}</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/${lessonInfo.prev}" className="btn btn-secondary">← Previous Lesson</a>
        <a href="/downloads/ebook/${lessonInfo.next}" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${lessonInfo.file}`);
}

// Update the lessons
lessonData.forEach(updateLessonFile);
console.log('Lesson updates complete!');