import LessonMenu from '../LessonMenu';

export default function SuccessStoriesAndCaseStudies() {
  return (
    <div className="glass-card p-8">
      <LessonMenu />
      
      <h1 className="text-3xl font-bold text-white mb-6">Lesson 3: Success Stories and Case Studies</h1>
      
      {/* Learning Objectives */}
      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-300 mb-3">🎯 Learning Objectives</h3>
        <p className="text-green-100 mb-3">By the end of this comprehensive lesson, you will:</p>
        <ul className="list-disc ml-6 text-green-200 space-y-1">
          <li>Analyze 15+ real-world AI success stories across different industries</li>
          <li>Identify the common patterns that lead to AI implementation success</li>
          <li>Understand the specific strategies, tools, and timelines used by winners</li>
          <li>Learn how to adapt successful AI strategies to your unique situation</li>
          <li>Avoid the critical mistakes that cause 80% of AI projects to fail</li>
        </ul>
      </div>

      {/* Pro Tip */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-blue-100">Study successful AI implementations in your industry first, then adapt their strategies to your unique situation. Success leaves clues, and AI success follows predictable patterns you can replicate.</p>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">📋 Executive Summary</h2>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">Real success stories provide the blueprint for your AI journey. This lesson analyzes proven case studies across industries to extract actionable patterns you can replicate.</p>
          
          <p className="text-gray-300 mb-4">We'll examine everything from solo entrepreneurs who built six-figure AI services to Fortune 500 companies that transformed entire operations. Each case study includes the specific tools used, implementation timeline, challenges faced, and measurable results achieved.</p>
          
          <p className="text-gray-300">More importantly, we'll identify the universal success principles that apply regardless of industry, company size, or technical expertise. These patterns are your roadmap to AI success.</p>
        </div>
      </div>

      {/* The Success Pattern Framework */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">🔍 The Success Pattern Framework</h2>
        <div className="bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">After analyzing hundreds of AI success stories, five universal patterns emerge:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">1. 🎯 Problem-First Approach</h3>
                <p className="text-green-200 text-sm mb-2">Winners identify a specific, painful problem before choosing AI tools:</p>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• Define the problem clearly and quantifiably</li>
                  <li>• Understand the cost of NOT solving it</li>
                  <li>• Validate that AI is the right solution</li>
                  <li>• Set measurable success criteria</li>
                </ul>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">2. 🚀 Start Small, Scale Fast</h3>
                <p className="text-blue-200 text-sm mb-2">Successful implementations begin with pilot projects:</p>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• Choose low-risk, high-impact first projects</li>
                  <li>• Prove ROI before scaling</li>
                  <li>• Build internal confidence and buy-in</li>
                  <li>• Learn and iterate quickly</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h3 className="text-purple-300 font-semibold mb-2">3. 📊 Data-Driven Decisions</h3>
                <p className="text-purple-200 text-sm mb-2">Winners track everything and optimize continuously:</p>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• Establish baseline metrics before AI</li>
                  <li>• Monitor performance continuously</li>
                  <li>• A/B test different approaches</li>
                  <li>• Make decisions based on data, not assumptions</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h3 className="text-orange-300 font-semibold mb-2">4. 🤝 Human-AI Collaboration</h3>
                <p className="text-orange-200 text-sm mb-2">Success comes from augmenting humans, not replacing them:</p>
                <ul className="text-orange-200 space-y-1 text-sm">
                  <li>• AI handles repetitive, data-heavy tasks</li>
                  <li>• Humans focus on strategy and creativity</li>
                  <li>• Create feedback loops for continuous improvement</li>
                  <li>• Train teams to work effectively with AI</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">5. 🔄 Continuous Evolution</h3>
                <p className="text-red-200 text-sm mb-2">AI success requires ongoing adaptation and improvement:</p>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• Stay updated with new AI capabilities</li>
                  <li>• Regularly review and optimize processes</li>
                  <li>• Expand successful AI applications</li>
                  <li>• Share learnings across the organization</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">🏆 Success Indicator Checklist</h3>
                <p className="text-yellow-200 text-sm mb-2">Rate your current AI initiative (1-5):</p>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li>• Problem clarity: ___/5</li>
                  <li>• Pilot approach: ___/5</li>
                  <li>• Data tracking: ___/5</li>
                  <li>• Human integration: ___/5</li>
                  <li>• Continuous improvement: ___/5</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Case Studies */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">📚 Detailed Case Studies</h2>
        
        {/* Case Study 1: Solo Entrepreneur */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 rounded-full p-2">
              <span className="text-white text-xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Case Study 1: Sarah's AI Content Agency</h3>
            <div className="bg-green-900/30 border border-green-500/30 rounded px-3 py-1">
              <span className="text-green-300 text-sm font-semibold">$0 → $180K/year in 8 months</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">📋 Background</h4>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• Former marketing manager, laid off in 2024</li>
                  <li>• No technical background or coding skills</li>
                  <li>• $5,000 savings, needed income fast</li>
                  <li>• Strong writing and marketing experience</li>
                  <li>• Located in Denver, Colorado</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h4 className="text-green-300 font-semibold mb-2">🎯 Strategy</h4>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• Identified content creation as high-demand service</li>
                  <li>• Specialized in AI-powered blog writing</li>
                  <li>• Focused on B2B SaaS companies initially</li>
                  <li>• Positioned as "10x faster, same quality"</li>
                  <li>• Built portfolio with 5 free sample articles</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🛠️ Tools & Process</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• ChatGPT Plus for content generation</li>
                  <li>• Grammarly for editing and refinement</li>
                  <li>• Surfer SEO for optimization</li>
                  <li>• Canva for visual content</li>
                  <li>• Developed 15-step content workflow</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h4 className="text-orange-300 font-semibold mb-2">📈 Results Timeline</h4>
                <ul className="text-orange-200 space-y-1 text-sm">
                  <li>• Month 1: First client at $500/month</li>
                  <li>• Month 3: 5 clients, $4,500/month</li>
                  <li>• Month 6: 12 clients, $12,000/month</li>
                  <li>• Month 8: 15 clients, $18,000/month</li>
                  <li>• Hired 2 virtual assistants</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h4 className="text-red-300 font-semibold mb-2">🎯 Key Success Factors</h4>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• Specialized in one niche initially</li>
                  <li>• Delivered consistent quality fast</li>
                  <li>• Built systems and templates</li>
                  <li>• Focused on client results, not AI</li>
                  <li>• Reinvested profits in tools and team</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">⚠️ Challenges Overcome</h4>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li>• Initial skepticism about AI content</li>
                  <li>• Learning to price services correctly</li>
                  <li>• Managing increasing client workload</li>
                  <li>• Finding and training virtual assistants</li>
                  <li>• Maintaining quality at scale</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-green-900/10 border border-green-500/20 rounded p-4">
            <h4 className="text-green-300 font-semibold mb-2">📝 Replication Blueprint:</h4>
            <p className="text-green-200 text-sm">
              <strong>Week 1-2:</strong> Choose your niche and create 5 sample pieces. 
              <strong>Week 3-4:</strong> Reach out to 50 prospects with samples. 
              <strong>Month 2:</strong> Deliver excellent work to first clients, ask for referrals. 
              <strong>Month 3+:</strong> Scale with systems and team.
            </p>
          </div>
        </div>

        {/* Case Study 2: Small Business */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 rounded-full p-2">
              <span className="text-white text-xl">🏪</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Case Study 2: TechRepair Pro's AI Customer Service</h3>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded px-3 py-1">
              <span className="text-blue-300 text-sm font-semibold">50% cost reduction, 300% faster response</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">📋 Background</h4>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• Local computer repair shop, 8 locations</li>
                  <li>• 25 employees, $2M annual revenue</li>
                  <li>• Customer service was major pain point</li>
                  <li>• Long wait times, inconsistent answers</li>
                  <li>• High staff turnover in support roles</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h4 className="text-green-300 font-semibold mb-2">🎯 Strategy</h4>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• Implemented AI chatbot for common queries</li>
                  <li>• Created knowledge base of 500+ FAQs</li>
                  <li>• Trained AI on company policies and procedures</li>
                  <li>• Kept humans for complex technical issues</li>
                  <li>• Integrated with existing CRM system</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🛠️ Implementation</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• Used Intercom AI chatbot platform</li>
                  <li>• 3-month implementation timeline</li>
                  <li>• Trained AI on 2 years of support tickets</li>
                  <li>• A/B tested different conversation flows</li>
                  <li>• Gradual rollout across all locations</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h4 className="text-orange-300 font-semibold mb-2">📈 Measurable Results</h4>
                <ul className="text-orange-200 space-y-1 text-sm">
                  <li>• 75% of queries resolved by AI</li>
                  <li>• Response time: 24 hours → 2 minutes</li>
                  <li>• Customer satisfaction: 3.2 → 4.6/5</li>
                  <li>• Support costs reduced by $180K annually</li>
                  <li>• Staff redeployed to higher-value tasks</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h4 className="text-red-300 font-semibold mb-2">💡 Key Insights</h4>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• AI excels at repetitive, factual queries</li>
                  <li>• Human oversight crucial for quality</li>
                  <li>• Customer acceptance higher than expected</li>
                  <li>• ROI achieved within 4 months</li>
                  <li>• Freed staff for proactive customer outreach</li>
                </ul>
              </div>
              
              <div className="bg-teal-900/20 border border-teal-500/30 rounded p-4">
                <h4 className="text-teal-300 font-semibold mb-2">🔧 Technical Details</h4>
                <ul className="text-teal-200 space-y-1 text-sm">
                  <li>• Integrated with existing CRM (Salesforce)</li>
                  <li>• Custom training on company procedures</li>
                  <li>• Escalation rules for complex issues</li>
                  <li>• Performance monitoring dashboard</li>
                  <li>• Monthly retraining with new data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Case Study 3: Enterprise */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600 rounded-full p-2">
              <span className="text-white text-xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Case Study 3: GlobalManufacturing's Predictive Maintenance</h3>
            <div className="bg-purple-900/30 border border-purple-500/30 rounded px-3 py-1">
              <span className="text-purple-300 text-sm font-semibold">$12M saved annually</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h4 className="text-blue-300 font-semibold mb-2">📋 Background</h4>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>• Fortune 500 manufacturing company</li>
                  <li>• 50+ facilities worldwide</li>
                  <li>• $2.5B annual revenue</li>
                  <li>• Equipment downtime costing $50K/hour</li>
                  <li>• Reactive maintenance approach</li>
                </ul>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h4 className="text-green-300 font-semibold mb-2">🎯 AI Solution</h4>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• Implemented predictive maintenance AI</li>
                  <li>• IoT sensors on critical equipment</li>
                  <li>• Machine learning models for failure prediction</li>
                  <li>• Integrated with existing ERP systems</li>
                  <li>• Real-time alerts and recommendations</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🛠️ Technology Stack</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• Microsoft Azure IoT platform</li>
                  <li>• Custom ML models (Python/TensorFlow)</li>
                  <li>• Power BI for visualization</li>
                  <li>• 10,000+ sensors across facilities</li>
                  <li>• Edge computing for real-time processing</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h4 className="text-orange-300 font-semibold mb-2">📈 Business Impact</h4>
                <ul className="text-orange-200 space-y-1 text-sm">
                  <li>• 35% reduction in unplanned downtime</li>
                  <li>• 25% decrease in maintenance costs</li>
                  <li>• $12M annual savings achieved</li>
                  <li>• 95% accuracy in failure predictions</li>
                  <li>• ROI of 340% in first year</li>
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h4 className="text-red-300 font-semibold mb-2">📊 Implementation Timeline</h4>
                <ul className="text-red-200 space-y-1 text-sm">
                  <li>• Month 1-3: Pilot at 2 facilities</li>
                  <li>• Month 4-6: Refine models and processes</li>
                  <li>• Month 7-12: Rollout to 20 facilities</li>
                  <li>• Year 2: Full global deployment</li>
                  <li>• Ongoing: Continuous optimization</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">🎓 Lessons Learned</h4>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li>• Data quality crucial for AI success</li>
                  <li>• Change management as important as technology</li>
                  <li>• Start with high-impact, low-complexity use cases</li>
                  <li>• Invest heavily in staff training</li>
                  <li>• Measure everything, optimize continuously</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry-Specific Success Patterns */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">🏭 Industry-Specific Success Patterns</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
              <h3 className="text-blue-300 font-semibold mb-2">💼 Professional Services</h3>
              <p className="text-blue-200 text-sm mb-2">Most successful AI applications:</p>
              <ul className="text-blue-200 space-y-1 text-sm">
                <li>• Document analysis and summarization</li>
                <li>• Client proposal generation</li>
                <li>• Research and competitive analysis</li>
                <li>• Time tracking and billing automation</li>
                <li>• Client communication templates</li>
              </ul>
              <div className="mt-2 text-blue-300 text-xs">
                Average ROI: 250-400% | Implementation time: 2-4 months
              </div>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
              <h3 className="text-green-300 font-semibold mb-2">🛒 E-commerce</h3>
              <p className="text-green-200 text-sm mb-2">Highest impact AI use cases:</p>
              <ul className="text-green-200 space-y-1 text-sm">
                <li>• Personalized product recommendations</li>
                <li>• Dynamic pricing optimization</li>
                <li>• Inventory demand forecasting</li>
                <li>• Customer service chatbots</li>
                <li>• Product description generation</li>
              </ul>
              <div className="mt-2 text-green-300 text-xs">
                Average ROI: 180-300% | Implementation time: 3-6 months
              </div>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
              <h3 className="text-purple-300 font-semibold mb-2">🏥 Healthcare</h3>
              <p className="text-purple-200 text-sm mb-2">Proven AI applications:</p>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Medical image analysis</li>
                <li>• Patient scheduling optimization</li>
                <li>• Electronic health record analysis</li>
                <li>• Drug interaction checking</li>
                <li>• Clinical documentation assistance</li>
              </ul>
              <div className="mt-2 text-purple-300 text-xs">
                Average ROI: 150-250% | Implementation time: 6-12 months
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
              <h3 className="text-orange-300 font-semibold mb-2">🏦 Financial Services</h3>
              <p className="text-orange-200 text-sm mb-2">Top performing AI solutions:</p>
              <ul className="text-orange-200 space-y-1 text-sm">
                <li>• Fraud detection and prevention</li>
                <li>• Credit risk assessment</li>
                <li>• Algorithmic trading strategies</li>
                <li>• Customer onboarding automation</li>
                <li>• Regulatory compliance monitoring</li>
              </ul>
              <div className="mt-2 text-orange-300 text-xs">
                Average ROI: 300-500% | Implementation time: 4-8 months
              </div>
            </div>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
              <h3 className="text-red-300 font-semibold mb-2">🏭 Manufacturing</h3>
              <p className="text-red-200 text-sm mb-2">Most impactful AI implementations:</p>
              <ul className="text-red-200 space-y-1 text-sm">
                <li>• Predictive maintenance systems</li>
                <li>• Quality control automation</li>
                <li>• Supply chain optimization</li>
                <li>• Production scheduling</li>
                <li>• Energy consumption optimization</li>
              </ul>
              <div className="mt-2 text-red-300 text-xs">
                Average ROI: 200-400% | Implementation time: 6-12 months
              </div>
            </div>
            
            <div className="bg-teal-900/20 border border-teal-500/30 rounded p-4">
              <h3 className="text-teal-300 font-semibold mb-2">📚 Education</h3>
              <p className="text-teal-200 text-sm mb-2">Successful AI applications:</p>
              <ul className="text-teal-200 space-y-1 text-sm">
                <li>• Personalized learning paths</li>
                <li>• Automated grading systems</li>
                <li>• Student performance prediction</li>
                <li>• Curriculum content generation</li>
                <li>• Administrative task automation</li>
              </ul>
              <div className="mt-2 text-teal-300 text-xs">
                Average ROI: 120-200% | Implementation time: 3-9 months
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Failure Patterns & How to Avoid Them */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">⚠️ Common Failure Patterns & How to Avoid Them</h2>
        <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6">
          <p className="text-gray-300 mb-4">80% of AI projects fail. Here are the most common reasons and how to avoid them:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ Failure Pattern 1: Technology-First Approach</h3>
                <p className="text-red-200 text-sm mb-2">Choosing AI tools before defining the problem</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-2">
                  <h4 className="text-green-300 font-semibold text-sm mb-1">✅ How to Avoid:</h4>
                  <ul className="text-green-200 space-y-1 text-xs">
                    <li>• Define the business problem first</li>
                    <li>• Quantify the cost of not solving it</li>
                    <li>• Validate that AI is the right solution</li>
                    <li>• Set clear success metrics</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ Failure Pattern 2: Unrealistic Expectations</h3>
                <p className="text-red-200 text-sm mb-2">Expecting AI to solve everything immediately</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-2">
                  <h4 className="text-green-300 font-semibold text-sm mb-1">✅ How to Avoid:</h4>
                  <ul className="text-green-200 space-y-1 text-xs">
                    <li>• Start with pilot projects</li>
                    <li>• Set realistic timelines</li>
                    <li>• Focus on augmentation, not replacement</li>
                    <li>• Celebrate small wins</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ Failure Pattern 3: Poor Data Quality</h3>
                <p className="text-red-200 text-sm mb-2">Trying to build AI on incomplete or inaccurate data</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-2">
                  <h4 className="text-green-300 font-semibold text-sm mb-1">✅ How to Avoid:</h4>
                  <ul className="text-green-200 space-y-1 text-xs">
                    <li>• Audit data quality before starting</li>
                    <li>• Clean and standardize data first</li>
                    <li>• Implement data governance</li>
                    <li>• Start with high-quality data subsets</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ Failure Pattern 4: Lack of Change Management</h3>
                <p className="text-red-200 text-sm mb-2">Not preparing teams for AI-driven changes</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-2">
                  <h4 className="text-green-300 font-semibold text-sm mb-1">✅ How to Avoid:</h4>
                  <ul className="text-green-200 space-y-1 text-xs">
                    <li>• Involve stakeholders in planning</li>
                    <li>• Provide comprehensive training</li>
                    <li>• Address fears and concerns openly</li>
                    <li>• Show clear benefits to individuals</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ Failure Pattern 5: No Success Measurement</h3>
                <p className="text-red-200 text-sm mb-2">Implementing AI without tracking results</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-2">
                  <h4 className="text-green-300 font-semibold text-sm mb-1">✅ How to Avoid:</h4>
                  <ul className="text-green-200 space-y-1 text-xs">
                    <li>• Define KPIs before implementation</li>
                    <li>• Establish baseline measurements</li>
                    <li>• Track progress continuously</li>
                    <li>• Adjust strategy based on data</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <h3 className="text-red-300 font-semibold mb-2">❌ Failure Pattern 6: Trying to Boil the Ocean</h3>
                <p className="text-red-200 text-sm mb-2">Attempting to transform everything at once</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-2">
                  <h4 className="text-green-300 font-semibold text-sm mb-1">✅ How to Avoid:</h4>
                  <ul className="text-green-200 space-y-1 text-xs">
                    <li>• Choose 1-2 high-impact use cases</li>
                    <li>• Prove value before expanding</li>
                    <li>• Build internal capabilities gradually</li>
                    <li>• Scale successful patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Success Strategy Worksheet */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">📋 Your Success Strategy Worksheet</h2>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
          <p className="text-yellow-100 mb-4">Use this worksheet to plan your AI success strategy based on proven patterns:</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                <h3 className="text-blue-300 font-semibold mb-2">🎯 Problem Definition</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-blue-200 text-sm">Specific problem to solve:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm">Current cost of this problem:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm">Success metrics:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">🚀 Pilot Project Plan</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-green-200 text-sm">Pilot scope (small & specific):</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-green-200 text-sm">Timeline for pilot:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-green-200 text-sm">Resources needed:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
                <h3 className="text-purple-300 font-semibold mb-2">📊 Success Tracking</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-purple-200 text-sm">Baseline measurements:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-purple-200 text-sm">Weekly review process:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-purple-200 text-sm">Success celebration plan:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                <h3 className="text-orange-300 font-semibold mb-2">🔄 Scaling Strategy</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-orange-200 text-sm">Next expansion areas:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-orange-200 text-sm">Team training plan:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                  <div>
                    <label className="text-orange-200 text-sm">Long-term vision:</label>
                    <div className="bg-gray-800 rounded p-2 mt-1 text-gray-400 text-sm">
                      _________________________________
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Expansion Prompts */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">🚀 AI Expansion Prompts</h3>
        <p className="text-purple-100 text-sm mb-4">Use these prompts to analyze success stories relevant to your situation:</p>
        
        <div className="space-y-4">
          <div className="bg-black/30 rounded p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Industry Success Analysis:</h4>
            <code className="text-green-300 text-sm block">
              "Analyze the most successful AI implementations in [YOUR INDUSTRY] over the past 2 years. Identify the common success patterns, specific tools used, implementation timelines, and ROI achieved. Provide 3 detailed case studies I can adapt to my [COMPANY TYPE/SIZE] with step-by-step replication instructions."
            </code>
          </div>
          
          <div className="bg-black/30 rounded p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Competitive Intelligence:</h4>
            <code className="text-green-300 text-sm block">
              "Research how companies similar to mine in [YOUR INDUSTRY] are using AI successfully. Focus on companies with [YOUR REVENUE SIZE/EMPLOYEE COUNT]. Identify their AI strategies, tools, results, and any competitive advantages gained. Provide actionable insights I can implement immediately."
            </code>
          </div>
          
          <div className="bg-black/30 rounded p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Failure Prevention Strategy:</h4>
            <code className="text-green-300 text-sm block">
              "Analyze the most common reasons AI projects fail in [YOUR INDUSTRY]. Create a comprehensive risk mitigation plan for my AI initiative focused on [YOUR SPECIFIC PROJECT]. Include early warning signs, preventive measures, and contingency plans for each potential failure point."
            </code>
          </div>
        </div>
      </div>

      {/* Action Items & Homework */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-yellow-300 mb-3">📝 Action Items & Homework</h3>
        <p className="text-yellow-100 mb-4">Complete these assignments to apply success patterns to your situation:</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-yellow-300 font-semibold mb-2">This Week:</h4>
            <ul className="text-yellow-200 space-y-1 text-sm">
              <li>□ Complete your success strategy worksheet</li>
              <li>□ Research 3 success stories in your industry</li>
              <li>□ Identify one pilot project to start with</li>
              <li>□ Set up tracking for baseline metrics</li>
              <li>□ Schedule weekly review meetings</li>
            </ul>
          </div>
          <div>
            <h4 className="text-yellow-300 font-semibold mb-2">Next 30 Days:</h4>
            <ul className="text-yellow-200 space-y-1 text-sm">
              <li>□ Launch your pilot AI project</li>
              <li>□ Track progress against success patterns</li>
              <li>□ Connect with others implementing similar AI</li>
              <li>□ Document lessons learned weekly</li>
              <li>□ Plan scaling strategy based on pilot results</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-3">🎯 Key Takeaways</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-green-300 font-semibold mb-2">Success Patterns:</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Problem-first approach beats technology-first</li>
              <li>• Start small, scale fast with proven concepts</li>
              <li>• Data-driven decisions outperform assumptions</li>
              <li>• Human-AI collaboration wins over replacement</li>
              <li>• Continuous evolution is key to sustained success</li>
            </ul>
          </div>
          <div>
            <h4 className="text-red-300 font-semibold mb-2">Failure Prevention:</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Define problems before choosing solutions</li>
              <li>• Set realistic expectations and timelines</li>
              <li>• Ensure high-quality data foundation</li>
              <li>• Invest in change management and training</li>
              <li>• Measure everything, optimize continuously</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">📚 Next Steps</h3>
        <p className="text-gray-300 mb-4">You now have the blueprint from successful AI implementations. Ready to master the specific tools that power these successes?</p>
        <p className="text-gray-300">Continue to <strong>Lesson 4: "ChatGPT-4 Mastery"</strong> to learn the advanced prompt engineering and implementation techniques used by the most successful AI entrepreneurs and companies.</p>
        
        <div className="flex gap-4 mt-6">
          <a href="/downloads/ebook/chatgpt-4-mastery" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">Next Lesson →</a>
        </div>
      </div>
    </div>
  );
}