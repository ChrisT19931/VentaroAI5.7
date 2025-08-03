import LessonMenu from '../LessonMenu';

export default function SuccessStoriesAndCaseStudies() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">Lesson 3: Success Stories and Case Studies</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Study successful AI implementations in your industry first - then adapt their strategies to your unique situation.</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">Real success stories provide the blueprint for your AI journey. This lesson analyzes proven case studies across industries to extract actionable patterns you can replicate.</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          <li><strong>Pattern Recognition:</strong> Identify common success factors across different AI implementations</li>
          <li><strong>Industry Adaptation:</strong> How to modify successful strategies for your specific market</li>
          <li><strong>Why Us? Metrics:</strong> Understand what success looks like and how to measure it</li>
          <li><strong>Timeline Expectations:</strong> Realistic timeframes for seeing results from AI initiatives</li>
          <li><strong>Risk Mitigation:</strong> Learn from others' mistakes to avoid common pitfalls</li>
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>"Analyze 10 successful AI case studies in [MY INDUSTRY] and create a step-by-step implementation guide for someone with [MY RESOURCES] and [MY GOALS]. Include potential obstacles, success metrics, and a detailed action plan."</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Copy this prompt and customize the bracketed sections for personalized insights.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">Tech startup founder Mike increased his company's valuation by 300% in 18 months by implementing AI across customer service, marketing, and product development, following patterns from successful SaaS companies.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/ai-as-your-money-making-tool" className="btn btn-secondary">← Previous Lesson</a>
        <a href="/downloads/ebook/chatgpt-4-mastery" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}