-- ============================================
-- Owner Bank Accounts Table
-- ============================================
CREATE TABLE IF NOT EXISTS owner_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  account_number_last4 TEXT DEFAULT '',
  routing_number_last4 TEXT DEFAULT '',
  account_type TEXT DEFAULT 'checking',
  is_default BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_owner_bank_accounts_status ON owner_bank_accounts(status);
CREATE INDEX IF NOT EXISTS idx_owner_bank_accounts_default ON owner_bank_accounts(is_default);

COMMENT ON TABLE owner_bank_accounts IS 'Bank accounts for owner fund withdrawals';

-- ============================================
-- Owner Withdrawals Table
-- ============================================
CREATE TABLE IF NOT EXISTS owner_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  bank_account_id UUID REFERENCES owner_bank_accounts(id) ON DELETE SET NULL,
  bank_info TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  notes TEXT DEFAULT '',
  requested_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_owner_withdrawals_status ON owner_withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_owner_withdrawals_requested ON owner_withdrawals(requested_at);
CREATE INDEX IF NOT EXISTS idx_owner_withdrawals_bank ON owner_withdrawals(bank_account_id);

COMMENT ON TABLE owner_withdrawals IS 'Owner fund withdrawal requests and history';

-- ============================================
-- RLS Policies (service role gets full access)
-- ============================================
ALTER TABLE owner_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_role_full_access_bank
  ON owner_bank_accounts FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY service_role_full_access_withdrawals
  ON owner_withdrawals FOR ALL
  USING (true) WITH CHECK (true);

-- ============================================
-- Auto-update timestamps (uses existing function)
-- ============================================
CREATE TRIGGER update_owner_bank_accounts_updated_at
  BEFORE UPDATE ON owner_bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owner_withdrawals_updated_at
  BEFORE UPDATE ON owner_withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
