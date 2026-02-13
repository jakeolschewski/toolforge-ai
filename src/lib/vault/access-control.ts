/**
 * Access Control System for Workflow Vault
 * Manages permissions and access verification
 */

import { supabaseAdmin } from '@/lib/supabase';

export enum AccessTier {
  FREE = 'free',
  STANDALONE = 'standalone',
  WITH_UPDATES = 'with_updates',
  MEMBER = 'member',
}

export interface AccessCheck {
  hasAccess: boolean;
  accessTier: Access Tier | null;
  expiresAt: Date | null;
  canDownload: boolean;
  downloadLimit: number | null;
  downloadsRemaining: number | null;
  purchaseId: string | null;
  restrictions: string[];
}

/**
 * Check if user has access to a workflow
 */
export async function checkWorkflowAccess(
  userId: string,
  workflowId: string
): Promise<AccessCheck> {
  // Default denied state
  const denied: AccessCheck = {
    hasAccess: false,
    accessTier: null,
    expiresAt: null,
    canDownload: false,
    downloadLimit: null,
    downloadsRemaining: null,
    purchaseId: null,
    restrictions: ['Purchase required to access this workflow'],
  };

  if (!userId) {
    return denied;
  }

  // 1. Check active membership (highest priority)
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (membership?.all_workflows_access) {
    const expiresAt = membership.current_period_end
      ? new Date(membership.current_period_end)
      : null;

    return {
      hasAccess: true,
      accessTier: AccessTier.MEMBER,
      expiresAt,
      canDownload: true,
      downloadLimit: null, // Unlimited
      downloadsRemaining: null,
      purchaseId: null,
      restrictions: [],
    };
  }

  // 2. Check direct purchase
  const { data: purchase } = await supabaseAdmin
    .from('workflow_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('workflow_id', workflowId)
    .eq('payment_status', 'completed')
    .single();

  if (!purchase) {
    return denied;
  }

  // 3. Check if access is granted
  if (!purchase.access_granted) {
    return {
      ...denied,
      restrictions: ['Access has been revoked. Contact support for assistance.'],
    };
  }

  // 4. Check expiration
  if (purchase.access_expires_at) {
    const expiresAt = new Date(purchase.access_expires_at);
    if (expiresAt < new Date()) {
      return {
        ...denied,
        restrictions: [
          `Access expired on ${expiresAt.toLocaleDateString()}. Renew to continue accessing.`,
        ],
      };
    }
  }

  // 5. Check download limits
  const downloadsRemaining = purchase.download_limit
    ? purchase.download_limit - purchase.downloads_used
    : null;

  const canDownload =
    !purchase.download_limit || (downloadsRemaining && downloadsRemaining > 0);

  const restrictions: string[] = [];
  if (!canDownload) {
    restrictions.push(
      `Download limit reached (${purchase.download_limit} downloads used). Contact support to request additional downloads.`
    );
  }

  return {
    hasAccess: true,
    accessTier: purchase.purchase_type as AccessTier,
    expiresAt: purchase.access_expires_at ? new Date(purchase.access_expires_at) : null,
    canDownload,
    downloadLimit: purchase.download_limit,
    downloadsRemaining,
    purchaseId: purchase.id,
    restrictions,
  };
}

/**
 * Verify user can perform an action on a workflow
 */
export async function verifyAction(
  userId: string,
  workflowId: string,
  action: 'view' | 'download' | 'share' | 'review'
): Promise<{ allowed: boolean; reason?: string }> {
  const access = await checkWorkflowAccess(userId, workflowId);

  switch (action) {
    case 'view':
      // Anyone can view workflow details (for marketing)
      return { allowed: true };

    case 'download':
      if (!access.hasAccess) {
        return {
          allowed: false,
          reason: 'Purchase required to download workflow files',
        };
      }
      if (!access.canDownload) {
        return {
          allowed: false,
          reason: access.restrictions[0] || 'Download not available',
        };
      }
      return { allowed: true };

    case 'share':
      // Anyone can share (helps with viral growth)
      return { allowed: true };

    case 'review':
      if (!access.hasAccess) {
        return {
          allowed: false,
          reason: 'Only customers can leave reviews',
        };
      }
      return { allowed: true };

    default:
      return { allowed: false, reason: 'Unknown action' };
  }
}

/**
 * Check if user has active membership
 */
export async function checkMembershipStatus(userId: string): Promise<{
  isActive: boolean;
  planType: string | null;
  expiresAt: Date | null;
  trialEndsAt: Date | null;
  benefits: string[];
}> {
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!membership) {
    return {
      isActive: false,
      planType: null,
      expiresAt: null,
      trialEndsAt: null,
      benefits: [],
    };
  }

  const benefits: string[] = [
    'Access to all 50 workflows',
    'Unlimited downloads',
    'Priority support',
  ];

  if (membership.receives_updates) {
    benefits.push('Lifetime workflow updates');
  }

  if (membership.early_access) {
    benefits.push('Early access to new workflows');
  }

  if (membership.custom_workflow_requests > 0) {
    benefits.push(`${membership.custom_workflow_requests} custom workflow requests`);
  }

  return {
    isActive: true,
    planType: membership.plan_type,
    expiresAt: membership.current_period_end
      ? new Date(membership.current_period_end)
      : null,
    trialEndsAt: membership.trial_end ? new Date(membership.trial_end) : null,
    benefits,
  };
}

/**
 * Grant temporary access (for promotions, trials, etc.)
 */
export async function grantTemporaryAccess(
  userId: string,
  workflowId: string,
  durationDays: number,
  reason: string
): Promise<{ success: boolean; purchaseId?: string; error?: string }> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const { data: purchase, error } = await supabaseAdmin
      .from('workflow_purchases')
      .insert({
        user_id: userId,
        workflow_id: workflowId,
        purchase_type: 'promotional',
        price_paid: 0,
        payment_status: 'completed',
        access_granted: true,
        access_expires_at: expiresAt,
        metadata: { reason, granted_at: new Date() },
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, purchaseId: purchase.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Revoke access (for refunds, violations, etc.)
 */
export async function revokeAccess(
  purchaseId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('workflow_purchases')
      .update({
        access_granted: false,
        payment_status: 'refunded',
        metadata: { revoked_at: new Date(), reason },
      })
      .eq('id', purchaseId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user's complete vault inventory
 */
export async function getUserVaultInventory(userId: string): Promise<{
  totalWorkflows: number;
  workflowsByTier: Record<string, number>;
  totalSpent: number;
  membership: any;
  recentPurchases: any[];
}> {
  // Get all purchases
  const { data: purchases } = await supabaseAdmin
    .from('workflow_purchases')
    .select('*, workflows(*)')
    .eq('user_id', userId)
    .eq('payment_status', 'completed')
    .order('purchased_at', { ascending: false });

  // Get membership
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .single();

  const workflowsByTier: Record<string, number> = {
    standalone: 0,
    with_updates: 0,
    member: membership?.status === 'active' ? 50 : 0, // All workflows if member
  };

  let totalSpent = 0;

  purchases?.forEach((p) => {
    workflowsByTier[p.purchase_type] = (workflowsByTier[p.purchase_type] || 0) + 1;
    totalSpent += p.price_paid;
  });

  return {
    totalWorkflows: membership?.status === 'active' ? 50 : (purchases?.length || 0),
    workflowsByTier,
    totalSpent,
    membership,
    recentPurchases: purchases?.slice(0, 5) || [],
  };
}
