'use client';

import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export default function EbookProductPage() {
  const product = {
    id: 'ebook-premium-ai',
    name: 'AI Tools Mastery Guide 2025',
    price: 25.00,
    image_url: '/images/premium-ai-ebook.jpg'
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="glass-card p-8">
              <div className="bg-gradient-accent rounded-lg h-96 flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="text-center text-white relative z-10">
                  <div className="text-6xl mb-4 animate-book-flip">📚</div>
                  <div className="text-xl font-bold">AI Tools Mastery Guide 2025</div>
                  <div className="text-sm opacity-80">30-Page Comprehensive Guide</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-page-turn"></div>
                <Image 
                  src="/images/ebook-cover.jpg" 
                  alt="AI Tools Mastery Guide 2025" 
                  fill 
                  className="object-cover opacity-20" 
                />
              </div>
              <style jsx>{`
                @keyframes book-flip {
                  0%, 100% { transform: rotateY(0deg) scale(1); }
                  25% { transform: rotateY(-15deg) scale(1.05); }
                  50% { transform: rotateY(0deg) scale(1.1); }
                  75% { transform: rotateY(15deg) scale(1.05); }
                }
                @keyframes page-turn {
                  0%, 100% { transform: translateX(-100%) skewX(0deg); opacity: 0; }
                  50% { transform: translateX(0%) skewX(-10deg); opacity: 0.3; }
                }
                .animate-book-flip {
                  animation: book-flip 4s ease-in-out infinite;
                  transform-style: preserve-3d;
                }
                .animate-page-turn {
                  animation: page-turn 6s ease-in-out infinite;
                }
              `}</style>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">${product.price}</div>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <div className="glass-card p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {product.name}
              </h1>
              
              <div className="text-gray-300 space-y-6">
                <p className="text-lg leading-relaxed">
                  Learn how to make money online with AI tools and AI prompts in 2025 with our comprehensive 200-page guide. 
                  This isn't just another AI book – it's a complete blueprint for using AI tools and prompts to make money with AI 
                  and build profitable online businesses.
                </p>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 What You'll Learn</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Advanced AI prompts and ChatGPT techniques to make money online in 2025</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>AI tools automation workflows for profitable online businesses</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Content creation systems using AI tools to make money with AI</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>AI tools integration strategies to maximize online income in 2025</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Real case studies: How to make money online with AI tools and prompts</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📖 Complete Chapter List</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 1: AI Foundations</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Chapter 1: Understanding AI Capabilities & Limitations</li>
                        <li>• Chapter 2: The AI Tool Landscape - What to Use When</li>
                        <li>• Chapter 3: Setting Up Your AI Workspace for Maximum Efficiency</li>
                        <li>• Chapter 4: AI Ethics & Best Practices for Business</li>
                        <li>• Chapter 5: Cost Management Strategies for AI Tools</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 2: Advanced Strategies</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Chapter 6: Prompt Engineering Mastery - From Basic to Advanced</li>
                        <li>• Chapter 7: Creating Multi-Step AI Workflows</li>
                        <li>• Chapter 8: Quality Control Systems for AI Outputs</li>
                        <li>• Chapter 9: Combining Multiple AI Tools for Better Results</li>
                        <li>• Chapter 10: Troubleshooting Common AI Issues</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 3: Business Applications</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Chapter 11: Content Creation & Marketing Automation</li>
                        <li>• Chapter 12: Sales Process Optimization with AI</li>
                        <li>• Chapter 13: Customer Service & Support AI Systems</li>
                        <li>• Chapter 14: Product Development & Research Applications</li>
                        <li>• Chapter 15: Financial Analysis & Forecasting with AI</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 4: Scaling & ROI</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Chapter 16: Measuring AI Performance & ROI</li>
                        <li>• Chapter 17: Team Training & Adoption Strategies</li>
                        <li>• Chapter 18: Scaling AI Across Your Organization</li>
                        <li>• Chapter 19: Future-Proofing Your Business with AI</li>
                        <li>• Chapter 20: Case Studies: Real Business Success Stories</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎁 What You Get</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span><strong>200-Page Comprehensive PDF E-book</strong> - Professionally designed with actionable content</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span><strong>50+ Ready-to-Use AI Prompt Templates</strong> - Copy and paste to get immediate results</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span><strong>AI Tools Comparison Spreadsheet</strong> - Save hundreds of dollars by choosing the right tools</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span><strong>Weekly AI Updates Newsletter</strong> - Stay ahead of AI trends (3 months free)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span><strong>Private Community Access</strong> - Connect with other AI enthusiasts and get your questions answered</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 font-semibold mb-2">⚠️ Digital Product - Instant Access</p>
                  <p className="text-gray-300 text-sm">
                    This is a digital download. You'll receive immediate access to the PDF e-book and all bonus materials after purchase. No physical shipping required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="text-gradient hover:text-white font-medium transition-colors">
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
}