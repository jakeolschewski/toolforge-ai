// CSV Parsing and Generation Utilities

import type { Tool, Review } from '@/types';

export interface CSVColumn {
  key: string;
  label: string;
  required?: boolean;
  transform?: (value: string) => unknown;
}

export interface CSVValidationError {
  row: number;
  column: string;
  error: string;
}

export interface CSVParseResult<T> {
  data: T[];
  errors: CSVValidationError[];
}

/**
 * Parse CSV text into array of objects
 */
export function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        lines.push(currentRow);
        currentRow = [];
        currentCell = '';
      }
    } else {
      currentCell += char;
    }
  }

  // Add last cell and row if exists
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    lines.push(currentRow);
  }

  return lines;
}

/**
 * Convert array of objects to CSV string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCSV<T extends Record<string, any>>(
  data: T[],
  columns?: CSVColumn[]
): string {
  if (data.length === 0) {
    return '';
  }

  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Header row
  const header = cols.map(col => escapeCSVValue(col.label)).join(',');

  // Data rows
  const rows = data.map(item => {
    return cols
      .map(col => {
        const value = item[col.key];
        return escapeCSVValue(formatCSVValue(value));
      })
      .join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Escape CSV value (handle quotes and commas)
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format value for CSV output
 */
function formatCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.join('; ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Parse CSV with column mapping and validation
 */
export function parseCSVWithSchema<T>(
  csvText: string,
  columns: CSVColumn[]
): CSVParseResult<T> {
  const lines = parseCSV(csvText);

  if (lines.length === 0) {
    return { data: [], errors: [] };
  }

  const headers = lines[0];
  const errors: CSVValidationError[] = [];
  const data: T[] = [];

  // Validate required columns exist
  const requiredColumns = columns.filter(col => col.required);
  for (const col of requiredColumns) {
    if (!headers.includes(col.label) && !headers.includes(col.key)) {
      errors.push({
        row: 0,
        column: col.label,
        error: `Required column "${col.label}" not found`,
      });
    }
  }

  if (errors.length > 0) {
    return { data: [], errors };
  }

  // Create column mapping
  const columnMap = new Map<number, CSVColumn>();
  headers.forEach((header, index) => {
    const column = columns.find(
      col => col.label === header || col.key === header
    );
    if (column) {
      columnMap.set(index, column);
    }
  });

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const item: Record<string, unknown> = {};

    columnMap.forEach((column, index) => {
      const value = row[index] || '';

      try {
        if (column.transform) {
          item[column.key] = column.transform(value);
        } else {
          item[column.key] = value;
        }
      } catch (error) {
        errors.push({
          row: i + 1,
          column: column.label,
          error: `Invalid value: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    });

    // Check required fields
    for (const col of requiredColumns) {
      if (!item[col.key] || item[col.key] === '') {
        errors.push({
          row: i + 1,
          column: col.label,
          error: 'Required field is empty',
        });
      }
    }

    data.push(item as T);
  }

  return { data, errors };
}

/**
 * Generate tool CSV template
 */
export function generateToolCSVTemplate(): string {
  const columns: CSVColumn[] = [
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', required: true },
    { key: 'website_url', label: 'Website URL', required: true },
    { key: 'category', label: 'Category', required: true },
    { key: 'pricing_model', label: 'Pricing Model' },
    { key: 'starting_price', label: 'Starting Price' },
    { key: 'features', label: 'Features (semicolon separated)' },
    { key: 'tags', label: 'Tags (semicolon separated)' },
    { key: 'logo_url', label: 'Logo URL' },
    { key: 'affiliate_link', label: 'Affiliate Link' },
  ];

  const header = columns.map(col => escapeCSVValue(col.label)).join(',');
  const example = [
    'Example Tool',
    'A powerful AI tool for productivity',
    'https://example.com',
    'AI Tools',
    'freemium',
    '$9.99/month',
    'Feature 1; Feature 2; Feature 3',
    'ai; productivity; automation',
    'https://example.com/logo.png',
    'https://example.com?ref=toolforge',
  ].map(escapeCSVValue).join(',');

  return [header, example].join('\n');
}

/**
 * Tool-specific CSV columns
 */
export const toolCSVColumns: CSVColumn[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'description', label: 'Description', required: true },
  { key: 'website_url', label: 'Website URL', required: true },
  { key: 'category', label: 'Category', required: true },
  {
    key: 'pricing_model',
    label: 'Pricing Model',
    transform: (value) => {
      const valid = ['free', 'freemium', 'paid', 'subscription'];
      if (!valid.includes(value.toLowerCase())) {
        throw new Error(`Must be one of: ${valid.join(', ')}`);
      }
      return value.toLowerCase();
    }
  },
  { key: 'starting_price', label: 'Starting Price' },
  {
    key: 'features',
    label: 'Features (semicolon separated)',
    transform: (value) => value ? value.split(';').map(s => s.trim()).filter(Boolean) : []
  },
  {
    key: 'tags',
    label: 'Tags (semicolon separated)',
    transform: (value) => value ? value.split(';').map(s => s.trim()).filter(Boolean) : []
  },
  { key: 'logo_url', label: 'Logo URL' },
  { key: 'affiliate_link', label: 'Affiliate Link' },
  {
    key: 'is_featured',
    label: 'Featured',
    transform: (value) => value.toLowerCase() === 'true' || value === '1'
  },
  {
    key: 'status',
    label: 'Status',
    transform: (value) => {
      const valid = ['draft', 'published', 'archived'];
      const status = value.toLowerCase();
      if (!valid.includes(status)) {
        throw new Error(`Must be one of: ${valid.join(', ')}`);
      }
      return status;
    }
  },
];

/**
 * Review-specific CSV columns
 */
export const reviewCSVColumns: CSVColumn[] = [
  { key: 'tool_id', label: 'Tool ID', required: true },
  { key: 'title', label: 'Title', required: true },
  { key: 'content', label: 'Content', required: true },
  { key: 'rating', label: 'Rating', transform: (v) => parseFloat(v) || 0 },
  { key: 'author', label: 'Author' },
  { key: 'verdict', label: 'Verdict' },
  {
    key: 'keywords',
    label: 'Keywords (semicolon separated)',
    transform: (value) => value ? value.split(';').map(s => s.trim()).filter(Boolean) : []
  },
  {
    key: 'status',
    label: 'Status',
    transform: (value) => value.toLowerCase() || 'draft'
  },
];

/**
 * Export tools to CSV
 */
export function exportToolsToCSV(tools: Tool[]): string {
  const columns: CSVColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Description' },
    { key: 'website_url', label: 'Website URL' },
    { key: 'category', label: 'Category' },
    { key: 'pricing_model', label: 'Pricing Model' },
    { key: 'starting_price', label: 'Starting Price' },
    { key: 'rating', label: 'Rating' },
    { key: 'review_count', label: 'Review Count' },
    { key: 'views', label: 'Views' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'is_featured', label: 'Featured' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
    { key: 'published_at', label: 'Published At' },
  ];

  return toCSV(tools, columns);
}

/**
 * Export reviews to CSV
 */
export function exportReviewsToCSV(reviews: Review[]): string {
  const columns: CSVColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'tool_id', label: 'Tool ID' },
    { key: 'title', label: 'Title' },
    { key: 'rating', label: 'Rating' },
    { key: 'author', label: 'Author' },
    { key: 'status', label: 'Status' },
    { key: 'views', label: 'Views' },
    { key: 'read_time', label: 'Read Time' },
    { key: 'created_at', label: 'Created At' },
    { key: 'published_at', label: 'Published At' },
  ];

  return toCSV(reviews, columns);
}
