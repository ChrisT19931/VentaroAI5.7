'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, signOut } = useAuth();
  const { items } = useCart();
  
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
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
              <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                Home
              </Link>
              <Link href="/products" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                Products
              </Link>
              <Link href="/about" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-900 rounded-full animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
            <div className="relative">
              {isLoggedIn ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl shadow-xl bg-white border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Account
                      </Link>
                      <Link href="/orders" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Orders
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={() => signOut()}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm px-6 py-2">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center md:hidden space-x-3">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-900 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100`}>
        <div className="px-4 pt-4 pb-3 space-y-2">
          <Link href="/" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            Home
          </Link>
          <Link href="/products" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            Products
          </Link>
          <Link href="/about" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            About
          </Link>
          <Link href="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            Contact
          </Link>
        </div>
        <div className="px-4 pt-4 pb-6 border-t border-gray-100">
          {isLoggedIn ? (
            <div>
              <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-base font-semibold text-gray-900">{user?.user_metadata?.full_name || 'User'}</div>
                  <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/account" className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Account
                </Link>
                <Link href="/orders" className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                  <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/login" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                Log in
              </Link>
              <Link href="/signup" className="block px-4 py-3 rounded-xl text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200 text-center">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}