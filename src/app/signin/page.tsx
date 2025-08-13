'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

// Test credentials component for easy access during testing
const TestCredentials = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const searchParams = useSearchParams();
  
  const handleQuickLogin = async (email: string) => {
    try {
      setIsLoggingIn(true);
      toast.loading('Signing in...');
      
      // Get the callback URL from search params or default to my-account
      const callbackUrl = searchParams?.get('callbackUrl') || '/my-account';
      
      // Use the actual credentials sign-in
      const result = await signIn('credentials', {
        email,
        password: 'Rabbit5511$$11',
        redirect: false
      });
      
      if (result?.error) {
        throw new Error(result.error || 'Login failed');
      }
      
      toast.dismiss();
      toast.success('Login successful! Redirecting...');
      
      // Redirect to the callback URL
      window.location.href = `${callbackUrl}?t=${Date.now()}`;
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-300">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Login:</h3>
      
      <div className="space-y-2">
        <button 
          onClick={() => handleQuickLogin('chris.t@ventarosales.com')}
          disabled={isLoggingIn}
          className="w-full py-1.5 px-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login as Admin
        </button>
        
        <button 
          onClick={() => handleQuickLogin('christroiano1993@gmail.com')}
          disabled={isLoggingIn}
          className="w-full py-1.5 px-2 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login as Test User 1
        </button>
        
        <button 
          onClick={() => handleQuickLogin('christroiano1993@hotmail.com')}
          disabled={isLoggingIn}
          className="w-full py-1.5 px-2 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login as Test User 2
        </button>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-300">
        <p className="text-xs text-gray-500">All test accounts use password: Rabbit5511$$11</p>
      </div>
    </div>
  );
};

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      toast.loading('Signing in...');
      
      // Get the callback URL from search params or default to my-account
      const callbackUrl = searchParams?.get('callbackUrl') || '/my-account';
      
      // Use NextAuth's signIn function with credentials provider
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      
      if (result?.error) {
        throw new Error(result.error || 'Login failed');
      }
      
      toast.dismiss();
      toast.success('Login successful! Redirecting...');
      
      // Redirect to the callback URL with cache busting
      window.location.href = `${callbackUrl}?t=${Date.now()}`;
    } catch (error: any) {
      toast.dismiss();
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleCredentialsSignIn}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create an account
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}