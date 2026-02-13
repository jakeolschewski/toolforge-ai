'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import WorkflowEditor from '@/components/admin/vault/WorkflowEditor';
import type { VaultWorkflow } from '@/types';

export default function NewWorkflowPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const emptyWorkflow: Partial<VaultWorkflow> = {
    title: '',
    slug: '',
    description: '',
    long_description: '',
    category_id: '',
    thumbnail_url: '',
    file_url: '',
    file_type: 'json',
    pricing_type: 'free',
    price: 0,
    currency: 'USD',
    tags: [],
    difficulty_level: 'beginner' as any,
    estimated_time: 0,
    requirements: [],
    features: [],
    use_cases: [],
    author: 'ToolForge Team',
    version: '1.0.0',
    status: 'draft' as any,
    is_featured: false,
    seo_title: '',
    seo_description: '',
    keywords: [],
  };

  const handleSave = async (workflow: Partial<VaultWorkflow>) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/vault/workflows', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Workflow created successfully');
        router.push('/admin/vault/workflows');
      } else {
        toast.error(data.error || 'Failed to create workflow');
      }
    } catch (error) {
      toast.error('Failed to create workflow');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/vault/workflows');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Workflow</h1>
        <p className="text-gray-600 mt-2">Add a new workflow to the vault</p>
      </div>

      <WorkflowEditor
        workflow={emptyWorkflow}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
