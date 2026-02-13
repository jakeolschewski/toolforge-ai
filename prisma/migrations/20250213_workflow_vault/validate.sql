-- ================================================
-- WORKFLOW VAULT SCHEMA VALIDATION SCRIPT
-- ================================================
-- Purpose: Validate that the migration was successful
-- Run this after executing migration.sql
-- ================================================

\echo '================================================'
\echo 'WORKFLOW VAULT SCHEMA VALIDATION'
\echo '================================================'

-- ================================================
-- 1. TABLE EXISTENCE CHECK
-- ================================================
\echo ''
\echo '1. Checking table existence...'

SELECT
  CASE
    WHEN COUNT(*) = 11 THEN '✅ All 11 tables created successfully'
    ELSE '❌ ERROR: Expected 11 tables, found ' || COUNT(*)::text
  END as table_check
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'workflow_categories',
    'workflows',
    'workflow_files',
    'memberships',
    'workflow_purchases',
    'workflow_downloads',
    'workflow_reviews',
    'workflow_updates',
    'workflow_bundles',
    'workflow_analytics',
    'workflow_favorites'
  );

-- ================================================
-- 2. SEED DATA CHECK
-- ================================================
\echo ''
\echo '2. Checking seed data (9 business systems)...'

SELECT
  CASE
    WHEN COUNT(*) = 9 THEN '✅ All 9 business systems seeded'
    ELSE '❌ ERROR: Expected 9 categories, found ' || COUNT(*)::text
  END as seed_check
FROM workflow_categories;

-- List the categories
SELECT
  order_index,
  icon,
  slug,
  name
FROM workflow_categories
ORDER BY order_index;

-- ================================================
-- 3. INDEX CHECK
-- ================================================
\echo ''
\echo '3. Checking indexes...'

SELECT
  schemaname,
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE 'workflow%' OR tablename = 'memberships'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- ================================================
-- 4. TRIGGER CHECK
-- ================================================
\echo ''
\echo '4. Checking triggers...'

SELECT
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (event_object_table LIKE 'workflow%' OR event_object_table = 'memberships')
ORDER BY event_object_table, trigger_name;

-- ================================================
-- 5. FUNCTION CHECK
-- ================================================
\echo ''
\echo '5. Checking custom functions...'

SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'update_updated_at_column',
    'increment_workflow_download_count',
    'update_workflow_rating',
    'update_category_workflow_count'
  )
ORDER BY routine_name;

-- ================================================
-- 6. VIEW CHECK
-- ================================================
\echo ''
\echo '6. Checking views...'

SELECT
  table_name as view_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'VIEW'
  AND table_name IN ('active_memberships', 'workflow_stats')
ORDER BY table_name;

-- ================================================
-- 7. RLS POLICY CHECK
-- ================================================
\echo ''
\echo '7. Checking Row Level Security policies...'

SELECT
  tablename,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ RLS enabled with ' || COUNT(*)::text || ' policies'
    ELSE '❌ WARNING: No RLS policies found'
  END as rls_status
FROM pg_policies
WHERE schemaname = 'public'
  AND (tablename LIKE 'workflow%' OR tablename = 'memberships')
GROUP BY tablename
ORDER BY tablename;

-- ================================================
-- 8. FOREIGN KEY CONSTRAINT CHECK
-- ================================================
\echo ''
\echo '8. Checking foreign key constraints...'

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND (tc.table_name LIKE 'workflow%' OR tc.table_name = 'memberships')
ORDER BY tc.table_name, kcu.column_name;

-- ================================================
-- 9. COLUMN DATA TYPE CHECK
-- ================================================
\echo ''
\echo '9. Checking critical column data types...'

SELECT
  table_name,
  column_name,
  data_type,
  CASE
    WHEN is_nullable = 'YES' THEN 'NULL'
    ELSE 'NOT NULL'
  END as nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'workflows'
  AND column_name IN (
    'id', 'slug', 'category_id', 'wedge_score',
    'pricing_tier', 'base_price', 'rating', 'status'
  )
ORDER BY ordinal_position;

-- ================================================
-- 10. UNIQUE CONSTRAINT CHECK
-- ================================================
\echo ''
\echo '10. Checking unique constraints...'

SELECT
  tc.table_name,
  STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as unique_columns,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
  AND (tc.table_name LIKE 'workflow%' OR tc.table_name = 'memberships')
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- ================================================
-- 11. TEST DATA INSERTION
-- ================================================
\echo ''
\echo '11. Testing sample data insertion...'

-- Test workflow insertion
DO $$
DECLARE
  v_category_id UUID;
  v_workflow_id UUID;
  v_user_id UUID;
