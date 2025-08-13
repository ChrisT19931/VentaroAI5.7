'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; general?: string }>({});
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
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    console.log('🔐 Starting signup process for:', email);
    
    if (!validateForm()) {
      console.error('❌ Form validation failed');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Calling registration API...');
      
      // Register user via API endpoint
      const signupResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          name: name.trim() 
        }),
      });
      
      const signupData = await signupResponse.json();
      console.log('🔐 Registration response:', signupData);
      
      if (!signupResponse.ok) {
        console.error('❌ Registration failed:', signupData.error);
        
        if (signupResponse.status === 409) {
          setErrors({ email: 'An account with this email already exists. Try signing in instead.' });
        } else {
          setErrors({ general: signupData.error || 'Registration failed. Please try again.' });
        }
        toast.error(signupData.error || 'Registration failed. Please try again.');
        return;
      }

      console.log('✅ Registration successful, attempting automatic sign in...');
      toast.success('Account created successfully! Signing you in...');
      
      // Automatically sign in the user
      const signInResult = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('❌ Auto sign-in failed:', signInResult.error);
        toast.error('Account created but auto sign-in failed. Please sign in manually.');
        router.push('/signin');
        return;
      }

      if (signInResult?.ok) {
        console.log('✅ Auto sign-in successful');
        toast.success(`Welcome to Ventaro AI, ${name}!`);
        
        // Force a full page reload to ensure all auth state is updated
        window.location.href = callbackUrl;
      } else {
        console.error('❌ Auto sign-in failed - no success flag');
        toast.error('Account created but auto sign-in failed. Please sign in manually.');
        router.push('/signin');
      }

    } catch (error: any) {
      console.error('❌ Signup error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Join Ventaro AI</h2>
          <p className="text-gray-300 text-lg">Create your account and start your AI journey</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <form onSubmit={handleSignup} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-gray-600 focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

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
                  autoComplete="new-password"
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
                  placeholder="Create a strong password"
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
              <div className="mt-2">
                <p className="text-xs text-gray-400">
                  Password must contain at least 6 characters with uppercase, lowercase, and numbers
                </p>
              </div>
            </div>

            {/* Terms and Privacy */}
            <div className="text-sm text-gray-400">
              <p>
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </Link>
                .
              </p>
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
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link 
                href="/signin" 
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign in here
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