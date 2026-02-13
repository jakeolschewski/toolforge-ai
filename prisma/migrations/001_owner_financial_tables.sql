-- Owner Financial Dashboard Tables
-- Run this in your Supabase SQL editor

-- ============================================
-- Payouts Table
-- ============================================
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network VARCHAR(100) NOT NULL, -- e.g., 'Impact', 'ShareASale', 'CJ', 'Direct'
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  tool_name VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- pending, received, failed
  payment_method VARCHAR(100), -- e.g., 'PayPal', 'Bank Transfer', 'Stripe'
  transaction_id VARCHAR(255),
  reference_number VARCHAR(255),
  payment_date DATE,
  due_date DATE,
  received_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payouts_network ON payouts(network);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_payment_date ON payouts(payment_date);
CREATE INDEX idx_payouts_tool_id ON payouts(tool_id);

-- ============================================
-- Expenses Table
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL, -- e.g., 'Hosting', 'Domain', 'Software', 'Marketing', 'Development'
  subcategory VARCHAR(100),
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  expense_date DATE NOT NULL,
  payment_method VARCHAR(100),
  vendor VARCHAR(255),
  invoice_number VARCHAR(255),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_period VARCHAR(50), -- 'monthly', 'yearly', 'quarterly'
  is_tax_deductible BOOLEAN DEFAULT TRUE,
  tax_category VARCHAR(100),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_recurring ON expenses(is_recurring);

-- ============================================
-- Revenue Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100) NOT NULL, -- 'affiliate', 'membership', 'ads', 'sponsorship', 'other'
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  tool_name VARCHAR(255),
  network VARCHAR(100), -- affiliate network if applicable
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  commission_rate DECIMAL(5, 2), -- percentage
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  conversion_date DATE,
  payout_id UUID REFERENCES payouts(id) ON DELETE SET NULL,
  metadata JSONB, -- flexible storage for additional data
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_revenue_logs_source ON revenue_logs(source);
CREATE INDEX idx_revenue_logs_tool_id ON revenue_logs(tool_id);
CREATE INDEX idx_revenue_logs_date ON revenue_logs(conversion_date);
CREATE INDEX idx_revenue_logs_payout_id ON revenue_logs(payout_id);

-- ============================================
-- Financial Summary View
-- ============================================
CREATE OR REPLACE VIEW financial_summary AS
SELECT
  (SELECT COALESCE(SUM(amount), 0) FROM revenue_logs) AS total_revenue,
  (SELECT COALESCE(SUM(amount), 0) FROM revenue_logs WHERE conversion_date >= CURRENT_DATE - INTERVAL '30 days') AS revenue_last_30_days,
  (SELECT COALESCE(SUM(amount), 0) FROM revenue_logs WHERE conversion_date >= CURRENT_DATE - INTERVAL '7 days') AS revenue_last_7_days,
  (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS total_expenses,
  (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE expense_date >= CURRENT_DATE - INTERVAL '30 days') AS expenses_last_30_days,
  (SELECT COALESCE(SUM(amount), 0) FROM payouts WHERE status = 'pending') AS pending_payouts,
  (SELECT COALESCE(SUM(amount), 0) FROM payouts WHERE status = 'received') AS received_payouts,
  (SELECT COUNT(*) FROM payouts WHERE status = 'pending') AS pending_payout_count;

-- ============================================
-- Revenue by Tool View
-- ============================================
CREATE OR REPLACE VIEW revenue_by_tool AS
SELECT
  tool_id,
  tool_name,
  COUNT(*) AS transaction_count,
  SUM(amount) AS total_revenue,
  AVG(amount) AS avg_revenue,
  SUM(clicks) AS total_clicks,
  SUM(conversions) AS total_conversions,
  CASE
    WHEN SUM(clicks) > 0 THEN (SUM(conversions)::DECIMAL / SUM(clicks)) * 100
    ELSE 0
  END AS conversion_rate
FROM revenue_logs
WHERE tool_id IS NOT NULL
GROUP BY tool_id, tool_name
ORDER BY total_revenue DESC;

-- ============================================
-- Monthly Revenue Trend View
-- ============================================
CREATE OR REPLACE VIEW monthly_revenue_trend AS
SELECT
  DATE_TRUNC('month', conversion_date) AS month,
  source,
  COUNT(*) AS transaction_count,
  SUM(amount) AS revenue,
  SUM(clicks) AS clicks,
  SUM(conversions) AS conversions
FROM revenue_logs
WHERE conversion_date IS NOT NULL
GROUP BY DATE_TRUNC('month', conversion_date), source
ORDER BY month DESC, source;

-- ============================================
-- Expense Categories View
-- ============================================
CREATE OR REPLACE VIEW expense_categories AS
SELECT
  category,
  COUNT(*) AS expense_count,
  SUM(amount) AS total_amount,
  AVG(amount) AS avg_amount
FROM expenses
GROUP BY category
ORDER BY total_amount DESC;

-- ============================================
-- Update Timestamps Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_logs_updated_at BEFORE UPDATE ON revenue_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Audit Log Table (for financial changes)
-- ============================================
CREATE TABLE IF NOT EXISTS owner_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table ON owner_audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON owner_audit_logs(created_at);

-- ============================================
-- Comments
-- ============================================
COMMENT ON TABLE payouts IS 'Tracks affiliate and other payouts received from networks';
COMMENT ON TABLE expenses IS 'Tracks business expenses for tax and accounting purposes';
COMMENT ON TABLE revenue_logs IS 'Detailed revenue tracking by source, tool, and network';
COMMENT ON TABLE owner_audit_logs IS 'Audit log for all financial data changes';
