import LessonMenu from '../LessonMenu';

export default function Chatgpt4Mastery() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">Lesson 4: ChatGPT-4 Mastery</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Master prompt engineering - the difference between basic and expert ChatGPT users is in the quality of their prompts.</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">ChatGPT-4 is your Swiss Army knife for AI tasks. This lesson transforms you from a casual user into a prompt engineering expert who can extract maximum value from every interaction.</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          <li><strong>Advanced Prompting:</strong> Chain-of-thought, role-playing, and context-setting techniques</li>
          <li><strong>Custom GPTs:</strong> Create specialized AI assistants for your specific needs</li>
          <li><strong>API Integration:</strong> Automate ChatGPT into your workflows and applications</li>
          <li><strong>Cost Optimization:</strong> Maximize output while minimizing token usage</li>
          <li><strong>Quality Control:</strong> Techniques for consistent, high-quality outputs</li>
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>"Create a comprehensive ChatGPT-4 mastery plan for [MY PROFESSION]. Include 20 advanced prompts, 5 custom GPT ideas, automation opportunities, and a practice schedule to become expert-level in 30 days."</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Copy this prompt and customize the bracketed sections for personalized insights.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">Marketing consultant Lisa built a $15K/month business using ChatGPT-4 to create personalized marketing strategies for small businesses, completing work that used to take weeks in just hours.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/success-stories-and-case-studies" className="btn btn-secondary">← Previous Lesson</a>
        <a href="/downloads/ebook/claude-3-5-sonnet-for-business" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}