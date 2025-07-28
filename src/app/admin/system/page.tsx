'use client';

import React, { useState, useEffect } from 'react';
import SystemDashboard from '@/components/SystemDashboard';
import { useSystemOptimization } from '@/lib/client-optimizer';

const SystemAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'config'>('dashboard');
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const optimization = useSystemOptimization();

  const handleExportLogs = async () => {
    try {
      setIsLoadingLogs(true);
      
      // Get filter values
      const logLevelSelect = document.querySelector('select[name="logLevel"]') as HTMLSelectElement;
      const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement;
      const timeRangeSelect = document.querySelector('select[name="timeRange"]') as HTMLSelectElement;
      
      const logLevel = logLevelSelect?.value || 'all';
      const service = serviceSelect?.value || 'all';
      const timeRange = timeRangeSelect?.value || '24h';
      
      // Calculate date based on time range
      let date = new Date().toISOString().split('T')[0]; // Default to today
      
      if (timeRange === '1h') {
        // Keep today's date, but we'll filter by time in the API
      } else if (timeRange === '24h') {
        // Keep today's date
      } else if (timeRange === '7d') {
        // Set date to 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        date = sevenDaysAgo.toISOString().split('T')[0];
      } else if (timeRange === '30d') {
        // Set date to 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        date = thirtyDaysAgo.toISOString().split('T')[0];
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      if (logLevel !== 'all') params.append('level', logLevel.toLowerCase());
      if (service !== 'all') params.append('service', service.toLowerCase());
      params.append('date', date);
      params.append('timeRange', timeRange);
      
      // Call the API
      const response = await fetch(`/api/admin/logs/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to export logs: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to export logs');
      }
      
      // Format logs for download
      const formattedLogs = data.logs.map((log: any) => {
        const content = log.content;
        return `[${content.timestamp}] [${content.level.toUpperCase()}] ${content.message}`;
      }).join('\n');
      
      // Create download file
      const blob = new Blob([formattedLogs], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs-${date}-${logLevel}-${service}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Update logs display
      setLogs(formattedLogs.split('\n'));
    } catch (error) {
      console.error('Error exporting logs:', error);
      alert(`Error exporting logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      setIsLoadingLogs(true);
      
      // Get filter values
      const logLevelSelect = document.querySelector('select[name="logLevel"]') as HTMLSelectElement;
      const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement;
      const timeRangeSelect = document.querySelector('select[name="timeRange"]') as HTMLSelectElement;
      
      const logLevel = logLevelSelect?.value || 'all';
      const service = serviceSelect?.value || 'all';
      const timeRange = timeRangeSelect?.value || '24h';
      
      // Calculate date based on time range
      let date = new Date().toISOString().split('T')[0]; // Default to today
      
      // Confirm with user
      if (!confirm(`Are you sure you want to clear all ${logLevel} logs for ${service}?`)) {
        setIsLoadingLogs(false);
        return;
      }
      
      // Call the API
      const response = await fetch('/api/admin/logs/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          level: logLevel !== 'all' ? logLevel.toLowerCase() : undefined,
          service: service !== 'all' ? service.toLowerCase() : undefined,
          timeRange,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear logs: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to clear logs');
      }
      
      // Clear logs display
      setLogs([`${data.message} at ${new Date().toLocaleTimeString()}`]);
      
      // Refresh logs after a short delay
      setTimeout(() => fetchLogs(), 2000);
    } catch (error) {
      console.error('Error clearing logs:', error);
      setLogs([`Error clearing logs: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLoadingLogs(true);
      
      // Get filter values
      const logLevelSelect = document.querySelector('select[name="logLevel"]') as HTMLSelectElement;
      const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement;
      const timeRangeSelect = document.querySelector('select[name="timeRange"]') as HTMLSelectElement;
      
      const logLevel = logLevelSelect?.value || 'all';
      const service = serviceSelect?.value || 'all';
      const timeRange = timeRangeSelect?.value || '24h';
      
      // Calculate date based on time range
      let date = new Date().toISOString().split('T')[0]; // Default to today
      
      if (timeRange === '1h') {
        // Keep today's date, but we'll filter by time in the API
      } else if (timeRange === '24h') {
        // Keep today's date
      } else if (timeRange === '7d') {
        // Set date to 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        date = sevenDaysAgo.toISOString().split('T')[0];
      } else if (timeRange === '30d') {
        // Set date to 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        date = thirtyDaysAgo.toISOString().split('T')[0];
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      if (logLevel !== 'all') params.append('level', logLevel.toLowerCase());
      if (service !== 'all') params.append('service', service.toLowerCase());
      params.append('date', date);
      
      // Call the API
      const response = await fetch(`/api/admin/logs/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch logs');
      }
      
      // Format logs for display
      const formattedLogs = data.logs.map((log: any) => {
        const content = log.content;
        return `[${content.timestamp}] [${content.level.toUpperCase()}] ${content.message}`;
      });
      
      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([`Error fetching logs: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  // Fetch logs when filters change
  useEffect(() => {
    const logLevelSelect = document.querySelector('select[name="logLevel"]') as HTMLSelectElement;
    const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement;
    const timeRangeSelect = document.querySelector('select[name="timeRange"]') as HTMLSelectElement;
    
    if (logLevelSelect && serviceSelect && timeRangeSelect) {
      const handleFilterChange = () => fetchLogs();
      
      logLevelSelect.addEventListener('change', handleFilterChange);
      serviceSelect.addEventListener('change', handleFilterChange);
      timeRangeSelect.addEventListener('change', handleFilterChange);
      
      // Initial fetch
      fetchLogs();
      
      return () => {
        logLevelSelect.removeEventListener('change', handleFilterChange);
        serviceSelect.removeEventListener('change', handleFilterChange);
        timeRangeSelect.removeEventListener('change', handleFilterChange);
      };
    }
  }, [activeTab]);

  const handleConfigUpdate = (key: string, value: any) => {
    optimization.updateConfig({ [key]: value });
  };

  const tabs = [
    { id: 'dashboard', label: 'System Dashboard', icon: '📊' },
    { id: 'logs', label: 'System Logs', icon: '📝' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
              <p className="text-gray-600">Monitor and manage system performance, health, and configuration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                optimization.systemHealth?.overall 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-red-600 bg-red-100'
              }`}>
                {optimization.systemHealth?.overall ? 'System Healthy' : 'System Issues'}
              </div>
              <div className="text-sm text-gray-600">
                Performance: <span className={`font-medium ${
                  (optimization.performanceScore || 0) >= 80 ? 'text-green-600' :
                  (optimization.performanceScore || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {optimization.performanceScore || 0}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <SystemDashboard />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">System Logs</h3>
                <div className="space-x-2">
                  <button
                    onClick={handleExportLogs}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={logs.length === 0 || isLoadingLogs}
                  >
                    {isLoadingLogs ? 'Loading...' : 'Export Logs'}
                  </button>
                  <button
                    onClick={handleClearLogs}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={logs.length === 0 || isLoadingLogs}
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {isLoadingLogs ? (
                  <div className="text-gray-300 flex items-center justify-center py-4">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading logs...
                  </div>
                ) : logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No logs available. System logs will appear here.</div>
                )}
              </div>
            </div>

            {/* Log Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-md font-semibold mb-4">Log Filters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log Level
                  </label>
                  <select name="logLevel" className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="all">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service
                  </label>
                  <select name="service" className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="all">All Services</option>
                    <option value="supabase">Supabase</option>
                    <option value="stripe">Stripe</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select name="timeRange" className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
              
              {optimization.config && (
                <div className="space-y-6">
                  {/* Caching Configuration */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Caching</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Enable Caching
                        </label>
                        <input
                          type="checkbox"
                          checked={optimization.config.enableCaching}
                          onChange={(e) => handleConfigUpdate('enableCaching', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cache Timeout (ms)
                        </label>
                        <input
                          type="number"
                          value={optimization.config.cacheTimeout}
                          onChange={(e) => handleConfigUpdate('cacheTimeout', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Performance Configuration */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Enable Compression
                        </label>
                        <input
                          type="checkbox"
                          checked={optimization.config.enableCompression}
                          onChange={(e) => handleConfigUpdate('enableCompression', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Enable Lazy Loading
                        </label>
                        <input
                          type="checkbox"
                          checked={optimization.config.enableLazyLoading}
                          onChange={(e) => handleConfigUpdate('enableLazyLoading', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Enable Preloading
                        </label>
                        <input
                          type="checkbox"
                          checked={optimization.config.enablePreloading}
                          onChange={(e) => handleConfigUpdate('enablePreloading', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Retry Attempts
                        </label>
                        <input
                          type="number"
                          value={optimization.config.retryAttempts}
                          onChange={(e) => handleConfigUpdate('retryAttempts', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Configuration */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Monitoring</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Health Check Interval (ms)
                        </label>
                        <input
                          type="number"
                          value={optimization.config.healthCheckInterval}
                          onChange={(e) => handleConfigUpdate('healthCheckInterval', parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          min="10000"
                          step="10000"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Enable Service Worker
                        </label>
                        <input
                          type="checkbox"
                          checked={optimization.config.enableServiceWorker}
                          onChange={(e) => handleConfigUpdate('enableServiceWorker', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Apply Configuration
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Environment Variables */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Environment Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Node Environment:</span>
                    <span className="font-medium">{process.env.NODE_ENV || 'development'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Supabase URL:</span>
                    <span className={`font-medium ${
                      process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Supabase Key:</span>
                    <span className={`font-medium ${
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stripe Key:</span>
                    <span className={`font-medium ${
                      process.env.STRIPE_SECRET_KEY ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SendGrid Key:</span>
                    <span className={`font-medium ${
                      process.env.SENDGRID_API_KEY ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {process.env.SENDGRID_API_KEY ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAdminPage;