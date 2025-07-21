import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Premium AI Tools & Digital Products
              </h1>
              <p className="text-xl opacity-90">
                Enhance your workflow with our curated collection of high-quality AI tools and digital products.
              </p>
              <div className="pt-4">
                <Link href="/products" className="btn-primary text-lg px-8 py-3 inline-block">
                  Browse Products
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">AI Product Showcase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1: E-book */}
            <div className="card group hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  E-book Cover
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  Premium AI E-book
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive guide to leveraging AI for your business and personal productivity.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">$99.99</span>
                  <Link href="/products/ebook" className="btn-outline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product 2: AI Prompts x30 */}
            <div className="card group hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  AI Prompts Collection
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  30 Premium AI Prompts
                </h3>
                <p className="text-gray-600 mb-4">
                  Collection of 30 expertly crafted prompts to maximize your AI tool results.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-600">$10.00</span>
                    <span className="text-sm text-gray-500 line-through">$49.99</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">SALE</span>
                  </div>
                  <Link href="/products/prompts" className="btn-outline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Product 3: Coaching Call */}
            <div className="card group hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Coaching Session
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  1-on-1 Coaching Call
                </h3>
                <p className="text-gray-600 mb-4">
                  Personal 60-minute coaching session to optimize your AI workflow.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">$300.00</span>
                  <Link href="/products/coaching" className="btn-outline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p className="text-gray-600">
                Get immediate access to your purchased products with our seamless delivery system.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Your transactions are protected with industry-standard security measures.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Time Payment</h3>
              <p className="text-gray-600">
                No subscriptions or hidden fees. Pay once and own the product forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Workflow?</h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto mb-8">
            Browse our collection of premium AI tools and digital products designed to help you work smarter, not harder.
          </p>
          <Link href="/products" className="btn-primary text-lg px-8 py-3 inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  )
}