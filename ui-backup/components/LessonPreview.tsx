'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const LessonPreview: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Business</span> Mastery
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            30 one-page lessons to build a profitable AI business in 2025
          </p>
        </div>
        
        {/* Lesson Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          {/* Section 1: AI Platform Mastery */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-blue-400 text-4xl mb-3 sm:mb-4">🤖</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">AI Platform Mastery</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Essential AI tools for business growth</p>
            <ul className="space-y-1 sm:space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><span className="text-white">ChatGPT</span> for content creation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><span className="text-white">Midjourney</span> for image generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><span className="text-white">Claude</span> for business analysis</span>
              </li>
            </ul>
          </div>
          
          {/* Section 2: AI-Powered Business Models */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-green-400 text-4xl mb-3 sm:mb-4">💰</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">AI-Powered Business Models</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Profitable services you can start offering</p>
            <ul className="space-y-1 sm:space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><span className="text-white">AI-powered blog writing</span> ($500-1,500/mo)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><span className="text-white">Social media content automation</span> ($800-2,000/mo)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><span className="text-white">AI video script generation</span> ($1,000-3,000/mo)</span>
              </li>
            </ul>
          </div>
          
          {/* Section 3: Advanced Applications */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-red-400 text-4xl mb-3 sm:mb-4">🔥</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Advanced Applications</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">High-value AI implementation strategies</p>
            <ul className="space-y-1 sm:space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span><span className="text-white">AI-powered SEO optimization</span> for higher rankings</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span><span className="text-white">Automated email marketing</span> with AI personalization</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span><span className="text-white">AI workflow automation</span> for business efficiency</span>
              </li>
            </ul>
          </div>
          
          {/* Section 4: AI Business Strategy */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-blue-400 text-4xl mb-3 sm:mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">AI Business Strategy</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Frameworks for sustainable AI businesses</p>
            <ul className="space-y-1 sm:space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><span className="text-white">AI business automation</span> for scaling operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><span className="text-white">AI-powered product creation</span> for passive income</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span><span className="text-white">Client acquisition strategies</span> for AI services</span>
              </li>
            </ul>
          </div>
          
          {/* Section 5: Implementation Examples */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-yellow-400 text-4xl mb-3 sm:mb-4">💡</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Implementation Examples</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Real-world AI business case studies</p>
            <ul className="space-y-1 sm:space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><span className="text-white">AI blog writing service</span> with content strategy</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><span className="text-white">AI social media management</span> for businesses</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><span className="text-white">AI SEO optimization service</span> with proven results</span>
              </li>
            </ul>
          </div>
          
          {/* Section 6: AI Implementation Tools */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-purple-400 text-4xl mb-3 sm:mb-4">🛠️</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">AI Implementation Tools</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Resources to accelerate your AI business</p>
            <ul className="space-y-1 sm:space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><span className="text-white">AI prompt templates</span> for business tasks</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><span className="text-white">AI workflow guides</span> for efficient operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span><span className="text-white">Quick action steps</span> for immediate results</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Roadmap Section */}
        <div className="glass-panel rounded-xl p-6 sm:p-8 border border-blue-500/30 mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">Your AI Business Roadmap</h3>
          <p className="text-gray-300 mb-6 sm:mb-8 text-center max-w-3xl mx-auto text-sm sm:text-base">
            Follow this proven step-by-step plan based on our 30 lessons to build your AI business from zero to $10K+ per month
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-16">
            <div className="glass-panel rounded-lg p-4 sm:p-6 hover:shadow-glow transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30-Day Quick Start Plan
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Master 2 essential AI tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Set up your service portfolio</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create client acquisition system</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Generate your first $500-1,000</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-panel rounded-lg p-6 hover:shadow-glow transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                90-Day Growth Plan
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Master 15 more advanced AI tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Implement AI automation workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create AI-powered service offerings</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Develop consistent income streams</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-panel rounded-lg p-6 hover:shadow-glow transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                365-Day Vision
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Master all 30 AI tools and strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create your own AI-powered products</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Build multiple passive income streams</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Become an AI business expert</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Breakthrough Banner */}
        <div className="glass-panel rounded-xl p-6 sm:p-8 md:p-10 border border-purple-500/30 mt-12 sm:mt-16 md:mt-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
            Start Your AI Business Journey Today
          </h3>
          <p className="text-gray-300 mb-6 sm:mb-8 text-center max-w-3xl mx-auto text-sm sm:text-base md:text-lg">
            These 30 one-page lessons provide a complete roadmap to building a profitable AI business in 2025. 
            Each lesson includes a quick action step to implement what you've learned immediately. 
            Whether you're starting from zero or looking to scale your existing business, 
            this guide gives you the exact strategies, tools, and frameworks you need to succeed.
          </p>
          <div className="flex justify-center">
            <Link href="/products/1" className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:opacity-90 transition-all duration-300 text-sm sm:text-base md:text-lg">
              Get The Complete Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonPreview;