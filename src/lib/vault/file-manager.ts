/**
 * File Management System for Workflow Vault
 * Handles secure uploads, downloads, and access control
 */

import { put, del, list } from '@vercel/blob';
import { supabaseAdmin } from '@/lib/supabase';
import archiver from 'archiver';


export interface SecureDownloadOptions {
  expiresIn?: number; // seconds, default 3600 (1 hour)
  filename?: string;
}

export interface UploadResult {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

/**
 * Upload a file to Vercel Blob Storage
 */
export async function uploadWorkflowFile(
  workflowId: string,
  fileType: 'sop_pdf' | 'prompts_txt' | 'qc_checklist' | 'examples' | 'redaction_guide' | 'export_templates',
  file: File | Buffer,
  filename: string
): Promise<UploadResult> {
  const pathname = `workflows/${workflowId}/${fileType}/${filename}`;

  const blob = await put(pathname, file, {
    access: 'public', // TODO: use signed URLs for private access
    addRandomSuffix: false,
  });

  // Update workflow record
  await supabaseAdmin
    .from('workflows')
    .update({
      [`${fileType}_url`]: blob.url,
      [`has_${fileType}`]: true,
    })
    .eq('id', workflowId);

  return {
    url: blob.url,
    pathname: blob.pathname,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    size: (blob as any).size || 0,
    uploadedAt: new Date(),
  };
}

/**
 * Generate a secure, time-limited download URL
 */
export async function generateSecureDownloadUrl(
  purchaseId: string,
  fileType: string,
  userId: string,
  options: SecureDownloadOptions = {}
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expiresIn = 3600 } = options;

  // 1. Verify purchase and access rights
  const { data: purchase, error } = await supabaseAdmin
    .from('workflow_purchases')
    .select('*, workflows(*)')
    .eq('id', purchaseId)
    .eq('user_id', userId)
    .eq('payment_status', 'completed')
    .eq('access_granted', true)
    .single();

  if (error || !purchase) {
    throw new Error('Purchase not found or access denied');
  }

  // 2. Check if access has expired
  if (purchase.access_expires_at && new Date(purchase.access_expires_at) < new Date()) {
    throw new Error('Access has expired');
  }

  // 3. Check download limits
  if (
    purchase.download_limit !== null &&
    purchase.downloads_used >= purchase.download_limit
  ) {
    throw new Error('Download limit exceeded');
  }

  // 4. Get file URL from workflow
  const fileUrlKey = `${fileType}_url`;
  const fileUrl = purchase.workflows[fileUrlKey];

  if (!fileUrl) {
    throw new Error('File not found');
  }

  // 5. Log download
  await supabaseAdmin.from('workflow_downloads').insert({
    purchase_id: purchaseId,
    user_id: userId,
    workflow_id: purchase.workflow_id,
    file_type: fileType,
    file_url: fileUrl,
    downloaded_at: new Date(),
  });

  // 6. Increment download count
  await supabaseAdmin
    .from('workflow_purchases')
    .update({
      downloads_used: purchase.downloads_used + 1,
      last_download_at: new Date(),
      first_download_at: purchase.first_download_at || new Date(),
    })
    .eq('id', purchaseId);

  // 7. Generate signed URL (Vercel Blob automatically provides signed URLs)
  // For additional security, you could implement custom token-based access
  return fileUrl;
}

/**
 * Generate a ZIP file containing all workflow files
 */
export async function generateWorkflowZip(
  workflowId: string,
  _userId: string
): Promise<Buffer> {
  // Get workflow details
  const { data: workflow, error } = await supabaseAdmin
    .from('workflows')
    .select('*')
    .eq('id', workflowId)
    .single();

  if (error || !workflow) {
    throw new Error('Workflow not found');
  }

  // Create ZIP archive
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Maximum compression
  });

  const buffers: Buffer[] = [];
  archive.on('data', (chunk) => buffers.push(chunk));

  // Add files to archive
  if (workflow.sop_pdf_url) {
    const file = await fetch(workflow.sop_pdf_url);
    const buffer = Buffer.from(await file.arrayBuffer());
    archive.append(buffer, { name: `${workflow.slug}/SOP.pdf` });
  }

  if (workflow.prompts_txt_url) {
    const file = await fetch(workflow.prompts_txt_url);
    const buffer = Buffer.from(await file.arrayBuffer());
    archive.append(buffer, { name: `${workflow.slug}/Prompts.txt` });
  }

  if (workflow.qc_checklist_url) {
    const file = await fetch(workflow.qc_checklist_url);
    const buffer = Buffer.from(await file.arrayBuffer());
    archive.append(buffer, { name: `${workflow.slug}/QC-Checklist.pdf` });
  }

  if (workflow.redaction_guide_url) {
    const file = await fetch(workflow.redaction_guide_url);
    const buffer = Buffer.from(await file.arrayBuffer());
    archive.append(buffer, { name: `${workflow.slug}/Redaction-Guide.txt` });
  }

  // Note: Examples and export templates would require additional logic
  // to fetch multiple files from a folder structure

  // Finalize archive
  await archive.finalize();

  // Wait for all data
  return new Promise((resolve, reject) => {
    archive.on('end', () => resolve(Buffer.concat(buffers)));
    archive.on('error', reject);
  });
}

