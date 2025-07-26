'use client';

import React, { useState } from 'react';
import SystemDashboard from '@/components/SystemDashboard';
import { useSystemOptimization } from '@/lib/client-optimizer';

const SystemAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'config'>('dashboard');
  const [logs, setLogs] = useState<string[]>([]);
  const optimization = useSystemOptimization();

  const handleExportLogs = () => {
    const logData = logs.join('\n');
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    disabled={logs.length === 0}
                  >
                    Export Logs
                  </button>
                  <button
                    onClick={handleClearLogs}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    disabled={logs.length === 0}
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
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
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
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
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
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
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
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