import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect unauthenticated users to signin page
  if (!session?.user?.email) {
    redirect('/signin?callbackUrl=/downloads');
  }
  
  const user = session.user;
  const isAdmin = user.roles?.includes('admin') || false;
  let purchases: any[] = [];
  let hasAccess = false;

  // Check if user is admin
  if (user?.email === 'chris.t@ventarosales.com') {
    hasAccess = true;
  } else {
    // For non-admin users, verify purchases
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/purchases/confirm?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        purchases = data.purchases || [];
        
        // Check if user has any purchases
        hasAccess = purchases.length > 0;
      } else {
        console.error('Failed to fetch user purchases');
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error);
    }
  }

  // Create a client component for download functionality
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Downloads
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Access all your purchased digital products here
          </p>
        </div>

        {!hasAccess && (
          <div className="mt-10 text-center">
            <div className="rounded-md bg-yellow-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No purchases found</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You don't have any purchases yet. Visit our products page to get started.</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Browse Products
            </Link>
          </div>
        )}

        {hasAccess && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Map through purchases and display download cards */}
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{purchase.product_name || 'Product'}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Purchased on {new Date(purchase.created_at).toLocaleDateString()}</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <Link 
                    href={`/api/verify-download?productId=${purchase.product_id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Download
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="mt-10">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">Admin access granted. You can access all downloads.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}