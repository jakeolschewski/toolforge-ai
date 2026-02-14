'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw, Database, Globe, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface HealthStatus {
  database: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
    responseTime?: number;
    recordCount?: {
      tools: number;
      reviews: number;
      users: number;
    };
  };
  api: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
    responseTime?: number;
  };
  storage: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
    usage?: {
      tools: number;
      reviews: number;
      clicks: number;
      total: number;
    };
  };
  lastScraper?: {
    status: 'success' | 'failed' | 'pending';
    lastRun?: string;
    toolsAdded?: number;
    errors?: string[];
  };
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHealthStatus = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/health', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setHealth(data.data);
      } else {
        toast.error('Failed to load health status');
      }
    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Failed to load health status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-2">Monitor system status and performance</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
            <p className="text-gray-600">Checking system health...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-2">Monitor system status and performance</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Failed to load health status</p>
            <Button onClick={loadHealthStatus} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-2">Monitor system status and performance</p>
        </div>

        <Button onClick={loadHealthStatus} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-primary-600" />
              <div>
                <div className="text-sm text-gray-600">Database</div>
                <div className="text-lg font-bold text-gray-900">
                  {health.database.status === 'healthy' ? 'Healthy' :
                   health.database.status === 'warning' ? 'Warning' : 'Error'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-primary-600" />
              <div>
                <div className="text-sm text-gray-600">API</div>
                <div className="text-lg font-bold text-gray-900">
                  {health.api.status === 'healthy' ? 'Healthy' :
                   health.api.status === 'warning' ? 'Warning' : 'Error'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-primary-600" />
              <div>
                <div className="text-sm text-gray-600">Storage</div>
                <div className="text-lg font-bold text-gray-900">
                  {health.storage.status === 'healthy' ? 'Healthy' :
                   health.storage.status === 'warning' ? 'Warning' : 'Error'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary-600" />
              <div>
                <div className="text-sm text-gray-600">Last Scraper</div>
                <div className="text-lg font-bold text-gray-900">
                  {health.lastScraper?.status === 'success' ? 'Success' :
                   health.lastScraper?.status === 'failed' ? 'Failed' : 'Pending'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Health */}
      <Card className={`border-2 ${getStatusColor(health.database.status)}`}>
        <CardContent className="py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(health.database.status)}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Database</h3>
                <p className="text-sm text-gray-600">{health.database.message}</p>
              </div>
            </div>
            {health.database.responseTime && (
              <span className="text-sm text-gray-600">
                {health.database.responseTime}ms
              </span>
            )}
          </div>

          {health.database.recordCount && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Tools</div>
                <div className="text-xl font-bold">{health.database.recordCount.tools}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Reviews</div>
                <div className="text-xl font-bold">{health.database.recordCount.reviews}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Users</div>
                <div className="text-xl font-bold">{health.database.recordCount.users}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Health */}
      <Card className={`border-2 ${getStatusColor(health.api.status)}`}>
        <CardContent className="py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(health.api.status)}
              <div>
                <h3 className="text-lg font-bold text-gray-900">API</h3>
                <p className="text-sm text-gray-600">{health.api.message}</p>
              </div>
            </div>
            {health.api.responseTime && (
              <span className="text-sm text-gray-600">
                {health.api.responseTime}ms
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Storage Health */}
      <Card className={`border-2 ${getStatusColor(health.storage.status)}`}>
        <CardContent className="py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(health.storage.status)}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Storage</h3>
                <p className="text-sm text-gray-600">{health.storage.message}</p>
              </div>
            </div>
          </div>

          {health.storage.usage && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Tools</div>
                <div className="text-xl font-bold">{health.storage.usage.tools}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Reviews</div>
                <div className="text-xl font-bold">{health.storage.usage.reviews}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Clicks</div>
                <div className="text-xl font-bold">{health.storage.usage.clicks}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-xl font-bold">{health.storage.usage.total}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scraper Status */}
      {health.lastScraper && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Last Scraper Run</h3>
                <p className="text-sm text-gray-600">
                  {health.lastScraper.lastRun
                    ? new Date(health.lastScraper.lastRun).toLocaleString()
                    : 'Never run'}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${
                  health.lastScraper.status === 'success'
                    ? 'bg-green-100 text-green-700'
                    : health.lastScraper.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {health.lastScraper.status}
              </span>
            </div>

            {health.lastScraper.toolsAdded !== undefined && (
              <p className="text-sm text-gray-600 mb-2">
                Tools added: {health.lastScraper.toolsAdded}
              </p>
            )}

            {health.lastScraper.errors && health.lastScraper.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm font-medium text-red-700 mb-2">Errors:</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {health.lastScraper.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
