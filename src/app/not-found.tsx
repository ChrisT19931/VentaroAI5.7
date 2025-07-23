import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="h-1.5 w-12 bg-primary-600 mx-auto my-6"></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="btn-primary inline-block"
          >
            Back to Home
          </Link>
          
          <div className="mt-8">
            <p className="text-gray-600 mb-2">You might want to check out:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Browse Products
              </Link>
              <Link 
                href="/contact" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Contact Support
              </Link>
              <Link 
                href="/faq" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}