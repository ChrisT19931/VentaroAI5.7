'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Cinematic background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-500/30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-purple-500/30 rotate-12 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white glow-text">Ventaro AI</h3>
            <p className="text-white">
              AI-Powered Digital Products designed to transform your business and enhance your workflow.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/christ111/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:translate-x-2">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:translate-x-2">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:translate-x-2">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:translate-x-2">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white relative">
              Customer Service
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:translate-x-2">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms#refund-policy" className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:translate-x-2">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:translate-x-2">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:translate-x-2">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white relative">
              AI Products
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500"></div>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/2" className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:translate-x-2">
                  AI Prompts Arsenal
                </Link>
              </li>
              <li>
                <Link href="/products/1" className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:translate-x-2">
                  AI Tools Mastery Guide
                </Link>
              </li>
              <li>
                <Link href="/products/3" className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:translate-x-2">
                  AI Business Strategy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <p className="text-gray-400">&copy; {currentYear} <span className="text-white glow-text">Ventaro AI</span> Digital Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}