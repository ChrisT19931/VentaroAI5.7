'use client';

import Link from 'next/link';
import { useState } from 'react';

// Animated border component with optimized animation timing
function AnimatedBorder() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-gradientX" style={{ animationDuration: '2s' }}></div>
      
      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-gradientX" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-black/80 backdrop-blur-sm border-t border-gray-800 mt-20">
      <AnimatedBorder />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Ventaro AI */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-blue-400 mr-2">Ventaro</span> AI
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Pioneering the future of digital products with cutting-edge AI technology.
            </p>
            <a 
              href="https://www.linkedin.com/in/christ111" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 inline-flex items-center"
            >
              <span className="mr-2">Follow us on LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { name: 'FAQ', href: '/faq' },
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Refund Policy', href: '/terms#refund-policy' },
                { name: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AI Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">AI Products</h3>
            <ul className="space-y-2">
              {[
                { name: 'AI Tools Mastery Guide 2025', href: '/products/1' },
                { name: 'AI Prompts Arsenal 2025', href: '/products/2' },
                { name: 'AI Business Strategy Session 2025', href: '/products/3' },
                { name: 'All Products', href: '/products' },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Ventaro AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}