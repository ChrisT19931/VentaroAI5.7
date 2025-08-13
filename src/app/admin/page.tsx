'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Database,
  Shield,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Server
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  pendingBookings: number;
  recentUsers: number;
  conversionRate: number;
  systemHealth: 'healthy' | 'degraded' | 'unhealthy';
  emailsSent: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'purchase' | 'booking' | 'email_sent' | 'system_event';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

interface SystemMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  description: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    recentUsers: 0,
    conversionRate: 0,
    systemHealth: 'healthy',
    emailsSent: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check admin access
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/signin?callbackUrl=/admin');
      return;
    }
    
    if (!session.user?.roles?.includes('admin')) {
      router.push('/');
      return;
    }
    
    loadDashboardData();
  }, [session, status, router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load dashboard statistics
      const [
        healthResponse,
        usersResponse,
        purchasesResponse,
        bookingsResponse
      ] = await Promise.all([
        fetch('/api/health/auth'),
        fetch('/api/admin/users'),
        fetch('/api/admin/purchases'),
        fetch('/api/admin/coaching-bookings')
      ]);

      const healthData = await healthResponse.json();
      const usersData = await usersResponse.json();
      const purchasesData = await purchasesResponse.json();
      const bookingsData = await bookingsResponse.json();

      // Calculate stats
      const totalRevenue = purchasesData.purchases?.reduce((sum: number, p: any) => 
        sum + (p.status === 'completed' ? p.amount : 0), 0) || 0;
      
      const recentUsers = usersData.users?.filter((u: any) => {
        const userDate = new Date(u.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return userDate > weekAgo;
      }).length || 0;

      const conversionRate = usersData.users?.length > 0 
        ? ((purchasesData.purchases?.filter((p: any) => p.status === 'completed').length || 0) / usersData.users.length) * 100
        : 0;

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalPurchases: purchasesData.purchases?.filter((p: any) => p.status === 'completed').length || 0,
        totalRevenue,
        pendingBookings: bookingsData.bookings?.filter((b: any) => b.status === 'pending').length || 0,
        recentUsers,
        conversionRate,
        systemHealth: healthData.status || 'unknown',
        emailsSent: healthData.metrics?.emailsSent || 0
      });

      // Generate recent activity
      const activities: RecentActivity[] = [];
      
      // Add recent users
      usersData.users?.slice(0, 3).forEach((user: any) => {
        activities.push({
          id: `user_${user.id}`,
          type: 'user_registration',
          description: `New user registered: ${user.email}`,
          timestamp: user.created_at,
          status: 'success'
        });
      });

      // Add recent purchases
      purchasesData.purchases?.slice(0, 3).forEach((purchase: any) => {
        activities.push({
          id: `purchase_${purchase.id}`,
          type: 'purchase',
          description: `Purchase completed: Product ${purchase.product_id} - $${(purchase.amount / 100).toFixed(2)}`,
          timestamp: purchase.created_at,
          status: purchase.status === 'completed' ? 'success' : 'warning'
        });
      });

      // Add recent bookings
      bookingsData.bookings?.slice(0, 2).forEach((booking: any) => {
        activities.push({
          id: `booking_${booking.id}`,
          type: 'booking',
          description: `Coaching booking: ${booking.name} - ${booking.business_stage}`,
          timestamp: booking.created_at,
          status: booking.status === 'confirmed' ? 'success' : 'warning'
        });
      });

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 10));

      // System metrics
      setSystemMetrics([
        {
          name: 'Database Status',
          value: healthData.database || 'Unknown',
          status: healthData.database === 'supabase' ? 'good' : 'warning',
          description: 'Primary database connection'
        },
        {
          name: 'Authentication',
          value: healthData.auth?.status || 'Unknown',
          status: healthData.auth?.working ? 'good' : 'error',
          description: 'User authentication system'
        },
        {
          name: 'Email Service',
          value: healthData.email?.configured ? 'Configured' : 'Not Configured',
          status: healthData.email?.configured ? 'good' : 'warning',
          description: 'Email delivery system'
        },
        {
          name: 'File Downloads',
          value: 'Active',
          status: 'good',
          description: 'Secure file download system'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration': return <Users className="w-4 h-4" />;
      case 'purchase': return <ShoppingCart className="w-4 h-4" />;
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'email_sent': return <Mail className="w-4 h-4" />;
      case 'system_event': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case 'good': case 'healthy': return 'text-green-400';
      case 'warning': case 'degraded': return 'text-yellow-400';
      case 'error': case 'unhealthy': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Welcome back, {session?.user?.name}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              stats.systemHealth === 'healthy' ? 'bg-green-900/30 border border-green-500/30' :
              stats.systemHealth === 'degraded' ? 'bg-yellow-900/30 border border-yellow-500/30' :
              'bg-red-900/30 border border-red-500/30'
            }`}>
              <Server className={`w-4 h-4 mr-2 ${getStatusColor(stats.systemHealth)}`} />
              <span className={`text-sm font-medium ${getStatusColor(stats.systemHealth)}`}>
                System {stats.systemHealth}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-green-400 text-sm font-medium">+{stats.recentUsers} this week</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stats.conversionRate.toFixed(1)}% conversion</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
          </div>

          {/* Total Purchases */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-purple-400 text-sm font-medium">{stats.totalPurchases} completed</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{stats.totalPurchases}</p>
              <p className="text-gray-400 text-sm">Total Purchases</p>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              {stats.pendingBookings > 0 && (
                <span className="text-orange-400 text-sm font-medium">Needs attention</span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{stats.pendingBookings}</p>
              <p className="text-gray-400 text-sm">Pending Bookings</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </h2>
                <Link 
                  href="/admin/system"
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className={`p-1 rounded-full ${
                        activity.status === 'success' ? 'bg-green-600/20 text-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* System Metrics & Quick Actions */}
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Status
              </h2>
              
              <div className="space-y-3">
                {systemMetrics.map(metric => (
                  <div key={metric.name} className="flex items-center justify-between p-2 bg-gray-700/20 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{metric.name}</p>
                      <p className="text-gray-400 text-xs">{metric.description}</p>
                    </div>
                    <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  href="/admin/users"
                  className="flex items-center p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors group"
                >
                  <Users className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-white group-hover:text-blue-300">Manage Users</span>
                </Link>
                
                <Link 
                  href="/admin/orders"
                  className="flex items-center p-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors group"
                >
                  <ShoppingCart className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white group-hover:text-green-300">View Orders</span>
                </Link>
                
                <Link 
                  href="/admin/coaching-bookings"
                  className="flex items-center p-3 bg-orange-600/20 hover:bg-orange-600/30 rounded-lg transition-colors group"
                >
                  <Calendar className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-white group-hover:text-orange-300">Manage Bookings</span>
                </Link>
                
                <Link 
                  href="/email-manager"
                  className="flex items-center p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors group"
                >
                  <Mail className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-white group-hover:text-purple-300">Email Manager</span>
                </Link>
                
                <Link 
                  href="/admin/system"
                  className="flex items-center p-3 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg transition-colors group"
                >
                  <Settings className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-white group-hover:text-gray-300">System Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}