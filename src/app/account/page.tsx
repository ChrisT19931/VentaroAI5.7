import { Suspense } from 'react';
import { getServerSideData } from './page.server';
import AccountClient from '@/app/account/AccountClient';
import Spinner from '@/components/ui/Spinner';

export default async function AccountPage() {
  try {
    const { orders, isAdmin, user } = await getServerSideData();
    
    if (!user) {
      // If no user data is available, show a message and redirect
      return (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Session Error</h1>
          <p className="mb-4">There was a problem with your session. Please try logging in again.</p>
          <a href="/signin" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Go to Login
          </a>
        </div>
      );
    }
    
    return (
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>}>
        <AccountClient 
          initialOrders={orders} 
          initialIsAdmin={isAdmin} 
          user={user} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in AccountPage:', error);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">We apologize for the inconvenience. Please try logging in again.</p>
        <a href="/signin" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              Sign In
            </a>
      </div>
    );
  }
}