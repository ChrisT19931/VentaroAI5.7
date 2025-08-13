'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [authStatus, setAuthStatus] = useState<'checking' | 'unauthenticated' | 'authenticated'>('checking');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/my-account';
  const { data: session, status } = useSession();

  // Check authentication status
  useEffect(() => {
    if (status === 'loading') {
      setAuthStatus('checking');
    } else if (status === 'authenticated' && session) {
      setAuthStatus('authenticated');
      console.log('✅ User already authenticated, redirecting...');
      toast.success('Already signed in!');
      router.push(callbackUrl);
    } else {
      setAuthStatus('unauthenticated');
    }
  }, [status, session, callbackUrl, router]);

  // Validate form inputs
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    console.log('🔐 Starting sign in process for:', email);
    
    if (!validateForm()) {
      console.error('❌ Form validation failed');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Calling NextAuth signIn...');
      
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false, // Handle redirect manually for better error handling
      });

      console.log('🔐 NextAuth signIn result:', { ok: result?.ok, error: result?.error, status: result?.status, url: result?.url });

      if (result?.error) {
        console.error('❌ Sign in failed:', result.error);
        
        // Map NextAuth errors to user-friendly messages
        let errorMessage = 'Invalid email or password. Please try again.';
        
        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (result.error === 'Configuration') {
          errorMessage = 'Authentication system error. Please contact support.';
        } else if (result.error === 'AccessDenied') {
          errorMessage = 'Access denied. Please contact support.';
        } else if (result.error === 'CallbackRouteError') {
          errorMessage = 'Authentication error. Please try again.';
        } else if (result.error.includes('Email and password are required')) {
          errorMessage = 'Please enter both email and password.';
        } else if (result.error.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (result.error.includes('Account configuration error')) {
          errorMessage = 'Account setup issue. Please contact support.';
        } else {
          errorMessage = `Authentication failed: ${result.error}`;
        }
        
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
        return;
      }

      if (result?.ok) {
        console.log('✅ Sign in successful, verifying session...');
        
        // Verify the session was created
        const session = await getSession();
        if (session?.user) {
          console.log('✅ Session verified for user:', session.user.email);
          toast.success(`Welcome back, ${session.user.name || session.user.email}!`);
          
          // Force a full page reload to ensure all auth state is updated
          window.location.href = callbackUrl;
        } else {
          console.error('❌ Session verification failed');
          setErrors({ general: 'Sign in successful but session verification failed. Please try again.' });
          toast.error('Session error. Please try signing in again.');
        }
      } else {
        console.error('❌ Sign in failed - no success flag');
        setErrors({ general: 'Sign in failed. Please try again.' });
        toast.error('Sign in failed. Please try again.');
      }

    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for development/testing
  const handleQuickLogin = async (testEmail: string, testPassword: string, userName: string) => {
    console.log('🔐 Quick login for:', testEmail);
    setEmail(testEmail);
    setPassword(testPassword);
    
    // Small delay to show the form update
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  // Show loading state while checking authentication
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render the form if already authenticated
  if (authStatus === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-white text-lg">Already signed in! Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300 text-lg">Sign in to access your Ventaro AI account</p>
        </div>

        {/* Development Quick Login */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6">
            <h3 className="text-blue-300 font-semibold mb-3 text-sm">🚀 Quick Login (Development)</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@ventaro.ai', 'admin123', 'Admin')}
                className="w-full text-left px-3 py-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg text-blue-200 text-sm transition-colors"
                disabled={isLoading}
              >
                👑 Admin: admin@ventaro.ai
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('test@example.com', 'test123', 'Test User')}
                className="w-full text-left px-3 py-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg text-blue-200 text-sm transition-colors"
                disabled={isLoading}
              >
                👤 User: test@example.com
              </button>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-gray-600 focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-600 focus:ring-purple-500/50 focus:border-purple-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Need help? <Link href="/contact" className="text-purple-400 hover:text-purple-300">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}