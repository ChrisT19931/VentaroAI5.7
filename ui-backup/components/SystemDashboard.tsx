'use client';

import React, { useState, useEffect } from 'react';
import { useSystemOptimization } from '@/lib/client-optimizer';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  services: {
    supabase: { status: string; details: string };
    stripe: { status: string; details: string };
    sendgrid: { status: string; details: string };
  };
  optimization: {
    isOptimized: boolean;
    systemHealth: any;
    cacheStats: any;
    performanceScore: number;
    config: any;
  };
  performance: {
    score: number;
    metrics: any;
    recommendations: string[];
  };
}

const SystemDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const optimization = useSystemOptimization();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error('Failed to fetch health data');
        }
        const data = await response.json();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600">
          <h3 className="text-lg font-semibold mb-2">System Dashboard Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">System Status</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            healthData ? getStatusColor(healthData.status) : 'text-gray-600 bg-gray-100'
          }`}>
            {healthData?.status?.toUpperCase() || 'UNKNOWN'}
          </div>
        </div>
        
        {healthData && (
          <div className="text-sm text-gray-600">
            Last updated: {new Date(healthData.timestamp).toLocaleString()}
          </div>
        )}
      </div>

      {/* Services Health */}
      {healthData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Services Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(healthData.services).map(([service, data]) => (
              <div key={service} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{service}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    getStatusColor(data.status)
                  }`}>
                    {data.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{data.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {healthData?.performance && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Performance Score</span>
                <span className={`text-lg font-bold ${
                  getPerformanceColor(healthData.performance.score)
                }`}>
                  {healthData.performance.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    healthData.performance.score >= 80 ? 'bg-green-600' :
                    healthData.performance.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${healthData.performance.score}%` }}
                ></div>
              </div>
            </div>
            
            {healthData.performance.recommendations && healthData.performance.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {healthData.performance.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Optimization Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">System Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              optimization.isOptimized ? 'text-green-600' : 'text-red-600'
            }`}>
              {optimization.isOptimized ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Optimized</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {optimization.cacheStats?.size || 0}
            </div>
            <div className="text-sm text-gray-600">Cache Entries</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              getPerformanceColor(optimization.performanceScore || 0)
            }`}>
              {optimization.performanceScore || 0}
            </div>
            <div className="text-sm text-gray-600">Performance</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              optimization.systemHealth?.overall ? 'text-green-600' : 'text-red-600'
            }`}>
              {optimization.systemHealth?.overall ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">System Health</div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-4">
          <button
            onClick={optimization.clearCache}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Clear Cache
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Configuration */}
      {optimization.config && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Optimization Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            {Object.entries(optimization.config).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className={`font-medium ${
                  typeof value === 'boolean' 
                    ? (value ? 'text-green-600' : 'text-red-600')
                    : 'text-gray-900'
                }`}>
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDashboard;