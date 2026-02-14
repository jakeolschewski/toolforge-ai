'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Loader2, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export interface DownloadButtonProps {
  workflowId: string;
  workflowSlug: string;
  workflowTitle: string;
  hasAccess: boolean;
  isPremium: boolean;
  fileUrl?: string;
  price?: number;
  requiresAuth?: boolean;
  className?: string;
}

export default function DownloadButton({
  workflowId,
  workflowSlug,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  workflowTitle,
  hasAccess,
  isPremium,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fileUrl,
  price,
  requiresAuth = false,
  className = ''
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isPaidWorkflow = !hasAccess && !isPremium && price && price > 0;

  const handleDownload = async () => {
    if (!hasAccess) {
      if (isPremium) {
        toast.error('This workflow requires a membership');
        window.location.href = '/membership/pricing';
      } else {
        toast.error('Purchase required to download this workflow');
        window.location.href = `/vault/${workflowSlug}`;
      }
      return;
    }

    if (requiresAuth) {
      toast.error('Please sign in to download');
      window.location.href = '/auth/signin?redirect=/vault/' + workflowSlug;
      return;
    }

    setIsDownloading(true);

    try {
      // Request secure download token
      const response = await fetch('/api/vault/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: workflowId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Download failed');
      }

      const data = await response.json();

      if (data.download_url) {
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = data.download_url;
        link.download = `${workflowSlug}.${data.file_extension || 'json'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Download started successfully!');
      } else {
        throw new Error('No download URL received');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download workflow');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className={className}>
        {isPaidWorkflow && (
          <label className="flex items-start gap-2 mb-3 cursor-pointer text-sm text-gray-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                Terms of Service
              </Link>
              ,{' '}
              <Link href="/refund-policy" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                Refund Policy
              </Link>
              , and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>
        )}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleDownload}
          disabled={isPaidWorkflow ? !termsAccepted : false}
        >
          <Lock className="w-4 h-4 mr-2" />
          {isPremium ? 'Membership Required' : 'Purchase to Download'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size="lg"
      className={className}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download Workflow
        </>
      )}
    </Button>
  );
}
