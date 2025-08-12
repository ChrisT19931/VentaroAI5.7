import { Suspense } from 'react';
import { getServerSideData } from './page.server';
import AccountClient from '@/app/account/AccountClient';
import Spinner from '@/components/ui/Spinner';

export default async function AccountPage() {
  const { orders, isAdmin, user } = await getServerSideData();
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>}>
      <AccountClient 
        initialOrders={orders} 
        initialIsAdmin={isAdmin} 
        user={user} 
      />
    </Suspense>
  );
}