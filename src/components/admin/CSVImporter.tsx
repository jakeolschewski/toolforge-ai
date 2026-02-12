'use client';

import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { parseCSVWithSchema, toolCSVColumns, generateToolCSVTemplate } from '@/utils/csv';
import type { Tool } from '@/types';

interface CSVImporterProps {
  onImportComplete: () => void;
}

interface ImportPreview {
  data: Partial<Tool>[];
  errors: Array<{ row: number; column: string; error: string }>;
  validCount: number;
  invalidCount: number;
}

export default function CSVImporter({ onImportComplete }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setPreview(null);
    setLoading(true);

    try {
      const text = await selectedFile.text();
      const result = parseCSVWithSchema<Partial<Tool>>(text, toolCSVColumns);

      setPreview({
        data: result.data,
        errors: result.errors,
        validCount: result.data.length - result.errors.length,
        invalidCount: result.errors.length,
      });
    } catch (error) {
      console.error('CSV parse error:', error);
      toast.error('Failed to parse CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateToolCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tool_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const handleImport = async () => {
    if (!preview || preview.data.length === 0) {
      toast.error('No valid data to import');
      return;
    }

    if (preview.errors.length > 0) {
      const proceed = confirm(
        `There are ${preview.errors.length} validation errors. Do you want to import only valid rows?`
      );
      if (!proceed) return;
    }

    setImporting(true);

    try {
      const token = sessionStorage.getItem('admin_token');

      // Filter out invalid rows
      const validData = preview.data.filter((_, index) => {
        const hasError = preview.errors.some(
          (err) => err.row === index + 2 // +2 for header and 0-index
        );
        return !hasError;
      });

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'tools',
          data: validData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Successfully imported ${result.imported} tool(s). ${result.skipped || 0} skipped.`
        );
        onImportComplete();
        handleClear();
      } else {
        toast.error(result.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import Tools from CSV</h2>
          <p className="text-gray-600 mt-1">
            Upload a CSV file to import multiple tools at once
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleDownloadTemplate}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* File Upload */}
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select CSV File
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    or drag and drop your CSV file here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-medium">{file.name}</span>
                  <button
                    onClick={handleClear}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Different File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600 mb-4" />
            <p className="text-gray-600">Parsing CSV file...</p>
          </CardContent>
        </Card>
      )}

      {preview && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600">Total Rows</div>
                <div className="text-2xl font-bold">{preview.data.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600">Valid Rows</div>
                <div className="text-2xl font-bold text-green-600">
                  {preview.validCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="text-sm text-gray-600">Errors</div>
                <div className="text-2xl font-bold text-red-600">
                  {preview.invalidCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Errors */}
          {preview.errors.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-600">
                    Validation Errors ({preview.errors.length})
                  </h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {preview.errors.slice(0, 20).map((error, index) => (
                    <div
                      key={index}
                      className="text-sm bg-red-50 border border-red-200 rounded px-3 py-2"
                    >
                      <span className="font-medium">Row {error.row}</span>
                      {' - '}
                      <span className="text-gray-700">{error.column}</span>
                      {': '}
                      <span className="text-red-700">{error.error}</span>
                    </div>
                  ))}
                  {preview.errors.length > 20 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      ... and {preview.errors.length - 20} more errors
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Table */}
          <Card>
            <CardContent className="py-4">
              <h3 className="font-semibold mb-3">Data Preview (first 5 rows)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Category</th>
                      <th className="text-left py-2 px-3">Pricing</th>
                      <th className="text-left py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.data.slice(0, 5).map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-3">{item.name}</td>
                        <td className="py-2 px-3">{item.category}</td>
                        <td className="py-2 px-3">{item.pricing_model}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              item.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.status || 'draft'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Import Button */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleClear}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing || preview.validCount === 0}
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>Import {preview.validCount} Tool(s)</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
