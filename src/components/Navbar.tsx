'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const { data: session, status } = useSession();
  const user = session?.user || null;

  return (
    <nav className="glass-panel backdrop-blur-md z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
            <div className="hidden md:ml-6 md:flex md:space-x-2">
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
            {user && (
              <Link href="/my-account" className="flex items-center px-4 py-2 text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">My Account</span>
              </Link>
            )}
            <Link href="/cart" className="relative p-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-xl transition-colors duration-200 group hover:shadow-lg hover:shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
            {!user && (
              <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden space-x-3">
            {user && (
              <Link href="/my-account" className="p-2 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-xl transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-300 hover:text-white hover:bg-blue-600/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-4 pt-4 pb-4 space-y-2 glass-panel mt-2 rounded-lg mx-4 mb-4">
          <Link href="/" className="block px-4 py-3 rounded-xl text-base font-medium text-white/90 hover:text-white hover:bg-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            Home
          </Link>
          <Link href="/products" className="block px-4 py-3 rounded-xl text-base font-medium text-white/90 hover:text-white hover:bg-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            Products
          </Link>
          <Link href="/about" className="block px-4 py-3 rounded-xl text-base font-medium text-white/90 hover:text-white hover:bg-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            About
          </Link>
          <Link href="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-white/90 hover:text-white hover:bg-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            Contact
          </Link>

          {user && (
            <Link href="/my-account" className="flex items-center px-4 py-3 rounded-xl text-base font-medium bg-blue-600/90 text-white hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Account
            </Link>
          )}
          {!user && (
            <Link href="/login" className="block px-4 py-3 rounded-xl text-base font-medium bg-blue-600/90 text-white hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 text-center">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}