// Core Types for ToolForge AI

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  long_description?: string;
  category: string;
  subcategory?: string;
  website_url: string;
  affiliate_link?: string;
  logo_url?: string;
  screenshot_url?: string;
  pricing_model: 'free' | 'freemium' | 'paid' | 'subscription';
  starting_price?: string;
  features: string[];
  tags: string[];
  rating: number;
  review_count: number;
  is_sponsored: boolean;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Review {
  id: string;
  tool_id: string;
  title: string;
  content: string;
  pros_html?: string;
  cons_html?: string;
  verdict?: string;
  rating?: number;
  author: string;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  keywords: string[];
  read_time?: number;
  views: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  tool_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClickLog {
  id: string;
  tool_id: string;
  ip_hash?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export interface ScrapedSource {
  id: string;
  source_url: string;
  tool_name: string;
  tool_url?: string;
  description?: string;
  category?: string;
  raw_data?: string;
  status: 'pending' | 'processed' | 'ignored';
  processed_at?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  stripe_customer_id?: string;
  subscription_status?: 'active' | 'canceled' | 'past_due';
  subscription_plan?: 'free' | 'pro' | 'premium';
  created_at: string;
  updated_at: string;
}

// API Response Types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Scraper Types
export interface ScraperResult {
  tool_name: string;
  tool_url?: string;
  description?: string;
  category?: string;
  logo_url?: string;
  pricing_model?: string;
}

// Filter & Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ToolFilters extends PaginationParams {
  category?: string;
  pricing?: string;
  search?: string;
  featured?: boolean;
  sortBy?: 'newest' | 'rating' | 'popular' | 'name';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Owner Financial Dashboard Types
export interface Payout {
  id: string;
  network: string;
  tool_id?: string;
  tool_name?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'received' | 'failed';
  payment_method?: string;
  transaction_id?: string;
  reference_number?: string;
  payment_date?: string;
  due_date?: string;
  received_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  payment_method?: string;
  vendor?: string;
  invoice_number?: string;
  is_recurring: boolean;
  recurrence_period?: 'monthly' | 'yearly' | 'quarterly';
  is_tax_deductible: boolean;
  tax_category?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueLog {
  id: string;
  source: 'affiliate' | 'membership' | 'ads' | 'sponsorship' | 'other';
  tool_id?: string;
  tool_name?: string;
  network?: string;
  amount: number;
  currency: string;
  commission_rate?: number;
  clicks: number;
  conversions: number;
  conversion_date?: string;
  payout_id?: string;
  metadata?: Record<string, unknown>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialSummary {
  total_revenue: number;
  revenue_last_30_days: number;
  revenue_last_7_days: number;
  total_expenses: number;
  expenses_last_30_days: number;
  pending_payouts: number;
  received_payouts: number;
  pending_payout_count: number;
}

export interface RevenueByTool {
  tool_id: string;
  tool_name: string;
  transaction_count: number;
  total_revenue: number;
  avg_revenue: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
}

export interface MonthlyRevenueTrend {
  month: string;
  source: string;
  transaction_count: number;
  revenue: number;
  clicks: number;
  conversions: number;
}

export interface ExpenseCategory {
  category: string;
  expense_count: number;
  total_amount: number;
  avg_amount: number;
}

// Blog System Types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  featured_image?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  keywords: string[];
  views: number;
  read_time?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order_index: number;
  post_count: number;
  created_at: string;
  updated_at: string;
}

// Comparison System Types
export interface Comparison {
  id: string;
  slug: string;
  title: string;
  description?: string;
  tool_ids: string[];
  comparison_data: ComparisonData;
  winner_tool_id?: string;
  seo_title?: string;
  seo_description?: string;
  keywords: string[];
  views: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ComparisonData {
  features?: ComparisonFeature[];
  pricing?: ComparisonPricing[];
  pros_cons?: Record<string, { pros: string[]; cons: string[] }>;
  verdict?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ComparisonFeature {
  category: string;
  name: string;
  values: Record<string, string | boolean>; // tool_id -> value
}

export interface ComparisonPricing {
  tool_id: string;
  plan_name: string;
  price: string;
  features: string[];
  is_recommended?: boolean;
}

// Collections System Types
export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  tool_ids: string[];
  icon?: string;
  color?: string;
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  keywords: string[];
  views: number;
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// Analytics Dashboard Types
export interface DashboardMetrics {
  today_revenue: number;
  today_revenue_change: number;
  week_revenue: number;
  week_revenue_change: number;
  month_revenue: number;
  month_revenue_change: number;
  all_time_revenue: number;
  today_clicks: number;
  today_conversions: number;
  week_clicks: number;
  week_conversions: number;
  month_clicks: number;
  month_conversions: number;
  avg_conversion_rate: number;
  avg_order_value: number;
  epc: number; // earnings per click
}

export interface RevenueByProgram {
  program: string;
  revenue: number;
  conversions: number;
  clicks: number;
  percentage: number;
}

export interface ToolPerformanceMetrics {
  tool_id: string;
  tool_name: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number; // click-through rate
  conversion_rate: number;
  epc: number; // earnings per click
  avg_order_value: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  clicks: number;
  conversions: number;
  revenue: number;
  percentage: number;
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  drop_off?: number;
}

export interface GrowthTrend {
  date: string;
  revenue: number;
  clicks: number;
  conversions: number;
  views: number;
}

export interface RevenueGoal {
  id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  deadline?: string;
  is_active: boolean;
}

export interface Notification {
  id: string;
  type: 'goal_achieved' | 'viral_tool' | 'conversion_drop' | 'revenue_spike';
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// Workflow Vault Types - Simple aliases for compatibility with existing DB schema
// Re-export comprehensive types from vault.ts
export * from './vault';

// Legacy compatibility types (map to vault.ts types)
export type VaultWorkflow = import('./vault').Workflow;
export type VaultCategory = import('./vault').WorkflowCategory;
export type VaultPurchase = import('./vault').WorkflowPurchase;
export type VaultMembership = import('./vault').Membership;
export type VaultFavorite = {
  id: string;
  user_id: string;
  workflow_id: string;
  created_at: string;
};
export type VaultDownloadToken = {
  token: string;
  workflow_id: string;
  user_id: string;
  expires_at: string;
  downloads_remaining: number;
};
