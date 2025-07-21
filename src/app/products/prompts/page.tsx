import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export default function PromptsProductPage() {
  const product = {
    id: 'ai-prompts-collection',
    name: '30 Premium AI Prompts Collection',
    price: 10.00,
    image_url: '/images/prompts-collection.jpg'
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
                  <div className="text-6xl mb-4 animate-rocket-launch">🚀</div>
                  <div className="text-xl font-bold">AI Prompts Collection</div>
                  <div className="text-sm opacity-80">30 Premium Prompts</div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-20 bg-gradient-to-t from-orange-500 to-transparent animate-rocket-trail"></div>
                <div className="absolute inset-0 animate-stars">
                  <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                  <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
                  <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <style jsx>{`
                @keyframes rocket-launch {
                  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                  25% { transform: translateY(-10px) rotate(-5deg) scale(1.05); }
                  50% { transform: translateY(-20px) rotate(0deg) scale(1.1); }
                  75% { transform: translateY(-10px) rotate(5deg) scale(1.05); }
                }
                @keyframes rocket-trail {
                  0%, 100% { height: 20px; opacity: 0.8; }
                  50% { height: 40px; opacity: 1; }
                }
                @keyframes twinkle {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.5); }
                }
                @keyframes stars {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(2deg); }
                }
                .animate-rocket-launch {
                  animation: rocket-launch 3s ease-in-out infinite;
                  transform-style: preserve-3d;
                }
                .animate-rocket-trail {
                  animation: rocket-trail 3s ease-in-out infinite;
                }
                .animate-twinkle {
                  animation: twinkle 2s ease-in-out infinite;
                }
                .animate-stars {
                  animation: stars 8s ease-in-out infinite;
                }
              `}</style>
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-red-400">${product.price}</span>
                  <span className="text-lg text-gray-500 line-through">$49.99</span>
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">80% OFF</span>
                </div>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {product.name}
                </h1>
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold animate-pulse">
                  LIMITED TIME
                </span>
              </div>
              
              <div className="text-gray-300 space-y-6">
                <p className="text-lg leading-relaxed">
                  Get instant access to our battle-tested collection of 30 premium AI prompts that consistently 
                  produce professional-grade outputs. These aren't generic prompts – they're the exact formulas 
                  we use to create premium quality content.
                </p>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 What's Included</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2">Content Creation (10 Prompts)</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Blog post outlines that rank on Google</li>
                        <li>• Social media content that goes viral</li>
                        <li>• Email sequences that convert</li>
                        <li>• Video scripts that engage</li>
                        <li>• Product descriptions that sell</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Business Strategy (10 Prompts)</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Market research & competitor analysis</li>
                        <li>• Business plan development</li>
                        <li>• SWOT analysis frameworks</li>
                        <li>• Customer persona creation</li>
                        <li>• Pricing strategy optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">Creative Projects (10 Prompts)</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Brand naming & tagline creation</li>
                        <li>• Logo concept development</li>
                        <li>• Website copy that converts</li>
                        <li>• Ad copy that performs</li>
                        <li>• Creative campaign ideas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">⚡ Why These Prompts Work</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Tested & Proven:</strong> Each prompt has generated over $10K in value for our clients</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Optimized for Results:</strong> Engineered for ChatGPT, Claude, and other leading AI models</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Copy & Paste Ready:</strong> No modifications needed – use them immediately</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Detailed Instructions:</strong> Each prompt includes usage tips and examples</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎁 Exclusive Bonuses</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>Prompt Customization Guide (normally $25)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>AI Model Comparison Chart (normally $15)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>Weekly Prompt Updates (3 months free)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span>Private Telegram Group Access</span>
                    </li>
                  </ul>
                  <div className="mt-4 text-sm text-purple-300">
                    <strong>Total Bonus Value: $65</strong> – Yours free with purchase!
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🔥 Limited Time Offer</h3>
                  <p className="text-gray-300 mb-3">
                    This collection normally sells for $49.99, but for a limited time, you can get all 30 prompts 
                    plus bonuses for just <strong className="text-red-400">$10</strong>.
                  </p>
                  <div className="text-sm text-red-300">
                    <strong>⚠️ Sale ends soon!</strong> This is our lowest price ever – don't miss out!
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Instant Digital Delivery:</strong> You'll receive a downloadable PDF with all 30 prompts 
                    immediately after purchase. Compatible with ChatGPT, Claude, Gemini, and all major AI platforms.
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