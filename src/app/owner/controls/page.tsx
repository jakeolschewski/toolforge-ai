'use client';

import { useState } from 'react';
import { Play, CheckCircle, XCircle, RefreshCw, Zap, Globe, Mail, Search, Database, Bot } from 'lucide-react';

interface CronResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
}

export default function SiteControlsPage() {
  const [cronResults, setCronResults] = useState<Record<string, CronResult>>({});
  const [siteStats, setSiteStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const getToken = () => sessionStorage.getItem('owner_token') || '';

  const cronJobs = [
    { id: 'discover', name: 'Discover & Auto-Approve', path: '/api/cron/discover', schedule: 'Daily 2am', icon: Search },
    { id: 'enrich', name: 'AI Enrich Tools', path: '/api/cron/enrich-tools', schedule: 'Daily 6am', icon: Bot },
    { id: 'publish', name: 'Publish Drafts', path: '/api/cron/publish-drafts', schedule: 'Daily 10am', icon: Globe },
    { id: 'newsletter', name: 'Send Newsletter', path: '/api/email/send-newsletter', schedule: 'Friday 12pm', icon: Mail },
    { id: 'content', name: 'Generate Content', path: '/api/cron/generate-content', schedule: 'Daily 2pm', icon: Zap },
    { id: 'curate', name: 'Auto-Curate', path: '/api/cron/auto-curate', schedule: 'Monday 4pm', icon: Database },
    { id: 'affiliates', name: 'Check Affiliates', path: '/api/cron/check-affiliates', schedule: 'Sunday 3am', icon: Globe },
  ];

  const triggerCron = async (id: string, path: string) => {
    const token = getToken();
    setCronResults(prev => ({ ...prev, [id]: { name: id, status: 'running' } }));

    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setCronResults(prev => ({
        ...prev,
        [id]: {
          name: id,
          status: data.success ? 'success' : 'error',
          message: data.message || data.data?.message || data.error || 'Completed',
        },
      }));
    } catch (err) {
      setCronResults(prev => ({
        ...prev,
        [id]: { name: id, status: 'error', message: 'Request failed' },
      }));
    }
  };

  const fetchSiteStats = async () => {
    setLoadingStats(true);
    const token = getToken();
    try {
      const res = await fetch('/api/admin/health', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSiteStats(data.data || data);
    } catch {
      setSiteStats({ error: 'Failed to fetch stats' });
    }
    setLoadingStats(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Controls</h1>
        <p className="text-gray-600">Manually trigger cron jobs, check site health, and manage automation</p>
      </div>

      {/* Cron Job Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" /> Cron Jobs — Manual Trigger
        </h3>
        <p className="text-sm text-gray-500 mb-6">Click any job to trigger it immediately. Uses your CRON_SECRET for authentication.</p>

        <div className="space-y-3">
          {cronJobs.map((job) => {
            const result = cronResults[job.id];
            const Icon = job.icon;
            return (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{job.name}</div>
                    <div className="text-xs text-gray-500">{job.schedule} &bull; {job.path}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {result && (
                    <div className="flex items-center gap-2">
                      {result.status === 'running' && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
                      {result.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {result.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                      <span className={`text-xs max-w-[200px] truncate ${result.status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                        {result.message}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => triggerCron(job.id, job.path)}
                    disabled={result?.status === 'running'}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" /> Run
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Site Health */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-500" /> Site Health Check
          </h3>
          <button onClick={fetchSiteStats} disabled={loadingStats} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            {loadingStats ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Check Health
          </button>
        </div>

        {siteStats ? (
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs max-h-96">
            {JSON.stringify(siteStats, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500 text-center py-8">Click "Check Health" to view site status</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Admin Dashboard', href: '/admin' },
            { name: 'Manage Tools', href: '/admin/tools' },
            { name: 'Manage Blog', href: '/admin/blog' },
            { name: 'Manage Reviews', href: '/admin/reviews' },
            { name: 'Collections', href: '/admin/collections' },
            { name: 'Comparisons', href: '/admin/comparisons' },
            { name: 'Vault Admin', href: '/admin/vault' },
            { name: 'Vault Workflows', href: '/admin/vault/workflows' },
            { name: 'Vault Purchases', href: '/admin/vault/purchases' },
            { name: 'Affiliates', href: '/admin/affiliates' },
            { name: 'Health Check', href: '/admin/health' },
            { name: 'Import Tools', href: '/admin/import' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 text-center transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
