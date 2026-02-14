'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, X, File } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface FileUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
}

export default function FileUploader({
  currentUrl,
  onUpload,
  accept = '*',
  label = 'Upload File',
  maxSizeMB = 50,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = sessionStorage.getItem('admin_token');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/admin/vault/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (data.success && data.url) {
        toast.success('File uploaded successfully');
        onUpload(data.url);
      } else {
        toast.error(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-3">
      {currentUrl ? (
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex-shrink-0">
            {accept.includes('image') ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentUrl}
                alt="Uploaded file"
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <File className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {getFileNameFromUrl(currentUrl)}
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              View file
            </a>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
              <div className="text-sm text-gray-600">Uploading...</div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{uploadProgress}%</div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-sm text-gray-600">
                Click to upload or drag and drop
              </div>
              <div className="text-xs text-gray-500">
                {accept === 'image/*' ? 'PNG, JPG, GIF up to' : 'Files up to'} {maxSizeMB}MB
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {label}
              </Button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
