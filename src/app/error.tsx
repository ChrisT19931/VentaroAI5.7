'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
          <p className="text-lg text-gray-600 mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          {error.message && process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">Error details:</h3>
              <p className="text-sm text-red-700 font-mono">{error.message}</p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-red-800 cursor-pointer">Stack trace</summary>
                  <pre className="mt-2 text-xs text-red-700 overflow-auto p-2 bg-red-50 rounded">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="btn-primary inline-block mr-4"
          >
            Try Again
          </button>
          
          <Link 
            href="/" 
            className="btn-outline inline-block"
          >
            Back to Home
          </Link>
          
          <div className="mt-8">
            <p className="text-gray-600 mb-2">Need help?</p>
            <Link 
              href="/contact" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}