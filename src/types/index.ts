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
  metadata?: Record<string, any>;
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
