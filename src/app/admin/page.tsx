'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Set isAdmin to true for all users to make admin dashboard accessible to everyone
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/signin?callbackUrl=/admin');
        return;
      }
      
      setUser(session.user);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spinner size="lg" color="primary" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 mt-2">Manage your store, products, and users</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Access
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Product Management */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Product Management</h2>
                <p className="text-gray-400 text-sm">Add, edit, and manage products</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                variant="primary"
                size="md"
                href="/admin/products/new"
              >
                Add New Product
              </Button>
              <Button
                variant="outline"
                size="md"
                href="/admin/products"
              >
                Manage Products
              </Button>
            </div>
          </div>

          {/* Order Management */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Order Management</h2>
                <p className="text-gray-400 text-sm">View and manage customer orders</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                size="md"
                href="/admin/orders"
              >
                View All Orders
              </Button>
            </div>
          </div>

          {/* User Management */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">User Management</h2>
                <p className="text-gray-400 text-sm">Manage user accounts and permissions</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                size="md"
                href="/admin/users"
              >
                Manage Users
              </Button>
            </div>
          </div>

          {/* System Management */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">System Management</h2>
                <p className="text-gray-400 text-sm">Monitor system health and performance</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                size="md"
                href="/admin/system"
              >
                System Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Coaching Bookings */}
        <div className="glass-panel rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-500 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Coaching Bookings</h2>
              <p className="text-gray-400 text-sm">Manage coaching sessions and appointments</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              size="md"
              href="/admin/coaching-bookings"
            >
              Manage Bookings
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              size="sm"
              href="/"
              className="w-full"
            >
              View Store
            </Button>
            <Button
              variant="outline"
              size="sm"
              href="/my-account"
              className="w-full"
            >
              My Account
            </Button>
            <Button
              variant="outline"
              size="sm"
              href="/vip-portal"
              className="w-full"
            >
              VIP Portal
            </Button>
            <Button
              variant="outline"
              size="sm"
              href="/downloads"
              className="w-full"
            >
              Downloads
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}