/**
 * Test file to verify all vault imports work correctly
 * This file should compile without errors in a Next.js environment
 */

// Test type imports
import type {
  Workflow,
  WorkflowCategory,
  WorkflowPurchase,
  Membership,
  WEDGECategory,
  BusinessSystem,
  PricingTier,
} from '@/types/vault';

// Test constant imports
import {
  WEDGE_CATEGORIES,
  BUSINESS_SYSTEMS,
  PRICING_TIERS,
  formatPrice,
  calculateDiscountPercentage,
} from './constants';

// Test helper imports
import {
  isWorkflowFree,
  getWorkflowDisplayPrice,
  hasWorkflowAccess,
  sortWorkflows,
  filterWorkflows,
} from './helpers';

// Test validator imports
import {
  validateWorkflowInput,
  validateSlug,
  validatePrice,
} from './validators';

// Test that everything compiles
export function testImports() {
  console.log('All imports successful!');
  console.log('WEDGE Categories:', WEDGE_CATEGORIES.length);
  console.log('Business Systems:', BUSINESS_SYSTEMS.length);
  console.log('Pricing Tiers:', PRICING_TIERS.length);

  // Test formatPrice
  const price = formatPrice(4900);
  console.log('Formatted price:', price);

  return true;
}
