'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-black/20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Image 
                src="/images/ventaro-logo.svg" 
                alt="Ventaro AI" 
                width={180} 
                height={50} 
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="hidden md:ml-12 md:flex md:space-x-1">
              <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                Home
              </Link>
              <Link href="/products" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                Products
              </Link>
              <Link href="/about" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse shadow-lg">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center md:hidden space-x-3">
            <Link href="/cart" className="relative p-2 text-white/80 hover:text-white rounded-lg transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10`}>
        <div className="px-4 pt-4 pb-3 space-y-2">
          <Link href="/" className="block px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
            Home
          </Link>
          <Link href="/products" className="block px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
            Products
          </Link>
          <Link href="/about" className="block px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
            About
          </Link>
          <Link href="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}