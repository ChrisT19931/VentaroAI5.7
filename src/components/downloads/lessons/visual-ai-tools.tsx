import LessonMenu from '../LessonMenu';

export default function VisualAITools() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-4">Lesson 8: Visual AI Tools</h1>
      
      {/* Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Master prompt crafting for visual AI - specific, descriptive prompts with style references produce dramatically better results than generic requests.</p>
      </div>

      {/* Brief */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">📋 Brief</h2>
        <p className="text-gray-300">Visual AI tools are revolutionizing creative industries by democratizing high-quality design and image creation. This lesson covers the essential tools and techniques for generating professional visuals without traditional design skills.</p>
      </div>

      {/* Key Points to Apply in 2025 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">🎯 Key Points to Apply in 2025</h2>
        <ul className="list-disc ml-6 text-gray-200 space-y-2">
          <li><strong>Image Generation:</strong> Master Midjourney, DALL-E 3, and Stable Diffusion for diverse visual needs</li>
          <li><strong>Design Automation:</strong> Create logos, social media graphics, and presentations at scale</li>
          <li><strong>Video Creation:</strong> AI-powered video editing, generation, and animation tools</li>
          <li><strong>Brand Consistency:</strong> Develop style guides and maintain visual coherence across projects</li>
          <li><strong>Commercial Applications:</strong> License considerations and monetization strategies for AI-generated visuals</li>
        </ul>
      </div>

      {/* AI Expansion Prompt */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🤖 AI Expansion Prompt</h3>
        <div className="bg-gray-900/50 rounded p-3 text-sm text-gray-300 font-mono">
          <p>"Create a complete visual AI toolkit guide for [MY BUSINESS/INDUSTRY]. Include tool recommendations, prompt libraries, workflow automation, pricing strategies, and a 30-day practice plan to become proficient in visual AI creation."</p>
        </div>
        <p className="text-purple-200 text-sm mt-2">Customize with your specific visual needs and business context.</p>
      </div>

      {/* Case Study */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">📊 Case Study</h2>
        <p className="text-gray-200">Graphic designer Emma increased her client capacity by 300% using AI visual tools for rapid prototyping. She now completes logo concepts in minutes instead of hours, allowing her to serve more clients while maintaining premium pricing for her creative direction and refinement skills.</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <a href="/downloads/ebook/grok-for-real-time-data" className="btn btn-secondary">← Previous Lesson</a>
        <a href="/downloads/ebook/blog-writing-with-ai" className="btn btn-secondary">Next Lesson →</a>
      </div>
    </div>
  );
}