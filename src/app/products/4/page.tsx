import { Metadata } from 'next'
import Link from 'next/link'
import BuyNowButton from '../../../components/BuyNowButton'
import StarBackground from '../../../components/3d/StarBackground'

export const metadata: Metadata = {
  title: 'Live Support Contract - VentaroAI',
  description: 'Premium screenshare live support contract at promotional rates. Get direct access to expert guidance with real-time problem solving.',
}

const product = {
  id: '4',
  name: 'Live Support Contract 2025',
  description: 'Premium screenshare live support contract at promotional rates. Get direct access to expert guidance with real-time problem solving and implementation support.',
  price: 190.00,
  originalPrice: 300.00,
  imageUrl: '/images/live-support.jpg',
  category: 'Support Services',
  features: [
    '🖥️ Live screenshare support sessions with expert guidance',
    '⚡ Real-time problem solving and implementation support',
    '📋 Flexible hourly contract with no long-term commitment',
    '🎯 Direct access to AI business implementation experts',
    '💼 Professional consultation on business automation',
    '🔧 Technical troubleshooting and optimization',
    '📊 Performance analysis and improvement recommendations',
    '⏰ Limited time promotional pricing - ends September 1st'
  ],
  benefits: [
    'Immediate expert assistance when you need it most',
    'Save time with direct problem-solving approach',
    'Learn while getting work done through guided sessions',
    'No long-term contracts or commitments required',
    'Significant cost savings with promotional pricing',
    'Access to years of AI business implementation experience'
  ]
}

export default function LiveSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <StarBackground />
      
      {/* Urgent floating elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-orange-500/15 to-yellow-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Back button */}
        <Link href="/products" className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors mb-8 group">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Product Image */}
          <div className="relative group">
            <div className="aspect-square bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-3xl border border-red-400/30 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all duration-500"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                  <svg className="w-48 h-48 text-white drop-shadow-2xl" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.3,14.9 16.2,14.9 16.1,14.9C15.8,14.9 15.6,15 15.4,15.2L13.2,17.4C10.4,15.9 8,13.6 6.6,10.8L8.8,8.6C9.1,8.3 9.2,7.9 9,7.6C8.7,6.5 8.5,5.2 8.5,4C8.5,3.5 8,3 7.5,3H4C3.5,3 3,3.5 3,4C3,13.4 10.6,21 20,21C20.5,21 21,20.5 21,20V16.5C21,16 20.5,15.5 20,15.5M5,5H6.5C6.6,5.9 6.8,6.8 7,7.6L5.8,8.8C5.4,7.6 5.1,6.3 5,5M19,19C17.7,18.9 16.4,18.6 15.2,18.2L16.4,17C17.2,17.2 18.1,17.4 19,17.4V19Z"/>
                  </svg>
                </div>
              </div>
              
              {/* Urgent badges */}
              <div className="absolute top-6 left-6">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                  🔥 LIVE SUPPORT
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-black text-sm font-black px-4 py-2 rounded-full shadow-lg animate-pulse">
                  ⏰ ENDS SEPT 1st
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold border border-red-400/30">
                  {product.category}
                </span>
                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-black text-xs font-black px-3 py-1 rounded-full animate-pulse">
                  37% OFF
                </div>
              </div>
              
              <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-orange-200">
                {product.name}
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-2xl p-8 border border-red-400/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-lg text-gray-400 line-through mb-2">Usually A${product.originalPrice}/hour</div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-2 animate-pulse">
                  A${product.price}
                </div>
                <div className="text-lg text-gray-300 font-medium mb-2">🔥 Per Hour Contract Rate</div>
                <div className="text-red-400 font-bold animate-pulse">⚡ Limited Time - Contract Ends September 1st!</div>
              </div>
            </div>

            {/* Buy Button */}
            <div className="space-y-4">
              <BuyNowButton 
                product={product}
                className="w-full py-6 text-xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:via-orange-500 hover:to-red-500 text-white rounded-2xl shadow-2xl hover:shadow-red-400/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 border-2 border-red-400/50 hover:border-red-300/70 relative overflow-hidden group"
              />
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-black text-white z-10 group-hover:animate-pulse">🔥 Get Live Support Contract</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
              
              <p className="text-center text-sm text-gray-400">
                💳 Secure payment • 🔒 Instant access • ⚡ No long-term commitment
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              What's Included
            </h2>
            <div className="space-y-4">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex-shrink-0 mt-1 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Key Benefits
            </h2>
            <div className="space-y-4">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex-shrink-0 mt-1 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Urgency Section */}
        <div className="mt-20 bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-3xl p-12 border border-red-400/30 backdrop-blur-sm text-center">
          <h2 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 animate-pulse">
            ⚡ Limited Time Offer
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            This promotional pricing is only available until <strong className="text-red-400">September 1st at 12:00 AM</strong>. 
            After that, the rate returns to the standard A$300/hour. Don't miss out on this 37% savings opportunity!
          </p>
          <div className="flex justify-center items-center space-x-8 text-2xl font-bold">
            <div className="text-red-400 animate-pulse">🔥 A$190/hour</div>
            <div className="text-gray-500">vs</div>
            <div className="text-gray-400 line-through">A$300/hour</div>
          </div>
        </div>
      </div>
    </div>
  )
}