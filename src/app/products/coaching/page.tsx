'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/lib/supabase';

// Define the product type
type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  [key: string]: any;
};

// Fallback product data
const fallbackProduct = {
      id: 'coaching-call-1on1',
      name: '1-on-1 Website Deployment Coaching Call + Full Report',
      price: 500.00,
      image_url: '/images/coaching-session.svg'
    };

export default function CoachingProductPage() {
  const [product, setProduct] = useState<Product>(fallbackProduct);
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = await createClient();
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', 'coaching-call-1on1')
          .eq('is_active', true)
          .single();
        
        if (error || !data) {
          console.error('Error fetching coaching product:', error);
          // Use fallback product if not found in database
          return;
        }
        
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="glass-card p-8">
              <div className="bg-gradient-accent rounded-lg h-96 flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="text-center text-white relative z-10">
                  <div className="text-6xl mb-4 animate-target-focus">🎯</div>
                  <div className="text-xl font-bold">1-on-1 Coaching</div>
                  <div className="text-sm opacity-80">60 Minutes Session + Full Report</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-white/20 rounded-full animate-target-ring-1"></div>
                  <div className="absolute w-24 h-24 border-2 border-white/30 rounded-full animate-target-ring-2"></div>
                  <div className="absolute w-16 h-16 border-2 border-white/40 rounded-full animate-target-ring-3"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 animate-coaching-arrow" style={{transformOrigin: 'bottom center'}}></div>
                <Image 
                  src="/images/coaching-session.svg" 
                  alt="1-on-1 Coaching Session" 
                  fill 
                  className="object-contain opacity-20" 
                />
              </div>
              <style jsx>{`
                @keyframes target-focus {
                  0%, 100% { transform: scale(1) rotateZ(0deg); }
                  25% { transform: scale(1.05) rotateZ(-2deg); }
                  50% { transform: scale(1.1) rotateZ(0deg); }
                  75% { transform: scale(1.05) rotateZ(2deg); }
                }
                @keyframes target-ring-1 {
                  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.2; }
                  50% { transform: scale(1.1) rotate(180deg); opacity: 0.4; }
                }
                @keyframes target-ring-2 {
                  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
                  50% { transform: scale(1.15) rotate(-180deg); opacity: 0.5; }
                }
                @keyframes target-ring-3 {
                  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
                  50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
                }
                @keyframes coaching-arrow {
                  0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(0deg) scale(1); opacity: 0.8; }
                  25% { transform: translateX(-50%) translateY(-50%) rotate(15deg) scale(1.1); opacity: 1; }
                  50% { transform: translateX(-50%) translateY(-50%) rotate(0deg) scale(1.2); opacity: 1; }
                  75% { transform: translateX(-50%) translateY(-50%) rotate(-15deg) scale(1.1); opacity: 1; }
                }
                .animate-target-focus {
                  animation: target-focus 4s ease-in-out infinite;
                  transform-style: preserve-3d;
                }
                .animate-target-ring-1 {
                  animation: target-ring-1 6s linear infinite;
                }
                .animate-target-ring-2 {
                  animation: target-ring-2 8s linear infinite;
                }
                .animate-target-ring-3 {
                  animation: target-ring-3 10s linear infinite;
                }
                .animate-coaching-arrow {
                  animation: coaching-arrow 3s ease-in-out infinite;
                }
              `}</style>
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-lg text-gray-400 line-through mb-1">$750</div>
                  <div className="text-3xl font-bold text-green-400 mb-2">${product.price.toFixed(2)}</div>
                  <div className="text-sm text-green-400 font-medium">Save $250 - Limited Time!</div>
                </div>
                <AddToCartButton product={product} />
                <div className="mt-4 text-sm text-gray-400">
                  After purchase, you'll receive scheduling instructions via email from chris.t@ventarosales.com
                </div>
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
                  Get personalized, one-on-one guidance from our website deployment experts. This isn't a generic consultation – 
                  it's a deep-dive session tailored specifically to your website needs and deployment goals.
                </p>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📞 How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Purchase & Schedule</h4>
                        <p className="text-gray-300 text-sm">After purchase, contact <strong className="text-blue-400">chris.t@ventarosales.com</strong> to schedule your session</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Pre-Session Prep</h4>
                        <p className="text-gray-300 text-sm">We'll send you a brief questionnaire to understand your specific needs and goals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">60-Minute Session</h4>
                        <p className="text-gray-300 text-sm">Live video call with screen sharing, personalized guidance, and actionable strategies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Follow-Up Resources</h4>
                        <p className="text-gray-300 text-sm">Receive session recording, implementation report, and 30-day email support</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 What We'll Cover</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2">Website Deployment Guidance</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Step-by-step site deployment walkthrough</li>
                        <li>• Domain setup and configuration</li>
                        <li>• DNS management and propagation</li>
                        <li>• SSL certificate installation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Technical Implementation</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Hosting platform selection and setup</li>
                        <li>• File transfer and deployment methods</li>
                        <li>• Database configuration</li>
                        <li>• Environment variables setup</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">Troubleshooting Common Issues</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Identifying deployment errors</li>
                        <li>• DNS configuration problems</li>
                        <li>• SSL certificate verification</li>
                        <li>• Server connection issues</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Post-Deployment Optimization</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Performance monitoring setup</li>
                        <li>• Security best practices</li>
                        <li>• Backup and recovery planning</li>
                        <li>• Ongoing maintenance strategies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎁 What You Get</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">60-Minute Live Session:</strong> Interactive site deployment walkthrough with screen sharing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Session Recording:</strong> Full video with cursor movements and detailed explanations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Tech Stack Analysis:</strong> Detailed breakdown of required technologies for your site</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Comprehensive Implementation Report:</strong> Step-by-step deployment guide with screenshots</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Deployment Checklist:</strong> Complete pre and post-launch verification steps</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">30-Day Email Support:</strong> Post-deployment troubleshooting assistance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">⭐</span>
                      <span><strong className="text-white">Hosting & Domain Resources:</strong> Personalized recommendations for your specific needs</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">👨‍💼 Meet Your Deployment Expert</h3>
                  <p className="text-gray-300 mb-3">
                    You'll be working directly with our lead web deployment specialist who has:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="text-orange-400">✓</span>
                      <span>5+ years of website deployment experience</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-orange-400">✓</span>
                      <span>Helped 200+ clients successfully launch their websites</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-orange-400">✓</span>
                      <span>Expertise in various hosting platforms and deployment methods</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-orange-400">✓</span>
                      <span>Specialist in domain configuration, SSL setup, and performance optimization</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📧 Scheduling Instructions</h3>
                  <div className="space-y-3">
                    <p className="text-gray-300">
                      <strong className="text-white">After purchase:</strong> Email <strong className="text-blue-400">chris.t@ventarosales.com</strong> with:
                    </p>
                    <ul className="space-y-2 text-gray-300 ml-4">
                      <li>• Your order confirmation number</li>
                      <li>• 3 preferred time slots (include timezone)</li>
                      <li>• Brief description of your website project</li>
                      <li>• Current hosting setup (if any)</li>
                    </ul>
                    <p className="text-gray-300 text-sm mt-3">
                      <strong className="text-white">Response time:</strong> We'll confirm your session within 24 hours and send calendar invite + deployment preparation checklist.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">100% Satisfaction Guarantee:</strong> If you're not completely satisfied with your session, 
                    we'll provide additional support until your website is successfully deployed and live.
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