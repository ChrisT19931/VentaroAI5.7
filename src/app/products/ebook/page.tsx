import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export default function EbookProductPage() {
  const product = {
    id: 'ebook-premium-ai',
    name: 'Premium AI E-book: Master AI for Business Success',
    price: 50.00,
    image_url: '/images/ebook-cover.jpg'
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
                  <div className="text-xl font-bold">Premium AI E-book</div>
                  <div className="text-sm opacity-80">Digital Download</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-page-turn"></div>
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
                  Unlock the full potential of AI for your business with our comprehensive 200-page guide. 
                  This isn't just another AI book – it's a complete blueprint for implementing AI strategies 
                  that generate real results.
                </p>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 What You'll Learn</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Advanced ChatGPT prompting techniques that save 10+ hours per week</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>AI automation workflows for marketing, sales, and operations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Content creation systems that produce premium quality outputs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>AI tools integration strategies for maximum ROI</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Real case studies from businesses earning 6-7 figures with AI</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📖 Book Contents</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 1: AI Foundations</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Understanding AI Capabilities</li>
                        <li>• Choosing the Right AI Tools</li>
                        <li>• Setting Up Your AI Workspace</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 2: Advanced Strategies</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Prompt Engineering Mastery</li>
                        <li>• AI Workflow Automation</li>
                        <li>• Quality Control Systems</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 3: Business Applications</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Marketing & Content Creation</li>
                        <li>• Sales Process Optimization</li>
                        <li>• Customer Service AI</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Part 4: Scaling & ROI</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Measuring AI Performance</li>
                        <li>• Team Training & Adoption</li>
                        <li>• Future-Proofing Your Business</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎁 Bonus Materials Included</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span>50+ Ready-to-Use AI Prompt Templates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span>AI Tools Comparison Spreadsheet</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span>Weekly AI Updates Newsletter (3 months free)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-yellow-400">⭐</span>
                      <span>Private Community Access</span>
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