BEGIN
  -- Get first category
  SELECT id INTO v_category_id FROM workflow_categories LIMIT 1;

  -- Get or create test user
  INSERT INTO users (email, name, role)
  VALUES ('test@workflow-vault.test', 'Test User', 'user')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_user_id;

  -- Create test workflow
  INSERT INTO workflows (
    slug,
    category_id,
    name,
    description,
    pricing_tier,
    base_price,
    is_free,
    wedge_score,
    workflow_complexity,
    status
  ) VALUES (
    'test-workflow-validation',
    v_category_id,
    'Test Workflow for Validation',
    'This is a test workflow to validate the schema',
    'free',
    0.00,
    true,
    8.5,
    'beginner',
    'published'
  ) ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name
  RETURNING id INTO v_workflow_id;

  -- Test file insertion
  INSERT INTO workflow_files (
    workflow_id,
    file_name,
    file_type,
    file_url,
    is_primary
  ) VALUES (
    v_workflow_id,
    'test-workflow.json',
    'json',
    'https://example.com/test.json',
    true
  ) ON CONFLICT DO NOTHING;

  -- Test download recording
  INSERT INTO workflow_downloads (
    user_id,
    workflow_id,
    download_type,
    ip_hash
  ) VALUES (
    v_user_id,
    v_workflow_id,
    'free',
    md5('127.0.0.1'::text)
  );

  RAISE NOTICE '✅ Test data insertion successful';
  RAISE NOTICE 'Test workflow ID: %', v_workflow_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Test data insertion failed: %', SQLERRM;
END $$;

-- ================================================
-- 12. TRIGGER FUNCTIONALITY TEST
-- ================================================
\echo ''
\echo '12. Testing trigger functionality...'

-- Check if download count was incremented
SELECT
  w.slug,
  w.download_count,
  CASE
    WHEN w.download_count > 0 THEN '✅ Download counter trigger working'
    ELSE '⚠️  Download counter may not be working'
  END as trigger_status
FROM workflows w
WHERE w.slug = 'test-workflow-validation';

-- Test category count trigger
SELECT
  wc.slug,
  wc.workflow_count,
  CASE
    WHEN wc.workflow_count > 0 THEN '✅ Category counter trigger working'
    ELSE '⚠️  Category counter may not be working'
  END as trigger_status
FROM workflow_categories wc
LIMIT 1;

-- ================================================
-- 13. VIEW FUNCTIONALITY TEST
-- ================================================
\echo ''
\echo '13. Testing view functionality...'

-- Test workflow_stats view
SELECT
  COUNT(*) as workflow_stats_count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ workflow_stats view working'
    ELSE '❌ workflow_stats view not working'
  END as view_status
FROM workflow_stats;

-- ================================================
-- 14. RLS POLICY TEST
-- ================================================
\echo ''
\echo '14. Testing RLS policies (requires auth context)...'

-- Check if RLS is enabled
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND (tablename LIKE 'workflow%' OR tablename = 'memberships')
ORDER BY tablename;

-- ================================================
-- VALIDATION SUMMARY
-- ================================================
\echo ''
\echo '================================================'
\echo 'VALIDATION SUMMARY'
\echo '================================================'

SELECT
  '✅ Tables' as component,
  (SELECT COUNT(*)::text FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_name IN (
       'workflow_categories', 'workflows', 'workflow_files',
       'memberships', 'workflow_purchases', 'workflow_downloads',
       'workflow_reviews', 'workflow_updates', 'workflow_bundles',
       'workflow_analytics', 'workflow_favorites'
     )) || ' / 11' as status

UNION ALL

SELECT
  '✅ Categories' as component,
  (SELECT COUNT(*)::text FROM workflow_categories) || ' / 9' as status

UNION ALL

SELECT
  '✅ Indexes' as component,
  (SELECT COUNT(*)::text FROM pg_indexes
   WHERE schemaname = 'public'
     AND (tablename LIKE 'workflow%' OR tablename = 'memberships')) || ' created' as status

UNION ALL

SELECT
  '✅ Triggers' as component,
  (SELECT COUNT(*)::text FROM information_schema.triggers
   WHERE trigger_schema = 'public'
     AND (event_object_table LIKE 'workflow%' OR event_object_table = 'memberships')) || ' active' as status

UNION ALL

SELECT
  '✅ Functions' as component,
  (SELECT COUNT(*)::text FROM information_schema.routines
   WHERE routine_schema = 'public'
     AND routine_name LIKE '%workflow%' OR routine_name LIKE '%membership%') || ' created' as status

UNION ALL

SELECT
  '✅ Views' as component,
  (SELECT COUNT(*)::text FROM information_schema.views
   WHERE table_schema = 'public'
     AND table_name IN ('active_memberships', 'workflow_stats')) || ' / 2' as status

UNION ALL

SELECT
  '✅ RLS Policies' as component,
  (SELECT COUNT(*)::text FROM pg_policies
   WHERE schemaname = 'public'
     AND (tablename LIKE 'workflow%' OR tablename = 'memberships')) || ' active' as status;

-- ================================================
-- CLEANUP TEST DATA (OPTIONAL)
-- ================================================
\echo ''
\echo 'To cleanup test data, run:'
\echo 'DELETE FROM workflows WHERE slug = ''test-workflow-validation'';'
\echo 'DELETE FROM users WHERE email = ''test@workflow-vault.test'';'

\echo ''
\echo '================================================'
\echo 'VALIDATION COMPLETE'
\echo '================================================'
\echo ''
\echo 'Next steps:'
\echo '1. Review any warnings or errors above'
\echo '2. Test RLS policies with actual user context'
\echo '3. Configure Stripe webhooks'
\echo '4. Set up file storage'
\echo '5. Create API endpoints'
\echo '6. Build frontend components'
\echo '================================================'
