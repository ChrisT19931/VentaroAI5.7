'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function BulletproofSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const callbackUrl = searchParams?.get('callbackUrl') || '/my-account';

  // BULLETPROOF AUTHENTICATION CHECK
  useEffect(() => {
    console.log('🔐 BULLETPROOF SIGNIN: Session status:', status);
    
    if (status === 'authenticated' && session?.user) {
      console.log('✅ BULLETPROOF SIGNIN: User already authenticated, redirecting...');
      toast.success('Already signed in!');
      window.location.href = callbackUrl;
    }
  }, [status, session, callbackUrl]);

  // BULLETPROOF FORM VALIDATION
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // BULLETPROOF SIGN IN HANDLER
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    console.log('🚀 BULLETPROOF SIGNIN: Starting sign in process for:', email);
    
    if (!validateForm()) {
      console.error('❌ BULLETPROOF SIGNIN: Form validation failed');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 BULLETPROOF SIGNIN: Attempting NextAuth sign in...');
      
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      console.log('🔐 BULLETPROOF SIGNIN: NextAuth result:', { 
        ok: result?.ok, 
        error: result?.error, 
        status: result?.status, 
        url: result?.url 
      });

      if (result?.error) {
        console.error('❌ BULLETPROOF SIGNIN: Authentication failed:', result.error);
        
        let errorMessage = 'Invalid email or password. Please try again.';
        
        if (result.error.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (result.error.includes('Email and password are required')) {
          errorMessage = 'Please enter both email and password.';
        } else if (result.error.includes('Authentication failed')) {
          errorMessage = 'Authentication system error. Please try again.';
        } else {
          errorMessage = `Sign in failed: ${result.error}`;
        }
        
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
        return;
      }

      if (result?.ok) {
        console.log('✅ BULLETPROOF SIGNIN: Authentication successful!');
        toast.success('Welcome back!');
        
        // Force immediate redirect
        console.log('🔄 BULLETPROOF SIGNIN: Redirecting to:', callbackUrl);
        window.location.href = callbackUrl;
      } else {
        console.error('❌ BULLETPROOF SIGNIN: Unexpected result');
        setErrors({ general: 'Sign in failed. Please try again.' });
        toast.error('Sign in failed. Please try again.');
      }

    } catch (error: any) {
      console.error('❌ BULLETPROOF SIGNIN: Exception during sign in:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // BULLETPROOF QUICK LOGIN FOR TESTING
  const handleQuickLogin = async (testEmail: string, testPassword: string, userName: string) => {
    console.log('🔐 BULLETPROOF SIGNIN: Quick login for:', testEmail);
    setEmail(testEmail);
    setPassword(testPassword);
    
    // Small delay to show the form update
    setTimeout(async () => {
      const mockEvent = { preventDefault: () => {} } as React.FormEvent;
      await handleSignIn(mockEvent);
    }, 100);
  };

  // Show loading only during actual sign in process
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Signing you in...</p>
          <p className="text-white/60 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to your Ventaro AI account
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSignIn}>
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm text-gray-300 mb-4 text-center">Development Quick Login:</p>
              <div className="space-y-2">
                                 <button
                   onClick={() => handleQuickLogin('chris.t@ventarosales.com', 'Rabbit5511$$11', 'Admin')}
                   className="w-full px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                 >
                   🔑 Admin Login
                 </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}