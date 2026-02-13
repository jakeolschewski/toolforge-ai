import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { Download, Calendar, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Download History - My Vault',
  description: 'View your complete workflow download history.',
};

interface DownloadHistoryItem {
  id: string;
  workflow_id: string;
  workflow_title: string;
  workflow_slug: string;
  download_date: string;
  file_type: string;
}

async function getDownloadHistory(userId: string): Promise<DownloadHistoryItem[]> {
  const { data } = await supabase
    .from('vault_download_logs')
    .select(`
      id,
      workflow_id,
      download_date:created_at,
      vault_workflows (
        title,
        slug,
        file_type
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    workflow_id: item.workflow_id,
    workflow_title: item.vault_workflows?.title || 'Unknown Workflow',
    workflow_slug: item.vault_workflows?.slug || '',
    download_date: item.download_date,
    file_type: item.vault_workflows?.file_type || 'unknown',
  }));
}

export default async function DownloadHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/vault/my-vault/downloads');
  }

  const userId = session.user.id;
  const downloads = await getDownloadHistory(userId);

  // Group downloads by date
  const groupedDownloads: Record<string, DownloadHistoryItem[]> = {};
  downloads.forEach((download) => {
    const date = new Date(download.download_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groupedDownloads[date]) {
      groupedDownloads[date] = [];
    }
    groupedDownloads[date].push(download);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vault/my-vault"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to My Vault
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Download History</h1>
          <p className="text-lg text-gray-600">
            Complete record of all your workflow downloads
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Download className="w-8 h-8 text-primary-600" />
              <span className="text-3xl font-bold text-gray-900">
                {downloads.length}
              </span>
            </div>
            <p className="text-gray-600">Total Downloads</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {new Set(downloads.map(d => d.workflow_id)).size}
              </span>
            </div>
            <p className="text-gray-600">Unique Workflows</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">
                {downloads.length > 0
                  ? new Date(downloads[0].download_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '-'}
              </span>
            </div>
            <p className="text-gray-600">Last Download</p>
          </div>
        </div>

        {/* Download History */}
        {Object.keys(groupedDownloads).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedDownloads).map(([date, items]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  {date}
                </h2>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {items.map((download) => (
                    <div
                      key={download.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <Link
                              href={`/vault/${download.workflow_slug}`}
                              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {download.workflow_title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Downloaded at{' '}
                              {new Date(download.download_date).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs uppercase">
                              {download.file_type}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/vault/${download.workflow_slug}`}
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors font-medium"
                        >
                          View Details
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No downloads yet
            </h3>
            <p className="text-gray-600 mb-6">
              Your download history will appear here once you start downloading workflows.
            </p>
            <Link
              href="/vault/my-vault"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Go to My Vault
            </Link>
          </div>
        )}

        {/* Export Option */}
        {downloads.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Export Your Data</h3>
                <p className="text-sm text-gray-600">
                  Download your complete download history as a CSV file
                </p>
              </div>
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors border border-primary-200">
                Export CSV
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
