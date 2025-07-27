import LessonMenu from '../LessonMenu';

export default function AIAsYourMoneyMakingTool() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">Lesson 2: AI as Your Money-Making Tool</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Focus on solving real problems with AI, not just using AI for the sake of it. The money follows value creation.</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">AI isn't just a productivity tool—it's a revenue multiplier. This lesson reveals how to transform AI capabilities into consistent income streams, whether through services, products, or enhanced efficiency in your current work.</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          <li><strong>Service-Based Revenue:</strong> Content creation, automation consulting, AI implementation services</li>
          <li><strong>Product Creation:</strong> AI-generated courses, templates, and digital products</li>
          <li><strong>Efficiency Gains:</strong> 70% reduction in manual tasks = more time for high-value activities</li>
          <li><strong>24/7 Operations:</strong> AI tools work continuously, scaling your output without scaling your hours</li>
          <li><strong>Market Positioning:</strong> Become the "AI expert" in your niche for premium pricing</li>
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>"Create a detailed business plan for monetizing AI in [MY INDUSTRY]. Include 5 specific revenue streams, pricing strategies, target customers, required tools, startup costs, and a 90-day action plan to reach $[TARGET INCOME] monthly."</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Customize with your industry and income goals for a personalized monetization strategy.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">Sarah, a freelance writer, built a $5K/month AI content agency in 3 months. She used ChatGPT for writing, Canva for design, and positioned herself as an "AI-powered content specialist," charging 3x her previous rates while delivering faster results.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/the-ai-revolution-in-2025" className="btn btn-secondary">← Previous Lesson</a>
        <a href="/downloads/ebook/success-stories-and-case-studies" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}