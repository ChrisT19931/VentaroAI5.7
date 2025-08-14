import LessonMenu from '../LessonMenu';

export default function TheAIRevolutionIn2025() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">Lesson 1: The AI Revolution in 2025</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Start learning AI tools now - the early adopters are capturing 80% of the market opportunities. Don't wait for the "perfect" moment.</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">The AI revolution isn't coming—it's here. 2025 represents the tipping point where AI literacy becomes as essential as computer literacy was in the 1990s. This lesson explores the massive economic shift and how to position yourself at the forefront.</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          <li><strong>Market Timing:</strong> AI market reaching $1.8 trillion - position yourself in high-growth sectors</li>
          <li><strong>Income Acceleration:</strong> AI-skilled professionals seeing 40-60% income increases within 12 months</li>
          <li><strong>Job Creation:</strong> 12 million new AI-related jobs globally - be ready to capture them</li>
          <li><strong>Competitive Advantage:</strong> Early AI adopters dominating their industries - don't get left behind</li>
          <li><strong>Skill Stacking:</strong> Combine your existing expertise with AI tools for exponential value creation</li>
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>"Expand on the AI revolution in 2025 by providing specific industry examples, actionable steps for [MY INDUSTRY], and detailed strategies for someone with [MY CURRENT SKILL SET] to transition into AI-enhanced roles. Include timeline, resources, and potential income projections."</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Copy this prompt and feed it to ChatGPT, Claude, or Gemini for personalized expansion of this lesson.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">Many professionals are successfully transitioning to AI-enhanced careers by starting with foundational tools like ChatGPT for content creation, expanding to visual tools for design work, and gradually implementing workflow automation to increase productivity and value delivery.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/ai-as-your-money-making-tool" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}