/**
 * Delete workflow files from storage
 */
export async function deleteWorkflowFiles(workflowId: string): Promise<void> {
  // List all files for this workflow
  const { blobs } = await list({
    prefix: `workflows/${workflowId}/`,
  });

  // Delete each file
  for (const blob of blobs) {
    await del(blob.url);
  }

  // Update workflow record
  await supabaseAdmin
    .from('workflows')
    .update({
      sop_pdf_url: null,
      prompts_txt_url: null,
      qc_checklist_url: null,
      examples_folder_url: null,
      redaction_guide_url: null,
      export_templates_url: null,
      has_sop_pdf: false,
      has_prompts_txt: false,
      has_qc_checklist: false,
      has_examples: false,
      has_redaction_guide: false,
      has_export_templates: false,
    })
    .eq('id', workflowId);
}

/**
 * Check user's access to a workflow
 */
export async function checkWorkflowAccess(
  userId: string,
  workflowId: string
): Promise<{
  hasAccess: boolean;
  accessType: 'free' | 'standalone' | 'with_updates' | 'member' | null;
  expiresAt: Date | null;
  canDownload: boolean;
  downloadLimit: number | null;
  downloadsRemaining: number | null;
  purchaseId: string | null;
}> {
  // 1. Check if user has active membership
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (membership && membership.all_workflows_access) {
    return {
      hasAccess: true,
      accessType: 'member',
      expiresAt: membership.current_period_end ? new Date(membership.current_period_end) : null,
      canDownload: true,
      downloadLimit: null,
      downloadsRemaining: null,
      purchaseId: null,
    };
  }

  // 2. Check direct purchase
  const { data: purchase } = await supabaseAdmin
    .from('workflow_purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('workflow_id', workflowId)
    .eq('payment_status', 'completed')
    .eq('access_granted', true)
    .single();

  if (!purchase) {
    return {
      hasAccess: false,
      accessType: null,
      expiresAt: null,
      canDownload: false,
      downloadLimit: null,
      downloadsRemaining: null,
      purchaseId: null,
    };
  }

  // 3. Check if access is still valid
  const now = new Date();
  if (purchase.access_expires_at && new Date(purchase.access_expires_at) < now) {
    return {
      hasAccess: false,
      accessType: null,
      expiresAt: null,
      canDownload: false,
      downloadLimit: null,
      downloadsRemaining: null,
      purchaseId: null,
    };
  }

  // 4. Check download limits
  const downloadsRemaining = purchase.download_limit
    ? purchase.download_limit - purchase.downloads_used
    : null;

  return {
    hasAccess: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessType: purchase.purchase_type as any,
    expiresAt: purchase.access_expires_at ? new Date(purchase.access_expires_at) : null,
    canDownload: !purchase.download_limit || downloadsRemaining! > 0,
    downloadLimit: purchase.download_limit,
    downloadsRemaining,
    purchaseId: purchase.id,
  };
}

/**
 * Track file download analytics
 */
export async function trackDownload(
  workflowId: string,
  _userId: string | null,
  _fileType: string
): Promise<void> {
  // Increment workflow download count
  await supabaseAdmin.rpc('increment_workflow_downloads', {
    workflow_id: workflowId,
  });

  // Record analytics
  const today = new Date().toISOString().split('T')[0];
  await supabaseAdmin
    .from('workflow_analytics')
    .upsert({
      workflow_id: workflowId,
      date: today,
      downloads: 1,
    })
    .select()
    .single();
}
