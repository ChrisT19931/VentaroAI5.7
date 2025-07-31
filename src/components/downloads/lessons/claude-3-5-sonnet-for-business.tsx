import LessonMenu from '../LessonMenu';

export default function Claude35SonnetForBusiness() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">Lesson 5: Claude 3.5 Sonnet for Business</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Use Claude for complex reasoning tasks where you need nuanced analysis - it excels at understanding context and providing thoughtful insights.</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">Claude 3.5 Sonnet represents the pinnacle of AI reasoning capabilities. This lesson unlocks its potential for complex business analysis, strategic planning, and sophisticated document processing that goes beyond simple content generation.</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          <li><strong>Advanced Reasoning:</strong> Complex business analysis, strategic planning, and multi-factor decision making</li>
          <li><strong>Document Intelligence:</strong> Contract analysis, research synthesis, and report generation</li>
          <li><strong>Code & Automation:</strong> Business process automation and advanced data analysis scripts</li>
          <li><strong>Ethical AI:</strong> Built-in safety features make it ideal for sensitive business applications</li>
          <li><strong>Long-form Content:</strong> Superior at maintaining context and coherence in extended documents</li>
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>"Create a comprehensive Claude 3.5 Sonnet implementation strategy for [MY BUSINESS TYPE]. Include specific use cases, workflow integration, ROI calculations, team training plans, and advanced prompting techniques for maximum business impact."</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Tailor this prompt with your specific business context for detailed implementation guidance.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">Strategic consulting firm McKenzie & Associates reduced research time by 80% using Claude for market analysis and report generation. They now complete comprehensive industry reports in 2 days instead of 2 weeks, allowing them to take on 5x more clients.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/chatgpt-4-mastery" className="btn btn-secondary">← Previous Lesson</a>
        <a href="/downloads/ebook/google-gemini-pro" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}