'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

export default function UsersAdmin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  
  // Set isAdmin to true for all users to make admin dashboard accessible to everyone
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/admin/users');
        return;
      }
      
      setUser(session.user);
      fetchUsers();
    };
    
    checkAuth();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const supabase = await createClient();
      
      // Fetch profiles with user role information
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleToggleAdmin = async (userId, currentRole) => {
    try {
      const supabase = await createClient();
      
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ user_role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, user_role: newRole } 
          : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Spinner size="lg" color="primary" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-300 mt-2">Manage user accounts and permissions</p>
          </div>
          <Button
            variant="outline"
            size="md"
            href="/admin"
          >
            Back to Dashboard
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="glass-panel rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">No Users Found</h2>
            <p className="text-gray-400 mb-6">There are no user accounts in the system yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full glass-panel rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-sm text-gray-300">{user.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.email || 'No email'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.user_role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.user_role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant={user.user_role === 'admin' ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => handleToggleAdmin(user.id, user.user_role)}
                        >
                          {user.user_role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          href={`/admin/users/${user.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}